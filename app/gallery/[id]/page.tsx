import type {
  Metadata,
} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Download,
  Heart,
  Play,
  Share2,
} from 'lucide-react';
import { ObjectId } from 'mongodb';

import clientPromise from '@/lib/mongodb';
import {
  toGalleryItemResponse,
  type GalleryItemDocument,
} from '@/lib/gallery';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getGalleryItem(
  id: string,
) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const client =
    await clientPromise;

  const db =
    client.db(
      process.env.MONGODB_DB,
    );

  const item =
    await db
      .collection('gallery')
      .findOne({
        _id: new ObjectId(id),
      });

  if (!item) {
    return null;
  }

  return toGalleryItemResponse(
    item as GalleryItemDocument,
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  const item =
    await getGalleryItem(id);

  if (!item) {
    return {
      title: "OASIS'26 Gallery",
      description:
        "A beautiful moment from OASIS'26.",
    };
  }

  const title =
    "A Moment from OASIS'26";

  const description =
    "A beautiful memory from OASIS'26.";

  const mediaUrl =
    item.secureUrl;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    'http://localhost:3000';

  const pageUrl =
    `${siteUrl}/gallery/media/${item.id}`;

  return {
    title,
    description,

    metadataBase:
      new URL(siteUrl),

    alternates: {
      canonical: pageUrl,
    },

    openGraph: {
      title,
      description,
      type:
        item.resourceType ===
        'image'
          ? 'article'
          : 'video.other',

      url: pageUrl,

      siteName:
        "OASIS'26",

      ...(item.resourceType ===
      'image'
        ? {
            images: [
              {
                url: mediaUrl,
                width:
                  item.width ?? 1200,
                height:
                  item.height ?? 1200,
                alt:
                  "OASIS'26 gallery photograph",
              },
            ],
          }
        : {}),
    },

    twitter: {
      card:
        item.resourceType ===
        'image'
          ? 'summary_large_image'
          : 'player',

      title,
      description,

      ...(item.resourceType ===
      'image'
        ? {
            images: [
              mediaUrl,
            ],
          }
        : {}),
    },
  };
}

export default async function GalleryMediaPage({
  params,
}: PageProps) {
  const { id } = await params;

  const item =
    await getGalleryItem(id);

  if (!item) {
    notFound();
  }

  const galleryHref =
    `/gallery?section=${item.section}`;

  const downloadHref =
    `/api/gallery/${item.id}/download`;

  const shareHref =
    `/gallery/media/${item.id}#share`;

  return (
    <main className="min-h-screen bg-cream px-2.5 pb-8 pt-20 sm:px-5 sm:pb-10 sm:pt-24">
      <div className="mx-auto max-w-5xl">

        {/* ===================================================== */}
        {/* TOP BAR */}
        {/* ===================================================== */}

        <div className="flex items-center justify-between gap-3">
          <Link
            href={galleryHref}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-sand-dark/70 bg-white px-3 text-[9px] font-bold uppercase tracking-[0.1em] text-ink shadow-sm transition hover:bg-sand sm:h-9 sm:px-3.5 sm:text-[10px]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Gallery
          </Link>

          <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-emerald sm:text-[10px]">
            OASIS&apos;26
          </p>
        </div>

        {/* ===================================================== */}
        {/* MEDIA */}
        {/* ===================================================== */}

        <div className="mt-3 overflow-hidden rounded-[18px] border border-sand-dark/70 bg-white shadow-lg sm:mt-5 sm:rounded-[26px]">
          <div className="relative flex min-h-[45vh] items-center justify-center bg-ink p-2 sm:min-h-[60vh] sm:p-5">
            {item.resourceType ===
            'image' ? (
              <div className="relative flex max-h-[72vh] w-full items-center justify-center">
                <Image
                  src={item.secureUrl}
                  alt={
                    item.originalFilename ||
                    "OASIS'26 gallery photograph"
                  }
                  width={
                    item.width ?? 1600
                  }
                  height={
                    item.height ?? 1200
                  }
                  sizes="(max-width: 640px) 96vw, (max-width: 768px) 94vw, 90vw"
                  className="max-h-[72vh] w-auto max-w-full object-contain"
                  priority
                />
              </div>
            ) : (
              <div className="relative flex w-full max-w-4xl items-center justify-center">
                <video
                  src={item.secureUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="mx-auto max-h-[72vh] w-auto max-w-full rounded-[14px] object-contain sm:rounded-[22px]"
                />

                <div className="pointer-events-none absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-ink/65 px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-[0.1em] text-white backdrop-blur-md sm:left-4 sm:top-4 sm:px-3 sm:py-2 sm:text-[10px]">
                  <Play className="h-3 w-3 fill-current sm:h-3.5 sm:w-3.5" />
                  OASIS&apos;26
                </div>
              </div>
            )}
          </div>

          {/* =================================================== */}
          {/* DETAILS / ACTIONS */}
          {/* =================================================== */}

          <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="min-w-0">
              <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-emerald sm:text-[9px]">
                {item.section ===
                'pre-wedding'
                  ? 'Pre-Wedding'
                  : 'Live Gallery'}
              </p>

              <h1 className="mt-0.5 font-[family-name:var(--font-cormorant)] text-2xl font-semibold leading-none text-wine sm:text-3xl">
                A Beautiful Moment
              </h1>

              <p className="mt-1 truncate text-[9px] text-ink-soft sm:text-[10px]">
                {item.originalFilename}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href={downloadHref}
                download
                className="inline-flex h-8 items-center gap-1.5 rounded-full border border-sand-dark/70 bg-white px-3 text-[8px] font-bold uppercase tracking-[0.1em] text-ink shadow-sm transition hover:bg-cream sm:h-9 sm:px-3.5 sm:text-[9px]"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </a>

              <a
                href={shareHref}
                className="inline-flex h-8 items-center gap-1.5 rounded-full bg-wine px-3 text-[8px] font-bold uppercase tracking-[0.1em] text-white shadow-sm transition hover:bg-wine/90 sm:h-9 sm:px-3.5 sm:text-[9px]"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share
              </a>

              <div
                className="inline-flex h-8 items-center gap-1 rounded-full bg-cream px-2.5 text-[9px] font-semibold text-wine sm:h-9 sm:px-3 sm:text-[10px]"
                aria-label={`${item.likes} likes`}
              >
                <Heart className="h-3.5 w-3.5" />
                {item.likes}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}