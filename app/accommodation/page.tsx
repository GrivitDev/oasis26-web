import { ContentCards } from '../_components/content-cards';
import { PageHero, PageShell } from '../_components/page-shell';
import { weddingApi } from '../_lib/api';
import { accommodationFallback } from '../_lib/content';

export default async function AccommodationPage() {
  const accommodation = await weddingApi.content('accommodation', accommodationFallback);

  return <PageShell><PageHero eyebrow="Stay nearby" title="Accommodation" description="A few recommended places to stay while you celebrate with us in Lagos." /><section className="mx-auto max-w-6xl px-5 py-16"><ContentCards items={accommodation} /></section></PageShell>;
}
