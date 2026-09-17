// src/components/church-photographs-program.tsx

import Image from 'next/image';

const photographItems = [
  {
    number: '01',
    title: 'Couple With Officiating Ministers',
    description:
      'A formal portrait of the couple with the ministers who officiated the church wedding.',
  },
  {
    number: '02',
    title: 'Couple With Officiating Ministers and Couples’ Parents',
    description:
      'The couple with the officiating ministers and both sets of parents.',
  },
  {
    number: '03',
    title: 'Couple Alone',
    description:
      'A dedicated portrait of the couple together.',
  },
  {
    number: '04',
    title: 'Bride Alone',
    description:
      'A dedicated portrait of the bride.',
  },
  {
    number: '05',
    title: 'Groom Alone',
    description:
      'A dedicated portrait of the groom.',
  },
  {
    number: '06',
    title: 'Couple With Both Parents',
    description:
      'The couple with both the bride’s and groom’s parents.',
  },
  {
    number: '07',
    title: 'Couple With Best Men & Chief Bridesmaid',
    description:
      'The couple with the best men and chief bridesmaid.',
  },
  {
    number: '08',
    title: 'Couple With Groomsmen and Bridal Train',
    description:
      'The couple with the groomsmen and members of the bridal train.',
  },
  {
    number: '09',
    title: 'Couple With Little Grooms and Little Brides',
    description:
      'The couple with the little grooms and little brides.',
  },
  {
    number: '10',
    title: 'Couple With Priests From Kubwa Diocese',
    description:
      'The couple with priests from the Diocese of Kubwa.',
  },
  {
    number: '11',
    title: 'Couple With St. Bartholomew Members',
    description:
      'The couple with members of St. Bartholomew.',
  },
  {
    number: '12',
    title: 'Couple With St. Lukes Kuja',
    description:
      'The couple with members and friends from St. Lukes Kuja.',
  },
  {
    number: '13',
    title: 'Couple With Colleagues',
    description:
      'The couple with their colleagues and professional friends.',
  },
  {
    number: '14',
    title: 'Couple With AYF Cathedral',
    description:
      'The couple with members of the AYF Cathedral community.',
  },
  {
    number: '15',
    title: 'Couple With BGICC Members',
    description:
      'The couple with members of BGICC.',
  },
  {
    number: '16',
    title: 'Couple With Classmates From Global College',
    description:
      'The couple with classmates and friends from Global College.',
  },
  {
    number: '17',
    title: 'Couple With Course Mates From KSU',
    description:
      'The couple with course mates and friends from KSU.',
  },
  {
    number: '18',
    title: 'Couple With Bride’s Family (Extended)',
    description:
      'The couple with members of the bride’s extended family.',
  },
  {
    number: '19',
    title: 'Couple With Groom’s Family (Extended)',
    description:
      'The couple with members of the groom’s extended family.',
  },
  {
    number: '20',
    title: 'Couple With Groom & Bride Extended Family',
    description:
      'The couple with members of both extended families together.',
  },
];

const firstSection = photographItems.slice(0, 7);
const secondSection = photographItems.slice(7, 14);
const thirdSection = photographItems.slice(14);

export default function ChurchPhotographsProgram() {
  return (
    <section className="relative overflow-hidden bg-cream px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald">
            OASIS&apos;26
          </p>

          <h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-5xl font-semibold leading-none text-wine sm:text-6xl">
            Photograph Gallery
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-ink-soft sm:text-base">
            The order of photographs for our church wedding celebration.
          </p>
        </header>

        <div className="mx-auto mt-10 max-w-5xl sm:mt-14">
          {/* FIRST SECTION — Image Left / Cards Right */}
          <div className="relative">
            <div className="pointer-events-none absolute -left-28 top-0 z-0 h-full min-h-[760px] w-[440px] sm:-left-24 sm:min-h-[820px] sm:w-[540px] lg:-left-16 lg:min-h-[900px] lg:w-[590px]">
              <Image
                src="/pro6.png"
                alt=""
                fill
                priority
                className="object-contain object-left"
              />
            </div>

            <div className="relative z-10 ml-auto w-[calc(100%-1rem)] max-w-2xl space-y-3 sm:w-[calc(100%-5rem)] sm:space-y-4 lg:w-[62%]">
              {firstSection.map((item) => (
                <ChurchPhotographCard
                  key={item.number}
                  number={item.number}
                  title={item.title}
                  description={item.description}
                  accent="right"
                />
              ))}
            </div>
          </div>

          {/* SECOND SECTION — Cards Left / Image Right */}
          <div className="relative mt-4 sm:mt-4">
            <div className="pointer-events-none absolute -right-28 top-0 z-0 h-full min-h-[760px] w-[440px] sm:-right-24 sm:min-h-[820px] sm:w-[540px] lg:-right-16 lg:min-h-[900px] lg:w-[590px]">
              <Image
                src="/pro3.png"
                alt=""
                fill
                className="object-contain object-right"
              />
            </div>

            <div className="relative z-10 w-[calc(100%-1rem)] max-w-2xl space-y-3 sm:w-[calc(100%-5rem)] sm:space-y-4 lg:w-[62%]">
              {secondSection.map((item) => (
                <ChurchPhotographCard
                  key={item.number}
                  number={item.number}
                  title={item.title}
                  description={item.description}
                  accent="left"
                />
              ))}
            </div>
          </div>

          {/* THIRD SECTION — Image Left / Cards Right */}
          <div className="relative mt-4 sm:mt-4">
            <div className="pointer-events-none absolute -left-28 top-0 z-0 h-full min-h-[650px] w-[440px] sm:-left-24 sm:min-h-[720px] sm:w-[540px] lg:-left-16 lg:min-h-[820px] lg:w-[590px]">
              <Image
                src="/pro7.png"
                alt=""
                fill
                className="object-contain object-left"
              />
            </div>

            <div className="relative z-10 ml-auto w-[calc(100%-1rem)] max-w-2xl space-y-3 sm:w-[calc(100%-5rem)] sm:space-y-4 lg:w-[62%]">
              {thirdSection.map((item) => (
                <ChurchPhotographCard
                  key={item.number}
                  number={item.number}
                  title={item.title}
                  description={item.description}
                  accent="right"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type ChurchPhotographCardProps = {
  number: string;
  title: string;
  description: string;
  accent: 'left' | 'right';
};

function ChurchPhotographCard({
  number,
  title,
  description,
  accent,
}: ChurchPhotographCardProps) {
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