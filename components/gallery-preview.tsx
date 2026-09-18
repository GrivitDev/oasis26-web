// src/components/gallery/gallery-preview.tsx

import Image from 'next/image';
import Link from 'next/link';

import clientPromise from '@/lib/mongodb';
import {
  toGalleryItemResponse,
  type GalleryItemDocument,
} from '@/lib/gallery';

type GalleryPreviewItem = ReturnType<
  typeof toGalleryItemResponse
>;

async function getGalleryPreview(): Promise<
  GalleryPreviewItem[]
> {
  try {
    const client = await clientPromise;

    const db = client.db(
      process.env.MONGODB_DB,
    );

    const documents = await db
      .collection('gallery')
      .aggregate([
        {
          $match: {
            section: 'pre-wedding',
            resourceType: 'image',
            secureUrl: {
              $exists: true,
              $ne: '',
            },
          },
        },
        {
          $sample: {
            size: 12,
          },
        },
      ])
      .toArray();

    return documents
      .map((document) =>
        toGalleryItemResponse(
          document as GalleryItemDocument,
        ),
      )
      .filter(
        (item) =>
          Boolean(item.secureUrl),
      );
  } catch (error) {
    console.error(
      'Failed to load gallery preview:',
      error,
    );

    return [];
  }
}

const collageStyles = [
  {
    mobile:
      'col-span-1 row-span-2 aspect-[4/5] rotate-[-2deg]',
    desktop:
      'lg:col-span-1 lg:row-span-2 lg:aspect-[4/5] lg:rotate-[-2deg]',
  },
  {
    mobile:
      'col-span-1 aspect-square rotate-[2deg] translate-y-1',
    desktop:
      'lg:col-span-1 lg:aspect-square lg:rotate-[2deg] lg:translate-y-1',
  },
  {
    mobile:
      'col-span-1 aspect-[4/5] rotate-[-1deg] translate-y-2',
    desktop:
      'lg:col-span-1 lg:aspect-[4/5] lg:rotate-[-1deg] lg:translate-y-2',
  },
  {
    mobile:
      'col-span-2 aspect-[16/10] rotate-[1deg]',
    desktop:
      'lg:col-span-2 lg:aspect-[16/10] lg:rotate-[1deg]',
  },
  {
    mobile:
      'col-span-1 aspect-[4/5] rotate-[2deg] -translate-y-1',
    desktop:
      'lg:col-span-1 lg:aspect-[4/5] lg:rotate-[2deg] lg:-translate-y-1',
  },
  {
    mobile:
      'col-span-1 row-span-2 aspect-[4/5] rotate-[-1deg] translate-y-1',
    desktop:
      'lg:col-span-1 lg:row-span-2 lg:aspect-[4/5] lg:rotate-[-1deg] lg:translate-y-1',
  },
  {
    mobile:
      'col-span-1 aspect-square rotate-[1.5deg]',
    desktop:
      'lg:col-span-1 lg:aspect-square lg:rotate-[1.5deg]',
  },
  {
    mobile:
      'col-span-1 aspect-[4/5] rotate-[-2deg] translate-y-2',
    desktop:
      'lg:col-span-1 lg:aspect-[4/5] lg:rotate-[-2deg] lg:translate-y-2',
  },
  {
    mobile:
      'col-span-2 aspect-[16/10] rotate-[1deg] -translate-y-1',
    desktop:
      'lg:col-span-2 lg:aspect-[16/10] lg:rotate-[1deg] lg:-translate-y-1',
  },
  {
    mobile:
      'col-span-1 aspect-square rotate-[-1deg]',
    desktop:
      'lg:col-span-1 lg:aspect-square lg:rotate-[-1deg]',
  },
  {
    mobile:
      'col-span-1 aspect-[4/5] rotate-[2deg] translate-y-1',
    desktop:
      'lg:col-span-1 lg:aspect-[4/5] lg:rotate-[2deg] lg:translate-y-1',
  },
  {
    mobile:
      'col-span-1 row-span-2 aspect-[4/5] rotate-[-1.5deg]',
    desktop:
      'lg:col-span-1 lg:row-span-2 lg:aspect-[4/5] lg:rotate-[-1.5deg]',
  },
];

export default async function GalleryPreview() {
  const items = await getGalleryPreview();

  if (!items.length) {
    return null;
  }

  return (
    <section
      id="gallery-preview"
      className="relative overflow-hidden bg-cream px-3 py-8 sm:px-5 sm:py-10"
    >
      {/* Soft background glow */}

      <div className="pointer-events-none absolute -left-28 top-0 h-72 w-72 rounded-full bg-mint/20 blur-3xl" />

      <div className="pointer-events-none absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-emerald/15 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {/* HEADER */}

        <div className="mx-auto max-w-xl text-center">
          <p className="text-[7px] font-bold uppercase tracking-[0.28em] text-emerald sm:text-[8px]">
            Pre-Wedding
          </p>

          <h2 className="mt-1 font-[family-name:var(--font-cormorant)] text-3xl font-semibold leading-none text-wine sm:text-4xl">
            Moments of Joy
          </h2>

          <p className="mx-auto mt-2 max-w-md text-[10px] leading-4 text-ink-soft sm:text-xs sm:leading-5">
            A glimpse into some of the beautiful moments
            shared before the big day.
          </p>
        </div>

        {/* SCATTERED COLLAGE */}

        <div className="mt-6 grid grid-cols-3 auto-rows-[92px] items-center gap-2 px-1 sm:auto-rows-[115px] sm:gap-2.5 lg:grid-cols-6 lg:auto-rows-[105px] lg:gap-3">
          {items.map((item, index) => {
            const style =
              collageStyles[
                index %
                  collageStyles.length
              ];

            return (
              <Link
                key={item.id}
                href={`/gallery/${item.id}`}
                className={`group relative block overflow-hidden rounded-[14px] border border-white/80 bg-white p-1 shadow-[0_8px_22px_rgba(84,26,42,0.12)] transition-all duration-300 hover:z-20 hover:scale-[1.03] hover:rotate-0 hover:shadow-[0_14px_30px_rgba(84,26,42,0.18)] sm:rounded-[16px] ${style.mobile} ${style.desktop}`}
                aria-label={`View ${
                  item.originalFilename ||
                  'pre-wedding photo'
                }`}
              >
                <div className="relative h-full w-full overflow-hidden rounded-[10px] sm:rounded-[12px]">
                  <Image
                    src={item.secureUrl}
                    alt={
                      item.originalFilename ||
                      "OASIS'26 pre-wedding photograph"
                    }
                    fill
                    sizes="(max-width: 640px) 32vw, (max-width: 1024px) 30vw, 16vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Soft overlay */}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-wine/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="pointer-events-none absolute inset-x-2 bottom-2 translate-y-2 rounded-full bg-white/90 px-2 py-1 text-center text-[6px] font-bold uppercase tracking-[0.1em] text-wine opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    View Moment
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* EXPLORE */}

        <div className="mt-6 flex justify-center">
          <Link
            href="/gallery?section=pre-wedding"
            className="inline-flex items-center justify-center rounded-full bg-wine px-4 py-2.5 text-[8px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_6px_16px_rgba(84,26,42,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-wine-dark"
          >
            Explore More Moments of Joy
          </Link>
        </div>
      </div>
    </section>
  );
}