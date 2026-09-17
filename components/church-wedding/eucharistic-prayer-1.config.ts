// src/components/church-wedding/eucharistic-prayer-1.config.ts

export const eucharisticPrayer1 = {
  number: '17',

  title: 'The Eucharistic Prayer',

  description:
    'Eucharistic Prayer 1, including the proper preface, Sanctus, institution narrative, memorial acclamation, offering, and final doxology.',

  type: 'eucharistic-prayer' as const,

  content: [
    {
      type: 'instruction' as const,
      text: 'Congregation remains standing.',
    },

    {
      type: 'dialogue' as const,
      speaker: 'President',
      text: 'The Lord be with you.',
    },

    {
      type: 'dialogue' as const,
      speaker: 'All',
      text: 'And also with you.',
    },

    {
      type: 'dialogue' as const,
      speaker: 'President',
      text: 'Lift up your hearts.',
    },

    {
      type: 'dialogue' as const,
      speaker: 'All',
      text: 'We lift them to the Lord.',
    },

    {
      type: 'dialogue' as const,
      speaker: 'President',
      text: 'Let us give thanks to the Lord our God.',
    },

    {
      type: 'dialogue' as const,
      speaker: 'All',
      text: 'It is right to give Him thanks and praise.',
    },

    {
      type: 'prayer' as const,
      text: 'It is indeed right; it is our duty and joy at all times and in all places to give You thanks and praise Holy Father, Heavenly King, Almighty and Eternal God through Jesus Christ your only Son our Lord, for He is Your Living Word, through Him You have created all things from the beginning and formed us in Your own image. Through Him You have freed us from the slavery of sin, giving Him to be born as man and to die upon the cross; You raised Him from the dead and exalted Him to Your right hand on high, through Him You have sent upon us Your Holy and life-giving Spirit, and made us a people for Your own possession.',
    },

    {
      type: 'subheading' as const,
      text: 'Proper Preface',
    },

    {
      type: 'prayer' as const,
      text: 'It is right, and a good and a joyful thing, always and everywhere to give thanks to You, Father Almighty, Creator of heaven and earth, because You bind husband and wife in a solemn covenant of love, as a witness of the bond and covenant established in creation.',
    },

    {
      type: 'prayer' as const,
      text: 'Therefore, with angels and archangels and with all the company of heaven, we proclaim Your great and glorious name for ever praising You and saying:',
    },

    {
      type: 'dialogue' as const,
      speaker: 'All',
      text: 'Holy, Holy, Holy Lord, God of power and might, heaven and earth are full of Your glory, Hosanna in the highest.',
    },

    {
      type: 'dialogue' as const,
      speaker: 'President',
      text: 'Blessed is He who comes in the name of the Lord.',
    },

    {
      type: 'dialogue' as const,
      speaker: 'All',
      text: 'Hosanna in the highest.',
    },

    {
      type: 'instruction' as const,
      text: 'The congregation may kneel.',
    },

    {
      type: 'instruction' as const,
      text: 'The President continues.',
    },

    {
      type: 'prayer' as const,
      text: 'Accept our praises, heavenly Father, through Your Son our Saviour Jesus Christ; and as we follow His example and obey His command, grant that by the power of Your Holy Spirit these gifts of bread and wine may be to us, His Body and Blood; Who in the same night that He was betrayed, took bread and gave You thanks; He broke it and gave it to His disciples, saying: “Take, eat; this is My body which is given for You; do this in remembrance of me.” In the same way, after supper, He took the cup and gave You thanks. He gave it to them, saying: “Drink this, all of you; this is my Blood of the New Covenant, which is shed for you and for many for the forgiveness of sins. Do this as often as you drink it, in remembrance of Me”.',
    },

    {
      type: 'instruction' as const,
      text: 'Therefore, we proclaim the mystery of faith:',
    },

    {
      type: 'dialogue' as const,
      speaker: 'All',
      text: 'Christ has died,\nChrist is risen;\nChrist will come again.',
    },

    {
      type: 'prayer' as const,
      text: 'Therefore, heavenly Father, we remember His offering of Himself made once for all upon the cross; and proclaim His mighty resurrection and glorious ascension. As we look for His coming in glory, we celebrate with this Bread and this Cup His one perfect sacrifice. Accept through Him our Great High Priest this our sacrifice of thanks and praise, and as we eat and drink these holy gifts in the presence of Your divine Majesty, renew us by Your Spirit, inspire us with Your love, and unite us in the body of Your Son Jesus Christ our Lord. Through Him, and with Him, and in Him, by the power of the Holy Spirit, with all who stand before You on earth and in heaven. We worship You, Father Almighty in songs of everlasting praise:',
    },

    {
      type: 'dialogue' as const,
      speaker: 'All',
      text: 'Blessing and honour and glory and power be Yours forever and ever. Amen.',
    },

    {
      type: 'instruction' as const,
      text: 'Silence may be kept.',
    },

    {
      type: 'instruction' as const,
      text: 'The President breaks the consecrated bread, saying:',
    },

    {
      type: 'dialogue' as const,
      speaker: 'President',
      text: 'The Bread which we break, is it not the communion of the Body of Christ.',
    },

    {
      type: 'instruction' as const,
      text: 'He then lays his hand on the cup and says:',
    },

    {
      type: 'dialogue' as const,
      speaker: 'President',
      text: 'The cup which we bless, is it not the communion of the Blood of Christ?',
    },

    {
      type: 'dialogue' as const,
      speaker: 'All',
      text: 'Though we are many, we are one body, because we all share in one Bread.',
    },
  ],

  images: ['/pro1.png', '/pro5.png', '/pro8.png'],
};