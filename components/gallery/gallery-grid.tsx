// src/components/gallery/gallery-grid.tsx

'use client';

import {
  useEffect,
  useState,
} from 'react';

import { GALLERY_PAGE_SIZE } from '@/lib/gallery';

import GalleryCard, {
  type GalleryItem,
} from './gallery-card';

type GalleryGridProps = {
  section: 'pre-wedding' | 'live';
  refreshKey?: number;
  onOpen: (item: GalleryItem) => void;
  likeOverrides?: Record<string, number>;
  onLikeChange?: (itemId: string, likes: number) => void;
};

type Cursor = {
  beforeCreatedAt: string;
  beforeId: string;
};

export default function GalleryGrid({
  section,
  refreshKey = 0,
  onOpen,
  likeOverrides = {},
  onLikeChange,
}: GalleryGridProps) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<Cursor | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadGallery() {
      try {
        setLoading(true);
        setError('');
        setItems([]);
        setNextCursor(null);
        setHasMore(false);

        const params = new URLSearchParams({
          section,
          limit: String(GALLERY_PAGE_SIZE),
        });

        const response = await fetch(
          `/api/gallery?${params.toString()}`,
          {
            cache: 'no-store',
            signal: controller.signal,
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ?? 'Unable to load gallery.',
          );
        }

        const galleryItems = Array.isArray(data.items)
          ? data.items.filter(
              (item: GalleryItem) =>
                item &&
                typeof item.id === 'string' &&
                typeof item.secureUrl === 'string' &&
                item.secureUrl.trim().length > 0,
            )
          : [];

        setItems(galleryItems);
        setHasMore(Boolean(data.hasMore));
        setNextCursor(data.nextCursor ?? null);
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === 'AbortError'
        ) {
          return;
        }

        console.error('Gallery loading error:', error);
        setError(
          error instanceof Error
            ? error.message
            : 'Unable to load gallery.',
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadGallery();

    return () => controller.abort();
  }, [section, refreshKey]);

  async function loadMore() {
    if (!hasMore || !nextCursor || loadingMore) return;

    try {
      setLoadingMore(true);
      setError('');

      const params = new URLSearchParams({
        section,
        limit: String(GALLERY_PAGE_SIZE),
        beforeCreatedAt: nextCursor.beforeCreatedAt,
        beforeId: nextCursor.beforeId,
      });

      const response = await fetch(
        `/api/gallery?${params.toString()}`,
        { cache: 'no-store' },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? 'Unable to load more gallery items.',
        );
      }

      const galleryItems = Array.isArray(data.items)
        ? data.items.filter(
            (item: GalleryItem) =>
              item &&
              typeof item.id === 'string' &&
              typeof item.secureUrl === 'string' &&
              item.secureUrl.trim().length > 0,
          )
        : [];

      setItems((current) => [...current, ...galleryItems]);
      setHasMore(Boolean(data.hasMore));
      setNextCursor(data.nextCursor ?? null);
    } catch (error) {
      console.error('Gallery pagination error:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to load more gallery items.',
      );
    } finally {
      setLoadingMore(false);
    }
  }

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

  if (error && !items.length) {
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
          Be the first to add a beautiful moment to this gallery.
        </p>
      </div>
    );
  }

  return (
    <div>
      <section className="columns-3 gap-1.5 sm:columns-4 sm:gap-2 lg:columns-6 lg:gap-2.5">
        {items.map((item, index) => (
          <GalleryCard
            key={item.id}
            item={item}
            onOpen={(selected) =>
              onOpen({
                ...selected,
                likes:
                  likeOverrides[selected.id] ?? selected.likes,
              })
            }
            likesOverride={likeOverrides[item.id]}
            onLiked={(likes) => onLikeChange?.(item.id, likes)}
            priority={index < 2}
          />
        ))}
      </section>

      {error && (
        <p className="mt-3 text-center text-[9px] leading-4 text-wine">
          {error}
        </p>
      )}

      {hasMore && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => void loadMore()}
            disabled={loadingMore}
            className="inline-flex min-h-9 items-center gap-2 rounded-full border border-sand-dark/70 bg-white px-4 text-[8px] font-bold uppercase tracking-[0.12em] text-wine shadow-sm transition hover:bg-cream disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-10 sm:px-5 sm:text-[9px]"
          >
            {loadingMore && (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-sand-dark border-t-wine" />
            )}
            {loadingMore ? 'Loading...' : 'Load more memories'}
          </button>
        </div>
      )}
    </div>
  );
}
