import React, { useState } from 'react';
import RestaurantForm from './RestaurantForm';
import MembershipTierList from './MembershipTierList';
import { CheckCircle, Loader2, Building2, CreditCard, CheckSquare, Wine } from 'lucide-react';
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
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-[#872657]' : 'text-gray-400'}`}>
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep >= 1 ? 'border-[#872657] bg-[#872657] text-white' : 'border-gray-300 text-gray-400'}`}
          >
            {currentStep > 1 ? <CheckCircle className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
          </div>
          <span className="mt-2 text-sm font-medium" style={{ fontFamily: 'TayBasal' }}>Restaurant Info</span>
        </div>
        <div className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${currentStep >= 2 ? 'bg-[#872657]' : 'bg-gray-300'}`}></div>
        <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-[#872657]' : 'text-gray-400'}`}>
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep >= 2 ? 'border-[#872657] bg-[#872657] text-white' : 'border-gray-300 text-gray-400'}`}
          >
            {currentStep > 2 ? <CheckCircle className="w-6 h-6" /> : <Wine className="w-6 h-6" />}
          </div>
          <span className="mt-2 text-sm font-medium" style={{ fontFamily: 'TayBasal' }}>Membership Tiers</span>
        </div>
        <div className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${currentStep >= 3 ? 'bg-[#872657]' : 'bg-gray-300'}`}></div>
        <div className={`flex flex-col items-center ${currentStep >= 3 ? 'text-[#872657]' : 'text-gray-400'}`}>
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep >= 3 ? 'border-[#872657] bg-[#872657] text-white' : 'border-gray-300 text-gray-400'}`}
          >
            <CheckSquare className="w-6 h-6" />
          </div>
          <span className="mt-2 text-sm font-medium" style={{ fontFamily: 'TayBasal' }}>Review & Submit</span>
        </div>
      </div>
    </div>
  );

  // Render step content based on current step
  let stepContent;
  
  switch (currentStep) {
    case 1:
      stepContent = (
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-lg border border-gray-200 transition-all duration-300 transform max-w-3xl md:max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-[#872657]" style={{ fontFamily: 'HV Florentino' }}>
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
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-lg border border-gray-200 transition-all duration-300 transform max-w-3xl md:max-w-4xl mx-auto">
          <MembershipTierList
            tiers={membershipTiers}
            restaurantId={restaurantId}
            onTierAdded={handleTierAdded}
            onTierUpdated={handleTierUpdated}
            onTierDeleted={handleTierDeleted}
            error={errors?.tiers}
          />
          <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex-1 py-3 px-6 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors duration-300"
              style={{ fontFamily: 'TayBasal' }}
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              disabled={membershipTiers.length === 0}
              className={`flex-1 py-3 px-6 bg-[#800020] text-white rounded-xl hover:bg-opacity-90 font-bold transition-all duration-300 ${membershipTiers.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ fontFamily: 'TayBasal' }}
            >
              Continue
            </button>
          </div>
        </div>
      );
      break;

    case 3:
      stepContent = (
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-lg border border-gray-200 transition-all duration-300 transform max-w-3xl md:max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-[#800020]" style={{ fontFamily: 'HV Florentino' }}>
            Review Your Registration
          </h2>

          {errors?.general && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl border border-red-200">
              {errors.general}
            </div>
          )}

          <div className="mb-12 space-y-10">
            <div className="bg-gray-50 rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-[#800020]" style={{ fontFamily: 'HV Florentino' }}>
                <div className="w-8 h-8 rounded-full bg-[#800020] text-white flex items-center justify-center mr-3 text-sm">
                  <Building2 className="w-4 h-4" />
                </div>
                Restaurant Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'TayBasal' }}>Restaurant Name</p>
                  <p className="font-medium" style={{ fontFamily: 'Libre Baskerville' }}>{restaurantData.restaurantName}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'TayBasal' }}>Admin Name</p>
                  <p className="font-medium" style={{ fontFamily: 'Libre Baskerville' }}>{restaurantData.adminName}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'TayBasal' }}>Email</p>
                  <p className="font-medium" style={{ fontFamily: 'Libre Baskerville' }}>{restaurantData.email}</p>
                </div>
                {restaurantData.website && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'TayBasal' }}>Website</p>
                    <p className="font-medium" style={{ fontFamily: 'Libre Baskerville' }}>{restaurantData.website}</p>
                  </div>
                )}
                {restaurantData.logo && (
                  <div className="col-span-2 bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'TayBasal' }}>Logo</p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center mr-3">
                        <img 
                          src={URL.createObjectURL(restaurantData.logo)} 
                          alt="Logo Preview" 
                          className="max-w-full max-h-full object-contain rounded-md"
                        />
                      </div>
                      <p className="font-medium" style={{ fontFamily: 'Libre Baskerville' }}>{restaurantData.logo.name}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-[#800020]" style={{ fontFamily: 'HV Florentino' }}>
                <div className="w-8 h-8 rounded-full bg-[#800020] text-white flex items-center justify-center mr-3 text-sm">
                  <Wine className="w-4 h-4" />
                </div>
                Membership Tiers
              </h3>
              
              {membershipTiers.length > 0 ? (
                <div className="space-y-4">
                  {membershipTiers.map((tier, index) => (
                    <div key={tier.id} className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-[#800020] text-lg" style={{ fontFamily: 'HV Florentino' }}>{tier.name}</p>
                          <p className="text-gray-800 font-bold text-xl mt-1" style={{ fontFamily: 'TayBasal' }}>
                            ${parseFloat(tier.price).toFixed(2)}/month
                          </p>
                          <p className="text-sm text-gray-600 mt-2" style={{ fontFamily: 'Libre Baskerville' }}>{tier.description}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-[#800020] bg-opacity-10 flex items-center justify-center">
                          <Wine className="w-6 h-6 text-[#800020]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-100" style={{ fontFamily: 'Libre Baskerville' }}>
                  No membership tiers added. Please go back and add at least one tier.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex-1 py-3 px-6 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors duration-300"
              style={{ fontFamily: 'TayBasal' }}
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting || membershipTiers.length === 0}
              className={`flex-1 py-3 px-6 bg-[#800020] text-white rounded-xl hover:bg-opacity-90 font-bold transition-all duration-300 ${(isSubmitting || membershipTiers.length === 0) ? 'opacity-70 cursor-not-allowed' : ''}`}
              style={{ fontFamily: 'TayBasal' }}
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
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500" style={{ fontFamily: 'Libre Baskerville' }}>
              By completing registration, you agree to Club Cuvee's <a href="/terms" className="text-[#800020] hover:underline">Terms of Service</a> and <a href="/privacy" className="text-[#800020] hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      );
      break;
      
    default:
      stepContent = null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fdfaf7] dark:bg-black py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-3xl md:max-w-4xl lg:max-w-5xl w-full mx-auto">
        {renderProgressSteps()}
        <div className="transition-all duration-500 ease-in-out transform">
          {stepContent}
        </div>
      </div>
    </div>
  );
};

export default RegistrationSteps;