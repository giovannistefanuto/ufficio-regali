import { SiteHeader } from '../components/SiteHeader';
import { HeroSection } from '../components/HeroSection';
import { InvestigationSection } from '../components/InvestigationSection';
import { BookArchive } from '../components/BookArchive';
import { MethodologySection } from '../components/MethodologySection';
import { SiteFooter } from '../components/SiteFooter';
import rawBooks from '../content/books.json';
import { validateCatalog, visibleBooks } from '../lib/catalog';
import { useEffect, useRef, useState } from 'react';

const books = visibleBooks(validateCatalog(rawBooks));

function currentPage(): string {
  const hash = window.location.hash.slice(1);
  if (['archivio', 'indagine', 'metodologia'].includes(hash)) return hash;
  if (hash === 'top') return 'top';
  return new URLSearchParams(window.location.search).has('book')
    ? 'archivio'
    : 'top';
}

export function App() {
  const [page, setPage] = useState(currentPage);
  const previousPage = useRef(page);
  useEffect(() => {
    if (previousPage.current !== page) {
      previousPage.current = page;
      if (!document.querySelector('dialog[open]')) {
        document.getElementById('main')?.focus({ preventScroll: true });
      }
    }
  }, [page]);
  useEffect(() => {
    const update = () => {
      setPage(currentPage());
      window.scrollTo?.(0, 0);
    };
    window.addEventListener('hashchange', update);
    window.addEventListener('popstate', update);
    return () => {
      window.removeEventListener('hashchange', update);
      window.removeEventListener('popstate', update);
    };
  }, []);
  return (
    <div id="top" className="app-shell">
      <a className="skip-link" href="#main">
        Vai al contenuto
      </a>
      <SiteHeader page={page} />
      <main id="main" tabIndex={-1}>
        {page === 'top' && <HeroSection book={books[0]} />}
        {page === 'indagine' && <InvestigationSection />}
        {page === 'archivio' && <BookArchive books={books} />}
        {page === 'metodologia' && <MethodologySection />}
      </main>
      <SiteFooter />
    </div>
  );
}
