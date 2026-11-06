# UFFICIO REGALI — BLUEPRINT FUNZIONALE, VISIVO E TECNICO

**Versione:** 1.0 · **Data:** 4 novembre 2026 · **Destinatario:** Codex / sviluppatore frontend  
**Stato:** specifica di implementazione; codice non ancora scritto  
**Nome ufficiale:** Ufficio Regali · **Sottosistema narrativo:** Divisione Giovanni  
**Deploy previsto:** GitHub Pages · **Lingua UI:** italiano

> **North star:** un sito che sembra realizzato da un'istituzione estremamente professionale per risolvere un problema modestissimo: quali libri regalare a Giovanni. Deve essere piacevole da esplorare anche senza acquistare, ma consentire a chi vuole comprare un libro di arrivare al link in due interazioni dalla schermata del catalogo.

---

## 0. Decisioni già approvate (non cambiare senza richiesta)

| Ambito | Decisione |
|---|---|
| Nome | **Ufficio Regali** (non «Dipartimento Regali») |
| Voce | Umorismo **istituzionale, serissimo nella forma, surreale nel contenuto** |
| Grafica | **Ibrida**: editoriale contemporanea + elementi di archivio/burocrazia creativa |
| Oggetto principale | **Carosello di libri pseudo-3D**, con copertina reale, dorso colorato e pagine chiare |
| Catalogo | Derivato in seguito dalle **fotografie personali di libri** e dalle copertine reperite tramite il sistema esistente di **Bookly** |
| Piattaforma | Sito statico, leggero, **GitHub Pages** |
| Conversione | Il libro apre un pannello con **Apri su Amazon** e **Condividi il fascicolo** |
| Umorismo extra | «Testimonianze non richieste» inventate, in quantità moderata e **approvate una per una** |
| Interfaccia | Mobile-first, curata nei tempi, velocissima, non blocca l'utente con loading artificiale |

### 0.1 Principio del prodotto

L'Ufficio non deve sembrare un meme. Deve sembrare un sito professionale al quale è stato affidato un brief irragionevole e che lo esegue senza esprimere dubbi. **L'Ufficio non sa di essere divertente.**

### 0.2 Metriche di successo

1. Un visitatore alla prima apertura capisce **entro la prima schermata** che il sito aiuta a scegliere un regalo per Giovanni.
2. Il primo libro è navigabile senza attendere un'animazione obbligatoria.
3. Da un libro visibile si arriva ad Amazon in **massimo due azioni**: apri il fascicolo → Apri su Amazon.
4. Il sito funziona senza autenticazione, tracking, pagamenti, database o servizi a consumo.
5. Esperienza coerente su telefoni, tablet e desktop, anche senza animazioni 3D.

---

## 1. Ambito di versione

### MVP / V1 — implementare

- Homepage one-page con **Header**, **Hero/Pratica**, **Indagine breve**, **Archivio libri**, **Metodologia**, **Footer**.
- Introduzione animata discreta e saltabile, non un vero loader.
- Catalogo locale statico con supporto a dati demo chiaramente fittizi.
- Carosello 3D CSS: libro centrale + due laterali in penombra; swipe, click, frecce, tastiera.
- Libro costruito da copertina frontale, dorso laterale e piccolo spessore di pagine; palette locale per libro.
- Pannello dettagli: titolo, autore, nota approvata, pulsanti Amazon e condivisione.
- Link diretto a libro con `?book=<slug>` e gestione slug inesistente.
- Una piccola libreria di frasi editoriali approvate, nessuna generazione al runtime.
- Responsive, accessibilità, SEO base, deployment automatico GitHub Pages.
- Test automatici delle funzioni critiche + checklist QA manuale.

### V1.1 — solo dopo convalida V1

- «Testimonianze non richieste» animate ma non invasive.
- Microinterazioni/timbri occasionali, se non distraenti.
- «Mi interessa»/cuore **solo locale** al browser, senza contatori pubblici falsi.
- Filtri per fascia di prezzo **solo se** il catalogo avrà dati aggiornati e affidabili.
- Eventuale griglia «Vai subito ai libri» per visitatori ricorrenti.

### Fuori ambito (NON implementare senza richiesta)

- Backend, DB remoto, autenticazione, carrello, checkout o pagamenti.
- Sincronizzazione delle prenotazioni regalo / «già comprato» tra visitatori.
- Prezzi Amazon o disponibilità in tempo reale, scraping client-side, affiliate tracking non concordato.
- Shader WebGL, Three.js, modelli 3D pesanti, video autoplay, audio, splash obbligatori.
- Commenti realmente pubblicabili, recensioni finte spacciate come reali, metriche social gonfiate.
- Sistema OCR/ricerca Bookly integrato nel browser: l'import deve restare **preparazione offline**.

---

## 2. Utenti e percorsi

### Persona A — Genitore o parente, mobile

Arriva da WhatsApp, vuole capire il sito e scegliere velocemente un regalo. Non conosce swipe sofisticati; pulsanti e CTA devono essere espliciti. **Percorso**: Hero → «Consulta i risultati» → primo libro → frecce/swipe → «Esamina il fascicolo» → Amazon.

### Persona B — Amico curioso, mobile

