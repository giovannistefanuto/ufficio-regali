import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BookArchive } from './BookArchive';
import { BookDetailsPanel } from './BookDetailsPanel';
import raw from '../content/books.demo.json';
import { validateCatalog } from '../lib/catalog';
const books = validateCatalog(raw);
describe('Fascicolo M4', () => {
  it('apre il dialog, focalizza Chiudi e ripristina focus e scroll', async () => {
    const user = userEvent.setup();
    render(<BookArchive books={books} />);
    const trigger = screen.getByRole('button', {
      name: 'Esamina il fascicolo',
    });
    await user.click(trigger);
    const dialog = screen.getByRole('dialog');
    expect(
      within(dialog).getByRole('heading', { name: books[0].title }),
    ).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Chiudi il fascicolo' }),
    ).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');
    await user.click(
      screen.getByRole('button', { name: 'Chiudi il fascicolo' }),
    );
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe('');
  });
  it('risponde a Escape nativo e clic sul backdrop', () => {
    const close = vi.fn();
    render(<BookDetailsPanel book={books[0]} number={1} onClose={close} />);
    fireEvent(
      screen.getByRole('dialog'),
      new Event('cancel', { bubbles: false, cancelable: true }),
    );
    expect(close).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('dialog'), { clientX: -1, clientY: -1 });
    expect(close).toHaveBeenCalledTimes(2);
  });
  it('disabilita acquisto mancante e apre URL valido con protezione nuova scheda', () => {
    const { rerender } = render(
      <BookDetailsPanel
        book={{ ...books[0], amazonUrl: undefined }}
        number={1}
        onClose={() => {}}
      />,
    );
    expect(
      screen.getByRole('button', { name: /Apri su Amazon/ }),
    ).toBeDisabled();
    expect(
      screen.getByText('Link acquisto non ancora disponibile.'),
    ).toBeVisible();
    rerender(
      <BookDetailsPanel
        book={{ ...books[0], amazonUrl: 'https://www.amazon.it/dp/8850339003' }}
        number={1}
        onClose={() => {}}
      />,
    );
    const link = screen.getByRole('link', { name: /Apri su Amazon/ });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
  it('offre URL selezionabile quando share e clipboard non sono disponibili', async () => {
    const user = userEvent.setup();
    const spy = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockRejectedValue(new Error('denied'));
    render(<BookDetailsPanel book={books[0]} number={1} onClose={() => {}} />);
    await user.click(screen.getByRole('button', { name: /Condividi/ }));
    expect(
      (
        (await screen.findByRole('textbox', {
          name: 'Link del fascicolo',
        })) as HTMLInputElement
      ).value,
    ).toContain(`book=${books[0].slug}`);
    expect(screen.queryByText('Fascicolo condiviso.')).toBeNull();
    spy.mockRestore();
  });
});
