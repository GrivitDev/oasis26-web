// src/components/church-wedding/communion-hymns.config.ts

export const communionHymns = {
  number: '22',

  title: 'Communion Hymns',

  description:
    'Solemn lyrics or hymns may be sung during the distribution of Holy Communion.',

  type: 'hymns' as const,

  content: {
    instruction:
      'During the distribution solemn lyrics or hymns may be sung.',

    hymns: [
      'WC: 5',
      'WC: 14',
      'WC: 18',
      'WC: 72',
      'WC: 358',
    ],
  },

  images: ['/pro1.png', '/pro5.png'],
};