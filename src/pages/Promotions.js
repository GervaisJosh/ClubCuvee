import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
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
        }
        else {
            setPromotions([...promotions, { ...promotion, id: Date.now() }]);
        }
        setShowModal(false);
    };
    return (_jsxs("div", { className: "p-6 bg-black text-white", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-3xl font-semibold", children: "Promotions" }), _jsxs("button", { onClick: handleAddPromotion, className: "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center", children: [_jsx(Plus, { size: 18, className: "mr-2" }), "Add Promotion"] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: promotions.map((promo) => (_jsxs(BentoBox, { title: promo.name, icon: Gift, color: "bg-green-500", size: "col-span-1", path: `/promotions/${promo.id}`, children: [_jsx("p", { className: "text-2xl font-bold text-green-500 mb-4", children: promo.discount }), _jsxs("div", { className: "flex items-center mb-2", children: [_jsx(Calendar, { className: "h-5 w-5 mr-2 text-gray-400" }), _jsxs("span", { children: [promo.startDate, " to ", promo.endDate] })] }), _jsxs("div", { className: "flex items-center mb-4", children: [_jsx(Users, { className: "h-5 w-5 mr-2 text-gray-400" }), _jsx("span", { children: promo.targetGroup })] }), _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx("button", { onClick: () => handleEditPromotion(promo), className: "p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors duration-200", children: _jsx(Edit, { size: 18 }) }), _jsx("button", { onClick: () => handleDeletePromotion(promo.id), className: "p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors duration-200", children: _jsx(Trash, { size: 18 }) })] })] }, promo.id))) }), showModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center", children: _jsxs("div", { className: "bg-gray-800 p-6 rounded-lg w-96", children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: currentPromotion ? 'Edit Promotion' : 'Add Promotion' }), _jsx("button", { onClick: () => setShowModal(false), className: "mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200", children: "Cancel" }), _jsx("button", { onClick: () => handleSavePromotion( /* form data */), className: "mt-4 ml-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200", children: "Save" })] }) }))] }));
};
export default Promotions;
