import { copy } from '../content/copy';
import type { Book } from '../types/book';
import { useBookNavigation } from '../app/useBookNavigation';
import { BookCarousel } from './BookCarousel';
import { BookDetailsPanel } from './BookDetailsPanel';
export function BookArchive({ books }: { books: Book[] }) {
  const navigation = useBookNavigation(books);
  const book = books[navigation.selectedIndex];
  const open = navigation.open;
  return (
    <section
      id="archivio"
      className="archive section container"
      aria-labelledby="archive-title"
      tabIndex={-1}
    >
      <div className="archive-intro">
        <h2 id="archive-title">{copy.archive.title}</h2>
        <p>Usa le frecce o scorri per esplorare i libri.</p>
      </div>
      {navigation.invalidSlug ? (
        <p className="archive-message" role="status">
          Il fascicolo richiesto non è disponibile.
        </p>
      ) : null}
      {book ? (
        <>
          <BookCarousel
            books={books}
            selectedIndex={navigation.selectedIndex}
            onSelect={navigation.select}
            onOpen={open}
          />
          <div className="selected-book">
            <div>
              {book.demo && <p className="eyebrow">LIBRO DIMOSTRATIVO</p>}
              <h3>{book.title}</h3>
              <p className="book-author">{book.author}</p>
            </div>
          </div>
          <p
            className="sr-only"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {book.title}, {book.author}. Fascicolo{' '}
            {navigation.selectedIndex + 1} di {books.length}.
          </p>
          <button
            id="archive-open"
            type="button"
            className="button button-primary archive-open"
            onClick={open}
          >
            Esamina il fascicolo <span aria-hidden="true">↗</span>
          </button>
          {navigation.isPanelOpen ? (
            <BookDetailsPanel
              key={book.id}
              book={book}
              number={navigation.selectedIndex + 1}
              onClose={navigation.close}
            />
          ) : null}
        </>
      ) : (
        <div className="archive-empty">
          <h3>Archivio in preparazione.</h3>
          <p>Nessun libro disponibile per la consultazione.</p>
        </div>
      )}
    </section>
  );
}
