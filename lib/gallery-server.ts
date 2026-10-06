import 'server-only';

import type { Db } from 'mongodb';

let indexPromise: Promise<void> | null = null;

export function ensureGalleryIndexes(db: Db): Promise<void> {
  if (!indexPromise) {
    indexPromise = Promise.all([
      db.collection('gallery').createIndex(
        { publicId: 1 },
        { unique: true, name: 'gallery_public_id_unique' },
      ),
      db.collection('gallery').createIndex(
        { section: 1, createdAt: -1, _id: -1 },
        { name: 'gallery_section_createdAt_id' },
      ),
      db.collection('blessings_prayers').createIndex(
        { createdAt: -1, _id: -1 },
        { name: 'blessings_createdAt_id' },
      ),
    ]).then(() => undefined);
  }

  return indexPromise;
}
