import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import type { RestaurantFormData, FormErrors } from '../../types';
import { LoadingSpinner } from '../shared/LoadingStates';

interface PricingTierInfo {
  name: string;
  monthlyPrice: string;
  description: string;
}

interface RestaurantFormProps {
  initialData: RestaurantFormData;
  onSubmit: (data: RestaurantFormData) => void;
  isSubmitting?: boolean;
  errors?: FormErrors;
  sessionId?: string;
  tierInfo?: PricingTierInfo | null;
}

const RestaurantForm: React.FC<RestaurantFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
  errors = {},
  sessionId,
  tierInfo = null,
}) => {
  const [formData, setFormData] = useState<RestaurantFormData>(initialData);
  const [localErrors, setLocalErrors] = useState<FormErrors>({});

  // Reset form when initialData changes
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Merge external errors into local state
  useEffect(() => {
    setLocalErrors(errors);
  }, [errors]);

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Validate password strength
  const validatePassword = (password: string): string[] => {
    const issues = [];
    if (password.length < 8) {
      issues.push('at least 8 characters');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
      issues.push('at least one special character');
    }
    if (!/\d/.test(password)) {
      issues.push('at least one number');
    }
    if (!/[A-Z]/.test(password)) {
      issues.push('at least one uppercase letter');
    }
    return issues;
  };

  // Real-time validation on change
  const validateField = (name: string, value: string): string | undefined => {
    let error: string | undefined = undefined;

    switch (name) {
      case 'email':
        if (value && !validateEmail(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (value) {
          const issues = validatePassword(value);
          if (issues.length > 0) {
            error = `Password must contain ${issues.join(', ')}`;
          }
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;
    }

    return error;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear any existing error when the field is edited
    if (localErrors[name as keyof FormErrors]) {
      setLocalErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // Run real-time validation
    const validationError = validateField(name, value);
    if (validationError) {
      setLocalErrors((prev) => ({ ...prev, [name]: validationError }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    if (!ALLOWED_TYPES.includes(file.type)) {
      setLocalErrors({ general: 'Only JPG, PNG, and WEBP images are allowed' });
      return;
    }

    if (file.size > MAX_SIZE) {
      setLocalErrors({ general: 'File size must be less than 5MB' });
      return;
    }

    setFormData({ ...formData, logo: file });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation before submission
    let isValid = true;
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.restaurantName.trim()) {
      newErrors.restaurantName = 'Restaurant name is required';
      isValid = false;
    }
    
    if (!formData.adminName.trim()) {
      newErrors.adminName = 'Admin name is required';
      isValid = false;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else {
      const passwordIssues = validatePassword(formData.password);
      if (passwordIssues.length > 0) {
        newErrors.password = `Password must contain ${passwordIssues.join(', ')}`;
        isValid = false;
      }
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setLocalErrors(newErrors);

    // Submit if valid
    if (isValid) {
      // Include sessionId in submission if provided
      onSubmit({ ...formData, sessionId });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">
      {/* General error message */}
      {localErrors.general && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md border border-red-200">
          {localErrors.general}
        </div>
      )}
      
      {/* Pricing Tier Summary Box */}
      {tierInfo && (
        <div className="mb-6 p-6 rounded-xl border border-[#872657] bg-gradient-to-br from-[#fff8f8] to-[#fff]">
          <h3 className="text-xl font-bold mb-3 text-[#872657]" style={{ fontFamily: 'HV Florentino' }}>
            {tierInfo.name} Plan
          </h3>
          <div className="flex justify-between items-center mb-4">
            <p className="text-2xl font-bold text-[#872657]" style={{ fontFamily: 'TayBasal' }}>
              ${parseFloat(tierInfo.monthlyPrice).toFixed(2)}
              <span className="text-sm text-gray-600 ml-1">/month</span>
            </p>
            <div className="px-3 py-1 bg-[#872657] bg-opacity-10 rounded-full text-[#872657] text-sm font-medium">
              Selected Plan
            </div>
          </div>
          <p className="text-gray-700" style={{ fontFamily: 'TayBasal' }}>
            {tierInfo.description}
          </p>
          <div className="mt-4 pt-4 border-t border-[#872657] border-opacity-20">
            <h4 className="text-sm font-medium mb-2 text-gray-700">Included with {tierInfo.name}:</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-green-600">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                Personalized wine recommendations
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-green-600">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                Membership tier management
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-green-600">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                Customer accounts & profile data
              </li>
            </ul>
          </div>
        </div>
      )}

      <div className="space-y-6 md:space-y-8">
        {/* Restaurant Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Restaurant Name *
          </label>
          <input
            type="text"
            name="restaurantName"
            value={formData.restaurantName}
            onChange={handleInputChange}
            required
            className={`w-full px-4 py-2 border ${localErrors.restaurantName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#872657]`}
          />
          {localErrors.restaurantName && (
            <p className="mt-1 text-sm text-red-500">{localErrors.restaurantName}</p>
          )}
        </div>

        {/* Admin Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Admin Name *
          </label>
          <input
            type="text"
            name="adminName"
            value={formData.adminName}
            onChange={handleInputChange}
            required
            placeholder="Your full name"
            className={`w-full px-4 py-2 border ${localErrors.adminName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#872657]`}
          />
          {localErrors.adminName && (
            <p className="mt-1 text-sm text-red-500">{localErrors.adminName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="admin@yourrestaurant.com"
            className={`w-full px-4 py-2 border ${localErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#872657]`}
          />
          {localErrors.email && (
            <p className="mt-1 text-sm text-red-500">{localErrors.email}</p>
          )}
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <input
            type="url"
            name="website"
            value={formData.website || ''}
            onChange={handleInputChange}
            placeholder="https://www.yourrestaurant.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#872657]"
          />
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo
          </label>
          <div className="flex items-center space-x-2">
            <label className="cursor-pointer bg-[#2A3D45] text-white px-4 py-2 rounded-md hover:bg-opacity-90">
              <Upload className="inline-block w-5 h-5 mr-2" />
              Upload Logo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            {formData.logo && (
              <span className="text-sm text-gray-600">
                File selected: {formData.logo.name}
              </span>
            )}
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            placeholder="At least 8 characters"
            className={`w-full px-4 py-2 border ${localErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#872657]`}
          />
          {localErrors.password && (
            <p className="mt-1 text-sm text-red-500">{localErrors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password *
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            placeholder="Confirm your password"
            className={`w-full px-4 py-2 border ${localErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#872657]`}
          />
          {localErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{localErrors.confirmPassword}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full md:w-auto md:px-12 mt-8 bg-[#872657] text-white py-4 rounded-md hover:bg-opacity-90 font-bold text-lg flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            Processing...
          </>
        ) : (
          'Continue'
        )}
      </button>
    </form>
  );
};

export default RestaurantForm;
