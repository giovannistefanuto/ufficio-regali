import { useEffect, useRef, useState } from 'react';
import { assetUrl } from '../lib/assets';

const sections = [
  ['top', 'Home'],
  ['archivio', 'I libri'],
  ['indagine', "L'indagine"],
  ['metodologia', 'Metodologia'],
] as const;

export function SiteHeader({ page = 'top' }: { page?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [isOpen]);

  return (
    <header
      ref={header}
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && isOpen) {
          setIsOpen(false);
          toggle.current?.focus();
        }
      }}
    >
      <div className="header-inner container">
        <a
          className="brand"
          href="#top"
          title="Inizio pagina"
          onClick={() => {
            setIsOpen(false);
            const url = new URL(window.location.href);
            if (url.searchParams.has('book')) {
              url.searchParams.delete('book');
              window.history.replaceState(window.history.state, '', url);
            }
          }}
        >
          <img
            className="brand-symbol"
            src={assetUrl('brand-mark.svg')}
            width="52"
            height="52"
            alt=""
          />
          <span className="brand-wordmark">
            Ufficio <span>Regali</span>
          </span>
        </a>
        <button
          className="menu-toggle"
          ref={toggle}
          type="button"
          aria-expanded={isOpen}
          aria-controls="site-navigation"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{isOpen ? 'Chiudi' : 'Menu'}</span>
          <span aria-hidden="true">{isOpen ? '×' : '☰'}</span>
        </button>
        <nav
          id="site-navigation"
          aria-label="Navigazione principale"
          className={isOpen ? 'navigation is-open' : 'navigation'}
        >
          {sections.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={page === id ? 'page' : undefined}
              onClick={() => {
                setIsOpen(false);
                const url = new URL(window.location.href);
                if (
                  url.searchParams.has('book') &&
                  (page !== id || id !== 'archivio')
                ) {
                  url.searchParams.delete('book');
                  window.history.replaceState(window.history.state, '', url);
                }
              }}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
