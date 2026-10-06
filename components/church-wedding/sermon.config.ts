// src/components/church-wedding/sermon.config.ts

export const sermon = {
  number: '11',

  title: 'Sermon',

  description: 'Sermon.',

  type: 'ceremony' as const,

  content: [
    {
      type: 'instruction' as const,
      text: 'Sermon',
    },
  ],

  images: ['/pro2.png', '/pro6.png', '/pro9.png'],
};
