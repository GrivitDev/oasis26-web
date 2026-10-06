// src/components/our-story.tsx

'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Maximize,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Settings2,
} from 'lucide-react';

export function OurStory() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const clearControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = null;
    }
  };

  const hideControlsSoon = () => {
    clearControlsTimeout();

    if (!isPlaying) return;

    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
      setShowSettings(false);
    }, 3000);
  };

  const revealControls = () => {
    setShowControls(true);
    hideControlsSoon();
  };

  const togglePlay = async () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      try {
        await videoRef.current.play();
        setIsPlaying(true);
        setShowControls(false);
      } catch (error) {
        console.error('Unable to play video:', error);
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(true);
      setShowSettings(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    if (video.muted) {
      video.muted = false;

      if (video.volume === 0) {
        video.volume = volume > 0 ? volume : 1;
      }

      setIsMuted(false);
      setVolume(video.volume);
    } else {
      video.muted = true;
      setIsMuted(true);
    }

    revealControls();
  };

  const handleVolumeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!videoRef.current) return;

    const nextVolume = Number(event.target.value);
    const video = videoRef.current;

    video.volume = nextVolume;

    if (nextVolume > 0) {
      video.muted = false;
      setIsMuted(false);
      setVolume(nextVolume);
    } else {
      video.muted = true;
      setIsMuted(true);
      setVolume(0);
    }

    revealControls();
  };

  const handleProgressChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!videoRef.current || !duration) return;

    const nextProgress = Number(event.target.value);
    const nextTime = (nextProgress / 100) * duration;

    videoRef.current.currentTime = nextTime;
    setProgress(nextProgress);
    setCurrentTime(nextTime);
    revealControls();
  };

  const handlePlaybackRateChange = (rate: number) => {
    if (!videoRef.current) return;

    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
    revealControls();
  };

  const handleFullscreen = async () => {
    if (!videoRef.current) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await videoRef.current.requestFullscreen();
      }
    } catch (error) {
      console.error('Unable to toggle fullscreen:', error);
    }

    revealControls();
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const nextDuration = video.duration || 0;
    const nextCurrentTime = video.currentTime || 0;

    setCurrentTime(nextCurrentTime);
    setDuration(nextDuration);

    if (nextDuration > 0) {
      setProgress((nextCurrentTime / nextDuration) * 100);
    }
  };

  const formatTime = (time: number) => {
    if (!Number.isFinite(time) || time < 0) {
      return '0:00';
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      clearControlsTimeout();
    };
  }, []);

  return (
    <section
      id="our-story"
      className="relative overflow-hidden bg-cream px-4 py-4 sm:px-6 sm:py-2 lg:px-8 lg:py-8"
    >
      {/* Romantic background */}
      <div className="pointer-events-none absolute -left-24 top-8 h-56 w-56 rounded-full bg-wine/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-8 h-64 w-64 rounded-full bg-mint/30 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        {/* Heading */}
        <div className="mx-auto max-w-xl text-center">
          <p className="font-[family-name:var(--font-great-vibes)] text-2xl text-wine sm:text-3xl">
            Our story
          </p>

          <h2 className="mt-1.5 font-[family-name:var(--font-cormorant)] text-4xl font-semibold leading-[0.9] text-emerald sm:text-5xl">
            A love that grew,
            <br />
            one moment at a time.
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-xs leading-5 text-ink-soft sm:text-sm">
            What began as moments shared over time became a story of friendship,
            faith, laughter, patience and a love that kept choosing to grow.
          </p>
        </div>

        {/* Video */}
        <div className="relative mx-auto mt-7 max-w-4xl sm:mt-10">
          {/* Ornamental frames */}
          <div className="absolute -inset-1.5 rotate-[-1.2deg] rounded-[28px] border border-wine/20 sm:-inset-2 sm:rounded-[34px]" />
          <div className="absolute -inset-1.5 rotate-[1.2deg] rounded-[28px] border border-emerald/20 sm:-inset-2 sm:rounded-[34px]" />

          <div
            className="relative overflow-hidden rounded-[24px] border border-white/80 bg-ink shadow-[0_20px_50px_rgba(84,26,42,0.16)] sm:rounded-[30px]"
            onMouseMove={revealControls}
            onMouseEnter={revealControls}
            onMouseLeave={() => {
              if (isPlaying) {
                hideControlsSoon();
              }
            }}
            onTouchStart={revealControls}
          >
            <div className="relative aspect-[16/10] sm:aspect-[16/9]">
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                preload="metadata"
                playsInline
                poster="/poster.jpeg"
                onPlay={() => {
                  setIsPlaying(true);
                  setShowControls(false);
                }}
                onPause={() => {
                  setIsPlaying(false);
                  setShowControls(true);
                  setShowSettings(false);
                }}
                onEnded={() => {
                  setIsPlaying(false);
                  setShowControls(true);
                  setShowSettings(false);
                }}
                onLoadedMetadata={() => {
                  if (!videoRef.current) return;

                  setDuration(videoRef.current.duration);
                  setVolume(videoRef.current.volume);
                  setIsMuted(videoRef.current.muted);
                }}
                onTimeUpdate={handleTimeUpdate}
              >
                <source src="/our_story.mp4" type="video/mp4" />
                Your browser does not support the video element.
              </video>

              {/* Cinematic overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-wine/40 via-transparent to-wine/10" />

              {/* Top label */}
              <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/20 px-2.5 py-1 backdrop-blur-md sm:left-4 sm:top-4">
                <span className="text-[7px] font-bold uppercase tracking-[0.22em] text-white sm:text-[8px]">
                  Our journey
                </span>
              </div>

              {/* Initial / paused play button */}
              {!isPlaying && (
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label="Play video"
                  className="group absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-wine/80 text-white shadow-[0_10px_28px_rgba(0,0,0,0.22)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-wine sm:h-16 sm:w-16"
                >
                  <Play className="ml-0.5 h-6 w-6 fill-current sm:h-7 sm:w-7" />
                </button>
              )}

              {/* Video controls */}
              <div
                className={`absolute inset-x-0 bottom-0 z-20 transition-all duration-300 ${
                  showControls
                    ? 'translate-y-0 opacity-100'
                    : 'pointer-events-none translate-y-3 opacity-0'
                }`}
              >
                <div className="bg-gradient-to-t from-black/80 via-black/45 to-transparent px-3 pb-3 pt-12 sm:px-4 sm:pb-4 sm:pt-16">
                  {/* Progress */}
                  <div className="mb-2 flex items-center gap-2">
                    <span className="min-w-[30px] text-[8px] font-medium tabular-nums text-white/90 sm:text-[9px]">
                      {formatTime(currentTime)}
                    </span>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="0.1"
                      value={progress}
                      onChange={handleProgressChange}
                      aria-label="Video progress"
                      className="h-1 w-full cursor-pointer appearance-none rounded-full accent-white"
                    />

                    <span className="min-w-[30px] text-right text-[8px] font-medium tabular-nums text-white/90 sm:text-[9px]">
                      {formatTime(duration)}
                    </span>
                  </div>

                  {/* Bottom controls */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {/* Play / Pause */}
                      <button
                        type="button"
                        onClick={togglePlay}
                        aria-label={isPlaying ? 'Pause video' : 'Play video'}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 sm:h-9 sm:w-9"
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4 fill-current" />
                        ) : (
                          <Play className="ml-0.5 h-4 w-4 fill-current" />
                        )}
                      </button>

                      {/* Volume */}
                      <div className="group/volume flex items-center gap-1">
                        <button
                          type="button"
                          onClick={toggleMute}
                          aria-label={
                            isMuted
                              ? 'Unmute video'
                              : 'Mute video'
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 sm:h-9 sm:w-9"
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX className="h-4 w-4" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                        </button>

                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          aria-label="Volume"
                          className="hidden h-1 w-16 cursor-pointer appearance-none rounded-full accent-white sm:block"
                        />
                      </div>

                      {/* Current time */}
                      <span className="ml-1 hidden text-[8px] font-medium text-white/70 sm:block">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {/* Speed */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            setShowSettings((current) => !current);
                            revealControls();
                          }}
                          aria-label="Playback settings"
                          aria-expanded={showSettings}
                          className="flex h-8 items-center gap-1.5 rounded-full px-2 text-white transition-colors hover:bg-white/15 sm:h-9 sm:px-2.5"
                        >
                          <Settings2 className="h-3.5 w-3.5" />

                          <span className="text-[8px] font-semibold sm:text-[9px]">
                            {playbackRate}x
                          </span>
                        </button>

                        {showSettings && (
                          <div className="absolute bottom-11 right-0 min-w-[105px] overflow-hidden rounded-[12px] border border-white/15 bg-black/75 p-1.5 shadow-xl backdrop-blur-md">
                            <p className="px-2 py-1 text-[7px] font-bold uppercase tracking-[0.15em] text-white/50">
                              Speed
                            </p>

                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map(
                              (rate) => (
                                <button
                                  key={rate}
                                  type="button"
                                  onClick={() =>
                                    handlePlaybackRateChange(rate)
                                  }
                                  className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-[9px] transition-colors ${
                                    playbackRate === rate
                                      ? 'bg-white/15 text-white'
                                      : 'text-white/75 hover:bg-white/10 hover:text-white'
                                  }`}
                                >
                                  <span>{rate}x</span>

                                  {playbackRate === rate && (
                                    <span className="text-mint">
                                      ✓
                                    </span>
                                  )}
                                </button>
                              ),
                            )}
                          </div>
                        )}
                      </div>

                      {/* Fullscreen */}
                      <button
                        type="button"
                        onClick={handleFullscreen}
                        aria-label="View video fullscreen"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 sm:h-9 sm:w-9"
                      >
                        <Maximize className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Romantic caption */}
              <div className="pointer-events-none absolute bottom-3 left-3 right-14 z-10 sm:bottom-4 sm:left-4 sm:right-16">
                <div
                  className={`inline-block rounded-lg border border-white/15 bg-wine/40 px-2.5 py-1.5 backdrop-blur-md transition-all duration-300 sm:px-3 sm:py-2 ${
                    showControls
                      ? 'translate-y-2 opacity-0'
                      : 'translate-y-0 opacity-100'
                  }`}
                >
                  <p className="font-[family-name:var(--font-great-vibes)] text-lg leading-none text-mint sm:text-xl">
                    And somehow, every chapter led here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Story statement */}
        <div className="mx-auto mt-7 max-w-xl text-center sm:mt-9">
          <div className="mx-auto flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-wine/20" />
            <span className="h-1.5 w-1.5 rotate-45 bg-mint-dark" />
            <span className="h-px w-8 bg-emerald/20" />
          </div>

          <p className="mt-3 font-[family-name:var(--font-cormorant)] text-xl font-semibold leading-tight text-wine sm:text-2xl">
            “Our love has been built over time —
            <span className="text-emerald">
              {' '}
              and we are grateful for every chapter.
            </span>
            ”
          </p>

          <p className="mt-2 text-[8px] font-bold uppercase tracking-[0.22em] text-ink-soft">
            Joseph &amp; Praise
          </p>
        </div>
      </div>
    </section>
  );
}