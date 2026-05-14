import { createClient } from '@/lib/supabase/client';
import type { ContactMessage } from '@/types';

export async function getMessages(): Promise<ContactMessage[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createMessage(
  message: Omit<ContactMessage, 'id' | 'is_read' | 'created_at'>
): Promise<ContactMessage> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('contact_messages')
    .insert({ ...message, is_read: false })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function markMessageRead(
  id: string,
  is_read: boolean
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('contact_messages')
    .update({ is_read })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteMessage(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function getUnreadCount(): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from('contact_messages')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false);

  if (error) return 0;
  return count ?? 0;
}
