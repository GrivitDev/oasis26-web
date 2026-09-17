'use client';

import Image from 'next/image';
import {
  Download,
  Heart,
  Loader2,
  Play,
} from 'lucide-react';
import { useState } from 'react';

import GalleryShareButton from './gallery-share-button';

export type GalleryItem = {
  id: string;
  publicId: string;
  secureUrl: string;
  resourceType: 'image' | 'video';
  section: 'pre-wedding' | 'live';
  originalFilename: string;
  width?: number;
  height?: number;
  duration?: number;
  likes: number;
  createdAt: string;
};

type GalleryCardProps = {
  item: GalleryItem;
  onOpen: (item: GalleryItem) => void;
  onLiked?: () => void;
  priority?: boolean;
};

export default function GalleryCard({
  item,
  onOpen,
  onLiked,
  priority = false,
}: GalleryCardProps) {
  const [likes, setLikes] = useState(
    item.likes,
  );

  const [liking, setLiking] = useState(false);

  async function likeItem(
    event: React.MouseEvent,
  ) {
    event.stopPropagation();

    if (liking) {
      return;
    }

    try {
      setLiking(true);

      const response = await fetch(
        `/api/gallery/${item.id}/like`,
        {
          method: 'POST',
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            'Unable to like this item.',
        );
      }

      setLikes(
        Number(data.likes ?? likes),
      );

      onLiked?.();
    } catch (error) {
      console.error(
        'Gallery like error:',
        error,
      );
    } finally {
      setLiking(false);
    }
  }

  function downloadItem(
    event: React.MouseEvent,
  ) {
    event.stopPropagation();

    const link =
      document.createElement('a');

    link.href =
      `/api/gallery/${item.id}/download`;

    link.download =
      item.originalFilename ||
      `oasis26-${item.id}`;

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  const aspectClass =
    item.width &&
    item.height
      ? item.height > item.width
        ? 'aspect-[3/4]'
        : item.width > item.height
          ? 'aspect-[4/3]'
          : 'aspect-square'
      : 'aspect-square';

  const hasMediaUrl =
    Boolean(item.secureUrl);

  return (
    <article
      className={`group relative mb-2 break-inside-avoid overflow-hidden rounded-[14px] border border-sand-dark/60 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:mb-3 sm:rounded-[18px] ${aspectClass}`}
    >
      <button
        type="button"
        onClick={() => {
          if (hasMediaUrl) {
            onOpen(item);
          }
        }}
        disabled={!hasMediaUrl}
        className="absolute inset-0 z-0 h-full w-full cursor-pointer disabled:cursor-default"
        aria-label={`Open ${item.originalFilename}`}
      >
        {hasMediaUrl &&
          (item.resourceType === 'image' ? (
            <Image
              src={item.secureUrl}
              alt={
                item.originalFilename ||
                "OASIS'26 gallery photograph"
              }
              fill
              sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
              loading={
                priority
                  ? 'eager'
                  : 'lazy'
              }
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <video
              src={item.secureUrl}
              muted
              playsInline
              preload="metadata"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ))}

        <span className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </button>

      {item.resourceType === 'video' &&
        hasMediaUrl && (
          <span className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-wine/80 text-white shadow-md backdrop-blur-sm sm:h-11 sm:w-11">
            <Play className="ml-0.5 h-4 w-4 fill-current sm:h-5 sm:w-5" />
          </span>
        )}

      <div className="absolute bottom-1.5 left-1.5 right-1.5 z-20 flex items-center justify-between gap-1 sm:bottom-2 sm:left-2 sm:right-2">
        <button
          type="button"
          onClick={likeItem}
          disabled={liking || !hasMediaUrl}
          className="flex h-7 min-w-7 items-center justify-center gap-1 rounded-full bg-ink/55 px-2 text-[9px] font-semibold text-white shadow-sm backdrop-blur-md transition hover:bg-wine/80 disabled:opacity-60 sm:h-8 sm:px-2.5 sm:text-[10px]"
          aria-label="Like this gallery item"
        >
          {liking ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Heart className="h-3 w-3" />
          )}

          <span>{likes}</span>
        </button>

        <div className="flex items-center gap-1">
          <GalleryShareButton
            mediaId={item.id}
            className="h-7 w-7 bg-ink/55 hover:bg-wine/80 sm:h-8 sm:w-8"
          />

          <button
            type="button"
            onClick={downloadItem}
            disabled={!hasMediaUrl}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/55 text-white shadow-sm backdrop-blur-md transition hover:bg-wine/80 disabled:opacity-60 sm:h-8 sm:w-8"
            aria-label="Download gallery item"
            title="Download"
          >
            <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}