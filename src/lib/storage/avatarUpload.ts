import { createClient } from '@/lib/supabase/client';

const BUCKET = 'avatars';
const FILE_PATH = 'profile.webp';
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function uploadAvatar(file: File): Promise<string> {
  if (file.size > MAX_SIZE) {
    throw new Error('File too large. Max size: 5MB');
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Allowed: JPEG, PNG, WebP');
  }

  const supabase = createClient();

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(FILE_PATH, file, { upsert: true, contentType: file.type });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(FILE_PATH);
  return data.publicUrl;
}
