// src/components/gallery/gallery-camera.tsx

'use client';

import {
  Camera,
  Check,
  FlipHorizontal2,
  ImagePlus,
  Loader2,
  Mic,
  RotateCcw,
  Square,
  UploadCloud,
  Video,
  X,
  Zap,
  ZoomIn,
} from 'lucide-react';
import {
  createPortal,
} from 'react-dom';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

type GalleryCameraProps = {
  onUploaded?: () => void;
  onClose?: () => void;
};

type CameraMode = 'photo' | 'video';

type UploadStatus =
  | 'queued'
  | 'uploading'
  | 'uploaded'
  | 'failed';

type UploadQueueItem = {
  id: string;
  file: File;
  status: UploadStatus;
  progress: number;
  error?: string;
};

type CameraTrackCapabilities = MediaTrackCapabilities & {
  torch?: boolean;
  zoom?: {
    min: number;
    max: number;
    step: number;
  };
};

export default function GalleryCamera({
  onUploaded,
  onClose,
}: GalleryCameraProps) {
  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);

  const recordedChunksRef =
    useRef<Blob[]>([]);

  const timerRef =
    useRef<ReturnType<typeof setInterval> | null>(
      null,
    );

  const mountedRef =
    useRef(false);

  const uploadQueueRef =
    useRef<UploadQueueItem[]>([]);

  const activeUploadsRef =
    useRef(0);

  const processUploadQueueRef =
    useRef<(() => Promise<void>) | null>(null);

  const [mounted, setMounted] =
    useState(false);

  const [mode, setMode] =
    useState<CameraMode>('photo');

  const [facingMode, setFacingMode] =
    useState<'user' | 'environment'>(
      'environment',
    );

  const [cameraReady, setCameraReady] =
    useState(false);

  const [cameraError, setCameraError] =
    useState('');

  const [recording, setRecording] =
    useState(false);

  const [recordingSeconds, setRecordingSeconds] =
    useState(0);

  const [uploadQueue, setUploadQueue] =
    useState<UploadQueueItem[]>([]);

  const [uploadMessage, setUploadMessage] =
    useState('');

  const [uploadError, setUploadError] =
    useState('');

  const [flashSupported, setFlashSupported] =
    useState(false);

  const [flashEnabled, setFlashEnabled] =
    useState(false);

  const [zoomSupported, setZoomSupported] =
    useState(false);

  const [zoomMin, setZoomMin] =
    useState(1);

  const [zoomMax, setZoomMax] =
    useState(1);

  const [zoomStep, setZoomStep] =
    useState(0.1);

  const [zoom, setZoom] =
    useState(1);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraReady(false);
    setFlashSupported(false);
    setFlashEnabled(false);
    setZoomSupported(false);
    setZoomMin(1);
    setZoomMax(1);
    setZoomStep(0.1);
    setZoom(1);
  }, []);

  const inspectCameraCapabilities =
    useCallback(
      (stream: MediaStream) => {
        const videoTrack =
          stream.getVideoTracks()[0];

        if (!videoTrack) {
          return;
        }

        const capabilities =
          videoTrack.getCapabilities() as CameraTrackCapabilities;

        const hasTorch =
          capabilities.torch === true;

        setFlashSupported(hasTorch);

        if (!hasTorch) {
          setFlashEnabled(false);
        }

        if (
          capabilities.zoom &&
          Number.isFinite(
            capabilities.zoom.min,
          ) &&
          Number.isFinite(
            capabilities.zoom.max,
          ) &&
          capabilities.zoom.max >
            capabilities.zoom.min
        ) {
          setZoomSupported(true);
          setZoomMin(
            capabilities.zoom.min,
          );
          setZoomMax(
            capabilities.zoom.max,
          );
          setZoomStep(
            capabilities.zoom.step ||
              0.1,
          );
          setZoom(
            capabilities.zoom.min,
          );
        } else {
          setZoomSupported(false);
        }
      },
      [],
    );

  const startCamera = useCallback(async () => {
    try {
      setCameraError('');

      stopCamera();

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        setCameraError(
          'Camera access is not supported by this browser.',
        );

        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: {
              facingMode,
              width: {
                ideal: 1280,
              },
              height: {
                ideal: 720,
              },
            },
            audio: true,
          },
        );

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject =
          stream;

        await videoRef.current.play();
      }

      inspectCameraCapabilities(
        stream,
      );

      setCameraReady(true);
    } catch (error) {
      console.error(
        'Camera access error:',
        error,
      );

      setCameraReady(false);

      if (
        error instanceof DOMException &&
        error.name === 'NotAllowedError'
      ) {
        setCameraError(
          'Camera and microphone access was denied. Please allow access in your browser settings.',
        );
      } else if (
        error instanceof DOMException &&
        error.name === 'NotFoundError'
      ) {
        setCameraError(
          'No camera or microphone was found on this device.',
        );
      } else {
        setCameraError(
          'Unable to access the camera. Please check your browser permissions.',
        );
      }
    }
  }, [
    facingMode,
    inspectCameraCapabilities,
    stopCamera,
  ]);

  useEffect(() => {
    mountedRef.current = true;

    const mountTimeout = setTimeout(() => {
      setMounted(true);
    }, 0);

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      'hidden';

    return () => {
      mountedRef.current = false;

      clearTimeout(mountTimeout);

      document.body.style.overflow =
        previousOverflow;
    };
  }, []);

  useEffect(() => {
    const startCameraTimeout =
      setTimeout(() => {
        void startCamera();
      }, 0);

    return () => {
      clearTimeout(
        startCameraTimeout,
      );

      if (timerRef.current) {
        clearInterval(
          timerRef.current,
        );

        timerRef.current = null;
      }

      const recorder =
        mediaRecorderRef.current;

      if (
        recorder &&
        recorder.state !== 'inactive'
      ) {
        recorder.onstop = null;
        recorder.onerror = null;
        recorder.stop();
      }

      mediaRecorderRef.current =
        null;

      stopCamera();
    };
  }, [startCamera, stopCamera]);

  useEffect(() => {
    if (!recording) {
      return;
    }

    timerRef.current =
      setInterval(() => {
        setRecordingSeconds(
          (current) => current + 1,
        );
      }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(
          timerRef.current,
        );

        timerRef.current = null;
      }
    };
  }, [recording]);

  const updateQueueItem = useCallback(
    (
      id: string,
      updates: Partial<UploadQueueItem>,
    ) => {
      uploadQueueRef.current =
        uploadQueueRef.current.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  ...updates,
                }
              : item,
        );

      if (mountedRef.current) {
        setUploadQueue(
          [...uploadQueueRef.current],
        );
      }
    },
    [],
  );

  const processUploadQueue =
    useCallback(async () => {
      while (
        activeUploadsRef.current <
          2
      ) {
        const nextItem =
          uploadQueueRef.current.find(
            (item) =>
              item.status === 'queued',
          );

        if (!nextItem) {
          break;
        }

        activeUploadsRef.current += 1;

        updateQueueItem(
          nextItem.id,
          {
            status: 'uploading',
            progress: 0,
            error: undefined,
          },
        );

        try {
          const formData =
            new FormData();

          formData.append(
            'file',
            nextItem.file,
          );

          formData.append(
            'section',
            'live',
          );

          await new Promise<void>(
            (
              resolve,
              reject,
            ) => {
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

                  const progress =
                    Math.round(
                      (event.loaded /
                        event.total) *
                        100,
                    );

                  updateQueueItem(
                    nextItem.id,
                    {
                      progress,
                    },
                  );
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

          updateQueueItem(
            nextItem.id,
            {
              status: 'uploaded',
              progress: 100,
            },
          );

          if (mountedRef.current) {
            setUploadMessage(
              'Moment added to the Live Gallery.',
            );

            setUploadError('');

            onUploaded?.();
          }
        } catch (error) {
          console.error(
            'Live gallery upload error:',
            error,
          );

          const message =
            error instanceof Error
              ? error.message
              : 'Unable to upload the file.';

          updateQueueItem(
            nextItem.id,
            {
              status: 'failed',
              error: message,
            },
          );

          if (mountedRef.current) {
            setUploadError(
              message,
            );
          }
        } finally {
          activeUploadsRef.current -= 1;
        }
      }

      if (
        uploadQueueRef.current.some(
          (item) =>
            item.status === 'queued',
        )
      ) {
        void processUploadQueueRef.current?.();
      }
    }, [
      onUploaded,
      updateQueueItem,
    ]);

  useEffect(() => {
    processUploadQueueRef.current =
      processUploadQueue;
  }, [processUploadQueue]);

  const queueUpload = useCallback(
    (
      blob: Blob,
      filename: string,
    ) => {
      const id =
        `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`;

      const file =
        new File(
          [blob],
          filename,
          {
            type:
              blob.type ||
              'application/octet-stream',
          },
        );

      const item: UploadQueueItem = {
        id,
        file,
        status: 'queued',
        progress: 0,
      };

      uploadQueueRef.current = [
        ...uploadQueueRef.current,
        item,
      ];

      if (mountedRef.current) {
        setUploadQueue(
          [...uploadQueueRef.current],
        );

        setUploadMessage(
          '',
        );

        setUploadError('');
      }

      void processUploadQueue();
    },
    [processUploadQueue],
  );

  function retryUpload(
    id: string,
  ) {
    updateQueueItem(
      id,
      {
        status: 'queued',
        progress: 0,
        error: undefined,
      },
    );

    setUploadError('');

    window.setTimeout(() => {
      void processUploadQueue();
    }, 0);
  }

  function clearCompletedUploads() {
    uploadQueueRef.current =
      uploadQueueRef.current.filter(
        (item) =>
          item.status !==
          'uploaded',
      );

    setUploadQueue(
      [...uploadQueueRef.current],
    );
  }

  function getSupportedVideoMimeType() {
    const types = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4',
    ];

    return (
      types.find((type) =>
        MediaRecorder.isTypeSupported(
          type,
        ),
      ) ?? ''
    );
  }

  function getVideoExtension(
    mimeType: string,
  ) {
    if (
      mimeType
        .toLowerCase()
        .includes('mp4')
    ) {
      return 'mp4';
    }

    if (
      mimeType
        .toLowerCase()
        .includes('quicktime')
    ) {
      return 'mov';
    }

    return 'webm';
  }

  function formatRecordingTime(
    seconds: number,
  ) {
    const minutes =
      Math.floor(
        seconds / 60,
      );

    const remainingSeconds =
      seconds % 60;

    return `${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  }

  async function toggleFlash() {
    const track =
      streamRef.current?.getVideoTracks()[0];

    if (
      !track ||
      !flashSupported
    ) {
      return;
    }

    const nextValue =
      !flashEnabled;

    try {
      await track.applyConstraints({
        advanced: [
          {
            torch: nextValue,
          } as MediaTrackConstraintSet,
        ],
      });

      setFlashEnabled(
        nextValue,
      );
    } catch (error) {
      console.error(
        'Flash control error:',
        error,
      );

      setUploadError(
        'Flash control is not available on this camera.',
      );
    }
  }

  async function changeZoom(
    value: number,
  ) {
    const track =
      streamRef.current?.getVideoTracks()[0];

    if (
      !track ||
      !zoomSupported
    ) {
      return;
    }

    try {
      await track.applyConstraints({
        advanced: [
          {
            zoom: value,
          } as MediaTrackConstraintSet,
        ],
      });

      setZoom(value);
    } catch (error) {
      console.error(
        'Camera zoom error:',
        error,
      );
    }
  }

  function resetZoom() {
    if (!zoomSupported) {
      return;
    }

    void changeZoom(
      zoomMin,
    );
  }

  async function capturePhoto() {
    if (
      !videoRef.current ||
      !cameraReady ||
      recording
    ) {
      return;
    }

    try {
      setUploadError('');
      setUploadMessage('');

      const video =
        videoRef.current;

      const canvas =
        document.createElement(
          'canvas',
        );

      canvas.width =
        video.videoWidth;

      canvas.height =
        video.videoHeight;

      const context =
        canvas.getContext('2d');

      if (!context) {
        throw new Error(
          'Unable to capture photograph.',
        );
      }

      if (
        facingMode === 'user'
      ) {
        context.translate(
          canvas.width,
          0,
        );

        context.scale(-1, 1);
      }

      context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height,
      );

      const blob =
        await new Promise<Blob | null>(
          (resolve) =>
            canvas.toBlob(
              resolve,
              'image/jpeg',
              0.92,
            ),
        );

      if (!blob) {
        throw new Error(
          'Unable to create photograph.',
        );
      }

      queueUpload(
        blob,
        `oasis26-${Date.now()}.jpg`,
      );
    } catch (error) {
      console.error(
        'Photo capture error:',
        error,
      );

      setUploadError(
        error instanceof Error
          ? error.message
          : 'Unable to capture photograph.',
      );
    }
  }

  function startRecording() {
    if (
      !streamRef.current ||
      !cameraReady ||
      recording
    ) {
      return;
    }

    const mimeType =
      getSupportedVideoMimeType();

    if (!mimeType) {
      setUploadError(
        'Video recording is not supported by this browser.',
      );

      return;
    }

    recordedChunksRef.current =
      [];

    const recorder =
      new MediaRecorder(
        streamRef.current,
        {
          mimeType,

          /*
           * 1.8 Mbps gives good 720p
           * wedding-video quality while
           * keeping uploads substantially
           * lighter than 2.5 Mbps.
           */
          videoBitsPerSecond:
            1_800_000,
        },
      );

    mediaRecorderRef.current =
      recorder;

    recorder.ondataavailable = (
      event,
    ) => {
      if (
        event.data.size > 0
      ) {
        recordedChunksRef.current.push(
          event.data,
        );
      }
    };

    recorder.onstop = () => {
      const chunks =
        recordedChunksRef.current;

      if (!chunks.length) {
        setRecording(false);
        setRecordingSeconds(0);
        return;
      }

      const blob =
        new Blob(
          chunks,
          {
            type: mimeType,
          },
        );

      const extension =
        getVideoExtension(
          mimeType,
        );

      setRecording(false);
      setRecordingSeconds(0);

      /*
       * Do NOT await this.
       *
       * The video immediately enters the
       * background upload queue while the
       * camera remains available.
       */
      queueUpload(
        blob,
        `oasis26-video-${Date.now()}.${extension}`,
      );

      recordedChunksRef.current =
        [];
    };

    recorder.onerror = () => {
      setRecording(false);
      setRecordingSeconds(0);

      setUploadError(
        'Video recording failed.',
      );
    };

    recorder.start(1000);

    setRecording(true);
    setRecordingSeconds(0);
    setUploadError('');
    setUploadMessage('');
  }

  function stopRecording() {
    const recorder =
      mediaRecorderRef.current;

    if (
      !recorder ||
      recorder.state === 'inactive'
    ) {
      return;
    }

    recorder.stop();
  }

  function switchCamera() {
    if (recording) {
      return;
    }

    setFacingMode(
      (current) =>
        current === 'environment'
          ? 'user'
          : 'environment',
    );
  }

  function closeCamera() {
    /*
     * Uploads are intentionally NOT cancelled.
     *
     * Once a file has entered the queue,
     * it continues uploading in the background.
     */
    const recorder =
      mediaRecorderRef.current;

    if (
      recorder &&
      recorder.state !== 'inactive'
    ) {
      recorder.onstop = null;
      recorder.onerror = null;
      recorder.stop();
    }

    mediaRecorderRef.current =
      null;

    recordedChunksRef.current =
      [];

    stopCamera();

    onClose?.();
  }

  const queuedCount =
    uploadQueue.filter(
      (item) =>
        item.status === 'queued',
    ).length;

  const activeCount =
    uploadQueue.filter(
      (item) =>
        item.status === 'uploading',
    ).length;

  const failedCount =
    uploadQueue.filter(
      (item) =>
        item.status === 'failed',
    ).length;

  const completedCount =
    uploadQueue.filter(
      (item) =>
        item.status === 'uploaded',
    ).length;

  const hasQueue =
    uploadQueue.length > 0;

  const queueProgressItems =
    uploadQueue.filter(
      (item) =>
        item.status ===
          'uploading' ||
        item.status === 'queued' ||
        item.status === 'failed',
    );

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-ink/80 p-2 backdrop-blur-md sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="OASIS'26 Live Gallery Camera"
    >
      <div className="relative flex h-full max-h-[900px] w-full max-w-2xl flex-col overflow-hidden rounded-[24px] border border-sand-dark/60 bg-cream shadow-2xl sm:max-h-[92vh] sm:rounded-[28px]">
        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <div className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between bg-gradient-to-b from-ink/80 to-transparent px-4 pb-8 pt-4 sm:px-5 sm:pt-5">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-gold">
              OASIS&apos;26
            </p>

            <p className="mt-1 font-[family-name:var(--font-cormorant)] text-xl font-semibold text-white sm:text-2xl">
              Live Moments
            </p>
          </div>

          <div className="flex items-center gap-2">
            {hasQueue && (
              <CameraTooltip
                label="Upload queue"
              >
                <div className="relative flex h-9 min-w-9 items-center justify-center rounded-full border border-white/20 bg-ink/45 px-2 text-white backdrop-blur">
                  <UploadCloud className="h-4 w-4" />

                  {(queuedCount +
                    activeCount) >
                    0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[8px] font-bold text-ink">
                      {queuedCount +
                        activeCount}
                    </span>
                  )}
                </div>
              </CameraTooltip>
            )}

            <CameraTooltip label="Close camera">
              <button
                type="button"
                onClick={closeCamera}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-ink/45 text-white backdrop-blur transition hover:bg-wine"
                aria-label="Close camera"
              >
                <X className="h-4 w-4" />
              </button>
            </CameraTooltip>
          </div>
        </div>

        {/* ===================================================== */}
        {/* CAMERA VIEW */}
        {/* ===================================================== */}

        <div className="relative min-h-0 flex-1 overflow-hidden bg-ink">
          <video
            ref={videoRef}
            muted
            playsInline
            autoPlay
            className={`h-full w-full object-cover ${
              facingMode === 'user'
                ? '-scale-x-100'
                : ''
            }`}
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/25 via-transparent to-ink/45" />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink/75 to-transparent" />

          {/* Camera loading */}
          {!cameraReady &&
            !cameraError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink text-white">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-wine/30">
                  <Loader2 className="h-5 w-5 animate-spin text-gold" />
                </div>

                <p className="mt-3 text-xs font-semibold tracking-wide text-white/80">
                  Preparing your camera...
                </p>
              </div>
            )}

          {/* Camera error */}
          {cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink px-6 text-center text-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-wine/30">
                <Camera className="h-5 w-5 text-gold" />
              </div>

              <p className="mt-4 max-w-sm text-xs leading-5 text-white/75">
                {cameraError}
              </p>

              <button
                type="button"
                onClick={startCamera}
                className="mt-4 rounded-full bg-gold px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-ink transition hover:bg-gold/90"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Camera utilities */}
          {cameraReady &&
            !cameraError && (
              <div className="absolute left-1/2 top-16 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-ink/50 p-1 backdrop-blur-md">
                <CameraTooltip
                  label={
                    flashEnabled
                      ? 'Turn flash off'
                      : 'Turn flash on'
                  }
                >
                  <button
                    type="button"
                    onClick={
                      toggleFlash
                    }
                    disabled={
                      !flashSupported ||
                      recording
                    }
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                      flashEnabled
                        ? 'bg-gold text-ink'
                        : 'text-white hover:bg-white/15'
                    } disabled:cursor-not-allowed disabled:opacity-30`}
                    aria-label={
                      flashEnabled
                        ? 'Turn flash off'
                        : 'Turn flash on'
                    }
                  >
                    <Zap className="h-3.5 w-3.5" />
                  </button>
                </CameraTooltip>

                {zoomSupported && (
                  <>
                    <div className="h-4 w-px bg-white/15" />

                    <CameraTooltip
                      label={`Zoom ${zoom.toFixed(
                        1,
                      )}x`}
                    >
                      <div className="flex items-center gap-1.5 px-1">
                        <ZoomIn className="h-3.5 w-3.5 text-white/75" />

                        <input
                          type="range"
                          min={zoomMin}
                          max={zoomMax}
                          step={zoomStep}
                          value={zoom}
                          onChange={(
                            event,
                          ) => {
                            void changeZoom(
                              Number(
                                event
                                  .target
                                  .value,
                              ),
                            );
                          }}
                          className="h-1 w-20 cursor-pointer accent-gold"
                          aria-label="Camera zoom"
                        />
                      </div>
                    </CameraTooltip>

                    <CameraTooltip label="Reset zoom">
                      <button
                        type="button"
                        onClick={
                          resetZoom
                        }
                        disabled={
                          recording ||
                          zoom <=
                            zoomMin
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="Reset zoom"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                    </CameraTooltip>
                  </>
                )}
              </div>
            )}

          {/* Recording indicator */}
          {recording && (
            <div className="absolute left-1/2 top-16 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-ink/70 px-3.5 py-2 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-wine" />

              <span className="text-[10px] font-bold tracking-[0.16em] text-white">
                {formatRecordingTime(
                  recordingSeconds,
                )}
              </span>
            </div>
          )}

          {/* Background upload queue */}
          {hasQueue && (
            <div className="absolute bottom-4 left-3 right-3 z-20 mx-auto max-w-sm rounded-2xl border border-white/10 bg-ink/75 p-3 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-white">
                  {activeCount >
                  0 ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-gold" />
                  ) : (
                    <UploadCloud className="h-3.5 w-3.5 text-gold" />
                  )}

                  <span>
                    {activeCount >
                    0
                      ? `Uploading ${activeCount} moment${
                          activeCount ===
                          1
                            ? ''
                            : 's'
                        }...`
                      : queuedCount >
                        0
                        ? `${queuedCount} moment${
                            queuedCount ===
                            1
                              ? ''
                              : 's'
                          } queued`
                        : failedCount >
                          0
                          ? `${failedCount} upload${
                              failedCount ===
                              1
                                ? ''
                                : 's'
                            } failed`
                          : `${completedCount} uploaded`}
                  </span>
                </div>

                {completedCount >
                  0 && (
                  <button
                    type="button"
                    onClick={
                      clearCompletedUploads
                    }
                    className="text-[8px] font-bold uppercase tracking-[0.1em] text-gold transition hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>

              {queueProgressItems
                .slice(0, 3)
                .map(
                  (item) => (
                    <div
                      key={
                        item.id
                      }
                      className="mt-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="min-w-0 flex-1 truncate text-[8px] text-white/65">
                          {item.file
                            .name}
                        </span>

                        {item.status ===
                          'uploading' && (
                          <span className="text-[8px] font-bold text-gold">
                            {
                              item.progress
                            }%
                          </span>
                        )}

                        {item.status ===
                          'queued' && (
                          <span className="text-[8px] font-bold text-white/55">
                            Queued
                          </span>
                        )}

                        {item.status ===
                          'failed' && (
                          <button
                            type="button"
                            onClick={() =>
                              retryUpload(
                                item.id,
                              )
                            }
                            className="text-[8px] font-bold uppercase tracking-[0.08em] text-gold"
                          >
                            Retry
                          </button>
                        )}
                      </div>

                      {item.status ===
                        'uploading' && (
                        <div className="mt-1 h-0.5 overflow-hidden rounded-full bg-white/15">
                          <div
                            className="h-full rounded-full bg-gold transition-all duration-200"
                            style={{
                              width: `${item.progress}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ),
                )}
            </div>
          )}

          {/* Success */}
          {uploadMessage &&
            activeCount === 0 &&
            queuedCount === 0 && (
              <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-emerald px-4 py-2.5 text-[10px] font-semibold text-white shadow-lg">
                <Check className="h-3.5 w-3.5" />
                {uploadMessage}
              </div>
            )}

          {/* Error */}
          {uploadError &&
            failedCount > 0 && (
              <div className="absolute bottom-5 left-4 right-4 z-20 mx-auto max-w-sm rounded-2xl bg-wine px-4 py-3 text-center text-[10px] font-medium leading-4 text-white shadow-lg">
                {uploadError}
              </div>
            )}
        </div>

        {/* ===================================================== */}
        {/* CONTROLS */}
        {/* ===================================================== */}

        <div className="shrink-0 border-t border-sand-dark/60 bg-cream px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4">
          {/* Mode switch */}
          <div className="mx-auto flex w-fit items-center rounded-full border border-sand-dark/70 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() =>
                setMode('photo')
              }
              disabled={recording}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[9px] font-bold uppercase tracking-[0.12em] transition ${
                mode === 'photo'
                  ? 'bg-wine text-white shadow-sm'
                  : 'text-ink-soft hover:bg-cream'
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              <ImagePlus className="h-3.5 w-3.5" />
              Photo
            </button>

            <button
              type="button"
              onClick={() =>
                setMode('video')
              }
              disabled={recording}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[9px] font-bold uppercase tracking-[0.12em] transition ${
                mode === 'video'
                  ? 'bg-wine text-white shadow-sm'
                  : 'text-ink-soft hover:bg-cream'
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              <Video className="h-3.5 w-3.5" />
              Video
            </button>
          </div>

          {/* Main camera controls */}
          <div className="mt-3 flex items-center justify-center gap-7">
            {/* Switch camera */}
            <CameraTooltip label="Switch camera">
              <button
                type="button"
                onClick={
                  switchCamera
                }
                disabled={
                  recording ||
                  !cameraReady
                }
                className="flex h-10 w-10 items-center justify-center rounded-full border border-sand-dark/70 bg-white text-wine shadow-sm transition hover:border-wine hover:bg-wine hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                aria-label="Switch camera"
              >
                <FlipHorizontal2 className="h-4 w-4" />
              </button>
            </CameraTooltip>

            {/* Capture / record */}
            {mode === 'photo' ? (
              <CameraTooltip label="Take photo">
                <button
                  type="button"
                  onClick={
                    capturePhoto
                  }
                  disabled={
                    !cameraReady ||
                    recording
                  }
                  className="relative flex h-[68px] w-[68px] items-center justify-center rounded-full border-[3px] border-wine bg-white shadow-lg transition hover:scale-[1.03] active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Take photo"
                >
                  <span className="h-[52px] w-[52px] rounded-full border border-gold/40 bg-cream" />

                  <span className="absolute h-10 w-10 rounded-full bg-wine" />
                </button>
              </CameraTooltip>
            ) : recording ? (
              <CameraTooltip label="Stop recording and upload">
                <button
                  type="button"
                  onClick={
                    stopRecording
                  }
                  className="flex h-[68px] w-[68px] items-center justify-center rounded-full border-[3px] border-wine bg-wine shadow-lg transition hover:scale-[1.03] active:scale-95"
                  aria-label="Stop recording"
                >
                  <Square className="h-6 w-6 fill-white text-white" />
                </button>
              </CameraTooltip>
            ) : (
              <CameraTooltip label="Start video recording">
                <button
                  type="button"
                  onClick={
                    startRecording
                  }
                  disabled={
                    !cameraReady
                  }
                  className="relative flex h-[68px] w-[68px] items-center justify-center rounded-full border-[3px] border-wine bg-white shadow-lg transition hover:scale-[1.03] active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Start recording"
                >
                  <span className="h-10 w-10 rounded-full bg-wine" />
                </button>
              </CameraTooltip>
            )}

            {/* Current mode indicator */}
            <CameraTooltip
              label={
                mode === 'video'
                  ? 'Video with sound'
                  : 'Photo mode'
              }
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-sand-dark/70 bg-white text-ink-soft shadow-sm">
                {mode ===
                'video' ? (
                  <Mic className="h-4 w-4 text-wine" />
                ) : (
                  <Camera className="h-4 w-4 text-emerald" />
                )}
              </div>
            </CameraTooltip>
          </div>

          <p className="mt-2 text-center text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-soft/70">
            {mode === 'photo'
              ? 'Tap to capture — uploads in the background'
              : recording
                ? 'Tap stop — your video uploads automatically'
                : 'Tap to begin recording'}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}

type CameraTooltipProps = {
  label: string;
  children: React.ReactNode;
};

function CameraTooltip({
  label,
  children,
}: CameraTooltipProps) {
  return (
    <div className="group relative">
      {children}

      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-[2147483647] mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-[9px] font-semibold text-white opacity-0 shadow-lg transition duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {label}
      </span>
    </div>
  );
}