import { copy } from '../content/copy';
import type { Book } from '../types/book';
import { Book3D } from './Book3D';

export function HeroSection({ book }: { book?: Book }) {
  return (
    <section className="hero container" aria-labelledby="hero-title">
      <div className="hero-layout">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" aria-hidden="true" />
            {copy.hero.eyebrow}
          </p>
          <h1 id="hero-title">
            Un regalo <br />
            per <em>Giovanni?</em>
          </h1>
          <h2 className="hero-support">{copy.hero.support}</h2>
          <p>{copy.hero.body}</p>
          <p>{copy.hero.result}</p>
          <div className="hero-actions">
            <a
              className="button button-primary"
              href="#archivio"
              onClick={() => {
                const url = new URL(window.location.href);
                if (url.searchParams.has('book')) {
                  url.searchParams.delete('book');
                  window.history.replaceState(window.history.state, '', url);
                }
              }}
            >
              Consulta i risultati <span aria-hidden="true">→</span>
            </a>
            <a className="story-link" href="#indagine">
              Scopri come abbiamo fatto <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <div className="hero-preview">
          {book ? (
            <div className="hero-evidence">
              <Book3D book={book} priority />
            </div>
          ) : null}
          <div className="hero-result">
            <p>Abbiamo trovato dei libri.</p>
            <span>I risultati sono disponibili per la consultazione.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
