import type { CSSProperties } from 'react';
import type { Book } from '../types/book';
import { BookCover } from './BookCover';
export function Book3D({
  book,
  priority = false,
}: {
  book: Book;
  priority?: boolean;
}) {
  return (
    <div
      className="book-perspective"
      style={
        {
          '--book-color': book.spineColor,
          '--book-accent': book.accentColor,
        } as CSSProperties
      }
    >
      <div className="book-object">
        <span className="book-spine" aria-hidden="true" />
        <span className="book-pages" aria-hidden="true" />
        <div className="book-front">
          <BookCover key={book.id} book={book} priority={priority} />
        </div>
      </div>
    </div>
  );
}
