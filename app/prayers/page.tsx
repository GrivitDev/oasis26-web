import { PrayerForm } from '../_components/public-forms';
import { PageHero, PageShell } from '../_components/page-shell';
import { weddingApi } from '../_lib/api';

export default async function PrayersPage() {
  const prayers = await weddingApi.prayers();

  return <PageShell><PageHero eyebrow="Speak life" title="Prayers & blessings" description="Your kind words and prayers mean so much as we begin this new chapter." /><section className="mx-auto grid max-w-6xl gap-8 px-5 py-16 lg:grid-cols-[1fr_400px]"><div><h2 className="font-serif text-3xl text-[#6d2635]">Words from loved ones</h2><div className="mt-6 grid gap-4">{prayers.length ? prayers.map(prayer => <blockquote key={prayer._id} className="rounded-2xl border border-[#e9dfd2] bg-white p-6"><p className="text-sm leading-7 text-stone-700">“{prayer.message}”</p><footer className="mt-4 text-sm font-semibold text-[#6d2635]">— {prayer.name}</footer></blockquote>) : <p className="rounded-2xl border border-dashed border-[#d9c6ae] p-8 text-sm text-stone-500">Be the first to leave a prayer or blessing.</p>}</div></div><PrayerForm /></section></PageShell>;
}