Apre per la battuta, esplora più libri, legge note e condivide un fascicolo con un altro amico. **Percorso**: Hero → Indagine → Archivio → apre dettagli → «Condividi il fascicolo».

### Persona C — Visitatore di ritorno, desktop

Ha già visto l'introduzione, deve trovare un libro specifico. **Percorso**: header «Archivio» → carosello oppure mini-indice → fascicolo → link. Nessuna introduzione obbligatoria.

### Persona D — Destinatario con necessità accessibilità

Navigazione solo tastiera o con `prefers-reduced-motion`: accesso pieno a contenuti, frecce e dettagli, senza scroll-trap, senza dipendere dalle animazioni o dalla sola gesture.

---

## 3. Architettura informativa — una pagina

```text
/
├── #top                 Header + hero: pratica aperta
├── #indagine            Spiegazione narrativa breve
├── #archivio            Carosello e catalogo
│   └── ?book=<slug>     Stato condivisibile del libro
├── #metodologia         Disclaimer metodologico comico
└── #footer              Disclaimer ente immaginario e contatti non necessari
```

**Ordine narrativo:** problema → indagine → evidenze → scelta → metodologia. Il catalogo rimane l'area principale. Non serve un router: query string + anchor sono compatibili con un sito statico ospitato in sottocartella.

### 3.1 Struttura pagine/stati

- Il caricamento iniziale **non** crea una splash screen separata che impedisce l'accesso al sito.
- La pagina è subito presente; i contenuti appaiono progressivamente tramite `opacity` e `transform` se consentito.
- Premendo «Consulta i risultati» si scorre direttamente a `#archivio`.
- Se è presente `?book=<slug>` valido: saltare l'introduzione, selezionare il libro e mostrare il suo fascicolo (pannello o focus sul libro, da verificare con QA).
- Se lo slug è invalido: mostrare il primo libro con un messaggio non bloccante («Il fascicolo richiesto non è disponibile»), senza crash.
- Sessione successiva: niente replay forzato; la homepage resta comunque accessibile tramite logo/top.

---

## 4. Brand design system

### 4.1 Token cromatici

| Token CSS | Hex | Uso |
|---|---|---|
| `--paper` | `#F6F2E9` | Sfondo principale |
| `--ink` | `#202722` | Testo, cornici |
| `--archive` | `#31584A` | Identità UR, pulsanti primari |
| `--stamp` | `#BF533E` | Timbri e segnalazioni rare |
| `--divider` | `#D4CEC1` | Linee, bordi |
| `--muted` | `#565D55` | Testo secondario |
| `--gallery-dark` | `#202722` | Possibile sfondo espositivo del catalogo |
| `--pages` | `#EEE9DF` | Taglio delle pagine 3D |

**Nota accessibilità:** verificare contrasto WCAG per tutte le coppie testo/sfondo e aggiustare il token, non forzare il colore per ragioni estetiche.

### 4.2 Tipografia

- Titoli: **Instrument Serif** (serif editoriale).
- Interfaccia e paragrafi: **Inter**.
- Protocolli/metadati: **IBM Plex Mono**.
- Preferire font self-hosted ottimizzati/subset o system fallback; mai bloccare il first paint attendendo i font.
- Scala tipo: display mobile `clamp(2.3rem, 9vw, 4rem)`, desktop `clamp(3.5rem, 6vw, 6.5rem)`; corpo 16–18px; etichette 11–12px non indispensabili alla comprensione.
- Misura del testo: 55–75 caratteri per riga nei paragrafi.

### 4.3 Griglia e spacing

- Sistema di spaziatura base 4px; preferire `8, 12, 16, 24, 32, 48, 64, 96`.
- Layout mobile: padding laterale 20–24px; header 64px circa.
- Desktop: contenuto max-width 1280px, padding laterale 48–64px, hero 2 colonne 55/45 circa.
- Angoli contenuti: 8–14px; non arrotondare eccessivamente come app giocattolo.
- Ombre rare e morbide, soprattutto sotto i libri.
- Linee sottili, numerazione dossier, timbri minimali; **non** ricreare simboli di enti pubblici reali.

### 4.4 Logo

- Primario: testo «Ufficio Regali» con monogramma **`UR.`**.
- Compatto: quadrato verde `--archive` con `UR.` chiaro.
- Variante su sfondo scuro: simbolo chiaro; mantenere la stessa proporzione.
- Non inserire `®` perché non è stata definita o verificata alcuna registrazione del marchio.

### 4.5 Regole editoriali (vincolanti)

**Fare:** istituzionale, asciutto, verifiche, fascicoli, segnalazioni, commissioni, campioni statistici assurdi.  
**Non fare:** linguaggio da meme, emoji nei testi ufficiali, slogan urlati, «compra subito!», ironia spiegata, battute inventate automaticamente.

Le personalità storiche possono comparire solo in **parodie chiaramente etichettate**; nessuna falsa citazione presentata come autentica. I dati di apprezzamento devono essere reali o dichiarati esplicitamente come finzione.

---

## 5. Copy della homepage — baseline da implementare

**Le seguenti stringhe sono editoriali e costituiscono la base approvata.** Piccoli aggiustamenti di punteggiatura sono consentiti; nuove battute richiedono approvazione.

### Header

