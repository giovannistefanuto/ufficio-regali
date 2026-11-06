import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { validateCatalog } from '../src/lib/catalog.ts';
const books = validateCatalog(
  JSON.parse(
    readFileSync(new URL('../src/content/books.json', import.meta.url), 'utf8'),
  ),
);
for (const book of books) {
  for (const src of [book.cover.src, book.cover.smallSrc].filter(Boolean)) {
    const path = new URL(`../public/${src}`, import.meta.url);
    if (!existsSync(path))
      console.warn(
        `Copertina mancante: ${fileURLToPath(path)} — verrà usato il fallback.`,
      );
  }
}
console.log(
  `Catalogo valido: ${books.length} libri, ${books.filter((book) => book.visible).length} visibili.`,
);
