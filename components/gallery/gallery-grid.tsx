'use client';

import {
  useEffect,
  useState,
} from 'react';

import GalleryCard, {
  type GalleryItem,
} from './gallery-card';

type GalleryGridProps = {
  section:
    | 'pre-wedding'
    | 'live';

  refreshKey?: number;
  onOpen: (
    item: GalleryItem,
  ) => void;
};

export default function GalleryGrid({
  section,
  refreshKey = 0,
  onOpen,
}: GalleryGridProps) {
  const [items, setItems] =
    useState<GalleryItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    const controller =
      new AbortController();

    async function loadGallery() {
      try {
        setLoading(true);
        setError('');

        const response =
          await fetch(
            `/api/gallery?section=${encodeURIComponent(section)}`,
            {
              cache: 'no-store',
              signal: controller.signal,
            },
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ??
              'Unable to load gallery.',
          );
        }

        const galleryItems =
          Array.isArray(data.items)
            ? data.items.filter(
                (
                  item: GalleryItem,
                ) =>
                  item &&
                  typeof item.id ===
                    'string' &&
                  typeof item.secureUrl ===
                    'string' &&
                  item.secureUrl.trim()
                    .length > 0,
              )
            : [];

        setItems(galleryItems);
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === 'AbortError'
        ) {
          return;
        }

        console.error(
          'Gallery loading error:',
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : 'Unable to load gallery.',
        );
      } finally {
        if (
          !controller.signal.aborted
        ) {
          setLoading(false);
        }
      }
    }

    loadGallery();

    return () => {
      controller.abort();
    };
  }, [section, refreshKey]);

  if (loading) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <div className="flex items-center gap-2 text-[10px] font-medium text-ink-soft">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-sand-dark border-t-emerald" />
          Loading gallery...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[18px] border border-wine/20 bg-wine/5 px-4 py-7 text-center">
        <p className="text-xs font-semibold text-wine">
          Unable to load this gallery.
        </p>

        <p className="mt-1.5 text-[10px] leading-4 text-ink-soft">
          {error}
        </p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-[18px] border border-sand-dark/70 bg-white px-4 py-10 text-center shadow-sm">
        <p className="font-[family-name:var(--font-cormorant)] text-xl font-semibold text-wine">
          No memories yet
        </p>

        <p className="mx-auto mt-1.5 max-w-xs text-[10px] leading-4 text-ink-soft">
          Be the first to add a beautiful
          moment to this gallery.
        </p>
      </div>
    );
  }

  return (
    <section
      className="
        columns-3
        gap-1.5
        sm:columns-4
        sm:gap-2
        lg:columns-6
        lg:gap-2.5
      "
    >
      {items.map((item, index) => (
        <GalleryCard
          key={item.id}
          item={item}
          onOpen={onOpen}
          priority={index === 0}
        />
      ))}
    </section>
  );
}