// src/components/church-wedding/post-communion-hymn.config.ts

export const postCommunionHymn = {
  number: '24A',

  title: 'Post Communion Hymn',

  description: 'WC: 215 (LOVE divine all love excelling).',

  type: 'hymn' as const,

  content: {
    hymnNumber: 'WC: 215',
    hymnTitle: 'LOVE divine all love excelling',
    author: '',
    verses: [
      {
        lines: [
          'Love divine, all loves excelling,',
          "Joy of Heav'n to Earth come down,",
          'Fix in us thy humble dwelling,',
          'All thy faithful mercies crown;',
          'Jesus, thou art all compassion,',
          'Pure, unbounded love thou art;',
          'Visit us with thy salvation,',
          "Enter ev'ry trembling heart.",
        ],
      },
      {
        lines: [
          'Breathe, O breathe thy loving Spirit',
          'Into ev’ry troubled breast;',
          'Let us all in thee inherit,',
          'Let us find thy promised rest;',
          'Take away our love of sinning;',
          'Alpha and Omega be;',
          'End of faith as its beginning,',
          'Set our hearts at liberty.',
        ],
      },
      {
        lines: [
          'Come, Almighty to deliver;',
          'Let us all thy grace receive;',
          'Suddenly return, and never,',
          'Never more thy temples leave.',
          'Thee we would be always blessing,',
          'Serve thee as thy host above,',
          'Pray, and praise thee without ceasing,',
          'Glory in thy perfect love.',
        ],
      },
      {
        lines: [
          'Finish, then, thy new creation;',
          'Pure and spotless let us be;',
          'Let us see thy great salvation',
          'Perfectly restored in thee;',
          'Changed from glory into glory',
          "Till in Heav'n we take our place,",
          'Till we cast our crowns before thee,',
          'Lost in wonder, love, and praise!',
        ],
      },
    ],
  },

  images: ['/pro4.png'],
};