- Logo: `UR.` + `Ufficio Regali`
- Navigazione desktop: `L'indagine` · `L'archivio` · `Metodologia`
- Mobile: icona menu con accesso equivalente, oppure link visibili essenziali se ci stanno.

### Hero / pratica

- Eyebrow: `FASCICOLO N. 001 · CONSULTAZIONE PUBBLICA`
- H1: **Un regalo per Giovanni?**
- H2/support: **La questione è stata presa in carico.**
- Body: `Compleanno? Natale? Pasqua? Un esame andato particolarmente bene? Qualunque sia l'occasione, trovare un regalo adatto può diventare una questione complessa. Per questo abbiamo istituito un apposito Ufficio.`
- Body2: `Dopo un'attenta attività di ricerca, siamo lieti di comunicare di aver individuato alcune possibili soluzioni.`
- CTA primaria: **Consulta i risultati**
- Microcopy: `Non è richiesta alcuna competenza in materia di regali.`

### Indagine

- Eyebrow: `RAPPORTO ISTRUTTORIO`
- H2: **Abbiamo interrogato Giovanni.**
- Body: `Il soggetto ha inizialmente dichiarato di non aver bisogno di nulla.`
- Body: `La dichiarazione è stata ritenuta poco attendibile, considerata la frequenza con cui il medesimo soggetto viene avvistato in libreria senza effettuare acquisti.`
- Chiusura: **Le indagini hanno prodotto risultati concreti.**

### Archivio

- Eyebrow: `ARCHIVIO DELLE EVIDENZE`
- H2: **Sono stati individuati i seguenti libri.**
- Intro: `Per ciascun titolo è stato riscontrato un interesse sufficiente a giustificarne l'inserimento nel presente archivio.`
- Microcopy: `La consultazione è libera. L'acquisto è facoltativo, ma incoraggiato.`
- Contatore: `FASCICOLO 01/24` (24 è solo un esempio: usare la lunghezza del catalogo).
- Etichetta default: `INTERESSE CONFERMATO`
- CTA fascicolo: **Esamina il fascicolo**
- CTA acquisto: **Apri su Amazon**
- CTA condivisione: **Condividi il fascicolo**
- Nota: `Prezzo e disponibilità sono determinati dal rivenditore.`

### Metodologia

- Eyebrow: `NOTA SULLA METODOLOGIA`
- H2: **La presente selezione è il risultato di un'indagine approfondita.**
- Passaggi: `Raccolta delle dichiarazioni del soggetto.` / `Analisi delle preferenze espresse durante le visite in libreria.` / `Verifica finale dei titoli individuati.`
- Chiusura: `Il campione analizzato comprende un individuo. L'Ufficio ritiene il campione adeguato allo scopo.`

### Conclusione e footer

- H2: **Hai individuato un possibile regalo?**
- Body: `Ottimo. Il lavoro dell'Ufficio può considerarsi, almeno temporaneamente, concluso.`
- CTA: **Torna ai libri**
- Microcopy: `La scelta finale rimane di esclusiva competenza del potenziale donatore.`
- Footer: `UR. — Ufficio Regali · Divisione Giovanni`
- Disclaimer: `L'Ufficio Regali è un'organizzazione immaginaria. Il destinatario dei regali, invece, esiste realmente.`
- Easter egg consentito: `Tutti i diritti non particolarmente importanti riservati.`

### Intro animata (NO loader obbligatorio)

1. `Un regalo per Giovanni?` / `È stata aperta una pratica.`
2. `«Non mi serve niente.»` / `Attendibilità della dichiarazione: in esame.`
3. `Abbiamo trovato dei libri.` / `I risultati sono disponibili per la consultazione.`

**Comportamento:** le frasi possono apparire nella hero in 1.8–2.4 secondi totali, ma l'utente può interagire subito; la pagina non aspetta mai artificialmente 3–5 secondi. In reduced motion, mostrare immediatamente la comunicazione finale.

---

## 6. Storyboard mobile — specifica di layout e comportamento

### Frame M1 — ingresso, 0–0.5s

```text
┌─────────────────────────────┐
│ [UR.] Ufficio Regali    [≡] │
├─────────────────────────────┤
│ FASCICOLO N. 001            │
│ DIVISIONE GIOVANNI          │
│                             │
│ Un regalo                   │
│ per Giovanni?               │
│                             │
│ La questione è stata        │
│ presa in carico.            │
│                             │
│ Breve spiegazione...        │
│                             │
│ [ Consulta i risultati  ↓ ] │
│                             │
│ UR/G-001          SCORRI ↓  │
└─────────────────────────────┘
```

- Header stabile, fondo avorio; H1 ampio; CTA visibile senza scroll nei viewport più comuni o subito sotto (niente layout tagliato su schermi bassi).
- L'animazione dell'header e del titolo **non** sposta contenuti già renderizzati, per evitare CLS.

### Frame M2 — indagine, scroll verticale

- Sezione compatta, non oltre circa 1 viewport su telefoni comuni.
- Due paragrafi + la contraddizione «Non mi serve niente» / avvistamenti in libreria.
- No animazioni obbligatorie e nessuna auto-navigazione senza input.

### Frame M3 — catalogo, stato selezionato

