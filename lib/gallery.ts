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

export const MAX_IMAGE_SIZE = 40 * 1024 * 1024;
export const MAX_VIDEO_SIZE = 80 * 1024 * 1024;

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
    likes: item.likes,
    createdAt: item.createdAt.toISOString(),
  };
}