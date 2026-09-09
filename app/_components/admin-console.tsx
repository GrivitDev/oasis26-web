'use client';

import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, LogOut, RefreshCw } from 'lucide-react';

import { API_URL } from '@/app/_lib/api';

const sections = [
  ['overview', 'Dashboard'], ['settings', 'Settings'], ['programs', 'Programmes'], ['couple', 'The couple'], ['party', 'Wedding party'],
  ['story', 'Our story'], ['dress-code', 'Dress code'], ['aso-ebi', 'Aso-Ebi'], ['venue', 'Venues'],
  ['accommodation', 'Accommodation'], ['faq', 'FAQ'], ['donor', 'Donors'], ['rsvps', 'RSVPs'],
  ['media', 'Galleries'], ['prayers', 'Prayers'],
];

const contentSections = new Set(['couple', 'party', 'story', 'dress-code', 'aso-ebi', 'venue', 'accommodation', 'faq', 'donor']);

type Dashboard = Record<string, number | boolean>;
type Row = Record<string, unknown> & { _id: string; status?: string; title?: string; name?: string; message?: string };

function getToken() {
  return window.localStorage.getItem('wedding_admin_token') ?? '';
}

async function request<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  const payload = (await response.json().catch(() => ({}))) as T & { message?: string };

  if (!response.ok) {
    throw new Error(payload.message ?? 'The request could not be completed.');
  }

  return payload;
}

function Login({ onLogin }: { onLogin: (token: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.get('email'), password: form.get('password') }),
      });
      const payload = (await response.json().catch(() => ({}))) as { accessToken?: string; message?: string };

      if (!response.ok || !payload.accessToken) {
        throw new Error(payload.message ?? 'Invalid email or password.');
      }

      window.localStorage.setItem('wedding_admin_token', payload.accessToken);
      onLogin(payload.accessToken);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  }

  return <main className="grid min-h-screen place-items-center bg-[#f6ede1] p-5"><form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-7 shadow-xl"><p className="text-xs font-bold uppercase tracking-wider text-[#bd8c3d]">Wedding administration</p><h1 className="mt-2 font-serif text-4xl text-[#6d2635]">Welcome back</h1><p className="mt-3 text-sm text-stone-600">Use the administrator email and password in your backend environment file.</p><label className="mt-6 block text-sm font-medium">Email<input name="email" type="email" required className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2.5" /></label><label className="mt-4 block text-sm font-medium">Password<input name="password" type="password" required className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2.5" /></label><button disabled={loading} className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#6d2635] px-4 py-3 text-sm font-bold text-white disabled:opacity-60">{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Sign in</button>{error && <p className="mt-4 text-sm text-red-700">{error}</p>}</form></main>;
}

function rowTitle(row: Row) {
  return String(row.title ?? row.name ?? row._id);
}

