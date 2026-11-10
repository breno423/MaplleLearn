-- MaplleLearn | dicas de IA em duelos
-- Requer as tabelas existentes matches, match_rounds e match_answers.
-- Executar no SQL Editor do Supabase antes de publicar a Edge Function.

create table if not exists public.match_round_hints (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  round_id uuid not null references public.match_rounds(id) on delete cascade,
  player_id uuid not null,
  level text not null check (level in ('simple', 'medium', 'extreme')),
  penalty_points smallint not null check (penalty_points in (1, 3, 5)),
  hint_text text not null check (char_length(hint_text) between 10 and 600),
  created_at timestamptz not null default now(),
  constraint match_round_hints_one_per_round unique (round_id),
  constraint match_round_hints_level_matches_penalty check (
    (level = 'simple' and penalty_points = 1) or
    (level = 'medium' and penalty_points = 3) or
    (level = 'extreme' and penalty_points = 5)
  )
);

create index if not exists match_round_hints_match_player_idx
  on public.match_round_hints (match_id, player_id);

alter table public.match_round_hints enable row level security;

-- O texto da dica fica visível apenas para quem a pediu.
-- O adversário recebe SOMENTE a pontuação agregada pela RPC abaixo.
drop policy if exists match_round_hints_select_own on public.match_round_hints;
create policy match_round_hints_select_own
  on public.match_round_hints for select to authenticated
  using (player_id = (select auth.uid()));

revoke all on table public.match_round_hints from anon, authenticated;
grant select on table public.match_round_hints to authenticated;
grant all on table public.match_round_hints to service_role;

-- Confere o estado da rodada DENTRO da transação que registra a dica.
-- FOR UPDATE impede competir com uma submissão simultânea da resposta.
create or replace function public.validate_match_round_hint()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  state record;
begin
  select
    r.player_id,
    r.status as round_status,
    r.answer_submitted_at,
    r.round_number,
    m.status as match_status,
    m.current_round,
    m.response_deadline_at
  into state
  from public.match_rounds r
  join public.matches m on m.id = r.match_id
  where r.id = new.round_id and r.match_id = new.match_id
  for update of r;

  if not found or state.player_id is distinct from new.player_id then
    raise exception 'Rodada não pertence ao jogador informado.' using errcode = '23514';
  end if;

  if state.match_status <> 'in_progress'
     or state.round_status <> 'pending'
     or state.round_number <> state.current_round
     or state.answer_submitted_at is not null
     or state.response_deadline_at is null
     or state.response_deadline_at <= now() then
    raise exception 'A rodada não permite mais solicitar dica.' using errcode = '23514';
  end if;

  return new;
end;
$$;

revoke all on function public.validate_match_round_hint() from public, anon, authenticated;

drop trigger if exists trg_validate_match_round_hint on public.match_round_hints;
create trigger trg_validate_match_round_hint
before insert on public.match_round_hints
for each row execute function public.validate_match_round_hint();

-- O placar desconta a dica da pontuação TOTAL, mesmo se houver timeout.
-- Não modifica score bruto (0 a 10) da correção nem mexe nas RPCs existentes.
create or replace function public.get_match_scores(p_match_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_match public.matches%rowtype;
  v_one numeric;
  v_two numeric;
begin
  select * into v_match
  from public.matches where id = p_match_id;

  if not found or (
    (select auth.uid()) is distinct from v_match.player_one_id
    and (select auth.uid()) is distinct from v_match.player_two_id
  ) then
    raise exception 'Partida não encontrada ou acesso negado.' using errcode = '42501';
  end if;

  select
    coalesce((
      select sum(a.score) from public.match_answers a
      join public.match_rounds r on r.id = a.round_id
      where r.match_id = p_match_id and a.player_id = v_match.player_one_id
    ), 0) - coalesce((
      select sum(h.penalty_points) from public.match_round_hints h
      where h.match_id = p_match_id and h.player_id = v_match.player_one_id
    ), 0)
  into v_one;

  select
    coalesce((
      select sum(a.score) from public.match_answers a
      join public.match_rounds r on r.id = a.round_id
      where r.match_id = p_match_id and a.player_id = v_match.player_two_id
    ), 0) - coalesce((
      select sum(h.penalty_points) from public.match_round_hints h
      where h.match_id = p_match_id and h.player_id = v_match.player_two_id
    ), 0)
  into v_two;

  return jsonb_build_object(
    'player_one_id', v_match.player_one_id,
    'player_two_id', v_match.player_two_id,
    'player_one_score', v_one,
    'player_two_score', v_two
  );
end;
$$;

revoke all on function public.get_match_scores(uuid) from public, anon;
grant execute on function public.get_match_scores(uuid) to authenticated;
