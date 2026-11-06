import { useEffect, useLayoutEffect, useRef } from 'react';
import type { Book } from '../types/book';
import { Book3D } from './Book3D';
import { assetUrl } from '../lib/assets';
function carouselItems(length: number, selectedIndex: number) {
  if (!length) return [];
  const current = { index: selectedIndex, position: 'center' };
  if (length === 1) return [current];
  const next = { index: (selectedIndex + 1) % length, position: 'next' };
  return length === 2
    ? [current, next]
    : [
        { index: (selectedIndex - 1 + length) % length, position: 'previous' },
        current,
        next,
      ];
}
interface Props {
  books: Book[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onOpen?: () => void;
}
export function BookCarousel({
  books,
  selectedIndex,
  onSelect,
  onOpen,
}: Props) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const carousel = useRef<HTMLDivElement>(null);
  const restoreKeyboardFocus = useRef(false);
  useLayoutEffect(() => {
    if (restoreKeyboardFocus.current) {
      carousel.current
        ?.querySelector<HTMLButtonElement>('.book-trigger')
        ?.focus({ preventScroll: true });
      restoreKeyboardFocus.current = false;
    }
  }, [selectedIndex]);
  useEffect(() => {
    for (const { index } of carouselItems(books.length, selectedIndex)) {
      if (index !== selectedIndex) {
        const image = new Image();
        image.src = assetUrl(
          books[index].cover.smallSrc || books[index].cover.src,
        );
      }
    }
  }, [books, selectedIndex]);
  return (
    <div
      ref={carousel}
      className="carousel"
      role="group"
      aria-roledescription="carosello"
      aria-label="Libri individuati"
      onKeyDown={(event) => {
        if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
          event.preventDefault();
          const target =
            event.key === 'Home'
              ? 0
              : event.key === 'End'
                ? books.length - 1
                : selectedIndex + (event.key === 'ArrowRight' ? 1 : -1);
          restoreKeyboardFocus.current =
            event.target instanceof HTMLElement &&
            Boolean(event.target.closest('.book-trigger')) &&
            ((target % books.length) + books.length) % books.length !==
              selectedIndex;
          onSelect(target);
        }
      }}
    >
      <div
        className="carousel-stage"
        onTouchStart={(event) => {
          const t = event.changedTouches[0];
          if (t) start.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchCancel={() => {
          start.current = null;
        }}
        onTouchEnd={(event) => {
          const t = event.changedTouches[0];
          const from = start.current;
          start.current = null;
          if (!t || !from || books.length < 2) return;
          const dx = t.clientX - from.x;
          const dy = t.clientY - from.y;
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4)
            onSelect(selectedIndex + (dx < 0 ? 1 : -1));
        }}
      >
        {carouselItems(books.length, selectedIndex).map(
          ({ index, position }) => (
            <div
              key={books[index].id}
              className={`carousel-slot slot-${position}`}
            >
              {position === 'center' ? (
                <button
                  className="book-trigger"
                  type="button"
                  onClick={onOpen}
                  aria-label={`Esamina il fascicolo: ${books[index].title}`}
                  aria-current="true"
                >
                  <Book3D book={books[index]} priority />
                </button>
              ) : (
                <button
                  type="button"
                  className="book-preview preview-button"
                  onClick={() => onSelect(index)}
                  aria-label={`Seleziona ${books[index].title}`}
                >
                  <Book3D book={books[index]} />
                </button>
              )}
            </div>
          ),
        )}
      </div>
      <div className="carousel-controls">
        <button
          type="button"
          className="arrow-button"
          aria-label="Libro precedente"
          disabled={books.length < 2}
          onClick={() => onSelect(selectedIndex - 1)}
        >
          <span aria-hidden="true">←</span>
          <span className="arrow-label">Precedente</span>
        </button>
        <span className="eyebrow">
          Libro {selectedIndex + 1} di {books.length}
        </span>
        <button
          type="button"
          className="arrow-button"
          aria-label="Libro successivo"
          disabled={books.length < 2}
          onClick={() => onSelect(selectedIndex + 1)}
        >
          <span className="arrow-label">Successivo</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
