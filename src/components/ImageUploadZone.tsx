import React, { useState, useRef, DragEvent } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ImageUploadZoneProps {
  onUpload: (file: File) => Promise<void>;
  currentImageUrl?: string;
  maxSizeMB: number;
  recommendedAspect?: string;
  label: string;
  helpText?: string;
  className?: string;
  disabled?: boolean;
}

const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({
  onUpload,
  currentImageUrl,
  maxSizeMB,
  recommendedAspect,
  label,
  helpText,
  className = '',
  disabled = false
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setError(null);

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PNG, JPG, JPEG, or WebP image');
      return;
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setIsUploading(true);
    try {
      await onUpload(file);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      setPreview(currentImageUrl || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
        {label}
      </label>
      
      {!preview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`
            relative cursor-pointer rounded-xl border-2 border-dashed p-8
            transition-all duration-200
            ${isDragging 
              ? `${isDark ? 'border-[#722f37] bg-[#722f37]/10' : 'border-[#722f37] bg-[#722f37]/5'}` 
              : `${isDark ? 'border-zinc-700 hover:border-zinc-600' : 'border-gray-300 hover:border-gray-400'}`
            }
            ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-opacity-5'}
            ${isDark ? 'hover:bg-[#722f37]/5' : 'hover:bg-[#722f37]/5'}
          `}
        >
          <div className="text-center">
            {isUploading ? (
              <Loader2 className={`mx-auto h-12 w-12 ${isDark ? 'text-gray-400' : 'text-gray-500'} animate-spin`} />
            ) : (
              <Upload className={`mx-auto h-12 w-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            )}
            <p className={`mt-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {isUploading ? 'Uploading...' : 'Click or drag image to upload'}
            </p>
            {helpText && (
              <p className={`mt-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {helpText}
              </p>
            )}
            <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Max size: {maxSizeMB}MB • PNG, JPG, JPEG, WebP
            </p>
            {recommendedAspect && (
              <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Recommended: {recommendedAspect}
              </p>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled}
          />
        </div>
      ) : (
        <div className={`relative rounded-xl overflow-hidden ${isDark ? 'bg-zinc-900' : 'bg-gray-50'} border ${isDark ? 'border-zinc-800' : 'border-gray-200'}`}>
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
          {!isUploading && !disabled && (
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {!isUploading && !disabled && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`absolute bottom-2 right-2 px-3 py-1.5 ${isDark ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-white hover:bg-gray-100'} ${isDark ? 'text-white' : 'text-gray-900'} rounded-lg text-sm font-medium transition-colors flex items-center gap-2`}
              type="button"
            >
              <ImageIcon className="h-4 w-4" />
              Change
            </button>
          )}
        </div>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default ImageUploadZone;