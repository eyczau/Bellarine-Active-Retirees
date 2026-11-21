import type { PrimaryCategory } from '../types/group.ts';

export const FILTER_CATEGORIES: Array<'All' | PrimaryCategory> = [
  'All',
  'Move',
  'Nature',
  'Create',
  'Connect',
  'Give Back',
  'Learn',
  'Play',
];

const CATEGORY_COLOR_MAP: Record<string, string> = {
  Move: 'bg-pink-500 text-white',
  Nature: 'bg-green-500 text-white',
  Create: 'bg-purple-500 text-white',
  Connect: 'bg-blue-500 text-white',
  'Give Back': 'bg-rose-500 text-white',
  Learn: 'bg-indigo-500 text-white',
  Play: 'bg-cyan-500 text-white',
};

export function getCategoryPillClass(category: string): string {
  return CATEGORY_COLOR_MAP[category] ?? 'bg-slate-700 text-white';
}

export function getDisplayCategories(rawCategories: string[]): string[] {
  const cleaned = rawCategories
    .map((c) => c.trim())
    .filter(
      (c) =>
        c.length > 0 &&
        c.toLowerCase() !== 'participation' &&
        c.toLowerCase() !== 'volunteering'
    );

  const unique: string[] = [];
  const seen = new Set<string>();

  for (const cat of cleaned) {
    const key = cat.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(cat);
    }
  }

  return unique;
}

export function sanitizeExternalUrl(value: string | null | undefined): string | null {
  if (!value || typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  // Reject dangerous or non-web schemes explicitly before normalizing
  const schemeMatch = /^([a-zA-Z][a-zA-Z\d+\-.]*):/.exec(trimmed);
  if (schemeMatch) {
    const scheme = schemeMatch[1].toLowerCase();
    if (scheme !== 'http' && scheme !== 'https') {
      return null;
    }
  }

  const candidate = schemeMatch ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

export function sanitizeTelHref(phone: string | null | undefined): string | null {
  if (!phone || typeof phone !== 'string') {
    return null;
  }
  const cleaned = phone.replace(/[^\d+]/g, '');
  return cleaned.length >= 6 ? `tel:${cleaned}` : null;
}

export function isValidEmail(email: string | null | undefined): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const trimmed = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}
