// src/components/footer.tsx

import Image from 'next/image';
import Link from 'next/link';

const navigationLinks = [
  {
    label: 'Our Story',
    href: '/#our-story',
  },
  {
    label: 'The Wedding Party',
    href: '/#wedding-party',
  },
  {
    label: 'Venues & Directions',
    href: '/#venues',
  },
];

const celebrationLinks = [
  {
    label: 'Make a Donation',
    href: '/donation',
  },
  {
    label: 'Send a Blessing',
    href: '/blessing',
  },
  {
    label: 'Programme',
    href: '/program',
  },
  {
    label: 'Gallery',
    href: '/gallery',
  },
  {
    label: 'RSVP',
    href: '/#rsvp',
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-emerald text-white">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-24 top-0 h-56 w-56 rounded-full bg-mint/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-wine/20 blur-3xl" />

      {/* Top decorative line */}
      <div className="h-1 bg-gradient-to-r from-wine via-mint-dark to-wine" />

      <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-4 sm:py-6 lg:px-5">
        {/* Toast + Brand */}
        <div className="flex flex-col items-center gap-12 sm:flex-row sm:items-center sm:justify-center sm:gap-16">
          {/* Toast / Love message */}

<div className="relative flex h-45 w-45 shrink-0 items-center justify-center sm:h-52 sm:w-52">
  {/* Heart */}
  <div className="absolute left-1/2 top-[47%] h-44 w-44 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[18px] bg-wine shadow-[0_16px_35px_rgba(0,0,0,0.18)]" />

  <div className="absolute left-[24%] top-[13%] h-24 w-24 rounded-full bg-wine" />

  <div className="absolute right-[24%] top-[13%] h-24 w-24 rounded-full bg-wine" />

  {/* Inner heart */}
  <div className="absolute left-1/2 top-[48%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[16px] bg-wine/95 sm:h-30 sm:w-30" />

  {/* Content */}
  <div className="relative z-10 w-[115px] -translate-y-1 text-center sm:w-[125px]">
    <p className="text-[7px] font-bold uppercase tracking-[0.25em] text-mint">
      A toast to love
    </p>

    <h2 className="mt-2 font-[family-name:var(--font-cormorant)] text-[25px] font-semibold leading-[0.88] text-white sm:text-[28px]">
      To forever,
      <br />
      together.
    </h2>

    <div className="mx-auto mt-2.5 h-px w-8 bg-mint" />

    <p className="mt-2 text-[10px] leading-[1.4] text-mint-light">
      Here&apos;s to love, laughter, friendship and every beautiful moment
      still to come.
    </p>
  </div>
</div>

          {/* Brand */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center gap-2.5 sm:justify-start">
              <div className="flex h-35 w-35 items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="OASIS'26"
                  width={90}
                  height={90}
                  className="h-40 w-40 object-contain"
                />
              </div>

              <div className="leading-none">
                <p className="font-[family-name:var(--font-great-vibes)] text-3xl font-bold tracking-[0.04em]">
                  <span className="text-mint">OASiS</span>
                  <span className="text-white">&apos;26</span>
                </p>

                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-mint-light">
                  Joseph &amp; Praise
                </p>
              </div>
            </div>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-mint-light/75 sm:mx-0">
              A celebration of love, family, faith, friendship and the
              beginning of a beautiful new chapter.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mx-auto mt-4 max-w-4xl border-y border-white/10 py-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-center sm:gap-6">
            {/* Explore */}
            <div className="text-center sm:text-left">
              <p className="text-[8px] font-bold uppercase tracking-[0.28em] text-mint">
                Explore
              </p>

              <nav className="mt-1 flex flex-wrap items-center justify-center gap-x-0 gap-y-0 sm:justify-start">
                {navigationLinks.map((link, index) => (
                  <span key={link.label} className="flex items-center">
                    <Link
                      href={link.href}
                      className="rounded-full px-2.5 py-1 text-xs text-white/80 transition-colors hover:bg-white/5 hover:text-mint"
                    >
                      {link.label}
                    </Link>

                    {index < navigationLinks.length - 1 && (
                      <span className="text-[9px] text-mint/40">•</span>
                    )}
                  </span>
                ))}
              </nav>
            </div>

            {/* Celebrate */}
            <div className="text-center sm:text-left">
              <p className="text-[8px] font-bold uppercase tracking-[0.28em] text-mint">
                Celebrate
              </p>

              <nav className="mt-1 flex flex-wrap items-center justify-center gap-x-0 gap-y-0 sm:justify-start">
                {celebrationLinks.map((link, index) => (
                  <span key={link.label} className="flex items-center">
                    <Link
                      href={link.href}
                      className="rounded-full px-2.5 py-1 text-xs text-white/80 transition-colors hover:bg-white/5 hover:text-mint"
                    >
                      {link.label}
                    </Link>

                    {index < celebrationLinks.length - 1 && (
                      <span className="text-[9px] text-mint/40">•</span>
                    )}
                  </span>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Special callout */}
        <div className="mx-auto mt-4 max-w-2xl rounded-[20px] border border-mint/20 bg-white/5 px-3 py-2 text-center backdrop-blur-sm">
          <p className="font-[family-name:var(--font-cormorant)] text-xl font-semibold text-mint sm:text-2xl">
            Your presence is the greatest gift.
          </p>

          <p className="mt-1 text-[10px] leading-4 text-white/60 sm:text-xs">
            Thank you for being part of our story and for celebrating this
            beautiful day with us.
          </p>
        </div>

        {/* Bottom */}
        <div className="mt-3 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-3 text-center sm:flex-row sm:text-left">
          <p className="text-[9px] text-white/45">
            © 2026 OASIS&apos;26. All rights reserved.
          </p>

          <Link
            href="https://wa.me/2348164580712"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] font-semibold uppercase tracking-[0.12em] text-mint transition-colors hover:text-white"
          >
            Website designed by Grivit Tech Studios
          </Link>
        </div>
      </div>
    </footer>
  );
}