import { useEffect, useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  Search,
  UserPlus,
  Users,
  Check,
  X,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {
  searchUsers,
  sendFriendRequest,
  getFriendships,
  respondFriendRequest,
  removeFriend,
  type FriendProfile,
  type Friendship,
} from '../../services/friendsService';

type Props = {
  currentUserId: string;
  onBack: () => void;
};

export default function FriendsPanel({ currentUserId, onBack }: Props) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<FriendProfile[]>([]);
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [profiles, setProfiles] = useState<Record<string, FriendProfile>>({});
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [notice, setNotice] = useState('');
  const [busyId, setBusyId] = useState('');

  async function loadFriendships() {
    setLoading(true);

    try {
      const data = await getFriendships(currentUserId);
      setFriendships(data);

      const userIds = [
        ...new Set(
          data.flatMap((item) => [
            item.requester_id,
            item.addressee_id,
          ]).filter((id) => id !== currentUserId)
        ),
      ];

      if (userIds.length === 0) {
        setProfiles({});
        return;
      }

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url')
        .in('id', userIds);

      if (error) throw error;

      const profileMap: Record<string, FriendProfile> = {};

      (profileData ?? []).forEach((profile) => {
        profileMap[profile.id] = profile as FriendProfile;
      });

      setProfiles(profileMap);
    } catch (error) {
      console.error('Erro ao carregar amizades:', error);
      setNotice('Não foi possível carregar suas amizades.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFriendships();
  }, [currentUserId]);

  async function handleSearch(event: React.FormEvent) {
    event.preventDefault();

    if (search.trim().replace(/^@/, '').length < 3) {
      setNotice('Digite pelo menos 3 caracteres para pesquisar.');
      return;
    }

    setSearching(true);
    setNotice('');

    try {
      const data = await searchUsers(search, currentUserId);
      setResults(data);

      if (data.length === 0) {
        setNotice('Nenhum usuário encontrado.');
      }
    } catch (error) {
      console.error(error);
      setNotice('Não foi possível pesquisar usuários.');
    } finally {
      setSearching(false);
    }
  }

  async function handleSendRequest(userId: string) {
    setBusyId(userId);
    setNotice('');

    try {
      await sendFriendRequest(userId, currentUserId);
      setNotice('Solicitação enviada!');
      setResults((current) => current.filter((user) => user.id !== userId));
      await loadFriendships();
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : 'Não foi possível enviar a solicitação.'
      );
    } finally {
      setBusyId('');
    }
  }

  async function handleResponse(
    friendshipId: string,
    accept: boolean
  ) {
    setBusyId(friendshipId);
    setNotice('');

    try {
      await respondFriendRequest(friendshipId, accept);
      setNotice(
        accept
          ? 'Amizade adicionada com sucesso!'
          : 'Solicitação recusada.'
      );
      await loadFriendships();
    } catch (error) {
      console.error(error);
      setNotice('Não foi possível responder à solicitação.');
    } finally {
      setBusyId('');
    }
  }

  async function handleRemove(friendshipId: string) {
    const confirmed = window.confirm(
      'Tem certeza que deseja remover este amigo?'
    );

    if (!confirmed) return;

    setBusyId(friendshipId);
    setNotice('');

    try {
      await removeFriend(friendshipId);
      setNotice('Amigo removido.');
      await loadFriendships();
    } catch (error) {
      console.error(error);
      setNotice('Não foi possível remover o amigo.');
    } finally {
      setBusyId('');
    }
  }

  const incomingRequests = friendships.filter(
    (item) =>
      item.status === 'pending' &&
      item.addressee_id === currentUserId
  );

  const outgoingRequests = friendships.filter(
    (item) =>
      item.status === 'pending' &&
      item.requester_id === currentUserId
  );

  const friends = friendships.filter(
    (item) => item.status === 'accepted'
  );

  function getOtherUser(item: Friendship) {
    return item.requester_id === currentUserId
      ? item.addressee_id
      : item.requester_id;
  }

  function renderUser(profile?: FriendProfile) {
    if (!profile) return 'Usuário';

    return profile.display_name || profile.username || 'Usuário';
  }

  return (
    <section className="workspace friends-workspace">
      <button className="back-link" onClick={onBack}>
        <ArrowLeft size={16} />
        Voltar às salas
      </button>

      <div className="workspace-heading">
        <div className="eyebrow">
          <Users size={16} />
          COMUNIDADE MAPLLE
        </div>

        <h1>
          Seus <span>amigos.</span>
        </h1>

        <p className="intro-copy">
          Encontre pessoas, faça amizades e convide seus amigos
          para disputar uma partida.
        </p>
      </div>

      <div className="friends-card">
        <div className="friends-section">
          <div className="friends-section-title">
            <UserPlus size={19} />
            <h2>Adicionar amigos</h2>
          </div>

          <form className="friends-search" onSubmit={handleSearch}>
            <div className="input-wrap">
              <Search size={17} />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Pesquisar pelo username"
                maxLength={20}
              />
            </div>

            <button
              className="friends-search-button"
              type="submit"
              disabled={searching}
            >
              {searching ? 'Buscando...' : 'Pesquisar'}
            </button>
          </form>

          {results.map((user) => (
            <div className="friend-row" key={user.id}>
              <div className="friend-avatar">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="" />
                ) : (
                  <Users size={20} />
                )}
              </div>

              <div className="friend-info">
                <strong>{renderUser(user)}</strong>
                <span>@{user.username}</span>
              </div>

              <button
                className="friend-action"
                onClick={() => handleSendRequest(user.id)}
                disabled={busyId === user.id}
              >
                <UserPlus size={16} />
                {busyId === user.id ? 'Enviando...' : 'Adicionar'}
              </button>
            </div>
          ))}
        </div>

        <div className="friends-section">
          <div className="friends-section-title">
            <Users size={19} />
            <h2>Solicitações recebidas</h2>
            <span className="friends-count">
              {incomingRequests.length}
            </span>
          </div>

          {incomingRequests.length === 0 && (
            <p className="friends-empty">
              Você não tem solicitações pendentes.
            </p>
          )}

          {incomingRequests.map((item) => {
            const user = profiles[item.requester_id];

            return (
              <div className="friend-row" key={item.id}>
                <div className="friend-avatar">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="" />
                  ) : (
                    <Users size={20} />
                  )}
                </div>

                <div className="friend-info">
                  <strong>{renderUser(user)}</strong>
                  <span>@{user?.username || 'sem username'}</span>
                </div>

                <div className="friend-actions">
                  <button
                    className="friend-accept"
                    title="Aceitar"
                    disabled={busyId === item.id}
                    onClick={() => handleResponse(item.id, true)}
                  >
                    <Check size={17} />
                  </button>

                  <button
                    className="friend-decline"
                    title="Recusar"
                    disabled={busyId === item.id}
                    onClick={() => handleResponse(item.id, false)}
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="friends-section">
          <div className="friends-section-title">
            <Users size={19} />
            <h2>Meus amigos</h2>
            <span className="friends-count">{friends.length}</span>
          </div>

          {friends.length === 0 && (
            <p className="friends-empty">
              Sua lista ainda está vazia. Que tal adicionar alguém?
            </p>
          )}

          {friends.map((item) => {
            const userId = getOtherUser(item);
            const user = profiles[userId];

            return (
              <div className="friend-row" key={item.id}>
                <div className="friend-avatar">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="" />
                  ) : (
                    <Users size={20} />
                  )}
                </div>

                <div className="friend-info">
                  <strong>{renderUser(user)}</strong>
                  <span>@{user?.username || 'sem username'}</span>
                </div>

                <button
                  className="friend-remove"
                  title="Remover amigo"
                  disabled={busyId === item.id}
                  onClick={() => handleRemove(item.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>

        {outgoingRequests.length > 0 && (
          <div className="friends-section">
            <div className="friends-section-title">
              <RefreshCw size={18} />
              <h2>Solicitações enviadas</h2>
              <span className="friends-count">
                {outgoingRequests.length}
              </span>
            </div>

            {outgoingRequests.map((item) => {
              const user = profiles[item.addressee_id];

              return (
                <div className="friend-row" key={item.id}>
                  <div className="friend-avatar">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt="" />
                    ) : (
                      <Users size={20} />
                    )}
                  </div>

                  <div className="friend-info">
                    <strong>{renderUser(user)}</strong>
                    <span>@{user?.username || 'sem username'}</span>
                  </div>

                  <span className="friend-pending">
                    Pendente
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {notice && (
          <div className="notice" role="status">
            {notice}
          </div>
        )}

        {loading && (
          <p className="friends-loading">Atualizando amizades...</p>
        )}

        <button
          className="friends-refresh"
          onClick={loadFriendships}
          disabled={loading}
        >
          <RefreshCw size={15} />
          Atualizar lista
        </button>
      </div>
    </section>
  );
}
