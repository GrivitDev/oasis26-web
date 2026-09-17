import {
  NextResponse,
} from 'next/server';

import {
  ObjectId,
} from 'mongodb';

import clientPromise from '@/lib/mongodb';

export const runtime = 'nodejs';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    const { id } =
      await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          error:
            'Invalid gallery item.',
        },
        {
          status: 400,
        },
      );
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
          _id:
            new ObjectId(id),
        });

    if (!item) {
      return NextResponse.json(
        {
          error:
            'Gallery item not found.',
        },
        {
          status: 404,
        },
      );
    }

    if (
      typeof item.secureUrl !==
      'string'
    ) {
      return NextResponse.json(
        {
          error:
            'Gallery media URL is unavailable.',
        },
        {
          status: 404,
        },
      );
    }

    const mediaResponse =
      await fetch(
        item.secureUrl,
      );

    if (!mediaResponse.ok) {
      return NextResponse.json(
        {
          error:
            'Unable to retrieve gallery media.',
        },
        {
          status: 502,
        },
      );
    }

    const contentType =
      mediaResponse.headers.get(
        'content-type',
      ) ??
      (
        item.resourceType ===
        'video'
          ? 'video/mp4'
          : 'image/jpeg'
      );

    const arrayBuffer =
      await mediaResponse.arrayBuffer();

    const safeFilename =
      typeof item.originalFilename ===
        'string' &&
      item.originalFilename.length > 0
        ? item.originalFilename
        : `oasis26-${id}.${
            item.resourceType ===
            'video'
              ? 'mp4'
              : 'jpg'
          }`;

    return new NextResponse(
      arrayBuffer,
      {
        status: 200,
        headers: {
          'Content-Type':
            contentType,

          'Content-Disposition':
            `attachment; filename="${safeFilename.replace(
              /["\\]/g,
              '_',
            )}"`,

          'Cache-Control':
            'private, no-store',
        },
      },
    );
  } catch (error) {
    console.error(
      'Gallery download error:',
      error,
    );

    return NextResponse.json(
      {
        error:
          'Unable to download this gallery item.',
      },
      {
        status: 500,
      },
    );
  }
}