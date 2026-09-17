import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import clientPromise from '@/lib/mongodb';

export const runtime = 'nodejs';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  _request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          error: 'Invalid gallery item.',
        },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const result = await db
      .collection('gallery')
      .findOneAndUpdate(
        {
          _id: new ObjectId(id),
        },
        {
          $inc: {
            likes: 1,
          },
        },
        {
          returnDocument: 'after',
        },
      );

    if (!result) {
      return NextResponse.json(
        {
          error: 'Gallery item not found.',
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      likes: result.likes ?? 0,
    });
  } catch (error) {
    console.error(
      'Gallery like error:',
      error,
    );

    return NextResponse.json(
      {
        error: 'Unable to like this item.',
      },
      { status: 500 },
    );
  }
}