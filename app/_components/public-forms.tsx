'use client';

import { FormEvent, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { submitPublicForm } from '@/app/_lib/api';

const fieldClass = 'mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none ring-[#bd8c3d] focus:ring-2';

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button type="submit" disabled={loading} className="inline-flex items-center justify-center rounded-full bg-[#6d2635] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4d1723] disabled:opacity-60">
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {label}
    </button>
  );
}

export function RsvpForm() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus('');
    const form = new FormData(event.currentTarget);

    try {
      await submitPublicForm('/rsvp', {
        name: form.get('name'),
        phone: form.get('phone'),
        email: form.get('email'),
        attendance: form.get('attendance'),
        guests: Number(form.get('guests')),
        events: form.getAll('events'),
        message: form.get('message'),
      });
      event.currentTarget.reset();
      setStatus('Thank you. Your RSVP has been received.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to submit your RSVP.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-[#e9dfd2] bg-white p-6 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium">Full name<input name="name" required className={fieldClass} /></label>
        <label className="text-sm font-medium">Phone number<input name="phone" required type="tel" className={fieldClass} /></label>
        <label className="text-sm font-medium">Email address<input name="email" type="email" className={fieldClass} /></label>
        <label className="text-sm font-medium">Will you attend?<select name="attendance" className={fieldClass} defaultValue="confirmed"><option value="confirmed">Joyfully accepts</option><option value="declined">Regretfully declines</option></select></label>
        <label className="text-sm font-medium">Number attending<select name="guests" className={fieldClass} defaultValue="1"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></label>
      </div>
      <fieldset><legend className="text-sm font-medium">Events you will attend</legend><div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">{['Wedding Eve', 'Traditional Wedding', 'Church Wedding', 'Reception'].map(event => <label key={event} className="flex items-center gap-2"><input name="events" value={event} type="checkbox" />{event}</label>)}</div></fieldset>
      <label className="block text-sm font-medium">A message for the couple (optional)<textarea name="message" rows={4} className={fieldClass} /></label>
      <SubmitButton loading={loading} label="Send RSVP" />
      {status && <p className="text-sm text-[#6d2635]" role="status">{status}</p>}
    </form>
  );
}

export function PrayerForm() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus('');
    const form = new FormData(event.currentTarget);

    try {
      await submitPublicForm('/prayers', { name: form.get('name'), message: form.get('message') });
      event.currentTarget.reset();
      setStatus('Thank you for your blessing. It will appear after approval.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to submit your message.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-[#6d2635] p-6 text-white sm:p-8">
      <h2 className="font-serif text-3xl">Leave a blessing</h2>
      <label className="block text-sm">Your name<input name="name" required className={`${fieldClass} text-stone-900`} /></label>
      <label className="block text-sm">Prayer or blessing<textarea name="message" required rows={5} className={`${fieldClass} text-stone-900`} /></label>
      <SubmitButton loading={loading} label="Send blessing" />
      {status && <p className="text-sm text-[#f4d89f]" role="status">{status}</p>}
    </form>
  );
}
