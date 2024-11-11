import React from 'react';
import { Link } from 'react-router-dom';
import { Wine, Database, TrendingUp, Users, Star, Heart, BarChart2, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Footer from '../components/Footer';
import ImageCarousel from '../components/ImageCarousel';

const Landing = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
      <header className={`fixed top-0 w-full z-50 ${isDark ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-sm border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-[1920px] mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <Wine className="h-8 w-8 text-green-500 mr-2" />
                <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Cuvee Club
                </span>
              </Link>
              
              <nav className="hidden md:flex items-center ml-10 space-x-8">
                <div className="relative group">
                  <button className={`flex items-center ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                    Product
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                </div>
                <Link to="/pricing" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  Pricing
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Sign in
              </Link>
              <Link 
                to="/signup"
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-32">
        {/* Hero Section */}
        <div className="max-w-[1920px] mx-auto px-4 flex flex-col lg:flex-row items-center lg:items-start mb-32">
          {/* Left Side - Text */}
          <div className="lg:w-1/2 flex flex-col items-center lg:justify-center text-center">
            <div className="max-w-2xl">
              <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Your Wine Inventory,
              </h1>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-green-500 mt-2">
                A Personal Wine Club for Your Customers
              </h1>
              
              <p className={`mt-8 text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Cuvee Club uses AI and advanced algorithms to digitize your wine inventory, allowing for data-driven experiences for your members based on their personal reviews, ratings, and wine history—not only increasing brand connection but also generating additional revenue through sales of existing inventory. 
              </p>

              <div className="mt-10">
                <Link 
                  to="/signup" 
                  className="bg-green-500 text-white px-8 py-4 rounded-md hover:bg-green-600 transition-colors duration-200 text-lg"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="lg:w-1/2 mt-16 lg:mt-0 lg:pl-16">
            <div className="relative h-[400px] lg:h-[600px] rounded-lg overflow-hidden">
              <img 
                src="https://github.com/GervaisJosh/Maestro/blob/9751d16460033163589a05be88418ebf8acc62c6/c5516fac-3c7d-4cf5-8b26-4e169a89a87c.jpg?raw=true"
                alt="Wine Collection"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black opacity-40"></div>
            </div>
          </div>
        </div>

        {/* Wine Inventory Section */}
        <div className="w-full py-32 border-t border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}">
          <div className="max-w-[1920px] mx-auto px-4">
            <h2 className={`text-4xl md:text-5xl font-bold text-center mb-16 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Your Wine Inventory, Digitized
            </h2>
            <ImageCarousel />
          </div>
        </div>

        {/* Features Section */}
        <div className="w-full py-32">
          <div className="max-w-[1920px] mx-auto px-4">
            <h2 className={`text-4xl md:text-5xl font-bold text-center mb-24 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Features
            </h2>
            <div className="space-y-32">
              {/* AI-Powered Wine Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden group">
                  <img 
                    src="https://github.com/GervaisJosh/Maestro/blob/3ef1db9dc6da84c2d0fa0892109ca6fedec52be4/e882a581-2f16-4f08-9f4d-777fc2276f2c.jpg?raw=true"
                    alt="AI-Powered Wine Analysis"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
                </div>
                <div className={`flex flex-col justify-center p-12 rounded-2xl border ${isDark ? 'bg-black text-white border-gray-700' : 'bg-white text-black border-gray-300'}`}>
                  <Database className={`h-12 w-12 mb-8 ${isDark ? 'text-white' : 'text-black'}`} />
                  <h3 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>AI-Powered Wine Analysis</h3>
                  <p className="text-xl leading-relaxed">
                    Transform your inventory into actionable insights with our advanced AI algorithms. Our system analyzes your wine collection, tracks consumption patterns, and provides detailed analytics to optimize your inventory management and enhance customer experiences.
                  </p>
                </div>
              </div>

              {/* Revenue Generation */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className={`flex flex-col justify-center p-12 rounded-2xl border ${isDark ? 'bg-black text-white border-gray-700' : 'bg-white text-black border-gray-300'}`}>
                  <TrendingUp className={`h-12 w-12 mb-8 ${isDark ? 'text-white' : 'text-black'}`} />
                  <h3 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Revenue Generation</h3>
                  <p className="text-xl leading-relaxed">
                    Drive additional sales through personalized recommendations and targeted promotions. Our platform identifies opportunities to maximize revenue by matching wines with customer preferences and optimizing pricing strategies based on market demand.
                  </p>
                </div>
                <div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden group">
                  <img 
                    src="https://github.com/GervaisJosh/Maestro/blob/3ef1db9dc6da84c2d0fa0892109ca6fedec52be4/80eafb90-950e-4f0e-8404-ee1096509a83.jpg?raw=true"
                    alt="Revenue Generation"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
                </div>
              </div>

              {/* Customer Engagement */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden group">
                  <img 
                    src="https://github.com/GervaisJosh/Maestro/blob/3ef1db9dc6da84c2d0fa0892109ca6fedec52be4/files_1189343-1731180230248-baa694cc-379a-47f2-a03c-27b181c48a45.jpg?raw=true"
                    alt="Customer Engagement"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
                </div>
                <div className={`flex flex-col justify-center p-12 rounded-2xl border ${isDark ? 'bg-black text-white border-gray-700' : 'bg-white text-black border-gray-300'}`}>
                  <Users className={`h-12 w-12 mb-8 ${isDark ? 'text-white' : 'text-black'}`} />
                  <h3 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Customer Engagement</h3>
                  <p className="text-xl leading-relaxed">
                    Build lasting relationships with personalized wine journeys and recommendations. Our platform creates unique experiences for each customer, tracking preferences and providing tailored suggestions that keep them coming back for more.
                  </p>
                </div>
              </div>

              {/* Rating System */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className={`flex flex-col justify-center p-12 rounded-2xl border ${isDark ? 'bg-black text-white border-gray-700' : 'bg-white text-black border-gray-300'}`}>
                  <Star className={`h-12 w-12 mb-8 ${isDark ? 'text-white' : 'text-black'}`} />
                  <h3 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Rating System</h3>
                  <p className="text-xl leading-relaxed">
                    Capture and analyze customer preferences with our detailed rating system. Enable your customers to rate and review wines, building a comprehensive database of preferences that helps you make informed inventory decisions.
                  </p>
                </div>
                <div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden group">
                  <img 
                    src="https://github.com/GervaisJosh/Maestro/blob/3ef1db9dc6da84c2d0fa0892109ca6fedec52be4/12de785a-1c95-4c6a-ae84-4215c7143b00.jpg?raw=true"
                    alt="Rating System"
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