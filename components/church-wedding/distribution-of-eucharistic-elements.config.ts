// src/components/church-wedding/distribution-of-eucharistic-elements.config.ts

export const distributionOfEucharisticElements = {
  number: '20',

  title: 'The Distribution of the Eucharistic Elements',

  description:
    'The President invites the congregation to draw near with faith and receive the Body and Blood of our Lord Jesus Christ.',

  type: 'eucharist' as const,

  content: [
    {
      type: 'instruction' as const,
      text: 'Before the distribution, the President says:',
    },

    {
      type: 'dialogue' as const,
      speaker: 'President',
      text: 'Draw near with faith, receive the Body of our Lord Jesus Christ which He gave for you and His Blood which He shed for you. Eat and drink in remembrance that He died for you and feed on Him in your heart by faith with thanksgiving.',
    },
  ],

  images: ['/pro2.png', '/pro7.png', '/pro9.png'],
};