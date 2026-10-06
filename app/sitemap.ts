// src/app/sitemap.ts

import type { MetadataRoute } from 'next';

import { SEO } from '@/config/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/programs',
    '/programs/traditional-wedding',
    '/programs/church-wedding',
    '/programs/church-photographs',
    '/programs/reception',
    '/gallery',
  ];

  return routes.map((route, index) => ({
    url: `${SEO.url}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority:
      index === 0
        ? 1
        : route === '/programs'
          ? 0.9
          : route === '/gallery'
            ? 0.8
            : 0.7,
  }));
}
