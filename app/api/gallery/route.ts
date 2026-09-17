    import { NextRequest, NextResponse } from 'next/server';
    import clientPromise from '@/lib/mongodb';
    import {
    GALLERY_SECTIONS,
    toGalleryItemResponse,
    type GallerySection,
    } from '@/lib/gallery';

    export const runtime = 'nodejs';

    export async function GET(request: NextRequest) {
    try {
        const section = request.nextUrl.searchParams.get('section');

        if (
        section !== GALLERY_SECTIONS.PRE_WEDDING &&
        section !== GALLERY_SECTIONS.LIVE
        ) {
        return NextResponse.json(
            {
            error: 'Invalid gallery section.',
            },
            { status: 400 },
        );
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);

        const items = await db
        .collection('gallery')
        .find({
            section: section as GallerySection,
        })
        .sort({
            createdAt: -1,
        })
        .toArray();

        return NextResponse.json({
        items: items.map((item) =>
            toGalleryItemResponse(item as never),
        ),
        });
    } catch (error) {
        console.error('Gallery fetch error:', error);

        return NextResponse.json(
        {
            error: 'Unable to load gallery.',
        },
        { status: 500 },
        );
    }
    }