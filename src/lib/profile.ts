import { supabase } from './supabaseClient';

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, role, is_admin')
    .eq('id', userId)
    .single();
  return { profile: data, error };
}
