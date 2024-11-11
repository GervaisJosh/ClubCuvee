import React from 'react';
import { Link } from 'react-router-dom';
import { Wine, Instagram, Twitter, Youtube, MessageSquare } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Social Links */}
          <div>
            <div className="flex items-center mb-4">
              <Wine className="h-8 w-8 text-green-500 mr-2" />
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Cuvee Club
              </span>
            </div>
            <div className="flex space-x-4">
              {[
                { icon: Instagram, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Youtube, href: '#' },
                { icon: MessageSquare, href: '#' }
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
                    <Link
                      to={link.href}
                      className={`${
                        isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex items-center justify-between">
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