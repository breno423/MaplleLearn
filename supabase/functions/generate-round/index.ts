
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    try {
      if (req.method !== "POST") {
        return Response.json(
          { error: "Método não permitido." },
          { status: 405 }
        );
      }

      const userId = ctx.userClaims?.id;

      if (!userId) {
        return Response.json(
          { error: "Usuário não autenticado." },
          { status: 401 }
        );
      }

      const { match_id } = await req.json();

      if (!match_id || typeof match_id !== "string") {
        return Response.json(
          { error: "ID da partida inválido." },
          { status: 400 }
        );
      }

      // Consulta usando o cliente protegido pelas políticas RLS.
      const { data: match, error } = await ctx.supabase
        .from("matches")
        .select(`
          id,
          player_one_id,
          player_two_id,
          player_one_language,
          player_two_language,
          current_player_id,
          current_round,
          current_difficulty,
          status
        `)
        .eq("id", match_id)
        .maybeSingle();

      if (error) {
        console.error("Erro ao consultar partida:", error);

        return Response.json(
          { error: "Não foi possível consultar a partida." },
          { status: 500 }
        );
      }

      if (!match) {
        return Response.json(
          { error: "Partida não encontrada." },
          { status: 404 }
        );
      }

      if (
        match.player_one_id !== userId &&
        match.player_two_id !== userId
      ) {
        return Response.json(
          { error: "Você não participa desta partida." },
          { status: 403 }
        );
      }

      if (match.status !== "in_progress") {
        return Response.json(
          { error: "Esta partida não está em andamento." },
          { status: 400 }
        );
      }

      if (match.current_player_id !== userId) {
        return Response.json(
          { error: "Ainda não é sua vez de jogar." },
          { status: 403 }
        );
      }


const geminiApiKey = Deno.env.get("GEMINI_API_KEY");

if (!geminiApiKey) {
  throw new Error("GEMINI_API_KEY não configurada.");
}

// Descobre o idioma escolhido pelo jogador atual.
const targetLanguage =
  match.player_one_id === userId
    ? match.player_one_language
    : match.player_two_language;

if (!targetLanguage) {
  return Response.json(
    { error: "Você ainda não escolheu seu idioma." },
    { status: 400 }
  );
}

const languageName =
  targetLanguage === "fr" ? "francês" : "inglês";

const difficulty = match.current_difficulty;

// Recupera as últimas frases para evitar repetições na partida.
const { data: previousRounds, error: historyError } = await ctx.supabase
  .from("match_rounds")
  .select("original_text")
  .eq("match_id", match_id)
  .order("round_number", { ascending: false })
  .limit(8);

if (historyError) {
  console.error("Erro ao consultar histórico:", historyError);
}

const recentPhrases = (previousRounds ?? [])
  .map((round) => round.original_text)
  .filter(Boolean);

// Temas possíveis para diversificar os desafios.
const topics = [
  "tecnologia, inteligência artificial e inovação",
  "trabalho, carreira e ambiente profissional",
  "faculdade, estudos e desenvolvimento pessoal",
  "viagens, turismo e experiências culturais",
  "amizade, relacionamentos e situações sociais",
  "esportes, saúde e qualidade de vida",
  "negócios, dinheiro e empreendedorismo",
  "cinema, música, livros e entretenimento",
  "meio ambiente e sustentabilidade",
  "problemas cotidianos e tomada de decisões",
  "planos para o futuro e experiências passadas",
  "opiniões, debates e situações hipotéticas",
  "restaurantes, alimentação e vida cotidiana",
  "internet, redes sociais e comunicação",
];

const selectedTopic = topics[
  Math.floor(Math.random() * topics.length)
];

const difficultyInstructions = {
  beginner: `
- Use vocabulário frequente e estruturas fundamentais.
- Explore presente simples, perguntas básicas, negativas,
  verbos comuns, adjetivos e preposições.
- As frases devem ter aproximadamente 5 a 12 palavras.
- Evite construções muito complexas.
  `,

  intermediate: `
- Utilize vocabulário mais diversificado e expressões naturais.
- Explore passado, futuro, comparações, conectores,
  verbos modais e orações subordinadas.
- Inclua situações que exijam interpretação de contexto.
- As frases devem ter aproximadamente 9 a 18 palavras.
  `,

  advanced: `
- Utilize vocabulário rico, expressões idiomáticas e nuances.
- Explore condicionais, voz passiva, tempos compostos,
  discurso indireto e estruturas subordinadas.
- Inclua argumentos, hipóteses, opiniões e situações profissionais.
- As frases devem ter aproximadamente 12 a 25 palavras.
  `,
};

const prompt = `
Você é o professor responsável por criar desafios de tradução
para uma plataforma profissional de aprendizagem de idiomas.

MISSÃO:
Crie exatamente uma frase original em português brasileiro
para o estudante traduzir para ${languageName}.

TEMA DESTA RODADA:
${selectedTopic}

NÍVEL DO ESTUDANTE:
${difficulty}

ORIENTAÇÕES PARA O NÍVEL:
${difficultyInstructions[difficulty as keyof typeof difficultyInstructions]}

VARIEDADE OBRIGATÓRIA:
- Não use sempre frases sobre alimentação ou rotina matinal.
- Explore situações reais, interessantes e diferentes.
- Alterne entre perguntas, afirmações, negativas e hipóteses.
- Varie pessoas, tempos verbais e construções gramaticais.
- Não transforme todos os desafios em frases no presente.
- Crie frases que ensinem algo útil ao estudante.
- Não use frases artificiais apenas para testar gramática.

HISTÓRICO RECENTE DA PARTIDA:
${recentPhrases.length > 0
  ? recentPhrases.map((phrase, index) => `${index + 1}. ${phrase}`).join("\n")
  : "Nenhuma frase anterior."}

REGRAS DE ORIGINALIDADE:
- Não repita nenhuma frase do histórico.
- Evite repetir o mesmo contexto, assunto ou estrutura gramatical.
- Escolha uma situação diferente das rodadas anteriores.
- Não mencione o tema escolhido explicitamente na resposta.

REGRAS DE QUALIDADE:
- A frase original deve ser natural em português brasileiro.
- Deve possuir uma tradução válida e natural em ${languageName}.
- Evite ambiguidades que prejudiquem a avaliação.
- Não inclua a tradução na frase original.
- A tradução de referência deve preservar o significado.
- A orientação de avaliação deve aceitar construções alternativas
  semanticamente corretas.

Responda exclusivamente em JSON:
{
  "original_text": "Frase em português brasileiro",
  "reference_answer": "Tradução natural em ${languageName}",
  "evaluation_guide": "Critérios específicos para avaliar esta frase"
}
`;

const geminiResponse = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": geminiApiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
  responseMimeType: "application/json",
  temperature: 0.9,
  maxOutputTokens: 256,
},
    }),
  }
);

