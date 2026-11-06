import { afterEach, describe, expect, it, vi } from 'vitest';
import { shareBook } from './share';
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
describe('Condivisione', () => {
  it('attende il completamento della share nativa', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { share });
    expect(await shareBook('Titolo', 'https://example.org/?book=uno')).toBe(
      'shared',
    );
    expect(share).toHaveBeenCalledWith(
      expect.objectContaining({ url: 'https://example.org/?book=uno' }),
    );
  });
  it('non mostra errori quando l’utente annulla', async () => {
    vi.stubGlobal('navigator', {
      share: vi
        .fn()
        .mockRejectedValue(new DOMException('Cancelled', 'AbortError')),
    });
    expect(await shareBook('Titolo', 'https://example.org')).toBe('cancelled');
  });
  it('copia il link se la share non esiste o fallisce', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    vi.stubGlobal('isSecureContext', true);
    expect(await shareBook('Titolo', 'https://example.org')).toBe('copied');
    expect(writeText).toHaveBeenCalledWith('https://example.org');
  });
  it('offre il fallback manuale quando manca accesso agli appunti', async () => {
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    });
    vi.stubGlobal('isSecureContext', true);
    expect(await shareBook('Titolo', 'https://example.org')).toBe('manual');
    vi.stubGlobal('navigator', {});
    expect(await shareBook('Titolo', 'https://example.org')).toBe('manual');
  });
});
