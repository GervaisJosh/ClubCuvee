import { supabase } from '../lib/supabase';
import {
  ImageValidationOptions,
  ImageUploadOptions,
  ImageMetadata,
  StoragePathComponents,
  ImageUrlOptions,
  BatchUploadResult,
  ImageValidationError,
  ImageUploadError
} from '../types/image';
import {
  buildStoragePath,
  generateUniqueFilename,
  parseStoragePath,
  urlToStoragePath,
  isAcceptedImageType
} from '../utils/imagePathBuilder';

export class ImageService {
  private static instance: ImageService;
  private readonly bucketName = 'business-assets';
  
  private constructor() {}
  
  public static getInstance(): ImageService {
    if (!ImageService.instance) {
      ImageService.instance = new ImageService();
    }
    return ImageService.instance;
  }
  
  /**
   * Validates a file against specified constraints
   */
  public async validateFile(
    file: File,
    options: ImageValidationOptions = {}
  ): Promise<void> {
    const {
      maxSizeMB = 5,
      acceptedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
      maxWidth,
      maxHeight,
      minWidth,
      minHeight
    } = options;
    
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new ImageValidationError(
        `File size must be less than ${maxSizeMB}MB`,
        'SIZE_EXCEEDED'
      );
    }
    
    // Check file type
    if (!acceptedTypes.includes(file.type) && !isAcceptedImageType(file.name, acceptedTypes)) {
      throw new ImageValidationError(
        `File type must be one of: ${acceptedTypes.join(', ')}`,
        'INVALID_TYPE'
      );
    }
    
