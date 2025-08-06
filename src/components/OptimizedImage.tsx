import React, { useState, useEffect, useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { imageService } from '../services/imageService';
import { ImageUrlOptions } from '../types/image';

interface OptimizedImageProps {
  src?: string | null;
  storagePath?: string;
  alt: string;
  fallbackSrc?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  onError?: () => void;
  onLoad?: () => void;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  width?: number;
  height?: number;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

const DEFAULT_FALLBACK = '/images/placeholder-wine.jpg';
const DEFAULT_BLUR_DATA_URL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAAYACAMBIgACEQEDEQH/xAAVAAEBAAAAAAAAAAAAAAAAAAAABv/EAB4QAAICAgIDAAAAAAAAAAAAAAECAAMEESExBRJR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAL/xAAWEQEBAQAAAAAAAAAAAAAAAAABAAL/2gAMAwEAAhEDEQA/AJ2vBy7Ld1YjTjuLEEixBznP/9k=';

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  storagePath,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  sizes,
  loading = 'lazy',
  onError,
  onLoad,
  className = '',
  objectFit = 'cover',
  width,
  height,
  quality = 80,
  placeholder = 'blur',
  blurDataURL = DEFAULT_BLUR_DATA_URL
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Use intersection observer for lazy loading
  const [elementRef, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
    freezeOnceVisible: true
  });
  
  // Determine the image URL
  useEffect(() => {
    if (storagePath) {
      // Generate URL from storage path with transformations
      const urlOptions: ImageUrlOptions = {
        transform: {}
      };
      
      if (width) urlOptions.transform!.width = width;
      if (height) urlOptions.transform!.height = height;
      if (quality) urlOptions.transform!.quality = quality;
      
      const url = imageService.getPublicUrl(storagePath, urlOptions);
      setImageSrc(url);
    } else if (src) {
      // Check if src is a storage path that needs conversion
      const path = imageService.urlToPath(src);
      if (path) {
        const urlOptions: ImageUrlOptions = {
          transform: {}
        };
        
        if (width) urlOptions.transform!.width = width;
        if (height) urlOptions.transform!.height = height;
        if (quality) urlOptions.transform!.quality = quality;
        
        const url = imageService.getPublicUrl(path, urlOptions);
        setImageSrc(url);
      } else {
        // Use src as-is
        setImageSrc(src);
      }
    }
  }, [src, storagePath, width, height, quality]);
  
  // Handle image load
  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };
  
  // Handle image error
  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    
    // Try fallback
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
    
    onError?.();
  };
  
  // Determine what to render
  const shouldLoad = loading === 'eager' || isIntersecting;
  const showPlaceholder = isLoading && placeholder === 'blur';
  const showImage = shouldLoad && imageSrc && !hasError;
  
  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`relative overflow-hidden ${className}`}
      style={{
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined
      }}
    >
      {/* Blur placeholder */}
      {showPlaceholder && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full filter blur-sm scale-110"
          style={{ objectFit }}
          aria-hidden="true"
        />
      )}
      
      {/* Main image */}
      {showImage && (
        <img
          ref={imageRef}
          src={imageSrc}
          alt={alt}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          className={`
            w-full h-full transition-opacity duration-300
            ${isLoading ? 'opacity-0' : 'opacity-100'}
          `}
          style={{ objectFit }}
          loading={loading}
        />
      )}
      
      {/* Loading skeleton */}
      {isLoading && !showPlaceholder && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
      
      {/* Error state */}
      {hasError && imageSrc === fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center p-4">
            <svg
              className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Failed to load image
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;