// src/components/event-venues.tsx

'use client';

import Link from 'next/link';
import { Clock, MapPin, Navigation } from 'lucide-react';
import { useEffect, useState } from 'react';

const events = [
  {
    event: 'Traditional Wedding',
    date: 'October 8, 2026',
    dateShort: '08 OCT',
    time: '4:00 PM',
    target: '2026-10-08T16:00:00+01:00',
    message: 'Where heritage meets love, and two families begin to become one.',
    accent: 'wine',
  },
  {
    event: 'Wedding Eve',
    date: 'October 9, 2026',
    dateShort: '09 OCT',
    time: '4:00 PM',
    target: '2026-10-09T16:00:00+01:00',
    message:
      'The evening before forever — laughter, stories, anticipation, and love.',
    accent: 'mint',
  },
  {
    event: 'Church Wedding',
    date: 'October 10, 2026',
    dateShort: '10 OCT',
    time: '10:00 AM',
    target: '2026-10-10T10:00:00+01:00',
    message:
      'Before God and the people we love, two hearts become one.',
    accent: 'emerald',
  },
  {
    event: 'Reception',
    date: 'October 10, 2026',
    dateShort: '10 OCT',
    time: 'Immediately after',
    target: '2026-10-10T12:30:00+01:00',
    message:
      'Come celebrate the beginning of a beautiful new chapter with us.',
    accent: 'wine',
  },
];

const venue = 'Crowther Memorial Anglican Church, Lokoja, Kogi State';

const mapLink =
  'https://maps.app.goo.gl/ubbjAkbkuDiGBpsN9?g_st=ic';

type Countdown = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  complete: boolean;
};

function getCountdown(target: string): Countdown {
  const difference = new Date(target).getTime() - Date.now();

  if (difference <= 0) {
    return {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
      complete: true,
    };
  }

  const totalSeconds = Math.floor(difference / 1000);

  return {
    days: String(Math.floor(totalSeconds / 86400)).padStart(2, '0'),
    hours: String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, '0'),
    minutes: String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0'),
    seconds: String(totalSeconds % 60).padStart(2, '0'),
    complete: false,
  };
}

