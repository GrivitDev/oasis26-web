// src/components/church-wedding/the-marriage.config.ts

export const theMarriage = {
  number: '05',

  title: 'The Marriage',

  description:
    'The bride is formally given in marriage, the couple exchange their vows and rings, and the Priest declares and blesses them as husband and wife.',

  type: 'ceremony' as const,

  content: [
    {
      type: 'instruction' as const,
      text: 'Then the Priest asks:',
    },

    {
      type: 'question' as const,
      text: 'Who gives this woman to be married to this man?',
    },

    {
      type: 'instruction' as const,
      text: 'The father or the representative of the family comes out and says, “I do”. He then hands over the Bride to the Priest.',
    },

    {
      type: 'instruction' as const,
      text: 'The Priest, receiving the bride from the hand of her father, shall cause the man to take the woman by his right hand, facing each other. The groom unveils the bride and says:',
    },

    {
      type: 'paragraph' as const,
      segments: [
        {
          text: 'I, ',
        },
        {
          text: 'Joseph',
          emphasis: 'strong' as const,
        },
        {
          text: ' take you, ',
        },
        {
          text: 'Praise',
          emphasis: 'strong' as const,
        },
        {
          text: ' to be my wife, to have and to hold from this day forward: for better for worse, for richer, for poorer, in sickness and in health, to love and to cherish, until we are parted by death according to God’s holy law. This is my solemn vow:',
        },
      ],
    },

    {
      type: 'instruction' as const,
      text: 'They loose hands.',
    },

    {
      type: 'instruction' as const,
      text: 'The bride takes the bridegroom’s right hand in hers, and says:',
    },

    {
      type: 'paragraph' as const,
      segments: [
        {
          text: 'I, ',
        },
        {
          text: 'Praise',
          emphasis: 'strong' as const,
        },
        {
          text: ' take you, ',
        },
        {
          text: 'Joseph',
          emphasis: 'strong' as const,
        },
        {
          text: ' to be my husband, to have and to hold from this day forward; for better, for worse, for richer, for poorer, in sickness and in health, to love and to cherish, until we are parted by death according to God’s holy law: This is my solemn vow:',
        },
      ],
    },

    {
      type: 'instruction' as const,
      text: 'They loose hands.',
    },

    {
      type: 'question' as const,
      label: 'The Priest:',
      text: 'And what token do you share to represent your love and commitment to each other?',
    },

    {
      type: 'instruction' as const,
      text: 'The Priest receives the ring(s). Holding up the ring, says:',
    },

    {
      type: 'paragraph' as const,
      text: 'The ring is the symbol of wholeness and perfection. It is made of gold which is a precious and durable metal. What better representation of your feelings for each other!',
    },

    {
      type: 'prayer' as const,
      label: '(a)',
      text: 'Heavenly Father, by your blessing, let these rings be to Joseph and Praise a symbol of unending love and faithfulness, to remind them of the vow and covenant which they have made this day; through Jesus Christ our Lord. Amen.',
    },

    {
      type: 'instruction' as const,
      text: 'The bridegroom places the ring on the fourth finger of the bride’s left hand, and holding it there, says:',
    },

    {
      type: 'paragraph' as const,
      text: 'I give you this ring as a sign of our marriage and a token of my love and fidelity to you. With my body I honour you, all that I am I give to you and all that I have I share with you, within the love of God, Father, Son and Holy Spirit. Amen.',
    },

    {
      type: 'instruction' as const,
      text: 'If rings are exchanged, they loose hands and the bride places a ring on the fourth finger of the bridegroom’s left hand, and holding it there says:',
    },

    {
      type: 'paragraph' as const,
      text: 'I give you this ring as a sign of our marriage and a token of my love and fidelity to you. With my body I honour you, all that I am I give to you and all that I have I share with you, within the love of God, Father, Son, and Holy Spirit. Amen.',
    },

    {
      type: 'instruction' as const,
      text: 'The bride and bridegroom kneel. While the congregation remains standing, the Priest says:',
    },

    {
      type: 'prayer' as const,
      text: 'Eternal God, Creator and Preserver of all, giver of spiritual grace, and author of everlasting life: send Your blessing upon Joseph and Praise whom we bless in Your name that living faithfully together they may fulfill the vow and covenant they have made of which the ring given and received is a token and pledge and may ever remain in perfect love and peace together and live according to Your laws; through Jesus Christ our Lord. Amen.',
    },

    {
      type: 'paragraph' as const,
      segments: [
        {
          text: 'Now that ',
        },
        {
          text: 'Joseph and Praise',
          emphasis: 'strong' as const,
        },
        {
          text: ' have given their consent and made their vows to each other before God and this congregation, with the joining of hands and the giving and receiving of ring, in the name of God, I declare that they are husband and wife.',
        },
      ],
    },

    {
      type: 'instruction' as const,
      text: 'The Priest joins their right hands together and says:',
    },

    {
      type: 'paragraph' as const,
      text: 'Those whom God has joined together, let no man put asunder. Amen.',
    },

    {
      type: 'instruction' as const,
      text: 'The Priest blesses them:',
    },

    {
      type: 'prayer' as const,
      text: 'God the Father, God the Son, God the Holy Spirit bless, preserve and keep you; The Lord pour upon you the riches of His grace that you may faithfully live together and receive the blessings of eternal life. Amen.',
    },

    {
      type: 'instruction' as const,
      text: 'The Priest then invites and says to the parents:',
    },

    {
      type: 'question' as const,
      text: 'As Joseph and Praise enter a new life together will you their parents give them your blessing in the presence of this congregation?',
    },

    {
      type: 'instruction' as const,
      text: 'The Parents pray for the couple saying:',
    },

    {
      type: 'prayer' as const,
      text: 'May God bless you both. Amen.',
    },

    {
      type: 'instruction' as const,
      text: 'The congregation stands, the Priest may ask:',
    },

    {
      type: 'question' as const,
      text: 'You, as friends and families, have come to witness this exchange of vows. Will you do all in your power to support this marriage now and in the years ahead?',
    },

    {
      type: 'response' as const,
      label: 'The people reply:',
      text: 'We will.',
    },

    {
      type: 'instruction' as const,
      text: 'The Congregation remains standing. The husband and wife kneel, and the Priest blesses them:',
    },

    {
      type: 'prayer' as const,
      text: 'God the Father, God the Son, God the Holy Spirit, bless, preserve, and keep you; the Lord mercifully grant you the riches of His grace, that you may please Him both in body and soul, and living together in faith and love, may receive the blessings of eternal life. Amen.',
    },
  ],

  images: ['/pro1.png', '/pro5.png', '/pro9.png'],
};