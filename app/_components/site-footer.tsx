import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-[#24201c] px-5 py-12 text-stone-200">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <p className="font-serif text-3xl text-[#e5bd77]">Tolu & Chinedu</p>
          <p className="mt-2 text-sm text-stone-400">19 December 2026 · Lagos, Nigeria</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link href="/contact">Contact</Link>
          <Link href="/prayers">Prayers & blessings</Link>
          <Link href="/donations">Support us</Link>
          <Link href="/admin">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
