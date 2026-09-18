// src/app/gallery/page.tsx

'use client';

import Image from 'next/image';
import {
  Camera,
  Check,
  ChevronDown,
  LockKeyhole,
  RefreshCw,
  Trash2,
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
import {
  useRouter,
  useSearchParams,
} from 'next/navigation';

import GalleryCamera from '@/components/gallery/gallery-camera';
import GalleryGrid from '@/components/gallery/gallery-grid';
import GalleryMediaViewer from '@/components/gallery/gallery-media-viewer';
import {
  useGalleryUpload,
} from '@/components/gallery/gallery-upload-provider';
import type { GalleryItem } from '@/components/gallery/gallery-card';

type GallerySection =
  | 'pre-wedding'
  | 'live';

type SelectedGalleryFile = {
  id: string;
  file: File;
  previewUrl: string;
};

const MAX_SELECTION_COUNT = 25;

const MAX_IMAGE_SIZE =
  40 * 1024 * 1024;

const MAX_VIDEO_SIZE =
  80 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES =
  new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
  ]);

const ALLOWED_VIDEO_TYPES =
  new Set([
    'video/mp4',
    'video/webm',
    'video/quicktime',
  ]);

const PREWEDDING_UPLOAD_TOKEN =
  process.env
    .NEXT_PUBLIC_PREWEDDING_UPLOAD_TOKEN?.trim() ?? '';

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

  const {
    startUpload,
    isUploading,
  } = useGalleryUpload();

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
    const frameId =
      window.requestAnimationFrame(() => {
        setMounted(true);
      });

    return () => {
      window.cancelAnimationFrame(
        frameId,
      );
    };
  }, []);

  useEffect(() => {
    function handleUploadComplete(
      event: Event,
    ) {
      const customEvent =
        event as CustomEvent<{
          sections?: GallerySection[];
        }>;

      const uploadedSections =
        customEvent.detail
          ?.sections ?? [];

      if (
        uploadedSections.includes(
          section,
        )
      ) {
        router.refresh();

        setRefreshKey(
          (current) =>
            current + 1,
        );
      }
    }

    window.addEventListener(
      'gallery-upload-complete',
      handleUploadComplete,
    );

    return () => {
      window.removeEventListener(
        'gallery-upload-complete',
        handleUploadComplete,
      );
    };
  }, [
    section,
    router,
  ]);

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
        {/* HEADER                                                  */}
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
        {/* GALLERY                                                  */}
        {/* ===================================================== */}

        <div className="mt-5 sm:mt-7">
          <GalleryGrid
            section={section}
            refreshKey={refreshKey}
            onOpen={
              setViewerItem
            }
          />
        </div>
      </div>

      {/* ======================================================= */}
      {/* FLOATING ACTION BUTTONS                                  */}
      {/* ======================================================= */}

      {mounted &&
        createPortal(
          <div
            className="pointer-events-none fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-4 z-[2147483646] flex flex-col items-center gap-2 sm:bottom-[calc(1.75rem+env(safe-area-inset-bottom))] sm:right-6"
          >
            {section ===
              'live' && (
              <button
                type="button"
                onClick={() =>
                  setCameraOpen(
                    true,
                  )
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
                setUploadOpen(
                  true,
                )
              }
              disabled={
                isUploading
              }
              className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-wine text-white shadow-[0_8px_24px_rgba(0,0,0,0.16)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.2)] disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:w-14"
              aria-label={
                section ===
                'pre-wedding'
                  ? 'Upload pre-wedding photo'
                  : 'Upload photo or video'
              }
              title={
                section ===
                'pre-wedding'
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
      {/* MODALS                                                   */}
      {/* ======================================================= */}

      {cameraOpen &&
        section ===
          'live' && (
          <GalleryCamera
            onUploaded={
              refreshPage
            }
            onClose={() =>
              setCameraOpen(
                false,
              )
            }
          />
        )}

      {viewerItem && (
        <GalleryMediaViewer
          item={
            viewerItem
          }
          onClose={() =>
            setViewerItem(
              null,
            )
          }
        />
      )}

      {uploadOpen && (
        <GalleryUploadModal
          section={section}
          onClose={() =>
            setUploadOpen(
              false,
            )
          }
          onStartUpload={(
            files,
          ) => {
            const started =
              startUpload(
                section,
                files,
              );

            if (started) {
              setUploadOpen(
                false,
              );
            }

            return started;
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
  onStartUpload: (
    files: Array<{
      id: string;
      file: File;
    }>,
  ) => boolean;
};

function GalleryUploadModal({
  section,
  onClose,
  onStartUpload,
}: GalleryUploadModalProps) {
  const isPreWedding =
    section === 'pre-wedding';

  const [files, setFiles] =
    useState<SelectedGalleryFile[]>(
      [],
    );

  const [selectedIds, setSelectedIds] =
    useState<Set<string>>(
      new Set(),
    );

  const [tokenValue, setTokenValue] =
    useState('');

  const [error, setError] =
    useState('');

  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const replaceInputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const replaceTargetIdRef =
    useRef<string | null>(
      null,
    );

  const previewUrlsRef =
    useRef<Set<string>>(
      new Set(),
    );

  useEffect(() => {
    const previewUrls =
      previewUrlsRef.current;

    return () => {
      previewUrls.forEach(
        (url) => {
          URL.revokeObjectURL(
            url,
          );
        },
      );

      previewUrls.clear();
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key === 'Escape'
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
  }, [onClose]);

  function validateFile(
    selectedFile: File,
  ): string | null {
    const isVideo =
      selectedFile.type.startsWith(
        'video/',
      );

    if (
      isPreWedding &&
      isVideo
    ) {
      return 'Videos are not allowed in the pre-wedding gallery.';
    }

    if (
      !isPreWedding &&
      isVideo &&
      !ALLOWED_VIDEO_TYPES.has(
        selectedFile.type,
      )
    ) {
      return 'Please select an MP4, WebM, or MOV video.';
    }

    if (
      !isVideo &&
      !ALLOWED_IMAGE_TYPES.has(
        selectedFile.type,
      )
    ) {
      return 'Please select a JPEG, PNG, WebP, HEIC, or HEIF image.';
    }

    const maxSize =
      isVideo
        ? MAX_VIDEO_SIZE
        : MAX_IMAGE_SIZE;

    if (
      selectedFile.size >
      maxSize
    ) {
      return isVideo
        ? 'This video is too large. The maximum video size is 80 MB.'
        : 'This image is too large. The maximum image size is 40 MB.';
    }

    return null;
  }

  function createSelectedFile(
    selectedFile: File,
    id?: string,
  ): SelectedGalleryFile {
    const previewUrl =
      URL.createObjectURL(
        selectedFile,
      );

    previewUrlsRef.current.add(
      previewUrl,
    );

    return {
      id:
        id ??
        crypto.randomUUID(),
      file: selectedFile,
      previewUrl,
    };
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function handleFileSelection(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const incomingFiles =
      Array.from(
        event.target.files ??
          [],
      );

    event.currentTarget.value =
      '';

    if (
      !incomingFiles.length
    ) {
      return;
    }

    const remainingSlots =
      MAX_SELECTION_COUNT -
      files.length;

    if (
      incomingFiles.length >
      remainingSlots
    ) {
      setError(
        remainingSlots > 0
          ? `You can add only ${remainingSlots} more file${
              remainingSlots === 1
                ? ''
                : 's'
            }. The maximum is ${MAX_SELECTION_COUNT}.`
          : `You have already selected the maximum of ${MAX_SELECTION_COUNT} files.`,
      );

      return;
    }

    const acceptedFiles: SelectedGalleryFile[] =
      [];

    const errors: string[] =
      [];

    incomingFiles.forEach(
      (selectedFile) => {
        const validationError =
          validateFile(
            selectedFile,
          );

        if (
          validationError
        ) {
          errors.push(
            `${selectedFile.name}: ${validationError}`,
          );

          return;
        }

        acceptedFiles.push(
          createSelectedFile(
            selectedFile,
          ),
        );
      },
    );

    if (
      acceptedFiles.length
    ) {
      setFiles(
        (current) => [
          ...current,
          ...acceptedFiles,
        ],
      );

      setSelectedIds(
        new Set(),
      );
    }

    if (errors.length) {
      setError(
        errors.length === 1
          ? errors[0]
          : `${errors.length} files could not be added. Check the selected files.`,
      );
    } else {
      setError('');
    }
  }

  function removeFile(
    id: string,
  ) {
    const target =
      files.find(
        (item) =>
          item.id === id,
      );

    if (target) {
      URL.revokeObjectURL(
        target.previewUrl,
      );

      previewUrlsRef.current.delete(
        target.previewUrl,
      );
    }

    setFiles(
      (current) =>
        current.filter(
          (item) =>
            item.id !== id,
        ),
    );

    setSelectedIds(
      (current) => {
        const next =
          new Set(current);

        next.delete(id);

        return next;
      },
    );

    setError('');
  }

  function removeSelectedFiles() {
    if (
      selectedIds.size === 0
    ) {
      return;
    }

    files.forEach(
      (item) => {
        if (
          selectedIds.has(
            item.id,
          )
        ) {
          URL.revokeObjectURL(
            item.previewUrl,
          );

          previewUrlsRef.current.delete(
            item.previewUrl,
          );
        }
      },
    );

    setFiles(
      (current) =>
        current.filter(
          (item) =>
            !selectedIds.has(
              item.id,
            ),
        ),
    );

    setSelectedIds(
      new Set(),
    );

    setError('');
  }

  function toggleSelected(
    id: string,
  ) {
    setSelectedIds(
      (current) => {
        const next =
          new Set(current);

        if (
          next.has(id)
        ) {
          next.delete(id);
        } else {
          next.add(id);
        }

        return next;
      },
    );
  }

  function selectAll() {
    setSelectedIds(
      new Set(
        files.map(
          (item) => item.id,
        ),
      ),
    );
  }

  function clearSelection() {
    setSelectedIds(
      new Set(),
    );
  }

  function openReplacePicker(
    id: string,
  ) {
    replaceTargetIdRef.current =
      id;

    if (
      replaceInputRef.current
    ) {
      replaceInputRef.current.value =
        '';

      replaceInputRef.current.click();
    }
  }

  function handleReplaceSelection(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const replacement =
      event.target.files?.[0] ??
      null;

    event.currentTarget.value =
      '';

    const targetId =
      replaceTargetIdRef.current;

    replaceTargetIdRef.current =
      null;

    if (
      !replacement ||
      !targetId
    ) {
      return;
    }

    const validationError =
      validateFile(
        replacement,
      );

    if (
      validationError
    ) {
      setError(
        `${replacement.name}: ${validationError}`,
      );

      return;
    }

    const target =
      files.find(
        (item) =>
          item.id ===
          targetId,
      );

    if (!target) {
      return;
    }

    URL.revokeObjectURL(
      target.previewUrl,
    );

    previewUrlsRef.current.delete(
      target.previewUrl,
    );

    const replacementItem =
      createSelectedFile(
        replacement,
        targetId,
      );

    setFiles(
      (current) =>
        current.map(
          (item) =>
            item.id ===
            targetId
              ? replacementItem
              : item,
        ),
    );

    setSelectedIds(
      (current) => {
        const next =
          new Set(current);

        next.delete(
          targetId,
        );

        return next;
      },
    );

    setError('');
  }

  function clearFiles() {
    files.forEach(
      (item) => {
        URL.revokeObjectURL(
          item.previewUrl,
        );

        previewUrlsRef.current.delete(
          item.previewUrl,
        );
      },
    );

    setFiles([]);
    setSelectedIds(
      new Set(),
    );
    setError('');
  }

  function isTokenValid() {
    if (!isPreWedding) {
      return true;
    }

    const suppliedToken =
      tokenValue.trim();

    return (
      suppliedToken.length >
        0 &&
      PREWEDDING_UPLOAD_TOKEN.length >
        0 &&
      suppliedToken ===
        PREWEDDING_UPLOAD_TOKEN
    );
  }

  function upload() {
    if (!files.length) {
      setError(
        isPreWedding
          ? 'Please select at least one photograph.'
          : 'Please select at least one photo or video.',
      );

      return;
    }

    if (
      files.length >
      MAX_SELECTION_COUNT
    ) {
      setError(
        `You can upload a maximum of ${MAX_SELECTION_COUNT} files at a time.`,
      );

      return;
    }

    /*
     * Pre-wedding token is confirmed locally
     * BEFORE the upload manager sends anything
     * to the API.
     */
    if (
      isPreWedding &&
      !isTokenValid()
    ) {
      setError(
        PREWEDDING_UPLOAD_TOKEN
          ? 'Invalid pre-wedding upload token.'
          : 'The pre-wedding upload token is not configured.',
      );

      return;
    }

    const started =
      onStartUpload(
        files.map(
          (item) => ({
            id: item.id,
            file: item.file,
          }),
        ),
      );

    if (!started) {
      setError(
        'Another upload is already in progress. Please wait until it is complete.',
      );
    }
  }

  const selectedCount =
    selectedIds.size;

  const canAddMore =
    files.length <
    MAX_SELECTION_COUNT;

  const allSelected =
    files.length > 0 &&
    selectedIds.size ===
      files.length;

  const isVideoFile =
    (file: File) =>
      file.type.startsWith(
        'video/',
      );

  if (
    typeof document ===
    'undefined'
  ) {
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
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="relative my-auto w-full max-w-2xl overflow-hidden rounded-[22px] border border-sand-dark/70 bg-cream shadow-2xl sm:rounded-[26px]">

        {/* ===================================================== */}
        {/* HEADER                                                  */}
        {/* ===================================================== */}

        <div className="relative overflow-hidden bg-wine px-4 pb-4 pt-4 text-white sm:px-5 sm:pb-5 sm:pt-5">
          <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-gold/10" />

          <div className="pointer-events-none absolute -bottom-14 -left-8 h-28 w-28 rounded-full bg-emerald/10" />

          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-[family-name:var(--font-cormorant)] text-xl font-semibold leading-none sm:text-2xl">
                {isPreWedding
                  ? 'Pre-Wedding Memories'
                  : 'Share Your Memories'}
              </h2>

              <p className="mt-1 text-[9px] leading-3.5 text-white/65 sm:text-[10px] sm:leading-4">
                {isPreWedding
                  ? `Select up to ${MAX_SELECTION_COUNT} photographs. Review, replace or remove anything before uploading.`
                  : `Select up to ${MAX_SELECTION_COUNT} photos or videos. Review, replace or remove anything before uploading.`}
              </p>
            </div>

            <button
              type="button"
              onClick={
                onClose
              }
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Close upload"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* ===================================================== */}
        {/* CONTENT                                                 */}
        {/* ===================================================== */}

        <div className="p-3.5 sm:p-4">

          {/* =================================================== */}
          {/* TOKEN                                                  */}
          {/* =================================================== */}

          {isPreWedding && (
            <div className="mb-2.5 rounded-[16px] border border-sand-dark/70 bg-white p-2.5">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-wine/10 text-wine">
                  <LockKeyhole className="h-3 w-3" />
                </div>

                <div className="min-w-0">
                  <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-wine">
                    Private upload
                  </p>

                  <p className="mt-0.5 text-[8px] leading-3.5 text-ink-soft">
                    Enter the upload token to continue.
                  </p>
                </div>
              </div>

              <input
                type="text"
                value={
                  tokenValue
                }
                onChange={(
                  event,
                ) => {
                  setTokenValue(
                    event.target
                      .value,
                  );

                  setError('');
                }}
                placeholder="Private upload token"
                autoComplete="off"
                spellCheck={
                  false
                }
                className="mt-2 w-full rounded-lg border border-sand-dark/70 bg-cream px-3 py-2 text-[10px] text-ink outline-none transition placeholder:text-ink-soft/50 focus:border-wine"
              />
            </div>
          )}

          {/* =================================================== */}
          {/* SELECTION TOOLBAR                                    */}
          {/* =================================================== */}

          {files.length >
          0 ? (
            <>
              <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 rounded-[15px] border border-sand-dark/70 bg-white px-2.5 py-2">
                <div className="min-w-0">
                  <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-wine">
                    {files.length} /{' '}
                    {
                      MAX_SELECTION_COUNT
                    }{' '}
                    selected
                  </p>

                  <p className="mt-0.5 text-[7px] text-ink-soft">
                    Check items to remove them, or replace individual items before uploading.
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  {!allSelected && (
                    <button
                      type="button"
                      onClick={
                        selectAll
                      }
                      className="rounded-full border border-sand-dark/70 bg-cream px-2 py-1.5 text-[7px] font-bold uppercase tracking-[0.08em] text-ink-soft transition hover:bg-sand"
                    >
                      Select all
                    </button>
                  )}

                  {allSelected && (
                    <button
                      type="button"
                      onClick={
                        clearSelection
                      }
                      className="rounded-full border border-sand-dark/70 bg-cream px-2 py-1.5 text-[7px] font-bold uppercase tracking-[0.08em] text-ink-soft transition hover:bg-sand"
                    >
                      Clear
                    </button>
                  )}

                  {selectedCount >
                    0 && (
                    <button
                      type="button"
                      onClick={
                        removeSelectedFiles
                      }
                      className="inline-flex items-center gap-1 rounded-full bg-wine px-2 py-1.5 text-[7px] font-bold uppercase tracking-[0.08em] text-white transition hover:bg-wine/90"
                    >
                      <Trash2 className="h-2.5 w-2.5" />
                      Remove{' '}
                      {
                        selectedCount
                      }
                    </button>
                  )}
                </div>
              </div>

              {/* ================================================= */}
              {/* PREVIEW GRID                                       */}
              {/* ================================================= */}

              <div className="max-h-[54vh] overflow-y-auto rounded-[18px] border border-sand-dark/70 bg-white p-2.5 sm:p-3">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {files.map(
                    (item) => {
                      const isVideo =
                        isVideoFile(
                          item.file,
                        );

                      const checked =
                        selectedIds.has(
                          item.id,
                        );

                      return (
                        <div
                          key={
                            item.id
                          }
                          className={`group relative overflow-hidden rounded-[14px] border bg-white transition ${
                            checked
                              ? 'border-wine ring-2 ring-wine/15'
                              : 'border-sand-dark/60'
                          }`}
                        >
                          <div className="relative aspect-square overflow-hidden bg-ink">
                            {isVideo ? (
                              <video
                                src={
                                  item.previewUrl
                                }
                                muted
                                playsInline
                                controls
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Image
                                src={
                                  item.previewUrl
                                }
                                alt={
                                  item
                                    .file
                                    .name
                                }
                                fill
                                unoptimized
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className="object-cover"
                              />
                            )}

                            <label className="absolute left-2 top-2 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-ink/65 backdrop-blur">
                              <input
                                type="checkbox"
                                checked={
                                  checked
                                }
                                onChange={() =>
                                  toggleSelected(
                                    item.id,
                                  )
                                }
                                className="h-3.5 w-3.5 accent-wine"
                                aria-label={`Select ${item.file.name}`}
                              />
                            </label>

                            <button
                              type="button"
                              onClick={() =>
                                removeFile(
                                  item.id,
                                )
                              }
                              className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-ink/65 text-white backdrop-blur transition hover:bg-ink"
                              aria-label={`Remove ${item.file.name}`}
                            >
                              <X className="h-3 w-3" />
                            </button>

                            <div className="absolute bottom-2 left-2 rounded-full bg-ink/65 px-2 py-1 text-[6px] font-bold uppercase tracking-[0.08em] text-white backdrop-blur">
                              {isVideo
                                ? 'Video'
                                : 'Photo'}
                            </div>
                          </div>

                          <div className="p-2">
                            <p className="truncate text-[8px] font-semibold text-ink">
                              {
                                item
                                  .file
                                  .name
                              }
                            </p>

                            <p className="mt-0.5 text-[7px] text-ink-soft">
                              {formatFileSize(
                                item
                                  .file
                                  .size,
                              )}
                            </p>

                            <button
                              type="button"
                              onClick={() =>
                                openReplacePicker(
                                  item.id,
                                )
                              }
                              className="mt-2 inline-flex w-full items-center justify-center gap-1 rounded-full border border-sand-dark/70 bg-cream px-2 py-1.5 text-[7px] font-bold uppercase tracking-[0.08em] text-ink-soft transition hover:bg-sand"
                            >
                              <RefreshCw className="h-2.5 w-2.5" />
                              Replace
                            </button>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </>
          ) : (
            /* ================================================= */
            /* EMPTY SELECTION                                   */
            /* ================================================= */

            <label
              onClick={
                openFilePicker
              }
              className="group flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-[18px] border border-dashed border-sand-dark/80 bg-white px-4 py-8 text-center transition hover:border-wine/50 hover:bg-white/80"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-wine/10 text-wine transition group-hover:scale-105">
                <Upload className="h-4 w-4" />
              </span>

              <span className="mt-2.5 font-[family-name:var(--font-cormorant)] text-lg font-semibold text-wine sm:text-xl">
                Choose your memory
              </span>

              <span className="mt-0.5 text-[9px] leading-4 text-ink-soft">
                {isPreWedding
                  ? `Select up to ${MAX_SELECTION_COUNT} photographs`
                  : `Select up to ${MAX_SELECTION_COUNT} photos or videos`}
              </span>

              <span className="mt-2.5 rounded-full bg-cream px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.12em] text-emerald">
                {isPreWedding
                  ? 'Photos only'
                  : 'Photos & videos'}
              </span>
            </label>
          )}

          {/* =================================================== */}
          {/* FILE INPUTS                                           */}
          {/* =================================================== */}

          <input
            ref={
              fileInputRef
            }
            type="file"
            multiple
            accept={
              isPreWedding
                ? 'image/jpeg,image/png,image/webp,image/heic,image/heif'
                : 'image/jpeg,image/png,image/webp,image/heic,image/heif,video/mp4,video/webm,video/quicktime'
            }
            onChange={
              handleFileSelection
            }
            className="sr-only"
          />

          <input
            ref={
              replaceInputRef
            }
            type="file"
            accept={
              isPreWedding
                ? 'image/jpeg,image/png,image/webp,image/heic,image/heif'
                : 'image/jpeg,image/png,image/webp,image/heic,image/heif,video/mp4,video/webm,video/quicktime'
            }
            onChange={
              handleReplaceSelection
            }
            className="sr-only"
          />

          {/* =================================================== */}
          {/* ADD MORE                                             */}
          {/* =================================================== */}

          {files.length >
            0 && (
            <div className="mt-2.5 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={
                  clearFiles
                }
                className="inline-flex items-center gap-1 rounded-full border border-sand-dark/70 bg-white px-2.5 py-1.5 text-[7px] font-bold uppercase tracking-[0.08em] text-ink-soft transition hover:bg-sand"
              >
                <Trash2 className="h-2.5 w-2.5" />
                Clear all
              </button>

              {canAddMore ? (
                <button
                  type="button"
                  onClick={
                    openFilePicker
                  }
                  className="inline-flex items-center gap-1 rounded-full border border-wine/30 bg-wine/5 px-2.5 py-1.5 text-[7px] font-bold uppercase tracking-[0.08em] text-wine transition hover:bg-wine/10"
                >
                  <Upload className="h-2.5 w-2.5" />
                  Add more
                </button>
              ) : (
                <span className="text-[7px] font-bold uppercase tracking-[0.08em] text-emerald">
                  Maximum reached
                </span>
              )}
            </div>
          )}

          {/* =================================================== */}
          {/* ERROR                                                 */}
          {/* =================================================== */}

          {error && (
            <div className="mt-2.5 rounded-[14px] bg-wine/5 px-3 py-2">
              <p className="text-[8px] leading-3.5 text-wine">
                {error}
              </p>
            </div>
          )}

          {/* =================================================== */}
          {/* FOOTER                                                */}
          {/* =================================================== */}

          <div className="mt-3 flex gap-1.5">
            <button
              type="button"
              onClick={
                onClose
              }
              className="flex-1 rounded-full border border-sand-dark/70 bg-white px-2 py-2.5 text-[8px] font-bold uppercase tracking-[0.1em] text-ink-soft transition hover:bg-sand"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={
                upload
              }
              disabled={
                files.length ===
                  0 ||
                (isPreWedding &&
                  !tokenValue.trim())
              }
              className="flex flex-[1.5] items-center justify-center gap-1 rounded-full bg-wine px-2 py-2.5 text-[8px] font-bold uppercase tracking-[0.1em] text-white shadow-sm transition hover:bg-wine/90 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <Check className="h-3 w-3" />

              {isPreWedding
                ? `Upload ${
                    files.length
                  } ${
                    files.length ===
                    1
                      ? 'Photograph'
                      : 'Photographs'
                  }`
                : `Upload ${
                    files.length
                  } ${
                    files.length ===
                    1
                      ? 'Memory'
                      : 'Memories'
                  }`}
            </button>
          </div>

          <div className="mt-2 flex items-center justify-center gap-1.5 text-center text-[7px] leading-3.5 text-ink-soft/70">
            <ChevronDown className="h-2.5 w-2.5" />

            <span>
              You can review, replace or remove any selected item before uploading.
            </span>
          </div>
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

  if (
    bytes <
    1024 * 1024
  ) {
    return `${(
      bytes /
      1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}