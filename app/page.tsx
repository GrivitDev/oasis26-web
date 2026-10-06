// src/app/page.tsx

import { EventVenues } from '@/components/event-venues';
import { HomeHero } from '../components/home-hero';
import { OurStory } from '@/components/our-story';
import { WeddingParty } from '@/components/wedding-party';
import BlessingsPrayers from '@/components/blessings-prayers';
import GalleryPreview from '@/components/gallery-preview';
import ProgramPreview from '@/components/program-preview';

export default function HomePage() {
  return (
    <main>
      <HomeHero
        backgroundImage="/hero-bg.jpg"
        mainImage="/hero-main.jpg"
      />

      <OurStory />

      <ProgramPreview variant="first" />

      <WeddingParty />

      <EventVenues />

      <ProgramPreview variant="second" />

      <GalleryPreview />

      <BlessingsPrayers />
    </main>
  );
}