import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookArchive } from './BookArchive';
import { BookCover } from './BookCover';
import demos from '../content/books.demo.json';
import { validateCatalog } from '../lib/catalog';
const books = validateCatalog(demos);
beforeEach(() => window.history.replaceState(null, '', '/'));
describe('Catalogo M2', () => {
  it('non riapre il pannello se popstate cambia soltanto la sezione', async () => {
    const user = userEvent.setup();
    render(<BookArchive books={books} />);
    await user.click(screen.getByRole('button', { name: 'Libro successivo' }));
    history.pushState(null, '', `/?book=${books[1].slug}#indagine`);
    fireEvent.popState(window);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      books[1].title,
    );
  });
  it('mantiene il focus sul libro durante pressioni consecutive delle frecce', async () => {
    const user = userEvent.setup();
    render(<BookArchive books={books} />);
    screen
      .getByRole('button', { name: `Esamina il fascicolo: ${books[0].title}` })
      .focus();
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(
      screen.getByRole('button', {
        name: `Esamina il fascicolo: ${books[2].title}`,
      }),
    ).toHaveFocus();
  });
  it('naviga con frecce e tastiera, aggiornando lo slug senza nuove voci di history', async () => {
    const user = userEvent.setup();
    render(<BookArchive books={books} />);
    const length = history.length;
    await user.click(screen.getByRole('button', { name: 'Libro successivo' }));
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      books[1].title,
    );
    expect(new URL(location.href).searchParams.get('book')).toBe(books[1].slug);
    await user.keyboard('{End}');
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      books.at(-1)!.title,
    );
    expect(history.length).toBe(length);
  });
  it('naviga con swipe orizzontale e preserva lo scroll verticale', () => {
    const { container } = render(<BookArchive books={books} />);
    const stage = container.querySelector('.carousel-stage')!;
    fireEvent.touchStart(stage, {
      changedTouches: [{ clientX: 220, clientY: 100 }],
    });
    fireEvent.touchEnd(stage, {
      changedTouches: [{ clientX: 100, clientY: 110 }],
    });
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      books[1].title,
    );
    fireEvent.touchStart(stage, {
      changedTouches: [{ clientX: 220, clientY: 100 }],
    });
    fireEvent.touchEnd(stage, {
      changedTouches: [{ clientX: 210, clientY: 220 }],
    });
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      books[1].title,
    );
  });
  it('legge lo slug e riallinea la selezione al popstate', () => {
    history.replaceState(null, '', `/?book=${books[1].slug}`);
    render(<BookArchive books={books} />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      books[1].title,
    );
    history.replaceState(null, '', `/?book=${books[2].slug}`);
    fireEvent.popState(window);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      books[2].title,
    );
  });
  it('segnala slug invalido senza bloccare il primo libro', () => {
    history.replaceState(null, '', '/?book=non-esiste');
    render(<BookArchive books={books} />);
    expect(
      screen.getByText('Il fascicolo richiesto non è disponibile.'),
    ).toBeVisible();
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      books[0].title,
    );
  });
  it('non mostra controlli per catalogo vuoto', () => {
    render(<BookArchive books={[]} />);
    expect(screen.getByText('Archivio in preparazione.')).toBeVisible();
    expect(screen.queryByRole('button')).toBeNull();
  });
  it('disabilita frecce per un libro e non duplica le cover per due libri', () => {
    const { rerender, container } = render(
      <BookArchive books={books.slice(0, 1)} />,
    );
    expect(
      screen.getByRole('button', { name: 'Libro successivo' }),
    ).toBeDisabled();
    expect(container.querySelectorAll('img')).toHaveLength(1);
    rerender(<BookArchive books={books.slice(0, 2)} />);
    expect(container.querySelectorAll('img')).toHaveLength(2);
    expect(
      new Set([...container.querySelectorAll('img')].map((img) => img.src))
        .size,
    ).toBe(2);
  });
  it('mantiene titolo e autore quando la copertina fallisce', () => {
    render(<BookCover book={books[0]} />);
    fireEvent.error(screen.getByRole('img'));
    expect(screen.getByText('Copertina non disponibile')).toBeVisible();
    expect(screen.getByText(books[0].title)).toBeVisible();
  });
});
