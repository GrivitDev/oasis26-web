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
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';

type GallerySection =
  | 'pre-wedding'
  | 'live';

type UploadSignatureResponse = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  publicId: string;
  resourceType:
    | 'image'
    | 'video';
};

type CloudinaryUploadResponse = {
  public_id: string;
  secure_url: string;
  resource_type:
    | 'image'
    | 'video';
  width?: number;
  height?: number;
  duration?: number;
};

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
};

type GalleryUploadContextValue = {
  isUploading: boolean;
  startUpload: (
    section: GallerySection,
    files: Array<{
      id: string;
      file: File;
    }>,
  ) => boolean;
};

const GalleryUploadContext =
  createContext<
    GalleryUploadContextValue | undefined
  >(undefined);

const MAX_SELECTION_COUNT = 25;

function updateItemState(
  setter: React.Dispatch<
    React.SetStateAction<UploadItem[]>
  >,
  id: string,
  update: Partial<UploadItem>,
) {
  setter((current) =>
    current.map((item) =>
      item.id === id
        ? {
            ...item,
            ...update,
          }
        : item,
    ),
  );
}

async function requestUploadSignature(
  resourceType: 'image' | 'video',
  section: GallerySection,
): Promise<UploadSignatureResponse> {
  const response =
    await fetch(
      '/api/gallery/upload',
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify({
          action: 'sign',
          section,
          resourceType,
        }),
      },
    );

  let data:
    | UploadSignatureResponse
    | { error?: string };

  try {
    data =
      await response.json();
  } catch {
    throw new Error(
      'Unable to prepare the upload.',
    );
  }

  if (!response.ok) {
    throw new Error(
      'error' in data &&
      data.error
        ? data.error
        : 'Unable to prepare the upload.',
    );
  }

  return data as UploadSignatureResponse;
}

