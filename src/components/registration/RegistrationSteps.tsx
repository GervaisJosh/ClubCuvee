import React, { useState } from 'react';
import RestaurantForm from './RestaurantForm';
import MembershipTierList from './MembershipTierList';
import { CheckCircle, Loader2 } from 'lucide-react';
import { LoadingSpinner } from '../shared/LoadingStates';
import type { RestaurantFormData, MembershipTier, FormErrors } from '../../types';

interface RegistrationStepsProps {
  initialStep?: number;
  initialRestaurantData?: RestaurantFormData;
  initialTiers?: MembershipTier[];
  onComplete: (data: {
    restaurant: RestaurantFormData;
    tiers: MembershipTier[];
    restaurantId?: string;
  }) => void;
  isSubmitting?: boolean;
  sessionId?: string;
  errors?: {
    restaurant?: FormErrors;
    tiers?: string;
    general?: string;
  };
  restaurantId?: string;
}

const RegistrationSteps: React.FC<RegistrationStepsProps> = ({
  initialStep = 1,
  initialRestaurantData = {
    restaurantName: '',
    adminName: '',
    email: '',
    website: '',
    logo: null,
    password: '',
    confirmPassword: '',
  },
  initialTiers = [],
  onComplete,
  isSubmitting = false,
  sessionId,
  errors = {},
  restaurantId,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [restaurantData, setRestaurantData] = useState<RestaurantFormData>(initialRestaurantData);
  const [membershipTiers, setMembershipTiers] = useState<MembershipTier[]>(initialTiers);

  // Handle restaurant form submission
  const handleRestaurantSubmit = (data: RestaurantFormData) => {
    setRestaurantData(data);
    setCurrentStep(2);
  };

  // Handle membership tier operations
  const handleTierAdded = (tier: MembershipTier) => {
    setMembershipTiers([...membershipTiers, tier]);
  };

  const handleTierUpdated = (updatedTier: MembershipTier) => {
    setMembershipTiers(membershipTiers.map(tier => 
      tier.id === updatedTier.id ? updatedTier : tier
    ));
  };

  const handleTierDeleted = (tierId: string) => {
    setMembershipTiers(membershipTiers.filter(tier => tier.id !== tierId));
  };

  // Submit final registration
  const handleFinalSubmit = () => {
    // Validate requirements before submission
    if (membershipTiers.length === 0) {
      // Display error - at least one tier required
      return;
    }

    onComplete({
      restaurant: restaurantData,
      tiers: membershipTiers,
      restaurantId,
    });
  };

  // Render progress steps UI
  const renderProgressSteps = () => (
    <div className="mb-10">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-[#872657]' : 'text-gray-400'}`}>
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'border-[#872657] bg-[#872657] text-white' : 'border-gray-300 text-gray-400'}`}
          >
            {currentStep > 1 ? <CheckCircle className="w-6 h-6" /> : 1}
          </div>
          <span className="mt-2 text-sm font-medium">Restaurant Info</span>
        </div>
        <div className={`flex-1 h-0.5 mx-4 ${currentStep >= 2 ? 'bg-[#872657]' : 'bg-gray-300'}`}></div>
        <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-[#872657]' : 'text-gray-400'}`}>
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'border-[#872657] bg-[#872657] text-white' : 'border-gray-300 text-gray-400'}`}
          >
            {currentStep > 2 ? <CheckCircle className="w-6 h-6" /> : 2}
          </div>
          <span className="mt-2 text-sm font-medium">Membership Tiers</span>
        </div>
        <div className={`flex-1 h-0.5 mx-4 ${currentStep >= 3 ? 'bg-[#872657]' : 'bg-gray-300'}`}></div>
        <div className={`flex flex-col items-center ${currentStep >= 3 ? 'text-[#872657]' : 'text-gray-400'}`}>
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${currentStep >= 3 ? 'border-[#872657] bg-[#872657] text-white' : 'border-gray-300 text-gray-400'}`}
          >
            3
          </div>
          <span className="mt-2 text-sm font-medium">Review & Submit</span>
        </div>
      </div>
    </div>
  );

  // Render step content based on current step
  let stepContent;
  
  switch (currentStep) {
    case 1:
      stepContent = (
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-[#872657]">
            Restaurant Details
          </h2>
          <RestaurantForm
            initialData={restaurantData}
            onSubmit={handleRestaurantSubmit}
            errors={errors?.restaurant}
            sessionId={sessionId}
          />
        </div>
      );
      break;

    case 2:
      stepContent = (
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <MembershipTierList
            tiers={membershipTiers}
            restaurantId={restaurantId}
            onTierAdded={handleTierAdded}
            onTierUpdated={handleTierUpdated}
            onTierDeleted={handleTierDeleted}
            error={errors?.tiers}
          />
          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex-1 py-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              disabled={membershipTiers.length === 0}
              className={`flex-1 py-3 bg-[#872657] text-white rounded-md hover:bg-opacity-90 font-bold transition-colors ${membershipTiers.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Continue
            </button>
          </div>
        </div>
      );
      break;

    case 3:
      stepContent = (
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-[#872657]">
            Review Your Registration
          </h2>

          {errors?.general && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
              {errors.general}
            </div>
          )}

          <div className="mb-8 space-y-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-[#872657]">
                <span className="w-7 h-7 rounded-full bg-[#872657] text-white flex items-center justify-center mr-2 text-sm">1</span>
                Restaurant Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Restaurant Name</p>
                  <p className="font-medium">{restaurantData.restaurantName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Admin Name</p>
                  <p className="font-medium">{restaurantData.adminName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{restaurantData.email}</p>
                </div>
                {restaurantData.website && (
                  <div>
                    <p className="text-sm text-gray-600">Website</p>
                    <p className="font-medium">{restaurantData.website}</p>
                  </div>
                )}
                {restaurantData.logo && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Logo</p>
                    <p className="font-medium">{restaurantData.logo.name}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-[#872657]">
                <span className="w-7 h-7 rounded-full bg-[#872657] text-white flex items-center justify-center mr-2 text-sm">2</span>
                Membership Tiers
              </h3>
              
              {membershipTiers.length > 0 ? (
                <div className="space-y-4">
                  {membershipTiers.map((tier, index) => (
                    <div key={tier.id} className="p-4 bg-white rounded-md border border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-[#872657]">{tier.name}</p>
                          <p className="text-gray-800 font-bold">
                            ${typeof tier.price === 'string' ? parseFloat(tier.price).toFixed(2) : tier.price.toFixed(2)}/month
                          </p>
                          <p className="text-sm text-gray-600 mt-1">{tier.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-red-500">No membership tiers added. Please go back and add at least one tier.</p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex-1 py-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting || membershipTiers.length === 0}
              className={`flex-1 py-3 bg-[#872657] text-white rounded-md hover:bg-opacity-90 font-bold transition-colors ${(isSubmitting || membershipTiers.length === 0) ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Processing...
                </div>
              ) : (
                'Complete Registration'
              )}
            </button>
          </div>
        </div>
      );
      break;
      
    default:
      stepContent = null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {renderProgressSteps()}
      {stepContent}
    </div>
  );
};

export default RegistrationSteps;