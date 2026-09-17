// src/components/home-hero.tsx

import Image from 'next/image';
import Link from 'next/link';

type HomeHeroProps = {
  backgroundImage?: string;
  mainImage?: string;
};

const weddingEvents = [
  {
    label: 'Traditional Wedding',
    date: 'October 8, 2026',
    time: '4:00 PM',
    accent: 'bg-wine',
  },
  {
    label: 'Wedding Eve',
    date: 'October 9, 2026',
    time: '4:00 PM',
    accent: 'bg-mint-dark',
  },
  {
    label: 'Church Wedding',
    date: 'October 10, 2026',
    time: '10:00 AM',
    accent: 'bg-emerald',
  },
  {
    label: 'Reception',
    date: 'October 10, 2026',
    time: 'Immediately after',
    accent: 'bg-wine-light',
  },
];

const actionLinks = [
  {
    label: 'Make a Donation',
    href: '/donation',
    className: 'bg-wine text-white hover:bg-wine-dark',
  },
  {
    label: 'Send a Blessing',
    href: '/blessing',
    className: 'bg-mint text-wine hover:bg-mint-light',
  },
  {
    label: 'Prayer for the Couples',
    href: '/prayer',
    className: 'bg-emerald text-white hover:bg-emerald-dark',
  },
  {
    label: 'RSVP',
    href: '/#rsvp',
    className:
      'border border-wine bg-white/80 text-wine hover:bg-wine hover:text-white',
  },
];

