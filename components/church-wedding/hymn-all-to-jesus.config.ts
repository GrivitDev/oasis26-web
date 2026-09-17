// src/components/church-wedding/hymn-all-to-jesus.config.ts

export const hymnAllToJesus = {
  number: '04',

  title: 'Hymn — All to Jesus I Surrender',

  description:
    'WC: 13 — All to Jesus I Surrender',

  type: 'hymn' as const,

  content: {
    hymnNumber: 'WC: 13',

    hymnTitle: 'All to Jesus I Surrender',

    author: 'J. W. Van DeVenter',

    verses: [
      {
        lines: [
          'All to Jesus I surrender,',
          'All to Him I freely give;',
          'I will ever love and trust Him,',
          'In His presence daily live.',
        ],
        refrain: [
          'I surrender all, I surrender all;',
          'All to Thee, my blessed Saviour,',
          'I surrender all.',
        ],
      },

      {
        lines: [
          'All to Jesus I surrender,',
          'Humbly at His feet I bow;',
          'Worldly pleasures all forsaken,',
          'Take me, Jesus, take me now.',
        ],
      },

      {
        lines: [
          'All to Jesus I surrender,',
          'Make me, Saviour, wholly Thine;',
          'Let me feel the Holy Spirit,',
          'Truly know that Thou art mine.',
        ],
      },

      {
        lines: [
          'All to Jesus I surrender,',
          'Lord, I give myself to Thee;',
          'Fill me with Thy love and power,',
          'Let Thy blessing fall on me.',
        ],
      },

      {
        lines: [
          'All to Jesus I surrender,',
          'Now I feel the sacred flame;',
          'Oh, the joy of full salvation!',
          'Glory, glory, to His Name!',
        ],
      },
    ],
  },

  images: ['/pro3.png'],
};