import { ContentCards } from '../_components/content-cards';
import { PageHero, PageShell } from '../_components/page-shell';
import { weddingApi } from '../_lib/api';
import { asoEbiFallback } from '../_lib/content';

export default async function AsoEbiPage() {
  const asoEbi = await weddingApi.content('aso-ebi', asoEbiFallback);

  return <PageShell><PageHero eyebrow="Celebrate in colour" title="Aso-Ebi" description="We would be delighted to have you wear our chosen fabric. Please contact the coordinator for availability." /><section className="mx-auto max-w-2xl px-5 py-16"><ContentCards items={asoEbi} /></section></PageShell>;
}
