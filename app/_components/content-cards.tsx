import type { ContentItem, Program } from '@/app/_lib/types';

export function ContentCards({ items }: { items: ContentItem[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(item => (
        <article key={item._id} className="overflow-hidden rounded-2xl border border-[#e9dfd2] bg-white p-6 shadow-sm">
          <div className="mb-5 grid aspect-[4/3] place-items-center rounded-xl bg-gradient-to-br from-[#f6ede1] to-[#ead1ad] font-serif text-4xl text-[#6d2635]">
            {item.title.slice(0, 1)}
          </div>
          {item.subtitle && <p className="text-xs font-bold uppercase tracking-wider text-[#bd8c3d]">{item.subtitle}</p>}
          <h2 className="mt-2 font-serif text-2xl text-[#6d2635]">{item.title}</h2>
          {item.description && <p className="mt-3 text-sm leading-6 text-stone-600">{item.description}</p>}
        </article>
      ))}
    </div>
  );
}

export function ProgramCards({ programs }: { programs: Program[] }) {
  return (
    <div className="space-y-6">
      {programs.map((program, index) => (
        <article key={program._id} className="overflow-hidden rounded-2xl border border-[#e9dfd2] bg-white shadow-sm">
          <div className="grid gap-6 p-6 sm:grid-cols-[150px_1fr] sm:p-8">
            <div className="rounded-xl bg-[#6d2635] p-5 text-center text-white">
              <p className="text-xs font-bold uppercase tracking-wider text-[#e5bd77]">Event {index + 1}</p>
              <p className="mt-3 font-serif text-2xl">{program.time}</p>
            </div>
            <div>
              <h2 className="font-serif text-3xl text-[#6d2635]">{program.title}</h2>
              <p className="mt-2 text-sm font-medium text-stone-500">{program.date} · {program.venueName}</p>
              <p className="mt-3 text-sm leading-6 text-stone-600">{program.description}</p>
              {program.dressCode && <p className="mt-3 text-sm font-semibold text-[#6d2635]">Dress code: {program.dressCode}</p>}
              <ol className="mt-5 space-y-2 border-l border-[#d9c6ae] pl-5 text-sm text-stone-700">
                {program.items.map(item => <li key={item.title}>{item.title}{item.detail ? ` — ${item.detail}` : ''}</li>)}
              </ol>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
