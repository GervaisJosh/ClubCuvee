export interface ImageValidationOptions {
  maxSizeMB?: number;
  acceptedTypes?: string[];
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;
}

export interface ImageUploadOptions {
  cacheControl?: string;
  upsert?: boolean;
  onProgress?: (progress: number) => void;
}

export interface ImageMetadata {
  width?: number;
  height?: number;
  size: number;
  mimeType: string;
  uploadedAt: Date;
  uploadedBy?: string;
}

export interface StoragePathComponents {
  bucket: string;
  businessId?: string;
  entityType: 'logo' | 'tiers' | 'wines' | 'customers' | 'gallery';
  entityId?: string;
  subPath?: string;
  filename: string;
}

export interface ImageUrlOptions {
  transform?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
  };
  download?: boolean;
}

export interface BatchUploadResult {
  successful: Array<{
    file: File;
    path: string;
    url: string;
  }>;
  failed: Array<{
    file: File;
    error: Error;
  }>;
}

export class ImageValidationError extends Error {
  constructor(
    message: string,
    public code: 'SIZE_EXCEEDED' | 'INVALID_TYPE' | 'INVALID_DIMENSIONS' | 'INVALID_FILE'
  ) {
    super(message);
    this.name = 'ImageValidationError';
  }
}

export class ImageUploadError extends Error {
  constructor(
    message: string,
    public code: 'UPLOAD_FAILED' | 'STORAGE_ERROR' | 'PERMISSION_DENIED'
  ) {
    super(message);
    this.name = 'ImageUploadError';
  }
}