```text
┌─────────────────────────────┐
│ ARCHIVIO / FASCICOLO 01/24  │
│                             │
│ Le prove raccolte.          │
│                             │
│  [prev]  [ LIBRO ]  [next]  │
│           visibile          │
│           dorso+            │
│           pagine            │
│                             │
│   ‹     SCORRI       ›      │
│                             │
│ Titolo del libro            │
│ Autore                      │
│ INTERESSE CONFERMATO        │
│                             │
│ [ Esamina il fascicolo   ]  │
└─────────────────────────────┘
```

- Primo libro circa 60–75% della larghezza utile (adattiva), mostrato quasi intero; ai lati preview piccole, desaturate/scure senza perdere l'identità cromatica.
- Nessuna gesture nascosta come unico modo di avanzare; frecce cliccabili con target di almeno 44×44 CSS px.
- Il titolo/autorə sotto il libro devono rimanere leggibili anche in caso di copertina piccola.

### Frame M4 — scheda libro

```text
┌─────────────────────────────┐
│       BACKDROP SCURO        │
│ ┌─────────────────────────┐ │
│ │ ━                       │ │
│ │ FASCICOLO UR/G-003   ×  │ │
│ │ [mini cover]            │ │
│ │ Titolo / Autore         │ │
│ │ Etichetta interesse     │ │
│ │ Nota dell'Ufficio       │ │
│ │                         │ │
│ │ [ Apri su Amazon  ↗ ]   │ │
│ │ [ Condividi fascicolo ] │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

- Bottom sheet con focus gestito correttamente; chiusura via X, Escape, clic su backdrop; swipe-down opzionale, mai unico metodo.
- Non linkare a un URL vuoto: se `amazonUrl` non disponibile mostrare chiaramente «Link acquisto non ancora disponibile» e CTA disabilitata.

### Frame M5 — ritorno

- Chiudendo il fascicolo, focus torna al libro/CTA che lo ha aperto; indice mantenuto.
- Dopo uscita verso Amazon e ritorno al browser, mantenere il libro selezionato grazie alla query string.

---

## 7. Storyboard desktop

### Frame D1 — hero 2 colonne

```text
┌─────────────────────────────────────────────────────────────────┐
│ [UR.] Ufficio Regali       L'indagine  L'archivio  Metodologia  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ FASCICOLO N. 001                 [Libro 3D illustrativo]         │
│ Un regalo per Giovanni?            /                            │
│ La questione è stata ...          /  luce calda                  │
│ Descrizione...                   /                               │
│ [Consulta i risultati ↓]                                          │
│                                                                 │
│ UR/G-001                                          SCORRI ↓       │
└─────────────────────────────────────────────────────────────────┘
```

- Content max-width 1280px; due colonne; sufficiente respiro; visual 3D che non blocca il rendering dell'H1.
- Se non esiste ancora una copertina reale, utilizzare un libro demo con esplicita etichetta «ANTEPRIMA», non una copertina inventata fatta passare per reale.

### Frame D2 — catalogo immersivo

```text
┌─────────────────────────────────────────────────────────────────┐
│ ARCHIVIO DELLE EVIDENZE                          FASCICOLO 3/24 │
│                                                                 │
│                  ┌───────────┐                                  │
│  [prev libro]    │ LIBRO 3D  │    [next libro]                   │
│  più piccolo     │ FRONT +   │    più piccolo                   │
│  meno luce       │ SPINE     │    meno luce                     │
│                  └───────────┘                                  │
│         ‹                                           ›           │
│                                                                 │
│ Titolo selezionato           [Esamina il fascicolo]             │
│ Autore · Nota breve                                               │
└─────────────────────────────────────────────────────────────────┘
```

- La sezione archivio può usare una base scura o un gradiente debolissimo legato al libro, con testo che resta leggibile.
- Libro centrale grande e laterali arretrati (`translateX`, `scale`, `rotateY`, `opacity`); contenuto fuori scena non deve intercettare click/tab.

### Frame D3 — dettagli laterali

- Click sul libro apre un pannello **laterale destro**, mantenendo visibile il libro selezionato.
- Non avviare automaticamenti acquisti o nuove finestre al click sulla sola copertina.
- Escape chiude; focus controllato; eventuale overlay non deve causare scroll laterale.

---

## 8. Motion system

| Animazione | Durata target | Dettaglio |
|---|---:|---|
| Feedback pulsanti | 140–200ms | `color`, `background`, micro-trasformazione |
| Apparizione testo | 300–450ms | `opacity` e `translateY(6–10px)` |
| Ingresso libro | 500–650ms | `translateY`, `rotateY`, `opacity` |
| Cambio selezione | 400–550ms | `transform` + `opacity`, easing ease-out |
| Apertura sheet | 250–350ms | `translateY` mobile / `translateX` desktop |
| Testimonianza (V1.1) | 3–5s dwell | Dissolvenza discreta, mai sul libro |

- Con `prefers-reduced-motion: reduce`, eliminare animazioni decorativo-spaziali e fare cambi immediati o dissolvenze brevissime.
- Non animare `width`, `height`, `left`, `top` del carosello su ogni frame; usare principalmente `transform`/`opacity`.
- Lo scroll della pagina non deve essere sequestrato o bloccato da un'introduzione.
- Durante swipe consecutivi mantenere sempre uno stato deterministico: ultimo gesto valido vince; niente transizioni con indice fuori intervallo.
- Immagine di copertina e titolo devono essere accessibili indipendentemente dall'animazione.

---

## 9. Oggetto libro pseudo-3D

### 9.1 Geometria

Componenti visuali di ogni `Book3D`:

1. **Front:** cover originale in `<img>` con `object-fit: contain` se necessario, mai distorta; conserva rapporto d'aspetto.
2. **Spine:** rettangolo a sinistra con larghezza proporzionale all'altezza del libro (es. 10–16px desktop, da tarare) e colore `spineColor`.
3. **Pages:** fascetta a destra/in alto, colore avorio chiaro con linee sottili appena percepibili.
4. **Shadow:** ombra prospettica via pseudo-elemento, sfocata, non pesante.

Usare `perspective`, `transform-style: preserve-3d`, `rotateY`, `translateZ`, `backface-visibility`; garantire fallback planare leggibile. Evitare un rendering 3D fisicamente accurato, non è il requisito.

### 9.2 Colori delle copertine

La palette va preparata **offline**, non all'apertura della pagina:

- Estrarre colore medio/dominante dalla copertina escludendo aree troppo bianche, nere o piccole; confronto con colori laterali.
- Scegliere manualmente o verificare automaticamente il colore del dorso (`spineColor`) e un accento di luce (`accentColor`).
- Consentire override per copertine multicolori o con titoli bianchi.
- Salvare i valori nel catalogo. Nessun `canvas`/CORS obbligatorio nel browser.
- Non ricostruire il vero testo del dorso se non disponibile; colore coerente basta.

### 9.3 Gestione degli asset

- Formati: WebP preferito + eventuale fallback JPEG/PNG se necessario.
- Preparare immagini dimensionate, es. 480px e 960px lato lungo; preservare aspect ratio.
- Priorità alta per la copertina iniziale; lazy loading per catalogo non visibile, preload del corrente ±1.
- Font locali ridotti e caricati con `font-display: swap`.
- Se fallisce una cover: fallback tipografico «Copertina non disponibile» con titolo/autore, non una card rotta.
- Rispettare i diritti sulle copertine: usare immagini autorizzate/appropriate per lo scopo e conservare metadati di provenienza quando disponibili.

---

## 10. Content model e schema dati

Il sito deve poter partire da tre demo senza libri reali e sostituirli poi con il catalogo importato. Il catalogo non deve essere generato o alterato dai componenti React.

**Percorso:** `src/content/books.json` (con validatore build-time). Gli asset possono stare in `public/covers/`.

```ts
export type EvidenceTag =
  | 'interesse-confermato'
  | 'segnalazione-ricorrente'
  | 'acquisto-rimandato';

