'use client';

import { FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import { Heart, Send } from 'lucide-react';

type BlessingEntry = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

type BlessingsResponse = {
  entries: BlessingEntry[];
  hasMore: boolean;
  nextCursor: {
    beforeCreatedAt: string;
    beforeId: string;
  } | null;
};

export default function BlessingsPrayers() {
  const [entries, setEntries] = useState<
    BlessingEntry[]
  >([]);

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] =
    useState(false);
  const [submitting, setSubmitting] =
    useState(false);

  const [hasMore, setHasMore] = useState(false);

  const [nextCursor, setNextCursor] = useState<
    BlessingsResponse['nextCursor']
  >(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;

    const loadInitialEntries = async () => {
      try {
        const response = await fetch(
          '/api/blessings?limit=10',
          {
            method: 'GET',
            cache: 'no-store',
          },
        );

        const data: BlessingsResponse | {
          error?: string;
        } = await response.json();

        if (!response.ok) {
          throw new Error(
            'error' in data && data.error
              ? data.error
              : 'Unable to load blessings and prayers.',
          );
        }

        if (active) {
          const result =
            data as BlessingsResponse;

          setEntries(result.entries || []);
          setHasMore(Boolean(result.hasMore));
          setNextCursor(result.nextCursor);
        }
      } catch (loadError) {
        console.error(loadError);

        if (active) {
          setError(
            'Unable to load the blessings and prayers right now.',
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadInitialEntries();

    return () => {
      active = false;
    };
  }, []);

  const loadMoreEntries = async () => {
    if (
      loadingMore ||
      !hasMore ||
      !nextCursor
    ) {
      return;
    }

    setError('');
    setLoadingMore(true);

    try {
      const params = new URLSearchParams({
        limit: '20',
        beforeCreatedAt:
          nextCursor.beforeCreatedAt,
        beforeId: nextCursor.beforeId,
      });

      const response = await fetch(
        `/api/blessings?${params.toString()}`,
        {
          method: 'GET',
          cache: 'no-store',
        },
      );

      const data: BlessingsResponse | {
        error?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(
          'error' in data && data.error
            ? data.error
            : 'Unable to load more blessings and prayers.',
        );
      }

      const result =
        data as BlessingsResponse;

      setEntries((current) => [
        ...current,
        ...(result.entries || []),
      ]);

      setHasMore(Boolean(result.hasMore));
      setNextCursor(result.nextCursor);
    } catch (loadMoreError) {
      console.error(loadMoreError);

      setError(
        'Unable to load more blessings and prayers.',
      );
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setError('Please enter your name.');
      return;
    }

    if (!trimmedMessage) {
      setError(
        'Please enter your blessing or prayer.',
      );
      return;
    }

    if (trimmedName.length > 120) {
      setError(
        'Your name must be 120 characters or less.',
      );
      return;
    }

    if (trimmedMessage.length > 2000) {
      setError(
        'Your blessing or prayer must be 2000 characters or less.',
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/blessings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          message: trimmedMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Unable to submit your blessing or prayer.',
        );
      }

      setEntries((current) => [
        data.entry,
        ...current,
      ]);

      setName('');
      setMessage('');
      setSuccess(
        'Your blessing or prayer has been added.',
      );
    } catch (submitError) {
      console.error(submitError);

      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Unable to submit your blessing or prayer.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="blessing"
      className="relative overflow-hidden bg-cream px-3 py-8 sm:px-5 sm:py-10"
    >
      <span
        id="prayer"
        className="absolute -top-20 left-0"
        aria-hidden="true"
      />

      {/* Soft background glow */}

      <div className="pointer-events-none absolute -left-28 top-0 h-72 w-72 rounded-full bg-mint/20 blur-3xl" />

      <div className="pointer-events-none absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-emerald/15 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        {/* ============================================================
            COMPACT FEATURE AREA
            ============================================================ */}

        <div className="grid overflow-hidden rounded-[24px] border border-wine/10 bg-ivory/80 shadow-[0_16px_45px_rgba(84,26,42,0.1)] backdrop-blur-md lg:grid-cols-[0.9fr_1.1fr]">
          {/* IMAGE SIDE */}

          <div className="relative min-h-[250px] overflow-hidden sm:min-h-[300px] lg:min-h-[360px]">
            <Image
              src="/blessings.jpg"
              alt="A romantic wedding setting"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover object-top"
            />

            {/* Image overlay */}

            <div className="absolute inset-0 bg-gradient-to-t from-wine/80 via-wine/15 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-px w-7 bg-mint" />

                <Heart className="h-3.5 w-3.5 fill-mint text-mint" />

                <span className="text-[7px] font-bold uppercase tracking-[0.24em] text-mint">
                  Words of Love
                </span>
              </div>

              <h2 className="max-w-md font-[family-name:var(--font-cormorant)] text-3xl font-semibold leading-[0.92] text-white sm:text-4xl">
                Blessings &amp; Prayers
              </h2>

              <p className="mt-2 max-w-md text-[10px] leading-4 text-mint-light sm:text-xs sm:leading-5">
                Leave a prayer, blessing, word of encouragement,
                or heartfelt message for Joseph &amp; Praise.
              </p>
            </div>
          </div>

          {/* FORM SIDE */}

          <div className="relative flex items-center p-4 sm:p-5 lg:p-6">
            <div className="w-full">
              <div className="mb-4">
                <p className="text-[7px] font-bold uppercase tracking-[0.25em] text-emerald sm:text-[8px]">
                  Leave Your Message
                </p>

                <h3 className="mt-1 font-[family-name:var(--font-cormorant)] text-2xl font-semibold leading-none text-wine sm:text-3xl">
                  Speak a blessing over their journey
                </h3>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-3"
              >
                {/* NAME */}

                <div>
                  <label
                    htmlFor="blessing-name"
                    className="mb-1 block text-[7px] font-bold uppercase tracking-[0.15em] text-wine"
                  >
                    Your Name
                  </label>

                  <input
                    id="blessing-name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="Enter your name"
                    autoComplete="name"
                    maxLength={120}
                    className="h-9 w-full rounded-[10px] border border-wine/10 bg-white/80 px-3 text-xs text-ink outline-none transition placeholder:text-ink-soft/45 focus:border-emerald focus:ring-2 focus:ring-emerald/10"
                  />
                </div>

                {/* MESSAGE */}

                <div>
                  <label
                    htmlFor="blessing-message"
                    className="mb-1 block text-[7px] font-bold uppercase tracking-[0.15em] text-wine"
                  >
                    Your Blessing or Prayer
                  </label>

                  <textarea
                    id="blessing-message"
                    value={message}
                    onChange={(event) =>
                      setMessage(event.target.value)
                    }
                    placeholder="Write your blessing or prayer..."
                    maxLength={2000}
                    rows={4}
                    className="w-full resize-none rounded-[11px] border border-wine/10 bg-white/80 px-3 py-2.5 text-xs leading-5 text-ink outline-none transition placeholder:text-ink-soft/45 focus:border-emerald focus:ring-2 focus:ring-emerald/10"
                  />

                  <div className="mt-0.5 text-right text-[7px] text-ink-soft/50">
                    {message.length}/2000
                  </div>
                </div>

                {/* FEEDBACK */}

                {error && (
                  <div
                    className="rounded-[9px] bg-wine/5 px-3 py-2 text-[9px] font-semibold text-wine"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                {success && (
                  <div
                    className="rounded-[9px] bg-emerald/10 px-3 py-2 text-[9px] font-semibold text-emerald"
                    role="status"
                  >
                    {success}
                  </div>
                )}

                {/* SUBMIT */}

                <div className="flex justify-end pt-0.5">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full bg-wine px-4 text-[8px] font-bold uppercase tracking-[0.1em] text-white shadow-[0_5px_14px_rgba(84,26,42,0.16)] transition-all duration-200 hover:bg-wine-dark disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send className="h-3 w-3" />

                    {submitting
                      ? 'Sending...'
                      : 'Send Your Blessing'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* ============================================================
            BLESSINGS WALL
            ============================================================ */}

        <div className="mt-7">
          <div className="mb-4 flex items-center justify-center gap-2.5">
            <span className="h-px w-7 bg-wine/15" />

            <Heart className="h-3 w-3 fill-wine text-wine/55" />

            <p className="text-[7px] font-bold uppercase tracking-[0.22em] text-emerald">
              Words from Family &amp; Friends
            </p>

            <span className="h-px w-7 bg-wine/15" />
          </div>

          {loading ? (
            <div className="rounded-[18px] border border-wine/10 bg-ivory/70 px-5 py-8 text-center shadow-sm">
              <p className="text-[10px] text-ink-soft">
                Loading blessings and prayers...
              </p>
            </div>
          ) : entries.length === 0 ? (
            <div className="rounded-[18px] border border-wine/10 bg-ivory/70 px-5 py-8 text-center shadow-sm">
              <p className="font-[family-name:var(--font-cormorant)] text-lg font-semibold text-wine">
                Be the first to leave a blessing.
              </p>

              <p className="mt-1 text-[10px] text-ink-soft">
                Your words will become part of their wedding
                story.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {entries.map((entry) => (
                  <article
                    key={entry.id}
                    className="relative overflow-hidden rounded-[16px] border border-wine/10 bg-ivory/75 p-3.5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="absolute left-0 top-0 h-full w-1 bg-emerald" />

                    <div className="pl-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-[family-name:var(--font-cormorant)] text-base font-semibold leading-none text-wine">
                          {entry.name}
                        </p>

                        <Heart className="mt-0.5 h-3 w-3 shrink-0 text-emerald" />
                      </div>

                      <p className="mt-2.5 whitespace-pre-wrap text-[10px] leading-4.5 text-ink-soft">
                        {entry.message}
                      </p>

                      <p className="mt-2.5 text-[6.5px] font-semibold uppercase tracking-[0.12em] text-emerald/70">
                        With love for Joseph &amp; Praise
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              {/* SEE MORE */}

              {hasMore && (
                <div className="mt-5 flex justify-center">
                  <button
                    type="button"
                    onClick={loadMoreEntries}
                    disabled={loadingMore}
                    className="inline-flex h-9 items-center justify-center rounded-full border border-wine/15 bg-ivory/80 px-5 text-[8px] font-bold uppercase tracking-[0.12em] text-wine shadow-sm transition-all duration-200 hover:border-emerald/30 hover:bg-emerald/5 hover:text-emerald disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loadingMore
                      ? 'Loading...'
                      : 'See More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}