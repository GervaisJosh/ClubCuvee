import React, { useState, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { CheckCircle, Mail, User, Briefcase, Send } from 'lucide-react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import emailjs from '@emailjs/browser';

const GetStarted: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const formRef = useRef<HTMLFormElement>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    user_name: '',
    business_name: '',
    user_email: '',
    message: ''
  });
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Update form data on input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (error) setError(null);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.user_name || !formData.business_name || !formData.user_email) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Send email via EmailJS
      const result = await emailjs.sendForm(
        'service_lvxm3yd', // Replace with your EmailJS service ID
        'template_2qf5jws', // Replace with your EmailJS template ID
        formRef.current!,
        'tJ5Euu7UBYqeJ26yO' // Replace with your EmailJS public key
      );
      
      console.log('Email sent successfully:', result.text);
      setSubmitted(true);
    } catch (error: any) {
      console.error('Email send error:', error);
      setError(error.text || 'Failed to send your inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'} transition-colors duration-200`}
    >
      <Header />

      <div className="pt-16">
        {/* Hero Section */}
        <div className="relative h-[300px] bg-[#2A3D45]">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url('/images/wine-cellar-how.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(4px)'
            }}
          ></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <h1
              className="text-4xl lg:text-5xl font-bold text-white text-center"
              style={{ fontFamily: 'HV Florentino' }}
            >
              Start Your Wine Club Journey
            </h1>
            <p
              className="mt-4 text-xl text-white text-center max-w-2xl"
              style={{ fontFamily: 'Libre Baskerville' }}
            >
              Transform your wine program with our innovative platform. Get in touch and we'll help you get started.
            </p>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          {submitted ? (
            // Success message
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="mb-6 p-4 bg-green-100 rounded-full inline-flex items-center justify-center">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-[#872657]">Inquiry Received!</h2>
              <p className="text-lg mb-6">
                Thank you for your interest in Club Cuvée. We've received your message and will be in touch shortly.
              </p>
              <p className="text-gray-600">
                Our team will review your inquiry and contact you with more information about getting started with Club Cuvée.
              </p>
            </div>
          ) : (
            // Contact form
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-2 text-[#872657]">Get in Touch</h2>
              <p className="text-gray-600 mb-6">
                Interested in offering a personalized wine club to your customers? Fill out the form below and we'll be in touch.
              </p>
              
              {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}
              
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Name input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="user_name"
                      value={formData.user_name}
                      onChange={handleInputChange}
                      required
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#872657] focus:border-transparent"
                      placeholder="Jane Smith"
                    />
                  </div>
                </div>
                
                {/* Business name input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="business_name"
                      value={formData.business_name}
                      onChange={handleInputChange}
                      required
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#872657] focus:border-transparent"
                      placeholder="Your Restaurant or Wine Shop"
                    />
                  </div>
                </div>
                
                {/* Email input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="user_email"
                      value={formData.user_email}
                      onChange={handleInputChange}
                      required
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#872657] focus:border-transparent"
                      placeholder="jane@yourrestaurant.com"
                    />
                  </div>
                </div>
                
                {/* Message textarea */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#872657] focus:border-transparent"
                    placeholder="Tell us a bit about your business and what you're looking for..."
                  ></textarea>
                </div>
                
                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 bg-[#872657] text-white rounded-md hover:bg-opacity-90 font-bold flex items-center justify-center ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send Inquiry
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
          
          {/* Additional information */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-[#2A3D45]">Personalized Wine Programs</h3>
              <p className="text-gray-600">
                Create custom wine subscriptions that match your customers' preferences with your existing inventory.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-[#2A3D45]">Easy Management</h3>
              <p className="text-gray-600">
                Simple dashboard to manage subscriptions, view analytics, and track customer preferences.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-[#2A3D45]">Recurring Revenue</h3>
              <p className="text-gray-600">
                Build a stable income stream while deepening relationships with your best customers.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default GetStarted;