export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();
}

export function includesNormalized(haystack: string, needle: string): boolean {
  if (!needle) return true;
  return normalizeText(haystack).includes(normalizeText(needle));
}

export function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

export function toBool(value: string): boolean {
  const v = value.trim().toLowerCase();
  return v === "1" || v === "true" || v === "si" || v === "sí";
}

export function clampLimit(limit: number | undefined, fallback = 20, max = 50): number {
  if (limit === undefined || Number.isNaN(limit)) return fallback;
  return Math.min(Math.max(1, Math.floor(limit)), max);
}

export function truncate(text: string, max = 500): { text: string; truncated: boolean } {
  if (text.length <= max) return { text, truncated: false };
  return { text: `${text.slice(0, max)}…`, truncated: true };
}
