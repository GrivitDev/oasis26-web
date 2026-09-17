// src/config/seo.ts

export const SEO = {
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    'https://oasis2026.vercel.app/',

  title: "OASIS'26 | Joseph & Praise Wedding",

  shortTitle: "OASIS'26",

  description:
    "Celebrate the wedding of Miss Praise Cinwon Ajawo and Rev'd Joseph Nasara Musa. Explore their love story, wedding programme, venues, directions, wedding party, gallery, blessings, donations, and RSVP.",

  keywords: [
    "OASIS'26",
    'Joseph and Praise',
    'Praise and Joseph wedding',
    'Joseph Nasara Musa',
    'Praise Cinwon Ajawo',
    'OASIS wedding',
    'wedding Lokoja',
    'wedding Nigeria',
    'traditional wedding',
    'church wedding',
    'wedding reception',
    'wedding programme',
    'wedding gallery',
    'wedding RSVP',
  ],

  image: '/og-image.jpg',

  siteName: "OASIS'26",

  locale: 'en_NG',

  themeColor: '#025740',

  author: {
    name: "OASIS'26",
    url:
      process.env.NEXT_PUBLIC_SITE_URL ??
      'https://oasis2026.vercel.app/',
  },
} as const;