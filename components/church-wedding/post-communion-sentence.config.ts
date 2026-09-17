// src/components/church-wedding/post-communion-sentence.config.ts

export const postCommunionSentence = {
  number: '24',

  title: 'Post Communion Sentence',

  description:
    'The congregation hears the post communion sentence and joins the President in the Lord’s Prayer.',

  type: 'prayer' as const,

  content: [
    {
      type: 'scripture' as const,
      reference: '2 Corinthians 5:7',
      text: 'We live by faith, not by sight.',
    },

    {
      type: 'dialogue' as const,
      speaker: 'President',
      text: 'As our Saviour taught us so we pray.',
    },

    {
      type: 'dialogue' as const,
      speaker: 'All',
      text: 'Our Father in Heaven, hallowed be Your name, Your Kingdom come, your will be done on earth as in heaven. Give us today our daily bread. Forgive us our sins as we forgive those who sin against us. Lead us not into temptation but deliver us from evil. For the kingdom, the power and the glory are Yours now and forever. Amen.',
    },
  ],

  images: ['/pro6.png', '/pro8.png'],
};