import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Footer from '../components/Footer';
import Header from '../components/Header';
import emailjs from '@emailjs/browser';

interface FormData {
  restaurantName: string;
  name: string;
  email: string;
  message: string;
}

const GetStarted: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Form data state
  const [formData, setFormData] = useState<FormData>({
    restaurantName: '',
    name: '',
    email: '',
    message: ''
  });

  // Error state for validation
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Tracks if submission was successful
  const [submitted, setSubmitted] = useState(false);

  // EmailJS credentials (replace with your own)
  const serviceID = 'service_ClubCuvee';
  const templateID = 'template_5bsmunr';
  const publicKey = 'P83AFq75aatLIuGHP';

  // Validate form inputs
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.restaurantName.trim()) {
      newErrors.restaurantName = 'Business name is required';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Your name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Send the email via EmailJS
    emailjs
      .send(
        serviceID,
        templateID,
        {
          restaurantName: formData.restaurantName,
          name: formData.name,
          email: formData.email,
          message: formData.message
        },
        publicKey
      )
      .then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text);
          setSubmitted(true);
        },
        (error) => {
          console.error('FAILED...', error);
          // Optionally handle the error (e.g., show an error message)
        }
      );
  };

  // Update form state and clear errors as user types
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'} transition-colors duration-200`}
    >
      <Header />

      <div className="pt-16 flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
        {/* Hero Section with GIF */}
        <div className="w-full lg:w-3/5 p-5 lg:p-8">
          <div className="relative w-full h-[600px] lg:h-[calc(100vh-8rem)] rounded-xl shadow-xl overflow-hidden">
            <img
              src="https://github.com/GervaisJosh/ClubCuvee/raw/f25924c7818b87901f28cbea878411ead30250a0/public/images/IMG_8712.gif?raw=true"
              alt="Wine Service Animation"
              className="w-full h-full object-cover object-top"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>

            {/* Text Overlay */}
            <div className="absolute inset-0 flex flex-col justify-center px-8 lg:px-12">
              <h1
                className="text-4xl lg:text-5xl font-bold text-white mb-6"
                style={{ fontFamily: 'HV Florentino' }}
              >
                Try Club Cuvee Today
              </h1>
              <div className="max-w-2xl">
                <p
                  className="text-lg lg:text-xl text-white/90 leading-relaxed"
                  style={{ fontFamily: 'HV Florentino' }}
                >
                  Transform your wine program with our innovative platform. Leverage your existing
                  inventory, and pair your loyal customers with their perfect bottles.
                </p>
                <p
                  className="text-lg lg:text-xl text-white/90 leading-relaxed mt-4"
                  style={{ fontFamily: 'HV Florentino' }}
                >
                  They get a personalized, sommelier-level experience at their fingertips; your
                  business gains additional revenue with our AI-enhanced tools for your specific
                  needs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-2/5 flex items-center justify-center p-6 lg:p-12">
          <div
            className={`w-full max-w-xl rounded-2xl p-8 ${
              isDark ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-900'
            } shadow-2xl transition-all duration-300 glow-burgundy-subtle`}
          >
            {submitted ? (
              // If the form is successfully submitted, show a confirmation message
              <div className="text-center">
                <h2
                  className={`text-2xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
                  style={{ fontFamily: 'HV Florentino' }}
                >
                  Thank You!
                </h2>
                <p
                  className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}
                  style={{ fontFamily: 'TayBasal' }}
                >
                  Your inquiry has been received. We will reach out to you shortly. Cheers!
                </p>
              </div>
            ) : (
              // Otherwise, display the form
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center">
                  <h2
                    className={`text-2xl font-semibold mb-2 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                    style={{ fontFamily: 'HV Florentino' }}
                  >
                    Curious?
                  </h2>
                  <p
                    className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}
                    style={{ fontFamily: 'TayBasal' }}
                  >
                    Reach out and see how the future of hospitality begins with your business
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Business Name Field */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                      style={{ fontFamily: 'TayBasal' }}
                    >
                      Business Name
                    </label>
                    <input
                      type="text"
                      name="restaurantName"
                      value={formData.restaurantName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg ${
                        isDark
                          ? 'bg-gray-700 border border-gray-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-900'
                      } focus:ring-2 focus:ring-[#800020] focus:border-transparent transition-all`}
                    />
                    {errors.restaurantName && (
                      <p className="mt-1 text-sm text-red-500 text-left">
                        {errors.restaurantName}
                      </p>
                    )}
                  </div>

                  {/* Your Name Field */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                      style={{ fontFamily: 'TayBasal' }}
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg ${
                        isDark
                          ? 'bg-gray-700 border border-gray-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-900'
                      } focus:ring-2 focus:ring-[#800020] focus:border-transparent transition-all`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500 text-left">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                      style={{ fontFamily: 'TayBasal' }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg ${
                        isDark
                          ? 'bg-gray-700 border border-gray-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-900'
                      } focus:ring-2 focus:ring-[#800020] focus:border-transparent transition-all`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500 text-left">{errors.email}</p>
                    )}
                  </div>

                  {/* Message Field with Character Counter */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                      style={{ fontFamily: 'TayBasal' }}
                    >
                      Message (Optional)
                    </label>
                    <div className="relative">
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        maxLength={500}
                        rows={3}
                        className={`w-full px-4 py-3 pr-16 rounded-lg ${
                          isDark
                            ? 'bg-gray-700 border border-gray-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-900'
                        } focus:ring-2 focus:ring-[#800020] focus:border-transparent transition-all`}
                      />
                      <span
                        className={`absolute bottom-3 right-3 text-xs ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}
                        style={{ fontFamily: 'TayBasal' }}
                      >
                        {formData.message.length}/500
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    style={{ fontFamily: 'TayBasal' }}
                    className="w-full py-3.5 bg-[#800020] text-white rounded-lg hover:bg-[#600018] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#800020] focus:ring-offset-2 glow-burgundy-strong"
                  >
                    Submit
                  </button>
                </div>

                <p className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  By continuing, you agree to our{' '}
                  <a
                    href="/terms"
                    className={`${
                      isDark
                        ? 'text-[#800020] hover:text-[#600018]'
                        : 'text-[#800020] hover:text-[#600018]'
                    } underline`}
                  >
                    Terms of Service
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default GetStarted;