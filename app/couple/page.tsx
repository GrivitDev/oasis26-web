import { ContentCards } from '../_components/content-cards';
import { PageHero, PageShell } from '../_components/page-shell';
import { weddingApi } from '../_lib/api';
import { coupleFallback } from '../_lib/content';

export default async function CouplePage() {
  const couple = await weddingApi.content('couple', coupleFallback);

  return <PageShell><PageHero eyebrow="The couple" title="Two hearts, one beautiful beginning" description="Meet the two people at the heart of this joyful celebration." /><section className="mx-auto max-w-4xl px-5 py-16"><ContentCards items={couple} /></section></PageShell>;
}
