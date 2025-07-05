import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Header from './Header';
import Footer from './Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      <Header />
      <main className="pt-24">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;