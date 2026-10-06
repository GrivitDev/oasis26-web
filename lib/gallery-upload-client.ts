export type GalleryUploadSection =
  | 'pre-wedding'
  | 'live';

export type GalleryUploadResourceType =
  | 'image'
  | 'video';

export type UploadSignatureResponse = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  publicId: string;
  resourceType: GalleryUploadResourceType;
};

export type CloudinaryUploadResponse = {
  public_id: string;
  secure_url?: string;
  resource_type: GalleryUploadResourceType;
  width?: number;
  height?: number;
  duration?: number;
};

type CloudinaryUploadErrorResponse = {
  error?: {
    message?: string;
  };
};

function isCloudinaryUploadResponse(
  value: unknown,
): value is CloudinaryUploadResponse {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<CloudinaryUploadResponse>;

  return (
    typeof candidate.public_id === 'string' &&
    (candidate.resource_type === 'image' ||
      candidate.resource_type === 'video')
  );
}

function getCloudinaryUploadErrorMessage(
  value: unknown,
): string | undefined {
  if (!value || typeof value !== 'object') return undefined;

  const candidate = value as CloudinaryUploadErrorResponse;
  return typeof candidate.error?.message === 'string'
    ? candidate.error.message
    : undefined;
}

async function parseResponse<T>(response: Response): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch {
    throw new Error('The server returned an invalid response.');
  }
}

export async function requestGalleryUploadSignature(
  resourceType: GalleryUploadResourceType,
  section: GalleryUploadSection,
  uploadToken?: string,
): Promise<UploadSignatureResponse> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const response = await fetch('/api/gallery/upload', {
    method: 'POST',
    headers,
    cache: 'no-store',
    body: JSON.stringify({
      action: 'sign',
      section,
      resourceType,
      uploadToken: uploadToken?.trim() || undefined,
    }),
  });

  const data = await parseResponse<
    UploadSignatureResponse | { error?: string }
  >(response);

  if (!response.ok) {
    throw new Error(
      'error' in data && data.error
        ? data.error
        : 'Unable to prepare the upload.',
    );
  }

  return data as UploadSignatureResponse;
}

export async function uploadGalleryFileToCloudinary(
  file: File,
  uploadSignature: UploadSignatureResponse,
  onProgress: (loaded: number, total: number) => void,
): Promise<CloudinaryUploadResponse> {
  const formData = new FormData();

  formData.append('file', file);
  formData.append('api_key', uploadSignature.apiKey);
  formData.append('timestamp', String(uploadSignature.timestamp));
  formData.append('signature', uploadSignature.signature);
  formData.append('folder', uploadSignature.folder);
  formData.append('public_id', uploadSignature.publicId);

  const uploadUrl =
    `https://api.cloudinary.com/v1_1/${uploadSignature.cloudName}/${uploadSignature.resourceType}/upload`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('POST', uploadUrl);
    xhr.responseType = 'text';

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(event.loaded, event.total);
      }
    };

    xhr.onload = () => {
      let data: unknown = null;

      try {
        data = JSON.parse(xhr.responseText) as unknown;
      } catch {
        data = null;
      }

      if (
        xhr.status >= 200 &&
        xhr.status < 300 &&
        isCloudinaryUploadResponse(data)
      ) {
        resolve(data);
        return;
      }

      const message =
        getCloudinaryUploadErrorMessage(data);

      reject(
        new Error(message || 'Cloudinary upload failed.'),
      );
    };

    xhr.onerror = () => {
      reject(
        new Error('Network error while uploading to Cloudinary.'),
      );
    };

    xhr.onabort = () => {
      reject(new Error('Upload was cancelled.'));
    };

    xhr.send(formData);
  });
}

export async function completeGalleryUpload(
  section: GalleryUploadSection,
  cloudinaryResult: CloudinaryUploadResponse,
  uploadFile: File,
  uploadToken?: string,
) {
  const response = await fetch('/api/gallery/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    body: JSON.stringify({
      action: 'complete',
      section,
      publicId: cloudinaryResult.public_id,
      resourceType: cloudinaryResult.resource_type,
      originalFilename: uploadFile.name,
      width: cloudinaryResult.width,
      height: cloudinaryResult.height,
      duration: cloudinaryResult.duration,
      uploadToken: uploadToken?.trim() || undefined,
    }),
  });

  const data = await parseResponse<{
    item?: unknown;
    error?: string;
  }>(response);

  if (!response.ok) {
    throw new Error(
      data.error || 'Unable to save the gallery item.',
    );
  }

  return data;
}
