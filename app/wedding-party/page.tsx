import { ContentCards } from '../_components/content-cards';
import { PageHero, PageShell } from '../_components/page-shell';
import { weddingApi } from '../_lib/api';
import { partyFallback } from '../_lib/content';

export default async function WeddingPartyPage() {
  const party = await weddingApi.content('party', partyFallback);

  return <PageShell><PageHero eyebrow="Our people" title="The wedding party" description="The family and friends who have walked with us and made this celebration even more special." /><section className="mx-auto max-w-6xl px-5 py-16"><ContentCards items={party} /></section></PageShell>;
}
