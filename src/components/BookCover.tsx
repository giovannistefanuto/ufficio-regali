import { useState } from 'react';
import type { Book } from '../types/book';
import { assetUrl } from '../lib/assets';
export function BookCover({
  book,
  priority = false,
}: {
  book: Book;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className="book-cover"
      style={{ aspectRatio: `${book.cover.width} / ${book.cover.height}` }}
    >
      {failed ? (
        <div className="cover-fallback">
          <span>UR.</span>
          <strong>{book.title}</strong>
          <span>{book.author}</span>
          <small>Copertina non disponibile</small>
        </div>
      ) : (
        <img
          src={assetUrl(book.cover.src)}
          srcSet={
            book.cover.smallSrc
              ? `${assetUrl(book.cover.smallSrc)} ${Math.round(book.cover.width * Math.min(1, 480 / Math.max(book.cover.width, book.cover.height)))}w, ${assetUrl(book.cover.src)} ${book.cover.width}w`
              : undefined
          }
          sizes="(max-width: 700px) 65vw, 320px"
          width={book.cover.width}
          height={book.cover.height}
          alt={book.cover.alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
