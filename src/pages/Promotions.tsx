import React, { useState } from 'react';
import { Gift, Calendar, Users, Plus, Edit, Trash } from 'lucide-react';
import BentoBox from '../components/BentoBox';

const Promotions = () => {
  const [promotions, setPromotions] = useState([
    { id: 1, name: 'Summer Wine Festival', discount: '20% off', startDate: '2023-07-01', endDate: '2023-07-31', targetGroup: 'All Customers' },
    { id: 2, name: 'Luxury Wine Collection', discount: '15% off', startDate: '2023-08-15', endDate: '2023-09-15', targetGroup: 'Premium Members' },
    { id: 3, name: 'New Customer Welcome', discount: '10% off first order', startDate: '2023-06-01', endDate: '2023-12-31', targetGroup: 'New Customers' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState(null);

  const handleAddPromotion = () => {
    setCurrentPromotion(null);
    setShowModal(true);
  };

  const handleEditPromotion = (promotion) => {
    setCurrentPromotion(promotion);
    setShowModal(true);
  };

  const handleDeletePromotion = (id) => {
    setPromotions(promotions.filter(promo => promo.id !== id));
  };

  const handleSavePromotion = (promotion) => {
    if (currentPromotion) {
      setPromotions(promotions.map(p => p.id === promotion.id ? promotion : p));
    } else {
      setPromotions([...promotions, { ...promotion, id: Date.now() }]);
    }
    setShowModal(false);
  };

  return (
    <div className="p-6 bg-black text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Promotions</h1>
        <button
          onClick={handleAddPromotion}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Add Promotion
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo) => (
          <BentoBox
            key={promo.id}
            title={promo.name}
            icon={Gift}
            color="bg-green-500"
            size="col-span-1"
            path={`/promotions/${promo.id}`}
          >
            <p className="text-2xl font-bold text-green-500 mb-4">{promo.discount}</p>
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 mr-2 text-gray-400" />
              <span>{promo.startDate} to {promo.endDate}</span>
            </div>
            <div className="flex items-center mb-4">
              <Users className="h-5 w-5 mr-2 text-gray-400" />
              <span>{promo.targetGroup}</span>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEditPromotion(promo)}
                className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors duration-200"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleDeletePromotion(promo.id)}
                className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors duration-200"
              >
                <Trash size={18} />
              </button>
            </div>
          </BentoBox>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">{currentPromotion ? 'Edit Promotion' : 'Add Promotion'}</h2>
            {/* Add form fields for promotion details */}
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSavePromotion(/* form data */)}
              className="mt-4 ml-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promotions;