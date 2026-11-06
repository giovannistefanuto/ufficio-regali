import { copy } from '../content/copy';
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-bottom">
        <span>
          <span>{copy.footer.disclaimer}</span>
          <br />
          <span>{copy.footer.rights}</span>
        </span>
      </div>
    </footer>
  );
}
