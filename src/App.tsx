import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  Sparkles,
  Globe2,
  Plus,
  Users,
  DoorOpen,
  Copy,
  Crown,
  Gamepad2,
  UserRound,
  Github,
  Camera,
  ChevronDown,
  LogOut,
  Save,
  X,
} from 'lucide-react';
import { supabase } from './lib/supabase';
import './App.css';
import FriendsPanel from './components/friends/FriendsPanel';

function Maplle() {
  return (
    <svg
      className="maplle"
      viewBox="0 0 360 360"
      role="img"
      aria-label="Maplle, mascote do FrenchOS"
    >
      <defs>
        <radialGradient id="orb" cx="34%" cy="24%" r="75%">
          <stop stopColor="#e7d9ff" />
          <stop offset=".32" stopColor="#a98be8" />
          <stop offset=".72" stopColor="#65469d" />
          <stop offset="1" stopColor="#302044" />
        </radialGradient>
        <linearGradient id="coat" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#383044" />
          <stop offset="1" stopColor="#111019" />
        </linearGradient>
        <linearGradient id="hat" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#393044" />
          <stop offset="1" stopColor="#100d18" />
        </linearGradient>
      </defs>

      {/* Partículas de brilho */}
      <g fill="#d8c3ff">
        <path d="M42 105l5 13 13 5-13 5-5 13-5-13-13-5 13-5z" />
        <path d="M300 55l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" />
        <circle cx="300" cy="230" r="4" />
        <circle cx="64" cy="260" r="3" />
      </g>

      {/* Braços e Capa */}
      <path
        d="M103 235Q67 242 56 213Q48 195 64 185Q79 176 88 196L111 214M258 230Q295 236 306 205Q313 187 297 178Q281 170 273 190L251 211"
        fill="none"
        stroke="#17131f"
        strokeWidth="18"
        strokeLinecap="round"
      />
      <path
        d="M58 184q-10-8-17 2q-5 8 3 15q9 8 18-1M298 177q10-8 17 2q5 8-3 15q-9 8-18-1"
        fill="#9c7bd4"
        stroke="#21172f"
        strokeWidth="5"
      />
      <path
        d="M111 222Q180 188 249 222L277 316Q180 345 83 316Z"
        fill="url(#coat)"
        stroke="#100d18"
        strokeWidth="5"
      />

      {/* Traje */}
      <path d="M153 215l27 23 27-23 16 100h-86z" fill="#eee8f8" />
      <path
        d="M164 233l16 11 16-11-7 22 7 55h-32l7-55z"
        fill="#b58ce9"
      />
      <circle cx="180" cy="246" r="7" fill="#f2c66d" />
      <circle cx="180" cy="278" r="5" fill="#f2c66d" />

      {/* Cabeça e Olhos */}
      <circle
        cx="180"
        cy="151"
        r="91"
        fill="url(#orb)"
        stroke="#241a35"
        strokeWidth="7"
      />
      <ellipse
        cx="148"
        cy="102"
        rx="25"
        ry="12"
        fill="#fff"
        opacity=".22"
        transform="rotate(-28 148 102)"
      />
      <path
        d="M143 150q12-13 25 0M193 150q12-13 25 0"
        fill="none"
        stroke="#21172f"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <ellipse cx="154" cy="161" rx="4" ry="6" fill="#21172f" />
      <ellipse cx="205" cy="161" rx="4" ry="6" fill="#21172f" />
      <path
        d="M166 180q14 13 28 0"
        fill="none"
        stroke="#21172f"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Chapéu */}
      <path
        d="M118 73Q180 48 242 73L232 93H128Z"
        fill="url(#hat)"
        stroke="#100d18"
        strokeWidth="5"
      />
      <path
        d="M144 68L151 19Q180 5 209 19L216 68Z"
        fill="url(#hat)"
        stroke="#100d18"
        strokeWidth="5"
      />
      <path d="M148 52H212L214 65H146Z" fill="#b58ce9" />
      <path
        d="M119 76Q180 61 241 76"
        fill="none"
        stroke="#f2c66d"
        strokeWidth="5"
      />
      <circle cx="180" cy="19" r="5" fill="#f2c66d" />
    </svg>
  );
}

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [screen, setScreen] = useState<
    'login' | 'rooms' | 'lobby' | 'profile' | 'match' | 'friends'
  >('login');
  const [profileReturnScreen, setProfileReturnScreen] = useState<
    'rooms' | 'lobby' | 'match'
  >('rooms');
  const [profile, setProfile] = useState<{
    display_name: string;
    avatar_url: string | null;
    username: string;
  }>({
    display_name: 'Jogador',
    avatar_url: null,
    username: '',
  });

  const [profileName, setProfileName] = useState('Jogador');
  const [profileUsername, setProfileUsername] = useState('');
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileNotice, setProfileNotice] = useState('');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const [roomCode, setRoomCode] = useState('');
  const [activeCode, setActiveCode] = useState('');
  const [activeMatchId, setActiveMatchId] = useState('');
  const [matchLanguage, setMatchLanguage] = useState<'fr' | 'en' | null>(null);
  const [opponentLanguage, setOpponentLanguage] = useState<'fr' | 'en' | null>(null);
  const [languagesReady, setLanguagesReady] = useState(false);
  const [languageLoading, setLanguageLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeRoomId, setActiveRoomId] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [currentPlayerId, setCurrentPlayerId] = useState('');
  const isMyTurn = currentPlayerId === currentUserId;
  const [hostId, setHostId] = useState('');
  const [members, setMembers] = useState<
    {
      user_id: string;
      display_name: string;
      is_ready: boolean;
      joined_at: string;
      avatar_url: string | null;
    }[]
  >([]);
  const [roomStatus, setRoomStatus] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [isReady, setIsReady] = useState(false);
  const [activeRoundId, setActiveRoundId] = useState('');
  const [roundNumber, setRoundNumber] = useState(0);
  const timeoutTriggeredRef = useRef<string | null>(null);
  const [originalText, setOriginalText] = useState('');

  // Estado compartilhado da partida
  const [currentRound, setCurrentRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(5);
  const [responseDeadlineAt, setResponseDeadlineAt] = useState<string | null>(null);
  const [roundReady, setRoundReady] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  const [userAnswer, setUserAnswer] = useState('');
  const [roundLoading, setRoundLoading] = useState(false);
  const [answerLoading, setAnswerLoading] = useState(false);
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [roundCompleted, setRoundCompleted] = useState(false);

  const [roundEvaluation, setRoundEvaluation] = useState<{
    is_correct: boolean;
    score: number;
    corrected_answer: string;
    feedback: string;
    grammar_explanation: string;
    alternative_translations: string[];
    was_timeout?: boolean;
  } | null>(null);

  const [nextPlayerId, setNextPlayerId] = useState('');
  const [matchFinished, setMatchFinished] = useState(false);

  async function loadUserProfile(user: {
    id: string;
    email?: string;
    user_metadata?: Record<string, any>;
  }) {

    const metadata = user.user_metadata ?? {};

    const providerName = String(
      metadata.full_name ??
      metadata.name ??
      metadata.user_name ??
      metadata.preferred_username ??
      ''
    ).trim();

    const providerAvatar = String(
      metadata.avatar_url ??
      metadata.picture ??
      metadata.avatar ??
      ''
    ).trim();

    const { data: existing, error } = await supabase
      .from('profiles')
      .select('display_name, avatar_url, username')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      setNotice('Não foi possível carregar seu perfil.');
      return;
    }

    if (!existing) {
      const initialProfile = {
        id: user.id,
        display_name: providerName || 'Jogador',
        avatar_url: providerAvatar || null,
        username: null,
      };

      const { error: insertError } = await supabase
        .from('profiles')
        .insert(initialProfile);

      if (insertError) {
        setNotice('Não foi possível criar seu perfil.');
        return;
      }

      setProfile({
        display_name: initialProfile.display_name,
        avatar_url: initialProfile.avatar_url,
        username: '',
      });

      setProfileName(initialProfile.display_name);

      setProfileUsername('');

      return;
    }

    const currentProfile = {
      display_name: existing.display_name || providerName || 'Jogador',
      avatar_url: existing.avatar_url || providerAvatar || null,
      username: existing.username || '',
    };

    // Preenche dados ausentes, mas preserva personalizações existentes.
    if (!existing.display_name || (!existing.avatar_url && providerAvatar)) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update(currentProfile)
        .eq('id', user.id);

      if (updateError) {
        setNotice('Não foi possível atualizar seu perfil.');
        return;
      }
    }

    setProfile(currentProfile);
    setProfileName(currentProfile.display_name);
    setProfileUsername(currentProfile.username);
  }

  useEffect(() => {
    if (screen !== 'lobby' || !activeRoomId || !currentUserId) {
      return;
    }

    refreshLobby(activeRoomId);

    const interval = setInterval(() => {
      refreshLobby(activeRoomId);
    }, 2000);

    return () => clearInterval(interval);
  }, [screen, activeRoomId, currentUserId]);


