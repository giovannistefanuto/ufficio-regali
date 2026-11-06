(async () => {
  const results = [];
  const frame = () => new Promise(requestAnimationFrame);
  const check = (name, passed, details) => {
    results.push({ name, passed: Boolean(passed), details });
    if (!passed) throw new Error(`${name}: ${JSON.stringify(details)}`);
  };
  const headings = [];
  const slugs = [];
  for (let i = 0; i < 11; i++) {
    headings.push(document.querySelector('.selected-book h3').textContent);
    document.querySelector('[aria-label="Libro successivo"]').click();
    await frame();
    slugs.push(new URL(location.href).searchParams.get('book'));
  }
  check('Undici libri raggiungibili senza duplicazioni', new Set(headings).size === 11 && new Set(slugs).size === 11, headings);
  const trigger = () => document.querySelector('.book-trigger');
  trigger().focus();
  for (let i = 0; i < 2; i++) {
    trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await frame();
  }
  check('Focus preservato dopo due frecce', document.activeElement === trigger(), document.activeElement?.className);
  check('URL selezionato sincronizzato', new URL(location.href).searchParams.get('book') === 'le-tre-del-mattino', location.href);
  document.querySelector('.navigation a[href="#indagine"]').click();
  await frame(); await frame();
  check('Anchor non riapre il dialog', !document.querySelector('dialog[open]'), location.href);
  document.getElementById('archive-open').focus();
  document.getElementById('archive-open').click();
  await frame();
  const dialog = document.querySelector('dialog[open]');
  check('Fascicolo del libro selezionato', dialog?.querySelector('h2').textContent === 'Le tre del mattino', dialog?.querySelector('h2').textContent);
  check('Focus iniziale sul pulsante Chiudi', document.activeElement === dialog?.querySelector('.panel-close'), document.activeElement?.className);
  const amazon = dialog.querySelector('a[target="_blank"]');
  check('Acquisto HTTPS protetto senza affiliazione', amazon.href === 'https://www.amazon.it/dp/8806240706' && amazon.rel === 'noopener noreferrer', amazon.href);
  check('Condivisione disponibile', [...dialog.querySelectorAll('button')].some(button => button.textContent.includes('Condividi il fascicolo')));
  check('Nessun overflow orizzontale', document.documentElement.scrollWidth <= innerWidth, { viewport: innerWidth, document: document.documentElement.scrollWidth });
  return results;
})();
