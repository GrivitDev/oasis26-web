// src/components/our-story.tsx

'use client';

import { useRef, useState } from 'react';
import { Maximize, Pause, Play } from 'lucide-react';

export function OurStory() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = async () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      await videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleFullscreen = async () => {
    if (!videoRef.current) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await videoRef.current.requestFullscreen();
  };

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

          <div className="relative overflow-hidden rounded-[24px] border border-white/80 bg-ink shadow-[0_20px_50px_rgba(84,26,42,0.16)] sm:rounded-[30px]">
            <div className="relative aspect-[16/10] sm:aspect-[16/9]">
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                preload="metadata"
                playsInline
                poster="/poster.jpeg"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              >
                <source src="/test.mp4" type="video/mp4" />
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

              {/* Center play */}
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                className="group absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-wine/80 text-white shadow-[0_10px_28px_rgba(0,0,0,0.22)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-wine sm:h-16 sm:w-16"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 fill-current sm:h-6 sm:w-6" />
                ) : (
                  <Play className="ml-0.5 h-6 w-6 fill-current sm:h-7 sm:w-7" />
                )}
              </button>

              {/* Fullscreen */}
              <button
                type="button"
                onClick={handleFullscreen}
                aria-label="View video fullscreen"
                className="absolute bottom-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-md transition-all duration-200 hover:bg-wine/80 sm:bottom-4 sm:right-4"
              >
                <Maximize className="h-3.5 w-3.5" />
              </button>

              {/* Romantic caption */}
              <div className="pointer-events-none absolute bottom-3 left-3 right-14 sm:bottom-4 sm:left-4 sm:right-16">
                <div className="inline-block rounded-lg border border-white/15 bg-wine/40 px-2.5 py-1.5 backdrop-blur-md sm:px-3 sm:py-2">
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