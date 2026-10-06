// src/components/church-wedding/conclusion.config.ts

export const conclusion = {
  number: '26-35',

  title: 'Conclusion',

  description: 'The closing items of the marriage service.',

  type: 'conclusion' as const,

  content: [
    {
      type: 'subsection' as const,
      number: '26',
      title: 'Signing of Marriage Certificate and Register',
      content: [],
    },

    {
      type: 'subsection' as const,
      number: '27',
      title: 'Special Anthem: Women Choir & Church Choir.',
      content: [],
    },

    {
      type: 'subsection' as const,
      number: '28',
      title: 'Special Anthem: Cathedral Women Choir (Diocese of Idah)',
      content: [],
    },

    {
      type: 'subsection' as const,
      number: '29',
      title: 'Introduction of the couple and presentation of Marriage Certificate',
      content: [],
    },

    {
      type: 'subsection' as const,
      number: '30',
      title: 'Marriage thanksgivings',
      content: [],
    },

    {
      type: 'subsection' as const,
      number: '31',
      title: 'Presentation of gift by the MU/WG',
      content: [],
    },

    {
      type: 'subsection' as const,
      number: '32',
      title: 'Announcement',
      content: [],
    },

    {
      type: 'subsection' as const,
      number: '33',
      title: 'Dismissal',
      content: [
        {
          type: 'dialogue' as const,
          speaker: 'President',
          text: 'Go in peace to love and serve the Lord.',
        },
        {
          type: 'dialogue' as const,
          speaker: 'All',
          text: 'In the name of Christ, Amen.',
        },
      ],
    },

    {
      type: 'subsection' as const,
      number: '34',
      title: 'Prayer & Benediction',
      content: [
        {
          type: 'prayer' as const,
          text: 'May God make you strong in faith and love, defend you on every side, and guide you in truth and peace; and the blessing of God Almighty, the Father, the Son and the Holy Spirit, be among you and remain with you always. Amen.',
        },
      ],
    },

    {
      type: 'subsection' as const,
      number: '35',
      title: 'Hallelujah Chorus',
      content: [],
    },
  ],

  images: ['/pro1.png', '/pro4.png', '/pro8.png'],
};
