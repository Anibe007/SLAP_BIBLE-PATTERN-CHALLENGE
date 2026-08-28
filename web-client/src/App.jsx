import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sun, Moon, Menu, X, LogOut, User, ArrowLeft, Home as HomeIcon, BookOpen, Sparkles, Video as VideoIcon, ShieldCheck } from 'lucide-react';
import PageTransition from './components/PageTransition';
import ScrollToTop from './components/ScrollToTop';
import SkeletonLoader from './components/SkeletonLoader';
import FloatingWhatsApp from './components/FloatingWhatsApp';

// Lazy Loaded Pages for Instant Performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Mission = lazy(() => import('./pages/Mission'));
const GetInvolved = lazy(() => import('./pages/GetInvolved'));
const Partner = lazy(() => import('./pages/Partner'));
const Products = lazy(() => import('./pages/Products'));
const Blog = lazy(() => import('./pages/Blog'));
const Contact = lazy(() => import('./pages/Contact'));
const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Declare = lazy(() => import('./pages/Declare'));
const VideoLibrary = lazy(() => import('./pages/VideoLibrary'));
const Admin = lazy(() => import('./pages/Admin'));

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '70vh' }}>
        <span className="animate-spin" style={{ fontSize: '28px', color: 'var(--accent-gold)' }}>✦</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  return children;
}

// Admin Protected Route Component
function AdminProtectedRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '70vh' }}>
        <span className="animate-spin" style={{ fontSize: '28px', color: 'var(--accent-gold)' }}>✦</span>
      </div>
    );
  }

  // If not authenticated or not admin, direct to admin auth portal or render Admin gate
  if (!isAuthenticated) {
    return <Navigate to="/auth?portal=admin" state={{ from: location.pathname }} replace />;
  }

  return children;
}

// Global Footer Component
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>SLAP BIBLE</h3>
          <p>
            Build consistency in God's Word daily. SLAP Bible Challenge is a global movement dedicated to helping believers cultivate a lifestyle of daily scripture study.
          </p>
          
          {/* Social & Messaging SVG Logos */}
          <div className="footer-social">
            {/* WhatsApp Logo */}
            <a
              href="https://wa.me/2348155180000"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
              aria-label="WhatsApp"
              title="Chat on WhatsApp (08155180000)"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.015.376-.101c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.135.56 4.139 1.536 5.88l-1.636 5.948 6.137-1.609c1.701.928 3.649 1.458 5.72 1.458 6.627 0 12-5.373 12-12s-5.373-12-12-12z"/>
              </svg>
            </a>

            {/* Instagram Logo */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
              aria-label="Instagram"
              title="Follow on Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* Facebook Logo */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
              aria-label="Facebook"
              title="Connect on Facebook"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            {/* LinkedIn Logo */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
              aria-label="LinkedIn"
              title="Connect on LinkedIn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Programs</h4>
          <Link to="/dashboard">Daily SLAP</Link>
          <Link to="/declare">iSPEAK &amp; iDECLARE</Link>
          <Link to="/videos">Video Library</Link>
          <Link to="/products">Products</Link>
        </div>
        <div className="footer-col">
          <h4>About</h4>
          <Link to="/about">Our Story</Link>
          <Link to="/mission">Mission</Link>
          <Link to="/get-involved">Get Involved</Link>
          <Link to="/partner">Partner</Link>
        </div>
        <div className="footer-col">
          <h4>Connect</h4>
          <Link to="/contact">Contact Us</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/auth">Sign Up</Link>
          <Link to="/auth?portal=admin" style={{ color: 'var(--accent-gold)' }}>Admin Portal</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 SLAP Bible Challenge. All rights reserved.</span>
        <span>Build People. Build Faith. Build on Christ.</span>
      </div>
    </footer>
  );
}

// Global Back Button Component
function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/') return null;

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto 20px', padding: '0 24px' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-color)',
          padding: '10px 18px',
          borderRadius: '6px',
          fontWeight: '600',
          fontSize: '13px',
          cursor: 'pointer',
          boxShadow: 'var(--card-shadow)',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-gold)'; e.currentTarget.style.transform = 'translateX(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = ''; }}
      >
        <ArrowLeft size={16} style={{ color: 'var(--accent-gold)' }} /> Back
      </button>
    </div>
  );
}

// Mobile Bottom Navigation Bar
function MobileBottomNav() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="mobile-bottom-bar" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '60px',
      background: 'var(--glass-bg)',
      backdropFilter: 'var(--glass-blur)',
      WebkitBackdropFilter: 'var(--glass-blur)',
      borderTop: '1px solid var(--border-color)',
      display: 'none',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 95,
      paddingBottom: 'env(safe-area-inset-bottom)'
    }}>
      <NavLink to="/" end className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`} style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', textDecoration: 'none',
        color: 'var(--text-secondary)', fontSize: '10px', fontWeight: '700'
      }}>
        <HomeIcon size={20} />
        <span>Home</span>
      </NavLink>
      <NavLink to={isAuthenticated ? "/dashboard" : "/auth"} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`} style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', textDecoration: 'none',
        color: 'var(--text-secondary)', fontSize: '10px', fontWeight: '700'
      }}>
        <BookOpen size={20} />
        <span>SLAP</span>
      </NavLink>
      <NavLink to="/declare" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`} style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', textDecoration: 'none',
        color: 'var(--text-secondary)', fontSize: '10px', fontWeight: '700'
      }}>
        <Sparkles size={20} />
        <span>Declare</span>
      </NavLink>
      <NavLink to="/videos" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`} style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', textDecoration: 'none',
        color: 'var(--text-secondary)', fontSize: '10px', fontWeight: '700'
      }}>
        <VideoIcon size={20} />
        <span>Videos</span>
      </NavLink>
    </div>
  );
}

