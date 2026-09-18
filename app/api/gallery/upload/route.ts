// src/app/api/gallery/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

import clientPromise from '@/lib/mongodb';
import cloudinary from '@/lib/cloudinary';
import {
  GALLERY_MEDIA_TYPES,
  GALLERY_SECTIONS,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  toGalleryItemResponse,
  type GalleryMediaType,
  type GallerySection,
} from '@/lib/gallery';

export const runtime = 'nodejs';

const CLOUDINARY_FOLDER_PREFIX =
  'oasis26/gallery';

/* ============================================================= */
/* VALIDATION                                                     */
/* ============================================================= */

function isValidSection(
  value: unknown,
): value is GallerySection {
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

function getGalleryFolder(
  section: GallerySection,
): string {
  return `${CLOUDINARY_FOLDER_PREFIX}/${section}`;
}

function getMaxSizeForResourceType(
  resourceType: GalleryMediaType,
): number {
  return resourceType ===
    GALLERY_MEDIA_TYPES.IMAGE
    ? MAX_IMAGE_SIZE
    : MAX_VIDEO_SIZE;
}

function formatMegabytes(
  bytes: number,
): string {
  return `${Math.round(
    bytes / 1024 / 1024,
  )} MB`;
}

/* ============================================================= */
/* CLOUDINARY ASSET VALIDATION                                    */
/* ============================================================= */

function isGalleryPublicId(
  publicId: string,
  section: GallerySection,
): boolean {
  const expectedPrefix =
    `${getGalleryFolder(section)}/`;

  return publicId.startsWith(
    expectedPrefix,
  );
}

function isAllowedImageFormat(
  format: unknown,
): boolean {
  if (
    typeof format !== 'string'
  ) {
    return false;
  }

  return new Set([
    'jpg',
    'jpeg',
    'png',
    'webp',
    'heic',
    'heif',
  ]).has(
    format.toLowerCase(),
  );
}

function isAllowedVideoFormat(
  format: unknown,
): boolean {
  if (
    typeof format !== 'string'
  ) {
    return false;
  }

  return new Set([
    'mp4',
    'webm',
    'mov',
  ]).has(
    format.toLowerCase(),
  );
}

/* ============================================================= */
/* CLOUDINARY API SECRET                                          */
/* ============================================================= */

function getCloudinaryApiSecret(): string {
  const apiSecret =
    process.env.CLOUDINARY_API_SECRET;

  if (!apiSecret) {
    throw new Error(
      'Missing CLOUDINARY_API_SECRET.',
    );
  }

  return apiSecret;
}

/* ============================================================= */
/* UPLOAD SIGNATURE                                               */
/* ============================================================= */

type UploadSignatureResponse = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  publicId: string;
  resourceType:
    | 'image'
    | 'video';
};

