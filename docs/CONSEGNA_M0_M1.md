# Consegna M0–M1 — 4 novembre 2026

## Perimetro

Homepage React avviabile: header, hero, indagine, archivio dimostrativo statico,
metodologia, conclusione e footer. Nessuna funzionalità M2 o successiva avviata.
File blueprint e prompt originali preservati.

Identità: avorio `#F6F2E9`, verde `#31584A`, inchiostro `#202722`; font approvati
self-hosted. Hero desktop in due colonne, anteprima tipografica piana dichiarata
dimostrativa; nessun libro tridimensionale. Layout monocolonna su smartphone,
menu a disclosure non modale, anchor HTML native, skip link, focus visibile e
sezioni di destinazione focalizzabili. Nessun timer o loader.

Decisioni aperte: URL/repository pubblico, catalogo e copertine reali, note per
libro e testimonianze approvate. Archivio avorio come default del blueprint.

## File creati

Non esistevano sorgenti o configurazioni applicative da modificare.

| Area              | File                                                                                                                                          |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Progetto          | `package.json`, `package-lock.json`, `index.html`, `tsconfig.json`, `vite.config.ts`                                                          |
| Qualità           | `eslint.config.js`, `.prettierrc.json`, `.prettierignore`, `.gitignore`, `src/test-setup.ts`                                                  |
| App               | `src/main.tsx`, `src/app/App.tsx`, `src/app/App.test.tsx`                                                                                     |
| Componenti        | `src/components/SiteHeader.tsx`, `HeroSection.tsx`, `InvestigationSection.tsx`, `BookArchive.tsx`, `MethodologySection.tsx`, `SiteFooter.tsx` |
| Contenuti e stile | `src/content/copy.ts`, `src/styles/tokens.css`, `src/styles/global.css`                                                                       |
| Identità          | `public/favicon.svg`                                                                                                                          |
| CI                | `.github/workflows/deploy.yml`                                                                                                                |
| Documentazione    | `README.md`, `docs/CONSEGNA_M0_M1.md`                                                                                                         |
| Evidenze          | `qa/desktop-1440.png`, `qa/mobile-360.png`, `qa/tablet-768.png`, `qa/zoom-200-reflow-720.png`                                                 |

## Controlli realmente eseguiti

| Controllo                                       | Risultato                                                     |
| ----------------------------------------------- | ------------------------------------------------------------- |
| `npm run build`                                 | Superato, TypeScript + Vite                                   |
| `VITE_BASE_PATH=/ufficio-regali/ npm run build` | Superato; verificato anche nel browser con preview            |
| `npm run test`                                  | 6 test superati                                               |
| `npm run lint`                                  | Superato senza warning                                        |
| `npm run format:check`                          | Superato                                                      |
| Chromium desktop 1440×1000                      | Vista ispezionata, hero a due colonne, screenshot completo    |
| Chromium mobile 360×800                         | Vista ispezionata, scrollWidth = 360px; CTA tra y=648 e y=703 |
| Chromium tablet 768×1024                        | scrollWidth = 768px; screenshot completo                      |
| Reflow 720×500, equivalente 1440px al 200%      | scrollWidth = 720px; screenshot completo                      |
| `prefers-reduced-motion: reduce`                | Media query attiva; `scroll-behavior: auto`                   |
| Menu mobile                                     | Apertura, link archivio, chiusura; focus su `#archivio`       |
| CTA in produzione                               | Arrivo a `/ufficio-regali/#archivio`, focus corretto          |
| Asset sotto base                                | JS, CSS, 5 font WOFF2 e favicon: HTTP 200; font caricati      |
| Errori JavaScript browser                       | Nessun errore riportato                                       |
| Axe 4.12.1 dopo correzione ARIA                 | 0 violazioni automatiche, 38 regole superate                  |
| `npm audit --omit=dev`                          | 0 vulnerabilità                                               |
| `npm audit` completo                            | 12 avvisi moderati nel toolchain, nessuno alto/critico        |

I test verificano identità e CTA immediata, destinazioni anchor univoche,
apertura e chiusura menu, Escape e ritorno del focus, dichiarazione demo senza
acquisti fittizi, copy dell'indagine e della metodologia e disclaimer.

La prima esecuzione ha identificato uno spazio mancante nel testo DOM dell'H1
tra due righe: corretto nel componente, quindi test rieseguiti con successo.
L'audit ha identificato un `aria-label` su un div senza ruolo: corretto con
`role="img"` sull'anteprima editoriale, poi audit rieseguito.

L'unica regola axe da revisione manuale è il contrasto delle cinque frecce
decorative `aria-hidden`: usano gli stessi colori dei testi adiacenti. Nessuna
certificazione completa WCAG è implicata. Bundle iniziale JS: **71,80 kB gzip**;
CSS: **3,13 kB gzip**. Sono dimensioni di build, non misure Lighthouse.

## Checklist di accettazione limitata a M0–M1

- [x] Vite, React, TypeScript; script richiesti, lockfile e formatter.
- [x] Token, font locali e favicon UR.
- [x] Tutte le sezioni M1 e copy baseline presenti.
- [x] Hero desktop a due colonne e layout smartphone curato.
- [x] AC-01: nessuna attesa obbligatoria; CTA nella prima schermata 360×800.
- [x] AC-02: CTA raggiunge archivio.
- [x] AC-13, porzione M1: scorrimento immediato con reduced motion.
- [x] AC-14, porzione M1: link e menu da tastiera, Escape e focus.
- [x] AC-15, porzione M0: build e asset sotto project path verificati.
- [x] AC-21, porzione M1: reflow equivalente al 200% senza overflow.
- [x] Placeholder inequivocabile, nessun libro o link reale inventato.
- [x] Workflow Pages parametrico pronto e documentato.
- [ ] Deploy pubblico: richiede repository e configurazione Pages effettivi.
- [ ] Lighthouse e audit manuale completo WCAG: non eseguiti.
- [ ] Zoom browser reale, Safari/Firefox e dispositivi fisici: da verificare.

AC-03–12, 16–18, 20, 22 e 24 riguardano catalogo/carousel/fascicoli e milestone
successive. AC-19 è già rispettato dall'assenza di introduzione obbligatoria;
AC-23 non applicabile perché non sono presenti testimonianze.

## Stato finale e problemi noti

M0 e M1 consegnati. Nessun difetto bloccante osservato nei controlli eseguiti.
Rimangono gli avvisi moderati nelle dipendenze di sviluppo, le verifiche manuali
sopra indicate e il deploy GitHub effettivo. Non sono stati eseguiti test slow
3G, CPU throttling o misure LCP/INP/CLS. Nessun commit perché la cartella non è
ancora un repository Git. M2 attende un'istruzione successiva.
