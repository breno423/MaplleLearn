
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

const prompt = `
Você é responsável por criar desafios de tradução para um jogo de idiomas.

Crie exatamente uma frase em português brasileiro para o jogador traduzir para ${languageName}.

Nível: ${difficulty}.

Regras:
- A frase deve ser natural e adequada ao nível informado.
- Use situações cotidianas.
- Não inclua a tradução na frase original.
- Evite frases ambíguas.
- A resposta de referência deve ser uma tradução natural e correta.
- A explicação deve orientar a avaliação sem exigir palavras idênticas.

Responda exclusivamente em JSON neste formato:
{
  "original_text": "frase em português",
  "reference_answer": "tradução esperada",
  "evaluation_guide": "orientação para avaliar a tradução"
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
        temperature: 0.7,
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
