import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop is a component that scrolls the window to the top
 * whenever the route changes (pathname changes).
 * 
 * It's a common pattern in SPAs to ensure that when a user navigates
 * to a new page, they start at the top of that page, rather than
 * maintaining their scroll position from the previous page.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  // When pathname changes, scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // This component doesn't render anything
  return null;
};

export default ScrollToTop;