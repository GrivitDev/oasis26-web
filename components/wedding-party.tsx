// src/components/wedding-party.tsx

'use client';

import Image from 'next/image';
import { useState } from 'react';

const weddingParty = [
  {
    title: 'Ring Bearer',
    names: [
      'Peniel Yesoko Victor-Bako',
      'Kemuel Alubarikasoko Akale',
      'Othniel Yakpesoko Victor-Bako',
    ],
    accent: 'wine',
  },
  {
    title: 'Little Bride',
    names: ['Na’ima Yahaya-Shuaibu', 'Joan Ejiri', 'Karis Nasarasoko Akale'],
    accent: 'mint',
  },
  {
    title: 'Best Man',
    names: ['Innocent Richard'],
    accent: 'emerald',
  },
  {
    title: 'Maid of Honour',
    names: ['Precious Ajawo'],
    accent: 'wine',
  },
  {
    title: 'Groomsmen',
    names: [
      'Christopher Onotu Pius',
      'Dr. Gideon Ibrahim',
      'Wisdom Ajawo',
      'Marvelous Clement',
      'Oluwapalumi Israel Olajide',
      'Pst. Ifeoluwa Stephen Onigbinde',
      'Min. Joseph Sule',
      'Jonathan Yisa',
      'Oliver Ifediora',
      'Emmanuel Olobayo',
      'Pst. Olua Emmanuel Onaga',
    ],
    accent: 'emerald',
  },
  {
    title: 'Bridal Train',
    names: [
      'Jigah Esther',
      'Jigah Marvelous',
      'Anastasia Ojeba',
      'Mariam Muhammed',
      'Felicia Elokun',
      'Petra Eddy',
      'Favour Akanya',
      'Comfort Amlabu',
      'Yekoapke Ganya',
      'Zainab Musa',
      'Peculier Opaluwa',
      'Ada Ushaba',
      'Sumeya Momoh',
      'Sephatu Momoh',
      'Victory Aku',
      'Mercy Uzongu',
    ],
    accent: 'mint',
  },
];

const accentClasses = {
  wine: {
    bar: 'bg-wine',
    text: 'text-wine',
    soft: 'bg-wine-soft',
    line: 'bg-wine/25',
  },
  mint: {
    bar: 'bg-mint-dark',
    text: 'text-emerald',
    soft: 'bg-mint-light',
    line: 'bg-mint-dark/30',
  },
  emerald: {
    bar: 'bg-emerald',
    text: 'text-emerald',
    soft: 'bg-emerald-soft',
    line: 'bg-emerald/25',
  },
} as const;

