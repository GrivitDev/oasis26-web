import { PageHero, PageShell } from '../_components/page-shell';
import { weddingApi } from '../_lib/api';
import { faqFallback } from '../_lib/content';

export default async function FaqPage() {
  const faqs = await weddingApi.content('faq', faqFallback);

  return <PageShell><PageHero eyebrow="Helpful details" title="Frequently asked questions" description="A few quick answers to help you prepare for our celebration." /><section className="mx-auto max-w-3xl space-y-4 px-5 py-16">{faqs.map(faq => <details key={faq._id} className="rounded-xl border border-[#e9dfd2] bg-white p-5"><summary className="cursor-pointer font-serif text-xl text-[#6d2635]">{faq.title}</summary><p className="mt-4 text-sm leading-6 text-stone-600">{faq.description}</p></details>)}</section></PageShell>;
}
