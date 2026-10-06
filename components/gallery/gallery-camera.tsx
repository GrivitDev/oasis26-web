// src/components/gallery/gallery-camera.tsx

'use client';

import {
  Camera,
  Check,
  FlipHorizontal2,
  Loader2,
  Mic,
  Square,
  Video,
  X,
  Zap,
  ZoomIn,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

import { useGalleryUpload } from './gallery-upload-provider';

type GalleryCameraProps = {
  onClose?: () => void;
};

type CameraMode = 'photo' | 'video';

type ExtendedMediaTrackCapabilities = MediaTrackCapabilities & {
  torch?: boolean;
  zoom?: {
    min: number;
    max: number;
    step?: number;
  };
};

type ExtendedMediaTrackConstraintSet = MediaTrackConstraintSet & {
  torch?: boolean;
  zoom?: number;
};

const subscribeToMount = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function createCaptureId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function GalleryCamera({ onClose }: GalleryCameraProps) {
  const { startUpload } = useGalleryUpload();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeDeviceIdRef = useRef<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const mountedRef = useRef(false);

  const mounted = useSyncExternalStore(
    subscribeToMount,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [mode, setMode] = useState<CameraMode>('photo');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [hasActiveDevice, setHasActiveDevice] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [recording, setRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [flashSupported, setFlashSupported] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [zoomSupported, setZoomSupported] = useState(false);
  const [zoomMin, setZoomMin] = useState(1);
  const [zoomMax, setZoomMax] = useState(1);
  const [zoomStep, setZoomStep] = useState(0.1);
  const [zoom, setZoom] = useState(1);
  const [starting, setStarting] = useState(true);
  const [message, setMessage] = useState('');
  const [cameraCount, setCameraCount] = useState(1);
  const [captureBusy, setCaptureBusy] = useState(false);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
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

  const inspectCameraCapabilities = useCallback((stream: MediaStream) => {
    const track = stream.getVideoTracks()[0];

    if (!track) {
      return;
    }

    const capabilities =
      track.getCapabilities() as ExtendedMediaTrackCapabilities;

    const torch = capabilities.torch === true;
    setFlashSupported(torch);
    if (!torch) setFlashEnabled(false);

    if (
      capabilities.zoom &&
      Number.isFinite(capabilities.zoom.min) &&
      Number.isFinite(capabilities.zoom.max) &&
      capabilities.zoom.max > capabilities.zoom.min
    ) {
      setZoomSupported(true);
      setZoomMin(capabilities.zoom.min);
      setZoomMax(capabilities.zoom.max);
      setZoomStep(capabilities.zoom.step || 0.1);
      setZoom(capabilities.zoom.min);
    } else {
      setZoomSupported(false);
    }
  }, []);

  const enumerateCameras = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) {
      setCameraCount(1);
      return [] as MediaDeviceInfo[];
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((device) => device.kind === 'videoinput');
      setCameraCount(Math.max(1, cameras.length));
      return cameras;
    } catch {
      setCameraCount(1);
      return [] as MediaDeviceInfo[];
    }
  }, []);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera access is not supported by this browser.');
      setStarting(false);
      return;
    }

    stopCamera();
    setCameraError('');
    setMessage('');
    setStarting(true);

    const wantsAudio = mode === 'video';

    const preferredVideo: MediaTrackConstraints = activeDeviceIdRef.current
      ? {
          deviceId: { exact: activeDeviceIdRef.current },
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30, max: 30 },
        }
      : {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30, max: 30 },
        };

    const primaryConstraints: MediaStreamConstraints = {
      video: preferredVideo,
      audio: wantsAudio
        ? {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          }
        : false,
    };

    const fallbackConstraints: MediaStreamConstraints = {
      video: true,
      audio: wantsAudio,
    };

    let stream: MediaStream;

    try {
      stream = await navigator.mediaDevices.getUserMedia(primaryConstraints);
    } catch (primaryError) {
      try {
        stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
        activeDeviceIdRef.current = null;
        setHasActiveDevice(false);
      } catch (fallbackError) {
        console.error('Camera access error:', primaryError, fallbackError);

        const source = fallbackError instanceof DOMException ? fallbackError : primaryError;
        const code = source instanceof DOMException ? source.name : '';

        setCameraError(
          code === 'NotAllowedError'
            ? 'Camera permission was denied. Allow camera access in your browser settings and try again.'
            : code === 'NotFoundError'
              ? 'No camera was found on this device.'
              : code === 'NotReadableError'
                ? 'The camera is busy or unavailable. Close other apps using it and try again.'
                : 'Unable to start the camera. Please try again.',
        );
        setStarting(false);
        return;
      }
    }

    streamRef.current = stream;
    inspectCameraCapabilities(stream);
    await enumerateCameras();

    const video = videoRef.current;
    if (!video) {
      stream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setStarting(false);
      return;
    }

    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;

    try {
      if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
        await new Promise<void>((resolve) => {
          const onLoadedMetadata = () => {
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            resolve();
          };

          video.addEventListener('loadedmetadata', onLoadedMetadata, {
            once: true,
          });
        });
      }

      await video.play();
      setCameraReady(true);
    } catch (error) {
      console.error('Camera preview error:', error);
      setCameraError('The camera opened but the preview could not start.');
      stopCamera();
    } finally {
      setStarting(false);
    }
  }, [enumerateCameras, facingMode, inspectCameraCapabilities, mode, stopCamera]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const startTimeout = window.setTimeout(() => {
      void startCamera();
    }, 0);

    return () => window.clearTimeout(startTimeout);
  }, [mounted, mode, startCamera]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const closeCamera = useCallback(() => {
    const recorder = mediaRecorderRef.current;

    if (recorder && recorder.state !== 'inactive') {
      recorder.ondataavailable = null;
      recorder.onstop = null;
      recorder.onerror = null;
      recorder.stop();
    }

    mediaRecorderRef.current = null;
    recordedChunksRef.current = [];
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRecording(false);
    setRecordingSeconds(0);
    stopCamera();
    onClose?.();
  }, [onClose, stopCamera]);

  async function toggleFlash() {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track || !flashSupported) return;

    const nextValue = !flashEnabled;

    try {
      await track.applyConstraints({
        advanced: [
          {
            torch: nextValue,
          } as ExtendedMediaTrackConstraintSet,
        ],
      });
      setFlashEnabled(nextValue);
    } catch (error) {
      console.error('Flash control error:', error);
      setMessage('Flash is not available on this camera.');
    }
  }

  async function changeZoom(value: number) {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track || !zoomSupported) return;

    const nextValue = Math.min(zoomMax, Math.max(zoomMin, value));

    try {
      await track.applyConstraints({
        advanced: [
          {
            zoom: nextValue,
          } as ExtendedMediaTrackConstraintSet,
        ],
      });
      setZoom(nextValue);
    } catch (error) {
      console.error('Camera zoom error:', error);
    }
  }

  async function switchCamera() {
    if (recording || !cameraReady) return;

    const cameras = await enumerateCameras();

    if (cameras.length > 1) {
      const currentDeviceId =
        streamRef.current?.getVideoTracks()[0]?.getSettings().deviceId;
      const currentIndex = Math.max(
        0,
        cameras.findIndex((device) => device.deviceId === currentDeviceId),
      );
      const nextDevice = cameras[(currentIndex + 1) % cameras.length];

      activeDeviceIdRef.current = nextDevice?.deviceId ?? null;
      setHasActiveDevice(Boolean(activeDeviceIdRef.current));
      if (!activeDeviceIdRef.current) {
        setFacingMode((current) =>
          current === 'environment' ? 'user' : 'environment',
        );
      } else {
        void startCamera();
      }
      return;
    }

    activeDeviceIdRef.current = null;
    setHasActiveDevice(false);
    setFacingMode((current) =>
      current === 'environment' ? 'user' : 'environment',
    );
  }

  function capturePhoto() {
    if (!videoRef.current || !cameraReady || recording || captureBusy) {
      return;
    }

    setCaptureBusy(true);
    setMessage('');

    try {
      const video = videoRef.current;

      if (!video.videoWidth || !video.videoHeight) {
        throw new Error('Camera is not ready yet.');
      }

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Unable to capture photograph.');
      }

      if (facingMode === 'user' && !activeDeviceIdRef.current) {
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setMessage('Unable to create the photograph.');
            setCaptureBusy(false);
            return;
          }

          const file = new File(
            [blob],
            `oasis26-${Date.now()}.jpg`,
            { type: 'image/jpeg' },
          );

          const started = startUpload('live', [
            {
              id: createCaptureId('photo'),
              file,
            },
          ]);

          setMessage(
            started
              ? 'Photo added to the upload queue.'
              : 'Unable to add the photo to the upload queue.',
          );
          setCaptureBusy(false);
        },
        'image/jpeg',
        0.9,
      );
    } catch (error) {
      console.error('Photo capture error:', error);
      setMessage(
        error instanceof Error
          ? error.message
          : 'Unable to capture photograph.',
      );
      setCaptureBusy(false);
    }
  }

  function getSupportedVideoMimeType() {
    const types = [
      'video/mp4;codecs=h264,aac',
      'video/mp4',
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
    ];

    return types.find((type) =>
      MediaRecorder.isTypeSupported(type),
    ) ?? '';
  }

  function startRecording() {
    if (!streamRef.current || !cameraReady || recording) return;

    if (typeof MediaRecorder === 'undefined') {
      setMessage('Video recording is not supported by this browser.');
      return;
    }

    const mimeType = getSupportedVideoMimeType();
    if (!mimeType) {
      setMessage('Video recording is not supported by this browser.');
      return;
    }

    const recorder = new MediaRecorder(streamRef.current, {
      mimeType,
      videoBitsPerSecond: 1_800_000,
      audioBitsPerSecond: 128_000,
    });

    recordedChunksRef.current = [];
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    recorder.onerror = () => {
      setRecording(false);
      setRecordingSeconds(0);
      setMessage('Video recording failed.');
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    recorder.onstop = () => {
      const chunks = recordedChunksRef.current;

      if (!chunks.length) {
        setRecording(false);
        setRecordingSeconds(0);
        return;
      }

      const blob = new Blob(chunks, { type: mimeType });
      const extension = mimeType.includes('mp4') ? 'mp4' : 'webm';
      const file = new File(
        [blob],
        `oasis26-video-${Date.now()}.${extension}`,
        { type: mimeType },
      );

      const started = startUpload('live', [
        {
          id: createCaptureId('video'),
          file,
        },
      ]);

      setMessage(
        started
          ? 'Video added to the upload queue.'
          : 'Unable to add the video to the upload queue.',
      );

      recordedChunksRef.current = [];
      mediaRecorderRef.current = null;
      setRecording(false);
      setRecordingSeconds(0);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    recorder.start(1000);
    setRecording(true);
    setRecordingSeconds(0);
    setMessage('');

    timerRef.current = setInterval(() => {
      setRecordingSeconds((seconds) => seconds + 1);
    }, 1000);
  }

  function stopRecording() {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') return;
    recorder.stop();
  }

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`;
  }

  const modeLabel = useMemo(
    () => (mode === 'photo' ? 'Photo' : 'Video'),
    [mode],
  );

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[2147483647] flex min-h-[100dvh] items-center justify-center bg-ink/90 px-2.5 py-3 backdrop-blur-md sm:px-5 sm:py-6"
      role="dialog"
      aria-modal="true"
      aria-label="Live gallery camera"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !recording) {
          closeCamera();
        }
      }}
    >
      <div className="relative w-full max-w-3xl overflow-hidden rounded-[24px] border border-white/10 bg-ink shadow-2xl sm:rounded-[30px]">
        <div className="relative aspect-[4/5] overflow-hidden bg-black sm:aspect-video">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`h-full w-full object-cover ${
              facingMode === 'user' && !hasActiveDevice
                ? '-scale-x-100'
                : ''
            }`}
            aria-label="Camera preview"
          />

          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/65 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/75 to-transparent" />

          <div className="absolute left-3 right-3 top-3 z-20 flex items-center justify-between sm:left-4 sm:right-4 sm:top-4">
            <div className="rounded-full bg-black/45 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md sm:text-[9px]">
              {recording ? `Recording ${formatTime(recordingSeconds)}` : modeLabel}
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeCamera}
              disabled={recording}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-md transition hover:bg-wine disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close camera"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {cameraError ? (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-ink/80 px-7 text-center text-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-wine/20 text-wine">
                <Camera className="h-5 w-5" />
              </div>
              <p className="mt-4 text-sm font-semibold">Camera unavailable</p>
              <p className="mt-1 max-w-sm text-[10px] leading-4 text-white/60">
                {cameraError}
              </p>
              <button
                type="button"
                onClick={() => void startCamera()}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-wine px-4 py-2 text-[8px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-wine/90"
              >
                <Loader2 className="h-3 w-3" />
                Retry camera
              </button>
            </div>
          ) : starting || !cameraReady ? (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-ink/45 text-white backdrop-blur-[2px]">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/35">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
              <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/75">
                Starting camera
              </p>
            </div>
          ) : null}

          <div className="absolute left-3 right-3 top-16 z-20 flex items-center justify-center gap-1.5 sm:left-4 sm:right-4 sm:top-20">
            {flashSupported && (
              <button
                type="button"
                onClick={() => void toggleFlash()}
                disabled={recording}
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-white backdrop-blur-md transition sm:h-9 sm:w-9 ${
                  flashEnabled
                    ? 'border-gold/60 bg-gold/80 text-ink'
                    : 'border-white/15 bg-black/45 hover:bg-white/15'
                } disabled:opacity-50`}
                aria-label={flashEnabled ? 'Turn flash off' : 'Turn flash on'}
                title={flashEnabled ? 'Flash on' : 'Flash off'}
              >
                <Zap className="h-3.5 w-3.5" />
              </button>
            )}

            {zoomSupported && !recording && (
              <div className="flex h-8 items-center gap-1 rounded-full border border-white/15 bg-black/45 px-2 backdrop-blur-md sm:h-9">
                <ZoomIn className="h-3 w-3 text-white/80" />
                <input
                  type="range"
                  min={zoomMin}
                  max={zoomMax}
                  step={zoomStep}
                  value={zoom}
                  onChange={(event) => void changeZoom(Number(event.target.value))}
                  className="w-24 accent-white sm:w-28"
                  aria-label="Camera zoom"
                />
              </div>
            )}
          </div>

          <div className="absolute bottom-4 left-3 right-3 z-20 sm:bottom-5 sm:left-4 sm:right-4">
            {message && (
              <div className="mx-auto mb-3 flex max-w-xs items-center justify-center gap-1.5 rounded-full border border-white/10 bg-black/45 px-3 py-1.5 text-center text-[8px] text-white/80 backdrop-blur-md">
                <Check className="h-3 w-3 text-emerald" />
                {message}
              </div>
            )}

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => void switchCamera()}
                disabled={recording || cameraCount < 1 || !cameraReady}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-md transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-11"
                aria-label="Switch camera"
              >
                <FlipHorizontal2 className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={mode === 'photo' ? capturePhoto : recording ? stopRecording : startRecording}
                disabled={!cameraReady || starting || captureBusy}
                className={`flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.24)] transition sm:h-20 sm:w-20 ${
                  recording
                    ? 'bg-wine'
                    : 'bg-white'
                } disabled:opacity-50`}
                aria-label={
                  mode === 'photo'
                    ? 'Take photo'
                    : recording
                      ? 'Stop recording'
                      : 'Start recording'
                }
              >
                {mode === 'photo' ? (
                  <Camera className="h-6 w-6 text-ink sm:h-7 sm:w-7" />
                ) : recording ? (
                  <Square className="h-6 w-6 fill-white text-white sm:h-7 sm:w-7" />
                ) : (
                  <Video className="h-6 w-6 text-wine sm:h-7 sm:w-7" />
                )}
              </button>

              <div className="flex h-10 w-10 items-center justify-center sm:h-11 sm:w-11">
                {mode === 'video' && (
                  <Mic className="h-4 w-4 text-white/80" aria-hidden="true" />
                )}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-center rounded-full border border-white/10 bg-black/35 p-1 backdrop-blur-md">
              {(['photo', 'video'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setMode(option)}
                  disabled={recording || starting}
                  className={`flex min-w-20 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.1em] transition ${
                    mode === option
                      ? 'bg-white text-ink'
                      : 'text-white/65 hover:text-white'
                  } disabled:opacity-50 sm:min-w-24 sm:text-[9px]`}
                >
                  {option === 'photo' ? (
                    <Camera className="h-3 w-3" />
                  ) : (
                    <Video className="h-3 w-3" />
                  )}
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 bg-cream px-3 py-2.5 sm:px-4 sm:py-3">
          <p className="text-[8px] leading-3.5 text-ink-soft sm:text-[9px]">
            {mode === 'photo'
              ? 'Photos are uploaded privately through the secure gallery upload pipeline.'
              : 'Videos include microphone audio and upload in the background when recording stops.'}
          </p>

          <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[7px] font-bold uppercase tracking-[0.08em] text-emerald shadow-sm">
            Live Gallery
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
