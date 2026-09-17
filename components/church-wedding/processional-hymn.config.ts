// src/components/church-wedding/processional-hymn.config.ts

export const processionalHymn = {
  number: '01',

  title: 'Processional Hymn',

  description:
    'WC: 283 — Praise My Soul the King of Heaven',

  type: 'hymn' as const,

  content: {
    hymnNumber: 'WC: 283',

    hymnTitle: 'Praise My Soul the King of Heaven',

    author: 'H. F. Lyte',

    verses: [
      [
        'Praise my soul, the King of heaven;',
        'To His feet thy tribute bring.',
        'Ransomed, healed, restored, forgiven,',
        'Who like me His praise should sing?',
        'Alleluia! Alleluia!',
        'Praise the everlasting King.',
      ],

      [
        'Praise Him for His grace and favour',
        'To our fathers in distress;',
        'Praise Him still the same forever,',
        'Slow to chide and swift to bless.',
        'Alleluia! Alleluia!',
        'Glorious in His faithfulness.',
      ],

      [
        'Father-like, He tends and spares us;',
        'Well our feeble frame He knows;',
        'In His hands He gently bears us,',
        'Rescues us from all our foes.',
        'Alleluia! Alleluia!',
        'Widely yet His mercy flows.',
      ],

      [
        'Angels, help us to adore Him;',
        'Ye behold Him face to face;',
        'Sun and moon, bow down before Him;',
        'Dwellers all in time and space.',
        'Alleluia! Alleluia!',
        'Praise with us the God of grace.',
      ],
    ],
  },

  images: ['/pro.png'],
};