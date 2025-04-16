import React, { useState } from 'react';
import { Plus, Edit, Trash2, Wine, Tag, Star, Trophy, Grape, GlassWater } from 'lucide-react';
import type { MembershipTier } from '../../types';
import MembershipTierModal from '../membership-tier-modal';

interface MembershipTierListProps {
  tiers: MembershipTier[];
  restaurantId?: string;
  onTierAdded: (tier: MembershipTier) => void;
  onTierUpdated: (tier: MembershipTier) => void;
  onTierDeleted: (tierId: string) => void;
  minTiersRequired?: number;
  error?: string;
}

// Predefined tier colors and icons for visual variety
const tierIcons = [
  { icon: <Wine className="w-6 h-6" />, color: "#800020" },
  { icon: <Trophy className="w-6 h-6" />, color: "#AA7F39" },
  { icon: <Star className="w-6 h-6" />, color: "#2F4858" },
  { icon: <Grape className="w-6 h-6" />, color: "#5E2750" },
  { icon: <GlassWater className="w-6 h-6" />, color: "#2A3D45" }
];

const MembershipTierList: React.FC<MembershipTierListProps> = ({
  tiers,
  restaurantId,
  onTierAdded,
  onTierUpdated,
  onTierDeleted,
  minTiersRequired = 1,
  error,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [currentTier, setCurrentTier] = useState<MembershipTier>({
    id: '',
    name: '',
    price: '',
    description: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  const openAddModal = () => {
    setCurrentTier({
      id: '',
      name: '',
      price: '',
      description: '',
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (tier: MembershipTier) => {
    setCurrentTier(tier);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSave = (tier: MembershipTier) => {
    if (isEditing) {
      onTierUpdated(tier);
    } else {
      onTierAdded(tier);
    }
    setShowModal(false);
  };

  const confirmDelete = (tier: MembershipTier) => {
    // Check if we can safely delete this tier
    if (tiers.length <= minTiersRequired) {
      if (confirm(`You must have at least ${minTiersRequired} membership tier(s). Replace this tier with a new one?`)) {
        // Open modal to create a replacement tier
        setCurrentTier({
          id: '',
          name: '',
          price: '',
          description: '',
        });
        setIsEditing(false);
        setShowModal(true);
        // Delete will happen after a new tier is added
      }
    } else if (confirm(`Are you sure you want to delete the "${tier.name}" tier?`)) {
      onTierDeleted(tier.id);
    }
  };

  // Get a tier icon and color based on index or default
  const getTierStyle = (index: number) => {
    return index < tierIcons.length ? tierIcons[index] : tierIcons[0];
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-[#800020]" style={{ fontFamily: 'HV Florentino' }}>
        Membership Tiers
      </h2>

      <p className="mb-6 text-gray-700" style={{ fontFamily: 'Libre Baskerville' }}>
        Define 1-3 membership tiers that your guests can subscribe to.
        Each tier should have a unique name, price, and description of benefits.
      </p>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-xl border border-red-200 mb-6">
          {error}
        </div>
      )}

      {/* List of tiers - Bento Box style */}
      {tiers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier, index) => {
            const tierStyle = getTierStyle(index);
            
            return (
              <div
                key={tier.id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
                style={{ minHeight: '220px' }}
              >
                {/* Header with icon */}
                <div 
                  className="p-4 text-white flex justify-between items-center"
                  style={{ backgroundColor: tierStyle.color }}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                      {tierStyle.icon}
                    </div>
                    <h3 className="font-bold text-xl" style={{ fontFamily: 'HV Florentino' }}>{tier.name}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(tier)}
                      className="p-1.5 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-200"
                      aria-label={`Edit ${tier.name}`}
                    >
                      <Edit className="w-4 h-4 text-white" />
                    </button>
                    <button
                      type="button"
                      onClick={() => confirmDelete(tier)}
                      className="p-1.5 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-200"
                      aria-label={`Delete ${tier.name}`}
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
                
                {/* Price tag */}
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'TayBasal' }}>
                      ${parseFloat(tier.price).toFixed(2)}
                    </span>
                    <span className="text-gray-500 ml-1" style={{ fontFamily: 'TayBasal' }}>/month</span>
                  </div>
                </div>
                
                {/* Description */}
                <div className="p-4">
                  <p className="text-gray-700 text-sm" style={{ fontFamily: 'Libre Baskerville' }}>
                    {tier.description || "No description provided."}
                  </p>
                </div>
              </div>
            );
          })}
          
          {/* Add new tier card */}
          {tiers.length < 3 && (
            <div 
              onClick={openAddModal}
              className="bg-white rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 cursor-pointer hover:border-[#800020] hover:bg-gray-50 transition-all duration-300"
              style={{ minHeight: '220px' }}
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium text-center" style={{ fontFamily: 'TayBasal' }}>Add Another Tier</p>
              <p className="text-xs text-gray-400 text-center mt-1" style={{ fontFamily: 'Libre Baskerville' }}>
                {tiers.length === 0 ? 'Add your first membership tier' : 'You can add up to 3 tiers'}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div 
          onClick={openAddModal}
          className="bg-white rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-12 cursor-pointer hover:border-[#800020] hover:bg-gray-50 transition-all duration-300"
        >
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
            <Plus className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2" style={{ fontFamily: 'HV Florentino' }}>Create Your First Tier</h3>
          <p className="text-gray-500 text-center max-w-md" style={{ fontFamily: 'Libre Baskerville' }}>
            Define at least one membership tier with a name, price, and description
          </p>
        </div>
      )}

      {/* Modal */}
      <MembershipTierModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        initialData={currentTier}
        isEditing={isEditing}
        restaurantId={restaurantId}
      />
    </div>
  );
};

export default MembershipTierList;