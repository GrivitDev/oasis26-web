// src/components/gallery/gallery-media-viewer.tsx

'use client';

import {
  Download,
  Heart,
  Loader2,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import {
  useEffect,
  useRef,
  useState,
} from 'react';

import GalleryShareButton from './gallery-share-button';
import {
  getVideoPosterUrl,
  type GalleryItem,
} from './gallery-card';

type GalleryMediaViewerProps = {
  item: GalleryItem | null;
  onClose: () => void;
  onLikeChange?: (itemId: string, likes: number) => void;
};

export default function GalleryMediaViewer({
  item,
  onClose,
  onLikeChange,
}: GalleryMediaViewerProps) {
  return (
    <GalleryMediaViewerContent
      key={item?.id ?? 'closed'}
      item={item}
      onClose={onClose}
      onLikeChange={onLikeChange}
    />
  );
}

function GalleryMediaViewerContent({
  item,
  onClose,
  onLikeChange,
}: GalleryMediaViewerProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const [mediaLoading, setMediaLoading] = useState(true);
  const [mediaError, setMediaError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [likeOverride, setLikeOverride] = useState<number | null>(null);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    if (!item) return;

    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const dialog = document.querySelector('[data-gallery-dialog="true"]');
      if (!(dialog instanceof HTMLElement)) return;

      const focusables = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          '[data-gallery-dialog-focusable="true"]',
        ),
      ).filter(
        (element) =>
          !element.hasAttribute('disabled') &&
          element.getAttribute('aria-hidden') !== 'true',
      );

      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocusedRef.current?.focus?.();
    };
  }, [item, onClose]);

  if (!item || typeof document === 'undefined') {
    return null;
  }

  const galleryItem = item;
  const currentLikes = likeOverride ?? galleryItem.likes;

  async function likeItem() {
    if (liking) return;

    try {
      setLiking(true);

      const response = await fetch(`/api/gallery/${galleryItem.id}/like`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? 'Unable to like this item.',
        );
      }

      const nextLikes = Number(data.likes ?? currentLikes);
      setLikeOverride(nextLikes);
      onLikeChange?.(galleryItem.id, nextLikes);
    } catch (error) {
      console.error('Gallery viewer like error:', error);
    } finally {
      setLiking(false);
    }
  }

  function downloadItem() {
    const link = document.createElement('a');
    link.href = `/api/gallery/${galleryItem.id}/download`;
    link.download =
      galleryItem.originalFilename ||
      `oasis26-${galleryItem.id}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function retryMedia() {
    setMediaError(false);
    setMediaLoading(true);
    setRetryKey((current) => current + 1);
  }

  return createPortal(
    <div
      data-gallery-dialog="true"
      className="fixed inset-0 z-[2147483647] flex min-h-[100dvh] items-center justify-center overflow-y-auto bg-ink/90 px-2.5 py-3 backdrop-blur-md sm:px-5 sm:py-6"
      role="dialog"
      aria-modal="true"
      aria-label="Gallery media viewer"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative flex w-full max-w-6xl flex-col items-center">
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          data-gallery-dialog-focusable="true"
          className="absolute right-0 top-0 z-40 flex h-9 w-9 -translate-y-1 items-center justify-center rounded-full border border-white/15 bg-ink/70 text-white shadow-lg backdrop-blur-md transition hover:bg-wine sm:right-1 sm:top-1 sm:h-10 sm:w-10"
          aria-label="Close viewer"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        <div className="relative flex min-h-[40vh] max-h-[78dvh] max-w-full items-center justify-center overflow-hidden rounded-[16px] border border-white/10 bg-ink/30 shadow-2xl sm:min-h-[45vh] sm:max-h-[80vh] sm:rounded-[22px]">
          {mediaLoading && !mediaError && (
            <div
              className="absolute inset-0 z-30 flex items-center justify-center bg-ink/45 backdrop-blur-[3px]"
              aria-live="polite"
              aria-label="Loading media"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-ink/75 shadow-2xl backdrop-blur-md sm:h-16 sm:w-16">
                <Loader2 className="h-6 w-6 animate-spin text-white sm:h-7 sm:w-7" />
              </div>
            </div>
          )}

          {mediaError ? (
            <div className="flex min-h-[40vh] w-[90vw] max-w-lg flex-col items-center justify-center px-6 text-center sm:min-h-[45vh]">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-wine/20 text-white">
                <X className="h-5 w-5" />
              </div>
              <p className="mt-4 text-sm font-semibold text-white">
                Unable to load this memory.
              </p>
              <p className="mt-1 max-w-sm text-[10px] leading-4 text-white/55">
                The media could not be loaded. Please try again.
              </p>
              <button
                type="button"
                onClick={retryMedia}
                data-gallery-dialog-focusable="true"
                className="mt-4 rounded-full bg-wine px-4 py-2 text-[8px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-wine-dark"
              >
                Try Again
              </button>
            </div>
          ) : galleryItem.resourceType === 'image' ? (
            <div className="relative flex max-h-[78dvh] max-w-full items-center justify-center sm:max-h-[80vh]">
              <Image
                key={`${galleryItem.id}-${retryKey}`}
                src={galleryItem.secureUrl}
                alt={
                  galleryItem.originalFilename ||
                  "OASIS'26 gallery photograph"
                }
                width={galleryItem.width ?? 1600}
                height={galleryItem.height ?? 1200}
                sizes="(max-width: 640px) 96vw, (max-width: 1024px) 92vw, 90vw"
                className="max-h-[78dvh] w-auto max-w-full object-contain sm:max-h-[80vh]"
                priority
                onLoad={() => {
                  setMediaLoading(false);
                  setMediaError(false);
                }}
                onError={() => {
                  setMediaLoading(false);
                  setMediaError(true);
                }}
              />
            </div>
          ) : (
            <video
              key={`${galleryItem.id}-${retryKey}`}
              src={galleryItem.secureUrl}
              poster={getVideoPosterUrl(galleryItem.secureUrl)}
              controls
              playsInline
              preload="metadata"
              data-gallery-dialog-focusable="true"
              onLoadedData={() => {
                setMediaLoading(false);
                setMediaError(false);
              }}
              onCanPlay={() => {
                setMediaLoading(false);
                setMediaError(false);
              }}
              onError={() => {
                setMediaLoading(false);
                setMediaError(true);
              }}
              className="max-h-[78dvh] max-w-full rounded-[16px] object-contain sm:max-h-[80vh] sm:rounded-[22px]"
            />
          )}
        </div>

        <div className="mt-2 max-w-[90vw] truncate text-center text-[8px] font-medium text-white/60">
          {galleryItem.originalFilename}
        </div>

        <div className="mt-2.5 flex items-center justify-center gap-1 rounded-full border border-white/10 bg-ink/75 p-1.5 shadow-xl backdrop-blur-md sm:mt-3 sm:gap-1.5">
          <button
            type="button"
            onClick={() => void likeItem()}
            disabled={liking}
            data-gallery-dialog-focusable="true"
            className="flex h-8 items-center gap-1.5 rounded-full px-3 text-[10px] font-semibold text-white transition hover:bg-white/10 disabled:opacity-60 sm:h-9 sm:px-3.5 sm:text-xs"
            aria-label="Like gallery item"
          >
            {liking ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
            ) : (
              <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            )}
            {currentLikes}
          </button>

          <GalleryShareButton
            mediaId={galleryItem.id}
            className="h-8 w-8 bg-transparent hover:bg-white/10 sm:h-9 sm:w-9"
          />

          <button
            type="button"
            onClick={downloadItem}
            data-gallery-dialog-focusable="true"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:bg-white/10 sm:h-9 sm:w-9"
            aria-label="Download gallery item"
            title="Download"
          >
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
