// src/components/reception-program.tsx

import Image from 'next/image';

const receptionItems = [
  {
    number: '01',
    title: 'Arrival of Guests & Seating',
    description:
      'Guests arrive at the reception venue, are warmly welcomed, and take their seats for the celebration.',
  },
  {
    number: '02',
    title: 'Opening Prayer',
    description:
      'The reception begins with prayer and thanksgiving for the couple, their families, and the celebration.',
  },
  {
    number: '03',
    title: 'Introduction / Welcome by the MC',
    description:
      'The Master of Ceremonies welcomes the couple and guests and introduces the programme for the reception.',
  },
  {
    number: '04',
    title: 'Grand Entrance of the Groom & Bride’s Parents',
    description:
      'The groom and the bride’s parents make their grand entrance as they are formally welcomed into the reception.',
  },
  {
    number: '05',
    title: 'Grand Entrance of the Bride & Groom',
    description:
      'The newly married couple makes their grand entrance into the reception to the celebration of family and friends.',
  },
  {
    number: '06',
    title: 'Opening Remarks by the Chairman & Father of the Day',
    description:
      'The Chairman and Father of the Day give their opening remarks and formally set the tone for the celebration.',
  },
  {
    number: '07',
    title: 'Cutting of the Wedding Cake',
    description:
      'The couple cuts their wedding cake as part of the celebration of their new life together.',
  },
  {
    number: '08',
    title: 'Couple’s First Dance',
    description:
      'The newly married couple shares their first dance together as husband and wife.',
  },
  {
    number: '09',
    title: 'Couple’s Dance with the High Table & Parents',
    description:
      'The couple shares special dances with members of the high table, parents, family, and other special guests.',
  },
  {
    number: '10',
    title: 'Games for the Couple & Guests',
    description:
      'Fun and interactive games are enjoyed by the couple and guests as the celebration continues.',
  },
  {
    number: '11',
    title: 'Toast to the Bride & Groom',
    description:
      'Family and friends raise a toast to the bride and groom, offering words of love, joy, and good wishes.',
  },
  {
    number: '12',
    title: 'Presentation of Gifts',
    description:
      'Family, friends, and invited guests present gifts and special tokens to the newly married couple.',
  },
  {
    number: '13',
    title: 'Bouquet Toss',
    description:
      'The bride takes part in the traditional bouquet toss as the celebration continues.',
  },
  {
    number: '14',
    title: 'Dance Floor Officially Opened',
    description:
      'The dance floor is officially opened as family and friends join the couple in celebration.',
  },
  {
    number: '15',
    title: 'Food, Service & Celebration',
    description:
      'Guests enjoy the wedding reception meal, refreshments, music, dancing, and continued celebration.',
  },
  {
    number: '16',
    title: 'Vote of Thanks',
    description:
      'A vote of thanks is given in appreciation of everyone who contributed to and attended the wedding celebration.',
  },
  {
    number: '17',
    title: 'Closing Prayer',
    description:
      'The reception concludes with prayer and thanksgiving for the couple, their families, and everyone present.',
  },
  {
    number: '18',
    title: 'Final Dance & Departure of the Couple',
    description:
      'The couple shares their final dance before making their departure from the reception venue.',
  },
];

const firstHalf = receptionItems.slice(0, 9);
const secondHalf = receptionItems.slice(9);

export default function ReceptionProgram() {
  return (
    <section className="relative overflow-hidden bg-cream px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald">
            OASIS&apos;26
          </p>

          <h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-5xl font-semibold leading-none text-wine sm:text-6xl">
            Reception Program
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-ink-soft sm:text-base">
            The order of events for our wedding reception and celebration.
          </p>
        </header>

        <div className="mx-auto mt-10 max-w-5xl sm:mt-14">
          {/* ============================================================
              FIRST HALF
              Image Left — Cards Right
          ============================================================ */}
          <div className="relative">
            {/* Image */}
            <div className="pointer-events-none absolute -left-28 top-0 z-0 h-full min-h-[920px] w-[440px] sm:-left-24 sm:min-h-[980px] sm:w-[540px] lg:-left-16 lg:min-h-[1100px] lg:w-[590px]">
              <Image
                src="/pro6.png"
                alt=""
                fill
                priority
                className="object-contain object-left"
              />
            </div>

            {/* Cards */}
            <div className="relative z-10 ml-auto w-[calc(100%-1rem)] max-w-2xl space-y-3 sm:w-[calc(100%-5rem)] sm:space-y-4 lg:w-[62%]">
              {firstHalf.map((item) => (
                <ReceptionCard
                  key={item.number}
                  number={item.number}
                  title={item.title}
                  description={item.description}
                  accent="right"
                />
              ))}
            </div>
          </div>

          {/* ============================================================
              SECOND HALF
              Cards Left — Image Right
          ============================================================ */}
          <div className="relative mt-4 sm:mt-4">
            {/* Image */}
            <div className="pointer-events-none absolute -right-28 top-0 z-0 h-full min-h-[920px] w-[440px] sm:-right-24 sm:min-h-[980px] sm:w-[540px] lg:-right-16 lg:min-h-[1100px] lg:w-[590px]">
              <Image
                src="/pro5.png"
                alt=""
                fill
                className="object-contain object-right"
              />
            </div>

            {/* Cards */}
            <div className="relative z-10 w-[calc(100%-1rem)] max-w-2xl space-y-3 sm:w-[calc(100%-5rem)] sm:space-y-4 lg:w-[62%]">
              {secondHalf.map((item) => (
                <ReceptionCard
                  key={item.number}
                  number={item.number}
                  title={item.title}
                  description={item.description}
                  accent="left"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type ReceptionCardProps = {
  number: string;
  title: string;
  description: string;
  accent: 'left' | 'right';
};

function ReceptionCard({
  number,
  title,
  description,
  accent,
}: ReceptionCardProps) {
  return (
    <article className="relative overflow-hidden rounded-[22px] border border-sand-dark/70 bg-white/95 p-4 shadow-sm backdrop-blur-[2px] sm:rounded-[24px] sm:p-5">
      <div
        className={`absolute inset-y-0 w-1 bg-wine ${
          accent === 'right' ? 'right-0' : 'left-0'
        }`}
      />

      <div
        className={`flex items-start gap-4 sm:gap-5 ${
          accent === 'right' ? 'pr-2 sm:pr-3' : 'pl-2 sm:pl-3'
        }`}
      >
        <span className="shrink-0 pt-0.5 font-[family-name:var(--font-cormorant)] text-xl font-semibold text-wine/60 sm:text-2xl">
          {number}
        </span>

        <div className="min-w-0">
          <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold leading-tight text-wine sm:text-3xl">
            {title}
          </h2>

          <p className="mt-1.5 text-xs leading-5 text-ink-soft sm:mt-2 sm:text-sm sm:leading-6">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}