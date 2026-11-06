import type { EvidenceTag as Tag } from '../types/book';
const labels: Record<Tag, string> = {
  'interesse-confermato': 'INTERESSE CONFERMATO',
  'segnalazione-ricorrente': 'SEGNALAZIONE RICORRENTE',
  'acquisto-rimandato': 'ACQUISTO RIMANDATO',
};
export function EvidenceTag({ value }: { value: Tag }) {
  return (
    <span className="evidence-tag">
      <span className="status-dot" aria-hidden="true" />
      {labels[value]}
    </span>
  );
}