export interface Book {
  id: string;                    // identificatore stabile, es. "b001"
  slug: string;                  // link diretto, es. "titolo-esempio"
  title: string;
  author: string;
  isbn13?: string;               // se noto e verificato
  cover: {
    src: string;                 // relativo alla base Vite, es. "covers/book.webp"
    width: number;
    height: number;
    alt?: string;
    source?: string;             // provenienza per gestione editoriale
  };
  spineColor: string;            // #RRGGBB
  accentColor: string;           // #RRGGBB
  evidenceTag: EvidenceTag;
  officeNote: string;            // testo approvato, non generato
  amazonUrl?: string;            // URL reale e verificato, opzionale
  visible: boolean;
  order: number;
}
```

**Esempio dimostrativo, da NON pubblicare come libro reale:**

```json
{
  "id": "demo-001",
  "slug": "libro-dimostrativo",
  "title": "Titolo dimostrativo",
  "author": "Autore dimostrativo",
  "cover": {
    "src": "covers/demo-001.webp",
    "width": 480,
    "height": 720,
    "alt": "Copertina dimostrativa del libro"
  },
  "spineColor": "#31584A",
  "accentColor": "#547566",
  "evidenceTag": "interesse-confermato",
  "officeNote": "Il soggetto ha manifestato un interesse superiore alla media.",
  "visible": true,
  "order": 1
}
```

### 10.1 Validazione catalogo

A build-time verificare:

- ID e slug unici, senza caratteri pericolosi nei percorsi.
- Titolo/autore non vuoti, `order` definito, colori hex validi.
- `amazonUrl`, quando presente, deve essere URL HTTPS di Amazon effettivamente verificato (non inventarlo; non accettare qualsiasi host che contiene la parola `amazon`).
- Asset esistente, dimensioni ragionevoli, alt non vuoto o generabile.
- `officeNote` approvata, limite indicativo 140 caratteri per la vista breve; testo lungo nel fascicolo se necessario.
- Copertine non disponibili non devono interrompere il deploy: avvertimento + fallback, senza links fittizi.

### 10.2 Pipeline offline per fotografie personali (fase separata)

```text
Fotografie dei libri
    ↓ OCR / visione assistita (titolo, autore)
Lista candidati da revisionare manualmente
    ↓ Matching titolo/autore/ISBN
Ricerca copertina via sistema Bookly (da ispezionare DOPO accesso)
    ↓ Selezione esatta dell'edizione
Download/ottimizzazione immagini autorizzate
    ↓ Palette + spineColor con eventuale override
books.json + assets + controllo manuale
    ↓
