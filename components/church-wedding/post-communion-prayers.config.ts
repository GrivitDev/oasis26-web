// src/components/church-wedding/post-communion-prayers.config.ts

export const postCommunionPrayers = {
  number: '25',

  title: 'Post Communion Prayers',

  description:
    'Prayers of thanksgiving and dedication following Holy Communion.',

  type: 'prayers' as const,

  content: [
    {
      type: 'instruction' as const,
      text: 'Either or both of the following prayers or other suitable prayer is said:',
    },

    {
      type: 'dialogue' as const,
      speaker: 'President',
      text: 'Father of all we give You thanks and praise, that when we were still far off You met us in Your Son and brought us home. Dying and living He declared Your love, gave us grace, and opened the gate of glory. May we who share Christ’s Body live His risen life. We who drink His cup, bring life to others. We whom the Spirit lights give light to the world. Keep us firm in the hope You have set before us. So, we and Your children shall be free and the whole earth live to praise Your name; through Christ our Lord.',
    },

    {
      type: 'dialogue' as const,
      speaker: 'All',
      text: 'Amen.',
    },

    {
      type: 'dialogue' as const,
      speaker: 'All',
      text: 'Almighty God, we thank You for feeding us with the Body and Blood of Your Son Jesus Christ. Through Him we offer You our souls and bodies to be a living sacrifice. Send us out in the power of Your Spirit to live and work to Your praise and glory. Amen.',
    },
  ],

  images: ['/pro2.png', '/pro7.png', '/pro9.png'],
};