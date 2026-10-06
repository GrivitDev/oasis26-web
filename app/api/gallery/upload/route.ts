import crypto from 'crypto';

import { NextRequest, NextResponse } from 'next/server';

import clientPromise from '@/lib/mongodb';
import cloudinary from '@/lib/cloudinary';
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  GALLERY_MEDIA_TYPES,
  GALLERY_SECTIONS,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  toGalleryItemResponse,
  type GalleryMediaType,
  type GallerySection,
} from '@/lib/gallery';
import { ensureGalleryIndexes } from '@/lib/gallery-server';

export const runtime = 'nodejs';

const CLOUDINARY_FOLDER_PREFIX = 'oasis26/gallery';

type JsonObject = Record<string, unknown>;

function isValidSection(value: unknown): value is GallerySection {
  return (
    value === GALLERY_SECTIONS.PRE_WEDDING ||
    value === GALLERY_SECTIONS.LIVE
  );
}

function isValidResourceType(
  value: unknown,
): value is GalleryMediaType {
  return (
    value === GALLERY_MEDIA_TYPES.IMAGE ||
    value === GALLERY_MEDIA_TYPES.VIDEO
  );
}

function getGalleryFolder(section: GallerySection): string {
  return `${CLOUDINARY_FOLDER_PREFIX}/${section}`;
}

function getMaxSizeForResourceType(
  resourceType: GalleryMediaType,
): number {
  return resourceType === GALLERY_MEDIA_TYPES.IMAGE
    ? MAX_IMAGE_SIZE
    : MAX_VIDEO_SIZE;
}

function formatMegabytes(bytes: number): string {
  return `${Math.round(bytes / 1024 / 1024)} MB`;
}

function isGalleryPublicId(
  publicId: string,
  section: GallerySection,
): boolean {
  const expectedPrefix = `${getGalleryFolder(section)}/`;
  return publicId.startsWith(expectedPrefix) && !publicId.includes('..');
}

function isAllowedImageFormat(format: unknown): boolean {
  if (typeof format !== 'string') {
    return false;
  }

  return ALLOWED_IMAGE_TYPES.has(`image/${format.toLowerCase()}`);
}

function isAllowedVideoFormat(format: unknown): boolean {
  if (typeof format !== 'string') {
    return false;
  }

  const normalized = format.toLowerCase();
  return (
    normalized === 'mp4' ||
    normalized === 'webm' ||
    normalized === 'mov'
  );
}

function getApiSecret(): string {
  const value = process.env.CLOUDINARY_API_SECRET;
  if (!value) {
    throw new Error('Missing CLOUDINARY_API_SECRET.');
  }
  return value;
}

function timingSafeEqualString(
  supplied: string,
  expected: string,
): boolean {
  const suppliedBuffer = Buffer.from(supplied);
  const expectedBuffer = Buffer.from(expected);

  if (suppliedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    suppliedBuffer,
    expectedBuffer,
  );
}

function authorizePreWeddingUpload(
  section: GallerySection,
  uploadToken: unknown,
): NextResponse | null {
  if (section !== GALLERY_SECTIONS.PRE_WEDDING) {
    return null;
  }

  const expectedToken = process.env.PREWEDDING_UPLOAD_TOKEN?.trim();

  if (!expectedToken) {
    return NextResponse.json(
      { error: 'Pre-wedding uploads are not configured.' },
      { status: 503 },
    );
  }

  if (
    typeof uploadToken !== 'string' ||
    !timingSafeEqualString(uploadToken.trim(), expectedToken)
  ) {
    return NextResponse.json(
      { error: 'Invalid pre-wedding upload token.' },
      { status: 403 },
    );
  }

  return null;
}

