import { useEffect, useRef, useState } from 'react';
import type { Book } from '../types/book';
import { bookUrl } from '../lib/urlState';
import { isAmazonUrl } from '../lib/catalog';
import { shareBook } from '../lib/share';
import { BookCover } from './BookCover';

export function BookDetailsPanel({
  book,
  onClose,
}: {
  book: Book;
  number: number;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [feedback, setFeedback] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const [sharing, setSharing] = useState(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    const element = dialog.current!;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    closeButton.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      mounted.current = false;
      if (element.open) element.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected && previousFocus !== document.body)
        previousFocus.focus({ preventScroll: true });
      else
        document.getElementById('archive-open')?.focus({ preventScroll: true });
    };
  }, []);
  const onShare = async () => {
    setSharing(true);
    setFeedback('');
    const url = bookUrl(book.slug);
    const result = await shareBook(book.title, url);
    if (!mounted.current) return;
    setSharing(false);
    if (result === 'manual') {
      setManualUrl(url);
      setFeedback('Seleziona e copia il link del fascicolo.');
    } else if (result === 'copied') setFeedback('Link del fascicolo copiato.');
    else if (result === 'shared') setFeedback('Fascicolo condiviso.');
  };
  const canBuy = Boolean(book.amazonUrl && isAmazonUrl(book.amazonUrl));
  return (
    <dialog
      ref={dialog}
      className="book-dialog"
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const focusable = [
          ...event.currentTarget.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], input:not([disabled])',
          ),
        ];
        const first = focusable[0];
        const last = focusable.at(-1);
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === event.currentTarget)
        ) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      aria-labelledby="panel-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== dialog.current) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          onClose();
      }}
    >
      <div className="panel-header">
        <p className="eyebrow">
          DETTAGLI DEL LIBRO{book.demo ? ' · DEMO' : ''}
        </p>
        <button
          type="button"
          className="panel-close"
          ref={closeButton}
          onClick={onClose}
          aria-label="Chiudi il fascicolo"
        >
          ×
        </button>
      </div>
      <div
        className="panel-body"
        role="region"
        aria-label="Dettagli del libro"
        tabIndex={0}
      >
        <div className="panel-cover">
          <BookCover book={book} />
        </div>
        <h2 id="panel-title">{book.title}</h2>
        {book.subtitle ? (
          <p className="panel-subtitle">{book.subtitle}</p>
        ) : null}
        <p className="book-author">{book.author}</p>
        {book.demo ? (
          <p className="archive-message">
            Libro dimostrativo. Nessun titolo reale.
          </p>
        ) : null}
        {book.publisher || book.isbn13 ? (
          <dl className="book-metadata">
            {book.publisher ? (
              <>
                <dt>Editore</dt>
                <dd>{book.publisher}</dd>
              </>
            ) : null}
            {book.edition ? (
              <>
                <dt>Edizione</dt>
                <dd>{book.edition}</dd>
              </>
            ) : null}
            {book.isbn13 ? (
              <>
                <dt>ISBN</dt>
                <dd>{book.isbn13}</dd>
              </>
            ) : null}
          </dl>
        ) : null}
      </div>
      <div className="panel-footer">
        <div className="panel-actions">
          {canBuy ? (
            <a
              className="button button-primary"
              href={book.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Apri su Amazon <span aria-hidden="true">↗</span>
              <span className="sr-only">(nuova scheda)</span>
            </a>
          ) : (
            <>
              <button
                type="button"
                className="button button-primary"
                disabled
                aria-describedby="purchase-unavailable"
              >
                Apri su Amazon <span aria-hidden="true">↗</span>
              </button>
              <p className="microcopy" id="purchase-unavailable">
                Link acquisto non ancora disponibile.
              </p>
            </>
          )}
          <button
            type="button"
            className="button button-outline"
            disabled={sharing}
            onClick={() => {
              void onShare();
            }}
          >
            Condividi il fascicolo <span aria-hidden="true">↗</span>
          </button>
        </div>
        <p className="share-feedback microcopy" role="status">
          {feedback}
        </p>
        {manualUrl ? (
          <label className="share-manual">
            Link del fascicolo
            <input
              type="text"
              readOnly
              value={manualUrl}
              onFocus={(event) => event.currentTarget.select()}
              onClick={(event) => event.currentTarget.select()}
            />
          </label>
        ) : null}
        <p className="microcopy">
          Prezzo e disponibilità sono determinati dal rivenditore.
        </p>
      </div>
    </dialog>
  );
}
