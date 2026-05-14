import { createClient } from '@/lib/supabase/client';

const BUCKET = 'project-media';
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export type MediaType = 'cover' | 'screenshot' | 'demo-video' | 'mockup-video';

function getFilePath(
  projectSlug: string,
  mediaType: MediaType,
  filename: string
): string {
  const ext = filename.split('.').pop();
  const timestamp = Date.now();
  switch (mediaType) {
    case 'cover':
      return `projects/${projectSlug}/cover.${ext}`;
    case 'screenshot':
      return `projects/${projectSlug}/screenshots/${timestamp}.${ext}`;
    case 'demo-video':
      return `projects/${projectSlug}/videos/demo.${ext}`;
    case 'mockup-video':
      return `projects/${projectSlug}/videos/mockup.${ext}`;
  }
}

export async function uploadProjectMedia(
  file: File,
  projectSlug: string,
  mediaType: MediaType
): Promise<string> {
  const isVideo = file.type.startsWith('video/');
  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

  if (file.size > maxSize) {
    throw new Error(
      `File too large. Max size: ${isVideo ? '50MB' : '5MB'}`
    );
  }

  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
  const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type: ${file.type}`);
  }

  const supabase = createClient();
  const filePath = getFilePath(projectSlug, mediaType, file.name);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, { upsert: true });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function deleteProjectMedia(url: string): Promise<void> {
  const supabase = createClient();
  // Extract path from URL
  const urlParts = url.split(`/${BUCKET}/`);
  if (urlParts.length < 2) return;

  const filePath = urlParts[1];
  const { error } = await supabase.storage.from(BUCKET).remove([filePath]);
  if (error) throw error;
}

export function getPublicUrl(filePath: string): string {
  const supabase = createClient();
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}
