import React, { useState } from 'react';
import { Wine } from 'lucide-react';

const questions = [
  {
    id: 'adventurous',
    question: 'How adventurous are you when you look for wine?',
    subtext: 'Your response will determine how much variation we will include in your profile.',
    min: 'Cautious',
    max: 'Adventurous',
    icon: (
      <svg className="w-24 h-24 mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3L4 10V21H20V10L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 21V14H16V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'journey',
    question: 'Where are you on your wine journey?',
    subtext: 'Tell us how much you know about your wine preferences.',
    min: 'Beginning',
    max: 'Expert',
    icon: <Wine className="w-24 h-24 mb-4" />,
  },
];

const TasteCurationSurvey = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleSliderChange = (event) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: parseInt(event.target.value),
    });
  };

  const handleContinue = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(answers);
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-center mb-2">{currentQ.question}</h2>
        <p className="text-gray-400 text-center mb-8">{currentQ.subtext}</p>
        <div className="flex justify-center mb-8">
          {currentQ.icon}
        </div>
        <div className="mb-8">
          <input
            type="range"
            min="0"
            max="100"
            value={answers[currentQ.id] || 50}
            onChange={handleSliderChange}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>{currentQ.min}</span>
            <span>{currentQ.max}</span>
          </div>
        </div>
        <div className="flex justify-between">
          {currentQuestion > 0 && (
            <button
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200"
            >
              Back
            </button>
          )}
          <button
            onClick={handleContinue}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200 ml-auto"
          >
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TasteCurationSurvey;