import { copy } from '../content/copy';

export function MethodologySection() {
  return (
    <section
      id="metodologia"
      className="methodology section"
      aria-labelledby="methodology-title"
      tabIndex={-1}
    >
      <div className="container methodology-grid">
        <div>
          <h2 id="methodology-title">{copy.methodology.title}</h2>
          <p className="story-intro">{copy.methodology.intro}</p>
        </div>
        <div>
          <ol className="methodology-steps">
            {copy.methodology.steps.map((step, index) => (
              <li key={step}>
                <div>
                  <h3>{step}</h3>
                  <p>{copy.methodology.details[index]}</p>
                  {index === 2 && (
                    <p className="advice-closing">
                      {copy.methodology.adviceClosing}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <div className="story-aside">
            <h3>{copy.methodology.resultTitle}</h3>
            <p>{copy.methodology.closing}</p>
          </div>
          <a className="button button-primary" href="#archivio">
            Guarda i libri <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
