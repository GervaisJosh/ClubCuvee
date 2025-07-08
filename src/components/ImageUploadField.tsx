import React, { useState, useRef } from 'react';
import { Image, Upload, X, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ImageUploadFieldProps {
  label: string;
  onUploadComplete: (url: string) => void;
  businessId: string;
  uploadPath: string; // e.g., 'logo' or 'tiers/{tierId}'
  maxSizeMB?: number;
  acceptedTypes?: string[];
  className?: string;
  existingImageUrl?: string;
  disabled?: boolean;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  onUploadComplete,
  businessId,
  uploadPath,
  maxSizeMB = 5,
  acceptedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
  className = '',
  existingImageUrl,
  disabled = false
}) => {
  const { session } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(existingImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      return `File size must be less than ${maxSizeMB}MB`;
    }

    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return `Please upload one of: ${acceptedTypes.join(', ').replace(/image\//g, '').toUpperCase()}`;
    }

    return null;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset state
    setError(null);
    setUploadProgress(0);

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    if (!session) {
      setError('You must be logged in to upload images');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `${uploadPath.replace(/\//g, '-')}-${timestamp}.${fileExt}`;
      const filePath = `businesses/${businessId}/${uploadPath}/${fileName}`;

      // Upload to Supabase storage with progress tracking
      const { data, error: uploadError } = await supabase.storage
        .from('business-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('business-assets')
        .getPublicUrl(filePath);

      // Notify parent component
      onUploadComplete(publicUrl);
      setUploadProgress(100);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onUploadComplete('');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </label>

      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt={label}
            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
          />
          {!disabled && (
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <button
                type="button"
                onClick={removeImage}
                className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="text-sm font-medium mb-2">Uploading...</div>
                <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-[#800020] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            disabled={disabled || uploading}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || uploading}
            className={`w-full border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              disabled || uploading
                ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                : 'border-gray-400 hover:border-[#800020] hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'
            }`}
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {acceptedTypes.join(', ').replace(/image\//g, '').toUpperCase()} (max {maxSizeMB}MB)
            </p>
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;