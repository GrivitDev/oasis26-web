'use client';

import {
  Download,
  Heart,
  Loader2,
  X,
} from 'lucide-react';
import Image from 'next/image';
import {
  createPortal,
} from 'react-dom';
import {
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react';

import GalleryShareButton from './gallery-share-button';
import type { GalleryItem } from './gallery-card';

type GalleryMediaViewerProps = {
  item: GalleryItem | null;
  onClose: () => void;
};

export default function GalleryMediaViewer({
  item,
  onClose,
}: GalleryMediaViewerProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const [mediaLoadingItemId, setMediaLoadingItemId] =
    useState<GalleryItem['id'] | null>(null);
  
  const [likeOverride, setLikeOverride] =
    useState<{
      itemId: GalleryItem['id'];
      likes: number;
    } | null>(null);

  const [liking, setLiking] =
    useState(false);

  useEffect(() => {
    if (!item) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener(
      'keydown',
      handleKeyDown,
    );

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      'hidden';

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown,
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [item, onClose]);

  if (!item || !mounted) {
    return null;
  }

  const currentItem = item;

  const mediaLoading =
    mediaLoadingItemId !== currentItem.id;

  const currentLikes =
    likeOverride?.itemId ===
    currentItem.id
      ? likeOverride.likes
      : currentItem.likes;

  async function likeItem() {
    if (liking) {
      return;
    }

    try {
      setLiking(true);

      const response =
        await fetch(
          `/api/gallery/${currentItem.id}/like`,
          {
            method: 'POST',
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            'Unable to like this item.',
        );
      }

      setLikeOverride({
        itemId: currentItem.id,
        likes: Number(
          data.likes ??
            currentLikes,
        ),
      });
    } catch (error) {
      console.error(
        'Gallery viewer like error:',
        error,
      );
    } finally {
      setLiking(false);
    }
  }

  function downloadItem() {
    const link =
      document.createElement('a');

    link.href =
      `/api/gallery/${currentItem.id}/download`;

    link.download =
      currentItem.originalFilename ||
      `oasis26-${currentItem.id}`;

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function handleMediaLoaded() {
    setMediaLoadingItemId(currentItem.id);
  }

  function handleMediaError() {
    setMediaLoadingItemId(currentItem.id);
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[2147483647] flex min-h-[100dvh] items-center justify-center overflow-y-auto bg-ink/90 px-2.5 py-3 backdrop-blur-md sm:px-5 sm:py-6"
      role="dialog"
      aria-modal="true"
      aria-label="Gallery media viewer"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="relative flex w-full max-w-6xl flex-col items-center">

        {/* CLOSE */}

        <button
          type="button"
          onClick={onClose}
          className="absolute right-0 top-0 z-40 flex h-9 w-9 -translate-y-1 items-center justify-center rounded-full border border-white/15 bg-ink/70 text-white shadow-lg backdrop-blur-md transition hover:bg-wine sm:right-1 sm:top-1 sm:h-10 sm:w-10"
          aria-label="Close viewer"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        {/* MEDIA FRAME */}

        <div className="relative flex min-h-[40vh] max-h-[78dvh] max-w-full items-center justify-center overflow-hidden rounded-[16px] border border-white/10 bg-ink/30 shadow-2xl sm:min-h-[45vh] sm:max-h-[80vh] sm:rounded-[22px]">

          {/* IMMEDIATE LOADING OVERLAY */}

          {mediaLoading && (
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

          {currentItem.resourceType ===
          'image' ? (
            <div className="relative flex max-h-[78dvh] max-w-full items-center justify-center sm:max-h-[80vh]">
              <Image
                src={currentItem.secureUrl}
                alt={
                  currentItem.originalFilename ||
                  "OASIS'26 gallery photograph"
                }
                width={
                  currentItem.width ??
                  1600
                }
                height={
                  currentItem.height ??
                  1200
                }
                sizes="(max-width: 640px) 96vw, (max-width: 1024px) 92vw, 90vw"
                className="max-h-[78dvh] w-auto max-w-full object-contain sm:max-h-[80vh]"
                priority
                onLoad={
                  handleMediaLoaded
                }
                onError={
                  handleMediaError
                }
              />
            </div>
          ) : (
            <video
              key={currentItem.id}
              src={currentItem.secureUrl}
              controls
              autoPlay
              playsInline
              preload="auto"
              onLoadedData={
                handleMediaLoaded
              }
              onCanPlay={
                handleMediaLoaded
              }
              onError={
                handleMediaError
              }
              className="max-h-[78dvh] max-w-full rounded-[16px] object-contain sm:max-h-[80vh] sm:rounded-[22px]"
            />
          )}
        </div>

        {/* MEDIA INFO */}

        <div className="mt-2 max-w-[90vw] truncate text-center text-[8px] font-medium text-white/60">
          {currentItem.originalFilename}
        </div>

        {/* ACTION BAR */}

        <div className="mt-2.5 flex items-center justify-center gap-1 rounded-full border border-white/10 bg-ink/75 p-1.5 shadow-xl backdrop-blur-md sm:mt-3 sm:gap-1.5 sm:p-1.5">
          <button
            type="button"
            onClick={likeItem}
            disabled={liking}
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
            mediaId={currentItem.id}
            className="h-8 w-8 bg-transparent hover:bg-white/10 sm:h-9 sm:w-9"
          />

          <button
            type="button"
            onClick={downloadItem}
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