// src/components/church-wedding/prayer-of-humble-access.config.ts

export const prayerOfHumbleAccess = {
  number: '19',

  title: 'Prayer of Humble Access',

  description:
    'A prayer of humility and faith before receiving Holy Communion.',

  type: 'prayer' as const,

  content: [
    {
      type: 'instruction' as const,
      text: 'All kneeling.',
    },

    {
      type: 'dialogue' as const,
      speaker: 'All',
      text: 'We do not presume to come to this Your table, Merciful Lord, trusting in our own righteousness but in Your manifold and great mercies. We are not worthy so much as to gather up the crumbs under Your table, but You are the same Lord, whose nature is always to have mercy. Grant us, therefore, Gracious Lord, so to eat the flesh of Your Dear Son Jesus Christ, and to drink His Blood; that we may evermore dwell in Him and He in us. Amen.',
    },
  ],

  images: ['/pro6.png', '/pro9.png'],
};