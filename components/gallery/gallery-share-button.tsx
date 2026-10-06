// src/components/gallery/gallery-share-button.tsx

'use client';

import {
  Check,
  Share2,
} from 'lucide-react';
import {
  useEffect,
  useRef,
  useState,
} from 'react';

type GalleryShareButtonProps = {
  mediaId: string;
  className?: string;
  showLabel?: boolean;
};

export default function GalleryShareButton({
  mediaId,
  className = '',
  showLabel = false,
}: GalleryShareButtonProps) {
  const [shared, setShared] = useState(false);
  const [sharing, setSharing] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  function showSharedState() {
    setShared(true);

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = setTimeout(() => {
      setShared(false);
    }, 2000);
  }

  async function shareMedia() {
    if (sharing) return;

    const url = `${window.location.origin}/gallery/${mediaId}`;

    try {
      setSharing(true);

      if (typeof navigator.share === 'function') {
        await navigator.share({
          title: "OASIS'26 Gallery",
          text: "A beautiful moment from OASIS'26.",
          url,
        });

        showSharedState();
        return;
      }

      if (
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === 'function'
      ) {
        await navigator.clipboard.writeText(url);
        showSharedState();
        return;
      }

      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();

      const copied = document.execCommand('copy');
      textarea.remove();

      if (!copied) {
        throw new Error('Unable to copy gallery link.');
      }

      showSharedState();
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === 'AbortError'
      ) {
        return;
      }

      console.error('Gallery share error:', error);
    } finally {
      setSharing(false);
    }
  }

  const sharedLabel = shared ? 'Link copied' : 'Share';

  return (
    <button
      type="button"
      onClick={() => void shareMedia()}
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full text-white shadow-sm backdrop-blur-md transition disabled:cursor-not-allowed disabled:opacity-60 ${
        showLabel
          ? 'px-3 sm:px-3.5'
          : 'h-8 w-8 sm:h-9 sm:w-9'
      } ${className}`}
      aria-label={shared ? 'Gallery link copied' : 'Share gallery item'}
      title={shared ? 'Link copied' : 'Share'}
      disabled={sharing}
    >
      {shared ? (
        <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      ) : (
        <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      )}
      {showLabel && (
        <span>{sharedLabel}</span>
      )}
    </button>
  );
}
