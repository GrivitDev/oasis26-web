import { ProgramCards } from '../_components/content-cards';
import { PageHero, PageShell } from '../_components/page-shell';
import { weddingApi } from '../_lib/api';

export default async function ProgramsPage() {
  const programs = await weddingApi.programs();

  return <PageShell><PageHero eyebrow="Celebrate with us" title="Wedding programme" description="Everything planned for our days of celebration. Please arrive early and come ready to make beautiful memories." /><section className="mx-auto max-w-4xl px-5 py-16"><ProgramCards programs={programs} /></section></PageShell>;
}
