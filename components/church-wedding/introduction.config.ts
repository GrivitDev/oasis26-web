// src/components/church-wedding/introduction.config.ts

export const introduction = {
  number: '02',

  title: 'Introduction',

  description:
    'The congregation remains standing as the bride and bridegroom stand before the Priest and the Priest introduces the marriage and its Christian meaning.',

  type: 'scripture' as const,

  content: [
    {
      type: 'instruction' as const,
      text: 'The congregation remains standing as the bride and bridegroom stand before the Priest and the Priest says:',
    },

    {
      type: 'paragraph' as const,
      segments: [
        {
          text: 'Dear people of God, we have come together in the presence of God, to witness and to celebrate the marriage of ',
        },
        {
          text: 'Joseph and Praise',
          emphasis: 'strong' as const,
        },
        {
          text: ' to ask His blessing on them, and to share in their joy. Our Lord Jesus Christ was Himself a guest at a wedding in Cana of Galilee and blessed this way of life, and through His Spirit He is with us now.',
        },
      ],
    },

    {
      type: 'paragraph' as const,
      text: 'The Scriptures teach us that marriage is a gift of God in creation and a means of His grace, a holy mystery in which man and woman become one flesh. It is God’s purpose that, as husband and wife give themselves to each other in love throughout their lives, they shall be united in their love as Christ is united with His Church.',
    },

    {
      type: 'paragraph' as const,
      text: 'Marriage is given primarily that husband and wife may comfort and help each other, living faithfully together in need and in plenty, in sorrow and in joy. It is also given, that with delight and tenderness, they may know each other in love, and through the joy of their bodily union, may strengthen the union of their hearts and lives. Lastly, it is given that they may have children and be blessed in caring for them and bringing them up in accordance with God’s will, to His praise and glory.',
    },

    {
      type: 'paragraph' as const,
      text: 'In marriage, husband and wife belong to one another, and are linked to each other’s family and they begin a new life together in the community. This is a way of life that all should honor; and it must not be undertaken carelessly, lightly or selfishly but reverently, responsibly, and after serious thought.',
    },

    {
      type: 'paragraph' as const,
      segments: [
        {
          text: 'Into this way of life ',
        },
        {
          text: 'Joseph and Praise',
          emphasis: 'strong' as const,
        },
        {
          text: ' come now to be joined. If anyone of you can show just cause why they may not lawfully be married you must now declare it.',
        },
      ],
    },

    {
      type: 'instruction' as const,
      text: 'If there is no impediment declared, the Priest continues.',
    },
  ],

  images: ['/pro1.png', '/pro6.png'],
};