useEffect(() => {
  if (screen !== 'match' || !activeRoomId || !currentUserId) {
    return;
  }

  let cancelled = false;

  async function loadActiveMatch() {
    const { data: match, error } = await supabase
      .from('matches')
      .select(`
        id,
        player_one_id,
        player_two_id,
        player_one_language,
        player_two_language,
        current_round,
        total_rounds,
        response_deadline_at,
        status
      `)
      .eq('room_id', activeRoomId)
      .maybeSingle();

    if (cancelled) return;

    if (error || !match) {
      console.error('Erro ao recuperar partida:', error);
      return;
    }

    setActiveMatchId(match.id);

    const isPlayerOne = match.player_one_id === currentUserId;

    const myLanguage = isPlayerOne
      ? match.player_one_language
      : match.player_two_language;

    const otherLanguage = isPlayerOne
      ? match.player_two_language
      : match.player_one_language;

    setMatchLanguage(myLanguage);
    setOpponentLanguage(otherLanguage);

    setLanguagesReady(
      Boolean(match.player_one_language && match.player_two_language)
    );

    setCurrentRound(match.current_round);
    setTotalRounds(match.total_rounds);
    setResponseDeadlineAt(match.response_deadline_at);
    setRoundReady(Boolean(match.response_deadline_at));
    setMatchFinished(match.status === 'completed');
  }

  loadActiveMatch();

  return () => {
    cancelled = true;
  };
}, [screen, activeRoomId, currentUserId]);


  useEffect(() => {
    if (
      screen !== 'match' ||
      !activeMatchId ||
      !currentUserId ||
      currentRound <= 0
    ) {
      return;
    }

    let cancelled = false;

    async function loadRoundProgress() {
      const { data, error } = await supabase
        .from('match_answers')
        .select(`
        player_id,
        user_answer,
        is_correct,
        score,
        corrected_answer,
        feedback,
        grammar_explanation,
        alternative_translations,
        was_timeout,
        match_rounds!inner (
          match_id,
          round_number
        )
      `)
        .eq('match_rounds.match_id', activeMatchId)
        .eq('match_rounds.round_number', currentRound);

      if (error) {
        console.error('Erro ao carregar progresso da rodada:', error);
        return;
      }

      if (cancelled || !data) return;

      // Atualiza as pontuações acumuladas da partida.
      const { data: allAnswers, error: scoreError } = await supabase
        .from('match_answers')
        .select(`
        player_id,
        score,
        match_rounds!inner (
          match_id
        )
      `)
        .eq('match_rounds.match_id', activeMatchId);

      if (scoreError) {
        console.error('Erro ao atualizar pontuação:', scoreError);
      } else if (!cancelled && allAnswers) {
        let ownTotal = 0;
        let opponentTotal = 0;

        allAnswers.forEach((answer) => {
          if (answer.player_id === currentUserId) {
            ownTotal += answer.score;
          } else {
            opponentTotal += answer.score;
          }
        });

        setMyScore(ownTotal);
        setOpponentScore(opponentTotal);
      }

      if (cancelled) return;

      // A rodada só termina quando existem duas respostas.
      setRoundCompleted(data.length >= 2);

      // Recupera o feedback próprio, inclusive em caso de timeout.
      const ownAnswer = data.find(
        (answer) => answer.player_id === currentUserId
      );

      if (ownAnswer) {
        setRoundEvaluation({
          is_correct: ownAnswer.is_correct,
          score: ownAnswer.score,
          corrected_answer: ownAnswer.corrected_answer ?? '',
          feedback: ownAnswer.feedback ?? '',
          grammar_explanation: ownAnswer.grammar_explanation ?? '',
          alternative_translations:
            ownAnswer.alternative_translations ?? [],
          was_timeout: ownAnswer.was_timeout,
        });

        if (ownAnswer.was_timeout) {
          setUserAnswer('');
        }
      }
    }

    loadRoundProgress();

    const channel = supabase
      .channel(`match-progress-${activeMatchId}-${currentRound}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'match_answers',
        },
        () => {
          void loadRoundProgress();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${activeMatchId}`,
        },
        () => {
          void loadRoundProgress();
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [screen, activeMatchId, currentUserId, currentRound]);

  useEffect(() => {
    if (
      screen !== 'match' ||
      !activeMatchId ||
      !responseDeadlineAt
    ) {
      setRemainingSeconds(null);
      return;
    }

    const deadline = new Date(responseDeadlineAt).getTime();

    if (!Number.isFinite(deadline)) {
      console.error('Prazo da rodada inválido:', responseDeadlineAt);
      return;
    }

    const timeoutKey = `${activeMatchId}:${currentRound}:${responseDeadlineAt}`;

    const updateCountdown = () => {
      const seconds = Math.max(
        0,
        Math.ceil((deadline - Date.now()) / 1000)
      );

      setRemainingSeconds(seconds);

      if (
        seconds === 0 &&
        timeoutTriggeredRef.current !== timeoutKey
      ) {
        // Impede chamadas duplicadas para esta rodada.
        timeoutTriggeredRef.current = timeoutKey;

        console.log('[match] Prazo encerrado. Processando timeouts.');

        void (async () => {
          const { data, error } = await supabase.functions.invoke(
            'process-timeouts',
            {
              body: {
                match_id: activeMatchId,
              },
            }
          );

          if (error) {
            console.error(
              '[match] Erro ao processar timeouts:',
              error
            );

            setNotice('Não foi possível processar o encerramento do tempo.');
            return;
          }

          console.log('[match] Timeouts processados:', data);
        })();
      }
    };

    updateCountdown();

    const interval = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(interval);
  }, [
    screen,
    activeMatchId,
    currentRound,
    responseDeadlineAt,
  ]);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        setNotice('Não foi possível verificar sua sessão.');
        return;
      }

      if (!data.session) return;

      const user = data.session.user;

      setCurrentUserId(user.id);
      await loadUserProfile(user);

      if (!mounted) return;

      // Verifica se o usuário ainda pertence a uma sala.
      const { data: membership, error: membershipError } = await supabase
        .from('room_members')
        .select('room_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!mounted) return;

      if (membershipError) {
        console.error('Erro ao recuperar sala:', membershipError);
        setScreen('rooms');
        return;
      }

      if (membership?.room_id) {
        const { data: room, error: roomError } = await supabase
          .from('rooms')
          .select('id, code, status, host_id')
          .eq('id', membership.room_id)
          .maybeSingle();

        if (!mounted) return;

        if (!roomError && room && room.status !== 'finished') {
          setActiveRoomId(room.id);
          setActiveCode(room.code);
          setHostId(room.host_id);
          setRoomStatus(room.status);

          setScreen(
            room.status === 'playing'
              ? 'match'
              : 'lobby'
          );

          return;
        }
      }

      setScreen('rooms');
    }


    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setCurrentUserId('');
        setActiveRoomId('');
        setActiveCode('');
        setHostId('');
        setMembers([]);
        setIsReady(false);
        setRoomStatus('waiting');

        setProfile({
          display_name: 'Jogador',
          avatar_url: null,
          username: '',
        });

        setProfileName('Jogador');
        setProfileMenuOpen(false);
        setScreen('login');
        setMode('login');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    function resetLoading() {
      if (document.visibilityState === 'visible') {
        setLoading(false);
      }
    }

    window.addEventListener('pageshow', resetLoading);
    window.addEventListener('focus', resetLoading);
    document.addEventListener('visibilitychange', resetLoading);

    return () => {
      window.removeEventListener('pageshow', resetLoading);
      window.removeEventListener('focus', resetLoading);
      document.removeEventListener('visibilitychange', resetLoading);
    };
  }, []);


  function continueAfterEvaluation() {
    setRoundEvaluation(null);
    setActiveRoundId('');
    setOriginalText('');
    setUserAnswer('');
    setNextPlayerId('');
    setRoundReady(false);
    setRoundCompleted(false);
    setResponseDeadlineAt(null);
    setRemainingSeconds(null);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNotice('');

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setNotice('Digite um e-mail válido para continuar.');
      return;
    }

    if (password.length < 6) {
      setNotice('Sua senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setNotice('Digite seu nome para continuar.');
        return;
      }

      if (password !== confirmPassword) {
        setNotice('As senhas não coincidem.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: {
              display_name: name.trim(),
            },
          },
        });

        if (error) throw error;

        if (data.session) {
          setScreen('rooms');
          setNotice('');
        } else {
          setNotice(
            'Conta criada! Verifique seu e-mail para confirmar o cadastro antes de entrar.'
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (error) throw error;

        setScreen('rooms');
        setNotice('');
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Ocorreu um erro na autenticação.';

      setNotice(message);
    } finally {
      setLoading(false);
    }
  }

  async function generateRound() {
    if (!activeMatchId || roundLoading || matchFinished) return;

    setRoundLoading(true);
    setNotice('');
    setRoundCompleted(false);
    setRoundEvaluation(null);
    setUserAnswer('');
    setActiveRoundId('');
    setOriginalText('');
    setRoundReady(false);
    setResponseDeadlineAt(null);
    setRemainingSeconds(null);
    try {
      const { data, error } = await supabase.functions.invoke(
        'generate-round',
        {
          body: { match_id: activeMatchId },
        }
      );

      if (error) {
        let details = null;

        if (error.context instanceof Response) {
          details = await error.context.clone().text();
        }

        console.error('Erro detalhado ao gerar rodada:', {
          message: error.message,
          details,
        });

        throw error;
      }
      if (!data?.success || !data?.round_id || !data?.original_text) {
        throw new Error('Não foi possível carregar a rodada.');
      }

      setActiveRoundId(data.round_id);
      setRoundNumber(data.round_number);
      setOriginalText(data.original_text);

      setRoundReady(Boolean(data.round_ready));
      setResponseDeadlineAt(data.response_deadline_at ?? null);

      console.log('Estado de sincronização:', {
        round_ready: data.round_ready,
        response_deadline_at: data.response_deadline_at,
      });

      console.log('Rodada carregada:', data);
    } catch (error) {
      console.error('Erro ao gerar rodada:', error);

      setNotice(
        error instanceof Error
          ? error.message
          : 'Não foi possível gerar a frase.'
      );
    } finally {
      setRoundLoading(false);
    }
  }


  async function submitAnswer() {
    if (
      !activeMatchId ||
      !activeRoundId ||
      !userAnswer.trim() ||
      answerLoading ||
      roundEvaluation
    ) {
      return;
    }

    setAnswerLoading(true);
    setNotice('');

    try {
      const { data, error } = await supabase.functions.invoke(
        'evaluate-answer',
        {
          body: {
            match_id: activeMatchId,
            round_id: activeRoundId,
            user_answer: userAnswer.trim(),
          },
        }
      );

      if (error) {
        const context = (error as any).context;

        if (context instanceof Response) {
          const details = await context.clone().json().catch(() => null);

          throw new Error(
            details?.error || 'Não foi possível avaliar sua resposta.'
          );
        }

        throw error;
      }

      if (!data?.success || !data?.evaluation) {
        throw new Error('A avaliação retornou um resultado inválido.');
      }

      // Guarda o feedback antes de qualquer atualização da interface.
      setRoundEvaluation(data.evaluation);
      setRoundCompleted(Boolean(data.round_completed));
      setMatchFinished(Boolean(data.match_finished));

      console.log('Avaliação recebida:', data);

    } catch (error) {
      console.error('Erro ao enviar resposta:', error);

      setNotice(
        error instanceof Error
          ? error.message
          : 'Não foi possível enviar sua resposta.'
      );
    } finally {
      setAnswerLoading(false);
    }
  }


  async function saveProfile() {
    if (!currentUserId) return;

    const trimmedName = profileName.trim();

    if (!trimmedName) {
      setProfileNotice('Digite um nome para continuar.');
      return;
    }

    if (trimmedName.length > 30) {
      setProfileNotice('O nome deve ter no máximo 30 caracteres.');
      return;
    }

    const normalizedUsername = profileUsername.trim().toLowerCase();

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(normalizedUsername)) {
      setProfileNotice(
        'O username deve ter entre 3 e 20 caracteres, usando apenas letras, números e _.'
      );
      return;
    }

    if (profileFile && !profileFile.type.startsWith('image/')) {
      setProfileNotice('Selecione um arquivo de imagem válido.');
      return;
    }

    if (profileFile && profileFile.size > 5 * 1024 * 1024) {
      setProfileNotice('A imagem deve ter no máximo 5 MB.');
      return;
    }

    setProfileSaving(true);
    setProfileNotice('');

    try {
      let avatarUrl = profile.avatar_url;

      if (profileFile) {
        const extension = profileFile.name.split('.').pop() || 'jpg';
        const filePath = `${currentUserId}/${Date.now()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, profileFile, {
            upsert: true,
            contentType: profileFile.type,
          });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        avatarUrl = data.publicUrl;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: trimmedName,
          avatar_url: avatarUrl,
          username: normalizedUsername,
        })
        .eq('id', currentUserId);

      if (error) throw error;

      setProfile({
        display_name: trimmedName,
        avatar_url: avatarUrl,
        username: normalizedUsername,
      });

      setProfileFile(null);
      setProfileNotice('Perfil atualizado com sucesso!');
    } catch (error) {
      if (error instanceof Error && error.message.includes('23505')) {
        setProfileNotice('Esse username já está sendo utilizado.');
      } else if (
        error instanceof Error &&
        error.message.includes('profiles_username_format')
      ) {
        setProfileNotice('Formato de username inválido.');
      } else {
        setProfileNotice(
          error instanceof Error
            ? error.message
            : 'Não foi possível salvar seu perfil.'
        );
      }
    } finally {
      setProfileSaving(false);
    }
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setNotice('Não foi possível sair da conta.');
    }
  }


  async function createRoom() {
    setLoading(true);
    setNotice('');

    try {
      const { data, error } = await supabase.rpc('create_room');

      if (error) throw error;

      const room = data as { room_id: string; code: string };

      setActiveRoomId(room.room_id);
      setActiveCode(room.code);

      // O usuário que criou a sala é o anfitrião.
      setHostId(currentUserId);

      setIsReady(false);
      setMembers([]);
      setRoomStatus('waiting');

      setScreen('lobby');

      // Carrega os membros imediatamente.
      await refreshLobby(room.room_id);

    } catch (error) {
      console.error('Erro ao criar sala:', error);

      setNotice(
        error instanceof Error
          ? error.message
          : 'Não foi possível criar a sala.'
      );
    } finally {
      setLoading(false);
    }
  }

  async function joinRoom(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const code = roomCode.trim().toUpperCase();

    if (!/^FR-[A-Z0-9]{4}$/.test(code)) {
      setNotice('Digite um código válido. Exemplo: FR-8K29');
      return;
    }

    setLoading(true);
    setNotice('');

    try {
      const { data, error } = await supabase.rpc('join_room', {
        p_code: code,
      });

      if (error) throw error;

      const room = data as { room_id: string; code: string };

      setActiveRoomId(room.room_id);
      setActiveCode(room.code);
      setIsReady(false);
      setMembers([]);
      setRoomStatus('waiting');
      setScreen('lobby');

      // Carrega os dois jogadores imediatamente.
      await refreshLobby(room.room_id);
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : 'Não foi possível entrar na sala.'
      );
    } finally {
      setLoading(false);
    }
  }

  async function refreshLobby(roomId?: string) {
    const targetRoomId = roomId || activeRoomId;

    if (!targetRoomId) return;

    // Atualiza os jogadores
    const { data: players, error } = await supabase.rpc(
      'get_room_members',
      { p_room_id: targetRoomId }
    );

    if (error) {
      console.error('Erro ao carregar jogadores:', error.message);
      return;
    }

    setMembers(players || []);

    const myMembership = (players || []).find(
      (player: {
        user_id: string;
        is_ready: boolean;
      }) => player.user_id === currentUserId
    );

    setIsReady(myMembership?.is_ready ?? false);

    // Consulta o status atual da sala
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('status')
      .eq('id', targetRoomId)
      .maybeSingle();

    if (roomError) {
      console.error('Erro ao consultar status da sala:', roomError.message);
      return;
    }

    if (room) {
      setRoomStatus(room.status);

      if (room.status === 'playing') {
        setScreen('match');
      }
    }
  }

  async function toggleReady() {
    if (!activeRoomId) return;

    const { error } = await supabase.rpc('set_room_ready', {
      p_room_id: activeRoomId,
      p_is_ready: !isReady,
    });

    if (error) {
      console.error('Erro ao definir pronto:', error.message);
      setNotice(error.message);
      return;
    }

    await refreshLobby(activeRoomId);
  }

  async function startRoom() {
    if (!activeRoomId) return;

    console.log('Iniciando partida:', activeRoomId);

    setLoading(true);
    setNotice('');

    try {
      const { data, error } = await supabase.rpc('start_room', {
        p_room_id: activeRoomId,
      });

      console.log('Resultado start_room:', { data, error });

      if (error) throw error;

      if (!data?.match_id) {
        throw new Error('A partida foi iniciada, mas não recebemos seu ID.');
      }

      setActiveMatchId(data.match_id);
      setRoomStatus('playing');
      setScreen('match');

      console.log('Tela alterada para match');

    } catch (error) {
      console.error('Erro ao iniciar partida:', error);

      setNotice(
        error instanceof Error
          ? error.message
          : 'Não foi possível iniciar a partida.'
      );
    } finally {
      setLoading(false);
    }
  }
  async function leaveRoom() {
    if (!activeRoomId) return;

    setLoading(true);

    try {
      const { error } = await supabase.rpc('leave_room', {
        p_room_id: activeRoomId,
      });

      if (error) throw error;

      setHostId('');
      setActiveRoomId('');
      setActiveCode('');
      setMembers([]);
      setIsReady(false);
      setRoomStatus('waiting');
      setScreen('rooms');
      setNotice('');
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : 'Não foi possível sair da sala.'
      );
    } finally {
      setLoading(false);
    }
  }

  async function chooseMatchLanguage(language: 'fr' | 'en') {
    if (!activeMatchId || languageLoading) return;

    setLanguageLoading(true);
    setNotice('');

    try {
      const { data, error } = await supabase.rpc(
        'choose_match_language',
        {
          p_match_id: activeMatchId,
          p_language: language,
        }
      );

      if (error) throw error;

      setMatchLanguage(language);

      setLanguagesReady(Boolean(data?.both_selected));

      console.log('Idioma selecionado:', data);
    } catch (error) {
      console.error('Erro ao escolher idioma:', error);

      setNotice(
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar seu idioma.'
      );
    } finally {
      setLanguageLoading(false);
    }
  }

  async function copyRoomCode() {
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopied(true);

      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setNotice('Não foi possível copiar o código.');
    }
  }

  async function handleOAuthLogin(provider: 'google' | 'github') {
    setNotice('');
    setLoading(true);

    try {
      const options =
        provider === 'github'
          ? {
            redirectTo: window.location.origin,
            scopes: 'read:user user:email',
          }
          : {
            redirectTo: window.location.origin,
          };

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível iniciar a autenticação.';

      setNotice(message);
      setLoading(false);
    }


  }

  return (
    <main className="page-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      {/* Topbar */}
      <header className="topbar">
        <a className="brand" href="#">
          <span className="brand-mark">
            <Globe2 size={19} />
          </span>
          <span>
            French<span className="brand-accent">OS</span>
          </span>
        </a>
        {currentUserId && screen !== 'login' && (
          <div className="profile-menu-container">
            <button
              className="profile-trigger"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              type="button"
            >
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Foto de perfil" />
              ) : (
                <UserRound size={20} />
              )}

              <span>{profile.display_name || 'Jogador'}</span>
              <ChevronDown size={16} />
            </button>

            {profileMenuOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-info">
                  <strong>{profile.display_name || 'Jogador'}</strong>
                  <span>Minha conta</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setProfileName(profile.display_name);
                    setProfileFile(null);
                    setProfileNotice('');
                    setProfileMenuOpen(false);

                    // Guarda de onde o usuário abriu o perfil
                    setProfileReturnScreen(
                      screen === 'match'
                        ? 'match'
                        : screen === 'lobby'
                          ? 'lobby'
                          : 'rooms'
                    );

                    setScreen('profile');
                  }}
                >
                  <UserRound size={17} />
                  Meu perfil
                </button>

                <button type="button" onClick={handleSignOut}>
                  <LogOut size={17} />
                  Sair da conta
                </button>
              </div>
            )}
          </div>
        )}

        {screen === 'login' && (
          <div className="topbar-note">
            <i /> SUA PRÓXIMA FASE COMEÇA AQUI
          </div>
        )}
      </header>

      {/* Seção Principal */}
      {screen === 'login' && (
        <section className="hero">
          {/* Lado Esquerdo - Apresentação */}
          <div className="intro">
            <div className="eyebrow">
              <Sparkles size={15} /> APRENDER PODE SER UMA AVENTURA
            </div>
            <h1>
              Seu próximo idioma.
              <br />
              <span>Sua próxima conquista.</span>
            </h1>
            <p className="intro-copy">
              Entre no FrenchOS e transforme cada aprendizado em um desafio. Pratique,
              evolua e descubra até onde você consegue chegar.
            </p>

            <div className="feature-row">
              <div className="feature-icon">
                <Globe2 size={19} />
              </div>
              <div>
                <strong>Aprenda no seu ritmo</strong>
                <span>Avance etapa por etapa, sem perder a diversão.</span>
              </div>
            </div>

            <div className="feature-row">
              <div className="feature-icon gold">
                <Sparkles size={19} />
              </div>
              <div>
                <strong>Jogue para evoluir</strong>
                <span>Desafios que transformam prática em progresso.</span>
              </div>
            </div>

            <div className="mascot-wrap">
              <div className="mascot-halo" />
              <Maplle />
              <span className="mascot-caption">
                Maplle <i>✦</i> seu guia nessa jornada
              </span>
            </div>
          </div>

          {/* Lado Direito - Card de Login/Cadastro */}
          <div className="login-side">
            <div className="login-card">
              <div className="card-kicker">BEM-VINDO AO FRENCHOS</div>
              <h2>{mode === 'login' ? 'Vamos começar?' : 'Crie sua conta'}</h2>
              <p className="card-subtitle">
                {mode === 'login'
                  ? 'Entre na sua conta e continue de onde parou.'
                  : 'Dê o primeiro passo na sua jornada.'}
              </p>

              <div className="social-buttons">
                <button
                  className="google-button"
                  type="button"
                  onClick={() => handleOAuthLogin('google')}
                  disabled={loading}
                >
                  <b className="google-g">G</b>
                  <span>Google</span>
                </button>

                <button
                  className="google-button github-button"
                  type="button"
                  onClick={() => handleOAuthLogin('github')}
                  disabled={loading}
                >
                  <Github size={17} />
                  <span>GitHub</span>
                </button>
              </div>
              <div className="separator">
                <span />
                ou entre com seu e-mail
                <span />
              </div>

              <form onSubmit={submit}>
                {mode === 'signup' && (
                  <>
                    <label htmlFor="name">Nome</label>

                    <div className="input-wrap">
                      <UserRound size={18} />

                      <input
                        id="name"
                        type="text"
                        placeholder="Como devemos chamar você?"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}
                <label htmlFor="email">E-mail</label>
                <div className="input-wrap">
                  <Mail size={18} />
                  <input
                    id="email"
                    type="email"
                    placeholder="voce@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="password-label">
                  <label htmlFor="password">Senha</label>
                  <button
                    type="button"
                    className="forgot"
                    onClick={() =>
                      setNotice(
                        'A recuperação de senha será adicionada junto ao backend.'
                      )
                    }
                  >
                    Esqueceu a senha?
                  </button>
                </div>

                <div className="input-wrap">
                  <LockKeyhole size={18} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Pelo menos 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="eye-button"
                    type="button"
                    aria-label="Mostrar ou ocultar senha"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {mode === 'signup' && (
                  <>
                    <label htmlFor="confirm-password">Confirmar senha</label>

                    <div className="input-wrap">
                      <LockKeyhole size={18} />

                      <input
                        id="confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Digite sua senha novamente"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                <button
                  className="submit-button"
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? 'Aguarde...'
                    : mode === 'login'
                      ? 'Entrar na minha conta'
                      : 'Criar minha conta'}

                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>

              {notice && (
                <div className="notice" role="status">
                  {notice}
                </div>
              )}

              <p className="switch-mode">
                {mode === 'login'
                  ? 'Ainda não tem uma conta?'
                  : 'Já tem uma conta?'}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'login' ? 'signup' : 'login');
                    setNotice('');
                    setName('');
                    setConfirmPassword('');
                    setPassword('');
                  }}
                >
                  {mode === 'login' ? 'Criar conta' : 'Fazer login'}
                </button>
              </p>

              <p className="terms">
                Ao continuar, você concorda com nossos{' '}
                <a href="#termos">Termos de uso</a> e{' '}
                <a href="#privacidade">Política de privacidade</a>.
              </p>
            </div>

            <div className="bottom-note">
              <span>✦</span> Aprender. Competir. Evoluir.
            </div>
          </div>
        </section>
      )}

      {screen === 'profile' && (
        <section className="workspace profile-workspace">
          <button
            className="back-link"
            onClick={() => {
              setScreen(profileReturnScreen);
              setProfileNotice('');
            }}
          >
            <ArrowLeft size={16} />
            {profileReturnScreen === 'match'
              ? 'Voltar à partida'
              : profileReturnScreen === 'lobby'
                ? 'Voltar à sala'
                : 'Voltar às salas'}
          </button>

          <div className="profile-card">
            <div className="eyebrow">
              <UserRound size={16} />
              SUA CONTA
            </div>

            <h1>Meu <span>perfil.</span></h1>

            <p className="intro-copy">
              Personalize sua identidade no Maplle Learn.
            </p>

            <div className="profile-avatar-editor">
              {profileFile ? (
                <img
                  src={URL.createObjectURL(profileFile)}
                  alt="Prévia da nova foto"
                />
              ) : profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Foto atual" />
              ) : (
                <UserRound size={48} />
              )}

              <label className="avatar-upload-button">
                <Camera size={17} />
                Alterar foto

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) =>
                    setProfileFile(e.target.files?.[0] || null)
                  }
                  hidden
                />
              </label>
            </div>

            <div className="profile-field">
              <label htmlFor="profile-name">Nome de exibição</label>
              <input
                id="profile-name"
                value={profileName}
                maxLength={30}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Como deseja aparecer no jogo?"
              />
            </div>

            <div className="profile-field">
              <label htmlFor="profile-username">Username</label>
              <input
                id="profile-username"
                value={profileUsername}
                maxLength={20}
                onChange={(e) =>
                  setProfileUsername(
                    e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase()
                  )
                }
                placeholder="Ex: breno_123"
              />
              <small>Seu identificador para encontrar e adicionar amigos.</small>
            </div>

            <button
              className="submit-button"
              onClick={saveProfile}
              disabled={profileSaving}
            >
              <Save size={17} />
              {profileSaving ? 'Salvando...' : 'Salvar alterações'}
            </button>

            {profileNotice && (
              <div className="notice" role="status">
                {profileNotice}
              </div>
            )}
          </div>
        </section>
      )}

      {screen === 'rooms' && (
        <section className="workspace">

          <button
            className="back-link"
            onClick={leaveRoom}
            disabled={loading}
          >
            <ArrowLeft size={16} />
            Sair da sala
          </button>

          <button
            className="friends-open-button"
            onClick={() => setScreen('friends')}
          >
            <Users size={17} />
            Meus amigos
          </button>

          <div className="workspace-heading">
            <div className="eyebrow">
              <Gamepad2 size={15} />
              CENTRAL DE PARTIDAS
            </div>

            <h1>
              Hora de <span>jogar.</span>
            </h1>

            <p className="intro-copy">
              Crie uma sala e convide alguém ou entre em uma
              partida usando um código.
            </p>
          </div>

          <div className="room-options">

            <article className="option-card">
              <div className="option-icon">
                <Plus size={24} />
              </div>

              <span className="card-kicker">
                VOCÊ É O ANFITRIÃO
              </span>

              <h2>Criar uma sala</h2>

              <p>
                Gere um código exclusivo e espere seu adversário
                entrar para começar o duelo.
              </p>

              <div className="option-meta">
                <Users size={16} />
                Até 2 jogadores • Sala privada
              </div>

              <button
                className="submit-button"
                onClick={createRoom}
              >
                Criar sala
                <ArrowRight size={18} />
              </button>
            </article>

            <article className="option-card">
              <div className="option-icon join-icon">
                <DoorOpen size={24} />
              </div>

              <span className="card-kicker">
                JÁ TEM UM CONVITE?
              </span>

              <h2>Entrar em uma sala</h2>

              <p>
                Insira o código que seu amigo compartilhou
                com você.
              </p>

              <form onSubmit={joinRoom}>
                <label htmlFor="room-code">
                  Código da sala
                </label>

                <div className="input-wrap">
                  <input
                    id="room-code"
                    value={roomCode}
                    onChange={(e) =>
                      setRoomCode(e.target.value.toUpperCase())
                    }
                    placeholder="FR-8K29"
                    maxLength={7}
                  />
                </div>

                <button
                  className="submit-button secondary-submit"
                  type="submit"
                >
                  Entrar na sala
                  <ArrowRight size={18} />
                </button>
              </form>

              {notice && (
                <div className="notice" role="status">
                  {notice}
                </div>
              )}
            </article>

          </div>
        </section>
      )}

      {screen === 'friends' && (
        <FriendsPanel
          currentUserId={currentUserId}
          onBack={() => setScreen('rooms')}
        />
      )}

      {screen === 'lobby' && (
        <section className="workspace lobby-workspace">

          <button
            className="back-link"
            onClick={leaveRoom}
            disabled={loading}
          >
            <ArrowLeft size={16} />
            {loading ? 'Saindo da sala...' : 'Sair da sala'}
          </button>

          <div className="lobby-title">
            <div className="eyebrow">
              <Sparkles size={15} />
              SALA DE DUELO
            </div>

            <h1>
              Prepare-se para o <span>desafio.</span>
            </h1>

            <p className="intro-copy">
              A partida começa quando os dois jogadores
              estiverem na sala.
            </p>
          </div>

          <div className="lobby-card">

            {notice && (
              <div className="notice" role="status">
                {notice}
              </div>
            )}

            <div className="lobby-topline">
              <span className="live-dot" />
              SALA PRIVADA

              <span className="waiting-label">
                {roomStatus === 'playing'
                  ? 'PARTIDA INICIADA'
                  : members.length === 2
                    ? 'DOIS JOGADORES'
                    : 'AGUARDANDO JOGADOR'}
              </span>
            </div>

            <div className="players">
              {[0, 1].map((index) => {
                const player = members[index];
                const isMe = player?.user_id === currentUserId;
                const isHost = player?.user_id === hostId;

                return (
                  <React.Fragment key={index}>
                    {index === 1 && <div className="versus">VS</div>}

                    <div
                      className={`player-slot ${player?.is_ready ? 'player-ready' : ''}`}
                    >
                      <div className={`avatar-circle ${!player ? 'empty-avatar' : ''}`}>
                        {player?.avatar_url ? (
                          <img
                            src={player.avatar_url}
                            alt={`Foto de ${player.display_name}`}
                            className="player-avatar-image"
                          />
                        ) : isHost ? (
                          <Crown size={29} />
                        ) : (
                          <UserRound size={27} />
                        )}
                      </div>

                      <strong>
                        {player
                          ? player.display_name
                          : 'Aguardando...'}
                      </strong>

                      <span>
                        {!player
                          ? 'Compartilhe o código'
                          : isMe
                            ? 'Você'
                            : isHost
                              ? 'Anfitrião'
                              : 'Adversário'}
                      </span>

                      <em className={!player ? 'waiting-pill' : ''}>
                        {!player
                          ? 'Vaga disponível'
                          : player.is_ready
                            ? 'Pronto'
                            : 'Aguardando'}
                      </em>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            <div className="room-code-panel">
              <div>
                <span className="card-kicker">
                  CÓDIGO DA SALA
                </span>

                <div className="room-code">
                  {activeCode}
                </div>
              </div>

              <button
                className="copy-button"
                onClick={copyRoomCode}
              >
                <Copy size={17} />
                {copied ? 'Copiado!' : 'Copiar código'}
              </button>
            </div>

            <div className="match-settings">
              <div>
                <span>IDIOMA</span>
                <strong>Francês|Inglês</strong>
              </div>

              <div>
                <span>MODO</span>
                <strong>Duelo de tradução</strong>
              </div>

              <div>
                <span>JOGADORES</span>
                <strong>2 participantes</strong>
              </div>
            </div>

            {roomStatus === 'waiting' && (
              <>
                <button
                  className="start-button"
                  onClick={toggleReady}
                  disabled={loading || members.length === 0}
                  style={{
                    background: isReady ? '#397c63' : undefined,
                    cursor: loading ? 'wait' : 'pointer',
                  }}
                >
                  <Sparkles size={17} />
                  {loading
                    ? 'Aguarde...'
                    : isReady
                      ? 'Cancelar pronto'
                      : 'Estou pronto'}
                </button>

                {hostId === currentUserId && (
                  <button
                    className="submit-button"
                    onClick={startRoom}
                    disabled={
                      loading ||
                      members.length !== 2 ||
                      !members.every((member) => member.is_ready)
                    }
                  >
                    <Gamepad2 size={17} />
                    Iniciar partida
                  </button>
                )}

                <p className="lobby-footnote">
                  {members.length !== 2
                    ? 'Aguardando o segundo jogador.'
                    : members.every((member) => member.is_ready)
                      ? 'Os dois jogadores estão prontos!'
                      : 'Aguardando os jogadores ficarem prontos.'}
                </p>
              </>
            )}

            {roomStatus === 'playing' && (
              <div className="notice">
                <Sparkles size={16} />
                Partida iniciada! O próximo passo será implementar o duelo.
              </div>
            )}

          </div>

        </section>
      )}

      {screen === 'match' && (
        <section className="workspace match-workspace">
          <div className="match-header">
            <div className="eyebrow">
              <Gamepad2 size={15} />
              PARTIDA EM ANDAMENTO
            </div>

            <h1>
              Hora do <span>desafio!</span>
            </h1>

            <p className="intro-copy">
              Mostre o que você sabe e conquiste seus pontos.
            </p>
          </div>

          <div className="match-card">
            <div className="match-player-info">
              <div className="match-player">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Seu avatar" />
                ) : (
                  <UserRound size={24} />
                )}

                <div>
                  <strong>{profile.display_name}</strong>
                  <span>Você</span>
                </div>
              </div>

              <div className="match-score">
                <span>PONTOS</span>
                <strong>{myScore}</strong>
              </div>
            </div>

            <div className="match-divider">
              <span>VS</span>
            </div>

            <div className="match-player-info">
              <div className="match-player">
                <UserRound size={24} />

                <div>
                  <strong>
                    {members.find(
                      (member) => member.user_id !== currentUserId
                    )?.display_name || 'Adversário'}
                  </strong>
                  <span>Seu adversário</span>
                </div>
              </div>

              <div className="match-score">
                <span>PONTOS</span>
                <strong>{opponentScore}</strong>
              </div>
            </div>

            <div className="match-challenge">
              {!languagesReady ? (
                <>
                  <div className="eyebrow">
                    <Sparkles size={15} />
                    CONFIGURAÇÃO DO DUELO
                  </div>

                  <h2>Qual idioma você quer praticar?</h2>

                  <p>
                    Escolha seu idioma. Seu adversário poderá escolher
                    francês ou inglês independentemente da sua escolha.
                  </p>

                  <div className="language-options">
                    <button
                      type="button"
                      className={`language-option ${matchLanguage === 'en' ? 'selected' : ''}`}
                      onClick={() => chooseMatchLanguage('en')}
                      disabled={languageLoading}
                    >
                      <span>🇬🇧</span>
                      <strong>Inglês</strong>
                      <small>English</small>
                    </button>

                    <button
                      type="button"
                      className={`language-option ${matchLanguage === 'fr' ? 'selected' : ''}`}
                      onClick={() => chooseMatchLanguage('fr')}
                      disabled={languageLoading}
                    >
                      <span>🇫🇷</span>
                      <strong>Francês</strong>
                      <small>Français</small>
                    </button>
                  </div>

                  {languageLoading && (
                    <p>Salvando sua escolha...</p>
                  )}

                  {matchLanguage && (
                    <p className="language-status">
                      Seu idioma: {matchLanguage === 'fr' ? '🇫🇷 Francês' : '🇬🇧 Inglês'}
                    </p>


                  )}

                  {matchLanguage && !opponentLanguage && (
                    <div className="match-waiting">
                      <span className="waiting-indicator" />
                      Aguardando seu adversário escolher o idioma...
                    </div>
                  )}

                  {opponentLanguage && (
                    <div className="match-opponent-language">
                      Adversário escolheu:
                      <strong>
                        {opponentLanguage === 'fr' ? ' 🇫🇷 Francês' : ' 🇬🇧 Inglês'}
                      </strong>
                    </div>
                  )}

                  <div className="match-mascot">
                    <Maplle />
                  </div>
                </>
              ) : (
                <>
                  <div className="eyebrow">
                    <Sparkles size={15} />
                    DESAFIO DE TRADUÇÃO
                  </div>

                  {!activeRoundId && !roundEvaluation && (
                    <>
                      <h2>Prepare-se para jogar! 🎯</h2>

                      <p>
                        Cada jogador recebe seu próprio desafio.
                        As respostas acontecem simultaneamente!
                      </p>

                      <button
                        type="button"
                        className="match-action-button"
                        onClick={generateRound}
                        disabled={roundLoading || matchFinished}
                      >
                        {roundLoading
                          ? 'Preparando desafio...'
                          : currentRound === 0
                            ? 'Começar desafio'
                            : 'Começar próxima rodada'}
                      </button>
                    </>
                  )}

                  {(activeRoundId || roundEvaluation) && (
                    <>
                      <p className="round-counter">
                        RODADA {roundNumber} DE {totalRounds}
                      </p>

                      {remainingSeconds !== null && roundReady && (
                        <p className="round-timer">
                          Tempo restante: {Math.floor(remainingSeconds / 60)}:
                          {String(remainingSeconds % 60).padStart(2, '0')}
                        </p>
                      )}

                      <h2>Traduza a frase abaixo:</h2>

                      <div className="round-original-text">
                        {originalText}
                      </div>

                      {!roundReady && !roundEvaluation && (
                        <div className="match-waiting">
                          <span className="waiting-indicator" />
                          <p>
                            Aguardando seu adversário gerar o desafio.
                            O cronômetro começará quando os dois estiverem prontos.
                          </p>
                        </div>
                      )}

                      {roundReady && !roundEvaluation && (
                        <>
                          <textarea
                            className="translation-input"
                            value={userAnswer}
                            onChange={(event) => setUserAnswer(event.target.value)}
                            placeholder="Digite sua tradução..."
                            disabled={answerLoading || remainingSeconds === 0}
                            rows={4}
                          />

                          <button
                            type="button"
                            className="match-action-button"
                            onClick={submitAnswer}
                            disabled={
                              answerLoading ||
                              !userAnswer.trim() ||
                              remainingSeconds === 0
                            }
                          >
                            {answerLoading ? 'Avaliando resposta...' : 'Enviar resposta'}
                          </button>
                        </>
                      )}

                      {roundEvaluation && (
                        <div className="round-result">
                          <h2>
                            {roundEvaluation.was_timeout
                              ? 'Tempo esgotado! ⏱️'
                              : roundEvaluation.is_correct
                                ? 'Muito bem! 🎉'
                                : 'Vamos aprender juntos!'}
                          </h2>

                          <div className="round-result-score">
                            {roundEvaluation.score}/10
                          </div>

                          <p>{roundEvaluation.feedback}</p>

                          <div>
                            <strong>Sua resposta:</strong>
                            <p>
                              {roundEvaluation.was_timeout
                                ? 'Você não enviou uma resposta a tempo.'
                                : userAnswer}
                            </p>
                          </div>

                          <div>
                            <strong>Tradução corrigida:</strong>
                            <p>{roundEvaluation.corrected_answer}</p>
                          </div>

                          <div>
                            <strong>Explicação gramatical:</strong>
                            <p>{roundEvaluation.grammar_explanation}</p>
                          </div>

                          {roundEvaluation.alternative_translations.length > 0 && (
                            <div>
                              <strong>Outras traduções possíveis:</strong>
                              <ul>
                                {roundEvaluation.alternative_translations.map(
                                  (translation, index) => (
                                    <li key={index}>{translation}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                          {matchFinished ? (
                            <h3>Partida finalizada! 🏆</h3>
                          ) : roundCompleted ? (
                            <div className="match-next-turn">
                              <p>
                                Os dois jogadores concluíram a rodada!
                                A próxima já está liberada.
                              </p>

                              <button
                                type="button"
                                className="match-action-button"
                                onClick={continueAfterEvaluation}
                              >
                                Continuar para próxima rodada
                                <ArrowRight size={18} />
                              </button>
                            </div>
                          ) : (
                            <div className="match-waiting">
                              <span className="waiting-indicator" />
                              Aguardando o adversário concluir a rodada...
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                  {(activeRoundId || roundEvaluation) && (
                    <>
                      <p className="round-counter">
                        RODADA {roundNumber} DE 20
                      </p>

                      <h2>Traduza a frase abaixo:</h2>

                      <div className="round-original-text">
                        {originalText}
                      </div>

                      {!roundEvaluation && (
                        <>
                          <textarea
                            className="translation-input"
                            value={userAnswer}
                            onChange={(event) => setUserAnswer(event.target.value)}
                            placeholder="Digite sua tradução..."
                            disabled={answerLoading}
                            rows={4}
                          />

                          <button
                            type="button"
                            className="match-action-button"
                            onClick={submitAnswer}
                            disabled={answerLoading || !userAnswer.trim()}
                          >
                            {answerLoading ? 'Avaliando resposta...' : 'Enviar resposta'}
                          </button>
                        </>
                      )}

                      {roundEvaluation && (
                        <div className="round-result">
                          <h2>
                            {roundEvaluation.is_correct
                              ? 'Muito bem! 🎉'
                              : 'Vamos aprender juntos!'}
                          </h2>

                          <div className="round-result-score">
                            {roundEvaluation.score}/10
                          </div>

                          <p>{roundEvaluation.feedback}</p>

                          <div>
                            <strong>Sua resposta:</strong>
                            <p>{userAnswer}</p>
                          </div>

                          <div>
                            <strong>Tradução corrigida:</strong>
                            <p>{roundEvaluation.corrected_answer}</p>
                          </div>

                          <div>
                            <strong>Explicação gramatical:</strong>
                            <p>{roundEvaluation.grammar_explanation}</p>
                          </div>

                          {roundEvaluation.alternative_translations.length > 0 && (
                            <div>
                              <strong>Outras traduções possíveis:</strong>

                              <ul>
                                {roundEvaluation.alternative_translations.map(
                                  (translation, index) => (
                                    <li key={index}>{translation}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                          {matchFinished ? (
                            <h3>Partida finalizada! 🏆</h3>
                          ) : isMyTurn ? (
                            <div className="match-next-turn">
                              <p>
                                Seu adversário já terminou. É sua vez novamente!
                              </p>

                              <button
                                type="button"
                                className="match-action-button"
                                onClick={continueAfterEvaluation}
                              >
                                Continuar para próxima rodada
                                <ArrowRight size={18} />
                              </button>
                            </div>
                          ) : (
                            <div className="match-waiting">
                              <span className="waiting-indicator" />
                              Aguardando o próximo jogador...
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  <div className="match-mascot">
                    <Maplle />
                  </div>
                </>
              )}

              {notice && (
                <p className="error-message">{notice}</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer>
        <span>© 2026 FrenchOS</span>
        <span>Feito para quem quer ir além.</span>
      </footer>
    </main>
  );
}