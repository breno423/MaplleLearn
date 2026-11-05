
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

      if (typeof match_id !== "string") {
        return Response.json(
          { error: "ID da partida inválido." },
          { status: 400 }
        );
      }

      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const serviceRoleKey = Deno.env.get(
        "SUPABASE_SERVICE_ROLE_KEY"
      );

      if (!supabaseUrl || !serviceRoleKey) {
        throw new Error("Configuração do servidor incompleta.");
      }

      // 1. Consulta a partida.
      const { data: match, error: matchError } =
        await ctx.supabase
          .from("matches")
          .select(`
            id,
            player_one_id,
            player_two_id,
            current_round,
            response_deadline_at,
            status
          `)
          .eq("id", match_id)
          .maybeSingle();

      if (matchError || !match) {
        return Response.json(
          { error: "Partida não encontrada." },
          { status: 404 }
        );
      }

      // 2. Valida participação.
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
          { error: "A partida não está em andamento." },
          { status: 400 }
        );
      }

      // 3. Verifica o prazo.
      if (!match.response_deadline_at) {
        return Response.json(
          { error: "O cronômetro ainda não foi iniciado." },
          { status: 400 }
        );
      }

      if (Date.now() < Date.parse(match.response_deadline_at)) {
        return Response.json(
          { error: "O tempo de resposta ainda não terminou." },
          { status: 400 }
        );
      }

      // 4. Busca perguntas pendentes e seus registros de envio.
      const roundsUrl = new URL(
        `${supabaseUrl}/rest/v1/match_rounds`
      );

      roundsUrl.search = new URLSearchParams({
        match_id: `eq.${match_id}`,
        round_number: `eq.${match.current_round}`,
        status: "eq.pending",
        select: "id,player_id,answer_submitted_at,submitted_answer"
      }).toString();

      const roundsResponse = await fetch(roundsUrl, {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      });

      if (!roundsResponse.ok) {
        throw new Error(
          "Não foi possível consultar as perguntas pendentes."
        );
      }

      const pendingRounds = await roundsResponse.json();

      const processed = [];
      const skipped = [];
      const awaitingEvaluation = [];

      // 5. Processa individualmente cada jogador.
      for (const round of pendingRounds) {

        // Já enviou: não pode receber timeout.
        if (round.answer_submitted_at) {
          awaitingEvaluation.push({
            round_id: round.id,
            player_id: round.player_id,
          });

          continue;
        }

        const timeoutResponse = await fetch(
          `${supabaseUrl}/rest/v1/rpc/save_match_timeout`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: serviceRoleKey,
              Authorization: `Bearer ${serviceRoleKey}`,
            },
            body: JSON.stringify({
              p_match_id: match_id,
              p_round_id: round.id,
              p_player_id: round.player_id,
            }),
          }
        );

        if (timeoutResponse.ok) {
          const result = await timeoutResponse.json();
          processed.push(result);
          continue;
        }

        // Verifica se outra operação já finalizou a pergunta.
        const answerUrl = new URL(
          `${supabaseUrl}/rest/v1/match_answers`
        );

        answerUrl.search = new URLSearchParams({
          round_id: `eq.${round.id}`,
          select: "id"
        }).toString();

        const answerResponse = await fetch(answerUrl, {
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
          },
        });

        if (!answerResponse.ok) {
          throw new Error(
            "Não foi possível verificar o estado da resposta."
          );
        }

        const existingAnswers = await answerResponse.json();

        if (existingAnswers.length > 0) {
          skipped.push(round.id);
          continue;
        }

        const details = await timeoutResponse.text();

        console.error(
          "[process-timeouts] Erro ao registrar timeout:",
          details
        );

        throw new Error(
          "Não foi possível registrar o timeout."
        );
      }

      return Response.json({
        success: true,
        processed_count: processed.length,
        skipped_count: skipped.length,
        awaiting_evaluation_count: awaitingEvaluation.length,
        processed,
        skipped,
        awaiting_evaluation: awaitingEvaluation,
      });

    } catch (error) {
      console.error("[process-timeouts] Erro:", error);

      return Response.json(
        { error: "Erro ao processar os timeouts." },
        { status: 500 }
      );
    }
  }),
};
