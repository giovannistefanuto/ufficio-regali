import type { Book } from '../types/book';
const identifier = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const localAsset = /^covers\/[a-zA-Z0-9_-]+\.(webp|jpg|jpeg|png|svg)$/;
export function isAmazonUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      ['amazon.it', 'www.amazon.it'].includes(url.hostname) &&
      !url.username &&
      !url.password &&
      !url.port &&
      /^\/(?:dp|gp\/product)\/[A-Z0-9]{10}\/?$/.test(url.pathname) &&
      !url.search &&
      !url.hash
    );
  } catch {
    return false;
  }
}
export function isValidIsbn13(value: string): boolean {
  return (
    /^97[89]\d{10}$/.test(value) &&
    [...value].reduce(
      (sum, char, index) => sum + Number(char) * (index % 2 ? 3 : 1),
      0,
    ) %
      10 ===
      0
  );
}
export function validateCatalog(input: unknown): Book[] {
  if (!Array.isArray(input))
    throw new Error('Catalogo: è richiesto un array di libri.');
  const ids = new Set<string>();
  const slugs = new Set<string>();
  for (const [index, item] of input.entries()) {
    const fail = (message: string): never => {
      throw new Error(`Catalogo, riga ${index + 1}: ${message}`);
    };
    if (!item || typeof item !== 'object') fail('libro non valido.');
    const book = item as Book;
    for (const field of ['id', 'slug'] as const) {
      if (typeof book[field] !== 'string' || !identifier.test(book[field]))
        fail(`${field} non valido.`);
      const seen = field === 'id' ? ids : slugs;
      if (seen.has(book[field])) fail(`${field} duplicato: ${book[field]}.`);
      seen.add(book[field]);
    }
    for (const field of ['title', 'author', 'officeNote'] as const)
      if (typeof book[field] !== 'string' || !book[field].trim())
        fail(`${field} vuoto.`);
    if (book.officeNote.length > 140) fail('officeNote supera 140 caratteri.');
    for (const field of ['spineColor', 'accentColor'] as const)
      if (!/^#[\da-f]{6}$/i.test(book[field]))
        fail(`${field} deve essere un colore hex.`);
    if (
      ![
        'interesse-confermato',
        'segnalazione-ricorrente',
        'acquisto-rimandato',
      ].includes(book.evidenceTag)
    )
      fail('evidenceTag non valido.');
    if (typeof book.visible !== 'boolean' || !Number.isFinite(book.order))
      fail('visible/order non validi.');
    if (
      !book.cover ||
      !localAsset.test(book.cover.src) ||
      (book.cover.smallSrc && !localAsset.test(book.cover.smallSrc))
    )
      fail('percorso copertina non valido.');
    if (
      ![book.cover.width, book.cover.height].every(
        (n) => Number.isInteger(n) && n >= 64 && n <= 4000,
      )
    )
      fail('dimensioni copertina non valide.');
    if (!book.cover.alt?.trim() || !book.cover.source?.trim())
      fail('alt/provenienza della copertina mancanti.');
    if (book.isbn13 && !isValidIsbn13(book.isbn13))
      fail('checksum ISBN-13 errato.');
    if (
      book.amazonUrl &&
      (!isAmazonUrl(book.amazonUrl) || !book.provenance?.amazonVerifiedOn)
    )
      fail('URL Amazon non valido o privo di verifica.');
    if (
      !book.demo &&
      (!book.provenance?.photo ||
        !book.provenance?.metadataUrl ||
        !book.provenance?.verifiedOn)
    )
      fail('provenienza del libro reale mancante.');
  }
  return input as Book[];
}
export function visibleBooks(books: Book[]): Book[] {
  return books.filter((book) => book.visible).sort((a, b) => a.order - b.order);
}
