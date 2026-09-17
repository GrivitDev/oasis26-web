// src/components/traditional-wedding-program.tsx

import Image from 'next/image';

const traditionalWeddingItems = [
  {
    number: '01',
    title: 'Arrival of Guests',
    description:
      'Guests arrive and are welcomed into the traditional wedding venue.',
  },
  {
    number: '02',
    title: 'Arrival of the Groom’s Family',
    description:
      'The groom’s family arrives and is formally welcomed by the bride’s family.',
  },
  {
    number: '03',
    title: 'Introduction of Both Families',
    description:
      'Representatives from both families are introduced as the celebration begins.',
  },
  {
    number: '04',
    title: 'Opening Prayer',
    description:
      'The ceremony begins with prayers and thanksgiving for the families and the couple.',
  },
  {
    number: '05',
    title: 'Family Welcome',
    description:
      'The host family formally welcomes the groom’s family and guests to the celebration.',
  },
  {
    number: '06',
    title: 'Presentation of the Bride',
    description:
      'The bride is formally presented in accordance with the traditions of the families.',
  },
  {
    number: '07',
    title: 'Presentation of the Bride Price',
    description:
      'The required traditional items and bride price are formally presented on behalf of the groom’s family.',
  },
  {
    number: '08',
    title: 'Bride’s Family Response',
    description:
      'The bride’s family acknowledges the presentation and gives their formal response.',
  },
  {
    number: '09',
    title: 'Traditional Blessing',
    description:
      'The couple receives blessings and words of wisdom from their families and elders.',
  },
  {
    number: '10',
    title: 'Exchange of Gifts',
    description:
      'Both families exchange gifts as a symbolic expression of unity and goodwill.',
  },
  {
    number: '11',
    title: 'Introduction of the Couple',
    description:
      'The couple is formally introduced and presented before their families and guests.',
  },
  {
    number: '12',
    title: 'Traditional Rites',
    description:
      'The couple takes part in the traditional rites and customs prepared by both families.',
  },
  {
    number: '13',
    title: 'Family Prayers',
    description:
      'Family members offer prayers and blessings for the couple’s marriage and future home.',
  },
  {
    number: '14',
    title: 'Celebration and Dancing',
    description:
      'The formal proceedings give way to music, dancing, food, and celebration with family and friends.',
  },
  {
    number: '15',
    title: 'Closing and Appreciation',
    description:
      'The families express their appreciation to everyone who attended and supported the celebration.',
  },
];

const firstHalf = traditionalWeddingItems.slice(0, 8);
const secondHalf = traditionalWeddingItems.slice(8);

export default function TraditionalWeddingProgram() {
  return (
    <section className="relative overflow-hidden bg-cream px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald">
            OASIS&apos;26
          </p>

          <h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-5xl font-semibold leading-none text-wine sm:text-6xl">
            Traditional Wedding
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-ink-soft sm:text-base">
            The order of events for our traditional wedding celebration.
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
                src="/pro2.png"
                alt=""
                fill
                priority
                className="object-contain object-left"
              />
            </div>

            {/* Cards */}
            <div className="relative z-10 ml-auto w-[calc(100%-1rem)] max-w-2xl space-y-3 sm:w-[calc(100%-5rem)] sm:space-y-4 lg:w-[62%]">
              {firstHalf.map((item) => (
                <TraditionalWeddingCard
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
                src="/pro1.png"
                alt=""
                fill
                className="object-contain object-right"
              />
            </div>

            {/* Cards */}
            <div className="relative z-10 w-[calc(100%-1rem)] max-w-2xl space-y-3 sm:w-[calc(100%-5rem)] sm:space-y-4 lg:w-[62%]">
              {secondHalf.map((item) => (
                <TraditionalWeddingCard
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

type TraditionalWeddingCardProps = {
  number: string;
  title: string;
  description: string;
  accent: 'left' | 'right';
};

function TraditionalWeddingCard({
  number,
  title,
  description,
  accent,
}: TraditionalWeddingCardProps) {
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