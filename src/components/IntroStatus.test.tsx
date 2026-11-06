import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IntroStatus } from './IntroStatus';
beforeEach(() => {
  sessionStorage.clear();
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
describe('Introduzione non bloccante M5', () => {
  it('termina in 1.8 secondi e non si ripete nella sessione', () => {
    const { unmount } = render(<IntroStatus />);
    expect(screen.getByText('È stata aperta una pratica.')).toBeVisible();
    act(() => vi.advanceTimersByTime(900));
    expect(
      screen.getByText('Attendibilità della dichiarazione: in esame.'),
    ).toBeVisible();
    act(() => vi.advanceTimersByTime(900));
    expect(
      screen.getByText('I risultati sono disponibili per la consultazione.'),
    ).toBeVisible();
    expect(screen.queryByRole('button')).toBeNull();
    unmount();
    render(<IntroStatus />);
    expect(screen.getByText('Abbiamo trovato dei libri.')).toBeVisible();
  });
  it('può essere saltata subito', () => {
    render(<IntroStatus />);
    fireEvent.click(screen.getByRole('button', { name: /Salta/ }));
    expect(screen.getByText('Abbiamo trovato dei libri.')).toBeVisible();
    expect(sessionStorage.getItem('ur-intro-v1')).toBe('done');
  });
  it('mostra direttamente il finale con reduced motion o link diretto', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    const { unmount } = render(<IntroStatus />);
    expect(screen.queryByRole('button')).toBeNull();
    unmount();
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    history.replaceState(null, '', '/?book=un-libro');
    render(<IntroStatus />);
    expect(screen.getByText('Abbiamo trovato dei libri.')).toBeVisible();
  });
  it('funziona anche con storage non accessibile', () => {
    const spy = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('denied');
      });
    render(<IntroStatus />);
    expect(screen.getByText('Abbiamo trovato dei libri.')).toBeVisible();
    spy.mockRestore();
  });
});
