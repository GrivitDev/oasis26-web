// src/app/api/gallery/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import path from 'path';
import sharp from 'sharp';

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

export const maxDuration = 120;

const LOGO_PATH = path.join(
  process.cwd(),
  'public',
  'logo.png',
);

function getFileExtension(
  filename: string,
): string {
  return path.extname(filename).toLowerCase();
}

function getMediaType(
  file: File,
): {
  type: GalleryMediaType;
  mimeType: string;
} | null {
  const mimeType =
    file.type.trim().toLowerCase();

  const extension =
    getFileExtension(file.name);

  const imageMimeTypes = new Set([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
  ]);

  const videoMimeTypes = new Set([
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-matroska',
    'video/ogg',
    'video/x-msvideo',
    'video/mpeg',
  ]);

  const imageExtensions = new Set([
    '.jpg',
    '.jpeg',
    '.png',
    '.webp',
    '.heic',
    '.heif',
  ]);

  const videoExtensions = new Set([
    '.mp4',
    '.webm',
    '.mov',
    '.m4v',
    '.mkv',
    '.ogv',
    '.avi',
    '.mpeg',
    '.mpg',
  ]);

  if (
    imageMimeTypes.has(mimeType) ||
    imageExtensions.has(extension)
  ) {
    return {
      type: GALLERY_MEDIA_TYPES.IMAGE,
      mimeType:
        mimeType || 'image/jpeg',
    };
  }

  if (
    videoMimeTypes.has(mimeType) ||
    videoExtensions.has(extension)
  ) {
    return {
      type: GALLERY_MEDIA_TYPES.VIDEO,
      mimeType:
        mimeType || 'video/webm',
    };
  }

  return null;
}

function formatMegabytes(
  bytes: number,
): string {
  return `${Math.round(
    bytes / (1024 * 1024),
  )}MB`;
}

async function createBrandedImage(
  buffer: Buffer,
): Promise<{
  buffer: Buffer;
  width: number;
  height: number;
}> {
  const metadata =
    await sharp(buffer).metadata();

  if (
    !metadata.width ||
    !metadata.height
  ) {
    throw new Error(
      'Unable to determine uploaded image dimensions.',
    );
  }

  const width = metadata.width;
  const height = metadata.height;

  const logoWidth = Math.max(
    70,
    Math.round(width * 0.075),
  );

  const logoBuffer =
    await sharp(LOGO_PATH)
      .resize({
        width: logoWidth,
        fit: 'inside',
        withoutEnlargement: false,
      })
      .png()
      .toBuffer();

  const logoMetadata =
    await sharp(logoBuffer).metadata();

  const actualLogoWidth =
    logoMetadata.width ??
    logoWidth;

  const actualLogoHeight =
    logoMetadata.height ??
    logoWidth;

  const textFontSize = Math.max(
    22,
    Math.round(width * 0.026),
  );

  const gap = Math.max(
    8,
    Math.round(width * 0.01),
  );

  const horizontalPadding =
    Math.max(
      20,
      Math.round(width * 0.025),
    );

  const verticalPadding =
    Math.max(
      20,
      Math.round(height * 0.025),
    );

  const textWidth = Math.max(
    130,
    Math.round(width * 0.18),
  );

  const contentHeight =
    Math.max(
      actualLogoHeight,
      textFontSize,
    );

  const overlayWidth =
    actualLogoWidth +
    gap +
    textWidth;

  const overlayHeight =
    contentHeight + 16;

  const overlaySvg = `
    <svg
      width="${overlayWidth}"
      height="${overlayHeight}"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter
          id="textShadow"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feDropShadow
            dx="0"
            dy="1.5"
            stdDeviation="1.8"
            flood-color="#061A3A"
            flood-opacity="0.65"
          />
        </filter>
      </defs>

      <text
        x="${actualLogoWidth + gap}"
        y="${Math.round(
          overlayHeight / 2 +
            textFontSize / 3,
        )}"
        font-family="Arial, Helvetica, sans-serif"
        font-size="${textFontSize}"
        font-weight="700"
        letter-spacing="2"
        fill="#8FE3C1"
        stroke="#FFFFFF"
        stroke-width="2.5"
        stroke-linejoin="round"
        paint-order="stroke fill"
        filter="url(#textShadow)"
      >
        OASIS&apos;26
      </text>
    </svg>
  `;

  const overlayBuffer =
    Buffer.from(overlaySvg);

  const left =
    horizontalPadding;

  const top =
    verticalPadding;

  const brandedBuffer =
    await sharp(buffer)
      .composite([
        {
          input: overlayBuffer,
          left,
          top:
            top +
            Math.round(
              (actualLogoHeight -
                overlayHeight) /
                2,
            ),
        },
        {
          input: logoBuffer,
          left,
          top,
        },
      ])
      .jpeg({
        quality: 92,
        mozjpeg: true,
      })
      .toBuffer();

  return {
    buffer: brandedBuffer,
    width,
    height,
  };
}

