import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Define types for icon props
interface IconProps {
  className?: string;
}

interface ThemeAwareIconProps {
  src: string;
  alt: string;
  className?: string;
}

// Custom project icons with theme support
const ThemeAwareIcon: React.FC<ThemeAwareIconProps> = ({ src, alt, className }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      style={{ filter: isDark ? 'invert(1)' : 'none' }}
    />
  );
};

const WineShelfIcon: React.FC<IconProps> = ({ className }) => (
  <ThemeAwareIcon src="/icons/wine-shelf.svg" alt="Wine Shelf" className={className} />
);

const ChampagneIcon: React.FC<IconProps> = ({ className }) => (
  <ThemeAwareIcon src="/icons/champagne-cheers.svg" alt="Champagne Cheers" className={className} />
);

const MembersIcon: React.FC<IconProps> = ({ className }) => (
  <ThemeAwareIcon src="/icons/wine-members.svg" alt="Wine Members" className={className} />
);

const WineryIcon: React.FC<IconProps> = ({ className }) => (
  <ThemeAwareIcon src="/icons/winery-icon.svg" alt="Winery" className={className} />
);

const ProjectWineBottleIcon: React.FC<IconProps> = ({ className }) => (
  <ThemeAwareIcon src="/icons/wine-bottle.svg" alt="Wine Bottle" className={className} />
);

