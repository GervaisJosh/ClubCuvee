import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Send } from 'lucide-react';
const FeedbackSuggestions = () => {
    const [feedback, setFeedback] = useState({
        category: '',
        rating: '',
        comment: '',
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the feedback to your backend
        console.log('Feedback submitted:', feedback);
        // Reset the form
        setFeedback({ category: '', rating: '', comment: '' });
        // Show a success message (in a real app, you'd want to use a proper notification system)
        alert('Thank you for your feedback!');
    };
    return (_jsxs("div", { className: "p-6", children: [_jsx("h1", { className: "text-3xl font-semibold mb-6", children: "Feedback & Suggestions" }), _jsxs("form", { onSubmit: handleSubmit, className: "bg-gray-800 rounded-lg shadow-md p-6", children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium mb-2", htmlFor: "category", children: "Category" }), _jsxs("select", { id: "category", value: feedback.category, onChange: (e) => setFeedback({ ...feedback, category: e.target.value }), className: "w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500", required: true, children: [_jsx("option", { value: "", children: "Select a category" }), _jsx("option", { value: "wine", children: "Wine Selection" }), _jsx("option", { value: "delivery", children: "Delivery Experience" }), _jsx("option", { value: "customer_service", children: "Customer Service" }), _jsx("option", { value: "website", children: "Website/App" }), _jsx("option", { value: "events", children: "Wine Events" }), _jsx("option", { value: "other", children: "Other" })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium mb-2", htmlFor: "rating", children: "Rating" }), _jsxs("select", { id: "rating", value: feedback.rating, onChange: (e) => setFeedback({ ...feedback, rating: e.target.value }), className: "w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500", required: true, children: [_jsx("option", { value: "", children: "Select a rating" }), _jsx("option", { value: "5", children: "Excellent" }), _jsx("option", { value: "4", children: "Good" }), _jsx("option", { value: "3", children: "Average" }), _jsx("option", { value: "2", children: "Below Average" }), _jsx("option", { value: "1", children: "Poor" })] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm font-medium mb-2", htmlFor: "comment", children: "Your Feedback" }), _jsx("textarea", { id: "comment", value: feedback.comment, onChange: (e) => setFeedback({ ...feedback, comment: e.target.value }), className: "w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500", rows: 5, required: true, placeholder: "Please share your thoughts, suggestions, or experiences..." })] }), _jsxs("button", { type: "submit", className: "w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center", children: [_jsx(Send, { className: "h-5 w-5 mr-2" }), "Submit Feedback"] })] })] }));
};
export default FeedbackSuggestions;
