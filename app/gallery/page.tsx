import Link from 'next/link';

import { LiveGalleryUpload } from '../_components/live-gallery-upload';
import { EmptyState, PageHero, PageShell } from '../_components/page-shell';
import { weddingApi } from '../_lib/api';
import type { Media } from '../_lib/types';

function MediaGrid({ media }: { media: Media[] }) {
  if (!media.length) {
    return <EmptyState>Photos and videos will appear here once they are published.</EmptyState>;
  }

  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{media.map(item => <a key={item._id} href={item.url} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-2xl border border-[#e9dfd2] bg-white"><div className="grid aspect-[4/3] place-items-center bg-gradient-to-br from-[#f6ede1] to-[#ead1ad] p-5 text-center font-serif text-2xl text-[#6d2635] transition group-hover:scale-105">{item.resourceType === 'video' ? 'Wedding video' : 'Wedding photo'}</div><div className="p-4"><p className="text-sm font-semibold">{item.caption || 'A beautiful wedding moment'}</p><p className="mt-1 text-xs text-stone-500">{item.uploaderName || item.category || 'Official gallery'}</p></div></a>)}</div>;
}

export default async function GalleryPage() {
  const [settings, official, live] = await Promise.all([weddingApi.settings(), weddingApi.media('official'), weddingApi.media('live')]);

  return <PageShell><PageHero eyebrow="Every cherished moment" title="Wedding gallery" description="Browse the official memories and, when the live gallery is open, share the moments you capture." /><section className="mx-auto max-w-6xl px-5 py-16"><div className="mb-12"><p className="text-xs font-bold uppercase tracking-wider text-[#bd8c3d]">Official gallery</p><h2 className="mt-2 font-serif text-4xl text-[#6d2635]">Our photographs</h2><div className="mt-6"><MediaGrid media={official} /></div></div><div className="grid gap-8 lg:grid-cols-[1fr_380px]"><div><p className="text-xs font-bold uppercase tracking-wider text-[#bd8c3d]">Live gallery</p><h2 className="mt-2 font-serif text-4xl text-[#6d2635]">Captured by our guests</h2><div className="mt-6"><MediaGrid media={live} /></div></div><LiveGalleryUpload enabled={settings.liveGalleryEnabled} /></div><p className="mt-8 text-center text-sm text-stone-500">Want the official photographs when they are ready? <Link href="/contact" className="font-semibold text-[#6d2635]">Contact us.</Link></p></section></PageShell>;
}
