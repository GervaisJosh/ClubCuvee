import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4 text-[#872657]">
        Membership Tiers
      </h2>

      <p className="mb-6 text-gray-700">
        Define the membership tiers that your customers can subscribe to.
        Each tier should have a unique name, pricing, and description of benefits.
      </p>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
          {error}
        </div>
      )}

      {/* List of tiers */}
      {tiers.length > 0 ? (
        tiers.map((tier) => (
          <div
            key={tier.id}
            className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-lg text-[#872657]">
                {tier.name}
              </h3>
              <p className="text-sm text-gray-500">
                ${typeof tier.price === 'string' ? parseFloat(tier.price).toFixed(2) : tier.price.toFixed(2)}/month
              </p>
              <p className="text-sm mt-1">{tier.description}</p>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => openEditModal(tier)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                aria-label={`Edit ${tier.name}`}
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => confirmDelete(tier)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                aria-label={`Delete ${tier.name}`}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300 mb-6">
          <p className="text-gray-500 mb-2">No membership tiers added yet</p>
          <p className="text-sm text-gray-400">
            Click the button below to add your first tier
          </p>
        </div>
      )}

      {/* Add button */}
      <button
        type="button"
        onClick={openAddModal}
        className="flex items-center justify-center w-full py-3 border-2 border-dashed border-[#872657] text-[#872657] rounded-md hover:bg-[#872657]/5"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Membership Tier
      </button>

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
