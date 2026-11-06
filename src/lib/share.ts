export type ShareResult = 'shared' | 'copied' | 'cancelled' | 'manual';
export async function shareBook(
  title: string,
  url: string,
): Promise<ShareResult> {
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, text: `Ufficio Regali — ${title}`, url });
      return 'shared';
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'name' in error &&
        error.name === 'AbortError'
      )
        return 'cancelled';
    }
  }
  if (
    typeof navigator.clipboard?.writeText === 'function' &&
    window.isSecureContext
  ) {
    try {
      await navigator.clipboard.writeText(url);
      return 'copied';
    } catch {
      /* Offer a selectable URL. */
    }
  }
  return 'manual';
}
