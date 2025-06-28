import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import Footer from '../components/Footer';
import ImageCarousel from '../components/ImageCarousel';
import Header from '../components/Header';

const Landing = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const burgundy = "#800020";

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
      <Header />

      <main className="pt-32">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center lg:items-start mb-16 md:mb-32">
          <div className="lg:w-1/2 flex flex-col items-center lg:justify-center text-center">
            <div className="max-w-2xl">
              <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'HV Florentino' }}>
                Your Wine Inventory,
              </h1>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mt-2" style={{ fontFamily: 'HV Florentino', color: burgundy }}>
                A Personal Wine Club for Your Customers
              </h1>
              
              <p className={`mt-6 md:mt-8 text-base sm:text-lg md:text-xl ${isDark ? 'text-gray-300' : 'text-black'}`} style={{ fontFamily: 'Libre Baskerville' }}>
                Club Cuvee uses AI and advanced algorithms to digitize your wine inventory, allowing for data-driven experiences for your members based on their personal reviews, ratings, and wine history—not only increasing brand connection but also generating additional revenue through sales of existing inventory. 
              </p>

              <div className="mt-8 md:mt-10">
                <Link 
                  to="/get-started"
                  className="w-full sm:w-auto text-white px-6 sm:px-8 py-3 sm:py-4 rounded-md transition-colors duration-200 text-lg inline-block hover:opacity-80 glow-burgundy-strong"
                  style={{ backgroundColor: burgundy, fontFamily: 'TayBasal' }}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 mt-12 lg:mt-0 lg:pl-16">
            <div className="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[600px] rounded-lg overflow-hidden">
              <img 
                src="https://github.com/GervaisJosh/Maestro/blob/9751d16460033163589a05be88418ebf8acc62c6/c5516fac-3c7d-4cf5-8b26-4e169a89a87c.jpg?raw=true"
                alt="Wine Collection"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black opacity-40"></div>
            </div>
          </div>
        </div>

        <div className={`w-full py-16 md:py-24 lg:py-32 border-t border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 md:mb-16 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'HV Florentino' }}>
              Your Wine Inventory, <span style={{ color: burgundy, fontFamily: 'HV Florentino' }}>Digitized</span>
            </h2>
            <ImageCarousel />
          </div>
        </div>

        <div className="w-full py-16 md:py-24 lg:py-32">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16 lg:mb-24 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'HV Florentino' }}>
              Features
            </h2>
            <div className="space-y-32">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden group">
                  <img 
                    src="https://github.com/GervaisJosh/Maestro/blob/3ef1db9dc6da84c2d0fa0892109ca6fedec52be4/e882a581-2f16-4f08-9f4d-777fc2276f2c.jpg?raw=true"
                    alt="AI-Powered Wine Analysis"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
                </div>
                <div className={`flex flex-col justify-center p-12 rounded-2xl border ${isDark ? 'bg-black text-white border-gray-700' : 'bg-white text-black border-gray-300'} glow-burgundy-subtle cursor-pointer`}>
                  <h3 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>AI-Powered Wine Analysis</h3>
                  <p className="text-xl leading-relaxed">
                    Transform your inventory into actionable insights with our advanced AI algorithms. Our system analyzes your wine collection, tracks consumption patterns, and provides detailed analytics to optimize your inventory management and enhance customer experiences.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className={`flex flex-col justify-center p-12 rounded-2xl border ${isDark ? 'bg-black text-white border-gray-700' : 'bg-white text-black border-gray-300'} glow-burgundy-subtle cursor-pointer`}>
                  <h3 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Revenue Generation</h3>
                  <p className="text-xl leading-relaxed">
                    Drive additional sales through personalized recommendations and targeted promotions. Our platform identifies opportunities to maximize revenue by matching wines with customer preferences and optimizing pricing strategies based on market demand.
                  </p>
                </div>
                <div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden group">
                  <img 
                    src="images/champagne-orange.jpg"
                    alt="Orange Wine Cellar"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden group">
                  <img 
                    src="https://github.com/GervaisJosh/ClubCuvee/blob/4b47dd5e3ddc2d6116419a9e31467db5c52b098e/ascii-art.png?raw=true"
                    alt="Customer Engagement"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
                </div>
                <div className={`flex flex-col justify-center p-12 rounded-2xl border ${isDark ? 'bg-black text-white border-gray-700' : 'bg-white text-black border-gray-300'} glow-burgundy-subtle cursor-pointer`}>
                  <h3 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Customer Engagement</h3>
                  <p className="text-xl leading-relaxed">
                    Build lasting relationships with personalized wine journeys and recommendations. Our platform creates unique experiences for each customer, tracking preferences and providing tailored suggestions that keep them coming back for more.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className={`flex flex-col justify-center p-12 rounded-2xl border ${isDark ? 'bg-black text-white border-gray-700' : 'bg-white text-black border-gray-300'} glow-burgundy-subtle cursor-pointer`}>
                  <h3 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Rating System</h3>
                  <p className="text-xl leading-relaxed">
                    Capture and analyze customer preferences with our detailed rating system. Enable your customers to rate and review wines, building a comprehensive database of preferences that helps you make informed inventory decisions.
                  </p>
                </div>
                <div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden group">
                  <img 
                    src="images/red-wine-glass.jpg"
                    alt="Red Wine in a glass"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;