// Navigation Layout
function MainLayout() {
  const { theme, toggleTheme } = useTheme();
  const { logout, isAuthenticated, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Header scroll-shrink effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  const location = useLocation();
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  return (
    <div className="app-container">
      <ScrollToTop />
      <FloatingWhatsApp />

      {/* Global Header */}
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="logo-container" onClick={() => setMobileMenuOpen(false)}>
          <img src="/logo.png" alt="SLAP Logo" className="logo-image" onError={(e) => { e.target.style.display = 'none'; }} />
          <span className="logo-text">SLAP BIBLE</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-menu">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>HOME</NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>ABOUT</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>SLAP</NavLink>
          <NavLink to="/declare" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>iSPEAK &amp; iDECLARE</NavLink>
          <NavLink to="/videos" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>VIDEOS</NavLink>
          <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>PRODUCTS</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>CONTACT</NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ color: 'var(--accent-gold)', fontWeight: '700' }}>
              <ShieldCheck size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> ADMIN
            </NavLink>
          )}
        </nav>

        {/* Right Actions */}
        <div className="header-actions">
          {/* Theme Toggle (Night/Day Mode) */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Desktop-only Auth Links */}
          <div className="desktop-auth-links">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className="desktop-auth-link">
                  <User size={16} /> Dashboard
                </NavLink>
                {isAdmin && (
                  <NavLink to="/admin" className="desktop-auth-link" style={{ borderColor: 'var(--accent-gold)', color: 'var(--accent-gold)' }}>
                    <ShieldCheck size={16} /> Admin
                  </NavLink>
                )}
                <button
                  onClick={logout}
                  className="logout-btn"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <NavLink to="/auth" className="nav-link nav-cta" style={{ padding: '8px 20px' }}>Sign Up</NavLink>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            aria-label="Open Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu — Smooth CSS-driven */}
      <div
        className={`drawer-backdrop ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <div className={`drawer-panel ${mobileMenuOpen ? 'open' : ''}`}>
        <NavLink to="/" end className="nav-link drawer-link">Home</NavLink>
        <NavLink to="/about" className="nav-link drawer-link">About</NavLink>
        <NavLink to="/mission" className="nav-link drawer-link">Mission &amp; Vision</NavLink>
        <NavLink to="/get-involved" className="nav-link drawer-link">Get Involved</NavLink>
        <NavLink to="/partner" className="nav-link drawer-link">Partner Together</NavLink>
        <NavLink to="/products" className="nav-link drawer-link">Products</NavLink>
        <NavLink to="/blog" className="nav-link drawer-link">Blog</NavLink>
        <NavLink to="/contact" className="nav-link drawer-link">Contact</NavLink>
        <NavLink to="/declare" className="nav-link drawer-link">iSPEAK &amp; iDECLARE</NavLink>
        <NavLink to="/videos" className="nav-link drawer-link">Video Library</NavLink>
        <NavLink to="/admin" className="nav-link drawer-link" style={{ color: 'var(--accent-gold)', fontWeight: '700' }}>
          <ShieldCheck size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} /> Admin Dashboard
        </NavLink>
        
        <div className="drawer-auth-section">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className="nav-link" style={{ color: 'var(--accent-gold)', fontWeight: 'bold', fontSize: '16px', padding: '14px 0', display: 'block' }}>Dashboard</NavLink>
              <button className="btn-secondary" onClick={() => { logout(); setMobileMenuOpen(false); }} style={{ marginTop: '16px', width: '100%' }}>Sign Out</button>
            </>
          ) : (
            <NavLink to="/auth" className="drawer-cta">
              Sign In / Register
            </NavLink>
          )}
        </div>
      </div>

      {/* Main Page Area with Suspense and PageTransition */}
      <main className="main-content">
        <BackButton />
        <PageTransition>
          <Suspense fallback={<SkeletonLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/mission" element={<Mission />} />
              <Route path="/get-involved" element={<GetInvolved />} />
              <Route path="/partner" element={<Partner />} />
              <Route path="/products" element={<Products />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/declare" element={<Declare />} />
              <Route path="/videos" element={<VideoLibrary />} />
              <Route path="/admin" element={
                <AdminProtectedRoute>
                  <Admin />
                </AdminProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </PageTransition>
      </main>

      {/* Mobile Bottom Bar */}
      <MobileBottomNav />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <MainLayout />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
