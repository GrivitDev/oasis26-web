// src/app/program/page.tsx

import Image from 'next/image';
import Link from 'next/link';

const programs = [
  {
    number: '01',
    title: 'Traditional Wedding',
    description:
      'The traditional celebration of our union, bringing together family, culture, and cherished traditions.',
    href: '/programs/traditional-wedding',
  },
  {
    number: '02',
    title: 'Wedding Eve',
    description:
      'A special evening of preparation, gathering, prayer, and celebration before the wedding day.',
    href: '/programs/wedding-eve',
  },
  {
    number: '03',
    title: 'Church Wedding',
    description:
      'The order of service and details for the solemnization of our marriage in church.',
    href: '/programs/church-wedding',
  },  
  {
    number: '04',
    title: 'Order of Church Wedding Photographs',
    description:
      'The arranged order for family, bridal party, clergy, and couple photographs after the church wedding.',
    href: '/programs/church-photographs',
  },
  {
    number: '05',
    title: 'Reception Program',
    description:
      'The celebration that follows the church wedding, including the entrance, speeches, dining, and dancing.',
    href: '/programs/reception',
  },

];

export default function ProgramPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-cream px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald">
            OASIS&apos;26
          </p>

          <h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-5xl font-semibold leading-none text-wine sm:text-6xl">
            Wedding Programme
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-ink-soft sm:text-base">
            Explore the programmes and order of events prepared for our
            celebration.
          </p>
        </header>

        {/* Programme layout */}
        <section className="relative mx-auto mt-10 max-w-5xl sm:mt-14">
          {/* Transparent PNG */}
          <div className="pointer-events-none absolute -right-32 top-0 z-0 h-[760px] w-[500px] sm:-right-40 sm:h-[900px] sm:w-[620px] lg:-right-48 lg:h-[1050px] lg:w-[760px]">
            <Image
              src="/pro3.png"
              alt=""
              fill
              priority
              className="object-contain object-right"
            />
          </div>

          {/* Programme cards */}
          <div className="relative z-10 w-[calc(100%-2rem)] max-w-2xl space-y-3 sm:w-[calc(100%-8rem)] sm:space-y-4 lg:w-[62%]">
            {programs.map((program) => (
              <Link
                key={program.href}
                href={program.href}
                className="group block"
              >
                <article className="relative overflow-hidden rounded-[22px] border border-sand-dark/70 bg-white/95 p-4 shadow-sm backdrop-blur-[2px] transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-[24px] sm:p-5">
                  <div className="absolute inset-y-0 left-0 w-1 bg-emerald transition-all duration-300 group-hover:w-1.5" />

                  <div className="flex items-start gap-4 pl-2 sm:gap-5 sm:pl-3">
                    <span className="shrink-0 pt-1 font-[family-name:var(--font-cormorant)] text-xl font-semibold text-wine/60 sm:text-2xl">
                      {program.number}
                    </span>

                    <div className="min-w-0 flex-1">
                      <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold leading-tight text-wine sm:text-3xl">
                        {program.title}
                      </h2>

                      <p className="mt-1.5 max-w-xl text-xs leading-5 text-ink-soft sm:mt-2 sm:text-sm sm:leading-6">
                        {program.description}
                      </p>
                    </div>

                    <span className="mt-1 shrink-0 text-lg text-wine/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-wine">
                      →
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}