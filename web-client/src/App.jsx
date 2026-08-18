import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sun, Moon, Menu, X, LogOut, User, ShoppingBag, ArrowLeft } from 'lucide-react';

// Import Pages
import Home from './pages/Home';
import About from './pages/About';
import Mission from './pages/Mission';
import GetInvolved from './pages/GetInvolved';
import Partner from './pages/Partner';
import Products from './pages/Products';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Declare from './pages/Declare';
import VideoLibrary from './pages/VideoLibrary';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <span className="animate-spin" style={{ fontSize: '24px' }}>✦</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  return children;
}

// Footer Component
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>SLAP BIBLE</h3>
          <p>
            Build consistency in God's Word daily. SLAP Bible Challenge is a global movement dedicated to helping believers cultivate a lifestyle of daily scripture study.
          </p>
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
    <div style={{ maxWidth: '1280px', margin: '0 auto 20px', padding: '0 24px' }}>
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

// Navigation Layout
function MainLayout() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Global Header */}
      <header className="header">
        <Link to="/" className="logo-container" onClick={() => setMobileMenuOpen(false)}>
          <img src="/logo.png" alt="SLAP Logo" className="logo-image" onError={(e) => { e.target.style.display = 'none'; }} />
          <span className="logo-text">SLAP BIBLE</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-menu">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>HOME</NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>ABOUT</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>SLAP</NavLink>
          <NavLink to="/declare" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>iSPEAK & iDECLARE</NavLink>
          <NavLink to="/videos" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>VIDEOS</NavLink>
          <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>PRODUCTS</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>CONTACT</NavLink>
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Theme Toggle (Night/Day Mode) */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '6px'
            }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Desktop-only Auth Links (Hidden on Mobile) */}
          <div className="desktop-only-nav" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/dashboard"
                  style={{
                    textDecoration: 'none',
                    color: 'var(--accent-gold)',
                    fontWeight: '600',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <User size={16} /> Dashboard
                </NavLink>
                <button
                  onClick={logout}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '6px'
                  }}
                  title="Sign Out"
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
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '6px'
            }}
            className="md-menu-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '72px',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'var(--bg-secondary)',
          zIndex: 99,
          display: 'flex',
          flexDirection: 'column',
          padding: '32px 24px',
          gap: '12px',
          borderTop: '1px solid var(--border-color)',
          overflowY: 'auto'
        }}>
          <NavLink to="/" end className="nav-link" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '16px', padding: '12px 0' }}>Home</NavLink>
          <NavLink to="/about" className="nav-link" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '16px', padding: '12px 0' }}>About</NavLink>
          <NavLink to="/mission" className="nav-link" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '16px', padding: '12px 0' }}>Mission & Vision</NavLink>
          <NavLink to="/get-involved" className="nav-link" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '16px', padding: '12px 0' }}>Get Involved</NavLink>
          <NavLink to="/partner" className="nav-link" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '16px', padding: '12px 0' }}>Partner Together</NavLink>
          <NavLink to="/products" className="nav-link" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '16px', padding: '12px 0' }}>Products</NavLink>
          <NavLink to="/blog" className="nav-link" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '16px', padding: '12px 0' }}>Blog</NavLink>
          <NavLink to="/contact" className="nav-link" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '16px', padding: '12px 0' }}>Contact</NavLink>
          <NavLink to="/declare" className="nav-link" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '16px', padding: '12px 0' }}>iSPEAK & iDECLARE</NavLink>
          <NavLink to="/videos" className="nav-link" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '16px', padding: '12px 0' }}>Video Library</NavLink>
          
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '8px' }}>
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--accent-gold)', fontWeight: 'bold', fontSize: '16px', padding: '12px 0' }}>Dashboard</NavLink>
                <button className="btn-secondary" onClick={() => { logout(); setMobileMenuOpen(false); }} style={{ marginTop: '16px', width: '100%' }}>Sign Out</button>
              </>
            ) : (
              <NavLink to="/auth" className="nav-cta" onClick={() => setMobileMenuOpen(false)} style={{ textAlign: 'center', display: 'block', padding: '14px', textDecoration: 'none', borderRadius: '8px' }}>Sign In / Register</NavLink>
            )}
          </div>
        </div>
      )}

      {/* Main Page Area */}
      <main className="main-content">
        <BackButton />
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
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

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