const Pricing: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const burgundy = "#800020";
  const charcoalGray = "#333333";

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
                <span style={{ color: burgundy, fontWeight: 'normal' }}>Scalable Pricing</span> to Boost Your Wine Program—<span style={{ color: burgundy, fontWeight: 'normal' }}>Not Your Overhead</span>
              </h1>
              <button
                onClick={() => window.location.href = '/get-started'}
                className="text-white px-8 py-4 rounded-md text-lg transition-colors duration-200 hover:opacity-80"
                style={{ backgroundColor: burgundy, fontFamily: 'TayBasal' }}
              >
                Get Started
              </button>
            </div>
            <div className="lg:w-1/2 flex items-center justify-center">
              <div className="rounded-2xl overflow-hidden shadow-2xl w-4/5">
                <img
                  src="/images/wine-dining.jpg"
                  alt="Pricing Hero"
                  className="w-full h-auto object-cover min-h-[500px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Divider */}
      <div className="w-full max-w-[1920px] mx-auto px-8">
        <hr className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`} />
      </div>

      {/* Pricing Content Section */}
      <div className="max-w-[1920px] mx-auto px-4 py-16">
        {/* Intro Section with Flexible Pricing Tiers heading */}
        <h2
          className={`text-4xl font-bold text-center mb-12`}
          style={{ fontFamily: 'HV Florentino', color: burgundy }}
        >
          Flexible Pricing Tiers
        </h2>
        
        <div className="flex flex-col mb-16">
          <div className="max-w-3xl mx-auto">
            <p
              className={`text-lg leading-relaxed text-center ${isDark ? 'text-white' : 'text-gray-700'}`}
              style={{ fontFamily: 'Libre Baskerville' }}
            >
              We offer 3 initial pricing tiers, but that's just our starting point. Because Club Cuvee's goal is to create new revenue 
              streams in an industry known for slim margins, we prefer a percentage-of-sales structure that grows only when you do—no heavy monthly overhead. 
              We'll meet you exactly where your business is at, and scale as you expand.
            </p>
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="w-full mb-16">
          <hr className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`} />
        </div>

        {/* Pricing Tiers */}
        <div className="mb-16">
          {/* Tier 1: Neighborhood Cellar */}
          <div className="mb-16">
            <h3
              className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'} flex items-center justify-center`}
              style={{ fontFamily: 'HV Florentino' }}
            >
              <WineShelfIcon className="w-10 h-10 mr-3" />
              <span style={{ color: burgundy }}>Neighborhood Cellar</span>
            </h3>
            <p
              className={`text-center max-w-2xl mx-auto mb-8 ${isDark ? 'text-white' : 'text-gray-600'}`}
              style={{ fontFamily: 'Libre Baskerville' }}
            >
              A great starting point for emerging clubs seeking essential tools and support.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Price Box */}
              <div
                className={`rounded-lg p-6 transition-transform duration-200 hover:scale-105 cursor-pointer ${isDark ? 'bg-gray-800' : 'bg-gray-100'} glow-burgundy-subtle`}
              >
                <div className="flex items-center mb-4">
                  <ChampagneIcon className="w-10 h-10 mr-3" />
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'HV Florentino' }}>
                    $300/month
                  </h3>
                </div>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-white' : 'text-gray-700'}`} style={{ fontFamily: 'Libre Baskerville' }}>
                  Base monthly subscription fee with all essential features included.
                </p>
              </div>
              {/* Members Box */}
              <div
                className={`rounded-lg p-6 transition-transform duration-200 hover:scale-105 cursor-pointer ${isDark ? 'bg-gray-800' : 'bg-gray-100'} glow-burgundy-subtle`}
              >
                <div className="flex items-center mb-4">
                  <MembersIcon className="w-10 h-10 mr-3" />
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'HV Florentino' }}>
                    ~50 wine club members
                  </h3>
                </div>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-white' : 'text-gray-700'}`} style={{ fontFamily: 'Libre Baskerville' }}>
                  Ideal for newer clubs building their membership base.
                </p>
              </div>
              {/* Sales Box */}
              <div
                className={`rounded-lg p-6 transition-transform duration-200 hover:scale-105 cursor-pointer ${isDark ? 'bg-gray-800' : 'bg-gray-100'} glow-burgundy-subtle`}
              >
                <div className="flex items-center mb-4">
                  <WineryIcon className="w-10 h-10 mr-3" />
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'HV Florentino' }}>
                    5% of sales
                  </h3>
                </div>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-white' : 'text-gray-700'}`} style={{ fontFamily: 'Libre Baskerville' }}>
                  Lower percentage to help your club grow and establish itself.
                </p>
              </div>
            </div>
          </div>

          {/* Tier 2: Sommelier's Select */}
          <div className="mb-16">
            <h3
              className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'} flex items-center justify-center`}
              style={{ fontFamily: 'HV Florentino' }}
            >
              <ProjectWineBottleIcon className="w-10 h-10 mr-3" />
              <span style={{ color: burgundy }}>Sommelier's Select</span>
            </h3>
            <p
              className={`text-center max-w-2xl mx-auto mb-8 ${isDark ? 'text-white' : 'text-gray-600'}`}
              style={{ fontFamily: 'Libre Baskerville' }}
            >
              Ideal for clubs ready to scale up with enhanced features and personalized analytics.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Price Box */}
              <div
                className={`rounded-lg p-6 transition-transform duration-200 hover:scale-105 cursor-pointer ${isDark ? 'bg-gray-800' : 'bg-gray-100'} glow-burgundy-subtle`}
              >
                <div className="flex items-center mb-4">
                  <ChampagneIcon className="w-10 h-10 mr-3" />
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'HV Florentino' }}>
                    $500/month
                  </h3>
                </div>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-white' : 'text-gray-700'}`} style={{ fontFamily: 'Libre Baskerville' }}>
                  Includes advanced features and priority support for growing clubs.
                </p>
              </div>
              {/* Members Box */}
              <div
                className={`rounded-lg p-6 transition-transform duration-200 hover:scale-105 cursor-pointer ${isDark ? 'bg-gray-800' : 'bg-gray-100'} glow-burgundy-subtle`}
              >
                <div className="flex items-center mb-4">
                  <MembersIcon className="w-10 h-10 mr-3" />
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'HV Florentino' }}>
                    ~100 wine club members
                  </h3>
                </div>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-white' : 'text-gray-700'}`} style={{ fontFamily: 'Libre Baskerville' }}>
                  Designed for established clubs with a solid membership base.
                </p>
              </div>
              {/* Sales Box */}
              <div
                className={`rounded-lg p-6 transition-transform duration-200 hover:scale-105 cursor-pointer ${isDark ? 'bg-gray-800' : 'bg-gray-100'} glow-burgundy-subtle`}
              >
                <div className="flex items-center mb-4">
                  <WineryIcon className="w-10 h-10 mr-3" />
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'HV Florentino' }}>
                    7% of sales
                  </h3>
                </div>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-white' : 'text-gray-700'}`} style={{ fontFamily: 'Libre Baskerville' }}>
                  Balanced pricing for clubs with consistent performance and growth.
                </p>
              </div>
            </div>
          </div>

          {/* Tier 3: World-Class Wine Club */}
          <div className="mb-16">
            <h3
              className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'} flex items-center justify-center`}
              style={{ fontFamily: 'HV Florentino' }}
            >
              <WineryIcon className="w-10 h-10 mr-3" />
              <span style={{ color: burgundy }}>World-Class Wine Club</span>
            </h3>
            <p
              className={`text-center max-w-2xl mx-auto mb-8 ${isDark ? 'text-white' : 'text-gray-600'}`}
              style={{ fontFamily: 'Libre Baskerville' }}
            >
              Tailored for established clubs that need world-class service and advanced integrations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Price Box */}
              <div
                className={`rounded-lg p-6 transition-transform duration-200 hover:scale-105 cursor-pointer ${isDark ? 'bg-gray-800' : 'bg-gray-100'} glow-burgundy-subtle`}
              >
                <div className="flex items-center mb-4">
                  <ChampagneIcon className="w-10 h-10 mr-3" />
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'HV Florentino' }}>
                    $750/month
                  </h3>
                </div>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-white' : 'text-gray-700'}`} style={{ fontFamily: 'Libre Baskerville' }}>
                  Premium plan with dedicated account management and custom features.
                </p>
              </div>
              {/* Members Box */}
              <div
                className={`rounded-lg p-6 transition-transform duration-200 hover:scale-105 cursor-pointer ${isDark ? 'bg-gray-800' : 'bg-gray-100'} glow-burgundy-subtle`}
              >
                <div className="flex items-center mb-4">
                  <MembersIcon className="w-10 h-10 mr-3" />
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'HV Florentino' }}>
                    200+ wine club members
                  </h3>
                </div>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-white' : 'text-gray-700'}`} style={{ fontFamily: 'Libre Baskerville' }}>
                  Designed for established clubs that require extensive membership support.
                </p>
              </div>
              {/* Fee Box */}
              <div
                className={`rounded-lg p-6 transition-transform duration-200 hover:scale-105 cursor-pointer ${isDark ? 'bg-gray-800' : 'bg-gray-100'} glow-burgundy-subtle`}
              >
                <div className="flex items-center mb-4">
                  <WineryIcon className="w-10 h-10 mr-3" />
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'HV Florentino' }}>
                    8% of sales
                  </h3>
                </div>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-white' : 'text-gray-700'}`} style={{ fontFamily: 'Libre Baskerville' }}>
                  Premium fee for clubs demanding world-class service and advanced integrations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Divider */}
      <div className="w-full max-w-[1920px] mx-auto px-8">
        <hr className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`} />
      </div>

      {/* Prominent CTA Section */}
      <div className="max-w-[1920px] mx-auto px-4 py-16 flex flex-col items-center">
        <button
          onClick={() => window.location.href = '/get-started'}
          className="text-white px-8 py-4 rounded-md text-lg transition-colors duration-200 hover:opacity-80 mb-8"
          style={{ backgroundColor: burgundy, fontFamily: 'TayBasal' }}
        >
          Get Started
        </button>
        <p
          className={`text-center max-w-2xl mt-4 ${isDark ? 'text-white' : 'text-gray-700'}`}
          style={{ fontFamily: 'Libre Baskerville' }}
        >
          Want the full details? Click Get Started to fill out our form, and we'll be in touch to answer your questions and arrange a demo.
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;