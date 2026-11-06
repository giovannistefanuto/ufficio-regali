# Ufficio Regali — consegna locale M2–M6

4 novembre 2026. Pubblicazione rinviata su richiesta dell'utente: prima prova locale,
poi creazione del repository GitHub e deploy. Nessun repository remoto è stato
creato, nessun commit/push/deploy eseguito. Blueprint e prompt originali preservati.

## Risultato

Homepage completa con **11 libri reali** identificati nelle foto, carosello CSS
pseudo-3D, selezione con frecce/tastiera/swipe, fascicoli con acquisto e condivisione,
link diretti e introduzione discreta. Nessun backend, WebGL, tracking, prezzo
memorizzato, testimonial non approvato o nuovo inside joke.

Preview di produzione lasciata in esecuzione:
**http://127.0.0.1:4178/ufficio-regali/**.
Server di sviluppo: **http://127.0.0.1:5175/**.
Per riavviare, vedere il README; le porte alternative dipendono da quelle libere.

## Milestone e scelte

| Milestone | Consegna e verifica                                                                                                                                                                                                                                                  |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M2        | Catalogo statico, tipi, validatore build-time, tre fixture demo separate, navigazione 2D, URL e fallback. Prima verifica: 18 test e build/lint passati; screenshot `m2-*`.                                                                                           |
| M3        | Copertina reale, dorso, pagine e ombre CSS; massimo tre libri, preload dei vicini, fallback piano e reduced motion. Build/lint e 18 test passati; screenshot `m3-*` e viste finali.                                                                                  |
| M4        | Dialog nativo: sheet mobile e pannello destro desktop, focus iniziale, ciclo Tab/Shift+Tab, Escape, backdrop e focus restore. Condivisione nativa/copia/manuale e acquisto con link verificato. Verifica intermedia: 26 test, build/lint passati; screenshot `m4-*`. |
| M5        | Hero con libro reale, protocolli, intro approvata di 1,8s saltabile, nessun replay forzato. Intro assente con reduced motion, deep link o storage bloccato. 30 test nella verifica intermedia; screenshot `m5-*`.                                                    |
| M6 locale | Import verificato di 11 titoli e copertine, link acquisto documentati, controlli finali e report. Pubblicazione esclusa dall'utente in questa consegna. Target Lighthouse Performance 90 ancora non raggiunto.                                                       |

La selezione e il pannello non aggiungono voci alla history: si usa `replaceState`,
e `popstate` riallinea il libro quando cambia lo slug. Un cambio della sola anchor
mantiene chiuso il fascicolo. Un URL iniziale valido apre il libro; uno inesistente
mostra il primo libro con un messaggio non bloccante.

I pulsanti sono disponibili senza attendere le animazioni. La gesture orizzontale
non intercetta lo scroll verticale. Non vengono clonate copertine quando il
catalogo contiene uno o due libri. L'interesse è espresso con la label baseline;
le note riusano soltanto «Le indagini hanno prodotto risultati concreti.».

Nel fascicolo, header e azioni restano visibili mentre scorrono i dettagli.
In particolare, su mobile il pulsante Amazon è disponibile subito dopo l'apertura:
il percorso dal libro al rivenditore richiede due tap, senza scroll aggiuntivo.
Le viste finali sono `qa/release-mobile-hero.png`, `release-mobile-archive.png`,
`release-mobile-panel.png`, `release-desktop-archive.png` e
`release-desktop-panel.png`.

## Import e fonti

Il repository Bookly è stato consultato in sola lettura nel percorso indicato
dall'utente. File pertinenti: `lib/data/cover_service.dart`, il relativo test e
`scripts/benchmark_catalog_sources.py`. Il suo resolver è stato adattato a una
pipeline offline Python: Amazon Legacy per ISBN-10, Open Library e override
editoriale verificato. Nessuna API Bookly è stata inventata o caricata nel sito.

| Libro                                      | Autore                                   | ISBN dell'edizione selezionata |
| ------------------------------------------ | ---------------------------------------- | ------------------------------ |
| Sviluppare Large Language Model            | Sebastian Raschka                        | 9788850339006                  |
| Liberi tutti                               | Chiara Gamberale                         | 9788807037351                  |
| Le tre del mattino                         | Gianrico Carofiglio                      | 9788806240707                  |
| Bianca come il latte, rossa come il sangue | Alessandro D'Avenia                      | 9788804666578                  |
| Storia umana dell'intelligenza artificiale | Andrea Daniele Signorelli                | 9788858161906                  |
| AI Hacking                                 | Harriet Farlow                           | 9788850339945                  |
| Vino                                       | Ophélie Neiman                           | 9788809954090                  |
| Atomic Habits                              | James Clear                              | 9791221208870                  |
| Git                                        | Ferdinando Santacroce                    | 9788850334759                  |
| Clean Code — Nuova edizione                | Robert C. Martin                         | 9788850339792                  |
| GenAI Trading                              | Hamlet Jesse Medina Ruiz, Ernest P. Chan | 9788850339464                  |

