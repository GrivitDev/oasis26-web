import { MessageCircle, Phone } from 'lucide-react';

import { PageHero, PageShell } from '../_components/page-shell';
import { weddingApi } from '../_lib/api';

export default async function ContactPage() {
  const settings = await weddingApi.settings();
  const contacts = [['Bride', settings.bridePhone], ['Groom', settings.groomPhone], ['Wedding coordinator', settings.coordinatorPhone]];

  return <PageShell><PageHero eyebrow="We are here to help" title="Contact us" description="For any questions about the wedding, venue, dress code, or your RSVP, please reach out." /><section className="mx-auto grid max-w-4xl gap-5 px-5 py-16 sm:grid-cols-3">{contacts.map(([role, phone]) => <article key={role} className="rounded-2xl border border-[#e9dfd2] bg-white p-6 text-center"><Phone className="mx-auto text-[#bd8c3d]" /><p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#bd8c3d]">{role}</p><a href={`tel:${phone}`} className="mt-2 block font-serif text-lg text-[#6d2635]">{phone}</a><a href={`https://wa.me/${phone?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#6d2635]"><MessageCircle size={16} />WhatsApp</a></article>)}</section><p className="pb-8 text-center text-sm text-stone-600">Email us at <a href={`mailto:${settings.email}`} className="font-semibold text-[#6d2635]">{settings.email}</a></p></PageShell>;
}
