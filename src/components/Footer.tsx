import { Link } from 'react-router-dom';
import { Wine, Instagram, Twitter, Youtube } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import NavLink from './NavLink';

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const burgundy = "#800020";

  const sections = {
    product: {
      title: 'Product',
      links: [
        { name: 'Features', href: '/features' },
        { name: 'Integrations', href: '/integrations' },
        { name: 'Pricing', href: '/pricing' }
      ]
    },
    resources: {
      title: 'Resources',
      links: [
        { name: 'Support', href: '/support' },
        { name: 'Documentation', href: '/docs' },
        { name: 'Brand Assets', href: '/brand' }
      ]
    },
    company: {
      title: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Blog', href: '/blog' },
        { name: 'Careers', href: '/careers' }
      ]
    }
  };

  return (
    <footer className={`border-t ${isDark ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Mobile Footer Layout */}
        <div className="md:hidden flex flex-col items-center space-y-8">
          {/* Logo and Brand */}
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-3">
              <Wine className="h-6 w-6 mr-2" style={{ color: burgundy }} />
              <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'TayBasal' }}>
                Club Cuvee
              </span>
            </div>
            
            {/* Social Icons */}
            <div className="flex space-x-4 mb-6">
              {[
                { icon: Instagram, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Youtube, href: '#' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Mobile Navigation Links */}
          <div className="space-y-6 w-full text-center">
            {Object.entries(sections).map(([key, section]) => (
              <div key={key} className="mb-4">
                <h3 className={`text-sm font-semibold uppercase tracking-wider ${
                  isDark ? 'text-gray-400' : 'text-gray-900'
                } mb-3`}>
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link, index) => (
                    <li key={index} className="text-sm">
                      <NavLink
                        to={link.href}
                        className={`${
                          isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {link.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          {/* Mobile Footer Bottom */}
          <div className="w-full pt-6 border-t border-gray-800 flex flex-col space-y-4 items-center">
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              © Monopole AI, Inc.
            </p>
            <ThemeToggle />
          </div>
        </div>

        {/* Desktop Footer Layout */}
        <div className="hidden md:grid grid-cols-4 gap-8">
          {/* Logo and Social Links */}
          <div>
            <div className="flex items-center mb-4">
              <Wine className="h-8 w-8 mr-2" style={{ color: burgundy }} />
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'TayBasal' }}>
                Club Cuvee
              </span>
            </div>
            <div className="flex space-x-4">
              {[
                { icon: Instagram, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Youtube, href: '#' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Sections */}
          {Object.entries(sections).map(([key, section]) => (
            <div key={key}>
              <h3 className={`text-sm font-semibold uppercase tracking-wider ${
                isDark ? 'text-gray-400' : 'text-gray-900'
              } mb-4`}>
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <NavLink
                      to={link.href}
                      className={`${
                        isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Desktop Bottom Section */}
        <div className="hidden md:flex mt-8 pt-8 border-t border-gray-800 items-center justify-between">
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            © Monopole AI, Inc.
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
};

export default Footer;