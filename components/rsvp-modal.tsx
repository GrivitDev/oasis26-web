'use client';

import { FormEvent, useState } from 'react';
import { X } from 'lucide-react';

type RsvpModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function RsvpModal({
  open,
  onClose,
}: RsvpModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!open) {
    return null;
  }

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError('');

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      setError('Please enter your name.');
      return;
    }

    if (!trimmedPhone) {
      setError('Please enter your phone number.');
      return;
    }

    const recipient =
      process.env.NEXT_PUBLIC_RSVP_WHATSAPP_NUMBER?.replace(
        /\D/g,
        '',
      );

    if (!recipient) {
      setError(
        'The RSVP WhatsApp number has not been configured.',
      );
      return;
    }

    const phoneDigits =
      trimmedPhone.replace(/\D/g, '');

    if (
      phoneDigits.length < 7 ||
      phoneDigits.length > 15
    ) {
      setError(
        'Please enter a valid phone number.',
      );
      return;
    }

    setSubmitting(true);

    const message = [
      "Hello, I'd like to RSVP for OASIS'26.",
      '',
      `Name: ${trimmedName}`,
      `Phone: ${trimmedPhone}`,
    ].join('\n');

    const whatsappUrl =
      `https://wa.me/${recipient}?text=${encodeURIComponent(
        message,
      )}`;

    window.location.href = whatsappUrl;
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-wine/35 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rsvp-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-sm overflow-hidden rounded-[22px] border border-white/70 bg-ivory shadow-[0_20px_60px_rgba(84,26,42,0.28)]">
        {/* TOP ACCENT */}

        <div className="h-1 w-full bg-gradient-to-r from-emerald via-mint to-wine" />

        {/* CLOSE */}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close RSVP"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-wine/5 text-wine transition hover:bg-wine/10"
        >
          <X className="h-4 w-4" />
        </button>

        {/* CONTENT */}

        <div className="px-5 pb-5 pt-6 sm:px-6 sm:pb-6">
          <div className="mb-5 pr-10">
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-emerald">
              OASIS&apos;26
            </p>

            <h2
              id="rsvp-modal-title"
              className="mt-1 font-[family-name:var(--font-cormorant)] text-2xl font-bold text-wine"
            >
              RSVP
            </h2>

            <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
              Please enter your details and
              continue to WhatsApp.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-3.5"
          >
            {/* NAME */}

            <div>
              <label
                htmlFor="rsvp-name"
                className="mb-1 block text-[9px] font-bold uppercase tracking-[0.12em] text-wine"
              >
                Full Name
              </label>

              <input
                id="rsvp-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Enter your name"
                autoComplete="name"
                className="h-10 w-full rounded-[11px] border border-wine/15 bg-white/75 px-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/50 focus:border-emerald focus:ring-2 focus:ring-emerald/10"
              />
            </div>

            {/* PHONE */}

            <div>
              <label
                htmlFor="rsvp-phone"
                className="mb-1 block text-[9px] font-bold uppercase tracking-[0.12em] text-wine"
              >
                Phone Number
              </label>

              <input
                id="rsvp-phone"
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                placeholder="Enter your phone number"
                autoComplete="tel"
                inputMode="tel"
                className="h-10 w-full rounded-[11px] border border-wine/15 bg-white/75 px-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/50 focus:border-emerald focus:ring-2 focus:ring-emerald/10"
              />
            </div>

            {/* ERROR */}

            {error && (
              <p
                className="rounded-[10px] bg-wine/5 px-3 py-2 text-[10px] font-semibold leading-relaxed text-wine"
                role="alert"
              >
                {error}
              </p>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={submitting}
              className="flex h-10 w-full items-center justify-center rounded-full bg-wine px-4 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_5px_14px_rgba(84,26,42,0.18)] transition-all duration-200 hover:bg-wine-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? 'Opening WhatsApp...'
                : 'Continue to WhatsApp'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}