import { supabase } from './supabase';

async function testConnection() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Erro ao conectar:', error.message);
    return;
  }

  console.log('Supabase conectado!');
  console.log('Sessão atual:', data.session);
}

testConnection();