Build statico GitHub Pages
```

**Non** inventare il contratto API o la struttura del progetto Bookly senza aver ispezionato il repository/codice che l'utente fornirà. Separare la pipeline (ad es. `scripts/prepare-books/`) dalla UI.

---

## 11. Regole di navigazione e stato

### 11.1 Stato app

```ts
type AppState = {
  selectedBookIndex: number;
  isBookPanelOpen: boolean;
  introHasPlayed: boolean;     // sessionStorage o equivalente safe
  activeSection?: 'top' | 'indagine' | 'archivio' | 'metodologia';
};
```

- La selezione è single-source-of-truth: indice validato dal catalogo + slug URL corrispondente.
- Cambiando libro tramite carosello, aggiornare `?book=slug` con `history.replaceState` per non creare centinaia di voci nel back stack. Aprire un fascicolo può usare `pushState` se si desidera che Back chiuda il pannello: scelta esplicita e testata, non accidentale.
- Quando arriva evento `popstate`, riallineare libro e pannello senza loop.
- Se `books.length === 0`, mostrare stato vuoto editoriale, niente frecce o pannello fittizio.
- Con un solo libro, frecce disabilitate e nessun clone visuale ingannevole.
- Con due libri, evitare duplicazioni del medesimo oggetto su entrambi i lati: rendere solo due posizioni oppure una preview reale, non due copie della stessa cover.

### 11.2 Condivisione

- L'URL condiviso è quello **del sito** con `?book=<slug>`, non soltanto l'URL Amazon: consente di mantenere l'esperienza Ufficio Regali; opzionalmente fornire separatamente «Copia link Amazon».
- Preferire `navigator.share({title, text, url})` se supportato e invocato direttamente dal gesto utente.
- Fallback `navigator.clipboard.writeText(url)` in secure context, altrimenti campo selezionabile + messaggio istruttivo.
- Non segnalare «Condiviso!» prima di conferma dell'API; se l'utente annulla la share sheet, non mostrare errore drammatico.
- **Vincolo GitHub Pages:** preview Open Graph del singolo libro non sarà dinamico senza prerendering HTML differenziato; usare preview generica del sito in V1.

### 11.3 Apertura Amazon

- Aprire esclusivamente URL reale presente nel dato.
- Anchor esterno con `target="_blank"` e `rel="noopener noreferrer"`.
- Non dire che il prezzo è fisso o che il libro è disponibile senza dati aggiornati.
- Non raccogliere credenziali o informazioni di acquisto.

---

## 12. Specifica dei componenti React

```text
src/
├── app/
│   ├── App.tsx
│   ├── useBookNavigation.ts
│   └── constants.ts
├── components/
│   ├── SiteHeader.tsx
│   ├── OfficialSeal.tsx
│   ├── ProtocolLabel.tsx
│   ├── HeroSection.tsx
│   ├── InvestigationSection.tsx
│   ├── BookArchive.tsx
│   ├── BookCarousel.tsx
│   ├── Book3D.tsx
│   ├── BookDetailsPanel.tsx
│   ├── EvidenceTag.tsx
│   ├── MethodologySection.tsx
│   ├── SiteFooter.tsx
│   └── FictionalTestimonial.tsx   // post-MVP
├── content/
│   ├── books.json
│   ├── copy.ts
│   └── testimonials.ts          // post-MVP, approvazione manuale
├── lib/
│   ├── books.ts
│   ├── share.ts
│   ├── urlState.ts
│   └── assets.ts
├── styles/
│   ├── tokens.css
│   ├── global.css
│   ├── layout.css
│   ├── book3d.css
│   └── motion.css
├── types/
│   └── book.ts
└── main.tsx
public/
├── covers/
├── favicon.svg
└── og-cover.jpg
scripts/
└── validate-catalog.ts
.github/
└── workflows/
    └── deploy.yml
```

I file sono una proposta modulare, non un vincolo burocratico. Evitare astrazioni premature e framework di styling pesanti; CSS Modules sono possibili, ma una struttura CSS semplice con token è sufficiente.

### 12.1 Contratti componenti essenziali

- `BookCarousel({ books, selectedIndex, onSelect, onOpen })`: render max 3 item pienamente dettagliati attorno all'indice; gestisce swipe touch, frecce e tastiera; aria-label delle azioni; movimento non bloccante.
- `Book3D({ book, position, motionEnabled })`: composizione 3D, fallback 2D, cover alt; **non** legge URL o catalogo globale.
- `BookDetailsPanel({ book, open, onClose, onShare })`: apertura modal/sheet accessibile, focus, ESC, CTA.
- `HeroSection({ onExplore })`: copy statico, CTA scroll, intro non bloccante.
- `EvidenceTag({ value })`: mapping da enum a label istituzionale, non scelta casuale.

### 12.2 Stato/component boundaries

Dati UI in `App`, handler passati come props; non introdurre uno state manager globale. Eventuali preferenze leggere (intro già vista, like locali) si possono salvare nel browser; devono degradare bene se storage non accessibile.

---

## 13. Stack e deploy

### Stack scelto

- **React + TypeScript + Vite**.
- **CSS nativo** (3D e transizioni); nessun Three.js nella V1.
- `lucide-react` opzionale per poche icone coerenti, oppure SVG inline semplici.
- **Vitest + React Testing Library** per unit/component tests; **Playwright** facoltativo per flussi E2E ma auspicabile.
- Node LTS, npm lockfile, build riproducibile.

### GitHub Pages

GitHub Actions deve fare `npm ci`, `npm run lint`, `npm run test`, `npm run build`, upload di `dist/` e deploy. Con Vite, il `base` dipende dall'URL di pubblicazione:

```ts
// vite.config.ts (esempio repo di progetto: https://utente.github.io/ufficio-regali/)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/ufficio-regali/', // sostituire con il vero nome repository
});
```

- Se il sito è a `https://utente.github.io/` oppure dominio custom root, usare `base: '/'`.
- Usare `import.meta.env.BASE_URL` per generare gli asset dal percorso pubblico (per esempio `new URL(book.cover.src, location.origin + import.meta.env.BASE_URL).href`, dopo validazione del percorso). Evitare path assoluti `/covers/...` che si rompono su project pages.
- Configurare Settings → Pages → **GitHub Actions**.
- Non usare BrowserRouter con URL path dinamici non gestiti: la query `?book=slug` funziona con una pagina statica.

