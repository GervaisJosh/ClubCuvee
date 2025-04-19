import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

/**
 * NavLink is a custom component that extends the Link component from react-router-dom.
 * It scrolls the window to the top whenever it's clicked, ensuring that when a user
 * navigates to a new page, they start at the top of that page.
 */
const NavLink: React.FC<LinkProps> = ({ children, to, ...props }) => {
  // Handle click to scroll to top
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (props.onClick) {
      props.onClick(e);
    }
    // Scroll to top immediately
    window.scrollTo(0, 0);
  };

  return (
    <Link to={to} {...props} onClick={handleClick}>
      {children}
    </Link>
  );
};

export default NavLink;