if (!geminiResponse.ok) {
  const errorDetails = await geminiResponse.text();

  console.error("Erro Gemini:", errorDetails);

  return Response.json(
    { error: "Não foi possível gerar a frase." },
    { status: 502 }
  );
}

const geminiData = await geminiResponse.json();

const generatedText =
  geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

if (!generatedText) {
  throw new Error("O Gemini não retornou uma resposta válida.");
}

const generatedRound = JSON.parse(generatedText);

if (
  typeof generatedRound.original_text !== "string" ||
  !generatedRound.original_text.trim() ||
  typeof generatedRound.reference_answer !== "string" ||
  !generatedRound.reference_answer.trim() ||
  typeof generatedRound.evaluation_guide !== "string" ||
  !generatedRound.evaluation_guide.trim()
) {
  throw new Error("O formato da resposta do Gemini é inválido.");
}

// Nesta etapa, devolvemos somente a frase ao frontend.
// A resposta de referência permanece no servidor.
// Salva a rodada no Supabase usando permissões administrativas.
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Configuração do Supabase não encontrada.");
}

const saveResponse = await fetch(
  `${supabaseUrl}/rest/v1/rpc/save_generated_round`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": serviceRoleKey,
      "Authorization": `Bearer ${serviceRoleKey}`,
    },
    body: JSON.stringify({
      p_match_id: match.id,
      p_player_id: userId,
      p_original_text: generatedRound.original_text,
      p_target_language: targetLanguage,
      p_difficulty: difficulty,
      p_reference_answer: generatedRound.reference_answer,
      p_evaluation_guide: generatedRound.evaluation_guide,
    }),
  }
);

if (!saveResponse.ok) {
  const saveError = await saveResponse.text();

  console.error("Erro ao salvar rodada:", saveError);

  throw new Error("Não foi possível salvar a rodada no banco.");
}

const savedRound = await saveResponse.json();

// A resposta de referência nunca é enviada ao frontend.
return Response.json({
  success: true,
  round_id: savedRound.round_id,
  round_number: savedRound.round_number,
  original_text: generatedRound.original_text,
  target_language: targetLanguage,
  difficulty,
});

    } catch (error) {
      console.error("Erro na generate-round:", error);

      return Response.json(
        { error: "Erro interno ao processar a solicitação." },
        { status: 500 }
      );
    }
  }),

  
};
