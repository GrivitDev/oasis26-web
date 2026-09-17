// components/church-wedding/church-wedding-program.tsx

'use client';

import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { useRef, useState } from 'react';

import { processionalHymn } from './processional-hymn.config';
import { introduction } from './introduction.config';
import { declarations } from './declarations.config';
import { hymnAllToJesus } from './hymn-all-to-jesus.config';
import { theMarriage } from './the-marriage.config';
import { acclamation } from './acclamation.config';
import { hymnTheVoiceThatBreathedOerEden } from './hymn-the-voice-that-breathed-oer-eden.config';
import { ministryOfTheWord } from './ministry-of-the-word.config';
import { oldTestamentGenesis21825 } from './old-testament-genesis-2-18-25.config';
import { psalm128 } from './psalm-128.config';
import { epistleEphesians52133 } from './epistle-ephesians-5-21-33.config';
import { gradualHymnGodGiveUsChristianHomes } from './gradual-hymn-god-give-us-christian-homes.config';
import { gospelMatthew72129 } from './gospel-matthew-7-21-29.config';
import { sermon } from './sermon.config';
import { hymnOPerfectLove } from './hymn-o-perfect-love.config';
import { prayers } from './prayers.config';
import { preparation } from './preparation.config';
import { eucharisticPrayer1 } from './eucharistic-prayer-1.config';
import { agnusDei } from './agnus-dei.config';
import { prayerOfHumbleAccess } from './prayer-of-humble-access.config';
import { distributionOfEucharisticElements } from './distribution-of-eucharistic-elements.config';
import { communionDistribution } from './communion-distribution.config';
import { communionHymns } from './communion-hymns.config';
import { ablutionHymn } from './ablution-hymn.config';
import { postCommunionSentence } from './post-communion-sentence.config';
import { postCommunionPrayers } from './post-communion-prayers.config';
import { conclusion } from './conclusion.config';
import { withdrawalHymnToGodBeTheGlory } from './withdrawal-hymn.config';

import type {
  ChurchWeddingConfig,
  ChurchWeddingContentBlock,
  ChurchWeddingHymnVerse,
} from './church-wedding-program.types';

const programmeItems: ChurchWeddingConfig[] = [
  processionalHymn,
  introduction as ChurchWeddingConfig,
  declarations as ChurchWeddingConfig,
  hymnAllToJesus,
  theMarriage as ChurchWeddingConfig,
  acclamation,
  hymnTheVoiceThatBreathedOerEden,

  {
    ...ministryOfTheWord,

    content: [
      ...(Array.isArray(ministryOfTheWord.content)
        ? ministryOfTheWord.content
        : []),

      {
        type: 'subsection',
        number: '08A',
        title: oldTestamentGenesis21825.title,
        content: buildScriptureBlocks(oldTestamentGenesis21825),
      },

      {
        type: 'subsection',
        number: '08B',
        title: psalm128.title,
        content: buildScriptureBlocks(psalm128),
      },

      {
        type: 'subsection',
        number: '08C',
        title: epistleEphesians52133.title,
        content: buildScriptureBlocks(epistleEphesians52133),
      },
    ],
  },

  gradualHymnGodGiveUsChristianHomes,
  gospelMatthew72129,
  sermon,
  hymnOPerfectLove,
  prayers,
  preparation,
  eucharisticPrayer1,
  agnusDei,
  prayerOfHumbleAccess,
  distributionOfEucharisticElements,
  communionDistribution,
  communionHymns,
  ablutionHymn,
  postCommunionSentence,
  postCommunionPrayers,
  conclusion,
  withdrawalHymnToGodBeTheGlory,
];

const ministers = [
  'All the Priests',
  'All Supervising Priests',
  'Ven. J. Ogunmola (Assisting Priest)',
  'Ven. Dr. J. C. Egbeja (Vicar)',
  'The Most Rev. Dr. Emmanuel A.S. Egbunu — Diocesan Bishop',
];

