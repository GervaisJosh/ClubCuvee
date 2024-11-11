import React, { useState, useEffect } from 'react';
import { Wine, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';

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
        } else {
          setWines([]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching wines:', err);
        setError('Failed to load wines');
        setLoading(false);
      }
    };

    fetchWines();
  }, []);

  const filteredWines = wines.filter(wine => 
    Object.values(wine).some(value => 
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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

    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="px-2 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
        >
          1
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
        >
          <ChevronLeft size={20} />
        </button>
        {startPage > 1 && <span className="text-gray-500">...</span>}
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`px-3 py-1 rounded ${
              number === currentPage ? 'bg-green-500 text-white' : 'bg-gray-700 text-white'
            }`}
          >
            {number}
          </button>
        ))}
        {endPage < totalPages && <span className="text-gray-500">...</span>}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
        >
          <ChevronRight size={20} />
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
        >
          {totalPages}
        </button>
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 bg-black">
      <h1 className="text-3xl font-semibold mb-6 text-white">Wine Inventory Management</h1>
      <div className="mb-6 flex justify-center">
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search wines..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>
      {filteredWines.length === 0 ? (
        <div className="text-center py-4 text-white">
          <p>Sorry, no results match your search.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentWines.map((wine) => (
              <div
                key={wine.barcode}
                className="bg-gray-900 p-4 rounded-lg shadow-lg hover:shadow-xl transition-transform duration-200 transform hover:scale-105 border border-white"
              >
                {/* Only the wine name in the heading */}
                <div className="flex items-center justify-between">
                  <div className="text-md font-semibold text-white">{wine.item.split(' ').slice(0, 3).join(' ')}</div>
                  <Wine className="text-green-500" size={32} />
                </div>
                <div className="mt-2">
                  {wine.vendor && <p className="text-sm text-gray-400">Vendor: {wine.vendor}</p>}
                  {wine.onsite_qty && <p className="text-sm text-gray-400">OnSite Qty: {wine.onsite_qty}</p>}
                  {wine.cost && <p className="text-sm text-gray-400">Cost: ${wine.cost.toFixed(2)}</p>}
                  {wine.bin1 && <p className="text-sm text-gray-400">Bin1: {wine.bin1}</p>}
                  {wine.bin2 && <p className="text-sm text-gray-400">Bin2: {wine.bin2}</p>}
                  {wine.bin3 && <p className="text-sm text-gray-400">Bin3: {wine.bin3}</p>}
                  {wine.country && <p className="text-sm text-gray-400">Country: {wine.country}</p>}
                  {wine.appellation && <p className="text-sm text-gray-400">Appellation: {wine.appellation}</p>}
                  {wine.category && <p className="text-sm text-gray-400">Category: {wine.category}</p>}
                  {wine.varietal && <p className="text-sm text-gray-400">Varietal: {wine.varietal}</p>}
                  {wine.format && <p className="text-sm text-gray-400">Format: {wine.format}</p>}
                  {wine.vintage && <p className="text-sm text-gray-400">Vintage: {wine.vintage}</p>}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end items-center">
            {renderPagination()}
          </div>
        </>
      )}
    </div>
  );
};

export default Wines;
