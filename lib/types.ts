export type Program = {
  _id: string;
  title: string;
  date: string;
  time: string;
  venueName: string;
  address: string;
  mapUrl?: string;
  description?: string;
  dressCode?: string;
  items: { title: string; detail?: string }[];
};

export type ContentItem = {
  _id: string;
  type: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  order: number;
  data?: Record<string, string | number | boolean | string[]>;
};

export type Media = {
  _id: string;
  url: string;
  publicId: string;
  resourceType: 'image' | 'video';
  kind: 'official' | 'live';
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  caption?: string;
  uploaderName?: string;
  category?: string;
  createdAt: string;
};

export type Prayer = {
  _id: string;
  name: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  createdAt: string;
};

export type Settings = {
  brideName: string;
  groomName: string;
  weddingDate: string;
  welcomeMessage: string;
  heroImage?: string;
  liveGalleryEnabled: boolean;
  donationEnabled: boolean;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  bridePhone?: string;
  groomPhone?: string;
  coordinatorPhone?: string;
  email?: string;
};