export default function ChurchWeddingProgram() {
  const [openNumber, setOpenNumber] = useState<string | null>(null);

  const itemRefs = useRef<Record<string, HTMLElement | null>>({});

  const toggleItem = (number: string) => {
    const nextOpenNumber =
      openNumber === number ? null : number;

    setOpenNumber(nextOpenNumber);

    if (nextOpenNumber) {
      window.setTimeout(() => {
        itemRefs.current[nextOpenNumber]?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 350);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-cream px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald">
            OASIS&apos;26
          </p>

          <h1 className="mt-2.5 font-[family-name:var(--font-cormorant)] text-5xl font-semibold leading-none text-wine sm:text-6xl">
            Church Wedding
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-5 text-ink-soft sm:text-base sm:leading-6">
            The order of service for the solemnization of our marriage.
          </p>
        </header>

        {/* Officiating Ministers */}
        <section className="mx-auto mt-9 max-w-5xl sm:mt-12">
          <article className="relative overflow-hidden rounded-[24px] border border-sand-dark/70 bg-white/95 p-4 shadow-sm backdrop-blur-[3px] sm:p-6">
            <div className="absolute inset-y-0 left-0 w-1 bg-emerald" />

            <div className="pl-2 sm:pl-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald">
                Officiating Ministers
              </p>

              <h2 className="mt-1.5 font-[family-name:var(--font-cormorant)] text-3xl font-semibold leading-tight text-wine sm:text-4xl">
                Ministers of the Service
              </h2>

              <div className="mt-3.5 space-y-2 sm:mt-4 sm:space-y-2.5">
                {ministers.map((minister, index) => (
                  <div
                    key={`${index}-${minister}`}
                    className="flex items-start gap-3 text-sm leading-5 text-ink-soft sm:text-base sm:leading-6"
                  >
                    <span className="shrink-0 font-[family-name:var(--font-cormorant)] text-xl font-semibold leading-none text-wine/50">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <p>{minister}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </section>

        {/* Order of Service */}
        <section className="mx-auto mt-7 max-w-5xl sm:mt-9">
          <div className="space-y-3 sm:space-y-3.5">
            {programmeItems.map((item, index) => {
              const isOpen =
                openNumber === item.number;

              const imageSide =
                index % 2 === 0 ? 'right' : 'left';

              return (
                <article
                  key={`${item.number}-${index}`}
                  ref={(element) => {
                    itemRefs.current[item.number] =
                      element;
                  }}
                  className="scroll-mt-24 relative overflow-hidden rounded-[22px] border border-sand-dark/70 bg-white/95 shadow-sm backdrop-blur-[3px] sm:rounded-[24px]"
                >
                  <div className="relative z-10">
                    {/* Accordion Header */}
                    <button
                      type="button"
                      onClick={() =>
                        toggleItem(item.number)
                      }
                      aria-expanded={isOpen}
                      className="group flex w-full items-start gap-3.5 p-3.5 text-left sm:gap-4 sm:p-4.5"
                    >
                      <span className="shrink-0 pt-0.5 font-[family-name:var(--font-cormorant)] text-xl font-semibold leading-none text-wine/60 sm:text-2xl">
                        {item.number}
                      </span>

                      <div className="min-w-0 flex-1">
                        <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold leading-tight text-wine sm:text-[28px]">
                          {item.title}
                        </h2>

                        <p className="mt-1 max-w-2xl text-xs leading-4.5 text-ink-soft sm:mt-1.5 sm:text-sm sm:leading-5">
                          {item.description}
                        </p>
                      </div>

                      <ChevronDown
                        className={`mt-1 h-5 w-5 shrink-0 text-wine/45 transition-transform duration-300 sm:h-5.5 sm:w-5.5 ${
                          isOpen
                            ? 'rotate-180 text-wine'
                            : ''
                        }`}
                      />
                    </button>

                    {/* Accordion Content */}
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen
                          ? 'grid-rows-[1fr] opacity-100'
                          : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <div className="relative border-t border-sand-dark/50">
                          {/* Mobile background image layer */}
                          {item.images?.length ? (
                            <MobileBackgroundImages
                              images={item.images}
                            />
                          ) : null}

                          <div className="relative z-10 p-3 sm:p-4">
                            {/* Desktop */}
                            <div
                              className={`hidden gap-8 lg:grid lg:items-start ${
                                imageSide === 'right'
                                  ? 'lg:grid-cols-[minmax(0,1fr)_430px]'
                                  : 'lg:grid-cols-[430px_minmax(0,1fr)]'
                              }`}
                            >
                              {imageSide === 'right' ? (
                                <>
                                  <div className="min-w-0 rounded-[21px] border border-sand-dark/35 bg-white/[0.97] p-4 shadow-sm backdrop-blur-md">
                                    <ProgramContent item={item} />
                                  </div>

                                  <DesktopProgramImages
                                    images={
                                      item.images ?? []
                                    }
                                  />
                                </>
                              ) : (
                                <>
                                  <DesktopProgramImages
                                    images={
                                      item.images ?? []
                                    }
                                  />

                                  <div className="min-w-0 rounded-[21px] border border-sand-dark/35 bg-white/[0.97] p-4 shadow-sm backdrop-blur-md">
                                    <ProgramContent item={item} />
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Mobile / Tablet */}
                            <div className="lg:hidden">
                              <div className="rounded-[21px] border border-sand-dark/35 bg-white/[0.94] p-3.5 shadow-sm backdrop-blur-[3px] sm:p-4">
                                <ProgramContent item={item} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

function MobileBackgroundImages({
  images,
}: {
  images: string[];
}) {
  if (!images.length) {
    return null;
  }

  const positions =
    images.length === 1
      ? [
          'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
        ]
      : images.length === 2
        ? [
            '-left-8 top-0',
            '-right-8 bottom-0',
          ]
        : [
            '-left-10 top-0',
            '-right-8 top-1/2 -translate-y-1/2',
            '-left-4 bottom-0',
          ];

  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {images.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className={`absolute ${
              positions[index % positions.length]
            } h-[320px] w-[320px] opacity-[0.28] sm:h-[380px] sm:w-[380px]`}
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-contain drop-shadow-[0_12px_30px_rgba(105,20,45,0.08)]"
            />
          </div>
        ))}
      </div>

      {/* Soft veil over the artwork, while keeping it visibly present */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-cream/[0.42]" />
    </>
  );
}

function DesktopProgramImages({
  images,
}: {
  images: string[];
}) {
  if (!images.length) {
    return null;
  }

  return (
    <div className="flex min-w-0 flex-col items-center justify-start gap-2">
      {images.map((src, index) => (
        <div
          key={`${src}-${index}`}
          className={`relative w-full ${
            images.length === 1
              ? 'h-[430px]'
              : images.length === 2
                ? 'h-[300px]'
                : 'h-[255px]'
          }`}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-contain"
          />
        </div>
      ))}
    </div>
  );
}

function ProgramContent({
  item,
}: {
  item: ChurchWeddingConfig;
}) {
  if (
    item.type === 'hymn' &&
    !Array.isArray(item.content)
  ) {
    return <HymnContent content={item.content} />;
  }

  if (
    item.type === 'scripture' &&
    !Array.isArray(item.content)
  ) {
    return (
      <ScriptureContent
        content={toScriptureContent(item.content)}
      />
    );
  }

  if (
    item.type === 'sermon' &&
    !Array.isArray(item.content)
  ) {
    return <SermonContent content={item.content} />;
  }

  if (
    item.type === 'prayers' &&
    !Array.isArray(item.content) &&
    'prayers' in item.content
  ) {
    return <PrayerContent content={item.content} />;
  }

  if (Array.isArray(item.content)) {
    return (
      <div className="space-y-3">
        {item.content.map((block, index) => (
          <ContentBlock
            key={`${block.type}-${index}`}
            block={block}
          />
        ))}
      </div>
    );
  }

  return null;
}

function ContentBlock({
  block,
}: {
  block: ChurchWeddingContentBlock;
}) {
  switch (block.type) {
    case 'instruction':
      return (
        <p className="text-sm font-medium italic leading-5 text-orange-700 sm:text-[15px] sm:leading-5.5">
          ({block.text})
        </p>
      );

    case 'subheading':
      return (
        <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold leading-tight text-wine sm:text-[26px]">
          {block.text}
        </h3>
      );

    case 'paragraph':
      return (
        <div className="whitespace-pre-line text-sm leading-6 text-ink-soft sm:text-[15px] sm:leading-6.5">
          {block.text}
        </div>
      );

    case 'prayer':
      return (
        <div className="rounded-[17px] border border-sand-dark/50 bg-cream/65 p-3.5 text-sm leading-6 text-ink-soft sm:p-4 sm:text-[15px] sm:leading-6.5">
          {block.text}
        </div>
      );

    case 'question':
      return (
        <div>
          {block.label ? (
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald">
              {block.label}
            </p>
          ) : null}

          <p className="text-[15px] font-medium leading-6 text-wine sm:text-base sm:leading-6.5">
            {block.text}
          </p>
        </div>
      );

    case 'response':
      return (
        <div className="rounded-[17px] border-l-4 border-emerald bg-cream/70 px-3.5 py-2.5 sm:px-4 sm:py-3">
          {block.label ? (
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald">
              {block.label}
            </p>
          ) : null}

          <p className="mt-0.5 font-[family-name:var(--font-cormorant)] text-xl font-semibold leading-tight text-wine sm:text-[22px]">
            {block.text}
          </p>
        </div>
      );

    case 'dialogue':
      return (
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-emerald">
            {block.speaker}
          </p>

          <p className="whitespace-pre-line text-sm leading-6 text-ink-soft sm:text-[15px] sm:leading-6.5">
            {block.text}
          </p>
        </div>
      );

    case 'scripture':
      return (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-emerald">
            {block.reference}
          </p>

          <p className="mt-1 whitespace-pre-line text-sm leading-6 text-ink-soft sm:text-[15px] sm:leading-6.5">
            {block.text}
          </p>
        </div>
      );

    case 'subsection':
      return (
        <div className="space-y-3.5 border-t border-sand-dark/50 pt-3.5 first:border-t-0 first:pt-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald">
              {block.number}
            </p>

            <h3 className="mt-0.5 font-[family-name:var(--font-cormorant)] text-2xl font-semibold leading-tight text-wine sm:text-[26px]">
              {block.title}
            </h3>
          </div>

          <div className="space-y-3.5">
            {block.content.map((nestedBlock, index) => (
              <ContentBlock
                key={`${nestedBlock.type}-${index}`}
                block={nestedBlock}
              />
            ))}
          </div>
        </div>
      );
  }
}

type HymnContentData = {
  hymnNumber?: string;
  hymnTitle?: string;
  author?: string;
  instruction?: string;
  verses?: ChurchWeddingHymnVerse[];
};

function HymnContent({
  content,
}: {
  content: HymnContentData;
}) {
  const verses = Array.isArray(content.verses)
    ? content.verses
    : [];

  return (
    <div className="space-y-4">
      {content.instruction ? (
        <p className="text-sm font-medium italic leading-5 text-orange-700 sm:text-[15px] sm:leading-5.5">
          ({content.instruction})
        </p>
      ) : null}

      <div>
        {content.hymnNumber ? (
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald">
            {content.hymnNumber}
          </p>
        ) : null}

        {content.hymnTitle ? (
          <h3 className="mt-0.5 font-[family-name:var(--font-cormorant)] text-3xl font-semibold leading-tight text-wine sm:text-[34px]">
            {content.hymnTitle}
          </h3>
        ) : null}

        {content.author ? (
          <p className="mt-1 text-xs italic leading-5 text-ink-soft sm:text-sm">
            {content.author}
          </p>
        ) : null}
      </div>

      {verses.map((verse, index) => {
        const lines = Array.isArray(verse)
          ? verse
          : Array.isArray(verse?.lines)
            ? verse.lines
            : [];

        const refrain =
          !Array.isArray(verse) &&
          Array.isArray(verse?.refrain)
            ? verse.refrain
            : [];

        return (
          <div
            key={`verse-${index}`}
            className="rounded-[17px] bg-cream/60 p-3.5 sm:p-4"
          >
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-wine/50">
              Verse {index + 1}
            </p>

            <div className="space-y-0.5 font-[family-name:var(--font-cormorant)] text-lg leading-6.5 text-wine sm:text-xl sm:leading-7">
              {lines.map(
                (line: string, lineIndex: number) => (
                  <p key={`${index}-${lineIndex}`}>
                    {line}
                  </p>
                ),
              )}
            </div>

            {refrain.length > 0 ? (
              <div className="mt-3 border-t border-sand-dark/50 pt-3">
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald">
                  Refrain
                </p>

                <div className="space-y-0.5 font-[family-name:var(--font-cormorant)] text-lg font-semibold leading-6.5 text-wine sm:text-xl sm:leading-7">
                  {refrain.map(
                    (
                      line: string,
                      lineIndex: number,
                    ) => (
                      <p
                        key={`refrain-${index}-${lineIndex}`}
                      >
                        {line}
                      </p>
                    ),
                  )}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

type ScriptureVerseData = {
  number: string;
  text: string;
};

type ScriptureContentData = {
  translation?: string;
  heading?: string;
  subtitle?: string;
  sections?: Array<{
    heading?: string;
    verses?: ScriptureVerseData[];
  }>;
  verses?: ScriptureVerseData[];
};

function toScriptureContent(
  content: Exclude<
    ChurchWeddingConfig['content'],
    ChurchWeddingContentBlock[]
  >,
): ScriptureContentData {
  const verses: ScriptureVerseData[] | undefined = (
    content.verses as unknown[] | undefined
  )?.filter(
    (verse): verse is ScriptureVerseData =>
      !Array.isArray(verse) &&
      typeof verse === 'object' &&
      verse !== null &&
      'number' in verse &&
      typeof verse.number === 'string' &&
      'text' in verse &&
      typeof verse.text === 'string',
  );

  return {
    translation: content.translation,
    heading: content.heading,
    subtitle: content.subtitle,
    sections: content.sections,
    verses,
  };
}

function ScriptureContent({
  content,
}: {
  content: ScriptureContentData;
}) {
  return (
    <div className="space-y-4">
      <div>
        {content.translation ? (
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald">
            {content.translation}
          </p>
        ) : null}

        {content.heading ? (
          <h3 className="mt-1 font-[family-name:var(--font-cormorant)] text-3xl font-semibold leading-tight text-wine">
            {content.heading}
          </h3>
        ) : null}

        {content.subtitle ? (
          <p className="mt-0.5 text-sm italic leading-5 text-ink-soft">
            {content.subtitle}
          </p>
        ) : null}
      </div>

      {content.sections?.map(
        (section, sectionIndex) => (
          <div
            key={`${section.heading ?? 'section'}-${sectionIndex}`}
            className="space-y-3"
          >
            {section.heading ? (
              <h4 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold leading-tight text-wine">
                {section.heading}
              </h4>
            ) : null}

            {section.verses?.map((verse) => (
              <ScriptureVerse
                key={verse.number}
                verse={verse}
              />
            ))}
          </div>
        ),
      )}

      {content.verses?.map((verse) => (
        <ScriptureVerse
          key={verse.number}
          verse={verse}
        />
      ))}
    </div>
  );
}

function ScriptureVerse({
  verse,
}: {
  verse: ScriptureVerseData;
}) {
  return (
    <div className="grid grid-cols-[1.6rem_1fr] gap-2">
      <span className="pt-0.5 font-[family-name:var(--font-cormorant)] text-lg font-semibold leading-none text-wine/50">
        {verse.number}
      </span>

      <p className="whitespace-pre-line text-sm leading-6 text-ink-soft sm:text-[15px] sm:leading-6.5">
        {verse.text}
      </p>
    </div>
  );
}

type PrayerContentData = {
  prayers?: Array<{ text: string }>;
};

function PrayerContent({
  content,
}: {
  content: PrayerContentData;
}) {
  return (
    <div className="space-y-3">
      {content.prayers?.map(
        (
          prayer: { text: string },
          index: number,
        ) => (
          <div
            key={`prayer-${index}`}
            className="rounded-[17px] border border-sand-dark/50 bg-cream/60 p-3.5 text-sm leading-6 text-ink-soft sm:p-4 sm:text-[15px] sm:leading-6.5"
          >
            {prayer.text}
          </div>
        ),
      )}
    </div>
  );
}

type SermonContentData = {
  topic?: string;
  readings?: Array<{
    label: string;
    reference: string;
  }>;
  preacher?: string;
  openingPrayer?: {
    title: string;
    text: string;
  };
  text?: string;
  notes?: string[];
  closingPrayer?: {
    title: string;
    text: string;
  };
};

function SermonContent({
  content,
}: {
  content: SermonContentData;
}) {
  return (
    <div className="space-y-4">
      {content.topic ? (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald">
            Topic
          </p>

          <h3 className="mt-0.5 font-[family-name:var(--font-cormorant)] text-3xl font-semibold leading-tight text-wine sm:text-[34px]">
            {content.topic}
          </h3>
        </div>
      ) : null}

      {content.readings?.length ? (
        <div className="rounded-[17px] border border-sand-dark/50 bg-cream/60 p-3.5 sm:p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald">
            Readings
          </p>

          <div className="mt-2 space-y-2">
            {content.readings.map(
              (
                reading: {
                  label: string;
                  reference: string;
                },
              ) => (
                <div key={reading.reference}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-wine/50">
                    {reading.label}
                  </p>

                  <p className="mt-0.5 font-[family-name:var(--font-cormorant)] text-lg font-semibold leading-tight text-wine">
                    {reading.reference}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      ) : null}

      {content.preacher ? (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald">
            Preacher
          </p>

          <p className="mt-0.5 font-[family-name:var(--font-cormorant)] text-2xl font-semibold leading-tight text-wine">
            {content.preacher}
          </p>
        </div>
      ) : null}

      {content.openingPrayer ? (
        <div>
          <h4 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold leading-tight text-wine">
            {content.openingPrayer.title}
          </h4>

          <p className="mt-1.5 rounded-[17px] bg-cream/60 p-3.5 text-sm leading-6 text-ink-soft sm:p-4 sm:text-[15px] sm:leading-6.5">
            {content.openingPrayer.text}
          </p>
        </div>
      ) : null}

      {content.text ? (
        <div className="whitespace-pre-line text-sm leading-6.5 text-ink-soft sm:text-[15px] sm:leading-7">
          {content.text.trim()}
        </div>
      ) : null}

      {content.notes?.length ? (
        <div>
          <h4 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold leading-tight text-wine">
            Notes
          </h4>

          <div className="mt-2 space-y-1.5">
            {content.notes.map(
              (note: string, index: number) => (
                <p
                  key={`note-${index}`}
                  className="border-l-2 border-emerald pl-3 text-sm leading-6 text-ink-soft"
                >
                  {note}
                </p>
              ),
            )}
          </div>
        </div>
      ) : null}

      {content.closingPrayer ? (
        <div>
          <h4 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold leading-tight text-wine">
            {content.closingPrayer.title}
          </h4>

          <p className="mt-1.5 rounded-[17px] bg-cream/60 p-3.5 text-sm leading-6 text-ink-soft sm:p-4 sm:text-[15px] sm:leading-6.5">
            {content.closingPrayer.text}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function buildScriptureBlocks(
  item: { content?: unknown },
): ChurchWeddingContentBlock[] {
  if (!item.content || Array.isArray(item.content)) {
    return [];
  }

  const content = item.content as {
    translation?: string;
    heading?: string;
    subtitle?: string;
    sections?: Array<{
      heading?: string;
      verses?: Array<{
        number: string;
        text: string;
      }>;
    }>;
    verses?: Array<
      | string[]
      | {
          lines: string[];
          refrain?: string[];
        }
      | {
          number: string;
          text: string;
        }
    >;
  };

  const blocks: ChurchWeddingContentBlock[] = [];

  if (content.translation) {
    blocks.push({
      type: 'instruction',
      text: `Translation: ${content.translation}`,
    });
  }

  if (content.heading) {
    blocks.push({
      type: 'subheading',
      text: content.heading,
    });
  }

  if (content.subtitle) {
    blocks.push({
      type: 'instruction',
      text: content.subtitle,
    });
  }

  if (content.sections) {
    content.sections.forEach((section) => {
      if (section.heading) {
        blocks.push({
          type: 'subheading',
          text: section.heading,
        });
      }

      section.verses?.forEach((verse) => {
        blocks.push({
          type: 'scripture',
          reference: `Verse ${verse.number}`,
          text: verse.text,
        });
      });
    });
  }

  if (content.verses) {
    content.verses.forEach((verse) => {
      if (Array.isArray(verse)) {
        blocks.push({
          type: 'scripture',
          reference: 'Verse',
          text: verse.join('\n'),
        });
      } else if ('lines' in verse) {
        blocks.push({
          type: 'scripture',
          reference: 'Verse',
          text: verse.lines.join('\n'),
        });
      } else {
        blocks.push({
          type: 'scripture',
          reference: `Verse ${verse.number}`,
          text: verse.text,
        });
      }
    });
  }

  return blocks;
}