export type EvidenceTag =
  'interesse-confermato' | 'segnalazione-ricorrente' | 'acquisto-rimandato';
export interface Book {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  author: string;
  isbn13?: string;
  publisher?: string;
  edition?: string;
  demo?: boolean;
  cover: {
    src: string;
    width: number;
    height: number;
    alt: string;
    source: string;
    smallSrc?: string;
  };
  spineColor: string;
  accentColor: string;
  evidenceTag: EvidenceTag;
  officeNote: string;
  amazonUrl?: string;
  visible: boolean;
  order: number;
  provenance?: {
    photo: string;
    metadataUrl: string;
    verifiedOn: string;
    amazonVerifiedOn?: string;
  };
}
