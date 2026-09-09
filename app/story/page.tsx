import { ContentCards } from '../_components/content-cards';
import { PageHero, PageShell } from '../_components/page-shell';
import { weddingApi } from '../_lib/api';
import { storyFallback } from '../_lib/content';

export default async function StoryPage() {
  const story = await weddingApi.content('story', storyFallback);

  return <PageShell><PageHero eyebrow="Our story" title="A love written in the little moments" description="A journey of friendship, faith, laughter, and choosing one another every day." /><section className="mx-auto max-w-6xl px-5 py-16"><ContentCards items={story} /></section></PageShell>;
}
