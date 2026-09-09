import { PageHero, PageShell } from '../_components/page-shell';
import { RsvpForm } from '../_components/public-forms';

export default function RsvpPage() {
  return <PageShell><PageHero eyebrow="Will you be there?" title="RSVP" description="Please let us know if you will be joining us. Kindly respond as soon as you can." /><section className="mx-auto max-w-3xl px-5 py-16"><RsvpForm /></section></PageShell>;
}
