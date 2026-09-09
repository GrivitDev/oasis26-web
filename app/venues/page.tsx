import { MapPin } from 'lucide-react';

import { PageHero, PageShell } from '../_components/page-shell';
import { weddingApi } from '../_lib/api';

export default async function VenuesPage() {
  const programs = await weddingApi.programs();

  return <PageShell><PageHero eyebrow="Find your way" title="Venues & directions" description="Every event has a location. Tap Get directions to open the venue in Google Maps." /><section className="mx-auto grid max-w-6xl gap-5 px-5 py-16 md:grid-cols-2">{programs.map(program => <article key={program._id} className="rounded-2xl border border-[#e9dfd2] bg-white p-6"><MapPin className="text-[#bd8c3d]" /><p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#bd8c3d]">{program.title}</p><h2 className="mt-2 font-serif text-3xl text-[#6d2635]">{program.venueName}</h2><p className="mt-3 text-sm text-stone-600">{program.address}</p><a href={program.mapUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${program.venueName}, ${program.address}`)}`} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full border border-[#6d2635] px-4 py-2 text-sm font-semibold text-[#6d2635]">Get directions</a></article>)}</section></PageShell>;
}
