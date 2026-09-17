'use client';

import Image from 'next/image';
import {
  Camera,
  Check,
  LockKeyhole,
  Upload,
  X,
} from 'lucide-react';
import {
  Suspense,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useRouter, useSearchParams } from 'next/navigation';

import GalleryCamera from '@/components/gallery/gallery-camera';
import GalleryGrid from '@/components/gallery/gallery-grid';
import GalleryMediaViewer from '@/components/gallery/gallery-media-viewer';
import type { GalleryItem } from '@/components/gallery/gallery-card';

type GallerySection =
  | 'pre-wedding'
  | 'live';

export default function GalleryPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-cream px-3 pb-8 pt-20 sm:px-5 sm:pb-10 sm:pt-24">
          <div className="flex min-h-40 items-center justify-center">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-sand-dark border-t-wine" />
          </div>
        </main>
      }
    >
      <GalleryPageContent />
    </Suspense>
  );
}

function GalleryPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sectionParam =
    searchParams.get('section');

  const section: GallerySection =
    sectionParam === 'pre-wedding'
      ? 'pre-wedding'
      : 'live';

  const [cameraOpen, setCameraOpen] =
    useState(false);

  const [refreshKey, setRefreshKey] =
    useState(0);

  const [viewerItem, setViewerItem] =
    useState<GalleryItem | null>(
      null,
    );

  const [uploadOpen, setUploadOpen] =
    useState(false);

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  function refreshPage() {
    router.refresh();
    setRefreshKey(
      (current) => current + 1,
    );
  }

  const galleryTitle =
    section === 'pre-wedding'
      ? 'Pre-Wedding'
      : 'Live Gallery';

  return (
    <main className="min-h-screen bg-cream px-3 pb-8 pt-20 sm:px-5 sm:pb-10 sm:pt-24">
      <div className="mx-auto max-w-6xl">

        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <header className="mx-auto max-w-xl text-center">
          <h1 className="font-[family-name:var(--font-cormorant)] text-3xl font-semibold leading-none text-wine sm:text-4xl">
            Our Gallery
          </h1>

          <p className="mt-1 font-[family-name:var(--font-cormorant)] text-xl font-semibold leading-none text-emerald sm:mt-1.5 sm:text-2xl">
            {galleryTitle}
          </p>

          <p className="mx-auto mt-1.5 max-w-md text-[10px] leading-4 text-ink-soft sm:mt-2 sm:text-xs">
            Beautiful moments, memories and
            celebrations shared together.
          </p>
        </header>

        {/* ===================================================== */}
        {/* GALLERY */}
        {/* ===================================================== */}

        <div className="mt-5 sm:mt-7">
          <GalleryGrid
            section={section}
            refreshKey={refreshKey}
            onOpen={setViewerItem}
          />
        </div>
      </div>

      {/* ======================================================= */}
      {/* FLOATING ACTION BUTTONS */}
      {/* ======================================================= */}

      {mounted &&
        createPortal(
          <div
            className="pointer-events-none fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-4 z-[2147483646] flex flex-col items-center gap-2 sm:bottom-[calc(1.75rem+env(safe-area-inset-bottom))] sm:right-6"
          >
            {section === 'live' && (
              <button
                type="button"
                onClick={() =>
                  setCameraOpen(true)
                }
                className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-emerald text-white shadow-[0_8px_24px_rgba(0,0,0,0.16)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.2)] sm:h-14 sm:w-14"
                aria-label="Open camera"
                title="Camera"
              >
                <Camera className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                setUploadOpen(true)
              }
              className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-wine text-white shadow-[0_8px_24px_rgba(0,0,0,0.16)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.2)] sm:h-14 sm:w-14"
              aria-label={
                section === 'pre-wedding'
                  ? 'Upload pre-wedding photo'
                  : 'Upload photo or video'
              }
              title={
                section === 'pre-wedding'
                  ? 'Upload photo'
                  : 'Upload'
              }
            >
              <Upload className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>,
          document.body,
        )}

      {/* ======================================================= */}
      {/* MODALS */}
      {/* ======================================================= */}

      {cameraOpen &&
        section === 'live' && (
          <GalleryCamera
            onUploaded={
              refreshPage
            }
            onClose={() =>
              setCameraOpen(false)
            }
          />
        )}

      {viewerItem && (
        <GalleryMediaViewer
          item={viewerItem}
          onClose={() =>
            setViewerItem(null)
          }
        />
      )}

      {uploadOpen && (
        <GalleryUploadModal
          section={section}
          onClose={() =>
            setUploadOpen(false)
          }
          onUploaded={() => {
            setUploadOpen(false);
            refreshPage();
          }}
        />
      )}
    </main>
  );
}

