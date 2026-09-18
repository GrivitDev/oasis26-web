// src/app/api/gallery/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import path from 'path';

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

const LOGO_PATH = path.join(
  process.cwd(),
  'public',
  'logo.png',
);

const CLOUDINARY_FOLDER_PREFIX =
  'oasis26/gallery';

const CLOUDINARY_LOGO_PUBLIC_ID =
  'oasis26/branding/logo';

const COMPLETION_TOKEN_TTL_MS =
  10 * 60 * 1000;

let logoPublicIdPromise:
  | Promise<string>
  | null = null;

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

function isValidPreWeddingToken(
  token: unknown,
): boolean {
  const expectedToken =
    process.env.PREWEDDING_UPLOAD_TOKEN;

  if (
    typeof token !== 'string' ||
    !expectedToken
  ) {
    return false;
  }

  const suppliedBuffer =
    Buffer.from(token);

  const expectedBuffer =
    Buffer.from(expectedToken);

  if (
    suppliedBuffer.length !==
    expectedBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    suppliedBuffer,
    expectedBuffer,
  );
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
  ]).has(format.toLowerCase());
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
  ]).has(format.toLowerCase());
}

/* ============================================================= */
/* CLOUDINARY LOGO                                                */
/* ============================================================= */

async function ensureCloudinaryLogo(): Promise<string> {
  if (logoPublicIdPromise) {
    return logoPublicIdPromise;
  }

  logoPublicIdPromise =
    (async () => {
      try {
        await cloudinary.api.resource(
          CLOUDINARY_LOGO_PUBLIC_ID,
          {
            resource_type: 'image',
          },
        );

        return CLOUDINARY_LOGO_PUBLIC_ID;
      } catch {
        try {
          await cloudinary.uploader.upload(
            LOGO_PATH,
            {
              public_id:
                CLOUDINARY_LOGO_PUBLIC_ID,
              resource_type: 'image',
              overwrite: false,
            },
          );

          return CLOUDINARY_LOGO_PUBLIC_ID;
        } catch (error) {
          console.error(
            'Unable to prepare Cloudinary gallery logo:',
            error,
          );

          throw new Error(
            'Gallery branding asset is unavailable.',
          );
        }
      }
    })();

  try {
    return await logoPublicIdPromise;
  } catch (error) {
    logoPublicIdPromise = null;
    throw error;
  }
}

/* ============================================================= */
/* BRANDED IMAGE URL                                              */
/* ============================================================= */

function createBrandedImageUrl(
  publicId: string,
): string {
  return cloudinary.url(
    publicId,
    {
      secure: true,
      resource_type: 'image',
      transformation: [
        {
          width: 120,
          crop: 'scale',
          gravity: 'north_west',
          x: 24,
          y: 24,
          overlay:
            CLOUDINARY_LOGO_PUBLIC_ID,
        },
        {
          color: 'white',
          gravity: 'north_west',
          x: 154,
          y: 62,
          overlay: {
            font_family: 'Arial',
            font_size: 30,
            font_weight: 'bold',
            text: "OASIS'26",
          },
        },
      ],
    },
  );
}

/* ============================================================= */
/* COMPLETION TOKEN                                               */
/* ============================================================= */

type CompletionTokenPayload = {
  section: GallerySection;
  resourceType: GalleryMediaType;
  publicId: string;
  expiresAt: number;
};

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

