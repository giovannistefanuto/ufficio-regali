import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { copy } from '../content/copy';

beforeEach(() => {
  history.replaceState(null, '', '/');
  vi.stubGlobal('scrollTo', vi.fn());
});
describe('Navigazione tra le pagine', () => {
  it('mostra la presentazione senza il lungo catalogo nella stessa pagina', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      copy.hero.title,
    );
    expect(screen.getByText(copy.hero.body)).toBeVisible();
    expect(
      screen.queryByRole('heading', { name: copy.archive.title }),
    ).toBeNull();
    expect(screen.queryByText(/Divisione Giovanni/i)).toBeNull();
    expect(
      screen.getByRole('link', { name: /Consulta i risultati/ }),
    ).toHaveAttribute('href', '#archivio');
    expect(
      screen.getByRole('link', { name: /Scopri come abbiamo fatto/ }),
    ).toHaveAttribute('href', '#indagine');
  });
  it('passa al catalogo e torna alla home con le anchor e lo stato del browser', () => {
    render(<App />);
    history.pushState(null, '', '/#archivio');
    fireEvent(window, new HashChangeEvent('hashchange'));
    expect(
      screen.getByRole('heading', { name: copy.archive.title }),
    ).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Libro successivo' }),
    ).toBeVisible();
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
    history.pushState(null, '', '/#top');
    fireEvent(window, new HashChangeEvent('hashchange'));
    expect(screen.getByRole('heading', { level: 1 })).toBeVisible();
  });
  it('apre una scheda condivisa anche sotto una sottocartella', () => {
    history.replaceState(null, '', '/ufficio-regali/?book=clean-code#archivio');
    render(<App />);
    const dialog = screen.getByRole('dialog');
    expect(
      within(dialog).getByRole('heading', { name: /Clean Code/ }),
    ).toBeVisible();
  });
  it('apre il menu e lo chiude dopo una scelta o con Escape', async () => {
    const user = userEvent.setup();
    render(<App />);
    const toggle = screen.getByRole('button', { name: /Menu/ });
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await user.click(
      within(screen.getByRole('navigation')).getByRole('link', {
        name: 'I libri',
      }),
    );
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    await user.keyboard('{Escape}');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
  });
  it('mostra le altre pagine dal menu', () => {
    render(<App />);
    history.pushState(null, '', '/#indagine');
    fireEvent(window, new HashChangeEvent('hashchange'));
    expect(
      screen.getByRole('heading', { name: copy.investigation.title }),
    ).toBeVisible();
    expect(
      screen.getByRole('link', { name: /Come abbiamo scelto/ }),
    ).toHaveAttribute('href', '#metodologia');
    history.pushState(null, '', '/#metodologia');
    fireEvent(window, new HashChangeEvent('hashchange'));
    expect(
      screen.getByRole('heading', { name: copy.methodology.title }),
    ).toBeVisible();
    expect(screen.getByText(copy.methodology.details[0])).toBeVisible();
    expect(screen.getByText(copy.footer.disclaimer)).toBeVisible();
  });
});
