'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Camera,
  ChevronDown,
  ImagePlus,
} from 'lucide-react';
import { useState } from 'react';

import RsvpModal from './rsvp-modal';

const navItems = [
  {
    label: 'Program',
    href: '/programs',
  },
  {
    label: 'Our Story',
    href: '/#our-story',
  },
  {
    label: 'Wedding Party',
    href: '/#wedding-party',
  },
  {
    label: 'Venues & Directions',
    href: '/#venues',
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [rsvpOpen, setRsvpOpen] = useState(false);

  const [galleryOpen, setGalleryOpen] =
    useState(false);

  const galleryActive =
    pathname === '/gallery' ||
    pathname.startsWith('/gallery/');

  const isLiveGallery =
    pathname === '/gallery' &&
    searchParams.get('section') !== 'pre-wedding';

  const isPreWedding =
    pathname === '/gallery' &&
    searchParams.get('section') === 'pre-wedding';

  return (
    <header className="fixed inset-x-0 top-0 z-[100]">
      <div className="mx-auto px-1.5 pt-1.5 sm:px-2.5 sm:pt-2.5">
        <div className="group relative mx-auto flex h-[52px] max-w-6xl items-center overflow-visible rounded-[18px] border border-white/65 bg-gradient-to-r from-emerald via-mint to-wine px-1.5 shadow-[0_10px_28px_rgba(84,26,42,0.18)] backdrop-blur-2xl transition-all duration-300 hover:shadow-[0_14px_34px_rgba(84,26,42,0.22)] sm:h-[58px] sm:rounded-[20px] sm:px-2.5">

          {/* SOFT INNER SHEEN */}

          <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/25 via-white/5 to-black/5" />

          {/* SUBTLE TOP GLOW */}

          <div className="pointer-events-none absolute inset-x-0 top-0 h-7 rounded-t-[inherit] bg-gradient-to-b from-white/20 to-transparent" />

          {/* BOTTOM HIGHLIGHT */}

          <div className="pointer-events-none absolute inset-x-7 bottom-0 h-px bg-white/60" />

          {/* BRAND */}

          <Link
            href="/"
            aria-label="OASIS'26 Home"
            className="relative z-10 flex shrink-0 items-center gap-1 sm:gap-1.5"
          >
            <div className="relative flex h-10 w-10 items-center justify-center sm:h-12 sm:w-12">
              <Image
                src="/logo.png"
                alt="OASIS'26"
                width={62}
                height={62}
                priority
                className="relative z-10 h-11 w-11 object-contain sm:h-13 sm:w-13"
              />
            </div>

<div className="flex flex-col justify-center leading-none">
  <span
    className="font-[family-name:var(--font-great-vibes)] text-[19px] font-black leading-[0.82] text-wine [text-shadow:1px_1px_0_var(--color-mint),-1px_1px_0_var(--color-mint),1px_-1px_0_var(--color-mint),-1px_-1px_0_var(--color-mint)] sm:text-[22px]"
  >
    <span className="font-black text-wine">
      Oasis
    </span>

    <span className="ml-0.5 font-black font-[family-name:var(--font-cormorant)] text-[14px] tracking-[0.02em] text-wine [text-shadow:1px_1px_0_var(--color-mint),-1px_1px_0_var(--color-mint),1px_-1px_0_var(--color-mint),-1px_-1px_0_var(--color-mint)] sm:text-[17px]">
      &apos;26
    </span>
  </span>

  <span className="mt-0.5 text-[4.5px] font-black uppercase tracking-[0.17em] text-wine [text-shadow:0.7px_0.7px_0_var(--color-mint),-0.7px_0.7px_0_var(--color-mint),0.7px_-0.7px_0_var(--color-mint),-0.7px_-0.7px_0_var(--color-mint)] sm:mt-1 sm:text-[5.5px]">
    Joseph &amp; Praise
  </span>
</div>
          </Link>

          {/* DESKTOP NAVIGATION */}

          <nav className="relative z-10 ml-auto hidden items-center gap-0 md:flex">

            {/* PROGRAM */}

            <Link
              href="/programs"
              className={`relative rounded-full px-2.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.09em] transition-all duration-300 lg:px-3 lg:text-[12.5px] ${
                pathname === '/programs'
                  ? 'bg-wine text-white shadow-[0_4px_12px_rgba(31,111,87,0.2)]'
                  : 'text-wine hover:bg-white/25 hover:text-wine'
              }`}
            >
              Program

              {pathname === '/programs' && (
                <span className="absolute bottom-0.5 left-1/2 h-[2px] w-3.5 -translate-x-1/2 rounded-full bg-white/80" />
              )}
            </Link>

            {/* GALLERY */}

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setGalleryOpen(
                    (current) => !current,
                  )
                }
                className={`relative flex items-center gap-0.5 rounded-full px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.09em] transition-all duration-300 lg:px-3 lg:text-[9.5px] ${
                  galleryActive
                    ? 'bg-white/55 text-wine shadow-[0_4px_12px_rgba(255,255,255,0.18)]'
                    : 'text-wine hover:bg-white/35 hover:text-wine'
                }`}
                aria-expanded={galleryOpen}
                aria-haspopup="menu"
              >
                Gallery

                <ChevronDown
                  className={`h-2.5 w-2.5 transition-transform duration-200 ${
                    galleryOpen
                      ? 'rotate-180'
                      : ''
                  }`}
                />

                {galleryActive && (
                  <span className="absolute bottom-0.5 left-1/2 h-[2px] w-3.5 -translate-x-1/2 rounded-full bg-wine/70" />
                )}
              </button>

              {galleryOpen && (
                <div
                  className="absolute right-0 top-full z-[9999] pt-1.5"
                  role="menu"
                >
                  <div className="w-40 overflow-hidden rounded-[15px] border border-white/60 bg-ivory/96 p-1.5 shadow-[0_14px_32px_rgba(84,26,42,0.2)] backdrop-blur-xl">

                    <Link
                      href="/gallery?section=live"
                      onClick={() =>
                        setGalleryOpen(false)
                      }
                      className={`flex items-center gap-2 rounded-[11px] px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-[0.08em] transition ${
                        isLiveGallery
                          ? 'bg-emerald-soft text-emerald'
                          : 'text-ink-soft hover:bg-emerald-soft hover:text-emerald'
                      }`}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald/10">
                        <Camera className="h-3 w-3" />
                      </span>

                      <span>
                        Live Gallery
                      </span>
                    </Link>

                    <Link
                      href="/gallery?section=pre-wedding"
                      onClick={() =>
                        setGalleryOpen(false)
                      }
                      className={`mt-0.5 flex items-center gap-2 rounded-[11px] px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-[0.08em] transition ${
                        isPreWedding
                          ? 'bg-wine/5 text-wine'
                          : 'text-ink-soft hover:bg-wine/5 hover:text-wine'
                      }`}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-wine/10">
                        <ImagePlus className="h-3 w-3" />
                      </span>

                      <span>
                        Pre-Wedding
                      </span>
                    </Link>

                  </div>
                </div>
              )}
            </div>

            {/* OUR STORY */}

            <Link
              href="/#our-story"
              className="rounded-full px-2.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.09em] text-wine transition-all duration-300 hover:bg-white/25 hover:text-wine lg:px-3 lg:text-[12.5px]"
            >
              Our Story
            </Link>

            {/* WEDDING PARTY */}

            <Link
              href="/#wedding-party"
              className="rounded-full px-2.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.09em] text-emerald transition-all duration-300 hover:bg-white/25 hover:text-wine lg:px-3 lg:text-[12.5px]"
            >
              Wedding Party
            </Link>

            {/* VENUES */}

            <Link
              href="/#venues"
              className="rounded-full px-2.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.09em] text-emerald transition-all duration-300 hover:bg-white/25 hover:text-wine lg:px-3 lg:text-[12.5px]"
            >
              Venues &amp; Directions
            </Link>

            {/* RSVP */}

              <button
                type="button"
                onClick={() => setRsvpOpen(true)}
                className="group/rsvp relative ml-0.5 overflow-hidden rounded-full bg-emerald px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_4px_12px_rgba(84,26,42,0.18)] transition-all duration-300 hover:bg-emerald-dark lg:px-3 lg:text-[9.5px]"
              >
                <span className="relative z-10">
                  RSVP
                </span>

                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/rsvp:translate-x-full" />
              </button>
          </nav>

          {/* MOBILE NAVIGATION
              Only Program, Gallery and RSVP */}

          <nav className="relative z-10 ml-auto flex items-center gap-0.5 sm:gap-0 md:hidden">

            {/* PROGRAM */}

            <Link
              href="/programs"
              className={`rounded-full px-1.5 py-1.25 text-[9.5px] font-bold uppercase tracking-[0.055em] transition-all duration-300 sm:px-2 sm:py-1.5 sm:text-[10.5px] ${
                pathname === '/programs'
                  ? 'text-white shadow-sm'
                  : 'text-wine hover:bg-white/45'
              }`}
            >
              Program
            </Link>

            {/* GALLERY */}

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setGalleryOpen(
                    (current) =>
                      !current,
                  )
                }
                className={`flex items-center gap-0.5 rounded-full px-1.5 py-1.25 text-[3.5px] font-bold uppercase tracking-[0.055em] transition-all duration-300 sm:px-2 sm:py-1.5 sm:text-[5.5px] ${
                  galleryActive
                    ? 'text-emerald shadow-sm'
                    : 'text-emerald hover:bg-white/45'
                }`}
                aria-expanded={galleryOpen}
                aria-haspopup="menu"
              >
                Gallery

                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-200 ${
                    galleryOpen
                      ? 'rotate-180'
                      : ''
                  }`}
                />
              </button>

              {galleryOpen && (
                <div className="absolute right-0 top-full z-50 pt-1.5">
                  <div className="w-32 overflow-hidden rounded-[14px] border border-white/60 bg-ivory/96 p-1.5 shadow-[0_12px_28px_rgba(84,26,42,0.18)] backdrop-blur-xl">

                    <Link
                      href="/gallery?section=live"
                      onClick={() =>
                        setGalleryOpen(false)
                      }
                      className="flex items-center gap-1.5 rounded-[10px] px-2 py-1.5 text-[6.5px] font-bold uppercase tracking-[0.06em] text-emerald transition hover:bg-emerald-soft"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald/10">
                        <Camera className="h-2.5 w-2.5" />
                      </span>

                      Live Gallery
                    </Link>

                    <Link
                      href="/gallery?section=pre-wedding"
                      onClick={() =>
                        setGalleryOpen(false)
                      }
                      className="mt-0.5 flex items-center gap-1.5 rounded-[10px] px-2 py-1.5 text-[6.5px] font-bold uppercase tracking-[0.06em] text-wine transition hover:bg-wine/5"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-wine/10">
                        <ImagePlus className="h-2.5 w-2.5" />
                      </span>

                      Pre-Wedding
                    </Link>

                  </div>
                </div>
              )}
            </div>

            {/* RSVP */}

          <button
            type="button"
            onClick={() => setRsvpOpen(true)}
            className="rounded-full bg-emerald px-1.5 py-1.25 text-[6.5px] font-bold uppercase tracking-[0.055em] text-white shadow-sm transition-all duration-300 hover:bg-emerald-dark sm:px-2 sm:py-1.5 sm:text-[7.5px]"
          >
            RSVP
          </button>
          </nav>

        </div>
      </div>

      <RsvpModal
  open={rsvpOpen}
  onClose={() => setRsvpOpen(false)}
/>

    </header>
  );
}