/* ============================================================= */
/* UPLOAD MODAL                                                   */
/* ============================================================= */

type GalleryUploadModalProps = {
  section:
    | 'pre-wedding'
    | 'live';
  onClose: () => void;
  onUploaded: () => void;
};

function GalleryUploadModal({
  section,
  onClose,
  onUploaded,
}: GalleryUploadModalProps) {
  const isPreWedding =
    section === 'pre-wedding';

  const [file, setFile] =
    useState<File | null>(null);

  const [token, setToken] =
    useState('');

  const [previewUrl, setPreviewUrl] =
    useState('');

  const previewUrlRef =
    useRef('');

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [progress, setProgress] =
    useState(0);

  const [processing, setProcessing] =
    useState(false);

  useEffect(() => {
    if (!file) {
      return;
    }
  }, [file]);

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key === 'Escape' &&
        !uploading
      ) {
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
  }, [onClose, uploading]);

  function handleFileChange(
    selectedFile: File | null,
  ) {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(
        previewUrlRef.current,
      );
    }

    const nextPreviewUrl = selectedFile
      ? URL.createObjectURL(selectedFile)
      : '';

    previewUrlRef.current = nextPreviewUrl;
    setFile(selectedFile);
    setPreviewUrl(nextPreviewUrl);
    setError('');
    setProgress(0);
    setProcessing(false);
  }

  function clearFile() {
    if (uploading) {
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(
        previewUrlRef.current,
      );
      previewUrlRef.current = '';
    }

    setFile(null);
    setPreviewUrl('');
    setError('');
    setProgress(0);
    setProcessing(false);
  }

  async function upload() {
    if (!file) {
      setError(
        isPreWedding
          ? 'Please select a photograph.'
          : 'Please select a photo or video.',
      );

      return;
    }

    if (
      isPreWedding &&
      !token.trim()
    ) {
      setError(
        'Please enter the private upload token.',
      );

      return;
    }

    try {
      setUploading(true);
      setProcessing(false);
      setError('');
      setProgress(0);

      const formData =
        new FormData();

      formData.append(
        'file',
        file,
      );

      formData.append(
        'section',
        section,
      );

      if (isPreWedding) {
        formData.append(
          'token',
          token.trim(),
        );
      }

      await new Promise<void>(
        (resolve, reject) => {
          const xhr =
            new XMLHttpRequest();

          xhr.open(
            'POST',
            '/api/gallery/upload',
          );

          xhr.upload.onprogress =
            (event) => {
              if (
                !event.lengthComputable
              ) {
                return;
              }

              const percentage =
                Math.round(
                  (event.loaded /
                    event.total) *
                    100,
                );

              /*
               * 100% here only means the browser
               * has finished sending the request.
               *
               * The server still needs to process
               * the file and upload it to Cloudinary.
               *
               * Therefore we deliberately stop at 99%.
               */
              setProgress(
                Math.min(
                  percentage,
                  99,
                ),
              );

              if (
                percentage >= 100
              ) {
                setProcessing(true);
              }
            };

          xhr.onload = () => {
            let response: {
              error?: string;
            } = {};

            try {
              response =
                JSON.parse(
                  xhr.responseText,
                );
            } catch {
              response = {};
            }

            if (
              xhr.status < 200 ||
              xhr.status >= 300
            ) {
              reject(
                new Error(
                  response.error ??
                    'Upload failed.',
                ),
              );

              return;
            }

            /*
             * Only show 100% after the server
             * has actually confirmed success.
             */
            setProgress(100);
            setProcessing(false);

            resolve();
          };

          xhr.onerror = () => {
            reject(
              new Error(
                'Network error while uploading.',
              ),
            );
          };

          xhr.onabort = () => {
            reject(
              new Error(
                'Upload was cancelled.',
              ),
            );
          };

          xhr.send(
            formData,
          );
        },
      );

      /*
       * Keep the success state visible briefly
       * so the user can actually see that the
       * upload completed before the page refreshes.
       */
      await new Promise<void>(
        (resolve) => {
          window.setTimeout(
            resolve,
            350,
          );
        },
      );

      onUploaded();
    } catch (error) {
      console.error(
        'Gallery upload error:',
        error,
      );

      setProcessing(false);

      setError(
        error instanceof Error
          ? error.message
          : 'Unable to upload this file.',
      );
    } finally {
      setUploading(false);
    }
  }

  const isVideo =
    file?.type.startsWith(
      'video/',
    ) ?? false;

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[2147483647] flex min-h-[100dvh] items-center justify-center overflow-y-auto bg-ink/80 p-2.5 backdrop-blur-md sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={
        isPreWedding
          ? 'Pre-Wedding Photo Upload'
          : 'Live Gallery Upload'
      }
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !uploading
        ) {
          onClose();
        }
      }}
    >
      <div className="relative my-auto w-full max-w-md overflow-hidden rounded-[22px] border border-sand-dark/70 bg-cream shadow-2xl sm:rounded-[26px]">

        {/* HEADER */}

        <div className="relative overflow-hidden bg-wine px-4 pb-4 pt-4 text-white sm:px-5 sm:pb-5 sm:pt-5">
          <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-gold/10" />

          <div className="pointer-events-none absolute -bottom-14 -left-8 h-28 w-28 rounded-full bg-emerald/10" />

          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-[family-name:var(--font-cormorant)] text-xl font-semibold leading-none sm:text-2xl">
                {isPreWedding
                  ? 'Pre-Wedding Memories'
                  : 'Share a Moment'}
              </h2>

              <p className="mt-1 text-[9px] leading-3.5 text-white/65 sm:text-[10px] sm:leading-4">
                {isPreWedding
                  ? 'Add a beautiful photograph to our pre-wedding collection.'
                  : "Share a photo or video with everyone at OASIS'26."}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Close upload"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* CONTENT */}

        <div className="p-3.5 sm:p-4">
          {!file ? (
            <label className="group flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-[18px] border border-dashed border-sand-dark/80 bg-white px-4 py-6 text-center transition hover:border-wine/50 hover:bg-white/80 sm:min-h-48">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-wine/10 text-wine transition group-hover:scale-105">
                <Upload className="h-4 w-4" />
              </span>

              <span className="mt-2.5 font-[family-name:var(--font-cormorant)] text-lg font-semibold text-wine sm:text-xl">
                Choose your memory
              </span>

              <span className="mt-0.5 text-[9px] leading-4 text-ink-soft">
                {isPreWedding
                  ? 'Select a photograph from your device'
                  : 'Choose a photo or video from your device'}
              </span>

              <span className="mt-2.5 rounded-full bg-cream px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.12em] text-emerald">
                {isPreWedding
                  ? 'Photos only'
                  : 'Photos & videos'}
              </span>

              <input
                type="file"
                accept={
                  isPreWedding
                    ? 'image/jpeg,image/png,image/webp,image/heic,image/heif'
                    : 'image/jpeg,image/png,image/webp,image/heic,image/heif,video/mp4,video/webm,video/quicktime'
                }
                disabled={uploading}
                onChange={(event) => {
                  handleFileChange(
                    event.target.files?.[0] ??
                      null,
                  );

                  event.currentTarget.value =
                    '';
                }}
                className="sr-only"
              />
            </label>
          ) : (
            <div className="overflow-hidden rounded-[18px] border border-sand-dark/70 bg-white">
              <div className="relative flex h-48 items-center justify-center overflow-hidden bg-ink sm:h-56">
                {isVideo ? (
                  <video
                    src={previewUrl}
                    controls
                    playsInline
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <Image
                    src={previewUrl}
                    alt="Selected gallery preview"
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, 420px"
                    className="object-contain"
                  />
                )}

                <button
                  type="button"
                  onClick={clearFile}
                  disabled={uploading}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink/65 text-white backdrop-blur transition hover:bg-ink disabled:opacity-40"
                  aria-label="Remove selected file"
                >
                  <X className="h-3 w-3" />
                </button>

                <div className="absolute bottom-2 left-2 rounded-full bg-ink/65 px-2 py-1 text-[7px] font-semibold text-white backdrop-blur">
                  {isVideo
                    ? 'Video preview'
                    : 'Photo preview'}
                </div>
              </div>

              <div className="p-2.5">
                <p className="truncate text-[11px] font-semibold text-ink">
                  {file.name}
                </p>

                <p className="mt-0.5 text-[8px] text-ink-soft">
                  {formatFileSize(
                    file.size,
                  )}
                </p>
              </div>
            </div>
          )}

          {isPreWedding && (
            <div className="mt-2.5 rounded-[16px] border border-sand-dark/70 bg-white p-2.5">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-wine/10 text-wine">
                  <LockKeyhole className="h-3 w-3" />
                </div>

                <div className="min-w-0">
                  <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-wine">
                    Private upload
                  </p>

                  <p className="mt-0.5 text-[8px] leading-3.5 text-ink-soft">
                    Enter the private token to continue.
                  </p>
                </div>
              </div>

              <input
                type="password"
                value={token}
                disabled={uploading}
                onChange={(event) => {
                  setToken(
                    event.target.value,
                  );

                  setError('');
                }}
                placeholder="Private upload token"
                className="mt-2 w-full rounded-lg border border-sand-dark/70 bg-cream px-3 py-2 text-[10px] text-ink outline-none transition placeholder:text-ink-soft/50 focus:border-wine"
              />
            </div>
          )}

          {uploading && (
            <div className="mt-2.5 rounded-[16px] border border-sand-dark/70 bg-white p-2.5">
              <div className="flex items-center justify-between text-[8px] font-semibold text-ink-soft">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-sand border-t-wine" />

                  {processing
                    ? 'Processing & saving...'
                    : 'Sending your memory...'}
                </span>

                <span className="text-wine">
                  {progress}%
                </span>
              </div>

              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-sand">
                <div
                  className={`h-full rounded-full bg-wine transition-all duration-200 ${
                    processing &&
                    progress < 100
                      ? 'animate-pulse'
                      : ''
                  }`}
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              {processing && (
                <p className="mt-1.5 text-[7px] leading-3 text-ink-soft">
                  Your file has been sent and is
                  now being processed. Please keep
                  this window open.
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="mt-2.5 rounded-[14px] bg-wine/5 px-3 py-2">
              <p className="text-[8px] leading-3.5 text-wine">
                {error}
              </p>
            </div>
          )}

          <div className="mt-3 flex gap-1.5">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="flex-1 rounded-full border border-sand-dark/70 bg-white px-2 py-2.5 text-[8px] font-bold uppercase tracking-[0.1em] text-ink-soft transition hover:bg-sand disabled:cursor-not-allowed disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={upload}
              disabled={
                uploading ||
                !file ||
                (isPreWedding &&
                  !token.trim())
              }
              className="flex flex-[1.5] items-center justify-center gap-1 rounded-full bg-wine px-2 py-2.5 text-[8px] font-bold uppercase tracking-[0.1em] text-white shadow-sm transition hover:bg-wine/90 disabled:cursor-not-allowed disabled:opacity-35"
            >
              {uploading ? (
                <>
                  <span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  {processing
                    ? 'Processing'
                    : 'Uploading'}
                </>
              ) : (
                <>
                  <Check className="h-3 w-3" />
                  {isPreWedding
                    ? 'Add Photograph'
                    : 'Share Memory'}
                </>
              )}
            </button>
          </div>

          {!isPreWedding && (
            <p className="mt-2 text-center text-[7px] leading-3.5 text-ink-soft/70">
              No token is required for the Live
              Gallery.
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function formatFileSize(
  bytes: number,
) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}