export function HomeHero({
  backgroundImage = '/hero-bg.jpg',
  mainImage = '/hero-main.jpg',
}: HomeHeroProps) {
  return (
    <section
      id="home"
      className="relative -mt-[76px] overflow-hidden bg-cream px-2 pb-2.5 pt-[82px] sm:-mt-[84px] sm:px-3 sm:pb-3 sm:pt-[92px]"
    >
      {/* Background image */}
      <div className="absolute inset-y-0 right-0 hidden w-[58%] lg:block">
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-cream/70 via-transparent to-transparent" />
      </div>

      {/* Mobile background */}
      <div className="absolute right-0 top-0 h-[34%] w-full overflow-hidden lg:hidden">
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cream/15 to-cream" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[28px] border border-wine/10 bg-ivory/78 shadow-[0_16px_50px_rgba(84,26,42,0.11)] backdrop-blur-sm sm:rounded-[34px]">
          {/* Decorative glow */}
          <div className="pointer-events-none absolute -left-20 top-16 h-64 w-64 rounded-full bg-mint/30 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-emerald/15 blur-3xl" />

          <div className="relative z-10 grid lg:grid-cols-[1.08fr_0.92fr]">
            {/* Main image */}
            <div className="relative flex items-center justify-center px-4 pb-3 pt-20 sm:px-6 sm:pb-5 sm:pt-24 lg:min-h-[calc(100vh-92px)] lg:px-8 lg:py-8">
              {/* OASIS label */}
              <div className="absolute left-4 top-4 z-20 rounded-full border border-wine/15 bg-white/60 px-3 py-1.5 shadow-sm backdrop-blur-md sm:left-6 sm:top-6 sm:px-4 sm:py-2">
                <span className="font-[family-name:var(--font-great-vibes)] text-xl text-wine sm:text-2xl">
                  OASIS&apos;26
                </span>
              </div>

              {/* Image frame */}
              <div className="relative w-full max-w-[560px]">
                <div className="absolute -inset-2 rotate-[-2deg] rounded-[34px] border border-mint-dark/35 sm:-inset-3 sm:rounded-[40px]" />

                <div className="absolute -inset-2 rotate-[2deg] rounded-[34px] border border-wine/15 sm:-inset-3 sm:rounded-[40px]" />

                <div className="relative overflow-hidden rounded-[30px] border-[5px] border-white bg-white shadow-[0_24px_65px_rgba(84,26,42,0.2)] sm:rounded-[36px] sm:border-[6px]">
                  <div className="aspect-[4/5]">
                    <Image
                      src={mainImage}
                      alt="Praise and Joseph"
                      fill
                      priority
                      className="object-cover object-center"
                    />
                  </div>

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-wine/65 via-wine/15 to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6">
                    <p className="font-[family-name:var(--font-great-vibes)] text-3xl leading-none text-white sm:text-4xl lg:text-5xl">
                      Joseph &amp; Praise
                    </p>

                    <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.24em] text-mint sm:text-[9px]">
                      OASIS&apos;26
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="relative flex items-center px-4 pb-7 pt-4 sm:px-7 sm:pb-9 lg:px-9 lg:py-10 xl:px-12">
              <div className="w-full max-w-2xl">
                <p className="hidden font-[family-name:var(--font-great-vibes)] text-4xl leading-none text-wine lg:block xl:text-5xl">
                  OASIS&apos;26
                </p>

                <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.3em] text-emerald sm:text-[9px]">
                  Together with their families
                </p>

                <h1 className="mt-4 font-[family-name:var(--font-cormorant)] text-[2.9rem] font-semibold leading-[0.8] tracking-[-0.03em] text-wine sm:text-5xl lg:text-6xl xl:text-[4.6rem]">
                  Miss Praise
                  <br />
                  Cinwon Ajawo
                </h1>

                <div className="my-2 flex items-center gap-2.5 sm:my-3">
                  <span className="h-px w-8 bg-wine/25" />

                  <span className="font-[family-name:var(--font-great-vibes)] text-3xl leading-none text-emerald sm:text-4xl">
                    &amp;
                  </span>

                  <span className="h-px w-8 bg-wine/25" />
                </div>

                <h2 className="font-[family-name:var(--font-cormorant)] text-[2.6rem] font-semibold leading-[0.8] tracking-[-0.03em] text-emerald sm:text-[4rem] lg:text-5xl xl:text-[4rem]">
                  Rev&apos;d Joseph
                  <br />
                  Nasara Musa
                </h2>

                <p className="mt-4 max-w-lg text-xs leading-5 text-ink-soft sm:text-sm sm:leading-6">
                  Two hearts, one beautiful journey, and a day surrounded by
                  family, friends, faith, and love.
                </p>

                {/* Event cards */}
                <div className="mt-5 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-2.5">
                  {weddingEvents.map((event) => (
                    <div
                      key={event.label}
                      className="relative overflow-hidden rounded-[16px] border border-sand-dark/65 bg-white/70 p-2.5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:rounded-[18px] sm:p-3"
                    >
                      <div
                        className={`absolute left-0 top-0 h-full w-1 ${event.accent}`}
                      />

                      <div className="pl-1.5">
                        <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-ink-soft sm:text-[8px]">
                          {event.label}
                        </p>

                        <p className="mt-1 font-[family-name:var(--font-cormorant)] text-base font-semibold leading-none text-wine sm:text-lg">
                          {event.date}
                        </p>

                        <p className="mt-1 text-[8px] text-ink-soft sm:text-[9px]">
                          {event.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-5 flex flex-wrap gap-1.5 sm:mt-6 sm:gap-2">
                  {actionLinks.map((action) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      className={`rounded-full px-3.5 py-2 text-[8px] font-bold uppercase tracking-[0.1em] shadow-sm transition-all duration-200 sm:px-4 sm:py-2.5 sm:text-[9px] ${action.className}`}
                    >
                      {action.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom ornament */}
          <div className="pointer-events-none absolute bottom-2 left-1/2 hidden -translate-x-1/2 items-center gap-2 sm:flex">
            <span className="h-px w-7 bg-wine/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-mint-dark" />
            <span className="h-2 w-2 rotate-45 border border-wine/25" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-light" />
            <span className="h-px w-7 bg-emerald/20" />
          </div>
        </div>
      </div>
    </section>
  );
}