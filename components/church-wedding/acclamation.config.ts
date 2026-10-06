// src/components/church-wedding/acclamation.config.ts

export const acclamation = {
  number: '06',

  title: 'The Acclamation',

  description:
    'The acclamation following the marriage, including the formal reception of the bride into the groom’s family.',

  type: 'ceremony' as const,

  content: [
    {
      type: 'instruction' as const,
      text: 'These acclamations may be used.',
    },

    {
      type: 'instruction' as const,
      text: '(i) (The Parents of the bridegroom or their representatives will move forward.)',
    },

    {
      type: 'dialogue' as const,
      speaker: 'Priest',
      text: 'In the name of God and in the presence of this congregation we hand over Praise Ajawo now Mrs. Praise Joe-Musa to you as a full member of your family. Will you promise on behalf of your family to continue to up-hold them in your prayer and give them your moral support?',
    },

    {
      type: 'dialogue' as const,
      speaker: 'The Parents of Groom',
      text: 'We promise in the name of God',
    },

    {
      type: 'instruction' as const,
      text: '(ii) The Priest then prays for the family.',
    },

    {
      type: 'prayer' as const,
      text: 'Eternal God, creator and sustainer of us all, give your grace to the family of Rev’d & Mrs. Joe- Musa. Grant them that in the years ahead they may live together in the love, joy and peace of our Saviour Jesus Christ. Amen.',
    },
  ],

  images: ['/pro4.png', '/pro8.png'],
};