type CloudinaryUploadResult = {
  public_id: string;
  secure_url: string;
  resource_type: string;
  width?: number;
  height?: number;
  duration?: number;
};

type ChunkedCloudinaryResult =
  CloudinaryUploadResult & {
    done?: boolean;
  };

function uploadToCloudinary(
  buffer: Buffer,
  section: GallerySection,
  resourceType: GalleryMediaType,
  originalFilename: string,
  mimeType: string,
): Promise<CloudinaryUploadResult> {
  return new Promise(
    (resolve, reject) => {
      const uploadOptions = {
        folder:
          `oasis26/gallery/${section}`,

        resource_type:
          resourceType,

        use_filename: true,
        unique_filename: true,
        overwrite: false,

        context: {
          original_filename:
            originalFilename,
          event: "OASIS'26",
        },

        quality: 'auto',
        fetch_format: 'auto',

        ...(resourceType ===
        GALLERY_MEDIA_TYPES.VIDEO
          ? {
              format:
                mimeType ===
                'video/mp4'
                  ? 'mp4'
                  : undefined,
            }
          : {}),
      };

      /*
       * Use chunked streaming for every upload.
       *
       * Cloudinary documents upload_chunked_stream
       * specifically for larger files and better
       * tolerance to network interruptions.
       *
       * 6 MB keeps the chunks reasonably small while
       * avoiding excessive request overhead.
       */
      const uploadStream =
        cloudinary.uploader.upload_chunked_stream(
          {
            ...uploadOptions,
            chunk_size:
              6 * 1024 * 1024,
          },
          (
            error,
            result,
          ) => {
            if (error) {
              reject(error);
              return;
            }

            if (!result) {
              return;
            }

            const chunkResult =
              result as ChunkedCloudinaryResult;

            /*
             * Chunked uploads can send intermediate
             * responses with done:false.
             *
             * Only resolve when Cloudinary returns
             * the final upload response.
             */
            if (
              chunkResult.done === false
            ) {
              return;
            }

            resolve({
              public_id:
                chunkResult.public_id,

              secure_url:
                chunkResult.secure_url,

              resource_type:
                chunkResult.resource_type,

              width:
                chunkResult.width,

              height:
                chunkResult.height,

              duration:
                chunkResult.duration,
            });
          },
        );

      uploadStream.on(
        'error',
        (error) => {
          reject(error);
        },
      );

      Readable.from(buffer).pipe(
        uploadStream,
      );
    },
  );
}

