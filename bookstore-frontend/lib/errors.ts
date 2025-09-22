// lib/errors.ts
export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  // Si viene algo tipo { message: ... }
  if (typeof err === 'object' && err !== null && 'message' in err) {
    const maybe = (err as { message?: unknown }).message;
    if (typeof maybe === 'string') return maybe;
  }
  try {
    const asJson = JSON.stringify(err);
    if (asJson && asJson !== '{}') return asJson;
  } catch { /* ignore */ }
  return String(err);
}
