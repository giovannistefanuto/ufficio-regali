"""Offline adaptation of Bookly CoverResolver (lib/data/cover_service.dart).

ISBN-10 Amazon Legacy -> Open Library -> verified publisher og:image.
Decode every candidate, reject dummy <64px or <=128 bytes. No browser fetches.
Requires Pillow, only for lossless aspect-ratio resizing and WebP compression.
"""
import argparse
import html
import io
import json
import re
import time
import urllib.request
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
UA = 'UfficioRegali/1.0 (offline-cover-resolver; based on Bookly)'

def fetch(url):
    request = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': 'image/jpeg,image/png,image/*;q=0.8,text/html;q=0.5'})
    with urllib.request.urlopen(request, timeout=15) as response:
        data = response.read(8 * 1024 * 1024 + 1)
        if len(data) > 8 * 1024 * 1024:
            raise ValueError('Asset larger than 8 MB')
        return data, response.headers.get('Content-Type', ''), response.url

def isbn10(isbn):
    if not isbn.startswith('978'):
        return None
    digits = isbn[3:12]
    check = (11 - sum(int(c) * (10-i) for i,c in enumerate(digits)) % 11) % 11
    return digits + ('X' if check == 10 else str(check))

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--refresh', action='store_true')
    args = parser.parse_args()
    manifest = json.loads((ROOT / 'scripts/prepare-books/manifest.json').read_text(encoding='utf-8'))
    out = ROOT / 'public/covers'
    out.mkdir(parents=True, exist_ok=True)
    report_path = ROOT / 'docs/cover-sources.json'
    report = {} if args.refresh or not report_path.exists() else json.loads(report_path.read_text(encoding='utf-8'))
    for book in manifest:
        slug = book['slug']
        if slug in report and (out / f'{slug}.webp').exists():
            print(slug, 'cached', flush=True)
            continue
        candidates = []
        asin = isbn10(book['isbn13'])
        if asin:
            candidates.append(f'https://images-na.ssl-images-amazon.com/images/P/{asin}.01.LZZZZZZZ.jpg')
        candidates.append(f'https://covers.openlibrary.org/b/isbn/{book["isbn13"]}-L.jpg?default=false')
        if book.get('coverOverride'):
            candidates.append(book['coverOverride'])
        attempts = []
        found = False
        for candidate in candidates:
            if 'openlibrary' in candidate:
                time.sleep(1)
            try:
                data, content_type, final_url = fetch(candidate)
                if len(data) <= 128 or content_type.startswith(('text/', 'application/')):
                    raise ValueError('Non-image or dummy response')
                image = Image.open(io.BytesIO(data))
                image.load()
                if min(image.size) < 64:
                    raise ValueError('Placeholder smaller than 64px')
                source_size = image.size
                image = image.convert('RGB')
                image.thumbnail((960, 960), Image.Resampling.LANCZOS)
                image.save(out / f'{slug}.webp', 'WEBP', quality=86)
                small = image.copy()
                small.thumbnail((480, 480), Image.Resampling.LANCZOS)
                small.save(out / f'{slug}-480.webp', 'WEBP', quality=82)
                report[slug] = {'source': final_url, 'width': image.width, 'height': image.height, 'originalWidth': source_size[0], 'originalHeight': source_size[1], 'verifiedOn': '2026-11-04', 'attempts': attempts, 'visualVerified': False}
                print(slug, f'{image.width}x{image.height}', final_url, flush=True)
                found = True
                break
            except Exception as error:
                attempts.append({'url': candidate, 'error': str(error)})
        if not found:
            report[slug] = {'missing': True, 'attempts': attempts}
            print(slug, 'NO COVER', flush=True)
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')

if __name__ == '__main__':
    main()
