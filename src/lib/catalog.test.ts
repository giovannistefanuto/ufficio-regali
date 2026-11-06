import { describe, expect, it } from 'vitest';
import {
  isAmazonUrl,
  isValidIsbn13,
  validateCatalog,
  visibleBooks,
} from './catalog';
import { bookUrl, readBookLocation } from './urlState';
import raw from '../content/books.demo.json';
describe('Contratti catalogo', () => {
  it('accetta catalogo e stato vuoto', () => {
    expect(validateCatalog(raw)).toHaveLength(raw.length);
    expect(validateCatalog([])).toEqual([]);
  });
  it('rifiuta duplicati, path pericolosi, metadati vuoti e ISBN errati', () => {
    expect(() => validateCatalog([raw[0], raw[0]])).toThrow(/duplicato/);
    expect(() => validateCatalog([{ ...raw[0], title: '' }])).toThrow(/title/);
    expect(() =>
      validateCatalog([
        { ...raw[0], cover: { ...raw[0].cover, src: '../segreti' } },
      ]),
    ).toThrow(/percorso/);
    expect(() =>
      validateCatalog([{ ...raw[0], isbn13: '9788850339000' }]),
    ).toThrow(/ISBN/);
    expect(isValidIsbn13('9788850339006')).toBe(true);
  });
  it('verifica host Amazon esatto, HTTPS e attestazione di verifica', () => {
    expect(isAmazonUrl('https://www.amazon.it/dp/8850339003')).toBe(true);
    for (const bad of [
      'https://amazon.it.evil.com/dp/8850339003',
      'http://amazon.it/dp/8850339003',
      'https://evil.com/amazon',
      'https://www.amazon.it/dp/8850339003?tag=tracking',
    ])
      expect(isAmazonUrl(bad)).toBe(false);
    expect(() =>
      validateCatalog([
        {
          ...raw[0],
          amazonUrl: 'https://www.amazon.it/dp/8850339003',
          provenance: undefined,
        },
      ]),
    ).toThrow(/verifica/);
  });
  it('filtra invisibili e mantiene ordine', () => {
    const books = validateCatalog(raw);
    expect(
      visibleBooks([{ ...books[0], visible: false }, ...books.slice(1)]),
    ).toHaveLength(books.length - 1);
  });
  it('preserva base, query esistenti e interpreta slug validi/invalidi', () => {
    const books = validateCatalog(raw);
    const url = bookUrl(
      books[1].slug,
      'https://example.org/ufficio-regali/?lang=it',
    );
    expect(url).toContain('/ufficio-regali/?lang=it&book=');
    expect(readBookLocation(books, url)).toEqual({
      selectedIndex: 1,
      isPanelOpen: true,
      invalidSlug: false,
    });
    expect(readBookLocation([], url).invalidSlug).toBe(true);
  });
});
