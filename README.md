# Ufficio Regali

Sito editoriale Ufficio Regali. Implementazione locale **M0–M6** del
`BLUEPRINT_UFFICIO_REGALI_v1.md`, conservato senza modifiche e aggiornata secondo
le successive indicazioni sulla navigazione e sul copy.

## Avvio locale

Richiede Node **22.12+** (Node 22 LTS consigliato) e npm.

```sh
npm ci
npm run dev
```

Aprire l'URL stampato da Vite. Gli script disponibili sono `dev`, `build`,
`preview`, `lint`, `test`, `format` e `format:check`.

```sh
npm run lint
npm run test
npm run build
npm run preview
```

## Struttura e scelte

- `src/components/`: pagine, carosello pseudo-3D, copertine con fallback,
  dettagli accessibili e footer.
- `src/content/books.json`: undici libri reali identificati nelle fotografie.
- `src/content/books.demo.json`: fixture demo utilizzata nei test, separata dal catalogo reale.
- `src/content/copy.ts`: copy baseline approvato, senza nuove battute.
- `src/styles/tokens.css`: palette, tipografia, spaziature e larghezze.
- `src/styles/global.css`: layout responsive e stati accessibili.
- `src/app/useBookNavigation.ts`: selezione e sincronizzazione della query `?book=`.
- `src/lib/`: validazione, URL degli asset, link diretti e condivisione.
- `scripts/prepare-books/`: preparazione offline delle copertine e import verificato.
- `public/favicon.svg`: monogramma UR.
- `qa/`: screenshot reali desktop, mobile, tablet e reflow.
- `docs/CONSEGNA_M0_M1.md`: consegna storica della prima iterazione.
- `docs/CONSEGNA_M2_M6.md`: consegna attuale, verifiche e checklist.

React + TypeScript + Vite; CSS nativo. Instrument Serif, Inter e IBM Plex Mono
sono inclusi nel build tramite Fontsource, con `font-display: swap`: il sito non
richiede Google Fonts o altri servizi a runtime. Nessun backend, analytics,
cookie, libreria di icone o animazioni obbligatorie.

## Hosting GitHub Pages

Il `base` Vite è `/` per lo sviluppo locale. Per un build in sottocartella,
impostare `VITE_BASE_PATH`, includendo gli slash iniziale e finale.

PowerShell:

```powershell
$env:VITE_BASE_PATH = '/nome-repository/'
npm run build
npm run preview
```

Il workflow `.github/workflows/deploy.yml` verifica lint, test e formato, compila
e pubblica Pages sui push a `main` e su avvio manuale. Le pull request eseguono
solo i controlli. La base deriva dal nome reale del repository; per repository
`*.github.io` usa `/`. La variabile repository **VITE_BASE_PATH** permette di
impostare una base diversa, ad esempio `/` per un dominio personalizzato.

Sul repository definitivo selezionare **Settings → Pages → GitHub Actions**.
Il workflow è predisposto ma non è stato eseguito su GitHub. La pubblicazione è
rinviata, su richiesta dell'utente, fino alla prova locale e alla creazione del
repository definitivo. Nessun deploy o commit è stato effettuato.

## Catalogo reale e preparazione offline

Le undici fotografie originali rimangono in `FOTO INIZIALI LIBRO/`. Il sito
distribuisce soltanto le copertine ottimizzate in `public/covers/`. Titoli, autori,
edizioni e ISBN sono riportati nel manifest e nel catalogo; le fonti sono nei
campi `provenance` e `cover.source`.

Il codice Bookly consultato è `lib/data/cover_service.dart` nel repository locale
fornito dall'utente. La pipeline riprende il suo `CoverResolver`: ISBN-10 su
Amazon Legacy CDN, poi Open Library, con rifiuto di risposte non immagine,
placeholder e immagini sotto 64px. Per Atomic Habits viene usata la copertina
ufficiale De Agostini. Le immagini sono state confrontate visivamente con le foto.
Il repository Bookly non è stato modificato; nessuna API o credenziale viene
distribuita al browser.

