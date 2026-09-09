import Link from 'next/link';

import { PageShell } from './_components/page-shell';

export default function NotFound() {
  return (
    <PageShell>
      <section className="mx-auto max-w-2xl px-5 py-32 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#bd8c3d]">Not found</p>
        <h1 className="mt-4 font-serif text-5xl text-[#6d2635]">This page is not on our invitation.</h1>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-[#6d2635] px-5 py-3 text-sm font-semibold text-white">
          Return home
        </Link>
      </section>
    </PageShell>
  );
}
