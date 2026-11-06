import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import raw from './books.json';
import { validateCatalog } from '../lib/catalog';
describe('Import delle fotografie personali', () => {
  it('include gli undici titoli reali senza demo', () => {
    const books = validateCatalog(raw);
    expect(books).toHaveLength(11);
    expect(
      books.every(
        (book) =>
          book.visible && !book.demo && book.isbn13 && book.provenance?.photo,
      ),
    ).toBe(true);
  });
  it('include solo undici link acquisto HTTPS verificati e senza affiliazione', () => {
    const books = validateCatalog(raw);
    expect(
      books.every(
        (book) => book.amazonUrl && book.provenance?.amazonVerifiedOn,
      ),
    ).toBe(true);
    expect(books.every((book) => new URL(book.amazonUrl!).search === '')).toBe(
      true,
    );
  });
  it('conserva Unicode e le edizioni fotografate', () => {
    expect(raw.find((book) => book.slug === 'vino')).toMatchObject({
      author: 'Ophélie Neiman',
      isbn13: '9788809954090',
      edition: '2022',
    });
    expect(raw.find((book) => book.slug === 'clean-code')).toMatchObject({
      title: 'Clean Code — Nuova edizione',
      isbn13: '9788850339792',
      edition: '2026',
    });
  });
  it('distribuisce solo file WebP presenti e decodificabili come contenitori WebP', () => {
    for (const book of raw)
      for (const asset of [book.cover.src, book.cover.smallSrc]) {
        const url = resolve('public', asset);
        expect(existsSync(url)).toBe(true);
        const data = readFileSync(url);
        expect(data.subarray(0, 4).toString()).toBe('RIFF');
        expect(data.subarray(8, 12).toString()).toBe('WEBP');
      }
  });
});
