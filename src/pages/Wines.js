import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Wine, X, ChevronLeft, ChevronRight } from 'lucide-react';
const Wines = () => {
    const [wines, setWines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 20;
    useEffect(() => {
        const fetchWines = async () => {
            try {
                const savedData = localStorage.getItem('uploadedData');
                if (savedData) {
                    setWines(JSON.parse(savedData));
                }
                else {
                    setWines([]);
                }
                setLoading(false);
            }
            catch (err) {
                console.error('Error fetching wines:', err);
                setError('Failed to load wines');
                setLoading(false);
            }
        };
        fetchWines();
    }, []);
    const filteredWines = wines.filter(wine => Object.values(wine).some(value => value.toString().toLowerCase().includes(searchTerm.toLowerCase())));
    const totalPages = Math.ceil(filteredWines.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentWines = filteredWines.slice(startIndex, endIndex);
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };
    const clearSearch = () => {
        setSearchTerm('');
        setCurrentPage(1);
    };
    const renderPagination = () => {
        const pageNumbers = [];
        const maxPagesToShow = 3;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }
        return (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { onClick: () => handlePageChange(1), disabled: currentPage === 1, className: "px-2 py-1 rounded bg-gray-700 text-white disabled:opacity-50", children: "1" }), _jsx("button", { onClick: () => handlePageChange(currentPage - 1), disabled: currentPage === 1, className: "px-2 py-1 rounded bg-gray-700 text-white disabled:opacity-50", children: _jsx(ChevronLeft, { size: 20 }) }), startPage > 1 && _jsx("span", { className: "text-gray-500", children: "..." }), pageNumbers.map((number) => (_jsx("button", { onClick: () => handlePageChange(number), className: `px-3 py-1 rounded ${number === currentPage ? 'bg-green-500 text-white' : 'bg-gray-700 text-white'}`, children: number }, number))), endPage < totalPages && _jsx("span", { className: "text-gray-500", children: "..." }), _jsx("button", { onClick: () => handlePageChange(currentPage + 1), disabled: currentPage === totalPages, className: "px-2 py-1 rounded bg-gray-700 text-white disabled:opacity-50", children: _jsx(ChevronRight, { size: 20 }) }), _jsx("button", { onClick: () => handlePageChange(totalPages), disabled: currentPage === totalPages, className: "px-2 py-1 rounded bg-gray-700 text-white disabled:opacity-50", children: totalPages })] }));
    };
    if (loading)
        return _jsx("div", { children: "Loading..." });
    if (error)
        return _jsxs("div", { children: ["Error: ", error] });
    return (_jsxs("div", { className: "p-6 bg-black", children: [_jsx("h1", { className: "text-3xl font-semibold mb-6 text-white", children: "Wine Inventory Management" }), _jsx("div", { className: "mb-6 flex justify-center", children: _jsxs("div", { className: "relative w-1/2", children: [_jsx("input", { type: "text", placeholder: "Search wines...", value: searchTerm, onChange: handleSearch, className: "w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white" }), searchTerm && (_jsx("button", { onClick: clearSearch, className: "absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300", children: _jsx(X, { size: 20 }) }))] }) }), filteredWines.length === 0 ? (_jsx("div", { className: "text-center py-4 text-white", children: _jsx("p", { children: "Sorry, no results match your search." }) })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: currentWines.map((wine) => (_jsxs("div", { className: "bg-gray-900 p-4 rounded-lg shadow-lg hover:shadow-xl transition-transform duration-200 transform hover:scale-105 border border-white", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "text-md font-semibold text-white", children: wine.item.split(' ').slice(0, 3).join(' ') }), _jsx(Wine, { className: "text-green-500", size: 32 })] }), _jsxs("div", { className: "mt-2", children: [wine.vendor && _jsxs("p", { className: "text-sm text-gray-400", children: ["Vendor: ", wine.vendor] }), wine.onsite_qty && _jsxs("p", { className: "text-sm text-gray-400", children: ["OnSite Qty: ", wine.onsite_qty] }), wine.cost && _jsxs("p", { className: "text-sm text-gray-400", children: ["Cost: $", wine.cost.toFixed(2)] }), wine.bin1 && _jsxs("p", { className: "text-sm text-gray-400", children: ["Bin1: ", wine.bin1] }), wine.bin2 && _jsxs("p", { className: "text-sm text-gray-400", children: ["Bin2: ", wine.bin2] }), wine.bin3 && _jsxs("p", { className: "text-sm text-gray-400", children: ["Bin3: ", wine.bin3] }), wine.country && _jsxs("p", { className: "text-sm text-gray-400", children: ["Country: ", wine.country] }), wine.appellation && _jsxs("p", { className: "text-sm text-gray-400", children: ["Appellation: ", wine.appellation] }), wine.category && _jsxs("p", { className: "text-sm text-gray-400", children: ["Category: ", wine.category] }), wine.varietal && _jsxs("p", { className: "text-sm text-gray-400", children: ["Varietal: ", wine.varietal] }), wine.format && _jsxs("p", { className: "text-sm text-gray-400", children: ["Format: ", wine.format] }), wine.vintage && _jsxs("p", { className: "text-sm text-gray-400", children: ["Vintage: ", wine.vintage] })] })] }, wine.barcode))) }), _jsx("div", { className: "mt-4 flex justify-end items-center", children: renderPagination() })] }))] }));
};
export default Wines;
