'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const links = [
  ['Our Story', '/story'],
  ['Programme', '/programs'],
  ['Wedding Party', '/wedding-party'],
  ['Gallery', '/gallery'],
  ['FAQ', '/faq'],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#fffaf3]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-serif text-xl font-semibold text-[#6d2635]">
          P <span className="text-[#bd8c3d]">&</span> J
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-[#6d2635]">
              {label}
            </Link>
          ))}
          <Link
            href="/rsvp"
            className="rounded-full bg-[#6d2635] px-4 py-2 text-white transition hover:bg-[#4d1723]"
          >
            RSVP
          </Link>
        </nav>

        <button
          type="button"
          className="rounded-md p-2 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(current => !current)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-stone-200 bg-[#fffaf3] px-5 py-4 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm font-medium">
            {links.map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
            <Link href="/rsvp" onClick={() => setOpen(false)} className="text-[#6d2635]">
              RSVP now
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
