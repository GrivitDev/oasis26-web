// src/components/church-wedding/communion-distribution.config.ts

export const communionDistribution = {
  number: '21',

  title: 'Distribution of Holy Communion',

  description:
    'The President and people receive Holy Communion, with the Minister giving the appropriate words to each communicant.',

  type: 'eucharist' as const,

  content: [
    {
      type: 'instruction' as const,
      text: 'The President and people receive the communion.',
    },

    {
      type: 'instruction' as const,
      text: 'At the distribution the Minister says to each communicant:',
    },

    {
      type: 'response' as const,
      label: '(a)',
      text: 'The body of Christ keep you in eternal life.',
    },

    {
      type: 'response' as const,
      label: '',
      text: 'The blood of Christ keeps you in eternal life.',
    },

    {
      type: 'instruction' as const,
      text: 'The communicant replies each time:',
    },

    {
      type: 'response' as const,
      label: 'Communicant',
      text: 'Amen.',
    },
  ],

  images: ['/pro4.png'],
};