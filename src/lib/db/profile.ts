import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types';

export async function getProfile(): Promise<Profile | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
    .single();

  if (error) return null;
  return data;
}

export async function updateProfile(
  id: string,
  profile: Partial<Omit<Profile, 'id' | 'created_at'>>
): Promise<Profile> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...profile, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