async function createUploadSignature(
  section: GallerySection,
  resourceType: GalleryMediaType,
): Promise<UploadSignatureResponse> {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME;

  const apiKey =
    process.env.CLOUDINARY_API_KEY;

  const apiSecret =
    getCloudinaryApiSecret();

  if (
    !cloudName ||
    !apiKey
  ) {
    throw new Error(
      'Missing Cloudinary environment variables.',
    );
  }

  const timestamp =
    Math.floor(
      Date.now() / 1000,
    );

  const folder =
    getGalleryFolder(section);

  /*
   * Generate the Cloudinary public ID on the
   * server so the browser cannot choose an
   * arbitrary gallery asset path.
   */
  const randomId =
    crypto.randomBytes(16).toString(
      'hex',
    );

  const publicId =
    `${folder}/${Date.now()}-${randomId}`;

  /*
   * These parameters are signed.
   *
   * The browser must send exactly the same
   * values to Cloudinary.
   */
  const signatureParams = {
    folder,
    public_id: publicId,
    timestamp,
  };

  const signature =
    cloudinary.utils.api_sign_request(
      signatureParams,
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

/* ============================================================= */
/* POST                                                            */
/* ============================================================= */

export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      await request.json();

    const action =
      body?.action;

    /* ========================================================= */
    /* SIGN                                                        */
    /* ========================================================= */

    if (action === 'sign') {
      const section =
        body?.section;

      const resourceType =
        body?.resourceType;

      if (
        !isValidSection(section)
      ) {
        return NextResponse.json(
          {
            error:
              'Invalid gallery section.',
          },
          { status: 400 },
        );
      }

      if (
        !isValidResourceType(
          resourceType,
        )
      ) {
        return NextResponse.json(
          {
            error:
              'Invalid media type.',
          },
          { status: 400 },
        );
      }

      /*
       * Pre-wedding gallery accepts photographs
       * only.
       *
       * No token or password is required.
       */
      if (
        section ===
          GALLERY_SECTIONS.PRE_WEDDING &&
        resourceType ===
          GALLERY_MEDIA_TYPES.VIDEO
      ) {
        return NextResponse.json(
          {
            error:
              'Videos are not allowed in the pre-wedding gallery.',
          },
          { status: 400 },
        );
      }

      const signature =
        await createUploadSignature(
          section,
          resourceType,
        );

      return NextResponse.json(
        signature,
      );
    }

    /* ========================================================= */
    /* COMPLETE                                                     */
    /* ========================================================= */

    if (action === 'complete') {
      const section =
        body?.section;

      const publicId =
        body?.publicId;

      const secureUrl =
        body?.secureUrl;

      const resourceType =
        body?.resourceType;

      const originalFilename =
        body?.originalFilename;

      const width =
        body?.width;

      const height =
        body?.height;

      const duration =
        body?.duration;

      if (
        !isValidSection(section)
      ) {
        return NextResponse.json(
          {
            error:
              'Invalid gallery section.',
          },
          { status: 400 },
        );
      }

      if (
        !isValidResourceType(
          resourceType,
        )
      ) {
        return NextResponse.json(
          {
            error:
              'Invalid media type.',
          },
          { status: 400 },
        );
      }

      if (
        typeof publicId !==
        'string'
      ) {
        return NextResponse.json(
          {
            error:
              'Invalid Cloudinary public ID.',
          },
          { status: 400 },
        );
      }

      if (
        typeof secureUrl !==
        'string'
      ) {
        return NextResponse.json(
          {
            error:
              'Invalid Cloudinary secure URL.',
          },
          { status: 400 },
        );
      }

      if (
        typeof originalFilename !==
          'string' ||
        !originalFilename.trim()
      ) {
        return NextResponse.json(
          {
            error:
              'Original filename is required.',
          },
          { status: 400 },
        );
      }

      /*
       * Confirm the public ID belongs to the
       * expected gallery section.
       */
      if (
        !isGalleryPublicId(
          publicId,
          section,
        )
      ) {
        return NextResponse.json(
          {
            error:
              'Invalid Cloudinary gallery asset.',
          },
          { status: 400 },
        );
      }

      /*
       * Pre-wedding remains photograph-only.
       */
      if (
        section ===
          GALLERY_SECTIONS.PRE_WEDDING &&
        resourceType ===
          GALLERY_MEDIA_TYPES.VIDEO
      ) {
        return NextResponse.json(
          {
            error:
              'Videos are not allowed in the pre-wedding gallery.',
          },
          { status: 400 },
        );
      }

      /* ======================================================= */
      /* VERIFY CLOUDINARY ASSET                                  */
      /* ======================================================= */

      let resource:
        | Record<string, unknown>;

      try {
        resource =
          await cloudinary.api.resource(
            publicId,
            {
              resource_type:
                resourceType,
            },
          );
      } catch (error) {
        console.error(
          'Cloudinary asset verification error:',
          error,
        );

        return NextResponse.json(
          {
            error:
              'The uploaded file could not be verified on Cloudinary.',
          },
          { status: 400 },
        );
      }

      const verifiedBytes =
        typeof resource.bytes ===
        'number'
          ? resource.bytes
          : 0;

      const maxSize =
        getMaxSizeForResourceType(
          resourceType,
        );

      if (
        verifiedBytes <= 0
      ) {
        return NextResponse.json(
          {
            error:
              'Cloudinary returned an invalid file size.',
          },
          { status: 400 },
        );
      }

      if (
        verifiedBytes >
        maxSize
      ) {
        /*
         * Delete the oversized asset so
         * rejected uploads do not remain in
         * Cloudinary.
         */
        try {
          await cloudinary.uploader.destroy(
            publicId,
            {
              resource_type:
                resourceType,
            },
          );
        } catch (deleteError) {
          console.error(
            'Unable to remove rejected Cloudinary asset:',
            deleteError,
          );
        }

        return NextResponse.json(
          {
            error:
              `File exceeds the ${formatMegabytes(maxSize)} limit.`,
          },
          { status: 400 },
        );
      }

      const verifiedFormat =
        typeof resource.format ===
        'string'
          ? resource.format.toLowerCase()
          : '';

      if (
        resourceType ===
        GALLERY_MEDIA_TYPES.IMAGE
      ) {
        if (
          !isAllowedImageFormat(
            verifiedFormat,
          )
        ) {
          try {
            await cloudinary.uploader.destroy(
              publicId,
              {
                resource_type:
                  resourceType,
              },
            );
          } catch (deleteError) {
            console.error(
              'Unable to remove rejected Cloudinary image:',
              deleteError,
            );
          }

          return NextResponse.json(
            {
              error:
                'Unsupported image format.',
            },
            { status: 400 },
          );
        }
      }

      if (
        resourceType ===
        GALLERY_MEDIA_TYPES.VIDEO
      ) {
        if (
          !isAllowedVideoFormat(
            verifiedFormat,
          )
        ) {
          try {
            await cloudinary.uploader.destroy(
              publicId,
              {
                resource_type:
                  resourceType,
              },
            );
          } catch (deleteError) {
            console.error(
              'Unable to remove rejected Cloudinary video:',
              deleteError,
            );
          }

          return NextResponse.json(
            {
              error:
                'Unsupported video format.',
            },
            { status: 400 },
          );
        }
      }

      /* ======================================================= */
      /* MONGODB                                                   */
      /* ======================================================= */

      const client =
        await clientPromise;

      const db =
        client.db(
          process.env.MONGODB_DB,
        );

      /*
       * Prevent duplicate database records if
       * the completion request is repeated.
       */
      const existing =
        await db
          .collection('gallery')
          .findOne({
            publicId,
          });

      if (existing) {
        return NextResponse.json({
          item:
            toGalleryItemResponse(
              existing as never,
            ),
        });
      }

      /*
       * Save the original Cloudinary secure URL
       * exactly as returned by Cloudinary.
       *
       * No branding or transformation is applied.
       */
      const document = {
        publicId,
        secureUrl,
        resourceType,
        section,
        originalFilename:
          originalFilename.trim(),
        width:
          typeof resource.width ===
          'number'
            ? resource.width
            : typeof width ===
                'number'
              ? width
              : undefined,
        height:
          typeof resource.height ===
          'number'
            ? resource.height
            : typeof height ===
                'number'
              ? height
              : undefined,
        duration:
          typeof resource.duration ===
          'number'
            ? resource.duration
            : typeof duration ===
                'number'
              ? duration
              : undefined,
        likes: 0,
        createdAt: new Date(),
      };

      const result =
        await db
          .collection('gallery')
          .insertOne(
            document,
          );

      const savedDocument = {
        ...document,
        _id:
          result.insertedId,
      };

      return NextResponse.json(
        {
          item:
            toGalleryItemResponse(
              savedDocument as never,
            ),
        },
        { status: 201 },
      );
    }

    /* ========================================================= */
    /* INVALID ACTION                                              */
    /* ========================================================= */

    return NextResponse.json(
      {
        error:
          'Invalid upload action.',
      },
      { status: 400 },
    );
  } catch (error) {
    console.error(
      'Gallery upload API error:',
      error,
    );

    return NextResponse.json(
      {
        error:
          'Unable to process gallery upload.',
      },
      { status: 500 },
    );
  }
}