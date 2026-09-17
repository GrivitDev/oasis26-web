// src/app/sitemap.ts

import type { MetadataRoute } from 'next';

import { SEO } from '@/config/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SEO.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SEO.url}/program`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SEO.url}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];
}