import type { ContentItem, Media, Prayer, Program, Settings } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

const fallbackSettings: Settings = {
  brideName: 'Tolu',
  groomName: 'Chinedu',
  weddingDate: '2026-12-19T11:00:00+01:00',
  welcomeMessage:
    'With grateful hearts, we invite you to celebrate the beginning of our forever.',
  liveGalleryEnabled: false,
  donationEnabled: true,
  bankName: 'Example Bank',
  accountName: 'Tolu & Chinedu Wedding',
  accountNumber: '0123456789',
  bridePhone: '+234 800 000 0001',
  groomPhone: '+234 800 000 0002',
  coordinatorPhone: '+234 800 000 0003',
  email: 'hello@toluchinedu.com',
};

const fallbackPrograms: Program[] = [
  {
    _id: 'wedding-eve',
    title: 'Wedding Eve',
    date: 'Friday, 18 December 2026',
    time: '5:00 PM',
    venueName: 'The Garden Hall',
    address: 'Lekki Phase 1, Lagos',
    description: 'An intimate evening of thanksgiving and family fellowship.',
    items: [
      { title: 'Guests arrive' },
      { title: 'Family introductions' },
      { title: 'Thanksgiving prayer' },
    ],
  },
  {
    _id: 'traditional',
    title: 'Traditional Wedding',
    date: 'Saturday, 19 December 2026',
    time: '10:00 AM',
    venueName: 'The Garden Hall',
    address: 'Lekki Phase 1, Lagos',
    dressCode: 'Aso-Ebi: Champagne and Wine',
    description: 'A joyful celebration of love, family, and Yoruba tradition.',
    items: [
      { title: 'Arrival of families' },
      { title: 'Introduction of the groom' },
      { title: 'Bride’s entrance' },
      { title: 'Marriage rites and blessings' },
    ],
  },
  {
    _id: 'church',
    title: 'Church Wedding',
    date: 'Saturday, 19 December 2026',
    time: '1:00 PM',
    venueName: 'All Saints Anglican Church',
    address: 'Admiralty Way, Lekki, Lagos',
    description: 'A holy service of matrimony and blessing before God.',
    items: [
      { title: 'Processional' },
      { title: 'Hymns and Scripture readings' },
      { title: 'Sermon and declaration of consent' },
      { title: 'Vows and exchange of rings' },
      { title: 'Marriage blessing and recessional' },
    ],
  },
  {
    _id: 'reception',
    title: 'Reception',
    date: 'Saturday, 19 December 2026',
    time: '3:30 PM',
    venueName: 'The Garden Hall',
    address: 'Lekki Phase 1, Lagos',
    description: 'Food, music, dancing, and memorable moments with everyone we love.',
    items: [
      { title: 'Couple’s grand entrance' },
      { title: 'Speeches and dinner' },
      { title: 'First dance and cake cutting' },
      { title: 'Toast, dancing, and closing' },
    ],
  },
];

async function get<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return fallback;
    }

    const result = (await response.json()) as T | null;

    return result ?? fallback;
  } catch {
    return fallback;
  }
}

export const weddingApi = {
  settings: () => get<Settings>('/public/settings', fallbackSettings),
  programs: async () => {
    const programs = await get<Program[]>('/public/programs', fallbackPrograms);

    return programs.length ? programs : fallbackPrograms;
  },
  content: async (type: string, fallback: ContentItem[] = []) => {
    const items = await get<ContentItem[]>(`/public/content/${type}`, fallback);

    return items.length ? items : fallback;
  },
  media: (kind: 'official' | 'live') => get<Media[]>(`/public/gallery?kind=${kind}`, []),
  prayers: () => get<Prayer[]>('/public/prayers', []),
};

export async function submitPublicForm(path: string, body: unknown) {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    throw new Error(payload.message ?? 'Something went wrong. Please try again.');
  }

  return response.json();
}

export { API_URL };
