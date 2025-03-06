import React, { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const burgundy = "#800020";
  
  // Define the correct type for the IntersectionObserver ref
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Create the IntersectionObserver instance
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-20');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Select all elements with the reveal-section class and observe them
    const sections = document.querySelectorAll('.reveal-section');
    sections.forEach((section) => {
      if (observerRef.current) {
        observerRef.current.observe(section);
      }
    });

    // Cleanup function to disconnect the observer when component unmounts
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
      <Header />

      {/* Hero Section with Improved Aesthetics */}
      <div className="pt-40 pb-24 max-w-[1920px] mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 lg:pl-8 order-2 lg:order-1">
            <h1
              className={`text-4xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}
              style={{ fontFamily: 'HV Florentino' }}
            >
              Crafted By <span style={{ color: burgundy, fontWeight: 'normal' }}>Industry Experts</span>, For Your Business
            </h1>
            <p
              className={`text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
              style={{ fontFamily: 'Libre Baskerville', maxWidth: '90%' }}
            >
              Club Cuvée bridges the gap between elegant tradition and powerful technology, creating new revenue streams for wine-focused businesses.
            </p>
          </div>
          
          <div className="lg:w-1/2 flex items-center justify-center order-1 lg:order-2">
            <div className="rounded-2xl overflow-hidden shadow-2xl w-4/5">
              <img
                src="/images/Austin-sky-lake.jpg"
                alt="Austin Skyline"
                className="w-full h-auto object-cover min-h-[500px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Divider */}
      <div className="w-full max-w-[1920px] mx-auto px-8">
        <hr className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`} />
      </div>

      {/* Content Sections with Alternating Layout and Scroll Animations */}
      <div className="max-w-[1920px] mx-auto px-4 py-20">
        {/* Our Story Section */}
        <div className="mb-32 flex flex-col lg:flex-row items-center gap-16 reveal-section opacity-0 translate-y-20 transition-all duration-1000 ease-out">
          <div className="lg:w-1/2 flex flex-col items-center lg:items-start">
            <h2 
              className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}
              style={{ fontFamily: 'HV Florentino' }}
            >
              Our Story
            </h2>
            <div className="rounded-2xl overflow-hidden shadow-lg w-full">
              <img
                src="/images/jeffreys-napo.jpg"
                alt="Wine Dining Experience"
                className="w-full h-auto object-cover"
                style={{ height: '350px', objectFit: 'cover' }}
              />
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="p-8 rounded-xl shadow-lg bg-opacity-80 backdrop-blur-sm" style={{ backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)' }}>
              <p 
                className={`text-xl leading-relaxed ${isDark ? 'text-white' : 'text-gray-700'}`}
                style={{ fontFamily: 'Libre Baskerville' }}
              >
                At Club Cuvee, we believe that every great wine experience starts with passion and a community of enthusiasts. Founded by Joshua Gervais—an Austin native with a deep background in hospitality and the wine scene—we set out on a journey to revolutionize how restaurants and wine businesses connect with their customers. We blend traditional values with innovative technology, creating a platform that is as sophisticated as it is accessible.
              </p>
            </div>
          </div>
        </div>

        {/* Our Mission Section - Reversed Layout */}
        <div className="mb-32 flex flex-col lg:flex-row-reverse items-center gap-16 reveal-section opacity-0 translate-y-20 transition-all duration-1000 ease-out">
          <div className="lg:w-1/2 flex flex-col items-center lg:items-end">
            <h2 
              className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}
              style={{ fontFamily: 'HV Florentino' }}
            >
              Our Mission
            </h2>
            <div className="rounded-2xl overflow-hidden shadow-lg w-full">
              <img
                src="/images/wine-shop.jpg"
                alt="Wine Shop"
                className="w-full h-auto object-cover"
                style={{ height: '350px', objectFit: 'cover' }}
              />
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="p-8 rounded-xl shadow-lg bg-opacity-80 backdrop-blur-sm" style={{ backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)' }}>
              <p 
                className={`text-xl leading-relaxed ${isDark ? 'text-white' : 'text-gray-700'}`}
                style={{ fontFamily: 'Libre Baskerville' }}
              >
                Our mission is clear: to empower local wine establishments to unlock new revenue streams, support their staff, and give back to the communities they serve. We are committed to pioneering smart solutions that bridge the gap between artful wine curation and modern digital convenience. By partnering with local businesses, we aim to create a vibrant ecosystem where every sip contributes to a greater story of community and growth.
              </p>
            </div>
          </div>
        </div>

        {/* Our Vision Section */}
        <div className="mb-32 flex flex-col lg:flex-row items-center gap-16 reveal-section opacity-0 translate-y-20 transition-all duration-1000 ease-out">
          <div className="lg:w-1/2 flex flex-col items-center lg:items-start">
            <h2 
              className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}
              style={{ fontFamily: 'HV Florentino' }}
            >
              Our Vision for the Future
            </h2>
            <div className="rounded-2xl overflow-hidden shadow-lg w-full">
              <img
                src="/images/vineyard-chateaux.jpg"
                alt="Vineyard Chateaux"
                className="w-full h-auto object-cover"
                style={{ height: '350px', objectFit: 'cover' }}
              />
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="p-8 rounded-xl shadow-lg bg-opacity-80 backdrop-blur-sm" style={{ backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)' }}>
              <p 
                className={`text-xl leading-relaxed ${isDark ? 'text-white' : 'text-gray-700'}`}
                style={{ fontFamily: 'Libre Baskerville' }}
              >
                At Club Cuvee, we are constantly exploring creative ways to enhance the wine experience. We imagine a future where technology and tradition meet seamlessly, ensuring that every glass of wine not only delights the palate but also sustains the livelihoods of those behind the scenes. Join us as we toast to innovation, community, and the timeless joy of discovering new flavors.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-12 reveal-section opacity-0 translate-y-20 transition-all duration-1000 ease-out">
          <button
            onClick={() => window.location.href = '/get-started'}
            className="text-white px-8 py-4 rounded-md text-lg transition-all duration-200 hover:opacity-80 hover:scale-105 flex items-center mx-auto"
            style={{ backgroundColor: burgundy, fontFamily: 'TayBasal' }}
          >
            Join Our Community
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;