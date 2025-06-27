import React, { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const Features = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const burgundy = "#800020";

  const features = [
    {
      title: "AI-Powered Wine Analysis",
      description: "Transform your inventory into actionable insights with our advanced AI algorithms. Our system analyzes your wine collection, tracks consumption patterns, and provides detailed analytics to optimize your inventory management and enhance customer experiences.",
      icon: "/icons/wine-analysis.svg",
      image: "/images/wine-cellar-how.jpg"
    },
    {
      title: "Personalized Recommendations",
      description: "Our recommendation engine understands each customer's unique taste preferences, pairing history, and past reviews to suggest wines they'll truly enjoy, driving higher satisfaction and sales.",
      icon: "/icons/ai-algorithm.svg",
      image: "/images/champagne-orange.jpg"
    },
    {
      title: "AI Sommelier Chatbot",
      description: "24/7 AI Sommelier assistance for your customers, providing expert recommendations and answering wine-related questions using natural language that feels like talking to a knowledgeable friend.",
      icon: "/icons/chatbot.svg",
      image: "/images/Chatbot.jpg"
    },
    {
      title: "Inventory Management",
      description: "Seamless integration with your existing inventory system, with real-time updates and automated stock management that ensures your wine club members always get access to available bottles.",
      icon: "/icons/database-gear.svg",
      image: "/images/wine-shop.jpg"
    },
    {
      title: "Flexible Membership Tiers",
      description: "Create and customize subscription tiers to match your business model and customer segments. Offer different price points, delivery frequencies, and wine selections to maximize revenue.",
      icon: "/icons/wine-tiers.svg",
      image: "/images/wine-dining.jpg"
    },
    {
      title: "Analytics Dashboard",
      description: "Get complete visibility into your wine club's performance with detailed analytics on sales, customer engagement, inventory turnover, and member satisfaction to make data-driven decisions.",
      icon: "/icons/database-computer.svg",
      image: "/images/Math on chalk.jpg"
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
          <div className="text-center mb-16">
            <h1
              className={`text-4xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}
              style={{ fontFamily: 'HV Florentino' }}
            >
              Club Cuvée <span style={{ color: burgundy, fontWeight: 'normal' }}>Features</span>
            </h1>
            <p
              className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
              style={{ fontFamily: 'TayBasal', maxWidth: '90%' }}
            >
              Discover how our platform helps restaurants and wine shops create thriving wine clubs 
              with sophisticated technology and personalized experiences.
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="space-y-32">
            {features.map((feature, index) => (
              <div key={index} className="fade-in-section opacity-0 translate-y-10 transition-all duration-700">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden group">
                    <img 
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
                  </div>
                  <div className={`flex flex-col justify-center p-12 rounded-2xl border ${isDark ? 'bg-black text-white border-gray-700' : 'bg-white text-black border-gray-300'} glow-burgundy-subtle cursor-pointer`}>
                    <div className="flex items-center mb-6">
                      <img 
                        src={feature.icon} 
                        alt="" 
                        className="w-10 h-10 mr-4"
                        style={{ filter: isDark ? 'invert(1)' : 'none' }}
                      />
                      <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'HV Florentino' }}>{feature.title}</h3>
                    </div>
                    <p className="text-xl leading-relaxed" style={{ fontFamily: 'TayBasal' }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={`py-20 ${isDark ? 'bg-black' : 'bg-white'} border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2
            className={`text-3xl md:text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}
            style={{ fontFamily: 'HV Florentino' }}
          >
            Ready to Launch Your Wine Club?
          </h2>
          <p
            className={`text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
            style={{ fontFamily: 'TayBasal' }}
          >
            Join forward-thinking businesses that are already using Club Cuvee to boost sales and enhance customer experiences.
          </p>
          <Link
            to="/get-started"
            className="text-white px-8 py-4 rounded-md text-lg transition-all duration-200 hover:opacity-80 inline-block glow-burgundy-strong"
            style={{ backgroundColor: burgundy, fontFamily: 'TayBasal' }}
          >
            Get Started
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Features;