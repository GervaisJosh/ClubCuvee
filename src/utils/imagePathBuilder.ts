import { StoragePathComponents } from '../types/image';

/**
 * Generates a standardized storage path for images
 * Following the pattern: businesses/{businessId}/{entityType}/{entityId}/{filename}
 */
export function buildStoragePath(components: StoragePathComponents): string {
  const { businessId, entityType, entityId, subPath, filename } = components;
  
  const pathParts: string[] = ['businesses'];
  
  if (businessId) {
    pathParts.push(businessId);
  }
  
  pathParts.push(entityType);
  
  if (entityId) {
    pathParts.push(entityId);
  }
  
  if (subPath) {
    pathParts.push(subPath);
  }
  
  pathParts.push(filename);
  
  return pathParts.join('/');
}

/**
 * Generates a unique filename with timestamp and proper extension
 */
export function generateUniqueFilename(
  originalFilename: string,
  prefix?: string
): string {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const extension = originalFilename.split('.').pop()?.toLowerCase() || 'jpg';
  
  const safeName = prefix 
    ? `${prefix}-${timestamp}-${randomSuffix}`
    : `${timestamp}-${randomSuffix}`;
    
  return `${safeName}.${extension}`;
}

/**
 * Extracts storage path components from a full storage path or URL
 */
export function parseStoragePath(pathOrUrl: string): Partial<StoragePathComponents> | null {
  // Remove any Supabase storage URL prefix
  const path = pathOrUrl
    .replace(/^https?:\/\/[^\/]+\/storage\/v1\/object\/public\/[^\/]+\//, '')
    .replace(/^\//, '');
  
  const parts = path.split('/');
  
  if (parts.length < 3 || parts[0] !== 'businesses') {
    return null;
  }
  
  const result: Partial<StoragePathComponents> = {
    businessId: parts[1],
    entityType: parts[2] as any,
  };
  
  if (parts.length > 3) {
    // Check if next part is a UUID (entityId) or filename
    const possibleEntityId = parts[3];
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (uuidRegex.test(possibleEntityId)) {
      result.entityId = possibleEntityId;
      if (parts.length > 4) {
        result.filename = parts[parts.length - 1];
        if (parts.length > 5) {
          result.subPath = parts.slice(4, -1).join('/');
        }
      }
    } else {
      result.filename = parts[parts.length - 1];
      if (parts.length > 4) {
        result.subPath = parts.slice(3, -1).join('/');
      }
    }
  }
  
  return result;
}

/**
 * Validates if a storage path follows the expected structure
 */
export function isValidStoragePath(path: string): boolean {
  const parsed = parseStoragePath(path);
  return parsed !== null && !!parsed.businessId && !!parsed.entityType;
}

/**
 * Converts a full Supabase storage URL to just the storage path
 */
export function urlToStoragePath(url: string): string | null {
  const match = url.match(/\/storage\/v1\/object\/public\/[^\/]+\/(.+)$/);
  return match ? match[1] : null;
}

/**
 * Gets the file extension from a filename or path
 */
export function getFileExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext || '';
}

/**
 * Validates if a file extension is an accepted image type
 */
export function isAcceptedImageType(filename: string, acceptedTypes?: string[]): boolean {
  const defaultTypes = ['png', 'jpg', 'jpeg', 'webp', 'gif'];
  const types = acceptedTypes || defaultTypes;
  const ext = getFileExtension(filename);
  
  return types.some(type => {
    const cleanType = type.replace('image/', '').toLowerCase();
    return cleanType === ext;
  });
}