Per rigenerare gli asset, serve Python con Pillow (solo in preparazione):

```sh
python -m pip install -r scripts/prepare-books/requirements.txt
python scripts/prepare-books/prepare.py
```

Esaminare poi le copertine e aggiornare `visualVerified` in
`docs/cover-sources.json`. L'esportazione rifiuta copertine non verificate:

```sh
python scripts/prepare-books/export-catalog.py
npm run validate:catalog
npm run build
```

I link Amazon sono abilitati dopo una verifica documentata in
`docs/amazon-verification.json`: dieci schede confermate per titolo e ISBN nel
browser, più Atomic Habits tramite il reindirizzamento ufficiale dell'editore
dall'ISBN cartaceo. Tutti i parametri di affiliazione sono rimossi. Prezzi e
disponibilità non vengono importati né promessi.

Per aggiungere un libro: inserire un record nel manifest, verificare l'edizione,
recuperare e confrontare la copertina, documentare la verifica del link acquisto,
riesportare il catalogo. Per approvare note specifiche, modificare `officeNote`
solo dopo revisione editoriale: attualmente tutti i fascicoli usano la frase
baseline «Le indagini hanno prodotto risultati concreti.». Non sono presenti
testimonianze o nuovi riferimenti personali.

La build valida ID/slug unici, campi obbligatori, checksum ISBN, percorsi locali,
dimensioni, tag, colori e link HTTPS del solo host Amazon consentito. Le cover
mancanti generano un avviso e un fallback tipografico; i dati critici errati
fermano la build.

## Interazioni e accessibilità

Frecce, tastiera (←/→, Home/End) e swipe orizzontale selezionano un libro; lo scroll
verticale resta libero. Il fascicolo apre un dialog nativo, laterale su desktop e
bottom sheet su mobile, con focus iniziale, ciclo Tab/Shift+Tab, Escape, backdrop
e ritorno del focus al controllo d'origine.
Le azioni rimangono visibili in fondo al pannello; i dettagli possono essere
scorsi anche da tastiera senza perdere accesso ai pulsanti.

La selezione usa `history.replaceState` per evitare voci duplicate. Anche apertura
e chiusura del pannello non aggiungono voci: il pulsante Indietro non è una
seconda modalità di chiusura della scheda. `popstate` riallinea libro e pannello.
Un accesso diretto `?book=slug` apre il fascicolo; uno slug errato mostra un
messaggio e il primo libro. Un refresh conserva la selezione.

La condivisione prova `navigator.share`, poi gli appunti in contesto sicuro,
infine un URL selezionabile. Nessun messaggio di successo viene mostrato prima
dell'esito dell'API. Il link condiviso punta al fascicolo del sito.

Home, libri, indagine e metodologia sono viste distinte, raggiungibili tramite
frammenti URL compatibili con GitHub Pages. Il menu mobile si apre a destra.
Il 3D ha fallback piano con `prefers-reduced-motion` e nessuna dipendenza WebGL.

## Limiti della verifica

I test automatici, le prove Chromium e i report Lighthouse sono in `qa/` e nel
report di consegna. I test su lettori di schermo, Safari/Firefox e dispositivi
fisici restano da eseguire. Il controllo al 200% usa un viewport CSS equivalente
(720px rispetto a 1440px), non lo zoom dell'interfaccia di un browser fisico.

L'audit npm eseguito nella prima iterazione non rilevava vulnerabilità di
produzione; l'audit completo segnalava
12 avvisi moderati nella catena ESLint/TypeScript ESLint, derivati da minimatch;
non si è applicato un downgrade automatico incompatibile. Il lockfile delle
dipendenze non è stato modificato in questa iterazione. Vanno rivalutati con
i prossimi aggiornamenti del toolchain.
