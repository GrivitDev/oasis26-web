// src/components/church-wedding/acclamation.config.ts

export const acclamation = {
  number: '06',

  title: 'The Acclamation',

  description:
    'An acclamation in which the groom’s family formally receives Praise into the family and makes a commitment of prayer and moral support.',

  type: 'ceremony' as const,

  content: [
    {
      type: 'instruction' as const,
      text: 'These acclamations may be used.',
    },

    {
      type: 'subheading' as const,
      text: '(i)',
    },

    {
      type: 'instruction' as const,
      text: 'The parents of the bridegroom or their representatives will move forward.',
    },

    {
      type: 'dialogue' as const,
      speaker: 'Priest',
      text: 'In the name of God and in the presence of this congregation we hand over Praise Ajawo now Mrs. Praise Joe-Musa to you as a full member of your family. Will you promise on behalf of your family to continue to uphold them in your prayer and give them your moral support?',
    },

    {
      type: 'dialogue' as const,
      speaker: 'The Parents of Groom',
      text: 'We promise in the name of God.',
    },

    {
      type: 'subheading' as const,
      text: '(ii)',
    },

    {
      type: 'instruction' as const,
      text: 'The Priest then prays for the family.',
    },

    {
      type: 'prayer' as const,
      text: 'Eternal God, creator and sustainer of us all, give your grace to the family of Rev’d & Mrs. Joe- Musa. Grant them that in the years ahead they may live together in the love, joy and peace of our Saviour Jesus Christ. Amen.',
    },
  ],

  images: ['/pro4.png', '/pro8.png'],
};