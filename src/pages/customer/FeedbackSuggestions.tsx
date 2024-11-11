import React, { useState } from 'react';
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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Feedback & Suggestions</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            value={feedback.category}
            onChange={(e) => setFeedback({ ...feedback, category: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">Select a category</option>
            <option value="wine">Wine Selection</option>
            <option value="delivery">Delivery Experience</option>
            <option value="customer_service">Customer Service</option>
            <option value="website">Website/App</option>
            <option value="events">Wine Events</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="rating">
            Rating
          </label>
          <select
            id="rating"
            value={feedback.rating}
            onChange={(e) => setFeedback({ ...feedback, rating: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">Select a rating</option>
            <option value="5">Excellent</option>
            <option value="4">Good</option>
            <option value="3">Average</option>
            <option value="2">Below Average</option>
            <option value="1">Poor</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" htmlFor="comment">
            Your Feedback
          </label>
          <textarea
            id="comment"
            value={feedback.comment}
            onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={5}
            required
            placeholder="Please share your thoughts, suggestions, or experiences..."
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center"
        >
          <Send className="h-5 w-5 mr-2" />
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackSuggestions;