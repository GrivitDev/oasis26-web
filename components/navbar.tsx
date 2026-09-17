// src/components/navbar.tsx

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    label: 'Program',
    href: '/programs',
  },
  {
    label: 'Gallery',
    href: '/gallery',
  },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-[100]">
      <div className="mx-auto px-2.5 pt-2 sm:px-4 sm:pt-3">
        <div className="group relative mx-auto flex h-[62px] max-w-6xl items-center overflow-hidden rounded-[24px] border border-white/70 bg-ivory/88 px-2.5 shadow-[0_12px_35px_rgba(84,26,42,0.14)] backdrop-blur-2xl transition-all duration-300 hover:shadow-[0_16px_42px_rgba(84,26,42,0.18)] sm:h-[68px] sm:rounded-[26px] sm:px-4">
          {/* Soft glass glow */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-mint-light/50 via-white/20 to-emerald-soft/40" />

          {/* Top color ribbon */}
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-wine via-mint-dark via-50% to-emerald" />

          {/* Bottom glass highlight */}
          <div className="absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />

          {/* Ornamental corners */}
          <div className="pointer-events-none absolute left-3 top-3 h-3 w-3 rounded-tl-md border-l border-t border-wine/30" />
          <div className="pointer-events-none absolute right-3 top-3 h-3 w-3 rounded-tr-md border-r border-t border-emerald/30" />
          <div className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 rounded-bl-md border-b border-l border-emerald/30" />
          <div className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 rounded-br-md border-b border-r border-wine/30" />

          {/* Brand */}
          <Link
            href="/"
            aria-label="OASIS'26 Home"
            className="relative z-10 flex shrink-0 items-center gap-2"
          >
            {/* Logo jewel */}
            <div className="relative flex h-15 w-15 items-center justify-center sm:h-21 sm:w-21">
              <div className="absolute inset-0 rounded-[14px]" />

              <div className="absolute inset-[3px]" />

              <Image
                src="/logo.png"
                alt="OASIS'26"
                width={68}
                height={68}
                priority
                className="relative z-10 h-18 w-18 object-contain sm:h-17 sm:w-17"
              />
            </div>

            {/* Artistic wordmark */}
            <div className="flex flex-col justify-center leading-none">
              <span className="font-[family-name:var(--font-great-vibes)] text-[26px] leading-[0.8] sm:text-[29px]">
                <span className="text-wine">Oasis</span>
                <span className="ml-0.5 font-[family-name:var(--font-cormorant)] text-[20px] font-bold tracking-[0.03em] text-emerald sm:text-[22px]">
                  &apos;26
                </span>
              </span>

              <span className="mt-1 text-[6px] font-bold uppercase tracking-[0.23em] text-forest sm:text-[7px]">
                Joseph &amp; Praise
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="relative z-10 ml-auto hidden items-center gap-1.5 md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.13em] transition-all duration-300 ${
                    isActive
                      ? 'bg-wine text-white shadow-[0_5px_16px_rgba(114,38,58,0.18)]'
                      : 'text-ink-soft hover:bg-mint-light/80 hover:text-wine'
                  }`}
                >
                  {item.label}

                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-mint" />
                  )}
                </Link>
              );
            })}

            <Link
              href="/#wedding-party"
              className="rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.13em] text-forest transition-all duration-300 hover:bg-mint-light/80 hover:text-emerald"
            >
              Wedding Party
            </Link>

            <Link
              href="/#rsvp"
              className="group/rsvp relative ml-1 overflow-hidden rounded-full bg-wine px-5 py-2 text-[11px] font-bold uppercase tracking-[0.13em] text-white shadow-[0_6px_18px_rgba(114,38,58,0.2)] transition-all duration-300 hover:bg-wine-dark"
            >
              <span className="relative z-10">RSVP</span>

              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover/rsvp:translate-x-full" />
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <nav className="relative z-10 ml-auto flex items-center gap-1 sm:gap-1.5 md:hidden">
            <Link
              href="/programs"
              className={`rounded-full px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.08em] transition-all duration-300 sm:px-3 sm:text-[10px] ${
                pathname === '/programs'
                  ? 'bg-wine text-white shadow-sm'
                  : 'bg-mint-light/90 text-wine hover:bg-mint'
              }`}
            >
              Program
            </Link>

            <Link
              href="/gallery"
              className={`rounded-full px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.08em] transition-all duration-300 sm:px-3 sm:text-[10px] ${
                pathname === '/gallery'
                  ? 'bg-emerald text-white shadow-sm'
                  : 'bg-emerald-soft/90 text-emerald hover:bg-emerald-soft'
              }`}
            >
              Gallery
            </Link>

            <Link
              href="/#rsvp"
              className="rounded-full bg-wine px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.08em] text-white shadow-sm transition-all duration-300 hover:bg-wine-dark sm:px-3 sm:text-[10px]"
            >
              RSVP
            </Link>
          </nav>

          {/* Tiny central ornament */}
          <div className="pointer-events-none absolute left-1/2 top-[3px] hidden -translate-x-1/2 md:block">
            <div className="relative flex h-5 w-16 items-start justify-center">
              <span className="absolute top-0 h-1 w-7 rounded-b-full bg-mint-dark" />
              <span className="absolute top-0 h-1 w-2 rounded-b-full bg-wine" />
              <span className="absolute top-0 h-1 w-2 translate-x-5 rounded-b-full bg-emerald" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}