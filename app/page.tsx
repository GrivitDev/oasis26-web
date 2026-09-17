// src/app/page.tsx

import { EventVenues } from '@/components/event-venues';
import { HomeHero } from '../components/home-hero';
import {OurStory} from '@/components/our-story'
import { WeddingParty } from '@/components/wedding-party';

export default function HomePage() {
  return (
    <main>
      <HomeHero
        backgroundImage="/hero-bg.jpg"
        mainImage="/hero-main.jpg"
      />

      <OurStory />

      <WeddingParty/>

            <EventVenues />
    </main>
  );
}