function EventCountdown({ target }: { target: string }) {
  const [countdown, setCountdown] = useState<Countdown>({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
    complete: false,
  });

  useEffect(() => {
    const update = () => {
      setCountdown(getCountdown(target));
    };

    update();

    const interval = window.setInterval(update, 1000);

    return () => window.clearInterval(interval);
  }, [target]);

  const values = [
    [countdown.days, 'Days'],
    [countdown.hours, 'Hours'],
    [countdown.minutes, 'Minutes'],
    [countdown.seconds, 'Seconds'],
  ];

  return (
    <div className="mt-4 rounded-[18px] border border-sand-dark/60 bg-ivory/80 px-3 py-2.5">
      <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-emerald">
        {countdown.complete ? 'Event time' : 'Countdown'}
      </p>

      <div className="mt-1.5 grid grid-cols-4 gap-1.5 text-center">
        {values.map(([value, label]) => (
          <div key={label}>
            <p className="font-[family-name:var(--font-cormorant)] text-xl font-bold leading-none text-wine">
              {value}
            </p>

            <p className="mt-0.5 text-[7px] uppercase tracking-[0.06em] text-ink-soft">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EventVenues() {
  return (
    <section
      id="venues"
      className="relative overflow-hidden bg-cream px-4 py-5 sm:px-5 sm:py-4 lg:px-8"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-24 top-8 h-56 w-56 rounded-full bg-wine/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-8 h-64 w-64 rounded-full bg-mint/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-[family-name:var(--font-great-vibes)] text-3xl text-wine sm:text-4xl">
            Come celebrate with us
          </p>

          <h2 className="mt-1.5 font-[family-name:var(--font-cormorant)] text-5xl font-semibold leading-[0.9] text-emerald sm:text-6xl">
            Venues &amp; Directions
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ink-soft">
            Four beautiful moments. One place to gather, celebrate, and make
            memories together.
          </p>
        </div>

        {/* Event cards */}
        <div className="mt-7 -mx-4 overflow-x-auto px-4 pb-4 sm:mt-9 sm:-mx-5 sm:px-5 lg:-mx-8 lg:px-8">
          <div className="flex snap-x snap-mandatory gap-3 sm:gap-4">
            {events.map((item, index) => {
              const accentClasses = {
                wine: {
                  line: 'bg-wine',
                  soft: 'bg-wine-soft',
                  text: 'text-wine',
                  ring: 'ring-wine/15',
                  button: 'bg-wine hover:bg-wine-dark',
                },
                mint: {
                  line: 'bg-mint-dark',
                  soft: 'bg-mint-light',
                  text: 'text-emerald',
                  ring: 'ring-mint-dark/20',
                  button: 'bg-emerald hover:bg-emerald-dark',
                },
                emerald: {
                  line: 'bg-emerald',
                  soft: 'bg-emerald-soft',
                  text: 'text-emerald',
                  ring: 'ring-emerald/15',
                  button: 'bg-wine hover:bg-wine-dark',
                },
              } as const;

              const accent =
                accentClasses[item.accent as keyof typeof accentClasses];

              return (
                <article
                  key={item.event}
                  className="relative min-w-[87%] snap-center overflow-hidden rounded-[24px] border border-sand-dark/60 bg-white/80 shadow-[0_14px_35px_rgba(84,26,42,0.08)] backdrop-blur-md sm:min-w-[62%] lg:min-w-[420px]"
                >
                  <div className={`h-1.5 ${accent.line}`} />

                  <div className="p-4 sm:p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-[family-name:var(--font-great-vibes)] text-2xl leading-none text-wine sm:text-3xl">
                          OASIS&apos;26
                        </p>

                        <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-ink-soft">
                          {item.event}
                        </p>
                      </div>

                      <div
                        className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl ${accent.soft} ring-1 ${accent.ring}`}
                      >
                        <span
                          className={`font-[family-name:var(--font-cormorant)] text-lg font-bold leading-none ${accent.text}`}
                        >
                          {item.dateShort.split(' ')[0]}
                        </span>

                        <span className="mt-0.5 text-[7px] font-bold uppercase tracking-[0.1em] text-ink-soft">
                          OCT
                        </span>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="mt-4 border-l-2 border-mint-dark/50 pl-3">
                      <p className="font-[family-name:var(--font-cormorant)] text-xl font-semibold leading-tight text-wine sm:text-2xl">
                        {item.message}
                      </p>
                    </div>

                    {/* Details */}
                    <div className="mt-5 space-y-2.5">
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 rounded-full bg-mint-light p-1.5">
                          <MapPin className="h-3.5 w-3.5 text-emerald" />
                        </div>

                        <div>
                          <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-ink-soft">
                            Venue
                          </p>

                          <p className="mt-0.5 text-xs leading-5 text-ink">
                            {venue}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="rounded-full bg-wine-soft p-1.5">
                          <Clock className="h-3.5 w-3.5 text-wine" />
                        </div>

                        <div>
                          <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-ink-soft">
                            Date &amp; Time
                          </p>

                          <p className="mt-0.5 text-xs font-semibold text-ink">
                            {item.date} · {item.time}
                          </p>
                        </div>
                      </div>
                    </div>

                    <EventCountdown target={item.target} />

                    {/* Directions */}
                    <Link
                      href={mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-sm transition-all ${accent.button}`}
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      Get Directions
                    </Link>
                  </div>

                  {/* Bottom ornament */}
                  <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
                    <span className="h-px w-6 bg-wine/20" />
                    <span className="h-1.5 w-1.5 rotate-45 bg-mint-dark" />
                    <span className="h-px w-6 bg-emerald/20" />
                  </div>

                  <span className="absolute bottom-3 right-4 font-[family-name:var(--font-cormorant)] text-xs font-semibold text-ink/20">
                    0{index + 1}
                  </span>
                </article>
              );
            })}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="mt-1 flex items-center justify-center gap-2">
          <span className="h-px w-5 bg-wine/20" />
          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-ink-soft">
            Swipe to explore
          </p>
          <span className="h-px w-5 bg-emerald/20" />
        </div>
      </div>
    </section>
  );
}