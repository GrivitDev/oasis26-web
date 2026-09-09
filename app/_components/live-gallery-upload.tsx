'use client';

import { ChangeEvent, useState } from 'react';
import { Loader2, Upload } from 'lucide-react';

import { API_URL } from '@/app/_lib/api';

export function LiveGalleryUpload({ enabled }: { enabled: boolean }) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [caption, setCaption] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  function selectFile(event: ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files?.[0] ?? null);
  }

  async function upload() {
    if (!file || !name) {
      setStatus('Please enter your name and choose a photo or video.');
      return;
    }

    setLoading(true);
    setStatus('');
    const data = new FormData();
    data.append('file', file);
    data.append('uploaderName', name);
    data.append('caption', caption);

    try {
      const response = await fetch(`${API_URL}/public/live-gallery`, { method: 'POST', body: data });
      const payload = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? 'Unable to upload this file.');
      }

      setFile(null);
      setName('');
      setCaption('');
      setStatus('Thank you! Your upload is awaiting approval.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to upload this file.');
    } finally {
      setLoading(false);
    }
  }

  if (!enabled) {
    return <p className="rounded-xl border border-[#e9dfd2] bg-white p-5 text-center text-sm text-stone-600">The live gallery is currently closed. Please check back during the celebration.</p>;
  }

  return (
    <div className="rounded-2xl bg-[#6d2635] p-6 text-white sm:p-8">
      <h2 className="font-serif text-3xl">Share your moment</h2>
      <p className="mt-2 text-sm text-stone-200">Your photo or video will appear after approval.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <input value={name} onChange={event => setName(event.target.value)} placeholder="Your name" className="rounded-lg border-0 px-3 py-2.5 text-sm text-stone-900" />
        <input value={caption} onChange={event => setCaption(event.target.value)} placeholder="Caption (optional)" className="rounded-lg border-0 px-3 py-2.5 text-sm text-stone-900" />
      </div>
      <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-white/50 px-4 py-6 text-sm text-stone-100"><Upload size={18} />{file?.name ?? 'Choose a photo or video'}<input onChange={selectFile} type="file" accept="image/*,video/*" className="sr-only" /></label>
      <button type="button" onClick={upload} disabled={loading} className="mt-4 inline-flex items-center rounded-full bg-[#e5bd77] px-5 py-3 text-sm font-semibold text-[#24201c] disabled:opacity-60">{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Upload to live gallery</button>
      {status && <p className="mt-3 text-sm text-[#f4d89f]" role="status">{status}</p>}
    </div>
  );
}