Ogni immagine è stata decodificata, ottimizzata in WebP mantenendo le proporzioni
e confrontata con la foto originale. La prima copertina di **Vino**, con nastro
verde, è stata scartata: il nastro rosso fotografato corrisponde all'edizione 2022.
**Clean Code** è la nuova edizione 2026, distinta da quella 2018. Per **Atomic
Habits** è stata usata la copertina ufficiale De Agostini, dopo l'assenza di una
copertina valida nel resolver ISBN.

Fonti puntuali e verificabili:

- `scripts/prepare-books/manifest.json`: foto, metadati ed edizione con URL bibliografico/editoriale.
- `docs/cover-sources.json`: URL copertina, dimensioni e verifica visiva.
- `docs/amazon-verification.json`: dieci schede Amazon osservate per titolo/ISBN,
  più il redirect HTTP 303 De Agostini dall'ISBN cartaceo di Atomic Habits.
- `src/content/books.json`: dati effettivamente distribuiti. Tutti gli undici link
  sono HTTPS e senza parametri di affiliazione.

Alcune visite Amazon hanno mostrato una pagina intermedia o CAPTCHA. Non è stato
risolto o aggirato alcun CAPTCHA. Le schede confermate sono state raccolte con
visite dirette; per Atomic Habits la prova è il redirect editoriale, senza
attestare di aver letto l'ISBN dentro la pagina Amazon.

## File modificati o aggiunti

| Area           | File                                                                                                                                                                                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Integrazione   | `package.json`, `src/main.tsx`, `src/app/App.tsx`, `src/app/App.test.tsx`, `src/test-setup.ts`                                                                                                                                                                            |
| Stato          | `src/app/useBookNavigation.ts`, `src/lib/urlState.ts`                                                                                                                                                                                                                     |
| Dati           | `src/types/book.ts`, `src/content/books.json`, `src/content/books.demo.json`, `src/content/books.test.ts`                                                                                                                                                                 |
| Logica         | `src/lib/catalog.ts`, `catalog.test.ts`, `assets.ts`, `share.ts`, `share.test.ts`                                                                                                                                                                                         |
| Componenti     | `BookArchive.tsx`, `BookArchive.test.tsx`, `BookCarousel.tsx`, `BookCover.tsx`, `Book3D.tsx`, `EvidenceTag.tsx`, `BookDetailsPanel.tsx`, `BookDetailsPanel.test.tsx`, `IntroStatus.tsx`, `IntroStatus.test.tsx`, `HeroSection.tsx`, `SiteHeader.tsx` in `src/components/` |
| Stili          | `src/styles/global.css`, `archive.css`, `book3d.css`, `panel.css`, `motion.css`                                                                                                                                                                                           |
| Preparazione   | `scripts/validate-catalog.ts`, `scripts/prepare-books/manifest.json`, `prepare.py`, `export-catalog.py`, `inspect-publishers.py`, `verify-amazon.ps1`, `requirements.txt`                                                                                                 |
| Asset          | 22 immagini WebP (due misure per libro) e 3 SVG demo in `public/covers/`                                                                                                                                                                                                  |
| Documentazione | `README.md`, questo report, JSON di provenienza e verifica                                                                                                                                                                                                                |
| QA             | Screenshot per milestone, script scenari browser, prova rete lenta e report Lighthouse in `qa/`                                                                                                                                                                           |

Le dipendenze npm e il lockfile non sono cambiati; Pillow serve soltanto alla
preparazione offline. Il bundle JS finale è **78,31 kB gzip**, CSS **5,05 kB gzip**.
Le 22 immagini WebP pesano complessivamente circa **589 KiB**; il browser non
scarica tutto il catalogo all'apertura.

## Test e misure realmente eseguiti

