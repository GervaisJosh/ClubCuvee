import React from 'react';

const DefaultText = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <p className="text-2xl font-semibold text-gray-400 mb-4">Your information will appear after completing the Curation Survey</p>
      <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
        Take Curation Survey
      </button>
    </div>
  );
};

export default DefaultText;