import { notFound } from 'next/navigation';

import { AdminConsole } from '../../_components/admin-console';

const validSections = new Set(['settings', 'programs', 'couple', 'party', 'story', 'dress-code', 'aso-ebi', 'venue', 'accommodation', 'faq', 'donor', 'rsvps', 'media', 'prayers']);

export default async function AdminSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;

  if (!validSections.has(section)) notFound();

  return <AdminConsole section={section} />;
}