**Fonti tecniche ufficiali:** Vite static deploy https://vite.dev/guide/static-deploy ; MDN Web Share API https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API ; MDN CSS `transform-style` https://developer.mozilla.org/en-US/docs/Web/CSS/transform-style.

---

## 14. Accessibilità e robustezza

- Target **WCAG 2.2 AA** per interazioni principali.
- H1 unico; struttura H2 per sezioni; label comprensibili.
- Tutti i controlli accessibili da tastiera e visibili in focus. Sincronizzare `aria-current`/`aria-label` per libro selezionato; annunciare variazione del titolo con una live region **non verbosa**.
- CTA e frecce con area interattiva ≥44×44 CSS px dove possibile.
- `prefers-reduced-motion`, supporto zoom 200%, font scale browser, viewport basso/orizzontale.
- Gestione modal: focus iniziale, Escape, focus trapping se realmente modale, focus restore; `aria-modal="true"` solo se il resto è inerte.
- Nessuna dipendenza da hover, touch o gesture come unica interazione.
- Test di slow 3G/CPU throttling e cover fallite: niente spinner infinito.
- Disabilitare animazioni che generano motion sickness, no autoplay sonoro.
- Nessun tracking analytics in V1; nessun banner cookie se non vengono usati cookie o strumenti che lo richiedano.

### Obiettivi prestazionali (target, da misurare)

- LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 su condizioni di test appropriate (non promettere per tutte le reti).
- Lighthouse mobile: Performance ≥90, Accessibility ≥95 come obiettivi progettuali, non come garanzia.
- Bundle iniziale JS idealmente <150kB gzip al netto di dipendenze non essenziali; copertina iniziale compressa e prioritaria.
- Nessun download di tutto l'archivio prima del first interactive.
- Animazioni a `transform`/`opacity`, senza work per-frame in React durante lo swipe.

---

## 15. Test di accettazione verificabili

| ID | Priorità | Scenario | Atteso |
|---|---|---|---|
| AC-01 | P0 | Nuova visita smartphone | Hero e CTA visibili e comprensibili senza attesa obbligatoria |
| AC-02 | P0 | Tap «Consulta i risultati» | Arrivo a `#archivio`, nessuna scroll-trap |
| AC-03 | P0 | Swipe dx/sx | Cambio libro corretto senza duplicazioni / indice rotto |
| AC-04 | P0 | Click frecce | Navigazione completa anche senza swipe |
| AC-05 | P0 | Click libro / CTA | Apertura scheda con titolo, autore, nota e azioni |
| AC-06 | P0 | Chiudi scheda | Torna al libro, focus ripristinato |
| AC-07 | P0 | `?book=slug` valido | Libro giusto selezionato, niente intro obbligatoria |
| AC-08 | P0 | `?book=invalid` | Fallback gentile, niente schermata bianca |
| AC-09 | P0 | Amazon URL mancante | CTA non cliccabile, nessun URL inventato |
| AC-10 | P0 | Amazon URL valido | Apertura in scheda nuova e `noopener noreferrer` |
| AC-11 | P0 | Share disponibile | Share sheet nativa con URL del singolo fascicolo |
| AC-12 | P0 | Share non disponibile | Copia URL o testo selezionabile, feedback vero |
| AC-13 | P0 | Reduced motion | Nessuna animazione 3D obbligatoria, catalogo utilizzabile |
| AC-14 | P0 | Solo tastiera | Archiviazione, frecce, pannello e CTA accessibili |
| AC-15 | P0 | Deploy sotto `/ufficio-regali/` | Script, font e immagini corretti, refresh query ok |
| AC-16 | P0 | Catalogo vuoto | Stato vuoto coerente senza crash |
| AC-17 | P0 | Catalogo con 1 o 2 libri | Layout coerente, niente cloni scorretti |
| AC-18 | P0 | Cover 404 / lenta | Fallback leggibile, nessun layout shift importante |
| AC-19 | P1 | Visitatori ricorrenti | Nessuna intro forzata, navigazione immediata |
| AC-20 | P1 | Desktop largo | Tre libri coerenti, pannello laterale, no overflow |
| AC-21 | P1 | Testi lunghi / zoom 200% | No clipping dei titoli e delle CTA |
| AC-22 | P1 | URL/back button | Selezione sincronizzata correttamente e stato coerente |
| AC-23 | P1 | Testimonial fittizi | Nessuna citazione attribuita come reale; non coprono la UI |
| AC-24 | P1 | Dati catalogo errati | Build segnala errori critici con messaggio chiaro |

