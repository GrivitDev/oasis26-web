// src/components/gallery/gallery-upload-provider.tsx

'use client';

import {
  Check,
  ChevronDown,
  LoaderCircle,
  X,
} from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import {
  completeGalleryUpload,
  requestGalleryUploadSignature,
  uploadGalleryFileToCloudinary,
} from '@/lib/gallery-upload-client';
import {
  MAX_SELECTION_COUNT,
  validateGalleryUploadFile,
} from '@/lib/gallery';

type GallerySection =
  | 'pre-wedding'
  | 'live';

type UploadItemStatus =
  | 'queued'
  | 'uploading'
  | 'processing'
  | 'completed'
  | 'failed';

type UploadItem = {
  id: string;
  name: string;
  size: number;
  status: UploadItemStatus;
  progress: number;
  error?: string;
};

type UploadQueueItem = {
  id: string;
  file: File;
  section: GallerySection;
  uploadToken?: string;
  status: UploadItemStatus;
  progress: number;
};

type GalleryUploadContextValue = {
  isUploading: boolean;
  startUpload: (
    section: GallerySection,
    files: Array<{ id: string; file: File }>,
    uploadToken?: string,
  ) => boolean;
};

const GalleryUploadContext =
  createContext<GalleryUploadContextValue | undefined>(undefined);

