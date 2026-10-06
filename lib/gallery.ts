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

export const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]);

export const ALLOWED_VIDEO_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
]);

export function validateGalleryUploadFile(
  file: Pick<File, 'type' | 'size'>,
  section: GallerySection,
): string | null {
  const isVideo = file.type.startsWith('video/');

  if (section === GALLERY_SECTIONS.PRE_WEDDING && isVideo) {
    return 'Videos are not allowed in the pre-wedding gallery.';
  }

  if (isVideo && !ALLOWED_VIDEO_TYPES.has(file.type)) {
    return 'Please select an MP4, WebM, or MOV video.';
  }

  if (!isVideo && !ALLOWED_IMAGE_TYPES.has(file.type)) {
    return 'Please select a JPEG, PNG, WebP, HEIC, or HEIF image.';
  }

  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

  if (file.size > maxSize) {
    return isVideo
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
