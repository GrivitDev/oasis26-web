// src/components/wedding-eve-program.tsx

import Image from 'next/image';

const weddingEveItems = [
  {
    number: '01',
    title: 'Arrival of Family and Guests',
    description:
      'Family members and invited guests arrive and settle in as we prepare for the evening celebration.',
  },
  {
    number: '02',
    title: 'Welcome and Introductions',
    description:
      'Guests are warmly welcomed and introduced as both families and friends come together.',
  },
  {
    number: '03',
    title: 'Opening Prayer',
    description:
      'The evening begins with prayers and thanksgiving for the couple, their families, and the wedding celebrations ahead.',
  },
  {
    number: '04',
    title: 'Words of Welcome',
    description:
      'A brief welcome address is given to officially open the evening and set the tone for the celebration.',
  },
  {
    number: '05',
    title: 'Family Introductions',
    description:
      'Members and representatives of the families are introduced and acknowledged.',
  },
  {
    number: '06',
    title: 'Couple’s Welcome',
    description:
      'The couple is welcomed and introduced to the gathering as they begin the final celebrations before their wedding day.',
  },
  {
    number: '07',
    title: 'Words of Advice',
    description:
      'Parents, elders, family members, and loved ones share words of wisdom and encouragement with the couple.',
  },
  {
    number: '08',
    title: 'Special Prayers for the Couple',
    description:
      'Family and friends join together in prayer for the couple, their marriage, and the journey ahead.',
  },
  {
    number: '09',
    title: 'Dinner and Refreshments',
    description:
      'Guests enjoy dinner, refreshments, and fellowship together.',
  },
  {
    number: '10',
    title: 'Music and Entertainment',
    description:
      'The evening continues with music and entertainment as family and friends relax and celebrate together.',
  },
  {
    number: '11',
    title: 'Games and Fun',
    description:
      'Guests participate in light-hearted games and activities prepared for the evening.',
  },
  {
    number: '12',
    title: 'Special Presentations',
    description:
      'Family and friends have an opportunity to present gifts, messages, or special surprises to the couple.',
  },
  {
    number: '13',
    title: 'Thanksgiving',
    description:
      'A moment of thanksgiving is shared for the journey that has brought everyone together and for the wedding celebrations to come.',
  },
  {
    number: '14',
    title: 'Final Preparations',
    description:
      'Important reminders and final arrangements for the wedding day are communicated to family members and guests.',
  },
  {
    number: '15',
    title: 'Closing Prayer and Departure',
    description:
      'The evening concludes with prayer and appreciation as guests prepare for the wedding day.',
  },
];

const firstHalf = weddingEveItems.slice(0, 8);
const secondHalf = weddingEveItems.slice(8);

export default function WeddingEveProgram() {
  return (
    <section className="relative overflow-hidden bg-cream px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald">
            OASIS&apos;26
          </p>

          <h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-5xl font-semibold leading-none text-wine sm:text-6xl">
            Wedding Eve
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-ink-soft sm:text-base">
            The order of events for the evening before our wedding celebration.
          </p>
        </header>

        <div className="mx-auto mt-10 max-w-5xl sm:mt-14">
          {/* ============================================================
              FIRST HALF
              Image Left — Cards Right
          ============================================================ */}
          <div className="relative">
            {/* Image */}
            <div className="pointer-events-none absolute -left-28 top-0 z-0 h-full min-h-[760px] w-[440px] sm:-left-24 sm:min-h-[820px] sm:w-[540px] lg:-left-16 lg:min-h-[900px] lg:w-[590px]">
              <Image
                src="/pro4.png"
                alt=""
                fill
                priority
                className="object-contain object-left"
              />
            </div>

            {/* Cards */}
            <div className="relative z-10 ml-auto w-[calc(100%-1rem)] max-w-2xl space-y-3 sm:w-[calc(100%-5rem)] sm:space-y-4 lg:w-[62%]">
              {firstHalf.map((item) => (
                <WeddingEveCard
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
            <div className="pointer-events-none absolute -right-28 top-0 z-0 h-full min-h-[650px] w-[440px] sm:-right-24 sm:min-h-[720px] sm:w-[540px] lg:-right-16 lg:min-h-[820px] lg:w-[590px]">
              <Image
                src="/pro3.png"
                alt=""
                fill
                className="object-contain object-right"
              />
            </div>

            {/* Cards */}
            <div className="relative z-10 w-[calc(100%-1rem)] max-w-2xl space-y-3 sm:w-[calc(100%-5rem)] sm:space-y-4 lg:w-[62%]">
              {secondHalf.map((item) => (
                <WeddingEveCard
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

type WeddingEveCardProps = {
  number: string;
  title: string;
  description: string;
  accent: 'left' | 'right';
};

function WeddingEveCard({
  number,
  title,
  description,
  accent,
}: WeddingEveCardProps) {
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