function createUploadSignature(
  section: GallerySection,
  resourceType: GalleryMediaType,
): {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  publicId: string;
  resourceType: GalleryMediaType;
} {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = getApiSecret();

  if (!cloudName || !apiKey) {
    throw new Error('Missing Cloudinary environment variables.');
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = getGalleryFolder(section);
  const randomId = crypto.randomBytes(16).toString('hex');
  const publicId = `${folder}/${Date.now()}-${randomId}`;

  const signature = cloudinary.utils.api_sign_request(
    {
      folder,
      public_id: publicId,
      timestamp,
    },
    apiSecret,
  );

  return {
    cloudName,
    apiKey,
    timestamp,
    signature,
    folder,
    publicId,
    resourceType,
  };
}

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as JsonObject;
    const action = body.action;

    if (action === 'sign') {
      const section = body.section;
      const resourceType = body.resourceType;
      const uploadToken = body.uploadToken;

      if (!isValidSection(section)) {
        return errorResponse('Invalid gallery section.');
      }

      if (!isValidResourceType(resourceType)) {
        return errorResponse('Invalid media type.');
      }

      if (
        section === GALLERY_SECTIONS.PRE_WEDDING &&
        resourceType === GALLERY_MEDIA_TYPES.VIDEO
      ) {
        return errorResponse(
          'Videos are not allowed in the pre-wedding gallery.',
        );
      }

      const authorizationError = authorizePreWeddingUpload(
        section,
        uploadToken,
      );

      if (authorizationError) {
        return authorizationError;
      }

      const signature = createUploadSignature(
        section,
        resourceType,
      );

      return NextResponse.json(signature, {
        headers: {
          'Cache-Control': 'no-store',
        },
      });
    }

    if (action === 'complete') {
      const section = body.section;
      const publicId = body.publicId;
      const resourceType = body.resourceType;
      const originalFilename = body.originalFilename;
      const uploadToken = body.uploadToken;

      if (!isValidSection(section)) {
        return errorResponse('Invalid gallery section.');
      }

      if (!isValidResourceType(resourceType)) {
        return errorResponse('Invalid media type.');
      }

      if (typeof publicId !== 'string' || !publicId.trim()) {
        return errorResponse('Invalid Cloudinary public ID.');
      }

      if (!isGalleryPublicId(publicId, section)) {
        return errorResponse('Invalid Cloudinary gallery asset.');
      }

      if (
        typeof originalFilename !== 'string' ||
        !originalFilename.trim()
      ) {
        return errorResponse('Original filename is required.');
      }

      if (
        section === GALLERY_SECTIONS.PRE_WEDDING &&
        resourceType === GALLERY_MEDIA_TYPES.VIDEO
      ) {
        return errorResponse(
          'Videos are not allowed in the pre-wedding gallery.',
        );
      }

      const authorizationError = authorizePreWeddingUpload(
        section,
        uploadToken,
      );

      if (authorizationError) {
        return authorizationError;
      }

      const resource = (await cloudinary.api.resource(publicId, {
        resource_type: resourceType,
      })) as Record<string, unknown>;

      const verifiedPublicId = resource.public_id;
      const verifiedResourceType = resource.resource_type;

      if (
        verifiedPublicId !== publicId ||
        verifiedResourceType !== resourceType
      ) {
        return errorResponse('The uploaded asset could not be verified.');
      }

      const verifiedBytes =
        typeof resource.bytes === 'number' ? resource.bytes : 0;
      const maxSize = getMaxSizeForResourceType(resourceType);

      if (verifiedBytes <= 0) {
        return errorResponse('Cloudinary returned an invalid file size.');
      }

      if (verifiedBytes > maxSize) {
        try {
          await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
          });
        } catch (deleteError) {
          console.error(
            'Unable to remove rejected Cloudinary asset:',
            deleteError,
          );
        }

        return errorResponse(
          `File exceeds the ${formatMegabytes(maxSize)} limit.`,
        );
      }

      const verifiedFormat =
        typeof resource.format === 'string'
          ? resource.format.toLowerCase()
          : '';

      if (
        resourceType === GALLERY_MEDIA_TYPES.IMAGE &&
        !isAllowedImageFormat(verifiedFormat)
      ) {
        try {
          await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
          });
        } catch (deleteError) {
          console.error(
            'Unable to remove rejected Cloudinary image:',
            deleteError,
          );
        }

        return errorResponse('Unsupported image format.');
      }

      if (
        resourceType === GALLERY_MEDIA_TYPES.VIDEO &&
        !isAllowedVideoFormat(verifiedFormat)
      ) {
        try {
          await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
          });
        } catch (deleteError) {
          console.error(
            'Unable to remove rejected Cloudinary video:',
            deleteError,
          );
        }

        return errorResponse('Unsupported video format.');
      }

      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB);
      await ensureGalleryIndexes(db);

      const existing = await db.collection('gallery').findOne({
        publicId,
      });

      if (existing) {
        return NextResponse.json({
          item: toGalleryItemResponse(existing as never),
        });
      }

      const verifiedSecureUrl =
        typeof resource.secure_url === 'string' &&
        resource.secure_url.length > 0
          ? resource.secure_url
          : cloudinary.url(publicId, {
              secure: true,
              resource_type: resourceType,
            });

      const document = {
        publicId,
        secureUrl: verifiedSecureUrl,
        resourceType,
        section,
        originalFilename: originalFilename.trim().slice(0, 255),
        width:
          typeof resource.width === 'number'
            ? resource.width
            : typeof body.width === 'number'
              ? body.width
              : undefined,
        height:
          typeof resource.height === 'number'
            ? resource.height
            : typeof body.height === 'number'
              ? body.height
              : undefined,
        duration:
          typeof resource.duration === 'number'
            ? resource.duration
            : typeof body.duration === 'number'
              ? body.duration
              : undefined,
        likes: 0,
        createdAt: new Date(),
      };

      try {
        const result = await db
          .collection('gallery')
          .insertOne(document);

        return NextResponse.json(
          {
            item: toGalleryItemResponse({
              ...document,
              _id: result.insertedId,
            } as never),
          },
          { status: 201 },
        );
      } catch (insertError) {
        const isDuplicate =
          typeof insertError === 'object' &&
          insertError !== null &&
          'code' in insertError &&
          insertError.code === 11000;

        if (isDuplicate) {
          const concurrentItem = await db
            .collection('gallery')
            .findOne({ publicId });

          if (concurrentItem) {
            return NextResponse.json({
              item: toGalleryItemResponse(
                concurrentItem as never,
              ),
            });
          }
        }

        throw insertError;
      }
    }

    return errorResponse('Invalid upload action.');
  } catch (error) {
    console.error('Gallery upload API error:', error);

    return NextResponse.json(
      { error: 'Unable to process gallery upload.' },
      { status: 500 },
    );
  }
}