---

## 16. Piano di implementazione con Codex (milestone indipendenti)

**Regola generale:** una milestone per iterazione, con screenshot mobile/desktop, test e commit logico. Non procedere a nuove funzionalità prima che la milestone corrente sia usabile.

### M0 — Fondamenta

- Scaffold Vite React TS, lint, formatter, test runner, CI Pages.
- Installare token CSS, font, struttura app, favicon `UR.`.
- Output: homepage minima deployabile.
- DoD: `npm run build`, `npm run test`, `npm run lint` passano e site base path funziona.

### M1 — Homepage editoriale senza 3D

- Header, Hero, Indagine, Archivio segnaposto, Metodologia, Footer.
- Inserire copy baseline esattamente; render responsive.
- CTA anchor e nav funzionanti; niente pause artificiali.
- DoD: wireframe M1 e D1 corrispondenti; primo utilizzo intuitivo.

### M2 — Catalogo dati e accessibilità

- `books.json`, schema/validator, 3 libri demo inequivocabilmente demo, fallback cover.
- Selezione libro e `?book=slug`; layout 2D del carosello con navigazione tastiera e swipe.
- DoD: AC-03/04/07/08/16/17.

### M3 — Visual 3D e performance

- Componenti Book3D, spine color, pages, shadows, transizioni e reduced motion.
- Preload ±1 cover e asset optimisation.
- DoD: il libro reale resta leggibile, nessuna animazione blocca le interazioni, fallback funzionante.

### M4 — Fascicolo e uscita

- Mobile bottom sheet, desktop side panel, Amazon link, share/fallback, focus.
- DoD: AC-05/06/09/10/11/12/14.

### M5 — Rifinitura editoriale

- Intro progressiva non bloccante, dettagli protocollo, microinterazioni discreti.
- Inserire «Testimonianze non richieste» **solo dopo approvazione dei testi**; altrimenti lasciare il componente spento.
- DoD: il sito continua a essere elegante, non eccessivo.

### M6 — Import real books + release

- Quando disponibili, verificare fotografie e sistema Bookly con l'utente, preparare script offline.
- Import titoli/autori/covers/amazonUrl verificati, revisione di `officeNote` libro per libro.
- Test mobile/desktop, Lighthouse, deploy production, checklist content/legale.
- DoD: zero placeholder pubblicati come libri reali, tutti i CTA indirizzati correttamente.

---

## 17. Design review — soglie di stop

Codex deve **fermarsi e segnalare** quando:

- Una decisione richiede nuove battute o riferimenti personali non approvati.
- Manca un link Amazon, ISBN o copertina affidabile.
- Il sistema Bookly non è accessibile o la sua API/struttura non è nota.
- Il caricamento reale impedisce di rispettare un effetto visivo, richiedendo una soluzione pesante.
- Un'interazione compromette accessibilità o prestazioni.

Codex può invece decidere autonomamente dettagli a basso rischio: organizzazione locale dei componenti, nomi delle variabili, piccoli aggiustamenti di spacing, ottimizzazioni di immagini e implementazione dei test, purché non cambino identità e comportamento concordati.

---

## 18. Checklist finale di consegna

- [ ] Brand: nome, palette, logo UR., tono istituzionale preservati.
- [ ] Mobile: hero, archivio, sheet fedeli allo storyboard.
- [ ] Desktop: hero due colonne, carosello 3D, dettagli laterali.
- [ ] Nessun loader fasullo che rallenta l'interazione.
- [ ] Nessun libro/recensione/testimonianza inventato presentato come autentico.
- [ ] Cover e metadati reali verificati prima della pubblicazione.
- [ ] Amazon e share funzionano con fallback.
- [ ] Deep link `?book=` funziona sotto GitHub Pages project path.
- [ ] Lighthouse e audit WCAG documentati.
- [ ] README include avvio locale, gestione libri, hosting, limiti noti.
- [ ] `npm run lint`, `npm run test`, `npm run build` passano.

---

## 19. Decisioni aperte, non bloccanti

1. Repository GitHub e URL definitivi, per impostare `base`.
2. Catalogo effettivo: numero libri e provenienza copertine Bookly.
3. I testi delle **note specifiche per libro** e delle **testimonianze**, da approvare uno a uno.
4. Eventuale look del catalogo su fondo avorio versus scuro; implementare avorio come default e valutare uno sfondo scuro solo se migliora la leggibilità delle copertine.
5. Eventuali simboli o timbri aggiuntivi dopo confronto con il prototipo.

**Le decisioni aperte non devono bloccare M0–M4:** usare config parametrica e demo etichettate come tali.

---

## 20. Criterio guida per tutte le scelte

> **Il sito deve essere divertente anche per chi non comprerà mai un libro, ma deve permettere a chi vuole comprarlo di farlo in due tocchi.**

*Fine del blueprint v1.0.*