    // Check dimensions if specified
    if (maxWidth || maxHeight || minWidth || minHeight) {
      const dimensions = await this.getImageDimensions(file);
      
      if (maxWidth && dimensions.width > maxWidth) {
        throw new ImageValidationError(
          `Image width must be less than ${maxWidth}px`,
          'INVALID_DIMENSIONS'
        );
      }
      
      if (maxHeight && dimensions.height > maxHeight) {
        throw new ImageValidationError(
          `Image height must be less than ${maxHeight}px`,
          'INVALID_DIMENSIONS'
        );
      }
      
      if (minWidth && dimensions.width < minWidth) {
        throw new ImageValidationError(
          `Image width must be at least ${minWidth}px`,
          'INVALID_DIMENSIONS'
        );
      }
      
      if (minHeight && dimensions.height < minHeight) {
        throw new ImageValidationError(
          `Image height must be at least ${minHeight}px`,
          'INVALID_DIMENSIONS'
        );
      }
    }
  }
  
  /**
   * Generates a storage path for an entity
   */
  public generateStoragePath(
    entityType: StoragePathComponents['entityType'],
    businessId: string,
    filename: string,
    entityId?: string,
    subPath?: string
  ): string {
    const uniqueFilename = generateUniqueFilename(filename, entityType);
    
    return buildStoragePath({
      bucket: this.bucketName,
      businessId,
      entityType,
      entityId,
      subPath,
      filename: uniqueFilename
    });
  }
  
  /**
   * Uploads a file to Supabase storage
   */
  public async upload(
    file: File,
    path: string,
    options: ImageUploadOptions = {}
  ): Promise<{ path: string; url: string; metadata: ImageMetadata }> {
    const {
      cacheControl = '3600',
      upsert = false,
      onProgress
    } = options;
    
    try {
      // Upload file
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(path, file, {
          cacheControl,
          upsert
        });
      
      if (error) {
        throw new ImageUploadError(
          `Failed to upload file: ${error.message}`,
          'UPLOAD_FAILED'
        );
      }
      
      // Get public URL
      const url = this.getPublicUrl(path);
      
      // Create metadata
      const metadata: ImageMetadata = {
        size: file.size,
        mimeType: file.type,
        uploadedAt: new Date()
      };
      
      // Get dimensions if it's an image
      if (file.type.startsWith('image/')) {
        try {
          const dimensions = await this.getImageDimensions(file);
          metadata.width = dimensions.width;
          metadata.height = dimensions.height;
        } catch (error) {
          console.warn('Failed to get image dimensions:', error);
        }
      }
      
      // Call progress callback with 100%
      if (onProgress) {
        onProgress(100);
      }
      
      return { path, url, metadata };
    } catch (error) {
      if (error instanceof ImageUploadError) {
        throw error;
      }
      throw new ImageUploadError(
        `Unexpected error during upload: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'UPLOAD_FAILED'
      );
    }
  }
  
  /**
   * Gets the public URL for a storage path
   */
  public getPublicUrl(storagePath: string, options?: ImageUrlOptions): string {
    const { data } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(storagePath);
    
    let url = data.publicUrl;
    
    // Add transformation parameters if specified
    if (options?.transform) {
      const params = new URLSearchParams();
      
      if (options.transform.width) {
        params.append('width', options.transform.width.toString());
      }
      if (options.transform.height) {
        params.append('height', options.transform.height.toString());
      }
      if (options.transform.quality) {
        params.append('quality', options.transform.quality.toString());
      }
      if (options.transform.format) {
        params.append('format', options.transform.format);
      }
      
      url += '?' + params.toString();
    }
    
    if (options?.download) {
      const separator = url.includes('?') ? '&' : '?';
      url += `${separator}download=true`;
    }
    
    return url;
  }
  
  /**
   * Converts a URL to a storage path (for migration)
   */
  public urlToPath(url: string): string | null {
    return urlToStoragePath(url);
  }
  
  /**
   * Deletes an image from storage
   */
  public async deleteImage(storagePath: string): Promise<void> {
    const { error } = await supabase.storage
      .from(this.bucketName)
      .remove([storagePath]);
    
    if (error) {
      throw new ImageUploadError(
        `Failed to delete image: ${error.message}`,
        'STORAGE_ERROR'
      );
    }
  }
  
  /**
   * Batch upload multiple files
   */
  public async batchUpload(
    files: File[],
    basePath: string,
    validationOptions?: ImageValidationOptions,
    uploadOptions?: ImageUploadOptions
  ): Promise<BatchUploadResult> {
    const result: BatchUploadResult = {
      successful: [],
      failed: []
    };
    
    // Process files in parallel with a limit
    const BATCH_SIZE = 3;
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE);
      
      await Promise.all(
        batch.map(async (file) => {
          try {
            // Validate file
            if (validationOptions) {
              await this.validateFile(file, validationOptions);
            }
            
            // Generate path
            const path = `${basePath}/${generateUniqueFilename(file.name)}`;
            
            // Upload
            const uploadResult = await this.upload(file, path, uploadOptions);
            
            result.successful.push({
              file,
              path: uploadResult.path,
              url: uploadResult.url
            });
          } catch (error) {
            result.failed.push({
              file,
              error: error instanceof Error ? error : new Error('Unknown error')
            });
          }
        })
      );
    }
    
    return result;
  }
  
  /**
   * Lists all images in a given path
   */
  public async listImages(path: string): Promise<string[]> {
    const { data, error } = await supabase.storage
      .from(this.bucketName)
      .list(path);
    
    if (error) {
      throw new ImageUploadError(
        `Failed to list images: ${error.message}`,
        'STORAGE_ERROR'
      );
    }
    
    return data
      .filter(file => !file.name.endsWith('/'))
      .map(file => `${path}/${file.name}`);
  }
  
  /**
   * Gets image dimensions from a File object
   */
  private getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };
      
      img.src = url;
    });
  }
  
  /**
   * Cleans up orphaned images for a business
   * This should be run periodically or after major deletions
   */
  public async cleanupOrphanedImages(
    businessId: string,
    activeStoragePaths: string[]
  ): Promise<string[]> {
    const deletedPaths: string[] = [];
    
    try {
      // List all images for the business
      const allImages = await this.listImages(`businesses/${businessId}`);
      
      // Find orphaned images
      const orphanedImages = allImages.filter(
        imagePath => !activeStoragePaths.includes(imagePath)
      );
      
      // Delete orphaned images
      for (const path of orphanedImages) {
        try {
          await this.deleteImage(path);
          deletedPaths.push(path);
        } catch (error) {
          console.error(`Failed to delete orphaned image ${path}:`, error);
        }
      }
      
      return deletedPaths;
    } catch (error) {
      console.error('Failed to cleanup orphaned images:', error);
      return deletedPaths;
    }
  }
}

// Export singleton instance
export const imageService = ImageService.getInstance();