function createCompletionToken(
  payload: Omit<
    CompletionTokenPayload,
    'expiresAt'
  >,
): string {
  const completePayload: CompletionTokenPayload =
    {
      ...payload,
      expiresAt:
        Date.now() +
        COMPLETION_TOKEN_TTL_MS,
    };

  const encodedPayload =
    Buffer.from(
      JSON.stringify(
        completePayload,
      ),
    ).toString('base64url');

  const signature =
    crypto
      .createHmac(
        'sha256',
        getCloudinaryApiSecret(),
      )
      .update(encodedPayload)
      .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

function verifyCompletionToken(
  token: unknown,
  expected: {
    section: GallerySection;
    resourceType: GalleryMediaType;
    publicId: string;
  },
): boolean {
  if (
    typeof token !== 'string'
  ) {
    return false;
  }

  const separatorIndex =
    token.lastIndexOf('.');

  if (
    separatorIndex <= 0 ||
    separatorIndex ===
      token.length - 1
  ) {
    return false;
  }

  const encodedPayload =
    token.slice(
      0,
      separatorIndex,
    );

  const suppliedSignature =
    token.slice(
      separatorIndex + 1,
    );

  let expectedSignature: string;

  try {
    expectedSignature =
      crypto
        .createHmac(
          'sha256',
          getCloudinaryApiSecret(),
        )
        .update(encodedPayload)
        .digest('base64url');
  } catch {
    return false;
  }

  const suppliedSignatureBuffer =
    Buffer.from(
      suppliedSignature,
    );

  const expectedSignatureBuffer =
    Buffer.from(
      expectedSignature,
    );

  if (
    suppliedSignatureBuffer.length !==
    expectedSignatureBuffer.length
  ) {
    return false;
  }

  if (
    !crypto.timingSafeEqual(
      suppliedSignatureBuffer,
      expectedSignatureBuffer,
    )
  ) {
    return false;
  }

  try {
    const payload =
      JSON.parse(
        Buffer.from(
          encodedPayload,
          'base64url',
        ).toString('utf8'),
      ) as Partial<CompletionTokenPayload>;

    if (
      payload.section !==
      expected.section
    ) {
      return false;
    }

    if (
      payload.resourceType !==
      expected.resourceType
    ) {
      return false;
    }

    if (
      payload.publicId !==
      expected.publicId
    ) {
      return false;
    }

    if (
      typeof payload.expiresAt !==
      'number'
    ) {
      return false;
    }

    if (
      payload.expiresAt <=
      Date.now()
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
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
  resourceType: GalleryMediaType;
  completionToken: string;
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
    process.env.CLOUDINARY_API_SECRET;

  if (
    !cloudName ||
    !apiKey ||
    !apiSecret
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

  const completionToken =
    createCompletionToken({
      section,
      resourceType,
      publicId,
    });

  return {
    cloudName,
    apiKey,
    timestamp,
    signature,
    folder,
    publicId,
    resourceType,
    completionToken,
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

      const token =
        body?.token;

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
       * Pre-wedding uploads are private
       * and photograph-only.
       */
      if (
        section ===
        GALLERY_SECTIONS.PRE_WEDDING
      ) {
        if (
          !isValidPreWeddingToken(
            token,
          )
        ) {
          return NextResponse.json(
            {
              error:
                'Invalid pre-wedding upload token.',
            },
            { status: 403 },
          );
        }

        if (
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

      const completionToken =
        body?.completionToken;

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
       * The completion token is bound to:
       *
       * - section
       * - resource type
       * - exact Cloudinary public ID
       *
       * Therefore a valid completion token
       * cannot be reused for another asset.
       */
      if (
        !verifyCompletionToken(
          completionToken,
          {
            section,
            resourceType,
            publicId,
          },
        )
      ) {
        return NextResponse.json(
          {
            error:
              'Invalid or expired upload completion token.',
          },
          { status: 403 },
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
        verifiedBytes > maxSize
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
      /* FINAL URL                                                 */
      /* ======================================================= */

      let finalSecureUrl =
        secureUrl;

      if (
        resourceType ===
        GALLERY_MEDIA_TYPES.IMAGE
      ) {
        /*
         * Ensure the OASIS'26 logo exists in
         * Cloudinary before generating the
         * branded delivery URL.
         */
        await ensureCloudinaryLogo();

        finalSecureUrl =
          createBrandedImageUrl(
            publicId,
          );
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

      const document = {
        publicId,
        secureUrl:
          finalSecureUrl,
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