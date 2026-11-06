"""Export only visually verified editions; purchase links need observed ISBN."""
import json
from urllib.parse import urlsplit
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
manifest = json.loads((ROOT / 'scripts/prepare-books/manifest.json').read_text(encoding='utf-8'))
covers = json.loads((ROOT / 'docs/cover-sources.json').read_text(encoding='utf-8'))
amazon_path = ROOT / 'docs/amazon-verification.json'
purchase = json.loads(amazon_path.read_text(encoding='utf-8-sig')) if amazon_path.exists() else []
if isinstance(purchase, dict):
    purchase = [purchase]
amazon = {row['slug']: row for row in purchase}
books = []
for number, item in enumerate(manifest, 1):
    slug = item['slug']
    cover = covers[slug]
    if not cover.get('visualVerified') or cover.get('missing'):
        raise ValueError(f'{slug}: cover needs visual verification before import')
    book = {key: item[key] for key in ['slug', 'title', 'author', 'isbn13', 'publisher', 'edition', 'subtitle'] if item.get(key)}
    book.update(id=f'b{number:03}', cover={
        'src': f'covers/{slug}.webp', 'smallSrc': f'covers/{slug}-480.webp',
        'width': cover['width'], 'height': cover['height'],
        'alt': f'Copertina di {item["title"]}, {item["author"]}', 'source': cover['source'],
    }, spineColor=item['color'], accentColor=item['color'], evidenceTag='interesse-confermato',
        officeNote='Le indagini hanno prodotto risultati concreti.', visible=True, order=number,
        provenance={'photo': f'FOTO INIZIALI LIBRO/{item["photo"]}', 'metadataUrl': item['metadataUrl'], 'verifiedOn': '2026-11-04'})
    verification = amazon.get(slug, {})
    observed = verification.get('observed') or {}
    publisher = verification.get('publisherVerification') or {}
    publisher_confirmed = (
        publisher.get('isbn') == item['isbn13']
        and publisher.get('sourceUrl') == f'https://www.deagostinilibri.it/acquista/{item["isbn13"]}/cartaceo/amazon'
        and urlsplit(publisher.get('redirectUrl', '')).hostname == 'www.amazon.it'
        and f'https://www.amazon.it{urlsplit(publisher.get("redirectUrl", "")).path}' == verification.get('candidate')
    )
    if verification.get('expectedIsbn') == item['isbn13'] and ((observed.get('isbnConfirmed') and observed.get('title')) or publisher_confirmed):
        book['amazonUrl'] = verification['candidate']
        book['provenance']['amazonVerifiedOn'] = verification['checkedOn']
    books.append(book)
(ROOT / 'src/content/books.json').write_text(json.dumps(books, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Exported {len(books)} books; {sum(bool(book.get("amazonUrl")) for book in books)} verified purchase links.')
