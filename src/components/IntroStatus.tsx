import { useEffect, useState } from 'react';
const frames = [
  ['Un regalo per Giovanni?', 'È stata aperta una pratica.'],
  ['«Non mi serve niente.»', 'Attendibilità della dichiarazione: in esame.'],
  [
    'Abbiamo trovato dei libri.',
    'I risultati sono disponibili per la consultazione.',
  ],
];
function shouldSkip() {
  if (
    new URL(window.location.href).searchParams.has('book') ||
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
    return true;
  try {
    return sessionStorage.getItem('ur-intro-v1') === 'done';
  } catch {
    return true;
  }
}
function remember() {
  try {
    sessionStorage.setItem('ur-intro-v1', 'done');
  } catch {
    /* Content remains usable without storage. */
  }
}
export function IntroStatus() {
  const [frame, setFrame] = useState(() => (shouldSkip() ? 2 : 0));
  useEffect(() => {
    if (frame === 2) return;
    const timer = window.setTimeout(() => {
      setFrame(frame + 1);
      if (frame === 1) remember();
    }, 900);
    return () => window.clearTimeout(timer);
  }, [frame]);
  return (
    <div className="intro-status">
      <div key={frame} className="intro-frame">
        <p>{frames[frame][0]}</p>
        <p className="microcopy">{frames[frame][1]}</p>
      </div>
      {frame < 2 ? (
        <button
          type="button"
          onClick={() => {
            setFrame(2);
            remember();
          }}
        >
          Salta introduzione <span aria-hidden="true">→</span>
        </button>
      ) : null}
    </div>
  );
}
