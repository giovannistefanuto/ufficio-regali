"""Read publisher metadata and purchase links; no descriptions or credentials."""
import json
import re
import html
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
pages = {
    'sviluppare-large-language-model': 'https://www.apogeonline.com/libri/sviluppare-large-language-model-sebastian-raschka/',
    'liberi-tutti': 'https://www.feltrinellieditore.it/opera/liberi-tutti-1/',
    'git': 'https://www.apogeonline.com/libri/git-ferdinando-santacroce/',
    'clean-code': 'https://www.apogeonline.com/libri/clean-code-nuova-edizione-robert-c-martin/',
    'ai-hacking': 'https://www.apogeonline.com/libri/ai-hacking-harriet-farlow/',
    'genai-trading': 'https://www.apogeonline.com/libri/genai-trading-hamlet-jesse-medina-ruiz-ernest-p-chan/',
    'storia-umana-intelligenza-artificiale': 'https://www.laterza.it/scheda-libro/?isbn=9788858161906',
    'atomic-habits': 'https://www.deagostinilibri.it/libri/piccole-abitudini-per-grandi-cambiamenti',
    'vino': 'https://giunti.it/products/vino-manuale-per-aspiranti-intenditori-neiman-ophelie-9788809815360',
}
results = {}
for slug, url in pages.items():
    try:
        request = urllib.request.Request(url, headers={'User-Agent': 'UfficioRegali/1.0 (offline catalog preparation)'})
        with urllib.request.urlopen(request, timeout=20) as response:
            page = response.read(4_000_000).decode('utf-8', errors='replace')
        links = [html.unescape(link).replace('\\/', '/') for link in re.findall(r'https?[^\s<>"\']+', page)]
        amazon = sorted(set(link for link in links if 'amazon.' in link))
        covers = sorted(set(link for link in links if re.search(r'\.(jpg|jpeg|png|webp)', link, re.I) and ('cover' in link.lower() or 'copertin' in link.lower() or '978' in link)))[:10]
        isbn = sorted(set(re.findall(r'97[89]\d{10}', page)))
        results[slug] = {'url': url, 'amazon': amazon, 'covers': covers, 'isbnCandidates': isbn}
        print(slug, json.dumps(results[slug], ensure_ascii=False), flush=True)
    except Exception as error:
        results[slug] = {'url': url, 'error': str(error)}
        print(slug, str(error), flush=True)
(ROOT / 'docs' / 'publisher-inspection.json').write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding='utf-8')
