// src/components/church-wedding/hymn-o-perfect-love.config.ts

export const hymnOPerfectLove = {
  number: '12',

  title: 'Hymn Before Prayers — O Perfect Love',

  description:
    'WC: 260 — O Perfect Love. The hymn is sung while the couple kneels.',

  type: 'hymn' as const,

  content: {
    hymnNumber: 'WC: 260',

    hymnTitle: 'O Perfect Love',

    author: 'D. F. Gurney',

    instruction: 'Hymn is sung kneeling.',

    verses: [
      {
        lines: [
          'O perfect Love, all human thought transcending,',
          'Lowly we kneel in prayer before Thy throne,',
          'That theirs may be the love which knows no ending',
          'Whom Thou for evermore dost join in one.',
        ],
      },

      {
        lines: [
          'O perfect Life, be Thou their full assurance',
          'Of tender charity and steadfast faith,',
          'Of patient hope and quiet brave endurance,',
          'With childlike trust that fears nor pain nor death.',
        ],
      },

      {
        lines: [
          'Grant them the joy which brightens earthly sorrow,',
          'Grant them the peace which calms all earthly strife;',
          'And to life’s day the glorious unknown morrow',
          'That dawns upon eternal love and life.',
        ],
      },
    ],
  },

  images: ['/pro5.png', '/pro8.png'],
};