function PartyCard({
  title,
  names,
  accent,
}: {
  title: string;
  names: string[];
  accent: keyof typeof accentClasses;
}) {
  const [expanded, setExpanded] = useState(false);
  const styles = accentClasses[accent];
  const hasMore = names.length > 3;
  const visibleNames = expanded ? names : names.slice(0, 3);

  return (
    <article className="relative overflow-hidden rounded-[18px] border border-sand-dark/60 bg-white/80 shadow-sm backdrop-blur-md">
      <div className={`absolute left-0 top-0 h-full w-1 ${styles.bar}`} />

      <div className="p-3.5 pl-4.5 sm:p-4 sm:pl-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className={`h-px w-5 shrink-0 ${styles.line}`} />

            <p
              className={`truncate text-[8px] font-bold uppercase tracking-[0.2em] ${styles.text}`}
            >
              {title}
            </p>
          </div>

          {hasMore && (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className={`shrink-0 rounded-full px-2 py-1 text-[7px] font-bold uppercase tracking-[0.1em] ${styles.soft} ${styles.text}`}
              aria-expanded={expanded}
            >
              {expanded ? 'Collapse' : `+${names.length - 3} more`}
            </button>
          )}
        </div>

        <div className="mt-1 grid gap-x-4 sm:grid-cols-2">
          {visibleNames.map((name) => (
            <p
              key={name}
              className="border-b border-sand/50 py-1 font-[family-name:var(--font-cormorant)] text-sm font-semibold leading-[1.15] text-wine sm:text-[15px]"
            >
              {name}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}

export function WeddingParty() {
  return (
    <section
      id="wedding-party"
      className="relative overflow-hidden bg-ivory px-3 py-4 sm:px-3 sm:py-4"
    >
      {/* Background details */}
      <div className="pointer-events-none absolute -left-24 top-8 h-52 w-52 rounded-full bg-wine/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-8 h-60 w-60 rounded-full bg-mint/30 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mx-auto max-w-xl text-center">
          <p className="font-[family-name:var(--font-great-vibes)] text-2xl text-wine sm:text-3xl">
            Standing with us
          </p>

          <h2 className="mt-1 font-[family-name:var(--font-cormorant)] text-4xl font-semibold leading-[0.9] text-emerald sm:text-5xl">
            The Wedding Party
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-xs leading-5 text-ink-soft sm:text-sm">
            The beautiful people standing beside us on this special day.
          </p>
        </div>

{/* Bride + Groom */}
<div className="mx-auto mt-6 flex max-w-2xl gap-2 sm:mt-8 sm:gap-4">
  {/* Groom */}
  <div className="relative min-w-0 flex-1 overflow-hidden rounded-[20px] border border-wine/15 bg-wine-soft/70">
    <div className="relative aspect-[3/4]">
      <Image
        src="/groom.jpg"
        alt="Groom"
        fill
        priority
        sizes="(min-width: 640px) 300px, 50vw"
        className="object-cover object-top"
      />

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-wine via-wine/30 to-transparent px-3 pb-3 pt-10">
        <p className="font-[family-name:var(--font-great-vibes)] text-xl leading-none text-white sm:text-2xl">
          Joseph
        </p>

        <p className="mt-0.5 text-[6px] font-bold uppercase tracking-[0.18em] text-mint">
          The Groom
        </p>
      </div>
    </div>
  </div>

  {/* Bride */}
  <div className="relative min-w-0 flex-1 overflow-hidden rounded-[20px] border border-emerald/15 bg-mint-light/70">
    <div className="relative aspect-[3/4]">
      <Image
        src="/bride.jpg"
        alt="Bride"
        fill
        priority
        sizes="(min-width: 640px) 300px, 50vw"
        className="object-cover object-top"
      />

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-emerald via-emerald/30 to-transparent px-3 pb-3 pt-10">
        <p className="font-[family-name:var(--font-great-vibes)] text-xl leading-none text-white sm:text-2xl">
          Praise
        </p>

        <p className="mt-0.5 text-[6px] font-bold uppercase tracking-[0.18em] text-mint">
          The Bride
        </p>
      </div>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-emerald via-emerald/30 to-transparent px-3 pb-3 pt-10">
                <p className="font-[family-name:var(--font-great-vibes)] text-xl leading-none text-white sm:text-2xl">
                  Praise
                </p>

                <p className="mt-0.5 text-[6px] font-bold uppercase tracking-[0.18em] text-mint">
                  The Bride
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Party list */}
        <div className="mx-auto mt-5 max-w-5xl sm:mt-7">
          <div className="grid gap-2.5 md:grid-cols-2">
            {weddingParty.map((group) => (
              <PartyCard
                key={group.title}
                title={group.title}
                names={group.names}
                accent={group.accent as keyof typeof accentClasses}
              />
            ))}
          </div>
        </div>

        {/* Closing ornament */}
        <div className="mt-6 flex items-center justify-center gap-2 sm:mt-8">
          <span className="h-px w-7 bg-wine/20" />
          <span className="h-1.5 w-1.5 rotate-45 bg-mint-dark" />

          <p className="font-[family-name:var(--font-great-vibes)] text-xl text-wine sm:text-2xl">
            Surrounded by love
          </p>

          <span className="h-1.5 w-1.5 rotate-45 bg-emerald-light" />
          <span className="h-px w-7 bg-emerald/20" />
        </div>
      </div>
    </section>
  );
}