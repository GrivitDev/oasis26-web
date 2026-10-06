'use client';

import Link from 'next/link';
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Church,
} from 'lucide-react';

type ProgramPreviewProps = {
  variant?: 'first' | 'second';
};

export default function ProgramPreview({
  variant = 'first',
}: ProgramPreviewProps) {
  const isFirst = variant === 'first';

  return (
    <section className="relative overflow-hidden bg-cream px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute -left-24 top-10 h-52 w-52 rounded-full bg-emerald/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-wine/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[30px] border border-wine/10 bg-white shadow-[0_20px_70px_rgba(73,34,42,0.10)]">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            {/* Left / visual side */}
            <div className="relative flex min-h-[330px] items-center justify-center overflow-hidden bg-wine px-6 py-12 sm:px-10 lg:min-h-[390px]">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full border border-white/40" />
                <div className="absolute -bottom-20 -right-12 h-64 w-64 rounded-full border border-white/30" />
                <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
              </div>

              <div className="relative w-full max-w-sm">
                <div className="mb-5 flex items-center gap-2 text-white/70">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
                    Wedding Celebration
                  </span>
                </div>

                <div className="rounded-[24px] border border-white/20 bg-white/10 p-6 backdrop-blur-sm sm:p-8">
                  <p className="font-[family-name:var(--font-cormorant)] text-sm uppercase tracking-[0.2em] text-white/70">
                    Crowther Memorial Anglican Church
                  </p>

                  <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl font-semibold leading-none text-white sm:text-5xl">
                    Order of
                    <br />
                    Service
                  </h2>

                  <div className="my-6 h-px w-16 bg-white/40" />

                  <p className="text-sm leading-6 text-white/75">
                    The complete order of service for the solemnization of
                    Holy Matrimony.
                  </p>

                  <div className="mt-6 flex items-center gap-3 text-white/80">
                    <CalendarDays className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-[0.12em]">
                      10 October 2026 · 10:00 AM
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right / information side */}
            <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald/10 px-3 py-1.5 text-emerald">
                <Church className="h-3.5 w-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                  {isFirst ? 'The Ceremony' : 'Be Part of the Celebration'}
                </span>
              </div>

              <h3 className="mt-5 max-w-lg font-[family-name:var(--font-cormorant)] text-3xl font-semibold leading-tight text-wine sm:text-4xl">
                {isFirst
                  ? 'Follow the celebration with us.'
                  : 'Everything you need for the service.'}
              </h3>

              <p className="mt-4 max-w-xl text-sm leading-7 text-wine/65 sm:text-[15px]">
                {isFirst
                  ? 'Explore the order of service for the church wedding, from the processional and marriage ceremony through the Word, Holy Communion, thanksgiving and final withdrawal.'
                  : 'View the complete programme before the wedding so you can follow each part of the ceremony and know what to expect throughout the celebration.'}
              </p>

              {/* Programme highlights */}
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  'Processional & Introduction',
                  'The Marriage Ceremony',
                  'Ministry of the Word',
                  'Holy Communion',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-wine/10 bg-cream/50 px-4 py-3"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald/10 text-emerald">
                      <ChevronRight className="h-3.5 w-3.5" />
                    </span>

                    <span className="text-xs font-semibold text-wine/80">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  href="/programs"
                  className="group inline-flex items-center gap-3 rounded-full bg-wine px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[0_8px_24px_rgba(73,34,42,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-wine/90 hover:shadow-[0_12px_30px_rgba(73,34,42,0.24)]"
                >
                  View Full Program

                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}