- `npm run lint`: superato, zero warning.
- `npm run test`: **36 test superati in 7 file**.
- `npm run build`: superato, inclusi validatore del catalogo e TypeScript.
- Build con `VITE_BASE_PATH=/ufficio-regali/`: superato e avviato in preview.
- `npm run format:check`: controllo conclusivo documentato insieme alla consegna.
- Scenari browser: 11 titoli unici, ciclo completo, frecce consecutive, focus,
  sincronizzazione URL, anchor, fascicolo e link acquisto; evidenza in
  `qa/browser-scenarios-result.json`.
- Dialog: Tab/Shift+Tab rimangono nel pannello, Escape chiude, focus ripristinato.
- Axe 4.12.1: zero violazioni automatiche nella homepage e nel dialog. La verifica
  manuale del contrasto delle frecce decorative e del titolo nel pannello
  scorrevole rimane distinta dall'audit. Inchiostro/avorio: 13,67:1;
  verde/avorio: 7,16:1.
- Reflow equivalente a 200%: viewport CSS 720×500 rispetto a 1440px; nessun
  overflow orizzontale. Reduced motion: `transform: none`, scroll immediato.
- Rete lenta via CDP: 400ms latenza, 50 KiB/s download, cache disabilitata e CPU
  4×; homepage e CTA disponibili dopo circa **3,16s**, senza errori JavaScript o
  overflow. In quel momento i font stavano ancora caricando e il testo era già
  visibile. Non è una misura LCP né una garanzia di tempo su tutte le reti.

Lighthouse 13.6.0 sul build locale, profilo mobile simulato, browser Chromium
controllato via CDP:

| Indicatore          | Misura finale                        |
| ------------------- | ------------------------------------ |
| Performance         | **84/100** — target 90 non raggiunto |
| Accessibility       | **100/100**                          |
| Best Practices      | **100/100**                          |
| SEO                 | **100/100**                          |
| LCP                 | circa **0,8s**                       |
| CLS                 | **0**                                |
| Total Blocking Time | circa **640ms**                      |

Il report finale è `qa/lighthouse-release.report.html` con il relativo JSON.
Sono conservati anche i report intermedi (Performance 87 e 82). Due tentativi con
Chrome lanciato direttamente da Lighthouse sono terminati con target/connessione
chiusi, senza produrre un report utilizzabile: i punteggi riportati derivano solo
dalle esecuzioni completate tramite CDP. L'etichetta del logo rilevata nei report
intermedi è stata corretta; il controllo sul nome accessibile passa nel finale.
L'accessibilità automatica 100 non equivale a certificazione WCAG completa.

## Accettazione e limiti

- [x] AC-01/02: hero e CTA immediati, arrivo all'archivio.
- [x] AC-03/04: swipe e frecce; tastiera completa con focus mantenuto.
- [x] AC-05/06: apertura, chiusura e ripristino del focus.
- [x] AC-07/08: deep link valido e fallback per slug inesistente.
- [x] AC-09/10: URL assente disabilitato nei test; URL reali protetti in catalogo.
- [x] AC-11/12: share, annullamento, copia e fallback manuale testati con API simulate.
- [x] AC-13/14: reduced motion e controlli da tastiera.
- [x] AC-15: percorso di progetto verificato in locale; nessun deploy pubblico attestato.
- [x] AC-16/17/18: catalogo vuoto, uno/due libri e cover fallita con fallback.
- [x] AC-19/20: nessuna intro forzata; desktop con tre libri e pannello laterale.
- [x] AC-21/22: reflow equivalente al 200%, URL e popstate coerenti.
- [x] AC-23: nessuna testimonianza non approvata.
- [x] AC-24: validazione build-time con errori espliciti sui dati critici.
- [ ] Lighthouse Performance ≥90: da ottimizzare, TBT sopra il target progettuale.
- [ ] Zoom reale del browser, lettore di schermo e Safari/Firefox/dispositivi fisici.
- [ ] Share sheet nativa su un telefono reale: qui verificata tramite API simulate.
- [ ] Misura INP sul campo e audit manuale WCAG completo.
- [ ] Creazione repository e pubblicazione: rinviate esplicitamente dall'utente.

Sono stati corretti e coperti da test il focus perso sostituendo il libro centrale,
la riapertura del dialog sui soli cambi di anchor, l'annullamento Web Share con
DOMException di un altro realm e un problema di codifica Unicode nel manifest.
Resta aperta l'ottimizzazione prestazionale indicata sopra. Gli avvisi npm moderati
del toolchain, già documentati in M0–M1, non sono stati modificati in questa fase.
