import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import clientPromise from '@/lib/mongodb';

const COLLECTION_NAME = 'blessings_prayers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const requestedLimit = Number(
      searchParams.get('limit') ?? '10',
    );

    const limit = Math.min(
      Math.max(
        Number.isFinite(requestedLimit)
          ? requestedLimit
          : 10,
        1,
      ),
      50,
    );

    const beforeCreatedAt =
      searchParams.get('beforeCreatedAt');

    const beforeId =
      searchParams.get('beforeId');

    const client = await clientPromise;
    const db = client.db();

    const query: Record<string, unknown> = {};

    if (beforeCreatedAt || beforeId) {
      if (!beforeCreatedAt || !beforeId) {
        return NextResponse.json(
          {
            error: 'Invalid pagination cursor.',
          },
          { status: 400 },
        );
      }

      const cursorDate = new Date(
        beforeCreatedAt,
      );

      if (
        Number.isNaN(cursorDate.getTime()) ||
        !ObjectId.isValid(beforeId)
      ) {
        return NextResponse.json(
          {
            error: 'Invalid pagination cursor.',
          },
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
      .collection(COLLECTION_NAME)
      .find(query, {
        projection: {
          name: 1,
          message: 1,
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

    const pageEntries = hasMore
      ? entries.slice(0, limit)
      : entries;

    const mappedEntries = pageEntries.map(
      (entry) => ({
        id: entry._id.toString(),
        name: entry.name,
        message: entry.message,
        createdAt:
          entry.createdAt instanceof Date
            ? entry.createdAt.toISOString()
            : entry.createdAt,
      }),
    );

    const lastEntry =
      pageEntries[pageEntries.length - 1];

    const nextCursor =
      lastEntry && hasMore
        ? {
            beforeCreatedAt:
              lastEntry.createdAt instanceof Date
                ? lastEntry.createdAt.toISOString()
                : new Date(
                    lastEntry.createdAt,
                  ).toISOString(),
            beforeId: lastEntry._id.toString(),
          }
        : null;

    return NextResponse.json({
      entries: mappedEntries,
      hasMore,
      nextCursor,
    });
  } catch (error) {
    console.error(
      'Failed to fetch blessings and prayers:',
      error,
    );

    return NextResponse.json(
      {
        error:
          'Unable to load blessings and prayers.',
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === 'string'
        ? body.name.trim()
        : '';

    const message =
      typeof body.message === 'string'
        ? body.message.trim()
        : '';

    if (!name || !message) {
      return NextResponse.json(
        {
          error:
            'Name and blessing or prayer are required.',
        },
        { status: 400 },
      );
    }

    if (name.length > 120) {
      return NextResponse.json(
        {
          error:
            'Name must be 120 characters or less.',
        },
        { status: 400 },
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        {
          error:
            'Blessing or prayer must be 2000 characters or less.',
        },
        { status: 400 },
      );
    }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);

    const createdAt = new Date();

    const result = await db
      .collection(COLLECTION_NAME)
      .insertOne({
        name,
        message,
        createdAt,
      });

    return NextResponse.json(
      {
        entry: {
          id: result.insertedId.toString(),
          name,
          message,
          createdAt: createdAt.toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      'Failed to save blessing or prayer:',
      error,
    );

    return NextResponse.json(
      {
        error:
          'Unable to save your blessing or prayer.',
      },
      { status: 500 },
    );
  }
}