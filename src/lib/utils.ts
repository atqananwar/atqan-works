import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  // Simple class merge without clsx dependency
  return inputs
    .flat()
    .filter(Boolean)
    .join(' ')
    .trim();
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}
