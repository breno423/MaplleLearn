
import { supabase } from '../lib/supabase';

export type FriendProfile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
};

export type Friendship = {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted';
  created_at: string;
};

export async function searchUsers(username: string, currentUserId: string) {
  const term = username.trim().replace(/^@/, '');

  if (term.length < 3) {
    return [];
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url')
    .ilike('username', `${term}%`)
    .neq('id', currentUserId)
    .limit(10);

  if (error) throw error;

  return (data ?? []) as FriendProfile[];
}

export async function sendFriendRequest(
  targetUserId: string,
  currentUserId: string
) {
  const { error } = await supabase
    .from('friendships')
    .insert({
      requester_id: currentUserId,
      addressee_id: targetUserId,
      status: 'pending',
    });

  if (error) {
    if (error.code === '23505') {
      throw new Error('Já existe uma solicitação ou amizade com esse usuário.');
    }

    throw error;
  }
}

export async function getFriendships(currentUserId: string) {
  const { data, error } = await supabase
    .from('friendships')
    .select('*')
    .or(`requester_id.eq.${currentUserId},addressee_id.eq.${currentUserId}`)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []) as Friendship[];
}

export async function respondFriendRequest(
  friendshipId: string,
  accept: boolean
) {
  if (accept) {
    const { error } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', friendshipId)
      .eq('status', 'pending');

    if (error) throw error;
    return;
  }

  const { error } = await supabase
    .from('friendships')
    .delete()
    .eq('id', friendshipId)
    .eq('status', 'pending');

  if (error) throw error;
}

export async function removeFriend(friendshipId: string) {
  const { error } = await supabase
    .from('friendships')
    .delete()
    .eq('id', friendshipId)
    .eq('status', 'accepted');

  if (error) throw error;
}
