
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    try {
      console.log("[generate-round] Iniciando execução");

      if (req.method !== "POST") {
        console.error("[generate-round] Método não permitido:", req.method);

        return Response.json(
          { error: "Método não permitido." },
          { status: 405 }
        );
      }

      const userId = ctx.userClaims?.id;

      if (!userId) {
        console.error("[generate-round] Usuário não autenticado");

        return Response.json(
          { error: "Usuário não autenticado." },
          { status: 401 }
        );
      }

      console.log("[generate-round] Usuário autenticado:", userId);

      const { match_id } = await req.json();

      if (!match_id || typeof match_id !== "string") {
        console.error("[generate-round] ID da partida inválido:", match_id);

        return Response.json(
          { error: "ID da partida inválido." },
          { status: 400 }
        );
      }

      console.log("[generate-round] Consultando partida:", match_id);

      const { data: match, error } = await ctx.supabase
        .from("matches")
        .select(`
          id,
          player_one_id,
          player_two_id,
          player_one_language,
          player_two_language,
          current_round,
          current_difficulty,
          status
        `)
        .eq("id", match_id)
        .maybeSingle();

      if (error) {
        console.error("[generate-round] Erro ao consultar partida:", error);

        return Response.json(
          { error: "Não foi possível consultar a partida." },
          { status: 500 }
        );
      }

      if (!match) {
        console.error("[generate-round] Partida não encontrada");

        return Response.json(
          { error: "Partida não encontrada." },
          { status: 404 }
        );
      }

      console.log("[generate-round] Partida encontrada:", {
        id: match.id,
        status: match.status,
        current_round: match.current_round,
        current_difficulty: match.current_difficulty,
      });

      if (
        match.player_one_id !== userId &&
        match.player_two_id !== userId
      ) {
        console.error("[generate-round] Usuário não participa da partida");

        return Response.json(
          { error: "Você não participa desta partida." },
          { status: 403 }
        );
      }

      if (match.status !== "in_progress") {
        console.error("[generate-round] Partida não está em andamento");

        return Response.json(
          { error: "Esta partida não está em andamento." },
          { status: 400 }
        );
      }

      const geminiApiKey = Deno.env.get("GEMINI_API_KEY");

      if (!geminiApiKey) {
        console.error("[generate-round] GEMINI_API_KEY não configurada");
        throw new Error("GEMINI_API_KEY não configurada.");
      }

      const targetLanguage =
        match.player_one_id === userId
          ? match.player_one_language
          : match.player_two_language;

      if (!targetLanguage) {
        console.error("[generate-round] Idioma não selecionado");

        return Response.json(
          { error: "Você ainda não escolheu seu idioma." },
          { status: 400 }
        );
      }

      const languageName =
        targetLanguage === "fr" ? "francês" : "inglês";

      const difficulty = match.current_difficulty;

      console.log("[generate-round] Configurações da rodada:", {
        targetLanguage,
        difficulty,
      });

      console.log("[generate-round] Consultando histórico");

      const {
        data: previousRounds,
        error: historyError,
      } = await ctx.supabase
        .from("match_rounds")
        .select("original_text")
        .eq("match_id", match_id)
        .order("round_number", { ascending: false })
        .limit(8);

      if (historyError) {
        console.error(
          "[generate-round] Erro ao consultar histórico:",
          historyError
        );
      }

      const recentPhrases = (previousRounds ?? [])
        .map((round) => round.original_text)
        .filter(Boolean);

      console.log("[generate-round] Histórico recuperado:", {
        quantidade: recentPhrases.length,
        erro: historyError?.message ?? null,
      });

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
- Seja objetivo: cada campo deve conter apenas o necessário.
- "original_text": uma única frase, sem explicações.
- "reference_answer": somente a tradução natural.
- "evaluation_guide": no máximo 2 frases curtas com critérios essenciais.

FORMATO DE RESPOSTA OBRIGATÓRIO:

Retorne somente um objeto JSON válido.
Não utilize Markdown.
Não utilize blocos de código.
Não escreva introduções ou explicações fora do JSON.
Utilize aspas duplas em todas as chaves e strings.
Não inclua vírgulas após o último campo.

Estrutura obrigatória:
{
  "original_text": "Frase em português brasileiro",
  "reference_answer": "Tradução natural",
  "evaluation_guide": "Critérios específicos de avaliação"
}
      `;

      console.log("[generate-round] Enviando prompt ao Gemini:", {
        model: "gemini-3.8-flash",
        difficulty,
        targetLanguage,
        topic: selectedTopic,
      });

      const generationStartedAt = Date.now();

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
              maxOutputTokens: 1200,

              // O Gemini estava gastando muitos tokens no raciocínio interno.
              // "low" reduz esse custo para uma tarefa simples de geração de frase.
              thinkingConfig: {
                thinkingLevel: "low",
              },
            },
          }),
        }
      );

      console.log("[generate-round] Status Gemini:", {
        status: geminiResponse.status,
        duration_ms: Date.now() - generationStartedAt,
      });

      if (!geminiResponse.ok) {
        const errorDetails = await geminiResponse.text();

        console.error("[generate-round] Erro Gemini:", errorDetails);

        return Response.json(
          { error: "Não foi possível gerar a frase." },
          { status: 502 }
        );
      }

      const geminiData = await geminiResponse.json();

      const candidate = geminiData.candidates?.[0];

console.log("[generate-round] Finalização Gemini:", {
  finishReason: candidate?.finishReason,
  usageMetadata: geminiData.usageMetadata,
});

if (candidate?.finishReason === "MAX_TOKENS") {
  throw new Error(
    "O Gemini atingiu o limite de tokens antes de concluir a resposta."
  );
}

      if (candidate?.finishReason && candidate.finishReason !== "STOP") {
        console.error("[generate-round] Finalização inesperada do Gemini:", {
          finishReason: candidate.finishReason,
          usageMetadata: geminiData.usageMetadata,
        });
      }

      console.log("[generate-round] Resposta do Gemini recebida");

      const generatedText = geminiData.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text ?? "")
        .join("")
        .trim();

      if (!generatedText) {
        console.error(
          "[generate-round] Resposta inesperada do Gemini:",
          JSON.stringify(geminiData)
        );

        throw new Error("O Gemini não retornou um texto válido.");
      }

      let generatedRound;

try {
  // Remove possíveis blocos Markdown adicionados pelo modelo.
  const cleanedText = generatedText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  generatedRound = JSON.parse(cleanedText);

} catch (parseError) {
  console.error("[generate-round] JSON inválido retornado pelo Gemini:", {
    generatedText,
    error: parseError instanceof Error
      ? parseError.message
      : String(parseError),
  });

  throw new Error("O Gemini retornou um JSON inválido.");
}

      if (
        typeof generatedRound.original_text !== "string" ||
        !generatedRound.original_text.trim() ||
        typeof generatedRound.reference_answer !== "string" ||
        !generatedRound.reference_answer.trim() ||
        typeof generatedRound.evaluation_guide !== "string" ||
        !generatedRound.evaluation_guide.trim()
      ) {
        console.error(
          "[generate-round] Formato inválido:",
          generatedRound
        );

        throw new Error("O formato da resposta do Gemini é inválido.");
      }

      console.log("[generate-round] Frase gerada e validada");

      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

      if (!supabaseUrl || !serviceRoleKey) {
        console.error(
          "[generate-round] Configuração administrativa do Supabase ausente"
        );

        throw new Error("Configuração do Supabase não encontrada.");
      }

      console.log("[generate-round] Salvando rodada no Supabase");

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

      console.log("[generate-round] Status da gravação:", saveResponse.status);

      if (!saveResponse.ok) {
        const saveError = await saveResponse.text();

        console.error("[generate-round] Erro ao salvar rodada:", saveError);

        throw new Error("Não foi possível salvar a rodada no banco.");
      }

      const savedRound = await saveResponse.json();

      console.log("[generate-round] Rodada salva:", {
        round_id: savedRound.round_id,
        round_number: savedRound.round_number,
      });

      console.log("[generate-round] Execução concluída com sucesso");

      return Response.json({
  success: true,
  round_id: savedRound.round_id,
  round_number: savedRound.round_number,
  original_text: generatedRound.original_text,
  target_language: targetLanguage,
  difficulty,

  // Sincronização da rodada compartilhada
  round_ready: savedRound.round_ready,
  response_deadline_at: savedRound.response_deadline_at,
});

    } catch (error) {
      console.error("[generate-round] ERRO INTERNO:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : null,
      });

      return Response.json(
        { error: "Erro interno ao processar a solicitação." },
        { status: 500 }
      );
    }
  }),
};