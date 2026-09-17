// src/components/church-wedding/declarations.config.ts

export const declarations = {
  number: '03',

  title: 'Declarations',

  description:
    'The Priest formally charges Joseph and Praise concerning the vows they are about to make and asks each of them to affirm their free consent to the marriage.',

  type: 'ceremony' as const,

  content: [
    {
      type: 'instruction' as const,
      text: 'The Priest says to the couple:',
    },

    {
      type: 'paragraph' as const,
      segments: [
        {
          text: 'Joseph and Praise, the vows you are about to take are to be made in the name of God and I charge you both, as you will answer before God who is the judge of all and who knows all the secrets of our hearts: that if either of you knows a reason why you may not lawfully marry, you must declare it now.',
        },
      ],
    },

    {
      type: 'instruction' as const,
      text: 'If there is no impediment declared, the Priest continues. The congregation sits while the couple stand and the Priest says to the bridegroom:',
    },

    {
      type: 'paragraph' as const,
      segments: [
        {
          text: 'Joseph, of your own free choice, will you take ',
        },
        {
          text: 'Praise',
          emphasis: 'strong' as const,
        },
        {
          text: ' to be your wife?',
        },
      ],
    },

    {
      type: 'response' as const,
      label: 'The bridegroom answers:',
      text: 'I will.',
    },

    {
      type: 'paragraph' as const,
      text: 'Will you love her, comfort her, honour and protect her, in sickness and in health, in poverty and prosperity and, forsaking all others, be faithful to her as long as you both shall live?',
    },

    {
      type: 'response' as const,
      label: 'The bridegroom answers:',
      text: 'I will.',
    },

    {
      type: 'instruction' as const,
      text: 'The Priest says to the bride:',
    },

    {
      type: 'paragraph' as const,
      segments: [
        {
          text: 'Praise, of your own free choice will you take ',
        },
        {
          text: 'Joseph',
          emphasis: 'strong' as const,
        },
        {
          text: ' to be your husband?',
        },
      ],
    },

    {
      type: 'response' as const,
      label: 'The bride answers:',
      text: 'I will.',
    },

    {
      type: 'paragraph' as const,
      text: 'Will you love him, comfort him, honour and protect him, obey and serve him, in sickness and in health, in poverty and prosperity and, forsaking all others, be faithful to him as long as you both shall live?',
    },

    {
      type: 'response' as const,
      label: 'The bride answers:',
      text: 'I will.',
    },
  ],

  images: ['/pro4.png', '/pro8.png'],
};