import { useEffect, useRef, useState } from 'react';
import type { Book } from '../types/book';
import { bookUrl, readBookLocation } from '../lib/urlState';
export function useBookNavigation(books: Book[]) {
  const [state, setState] = useState(() => readBookLocation(books));
  const locationSlug = useRef(
    new URL(window.location.href).searchParams.get('book'),
  );
  useEffect(() => {
    const sync = () => {
      const slug = new URL(window.location.href).searchParams.get('book');
      // Native anchor navigation also emits popstate in Chromium. A hash-only
      // change must not reopen the currently closed dossier.
      if (slug === locationSlug.current) return;
      locationSlug.current = slug;
      setState(readBookLocation(books));
    };
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, [books]);
  const select = (index: number) => {
    if (!books.length) return;
    const selectedIndex =
      ((index % books.length) + books.length) % books.length;
    locationSlug.current = books[selectedIndex].slug;
    window.history.replaceState(
      window.history.state,
      '',
      bookUrl(books[selectedIndex].slug),
    );
    setState({ selectedIndex, isPanelOpen: false, invalidSlug: false });
  };
  const open = () => {
    if (!books.length) return;
    locationSlug.current = books[state.selectedIndex].slug;
    window.history.replaceState(
      window.history.state,
      '',
      bookUrl(books[state.selectedIndex].slug),
    );
    setState((prev) => ({ ...prev, isPanelOpen: true, invalidSlug: false }));
  };
  const close = () => setState((prev) => ({ ...prev, isPanelOpen: false }));
  return { ...state, select, open, close };
}
