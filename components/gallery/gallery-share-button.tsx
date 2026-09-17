// src/components/gallery/gallery-share-button.tsx

'use client';

import {
  Check,
  Share2,
} from 'lucide-react';
import { useState } from 'react';

type GalleryShareButtonProps = {
  mediaId: string;
  className?: string;
};

export default function GalleryShareButton({
  mediaId,
  className = '',
}: GalleryShareButtonProps) {
  const [shared, setShared] =
    useState(false);

  async function shareMedia() {
    const url =
      `${window.location.origin}/gallery/media/${mediaId}`;

    try {
      if (
        typeof navigator.share ===
        'function'
      ) {
        await navigator.share({
          title: "OASIS'26 Gallery",
          text: "A beautiful moment from OASIS'26.",
          url,
        });

        setShared(true);

        window.setTimeout(() => {
          setShared(false);
        }, 2000);

        return;
      }

      if (
        navigator.clipboard &&
        typeof navigator.clipboard.writeText ===
          'function'
      ) {
        await navigator.clipboard.writeText(
          url,
        );

        setShared(true);

        window.setTimeout(() => {
          setShared(false);
        }, 2000);

        return;
      }

      const textarea =
        document.createElement('textarea');

      textarea.value = url;
      textarea.setAttribute(
        'readonly',
        '',
      );
      textarea.style.position =
        'fixed';
      textarea.style.opacity = '0';

      document.body.appendChild(
        textarea,
      );

      textarea.select();

      const copied =
        document.execCommand(
          'copy',
        );

      textarea.remove();

      if (copied) {
        setShared(true);

        window.setTimeout(() => {
          setShared(false);
        }, 2000);

        return;
      }

      throw new Error(
        'Unable to copy gallery link.',
      );
    } catch (error) {
      /*
       * AbortError means the user closed the
       * native share dialog. It is not an error.
       */
      if (
        error instanceof DOMException &&
        error.name === 'AbortError'
      ) {
        return;
      }

      console.error(
        'Gallery share error:',
        error,
      );
    }
  }

  return (
    <button
      type="button"
      onClick={shareMedia}
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink/55 text-white shadow-sm backdrop-blur-md transition hover:bg-wine/80 sm:h-9 sm:w-9 ${className}`}
      aria-label={
        shared
          ? 'Gallery link copied'
          : 'Share gallery item'
      }
      title={
        shared
          ? 'Link copied'
          : 'Share'
      }
    >
      {shared ? (
        <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      ) : (
        <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      )}
    </button>
  );
}