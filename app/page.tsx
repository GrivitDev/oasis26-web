import Link from 'next/link';
import { CalendarDays, Camera, Heart, MapPin } from 'lucide-react';

import { Countdown } from './_components/countdown';
import { PageShell } from './_components/page-shell';
import { weddingApi } from './_lib/api';

export default async function HomePage() {
  const settings = await weddingApi.settings();
  const date = new Date(settings.weddingDate);

  return (
    <PageShell>
      <section className="relative overflow-hidden bg-[#6d2635] px-5 py-20 text-center text-white sm:py-28">
        <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#bd8c3d]/20 blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-[#f4d89f]/10 blur-3xl" />
        <div className="relative mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#e5bd77]">Together with their families</p>
          <h1 className="mt-6 font-serif text-5xl leading-none sm:text-7xl">{settings.brideName}<span className="mx-3 text-[#e5bd77]">&</span>{settings.groomName}</h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-stone-200">{settings.welcomeMessage}</p>
          <div className="mx-auto my-10 grid aspect-square max-w-xs place-items-center rounded-full border-[12px] border-[#e5bd77]/40 bg-gradient-to-br from-[#f6ede1] to-[#bd8c3d] font-serif text-8xl text-[#6d2635] shadow-2xl">J&P</div>
          <p className="font-serif text-2xl text-[#f4d89f]">{date.toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p className="mt-2 text-sm text-stone-200">Lagos, Nigeria</p>
          <div className="mx-auto mt-10 max-w-lg"><Countdown weddingDate={settings.weddingDate} /></div>
          <Link href="/rsvp" className="mt-10 inline-flex rounded-full bg-[#e5bd77] px-6 py-3 text-sm font-bold text-[#24201c] transition hover:bg-[#f4d89f]">RSVP to celebrate with us</Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [CalendarDays, 'Programme', 'Plan your celebration', '/programs'],
          [MapPin, 'Venues', 'Find every location', '/venues'],
          [Camera, 'Gallery', 'Share the memories', '/gallery'],
          [Heart, 'Blessings', 'Leave a kind word', '/prayers'],
        ].map(([Icon, title, description, href]) => {
          const ItemIcon = Icon as typeof CalendarDays;
          return <Link key={title as string} href={href as string} className="rounded-2xl border border-[#e9dfd2] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"><ItemIcon className="text-[#bd8c3d]" /><h2 className="mt-4 font-serif text-2xl text-[#6d2635]">{title as string}</h2><p className="mt-2 text-sm text-stone-600">{description as string}</p></Link>;
        })}
      </section>
    </PageShell>
  );
}