const MAX_CONCURRENT_UPLOADS = 2;

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function GalleryUploadStatusBar({
  items,
  uploading,
  finished,
  overallProgress,
  completedCount,
  failedCount,
  onClose,
}: {
  items: UploadItem[];
  uploading: boolean;
  finished: boolean;
  overallProgress: number;
  completedCount: number;
  failedCount: number;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  if (!items.length) return null;

  const currentItem =
    items.find((item) => item.status === 'uploading') ??
    items.find((item) => item.status === 'processing') ??
    items.find((item) => item.status === 'queued');

  const title = uploading
    ? 'Uploading memories'
    : finished
      ? failedCount > 0
        ? 'Upload finished with errors'
        : 'Upload complete'
      : 'Upload';

  const subtitle = uploading
    ? currentItem
      ? currentItem.status === 'processing'
        ? `Saving ${currentItem.name}`
        : currentItem.name
      : `${completedCount} of ${items.length} completed`
    : finished
      ? `${completedCount} of ${items.length} uploaded successfully${
          failedCount > 0 ? ` • ${failedCount} failed` : ''
        }`
      : `${completedCount} of ${items.length} completed`;

  return (
    <div className="pointer-events-none fixed left-3 top-[calc(4.5rem+env(safe-area-inset-top))] z-[2147483647] w-[calc(100%-1.5rem)] max-w-lg sm:left-5 sm:top-[5.25rem] sm:w-[calc(100%-2.5rem)]">
      <div className="pointer-events-auto overflow-hidden rounded-[18px] border border-sand-dark/70 bg-cream shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        <div className="flex items-center gap-2.5 px-3 py-2.5 sm:px-3.5 sm:py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-wine/10 text-wine">
            {finished ? (
              <Check className="h-4 w-4" />
            ) : (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            )}
          </div>

          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="min-w-0 flex-1 text-left"
            aria-expanded={expanded}
          >
            <div className="flex items-center gap-1.5">
              <p className="truncate text-[9px] font-bold uppercase tracking-[0.1em] text-wine">
                {title}
              </p>
              <ChevronDown
                className={`h-3 w-3 shrink-0 text-ink-soft transition-transform duration-200 ${
                  expanded ? 'rotate-180' : ''
                }`}
              />
            </div>
            <p className="mt-0.5 truncate text-[8px] text-ink-soft">
              {subtitle}
            </p>
          </button>

          <div className="shrink-0 text-right">
            <p className="text-[10px] font-bold text-wine">
              {overallProgress}%
            </p>
            <p className="text-[6px] font-semibold uppercase tracking-[0.08em] text-ink-soft">
              {completedCount}/{items.length}
            </p>
          </div>

          {finished && (
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink-soft transition hover:bg-wine/10 hover:text-wine"
              aria-label="Close upload status"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="h-1 bg-sand">
          <div
            className={`h-full transition-all duration-200 ${
              finished && failedCount === 0 ? 'bg-emerald' : 'bg-wine'
            }`}
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        {expanded && (
          <div className="border-t border-sand-dark/50 bg-white/65 px-2.5 py-2.5">
            <div className="max-h-[45vh] space-y-1.5 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[12px] border border-sand-dark/40 bg-cream/65 px-2.5 py-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[8px] font-semibold text-ink">
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-[6px] text-ink-soft">
                        {formatFileSize(item.size)}
                      </p>
                    </div>

                    <div className="shrink-0 text-[6px] font-bold uppercase tracking-[0.08em]">
                      {item.status === 'completed' ? (
                        <span className="text-emerald">Complete</span>
                      ) : item.status === 'failed' ? (
                        <span className="text-wine">Failed</span>
                      ) : item.status === 'processing' ? (
                        <span className="text-emerald">Saving</span>
                      ) : item.status === 'uploading' ? (
                        <span className="text-wine">{item.progress}%</span>
                      ) : (
                        <span className="text-ink-soft">Queued</span>
                      )}
                    </div>
                  </div>

                  {(item.status === 'uploading' ||
                    item.status === 'processing') && (
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-sand">
                      <div
                        className={`h-full rounded-full ${
                          item.status === 'processing'
                            ? 'animate-pulse bg-emerald'
                            : 'bg-wine'
                        }`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}

                  {item.status === 'failed' && item.error && (
                    <p className="mt-1 text-[6px] leading-3 text-wine">
                      {item.error}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {uploading && (
              <p className="mt-2 text-center text-[7px] leading-3.5 text-ink-soft">
                Uploads continue while you browse other pages. Keep this website open until they finish.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function GalleryUploadProvider({ children }: { children: ReactNode }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const [finished, setFinished] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);

  const queueRef = useRef<UploadQueueItem[]>([]);
  const processingRef = useRef(false);

  const updateState = useCallback(
    (id: string, update: Partial<UploadItem>) => {
      setUploadItems((current) =>
        current.map((item) =>
          item.id === id ? { ...item, ...update } : item,
        ),
      );

      const queueItem = queueRef.current.find((item) => item.id === id);
      if (queueItem) {
        Object.assign(queueItem, update);
      }
    },
    [],
  );

  const recalculateOverallProgress = useCallback(() => {
    const queue = queueRef.current;
    const totalBytes = queue.reduce((sum, item) => sum + item.file.size, 0);

    if (!totalBytes) {
      setOverallProgress(0);
      return;
    }

    const progressBytes = queue.reduce(
      (sum, item) => sum + item.file.size * (item.progress / 100),
      0,
    );

    setOverallProgress(Math.min(100, Math.round((progressBytes / totalBytes) * 100)));
  }, []);

  const processItem = useCallback(
    async (queueItem: UploadQueueItem) => {
      try {
        const resourceType = queueItem.file.type.startsWith('video/')
          ? 'video'
          : 'image';

        updateState(queueItem.id, {
          status: 'uploading',
          progress: 0,
          error: undefined,
        });
        recalculateOverallProgress();

        const signature = await requestGalleryUploadSignature(
          resourceType,
          queueItem.section,
          queueItem.uploadToken,
        );

        const cloudinaryResult = await uploadGalleryFileToCloudinary(
          queueItem.file,
          signature,
          (loaded, total) => {
            const progress = total > 0
              ? Math.min(99, Math.round((loaded / total) * 100))
              : 0;

            updateState(queueItem.id, {
              status: 'uploading',
              progress,
            });
            recalculateOverallProgress();
          },
        );

        updateState(queueItem.id, {
          status: 'processing',
          progress: 99,
        });
        recalculateOverallProgress();

        await completeGalleryUpload(
          queueItem.section,
          cloudinaryResult,
          queueItem.file,
          queueItem.uploadToken,
        );

        updateState(queueItem.id, {
          status: 'completed',
          progress: 100,
        });
        recalculateOverallProgress();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Unable to upload this file.';

        updateState(queueItem.id, {
          status: 'failed',
          progress: 100,
          error: message,
        });
        recalculateOverallProgress();
      }
    },
    [recalculateOverallProgress, updateState],
  );

  const processQueue = useCallback(async () => {
    if (processingRef.current) {
      return;
    }

    processingRef.current = true;

    try {
      while (true) {
        const activeCount = queueRef.current.filter(
          (item) =>
            item.status === 'uploading' || item.status === 'processing',
        ).length;

        const queued = queueRef.current.filter(
          (item) => item.status === 'queued',
        );

        if (activeCount === 0 && queued.length === 0) {
          break;
        }

        const availableSlots = Math.max(
          0,
          MAX_CONCURRENT_UPLOADS - activeCount,
        );

        const nextItems = queued.slice(0, availableSlots);

        if (!nextItems.length) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          continue;
        }

        nextItems.forEach((item) => {
          item.status = 'uploading';
        });

        await Promise.all(
          nextItems.map((item) => processItem(item)),
        );
      }
    } finally {
      processingRef.current = false;

      const hasPending = queueRef.current.some(
        (item) =>
          item.status === 'queued' ||
          item.status === 'uploading' ||
          item.status === 'processing',
      );

      if (hasPending) {
        void processQueue();
        return;
      }

      setOverallProgress(100);
      setIsUploading(false);
      setFinished(true);

      const completedCount = queueRef.current.filter(
        (item) => item.status === 'completed',
      ).length;

      const failedCount = queueRef.current.filter(
        (item) => item.status === 'failed',
      ).length;

      const sections = Array.from(
        new Set(queueRef.current.map((item) => item.section)),
      );

      window.dispatchEvent(
        new CustomEvent('gallery-upload-complete', {
          detail: {
            sections,
            completedCount,
            failedCount,
          },
        }),
      );
    }
  }, [processItem]);

  const startUpload = useCallback(
    (
      section: GallerySection,
      files: Array<{ id: string; file: File }>,
      uploadToken?: string,
    ): boolean => {
      if (!files.length || files.length > MAX_SELECTION_COUNT) {
        return false;
      }

      const invalidFile = files.find((item) =>
        validateGalleryUploadFile(item.file, section),
      );

      if (invalidFile) {
        console.error(
          `${invalidFile.file.name}: ${validateGalleryUploadFile(
            invalidFile.file,
            section,
          )}`,
        );
        return false;
      }

      if (
        section === 'pre-wedding' &&
        !uploadToken?.trim()
      ) {
        return false;
      }

      const queueItems: UploadQueueItem[] = files.map((item) => ({
        id: item.id,
        file: item.file,
        section,
        uploadToken: uploadToken?.trim() || undefined,
        status: 'queued',
        progress: 0,
      }));

      const wasIdle = !isUploading;

      if (wasIdle) {
        setUploadItems(
          queueItems.map((item) => ({
            id: item.id,
            name: item.file.name,
            size: item.file.size,
            status: 'queued',
            progress: 0,
          })),
        );
        setOverallProgress(0);
        setFinished(false);
        queueRef.current = queueItems;
      } else {
        setUploadItems((current) => [
          ...current,
          ...queueItems.map((item) => ({
            id: item.id,
            name: item.file.name,
            size: item.file.size,
            status: 'queued' as const,
            progress: 0,
          })),
        ]);
        queueRef.current = [
          ...queueRef.current,
          ...queueItems,
        ];
      }

      setIsUploading(true);
      void processQueue();
      return true;
    },
    [isUploading, processQueue],
  );

  const closeFinishedStatus = useCallback(() => {
    if (isUploading) {
      return;
    }

    setUploadItems([]);
    setFinished(false);
    setOverallProgress(0);
    queueRef.current = [];
  }, [isUploading]);

  return (
    <GalleryUploadContext.Provider
      value={{ isUploading, startUpload }}
    >
      {children}

      <GalleryUploadStatusBar
        items={uploadItems}
        uploading={isUploading}
        finished={finished}
        overallProgress={overallProgress}
        completedCount={uploadItems.filter(
          (item) => item.status === 'completed',
        ).length}
        failedCount={uploadItems.filter(
          (item) => item.status === 'failed',
        ).length}
        onClose={closeFinishedStatus}
      />
    </GalleryUploadContext.Provider>
  );
}

export function useGalleryUpload() {
  const context = useContext(GalleryUploadContext);

  if (!context) {
    throw new Error(
      'useGalleryUpload must be used inside GalleryUploadProvider.',
    );
  }

  return context;
}
