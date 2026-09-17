// src/components/church-wedding/church-wedding-program.types.ts

export type ChurchWeddingContentBlock =
  | {
      type: 'instruction';
      text: string;
    }
  | {
      type: 'paragraph' | 'prayer';
      text: string;
    }
  | {
      type: 'question';
      text: string;
      label?: string;
    }
  | {
      type: 'response';
      text: string;
      label?: string;
    }
  | {
      type: 'dialogue';
      speaker: string;
      text: string;
    }
  | {
      type: 'subheading';
      text: string;
    }
  | {
      type: 'scripture';
      reference: string;
      text: string;
    }
  | {
      type: 'subsection';
      number: string;
      title: string;
      content: ChurchWeddingContentBlock[];
    };

export type ChurchWeddingHymnVerse =
  | string[]
  | {
      lines: string[];
      refrain?: string[];
    };

export type ChurchWeddingConfig = {
  number: string;
  title: string;
  description: string;
  type: string;
  content:
    | ChurchWeddingContentBlock[]
    | {
        hymnNumber?: string;
        hymnTitle?: string;
        author?: string;
        instruction?: string;
        verses?: ChurchWeddingHymnVerse[];

        translation?: string;
        reference?: string;
        heading?: string;
        subtitle?: string;

        sections?: Array<{
          heading?: string;
          verses?: Array<{
            number: string;
            text: string;
          }>;
        }>;

        topic?: string;
        preacher?: string;

        openingPrayer?: {
          title: string;
          text: string;
        };

        closingPrayer?: {
          title: string;
          text: string;
        };

        readings?: Array<{
          label: string;
          reference: string;
        }>;

        text?: string;
        notes?: string[];

        hymns?: string[];
        choruses?: string[];
        prayers?: Array<{
          text: string;
        }>;
      };
  images?: string[];
};