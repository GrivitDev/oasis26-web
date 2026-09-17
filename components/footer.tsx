'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useState } from 'react';

import RsvpModal from './rsvp-modal';

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
    href: '/programs',
  },
  {
    label: 'Gallery',
    href: '/gallery',
  },
];

const accountDetails = {
  bankName: 'Bank Name',
  accountName: 'Joseph & Praise',
  accountNumber: '0000000000',
};

export default function Footer() {
  const [rsvpOpen, setRsvpOpen] = useState(false);

  return (
    <>
      <footer className="relative overflow-hidden bg-wine text-mint">
        {/* ============================================================ */}
        {/* ROMANTIC BACKGROUND */}
        {/* ============================================================ */}

        <div className="pointer-events-none absolute inset-0">
          {/* Deep emerald centre glow */}

          <div className="absolute left-1/2 top-[16%] h-[460px] w-[760px] -translate-x-1/2 rounded-full bg-emerald/55 blur-[120px]" />

          {/* Emerald lower glow */}

          <div className="absolute -left-[12%] bottom-[2%] h-[420px] w-[420px] rounded-full bg-emerald/45 blur-[110px]" />

          {/* Mint upper-left glow */}

          <div className="absolute -left-[10%] top-[8%] h-[300px] w-[300px] rounded-full bg-mint/25 blur-[90px]" />

          {/* Mint upper-right glow */}

          <div className="absolute -right-[8%] top-[22%] h-[360px] w-[360px] rounded-full bg-mint/20 blur-[105px]" />

          {/* Emerald lower-right glow */}

          <div className="absolute -right-[12%] bottom-[8%] h-[430px] w-[430px] rounded-full bg-emerald/40 blur-[115px]" />

          {/* Soft romantic diagonal sheen */}

          <div className="absolute inset-0 bg-gradient-to-br from-mint/10 via-transparent to-emerald/20" />

          {/* Fine romantic texture */}

          <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0.7px,transparent_0.9px)] [background-size:22px_22px]" />
        </div>

        {/* ============================================================ */}
        {/* TOP DECORATIVE LINE */}
        {/* ============================================================ */}

        <div className="relative z-10 h-1 bg-gradient-to-r from-emerald via-mint to-emerald" />

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-4 sm:py-6 lg:px-5">
          {/* ========================================================== */}
          {/* TOAST + BRAND */}
          {/* ========================================================== */}

          <div className="flex flex-col items-center gap-12 sm:flex-row sm:items-center sm:justify-center sm:gap-16">
            {/* ======================================================== */}
            {/* TOAST / LOVE MESSAGE */}
            {/* ======================================================== */}

            <div className="relative flex h-45 w-45 shrink-0 items-center justify-center sm:h-52 sm:w-52">
              {/* Outer glow */}

              <div className="absolute inset-2 rounded-full bg-emerald/20 blur-2xl" />

              {/* Heart */}

              <div className="absolute left-1/2 top-[47%] h-44 w-44 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[18px] bg-emerald shadow-[0_18px_42px_rgba(0,0,0,0.2)]" />

              <div className="absolute left-[24%] top-[13%] h-24 w-24 rounded-full bg-emerald" />

              <div className="absolute right-[24%] top-[13%] h-24 w-24 rounded-full bg-emerald" />

              {/* Inner heart */}

              <div className="absolute left-1/2 top-[48%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[16px] bg-emerald/95 sm:h-30 sm:w-30" />

              {/* Content */}

              <div className="relative z-10 w-[115px] -translate-y-1 text-center sm:w-[125px]">
                <p className="text-[7px] font-bold uppercase tracking-[0.25em] text-mint">
                  A toast to love
                </p>

                <h2 className="mt-2 font-[family-name:var(--font-cormorant)] text-[25px] font-semibold leading-[0.88] text-mint sm:text-[28px]">
                  To forever,
                  <br />
                  together.
                </h2>

                <div className="mx-auto mt-2.5 h-px w-8 bg-mint" />

                <p className="mt-2 text-[10px] leading-[1.4] text-mint-light">
                  Here&apos;s to love, laughter, friendship and every beautiful
                  moment still to come.
                </p>
              </div>
            </div>

            {/* ======================================================== */}
            {/* BRAND */}
            {/* ======================================================== */}

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
                    <span className="text-mint">&apos;26</span>
                  </p>

                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-mint">
                    Joseph &amp; Praise
                  </p>
                </div>
              </div>

              <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-mint-light/80 sm:mx-0">
                A celebration of love, family, faith, friendship and the
                beginning of a beautiful new chapter.
              </p>

              {/* Footer RSVP */}

              <button
                type="button"
                onClick={() => setRsvpOpen(true)}
                className="group mt-4 inline-flex items-center gap-2 rounded-full bg-emerald px-4 py-2 text-[9px] font-bold uppercase tracking-[0.12em] text-mint shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-dark hover:shadow-[0_10px_26px_rgba(0,0,0,0.25)]"
              >
                <Heart className="h-3.5 w-3.5 fill-current transition-transform duration-300 group-hover:scale-110" />

                <span>
                  RSVP
                </span>
              </button>
            </div>
          </div>

          {/* ========================================================== */}
          {/* NAVIGATION */}
          {/* ========================================================== */}

          <div className="mx-auto mt-4 max-w-4xl border-y border-mint/20 py-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-center sm:gap-6">
              {/* Explore */}

              <div className="text-center sm:text-left">
                <p className="text-[8px] font-bold uppercase tracking-[0.28em] text-mint">
                  Explore
                </p>

                <nav className="mt-1 flex flex-wrap items-center justify-center gap-x-0 gap-y-0 sm:justify-start">
                  {navigationLinks.map((link, index) => (
                    <span
                      key={link.label}
                      className="flex items-center"
                    >
                      <Link
                        href={link.href}
                        className="rounded-full px-2.5 py-1 text-xs text-mint-light transition-colors hover:bg-emerald/15 hover:text-mint"
                      >
                        {link.label}
                      </Link>

                      {index <
                        navigationLinks.length - 1 && (
                        <span className="text-[9px] text-mint/45">
                          •
                        </span>
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
                    <span
                      key={link.label}
                      className="flex items-center"
                    >
                      <Link
                        href={link.href}
                        className="rounded-full px-2.5 py-1 text-xs text-mint-light transition-colors hover:bg-emerald/15 hover:text-mint"
                      >
                        {link.label}
                      </Link>

                      {index <
                        celebrationLinks.length - 1 && (
                        <span className="text-[9px] text-mint/45">
                          •
                        </span>
                      )}
                    </span>
                  ))}

                  {/* RSVP */}

                  <span className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setRsvpOpen(true)}
                      className="rounded-full px-2.5 py-1 text-xs font-semibold text-mint transition-colors hover:bg-emerald/15 hover:text-mint-light"
                    >
                      RSVP
                    </button>
                  </span>
                </nav>
              </div>
            </div>
          </div>

          {/* ========================================================== */}
          {/* DONATION / SUPPORT */}
          {/* ========================================================== */}

          <div className="mx-auto mt-4 max-w-2xl overflow-hidden rounded-[20px] border border-mint/25 bg-emerald/15 shadow-[0_12px_35px_rgba(0,0,0,0.12)] backdrop-blur-md">
            <div className="border-b border-mint/20 px-4 py-3 text-center">
              <p className="text-[8px] font-bold uppercase tracking-[0.28em] text-mint">
                Support &amp; Donations
              </p>

              <h3 className="mt-1 font-[family-name:var(--font-cormorant)] text-xl font-semibold text-mint sm:text-2xl">
                Like to support our wedding?
              </h3>

              <p className="mx-auto mt-1 max-w-lg text-[10px] leading-4 text-mint-light/80 sm:text-xs">
                Your support, prayers and generosity mean so much to us.
                You can support our wedding using the account details below.
              </p>
            </div>

            <div className="grid grid-cols-1 divide-y divide-mint/20 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <div className="px-4 py-3 text-center">
                <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-mint">
                  Bank Name
                </p>

                <p className="mt-1 text-xs font-semibold text-mint-light">
                  {accountDetails.bankName}
                </p>
              </div>

              <div className="px-4 py-3 text-center">
                <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-mint">
                  Account Name
                </p>

                <p className="mt-1 text-xs font-semibold text-mint-light">
                  {accountDetails.accountName}
                </p>
              </div>

              <div className="px-4 py-3 text-center">
                <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-mint">
                  Account Number
                </p>

                <p className="mt-1 text-xs font-semibold tracking-[0.08em] text-mint-light">
                  {accountDetails.accountNumber}
                </p>
              </div>
            </div>

            <div className="border-t border-mint/20 px-4 py-3 text-center">
              <p className="font-[family-name:var(--font-cormorant)] text-lg font-semibold text-mint">
                Thank you for your support.
              </p>

              <p className="mt-0.5 text-[9px] text-mint-light/70">
                May God bless you for being part of our celebration.
              </p>
            </div>
          </div>

          {/* ========================================================== */}
          {/* SPECIAL CALLOUT */}
          {/* ========================================================== */}

          <div className="mx-auto mt-4 max-w-2xl rounded-[20px] border border-mint/25 bg-emerald/15 px-3 py-2 text-center shadow-[0_10px_30px_rgba(0,0,0,0.1)] backdrop-blur-md">
            <p className="font-[family-name:var(--font-cormorant)] text-xl font-semibold text-mint sm:text-2xl">
              Your presence is the greatest gift.
            </p>

            <p className="mt-1 text-[10px] leading-4 text-mint-light/75 sm:text-xs">
              Thank you for being part of our story and for celebrating this
              beautiful day with us.
            </p>
          </div>

          {/* ========================================================== */}
          {/* BOTTOM */}
          {/* ========================================================== */}

          <div className="mt-3 flex flex-col items-center justify-between gap-2 border-t border-mint/20 pt-3 text-center sm:flex-row sm:text-left">
            <p className="text-[9px] text-mint-light/55">
              © 2026 OASIS&apos;26. All rights reserved.
            </p>

            <Link
              href="https://wa.me/2348164580712"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] font-semibold uppercase tracking-[0.12em] text-mint transition-colors hover:text-mint-light"
            >
              Website designed by Grivit Tech Studios
            </Link>
          </div>
        </div>
      </footer>

      <RsvpModal
        open={rsvpOpen}
        onClose={() => setRsvpOpen(false)}
      />
    </>
  );
}