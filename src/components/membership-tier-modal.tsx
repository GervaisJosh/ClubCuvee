import React, { useState, useEffect } from 'react';
import { X, Loader2, Wine, Tag, FileText } from 'lucide-react';

// Type definitions for TypeScript
// Import the standard MembershipTier type instead of defining it
import { MembershipTier } from '../types';

interface MembershipTierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tier: MembershipTier) => void;
  initialData: MembershipTier;
  isEditing: boolean;
  restaurantId?: string; // Optional: might not be available during initial registration
}

const MembershipTierModal: React.FC<MembershipTierModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEditing,
  restaurantId
}) => {
  const [tierData, setTierData] = useState<MembershipTier>(initialData);
  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset the form when the modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      setTierData(initialData);
      setErrors({});
    }
  }, [isOpen, initialData]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTierData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors: {
      name?: string;
      price?: string;
      general?: string;
    } = {};

    if (!tierData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!tierData.price) {
      newErrors.price = 'Price is required';
    } else {
      const priceValue = parseFloat(tierData.price);
      if (isNaN(priceValue) || priceValue <= 0) {
        newErrors.price = 'Price must be a positive number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission - calls our new API instead of direct Supabase insert
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      // If restaurantId is not available yet (during initial registration),
      // just return the tier data to be saved later
      if (!restaurantId) {
        // Generate a temporary client-side ID if creating a new tier
        if (!isEditing && !tierData.id) {
          tierData.id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
        }
        
        // Call the parent's onSave with the tier data
        onSave(tierData);
        onClose();
        return;
      }
      
      // If we have a restaurantId, call our membership-tiers API endpoint
      const response = await fetch('/api/membership-tiers', {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: isEditing ? tierData.id : undefined,
          name: tierData.name,
          price: tierData.price,
          description: tierData.description,
          restaurant_id: restaurantId,
          // Include these if they exist (for reconnection scenarios)
          stripe_price_id: tierData.stripe_price_id,
          stripe_product_id: tierData.stripe_product_id,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save membership tier');
      }
      
      const savedTier = await response.json();
      
      // If we have a warning, show it but continue
      if (savedTier.warning) {
        console.warn('Stripe warning:', savedTier.warning);
        // Optional: could show a toast notification here
      }
      
      // Call the parent's onSave function with the saved tier data
      onSave(savedTier);
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error('Error saving tier:', error);
      setErrors({ 
        general: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold text-[#800020]" style={{ fontFamily: 'HV Florentino' }}>
            {isEditing ? 'Edit Membership Tier' : 'Add Membership Tier'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errors.general && (
            <div className="p-4 bg-red-100 text-red-700 rounded-xl border border-red-200 mb-4">
              {errors.general}
            </div>
          )}
          
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'TayBasal' }}>
              <Wine className="w-4 h-4 mr-2 text-[#800020]" />
              Tier Name *
            </label>
            <input
              type="text"
              name="name"
              value={tierData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } rounded-xl focus:ring-2 focus:ring-[#800020] focus:border-transparent transition-all duration-200`}
              placeholder="e.g., Bronze, Silver, Gold"
              disabled={isSubmitting}
              required
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>
          
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'TayBasal' }}>
              <Tag className="w-4 h-4 mr-2 text-[#800020]" />
              Monthly Price ($) *
            </label>
            <input
              type="number"
              name="price"
              value={tierData.price}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              } rounded-xl focus:ring-2 focus:ring-[#800020] focus:border-transparent transition-all duration-200`}
              placeholder="e.g., 29.99"
              step="0.01"
              min="0.01"
              disabled={isSubmitting}
              required
            />
            {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
          </div>
          
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'TayBasal' }}>
              <FileText className="w-4 h-4 mr-2 text-[#800020]" />
              Description
            </label>
            <textarea
              name="description"
              value={tierData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#800020] focus:border-transparent transition-all duration-200"
              placeholder="Describe what members get with this tier..."
              rows={3}
              disabled={isSubmitting}
              style={{ fontFamily: 'Libre Baskerville' }}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              disabled={isSubmitting}
              style={{ fontFamily: 'TayBasal' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#800020] text-white rounded-xl hover:bg-opacity-90 transition-all duration-200 flex items-center"
              disabled={isSubmitting}
              style={{ fontFamily: 'TayBasal' }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Tier'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MembershipTierModal;