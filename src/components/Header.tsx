import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Wine, Menu, X } from 'lucide-react';
import NavLink from './NavLink';

const Header: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const burgundy = "#800020";
  
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close menu when escape key is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    
    // Prevent scrolling when menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close menu when clicking outside
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className={`fixed top-0 w-full z-50 ${isDark ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-sm border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className="max-w-[1920px] mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center">
              <Wine className="h-8 w-8" style={{ color: burgundy }} />
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'TayBasal' }}>
                Club Cuvee
              </span>
            </NavLink>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center ml-10 space-x-8">
              <NavLink to="/how-it-works" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-black hover:text-gray-900'} glow-burgundy`} style={{ fontFamily: 'TayBasal' }}>
                How It Works
              </NavLink>
              <NavLink to="/features" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-black hover:text-gray-900'} glow-burgundy`} style={{ fontFamily: 'TayBasal' }}>
                Features
              </NavLink>
              <NavLink to="/pricing" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-black hover:text-gray-900'} glow-burgundy`} style={{ fontFamily: 'TayBasal' }}>
                Pricing
              </NavLink>
              <NavLink to="/about" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-black hover:text-gray-900'} glow-burgundy`} style={{ fontFamily: 'TayBasal' }}>
                About
              </NavLink>
            </nav>
          </div>
          
          {/* Desktop Sign In / Get Started */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink 
              to="/login" 
              className={`${isDark ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-900'} glow-burgundy`} 
              style={{ fontFamily: 'TayBasal' }}
            >
              Sign in
            </NavLink>
            <NavLink 
              to="/get-started"
              className="text-white px-4 py-2 rounded-md transition-colors duration-200 glow-burgundy-strong"
              style={{ backgroundColor: burgundy, fontFamily: 'TayBasal' }}
            >
              Get Started
            </NavLink>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`p-2 rounded-md ${isDark ? 'text-white hover:bg-gray-800' : 'text-black hover:bg-gray-100'} transition-colors duration-200`}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={handleOverlayClick}
      >
        {/* Menu Panel */}
        <div 
          className={`fixed inset-0 ${isDark ? 'bg-black' : 'bg-white'} transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0 scale-100' : 'translate-x-full scale-95'
          }`}
        >
          <div className="flex flex-col h-full px-4 py-6">
            {/* Menu Header */}
            <div className="flex items-center justify-between mb-8">
              <NavLink to="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                <Wine className="h-8 w-8" style={{ color: burgundy }} />
                <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'TayBasal' }}>
                  Club Cuvee
                </span>
              </NavLink>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2 rounded-md ${isDark ? 'text-white hover:bg-gray-800' : 'text-black hover:bg-gray-100'} transition-colors duration-200`}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Mobile Menu Links */}
            <div className="flex flex-col items-center justify-center space-y-8 flex-grow py-8">
              <NavLink 
                to="/" 
                className={`text-2xl font-medium ${isDark ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-700'} glow-burgundy`} 
                style={{ fontFamily: 'TayBasal' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink 
                to="/how-it-works" 
                className={`text-2xl font-medium ${isDark ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-700'} glow-burgundy`} 
                style={{ fontFamily: 'TayBasal' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </NavLink>
              <NavLink 
                to="/features" 
                className={`text-2xl font-medium ${isDark ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-700'} glow-burgundy`} 
                style={{ fontFamily: 'TayBasal' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </NavLink>
              <NavLink 
                to="/pricing" 
                className={`text-2xl font-medium ${isDark ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-700'} glow-burgundy`} 
                style={{ fontFamily: 'TayBasal' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </NavLink>
              <NavLink 
                to="/about" 
                className={`text-2xl font-medium ${isDark ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-700'} glow-burgundy`} 
                style={{ fontFamily: 'TayBasal' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </NavLink>
            </div>
            
            {/* Mobile Sign In / Get Started */}
            <div className="flex flex-col space-y-4 w-full px-6">
              <NavLink 
                to="/login" 
                className={`w-full py-3 text-center text-lg rounded-md ${
                  isDark ? 'text-white hover:bg-gray-800' : 'text-black hover:bg-gray-100'
                } transition-colors duration-200 glow-burgundy`}
                style={{ fontFamily: 'TayBasal' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign in
              </NavLink>
              <NavLink 
                to="/get-started"
                className="w-full py-3 text-center text-lg text-white rounded-md transition-colors duration-200 glow-burgundy-strong"
                style={{ backgroundColor: burgundy, fontFamily: 'TayBasal' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;