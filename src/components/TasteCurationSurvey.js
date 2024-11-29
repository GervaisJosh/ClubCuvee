import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Wine } from 'lucide-react';
const questions = [
    {
        id: 'adventurous',
        question: 'How adventurous are you when you look for wine?',
        subtext: 'Your response will determine how much variation we will include in your profile.',
        min: 'Cautious',
        max: 'Adventurous',
        icon: (_jsxs("svg", { className: "w-24 h-24 mb-4", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("path", { d: "M12 3L4 10V21H20V10L12 3Z", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M8 21V14H16V21", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })] })),
    },
    {
        id: 'journey',
        question: 'Where are you on your wine journey?',
        subtext: 'Tell us how much you know about your wine preferences.',
        min: 'Beginning',
        max: 'Expert',
        icon: _jsx(Wine, { className: "w-24 h-24 mb-4" }),
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
        }
        else {
            onComplete(answers);
        }
    };
    const currentQ = questions[currentQuestion];
    return (_jsx("div", { className: "fixed inset-0 bg-gray-900 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-gray-800 p-8 rounded-lg shadow-xl max-w-2xl w-full", children: [_jsx("h2", { className: "text-3xl font-bold text-center mb-2", children: currentQ.question }), _jsx("p", { className: "text-gray-400 text-center mb-8", children: currentQ.subtext }), _jsx("div", { className: "flex justify-center mb-8", children: currentQ.icon }), _jsxs("div", { className: "mb-8", children: [_jsx("input", { type: "range", min: "0", max: "100", value: answers[currentQ.id] || 50, onChange: handleSliderChange, className: "w-full" }), _jsxs("div", { className: "flex justify-between text-sm text-gray-400 mt-2", children: [_jsx("span", { children: currentQ.min }), _jsx("span", { children: currentQ.max })] })] }), _jsxs("div", { className: "flex justify-between", children: [currentQuestion > 0 && (_jsx("button", { onClick: () => setCurrentQuestion(currentQuestion - 1), className: "bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200", children: "Back" })), _jsx("button", { onClick: handleContinue, className: "bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200 ml-auto", children: currentQuestion === questions.length - 1 ? 'Finish' : 'Continue' })] })] }) }));
};
export default TasteCurationSurvey;
