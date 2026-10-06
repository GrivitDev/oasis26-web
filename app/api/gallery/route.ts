import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import clientPromise from '@/lib/mongodb';
import {
  GALLERY_PAGE_SIZE,
  GALLERY_SECTIONS,
  toGalleryItemResponse,
  type GallerySection,
} from '@/lib/gallery';
import { ensureGalleryIndexes } from '@/lib/gallery-server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const section = request.nextUrl.searchParams.get('section');

    if (
      section !== GALLERY_SECTIONS.PRE_WEDDING &&
      section !== GALLERY_SECTIONS.LIVE
    ) {
      return NextResponse.json(
        { error: 'Invalid gallery section.' },
        { status: 400 },
      );
    }

    const requestedLimit = Number(
      request.nextUrl.searchParams.get('limit') ?? GALLERY_PAGE_SIZE,
    );

    const limit = Math.min(
      Math.max(
        Number.isFinite(requestedLimit) ? Math.floor(requestedLimit) : GALLERY_PAGE_SIZE,
        1,
      ),
      GALLERY_PAGE_SIZE,
    );

    const beforeCreatedAt =
      request.nextUrl.searchParams.get('beforeCreatedAt');
    const beforeId = request.nextUrl.searchParams.get('beforeId');

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    await ensureGalleryIndexes(db);

    const query: Record<string, unknown> = {
      section: section as GallerySection,
    };

    if (beforeCreatedAt || beforeId) {
      if (!beforeCreatedAt || !beforeId) {
        return NextResponse.json(
          { error: 'Invalid pagination cursor.' },
          { status: 400 },
        );
      }

      const cursorDate = new Date(beforeCreatedAt);

      if (
        Number.isNaN(cursorDate.getTime()) ||
        !ObjectId.isValid(beforeId)
      ) {
        return NextResponse.json(
          { error: 'Invalid pagination cursor.' },
          { status: 400 },
        );
      }

      query.$or = [
        {
          createdAt: {
            $lt: cursorDate,
          },
        },
        {
          createdAt: cursorDate,
          _id: {
            $lt: new ObjectId(beforeId),
          },
        },
      ];
    }

    const entries = await db
      .collection('gallery')
      .find(query, {
        projection: {
          publicId: 1,
          secureUrl: 1,
          resourceType: 1,
          section: 1,
          originalFilename: 1,
          width: 1,
          height: 1,
          duration: 1,
          likes: 1,
          createdAt: 1,
        },
      })
      .sort({
        createdAt: -1,
        _id: -1,
      })
      .limit(limit + 1)
      .toArray();

    const hasMore = entries.length > limit;
    const pageEntries = hasMore ? entries.slice(0, limit) : entries;

    const items = pageEntries.map((entry) =>
      toGalleryItemResponse(entry as never),
    );

    const lastEntry = pageEntries[pageEntries.length - 1];

    const nextCursor =
      lastEntry && hasMore
        ? {
            beforeCreatedAt:
              lastEntry.createdAt instanceof Date
                ? lastEntry.createdAt.toISOString()
                : new Date(lastEntry.createdAt).toISOString(),
            beforeId: lastEntry._id.toString(),
          }
        : null;

    return NextResponse.json(
      {
        items,
        hasMore,
        nextCursor,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      },
    );
  } catch (error) {
    console.error('Gallery fetch error:', error);

    return NextResponse.json(
      { error: 'Unable to load gallery.' },
      { status: 500 },
    );
  }
}
