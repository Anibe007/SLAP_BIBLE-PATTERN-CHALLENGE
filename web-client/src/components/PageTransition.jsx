import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * PageTransition — Wraps page content with a fade-in animation
 * and scrolls to top on route changes.
 */
export default function PageTransition({ children }) {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div
      key={location.pathname}
      className="page-transition"
    >
      {children}
    </div>
  );
}