async function uploadToCloudinary(
  file: File,
  uploadSignature: UploadSignatureResponse,
  onProgress: (
    loaded: number,
    total: number,
  ) => void,
): Promise<CloudinaryUploadResponse> {
  const resourceType =
    uploadSignature.resourceType;

  const cloudinaryFormData =
    new FormData();

  cloudinaryFormData.append(
    'file',
    file,
  );

  cloudinaryFormData.append(
    'api_key',
    uploadSignature.apiKey,
  );

  cloudinaryFormData.append(
    'timestamp',
    String(
      uploadSignature.timestamp,
    ),
  );

  cloudinaryFormData.append(
    'signature',
    uploadSignature.signature,
  );

  cloudinaryFormData.append(
    'folder',
    uploadSignature.folder,
  );

  cloudinaryFormData.append(
    'public_id',
    uploadSignature.publicId,
  );

  const cloudinaryUploadUrl =
    `https://api.cloudinary.com/v1_1/${uploadSignature.cloudName}/${resourceType}/upload`;

  return new Promise(
    (resolve, reject) => {
      const xhr =
        new XMLHttpRequest();

      xhr.open(
        'POST',
        cloudinaryUploadUrl,
      );

      xhr.upload.onprogress =
        (event) => {
          if (
            !event.lengthComputable
          ) {
            return;
          }

          onProgress(
            event.loaded,
            event.total,
          );
        };

      xhr.onload = () => {
        let response:
          | CloudinaryUploadResponse
          | {
              error?: {
                message?: string;
              };
            }
          | null = null;

        try {
          response =
            JSON.parse(
              xhr.responseText,
            );
        } catch {
          response = null;
        }

        if (
          xhr.status >= 200 &&
          xhr.status < 300 &&
          response &&
          'public_id' in response
        ) {
          resolve(
            response as CloudinaryUploadResponse,
          );

          return;
        }

        const cloudinaryError =
          response &&
          'error' in response
            ? response.error
                ?.message
            : undefined;

        reject(
          new Error(
            cloudinaryError ||
              'Cloudinary upload failed.',
          ),
        );
      };

      xhr.onerror = () => {
        reject(
          new Error(
            'Network error while uploading to Cloudinary.',
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
        cloudinaryFormData,
      );
    },
  );
}

async function completeGalleryUpload(
  section: GallerySection,
  cloudinaryResult: CloudinaryUploadResponse,
  uploadFile: File,
) {
  const response =
    await fetch(
      '/api/gallery/upload',
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify({
          action: 'complete',
          section,
          publicId:
            cloudinaryResult.public_id,
          secureUrl:
            cloudinaryResult.secure_url,
          resourceType:
            cloudinaryResult.resource_type,
          originalFilename:
            uploadFile.name,
          width:
            cloudinaryResult.width,
          height:
            cloudinaryResult.height,
          duration:
            cloudinaryResult.duration,
        }),
      },
    );

  let data:
    | {
        item?: unknown;
        error?: string;
      }
    | null = null;

  try {
    data =
      await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
        'Unable to save the gallery item.',
    );
  }

  return data;
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
  const [
    expanded,
    setExpanded,
  ] = useState(false);

  if (!items.length) {
    return null;
  }

  const currentItem =
    items.find(
      (item) =>
        item.status ===
        'uploading',
    ) ??
    items.find(
      (item) =>
        item.status ===
        'processing',
    ) ??
    items.find(
      (item) =>
        item.status ===
        'queued',
    );

  const title =
    uploading
      ? 'Uploading memories'
      : finished
        ? failedCount > 0
          ? 'Upload finished with errors'
          : 'Upload complete'
        : 'Upload';

  const subtitle =
    uploading
      ? currentItem
        ? currentItem.status ===
          'processing'
          ? `Saving ${currentItem.name}`
          : currentItem.name
        : `${completedCount} of ${items.length} completed`
      : finished
        ? `${completedCount} of ${items.length} uploaded successfully${
            failedCount > 0
              ? ` • ${failedCount} failed`
              : ''
          }`
        : `${completedCount} of ${items.length} completed`;

  return (
    <div className="pointer-events-none fixed left-3 top-[calc(4.5rem+env(safe-area-inset-top))] z-[2147483647] w-[calc(100%-1.5rem)] max-w-lg sm:left-5 sm:top-[5.25rem] sm:w-[calc(100%-2.5rem)]">
      <div className="pointer-events-auto overflow-hidden rounded-[18px] border border-sand-dark/70 bg-cream shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl">

        {/* MAIN BAR */}

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
            onClick={() =>
              setExpanded(
                (current) =>
                  !current,
              )
            }
            className="min-w-0 flex-1 text-left"
            aria-expanded={
              expanded
            }
          >
            <div className="flex items-center gap-1.5">
              <p className="truncate text-[9px] font-bold uppercase tracking-[0.1em] text-wine">
                {title}
              </p>

              <ChevronDown
                className={`h-3 w-3 shrink-0 text-ink-soft transition-transform duration-200 ${
                  expanded
                    ? 'rotate-180'
                    : ''
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
              {completedCount}/
              {items.length}
            </p>
          </div>

          {finished && (
            <button
              type="button"
              onClick={
                onClose
              }
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink-soft transition hover:bg-wine/10 hover:text-wine"
              aria-label="Close upload status"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* OVERALL PROGRESS */}

        <div className="h-1 bg-sand">
          <div
            className={`h-full transition-all duration-200 ${
              finished &&
              failedCount ===
                0
                ? 'bg-emerald'
                : 'bg-wine'
            }`}
            style={{
              width: `${overallProgress}%`,
            }}
          />
        </div>

        {/* DETAILS */}

        {expanded && (
          <div className="border-t border-sand-dark/50 bg-white/65 px-2.5 py-2.5">
            <div className="max-h-[45vh] space-y-1.5 overflow-y-auto">
              {items.map(
                (item) => (
                  <div
                    key={
                      item.id
                    }
                    className="rounded-[12px] border border-sand-dark/40 bg-cream/65 px-2.5 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[8px] font-semibold text-ink">
                          {
                            item.name
                          }
                        </p>

                        <p className="mt-0.5 text-[6px] text-ink-soft">
                          {formatFileSize(
                            item.size,
                          )}
                        </p>
                      </div>

                      <div className="shrink-0 text-[6px] font-bold uppercase tracking-[0.08em]">
                        {item.status ===
                        'completed' ? (
                          <span className="text-emerald">
                            Complete
                          </span>
                        ) : item.status ===
                          'failed' ? (
                          <span className="text-wine">
                            Failed
                          </span>
                        ) : item.status ===
                          'processing' ? (
                          <span className="text-emerald">
                            Saving
                          </span>
                        ) : item.status ===
                          'uploading' ? (
                          <span className="text-wine">
                            {item.progress}%
                          </span>
                        ) : (
                          <span className="text-ink-soft">
                            Queued
                          </span>
                        )}
                      </div>
                    </div>

                    {(item.status ===
                      'uploading' ||
                      item.status ===
                        'processing') && (
                      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-sand">
                        <div
                          className={`h-full rounded-full ${
                            item.status ===
                            'processing'
                              ? 'animate-pulse bg-emerald'
                              : 'bg-wine'
                          }`}
                          style={{
                            width: `${item.progress}%`,
                          }}
                        />
                      </div>
                    )}

                    {item.status ===
                      'failed' &&
                      item.error && (
                        <p className="mt-1 text-[6px] leading-3 text-wine">
                          {
                            item.error
                          }
                        </p>
                      )}
                  </div>
                ),
              )}
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

export function GalleryUploadProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isUploading, setIsUploading] =
    useState(false);

  const [uploadItems, setUploadItems] =
    useState<UploadItem[]>([]);

  const [finished, setFinished] =
    useState(false);

  const [overallProgress, setOverallProgress] =
    useState(0);

  const queueRef =
    useRef<UploadQueueItem[]>([]);

  async function processQueue(
    queue: UploadQueueItem[],
  ) {
    const totalBytes =
      queue.reduce(
        (total, item) =>
          total +
          item.file.size,
        0,
      );

    let completedBytes = 0;
    let completedCount = 0;
    let failedCount = 0;

    for (
      const queueItem of queue
    ) {
      updateItemState(
        setUploadItems,
        queueItem.id,
        {
          status:
            'uploading',
          progress: 0,
          error:
            undefined,
        },
      );

      try {
        const isVideo =
          queueItem.file.type.startsWith(
            'video/',
          );

        const resourceType:
          | 'image'
          | 'video' =
          isVideo
            ? 'video'
            : 'image';

        const uploadSignature =
          await requestUploadSignature(
            resourceType,
            queueItem.section,
          );

        const cloudinaryResult =
          await uploadToCloudinary(
            queueItem.file,
            uploadSignature,
            (
              loaded,
              total,
            ) => {
              const itemProgress =
                total > 0
                  ? Math.round(
                      (loaded /
                        total) *
                        100,
                    )
                  : 0;

              updateItemState(
                setUploadItems,
                queueItem.id,
                {
                  status:
                    'uploading',
                  progress:
                    Math.min(
                      itemProgress,
                      99,
                    ),
                },
              );

              const overallProgressValue =
                totalBytes > 0
                  ? Math.round(
                      ((completedBytes +
                        loaded) /
                        totalBytes) *
                        100,
                    )
                  : 0;

              setOverallProgress(
                Math.min(
                  overallProgressValue,
                  99,
                ),
              );
            },
          );

        updateItemState(
          setUploadItems,
          queueItem.id,
          {
            status:
              'processing',
            progress: 99,
          },
        );

        await completeGalleryUpload(
          queueItem.section,
          cloudinaryResult,
          queueItem.file,
        );

        completedBytes +=
          queueItem.file.size;

        completedCount +=
          1;

        updateItemState(
          setUploadItems,
          queueItem.id,
          {
            status:
              'completed',
            progress: 100,
          },
        );

        setOverallProgress(
          totalBytes > 0
            ? Math.round(
                (completedBytes /
                  totalBytes) *
                  100,
              )
            : 100,
        );
      } catch (error) {
        failedCount += 1;

        const message =
          error instanceof Error
            ? error.message
            : 'Unable to upload this file.';

        completedBytes +=
          queueItem.file.size;

        updateItemState(
          setUploadItems,
          queueItem.id,
          {
            status:
              'failed',
            progress: 0,
            error: message,
          },
        );

        setOverallProgress(
          totalBytes > 0
            ? Math.round(
                (completedBytes /
                  totalBytes) *
                  100,
              )
            : 100,
        );
      }

      void completedCount;
    }

    setOverallProgress(100);
    setIsUploading(false);
    setFinished(true);
    queueRef.current = [];

    window.dispatchEvent(
      new CustomEvent(
        'gallery-upload-complete',
        {
          detail: {
            sections: Array.from(
              new Set(
                queue.map(
                  (item) =>
                    item.section,
                ),
              ),
            ),
            completedCount,
            failedCount,
          },
        },
      ),
    );
  }

  function startUpload(
    section: GallerySection,
    files: Array<{
      id: string;
      file: File;
    }>,
  ): boolean {
    if (
      isUploading ||
      files.length === 0 ||
      files.length >
        MAX_SELECTION_COUNT
    ) {
      return false;
    }

    const queue =
      files.map(
        (item) => ({
          id: item.id,
          file: item.file,
          section,
        }),
      );

    queueRef.current =
      queue;

    setUploadItems(
      queue.map(
        (item) => ({
          id: item.id,
          name:
            item.file.name,
          size:
            item.file.size,
          status:
            'queued',
          progress: 0,
        }),
      ),
    );

    setOverallProgress(0);
    setFinished(false);
    setIsUploading(true);

    void processQueue(
      queue,
    );

    return true;
  }

  function closeFinishedStatus() {
    if (isUploading) {
      return;
    }

    setUploadItems([]);
    setFinished(false);
    setOverallProgress(0);
    queueRef.current = [];
  }

  return (
    <GalleryUploadContext.Provider
      value={{
        isUploading,
        startUpload,
      }}
    >
      {children}

      <GalleryUploadStatusBar
        items={uploadItems}
        uploading={isUploading}
        finished={finished}
        overallProgress={
          overallProgress
        }
        completedCount={
          uploadItems.filter(
            (item) =>
              item.status ===
              'completed',
          ).length
        }
        failedCount={
          uploadItems.filter(
            (item) =>
              item.status ===
              'failed',
          ).length
        }
        onClose={
          closeFinishedStatus
        }
      />
    </GalleryUploadContext.Provider>
  );
}

export function useGalleryUpload() {
  const context =
    useContext(
      GalleryUploadContext,
    );

  if (!context) {
    throw new Error(
      'useGalleryUpload must be used inside GalleryUploadProvider.',
    );
  }

  return context;
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