import type { Book } from '../types/book';
export function readBookLocation(books: Book[], href = window.location.href) {
  const slug = new URL(href).searchParams.get('book');
  const index =
    slug === null ? -1 : books.findIndex((book) => book.slug === slug);
  return {
    selectedIndex: Math.max(0, index),
    isPanelOpen: index >= 0,
    invalidSlug: slug !== null && index < 0,
  };
}
export function bookUrl(slug: string, href = window.location.href): string {
  const url = new URL(href);
  url.searchParams.set('book', slug);
  url.hash = 'archivio';
  return url.href;
}
