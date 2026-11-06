import { copy } from '../content/copy';

export function InvestigationSection() {
  return (
    <section
      id="indagine"
      className="investigation section"
      aria-labelledby="investigation-title"
      tabIndex={-1}
    >
      <div className="container investigation-grid">
        <div>
          <h2 id="investigation-title">{copy.investigation.title}</h2>
          <blockquote className="story-quote">
            {copy.investigation.opening}
          </blockquote>
        </div>
        <div className="investigation-copy">
          {copy.investigation.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
          <div className="story-aside">
            <h3>{copy.investigation.sourcesTitle}</h3>
            {copy.investigation.sources.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
          <p className="investigation-closing">
            <span aria-hidden="true">↳</span> {copy.investigation.closing}
          </p>
          <div className="story-actions">
            <a className="button button-primary" href="#archivio">
              Consulta i libri <span aria-hidden="true">→</span>
            </a>
            <a className="story-link" href="#metodologia">
              Come abbiamo scelto <span aria-hidden="true">→</span>
            </a>
          </div>
          <p className="confidential-note">{copy.investigation.confidential}</p>
        </div>
      </div>
    </section>
  );
}