export function AdminConsole({ section }: { section: string }) {
  const [token, setToken] = useState('');
  const [dashboard, setDashboard] = useState<Dashboard>({});
  const [rows, setRows] = useState<Row[]>([]);
  const [settings, setSettings] = useState('{}');
  const [draft, setDraft] = useState('{\n  "title": "",\n  "description": ""\n}');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const endpoint = useMemo(() => {
    if (contentSections.has(section)) return `/admin/content/${section}`;
    if (section === 'rsvps') return '/admin/rsvps';
    if (section === 'media') return '/admin/media';
    if (section === 'prayers') return '/admin/prayers';
    if (section === 'programs') return '/admin/programs';
    return '';
  }, [section]);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setStatus('');

    try {
      if (section === 'overview') {
        setDashboard(await request<Dashboard>('/admin/dashboard', token));
      } else if (section === 'settings') {
        setSettings(JSON.stringify(await request('/admin/settings', token), null, 2));
      } else if (endpoint) {
        setRows(await request<Row[]>(endpoint, token));
      }
    } catch (loadError) {
      setStatus(loadError instanceof Error ? loadError.message : 'Unable to load this section.');
    } finally {
      setLoading(false);
    }
  }, [endpoint, section, token]);

  useEffect(() => setToken(getToken()), []);
  useEffect(() => { void load(); }, [load]);

  async function createOrSave() {
    try {
      const payload = JSON.parse(section === 'settings' ? settings : draft) as Record<string, unknown>;
      const path = section === 'settings' ? '/admin/settings' : endpoint;
      const method = section === 'settings' ? 'PATCH' : 'POST';
      await request(path, token, { method, body: JSON.stringify(payload) });
      setStatus('Saved successfully.');
      await load();
    } catch (saveError) {
      setStatus(saveError instanceof Error ? saveError.message : 'Enter valid JSON before saving.');
    }
  }

  async function updateRow(row: Row, updates: Record<string, unknown>) {
    try {
      await request(`${endpoint}/${row._id}`, token, { method: 'PATCH', body: JSON.stringify(updates) });
      await load();
    } catch (updateError) {
      setStatus(updateError instanceof Error ? updateError.message : 'Unable to update this item.');
    }
  }

  async function deleteRow(row: Row) {
    if (!window.confirm(`Delete ${rowTitle(row)}?`)) return;

    try {
      await request(`${endpoint}/${row._id}`, token, { method: 'DELETE' });
      await load();
    } catch (deleteError) {
      setStatus(deleteError instanceof Error ? deleteError.message : 'Unable to delete this item.');
    }
  }

  if (!token) return <Login onLogin={setToken} />;

  const heading = sections.find(([key]) => key === section)?.[1] ?? 'Dashboard';

  return <main className="min-h-screen bg-[#f6ede1] text-[#24201c]"><div className="mx-auto grid max-w-7xl gap-6 p-5 lg:grid-cols-[220px_1fr]"><aside className="rounded-2xl bg-[#24201c] p-5 text-white lg:min-h-[calc(100vh-2.5rem)]"><Link href="/" className="font-serif text-2xl text-[#e5bd77]">Tolu & Chinedu</Link><p className="mt-2 text-xs text-stone-400">Wedding administration</p><nav className="mt-8 flex gap-1 overflow-x-auto lg:flex-col">{sections.map(([key, label]) => <Link key={key} href={key === 'overview' ? '/admin' : `/admin/${key}`} className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm ${section === key ? 'bg-[#6d2635] text-white' : 'text-stone-300 hover:bg-white/10'}`}>{label}</Link>)}</nav><button type="button" onClick={() => { window.localStorage.removeItem('wedding_admin_token'); setToken(''); }} className="mt-8 inline-flex items-center gap-2 text-sm text-stone-300"><LogOut size={16} />Sign out</button></aside><section><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-[#bd8c3d]">Admin panel</p><h1 className="mt-2 font-serif text-4xl text-[#6d2635]">{heading}</h1></div><button type="button" onClick={() => void load()} className="rounded-full border border-[#6d2635] p-3 text-[#6d2635]" aria-label="Refresh"><RefreshCw size={17} className={loading ? 'animate-spin' : ''} /></button></div>{status && <p className="mt-5 rounded-lg bg-white p-3 text-sm text-[#6d2635]">{status}</p>}{section === 'overview' && <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Object.entries(dashboard).map(([label, value]) => <article key={label} className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-wider text-stone-500">{label.replace(/([A-Z])/g, ' $1')}</p><p className="mt-3 font-serif text-4xl text-[#6d2635]">{typeof value === 'boolean' ? (value ? 'Open' : 'Closed') : value}</p></article>)}</div>}{section === 'settings' && <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm"><p className="text-sm text-stone-600">Edit the site-wide information in JSON, then save. The fields match the public website settings.</p><textarea value={settings} onChange={event => setSettings(event.target.value)} rows={24} className="mt-5 w-full rounded-xl border border-stone-300 p-4 font-mono text-sm" /><button type="button" onClick={() => void createOrSave()} className="mt-4 rounded-full bg-[#6d2635] px-5 py-3 text-sm font-bold text-white">Save settings</button></div>}{endpoint && <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]"><div className="overflow-hidden rounded-2xl bg-white shadow-sm"><div className="border-b border-stone-200 p-5"><h2 className="font-serif text-2xl text-[#6d2635]">Existing items</h2></div><div className="divide-y divide-stone-100">{rows.map(row => <article key={row._id} className="flex flex-wrap items-center justify-between gap-3 p-5"><div><h3 className="font-semibold">{rowTitle(row)}</h3><p className="mt-1 max-w-xl text-sm text-stone-500">{String(row.description ?? row.message ?? row.status ?? '')}</p></div><div className="flex gap-2">{row.status && row.status !== 'approved' && <button type="button" onClick={() => void updateRow(row, { status: 'approved' })} className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800">Approve</button>}{row.status && row.status !== 'hidden' && <button type="button" onClick={() => void updateRow(row, { status: 'hidden' })} className="rounded-lg bg-stone-100 px-3 py-2 text-xs font-bold">Hide</button>}<button type="button" onClick={() => void deleteRow(row)} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700">Delete</button></div></article>)}{!rows.length && <p className="p-8 text-sm text-stone-500">No records yet.</p>}</div></div>{!['rsvps', 'media', 'prayers'].includes(section) && <div className="h-fit rounded-2xl bg-white p-5 shadow-sm"><h2 className="font-serif text-2xl text-[#6d2635]">Add new item</h2><p className="mt-2 text-sm text-stone-600">Enter the record as JSON. For programmes use title, date, time, venueName, address, and items.</p><textarea value={draft} onChange={event => setDraft(event.target.value)} rows={16} className="mt-4 w-full rounded-xl border border-stone-300 p-3 font-mono text-xs" /><button type="button" onClick={() => void createOrSave()} className="mt-4 rounded-full bg-[#6d2635] px-4 py-2.5 text-sm font-bold text-white">Create item</button></div>}</div>}</section></div></main>;
}
