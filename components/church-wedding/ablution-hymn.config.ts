// src/components/church-wedding/ablution-hymn.config.ts

export const ablutionHymn = {
  number: '23',

  title: 'Ablution Hymn',

  description:
    'A hymn may be sung during the Ablution following the distribution of Holy Communion.',

  type: 'hymn' as const,

  content: {
    instruction: 'A Hymn may be sung. (Ablution)',

    hymnNumber: '',
    hymnTitle: 'When We Walk with the Lord',
    author: '',
    verses: [],
  },

  images: ['/pro3.png'],
};