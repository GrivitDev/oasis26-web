import type { ObjectId } from 'mongodb';

export const GALLERY_SECTIONS = {
  PRE_WEDDING: 'pre-wedding',
  LIVE: 'live',
} as const;

export type GallerySection =
  (typeof GALLERY_SECTIONS)[keyof typeof GALLERY_SECTIONS];

export const GALLERY_MEDIA_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
} as const;

export type GalleryMediaType =
  (typeof GALLERY_MEDIA_TYPES)[keyof typeof GALLERY_MEDIA_TYPES];

export interface GalleryItemDocument {
  _id?: ObjectId;
  publicId: string;
  secureUrl: string;
  resourceType: GalleryMediaType;
  section: GallerySection;
  originalFilename: string;
  width?: number;
  height?: number;
  duration?: number;
  likes: number;
  createdAt: Date;
}

export interface GalleryItemResponse {
  id: string;
  publicId: string;
  secureUrl: string;
  resourceType: GalleryMediaType;
  section: GallerySection;
  originalFilename: string;
  width?: number;
  height?: number;
  duration?: number;
  likes: number;
  createdAt: string;
}

export const MAX_SELECTION_COUNT = 25;

export const GALLERY_PAGE_SIZE = 48;

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export const MAX_VIDEO_SIZE = 90 * 1024 * 1024;

/**
 * Browser MIME types accepted for image uploads.
 */
export const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/png',
  'image/apng',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/heic',
  'image/heif',
  'image/bmp',
  'image/tiff',
  'image/jp2',
  'image/jpx',
  'image/jxr',
  'image/jxl',
  'image/dng',
  'image/x-adobe-dng',
]);

/**
 * Browser MIME types accepted for video uploads.
 */
export const ALLOWED_VIDEO_TYPES = new Set([
  'video/mp4',
  'video/m4v',
  'video/quicktime',
  'video/webm',
  'video/3gpp',
  'video/3gpp2',
  'video/x-matroska',
  'video/x-msvideo',
  'video/ogg',
  'video/mpeg',
  'video/mp2t',
  'video/x-ms-wmv',
]);

/**
 * Image extensions commonly produced by phones
 * and modern consumer devices.
 */
export const ALLOWED_IMAGE_EXTENSIONS = new Set([
  'jpg',
  'jpeg',
  'jpe',
  'jfif',
  'jif',
  'png',
  'apng',
  'webp',
  'gif',
  'avif',
  'heic',
  'heif',
  'bmp',
  'tif',
  'tiff',
  'jp2',
  'j2k',
  'j2c',
  'jpf',
  'jpx',
  'jpm',
  'jxr',
  'jxl',
  'dng',
]);

/**
 * Video extensions commonly produced by
 * phones, messaging apps and consumer devices.
 */
export const ALLOWED_VIDEO_EXTENSIONS = new Set([
  'mp4',
  'm4v',
  'mov',
  'webm',
  '3gp',
  '3g2',
  'mkv',
  'avi',
  'ogv',
  'ogg',
  'mpeg',
  'mpg',
  'ts',
  'mts',
  'm2ts',
  'wmv',
]);

/**
 * Formats returned by Cloudinary for image assets.
 *
 * Cloudinary commonly reports JPEG as `jpg`.
 */
export const ALLOWED_CLOUDINARY_IMAGE_FORMATS = new Set([
  'jpg',
  'jpeg',
  'jpe',
  'jfif',
  'png',
  'apng',
  'webp',
  'gif',
  'avif',
  'heic',
  'heif',
  'bmp',
  'tif',
  'tiff',
  'jp2',
  'j2k',
  'j2c',
  'jpf',
  'jpx',
  'jpm',
  'jxr',
  'jxl',
  'dng',
]);

/**
 * Formats returned by Cloudinary for video assets.
 */
export const ALLOWED_CLOUDINARY_VIDEO_FORMATS = new Set([
  'mp4',
  'm4v',
  'mov',
  'webm',
  '3gp',
  '3g2',
  'mkv',
  'avi',
  'ogv',
  'ogg',
  'mpeg',
  'mpg',
  'ts',
  'mts',
  'm2ts',
  'wmv',
]);

/**
 * File-picker accept values.
 *
 * Extensions are included because some mobile browsers
 * report inconsistent or empty MIME types.
 */
export const GALLERY_IMAGE_ACCEPT = Array.from(
  new Set([
    ...ALLOWED_IMAGE_TYPES,
    ...Array.from(ALLOWED_IMAGE_EXTENSIONS).map(
      (extension) => `.${extension}`,
    ),
  ]),
).join(',');

export const GALLERY_VIDEO_ACCEPT = Array.from(
  new Set([
    ...ALLOWED_VIDEO_TYPES,
    ...Array.from(ALLOWED_VIDEO_EXTENSIONS).map(
      (extension) => `.${extension}`,
    ),
  ]),
).join(',');

function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');

  if (lastDot === -1) {
    return '';
  }

  return filename
    .slice(lastDot + 1)
    .trim()
    .toLowerCase();
}

export function isGalleryVideoFile(
  file: Pick<File, 'name' | 'type'>,
): boolean {
  const normalizedType = file.type.trim().toLowerCase();

  if (normalizedType.startsWith('video/')) {
    return true;
  }

  return ALLOWED_VIDEO_EXTENSIONS.has(
    getFileExtension(file.name),
  );
}

export function getGalleryMediaTypeForFile(
  file: Pick<File, 'name' | 'type'>,
): GalleryMediaType | null {
  const normalizedType = file.type.trim().toLowerCase();
  const extension = getFileExtension(file.name);

  if (isGalleryVideoFile(file)) {
    return GALLERY_MEDIA_TYPES.VIDEO;
  }

  if (
    ALLOWED_IMAGE_TYPES.has(normalizedType) ||
    ALLOWED_IMAGE_EXTENSIONS.has(extension)
  ) {
    return GALLERY_MEDIA_TYPES.IMAGE;
  }

  return null;
}

export function validateGalleryUploadFile(
  file: Pick<File, 'name' | 'type' | 'size'>,
  section: GallerySection,
): string | null {
  const mediaType = getGalleryMediaTypeForFile(file);

  if (!mediaType) {
    return 'Please select a supported image or video file.';
  }

  if (
    section === GALLERY_SECTIONS.PRE_WEDDING &&
    mediaType === GALLERY_MEDIA_TYPES.VIDEO
  ) {
    return 'Videos are not allowed in the pre-wedding gallery.';
  }

  const maxSize =
    mediaType === GALLERY_MEDIA_TYPES.VIDEO
      ? MAX_VIDEO_SIZE
      : MAX_IMAGE_SIZE;

  if (file.size > maxSize) {
    return mediaType === GALLERY_MEDIA_TYPES.VIDEO
      ? 'This video is too large. The maximum video size is 90 MB.'
      : 'This image is too large. The maximum image size is 10 MB.';
  }

  return null;
}

export function toGalleryItemResponse(
  item: GalleryItemDocument,
): GalleryItemResponse {
  return {
    id: item._id!.toString(),
    publicId: item.publicId,
    secureUrl: item.secureUrl,
    resourceType: item.resourceType,
    section: item.section,
    originalFilename: item.originalFilename,
    width: item.width,
    height: item.height,
    duration: item.duration,
    likes: Number(item.likes ?? 0),
    createdAt:
      item.createdAt instanceof Date
        ? item.createdAt.toISOString()
        : new Date(item.createdAt).toISOString(),
  };
}