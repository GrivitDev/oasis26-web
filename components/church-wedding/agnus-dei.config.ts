// src/components/church-wedding/agnus-dei.config.ts

export const agnusDei = {
  number: '18',

  title: 'Agnus Dei',

  description:
    'The congregation kneels and joins the President in the threefold prayer for mercy and peace.',

  type: 'liturgy' as const,

  content: [
    {
      type: 'instruction' as const,
      text: 'All kneeling.',
    },

    {
      type: 'dialogue' as const,
      speaker: 'President',
      text: 'Lamb of God, You take away the sins of the world.',
    },

    {
      type: 'dialogue' as const,
      speaker: 'All',
      text: 'Have mercy on us.',
    },

    {
      type: 'dialogue' as const,
      speaker: 'President',
      text: 'Lamb of God, You take away the sins of the world.',
    },

    {
      type: 'dialogue' as const,
      speaker: 'All',
      text: 'Have mercy on us.',
    },

    {
      type: 'dialogue' as const,
      speaker: 'President',
      text: 'Lamb of God, You take away the sins of the world.',
    },

    {
      type: 'dialogue' as const,
      speaker: 'All',
      text: 'Grant us peace.',
    },
  ],

  images: ['/pro3.png'],
};