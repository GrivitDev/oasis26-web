# OASIS'26 deployment notes for these replacements

## Required environment variables

Keep your existing Cloudinary and MongoDB variables, and add:

- `PREWEDDING_UPLOAD_TOKEN` — server-only private token used by the pre-wedding upload flow.

Do not use `NEXT_PUBLIC_PREWEDDING_UPLOAD_TOKEN` anymore.

Also set:

- `NEXT_PUBLIC_SITE_URL` — the real production site URL, without needing to include a trailing slash.

## Cloudinary

The application now derives the trusted gallery `secureUrl` from the verified Cloudinary asset. The browser no longer supplies a trusted media URL to the completion API.

## Replacement note

The files in this package are intended to replace the corresponding files in `oasis26-web/`. The only new source files are:

- `lib/gallery-server.ts`
- `lib/gallery-upload-client.ts`
- `next.config.ts`
