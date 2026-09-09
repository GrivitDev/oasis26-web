import { ContentCards } from '../_components/content-cards';
import { PageHero, PageShell } from '../_components/page-shell';
import { weddingApi } from '../_lib/api';
import { donorFallback } from '../_lib/content';

export default async function DonationsPage() {
  const [settings, donors] = await Promise.all([weddingApi.settings(), weddingApi.content('donor', donorFallback)]);

  return <PageShell><PageHero eyebrow="With gratitude" title="Support & blessings" description="Your presence is our greatest gift. For anyone who wishes to bless us, these are our gift details." /><section className="mx-auto max-w-6xl px-5 py-16">{settings.donationEnabled && <div className="mx-auto max-w-2xl rounded-2xl bg-[#6d2635] p-8 text-center text-white"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e5bd77]">Gift details</p><p className="mt-5 font-serif text-3xl">{settings.accountName}</p><p className="mt-2 text-stone-200">{settings.bankName}</p><p className="mt-5 rounded-lg bg-white/10 px-4 py-3 font-mono text-xl tracking-widest text-[#f4d89f]">{settings.accountNumber}</p><p className="mt-5 text-sm text-stone-200">Thank you for your love, prayers, and generosity. Donation amounts will always remain private.</p></div>}<div className="mt-16"><h2 className="mb-6 text-center font-serif text-4xl text-[#6d2635]">People who have blessed us</h2><ContentCards items={donors} /></div></section></PageShell>;
}
