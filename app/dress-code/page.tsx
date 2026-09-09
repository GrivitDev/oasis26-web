import { ContentCards } from '../_components/content-cards';
import { PageHero, PageShell } from '../_components/page-shell';
import { weddingApi } from '../_lib/api';
import { dressCodeFallback } from '../_lib/content';

export default async function DressCodePage() {
  const dressCode = await weddingApi.content('dress-code', dressCodeFallback);

  return <PageShell><PageHero eyebrow="What to wear" title="Dress code" description="Come beautifully dressed, comfortably yourself, and ready to celebrate love." /><section className="mx-auto max-w-6xl px-5 py-16"><ContentCards items={dressCode} /></section></PageShell>;
}
