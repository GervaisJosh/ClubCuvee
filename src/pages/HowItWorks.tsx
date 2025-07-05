import React, { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HowItWorks = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const burgundy = "#800020";

  const timelineSteps = [
    {
      title: "Connect Your Inventory",
      description: "Connect your inventory to our dashboard",
      icon: "/icons/server-cloud.svg"
    },
    {
      title: "Create a Digital Cellar",
      description: "Our software digitizes your cellar",
      icon: "/icons/wine-analysis.svg"
    },
    {
      title: "Your Customers Sign-up",
      description: "Your customers sign up through your custom link",
      icon: "/icons/wine-bottle.svg"
    },
    {
      title: "Our AI Analyzes",
      description: "Our state-of-the-art algorithms analyze preferences, ratings, and reviews to find perfect bottles",
      icon: "/icons/nucleus.svg"
    },
    {
      title: "Meet Your AI Sommelier",
      description: "Customers chat with our Sommelier AI or let the software pick their monthly bottles",
      icon: "/icons/wine-shelf.svg"
    },
    {
      title: "Automate the Management",
      description: "Club Cuvée automatically depletes 'locked' bottles from your inventory, so all you do is pack and say cheers!",
      icon: "/icons/barcode.svg"
    }
  ];

  const features = [
    {
      icon: "/icons/ai-algorithm.svg",
      title: "Advanced Algorithms",
      description: "Our AI continuously learns and adapts to optimize wine recommendations based on customer preferences and behavior patterns."
    },
    {
      icon: "/icons/chatbot.svg",
      title: "Realtime Chatbot",
      description: "24/7 AI Sommelier assistance for your customers, providing expert recommendations and answering wine-related questions."
    },
    {
      icon: "/icons/download-icon.svg",
      title: "Inventory Connection",
      description: "Seamless integration with your existing inventory system, with real-time updates and automated stock management."
    },
    {
      icon: "/icons/wine-tiers.svg",
      title: "Flexible Membership Tiers",
      description: "Create and customize subscription tiers to match your business model and customer segments."
    }
  ];

  // Intersection Observer for fade-in animation
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.fade-in-section').forEach((section) => {
      observerRef.current?.observe(section);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
      <Header />
      
      {/* Hero Section */}
      <div className="pt-40 pb-24">
        <div className="max-w-[1920px] mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 lg:pl-8">
              <h1
                className={`text-4xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}
                style={{ fontFamily: 'HV Florentino' }}
              >
                Make Your Wine <span style={{ color: burgundy, fontWeight: 'normal' }}>Clock In</span> to Your Business
              </h1>
              <p
                className={`text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                style={{ fontFamily: 'Libre Baskerville', maxWidth: '90%' }}
              >
                Transform your wine program with our innovative AI-powered platform. 
                Optimize inventory, personalize offerings, and increase sales 
                through sophisticated technology.
              </p>
              <button
                onClick={() => window.location.href = '/get-started'}
                className="text-white px-8 py-4 rounded-md text-lg transition-colors duration-200 hover:opacity-80 glow-burgundy-strong"
                style={{ backgroundColor: burgundy, fontFamily: 'TayBasal' }}
              >
                Get Started
              </button>
            </div>
            
            <div className="lg:w-1/2 flex items-center justify-center">
              <div className="rounded-2xl overflow-hidden shadow-2xl w-4/5">
                <img
                  src="/images/wine-cellar-how.jpg"
                  alt="AI Wine Analysis"
                  className="w-full h-auto object-cover min-h-[500px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Line */}
      <div className="w-full max-w-[1920px] mx-auto px-8">
        <hr className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`} />
      </div>

      {/* Timeline Section */}
      <div className={`py-20 ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-[1920px] mx-auto px-8">
          <h2
            className={`text-3xl md:text-4xl font-bold text-center mb-16 ${isDark ? 'text-white' : 'text-gray-900'}`}
            style={{ fontFamily: 'HV Florentino' }}
          >
            How It Works
          </h2>

          {/* Timeline with Static Line Connections */}
          <div className="relative max-w-3xl mx-auto">
            {timelineSteps.map((step, index) => (
              <div key={index} className="relative mb-24 last:mb-0">
                <div
                  className={`
                    fade-in-section 
                    opacity-0 translate-y-10 transition-all duration-700 
                    p-8 rounded-xl shadow-lg
                    transform hover:scale-105 transition-all duration-300 
                    ${isDark ? 'bg-black' : 'bg-white'} 
                    relative z-10 bg-opacity-80 backdrop-blur-sm
                    glow-burgundy-subtle cursor-pointer
                  `}
                >
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={step.icon}
                      alt={step.title}
                      className="w-16 h-16 mb-6"
                      style={{ filter: isDark ? 'invert(1)' : 'none' }}
                    />
                    <h3
                      className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
                      style={{ fontFamily: 'HV Florentino' }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                      style={{ fontFamily: 'Libre Baskerville' }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
                
                {/* Static Line Connection */}
                {index < timelineSteps.length - 1 && (
                  <div className="absolute left-1/2 -ml-px w-px h-24 bg-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Horizontal Line */}
      <div className="w-full max-w-[1920px] mx-auto px-8">
        <hr className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`} />
      </div>

      {/* Features Section */}
      <div className={`py-28 ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-[1920px] mx-auto px-8">
          <h2
            className={`text-3xl md:text-4xl font-bold text-center mb-16 ${isDark ? 'text-white' : 'text-gray-900'}`}
            style={{ fontFamily: 'HV Florentino' }}
          >
            Features Designed for Your Business & Your Customers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`
                  fade-in-section 
                  opacity-0 translate-y-10 transition-all duration-700 
                  p-8 rounded-xl shadow-lg 
                  hover:shadow-xl transform hover:scale-105 transition-all duration-300 
                  ${isDark ? 'bg-black' : 'bg-white'}
                  glow-burgundy-subtle cursor-pointer
                `}
              >
                <div className="flex flex-col items-center text-center">
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="w-16 h-16 mb-6"
                    style={{ filter: isDark ? 'invert(1)' : 'none' }}
                  />
                  <h3
                    className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
                    style={{ fontFamily: 'HV Florentino' }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                    style={{ fontFamily: 'Libre Baskerville' }}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={`py-20 ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2
            className={`text-3xl md:text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}
            style={{ fontFamily: 'HV Florentino' }}
          >
            Ready to Transform Your Wine Program?
          </h2>
          <p
            className={`text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
            style={{ fontFamily: 'Libre Baskerville' }}
          >
            Join forward-thinking businesses that are already using Club Cuvee to boost sales and enhance customer experiences.
          </p>
          <button
            onClick={() => window.location.href = '/get-started'}
            className="text-white px-8 py-4 rounded-md text-lg transition-all duration-200 hover:opacity-80 flex items-center mx-auto glow-burgundy-strong"
            style={{ backgroundColor: burgundy, fontFamily: 'TayBasal' }}
          >
            Get Started
            <img
              src="/icons/winery-icon.svg"
              alt="Winery"
              className="ml-3 h-8 w-8"
              style={{ filter: 'invert(1)' }}
            />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HowItWorks;