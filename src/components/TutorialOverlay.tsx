import React, { useState } from 'react';
import { ChevronRight, X } from 'lucide-react';

const tutorialSteps = [
  {
    title: 'Welcome to Your Dashboard',
    content: 'This is where you\'ll find all your wine data and insights. Let\'s take a quick tour!',
    highlight: null,
  },
  {
    title: 'Your Wine Stats',
    content: 'These boxes show your key wine data: wines tasted, average ratings, upcoming deliveries, and events. As you taste more wines and receive invitations to tastings, your personal data will appear here.',
    highlight: 'top-row',
  },
  {
    title: 'Wine Insights',
    content: 'These graphs will sync with your visual data and provide a more in-depth look into your wine journey. You can access detailed pages for each insight from here.',
    highlight: 'graphs',
  },
  {
    title: 'Personalized Recommendations',
    content: 'As you taste more wines, our algorithm will better understand your preferences. Here, you\'ll find personalized recommendations, can sort by wine categories, and favorite wines for your next tasting box.',
    highlight: 'recommendations',
  },
];

const TutorialOverlay = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const getHighlightStyle = () => {
    switch (tutorialSteps[currentStep].highlight) {
      case 'top-row':
        return 'top-0 left-0 right-0 h-1/4';
      case 'graphs':
        return 'top-1/4 left-0 w-1/2 h-1/2';
      case 'recommendations':
        return 'bottom-0 left-0 right-0 h-1/4';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className={`absolute ${getHighlightStyle()} bg-white bg-opacity-20 transition-all duration-300 ease-in-out`}></div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">{tutorialSteps[currentStep].title}</h2>
        <p className="text-gray-300 mb-6">{tutorialSteps[currentStep].content}</p>
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-green-500' : 'bg-gray-500'
                }`}
              ></div>
            ))}
          </div>
          <button
            onClick={handleNext}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center"
          >
            {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
            <ChevronRight size={20} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay;