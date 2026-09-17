// src/components/church-wedding/preparation.config.ts

export const preparation = {
  number: '14',

  title: 'The Peace / Preparation',

  description:
    'The Eucharist continues with the Peace, the preparation of the gifts, the offertory choruses, the ceremonial washing of hands, and the offering of the bread, wine, and gifts.',

  type: 'eucharist' as const,

  content: [
    {
      type: 'subheading' as const,
      text: 'The Peace',
    },

    {
      type: 'dialogue' as const,
      speaker: 'President',
      text: 'Christ is our peace; He has reconciled us to God in One Body by the cross. We meet in His name and share His peace.',
    },

    {
      type: 'instruction' as const,
      text: 'He then says:',
    },

    {
      type: 'dialogue' as const,
      speaker: 'President',
      text: 'The peace of the Lord be always with you.',
    },

    {
      type: 'dialogue' as const,
      speaker: 'All',
      text: 'And also with you.',
    },

    {
      type: 'dialogue' as const,
      speaker: 'President',
      text: 'Let us offer one another a sign of peace.',
    },

    {
      type: 'subheading' as const,
      text: 'The Preparation of the Gifts',
    },

    {
      type: 'instruction' as const,
      text: 'Choruses to be led by the Choir for offertory.',
    },

    {
      type: 'subheading' as const,
      text: 'Ceremonial Washing of Hands',
    },

    {
      type: 'instruction' as const,
      text: 'Ceremonial washing of hands may take place here. These words may be said silently as water is poured on the fingers.',
    },

    {
      type: 'dialogue' as const,
      speaker: 'President',
      text: 'I wash my hands in innocence, O Lord, that I may go about Your altar and lift up the voice of thanksgiving. Amen.',
    },

    {
      type: 'instruction' as const,
      text: 'The President takes the Bread and Cup into his hands and places them on the Holy Table.',
    },

    {
      type: 'subheading' as const,
      text: 'At the Offering of the Bread',
    },

    {
      type: 'dialogue' as const,
      speaker: 'President',
      text: 'Blessed are You, Lord God of all creation, through Your goodness we have this bread to offer which the earth has given and human hands have made. It will become for us the Bread of Life.',
    },

    {
      type: 'dialogue' as const,
      speaker: 'All',
      text: 'Blessed be God for ever. Amen.',
    },

    {
      type: 'subheading' as const,
      text: 'At the Offering of the Wine',
    },

    {
      type: 'dialogue' as const,
      speaker: 'President',
      text: 'Blessed are You, Lord God of all creation, through Your goodness we have this wine to offer, fruit of the vine and work of human hands. It will become our spiritual drink.',
    },

    {
      type: 'dialogue' as const,
      speaker: 'All',
      text: 'Blessed be God forever. Amen.',
    },

    {
      type: 'instruction' as const,
      text: 'Then the President takes the offering in his hands and says with the people:',
    },

    {
      type: 'dialogue' as const,
      speaker: 'All',
      text: 'Yours Lord, is the greatness, the power, the glory, the splendor, and the majesty; for everything in heaven and on earth is Yours. All things come from You and of your own do we give You.',
    },
  ],

  images: ['/pro3.png', '/pro6.png', '/pro9.png'],
};