export async function POST(
  request: NextRequest,
) {
  try {
    const formData =
      await request.formData();

    const file =
      formData.get('file');

    const sectionValue =
      formData.get('section');

    const token =
      formData.get('token');

    if (
      !(file instanceof File)
    ) {
      return NextResponse.json(
        {
          error:
            'No file was provided.',
        },
        {
          status: 400,
        },
      );
    }

    if (
      sectionValue !==
        GALLERY_SECTIONS.PRE_WEDDING &&
      sectionValue !==
        GALLERY_SECTIONS.LIVE
    ) {
      return NextResponse.json(
        {
          error:
            'Invalid gallery section.',
        },
        {
          status: 400,
        },
      );
    }

    const section =
      sectionValue as GallerySection;

    if (
      section ===
      GALLERY_SECTIONS.PRE_WEDDING
    ) {
      const expectedToken =
        process.env
          .PREWEDDING_UPLOAD_TOKEN;

      if (!expectedToken) {
        return NextResponse.json(
          {
            error:
              'Pre-wedding upload is not configured.',
          },
          {
            status: 500,
          },
        );
      }

      if (
        typeof token !==
          'string' ||
        token.length === 0 ||
        token !== expectedToken
      ) {
        return NextResponse.json(
          {
            error:
              'Invalid upload token.',
          },
          {
            status: 401,
          },
        );
      }
    }

    const media =
      getMediaType(file);

    if (!media) {
      return NextResponse.json(
        {
          error:
            `Unsupported file type. MIME type: "${file.type || 'unknown'}", filename: "${file.name}".`,
        },
        {
          status: 400,
        },
      );
    }

    const isImage =
      media.type ===
      GALLERY_MEDIA_TYPES.IMAGE;

    const isVideo =
      media.type ===
      GALLERY_MEDIA_TYPES.VIDEO;

    if (
      isImage &&
      file.size >
        MAX_IMAGE_SIZE
    ) {
      return NextResponse.json(
        {
          error:
            `Images must be ${formatMegabytes(
              MAX_IMAGE_SIZE,
            )} or smaller.`,
        },
        {
          status: 413,
        },
      );
    }

    if (
      isVideo &&
      file.size >
        MAX_VIDEO_SIZE
    ) {
      return NextResponse.json(
        {
          error:
            `Videos must be ${formatMegabytes(
              MAX_VIDEO_SIZE,
            )} or smaller.`,
        },
        {
          status: 413,
        },
      );
    }

    if (
      section ===
        GALLERY_SECTIONS.PRE_WEDDING &&
      isVideo
    ) {
      return NextResponse.json(
        {
          error:
            'Pre-wedding gallery accepts image uploads only.',
        },
        {
          status: 400,
        },
      );
    }

    let buffer: Buffer<ArrayBufferLike> =
      Buffer.from(
        await file.arrayBuffer(),
      );

    let width:
      | number
      | undefined;

    let height:
      | number
      | undefined;

    if (isImage) {
      const branded =
        await createBrandedImage(
          buffer,
        );

      buffer =
        branded.buffer;

      width =
        branded.width;

      height =
        branded.height;
    }

    const uploadResult =
      await uploadToCloudinary(
        buffer,
        section,
        media.type,
        file.name,
        media.mimeType,
      );

    const client =
      await clientPromise;

    const db =
      client.db(
        process.env.MONGODB_DB,
      );

    const galleryItem = {
      publicId:
        uploadResult.public_id,

      secureUrl:
        uploadResult.secure_url,

      resourceType:
        media.type,

      section,

      originalFilename:
        file.name,

      width:
        width ??
        uploadResult.width,

      height:
        height ??
        uploadResult.height,

      duration:
        uploadResult.duration,

      likes: 0,

      createdAt:
        new Date(),
    };

    const result =
      await db
        .collection('gallery')
        .insertOne(
          galleryItem,
        );

    const savedItem = {
      _id:
        result.insertedId,

      ...galleryItem,
    };

    return NextResponse.json(
      {
        success: true,

        item:
          toGalleryItemResponse(
            savedItem as never,
          ),
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      'Gallery upload error:',
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : 'Unknown gallery upload error.';

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      },
    );
  }
}