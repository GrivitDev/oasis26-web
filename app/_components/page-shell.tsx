import type { ReactNode } from 'react';

import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="border-b border-[#e9dfd2] bg-[#f6ede1] px-5 py-16 text-center sm:py-24">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#bd8c3d]">{eyebrow}</p>
      <h1 className="mx-auto mt-4 max-w-3xl font-serif text-4xl font-semibold text-[#6d2635] sm:text-6xl">
        {title}
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-stone-600">{description}</p>
    </section>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#d9c6ae] bg-white/60 p-10 text-center text-sm text-stone-500">
      {children}
    </div>
  );
}
