// src/components/church-wedding/ministry-of-the-word.config.ts

export const ministryOfTheWord = {
  number: '08',

  title: 'The Ministry of the Word',

  description:
    'The Celebrant announces the Collect and Readings, followed by prayer before the ministry of the Word begins.',

  type: 'ceremony' as const,

  content: [
    {
      type: 'instruction' as const,
      text: 'The Celebrant then announces the Collect and Readings to the people.',
    },

    {
      type: 'dialogue' as const,
      speaker: 'Celebrant',
      text: 'The Lord be with',
    },

    {
      type: 'dialogue' as const,
      speaker: 'People',
      text: 'And also with you.',
    },

    {
      type: 'dialogue' as const,
      speaker: 'Celebrant',
      text: 'Let us Pray',
    },

    {
      type: 'instruction' as const,
      text: 'This collect or any other suitable one can be said.',
    },

    {
      type: 'prayer' as const,
      text: 'O gracious and ever living God, You have created us male and female in Your image: Look mercifully upon this man and this woman who have come to You seeking Your blessing, and assist them with Your grace, that with true fidelity and steadfast love they may honor and keep the promises and vows they made; through Jesus Christ our Savior who lives and reigns with You in the unity of the Holy Spirit, One God forever and ever. Amen.',
    },
  ],

  images: ['/pro3.png', '/pro6.png'],
};