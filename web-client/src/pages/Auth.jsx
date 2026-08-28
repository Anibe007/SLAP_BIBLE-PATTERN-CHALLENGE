import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, BookOpen, Flame, ShieldCheck, ShieldAlert, Eye, EyeOff, Globe, Key, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimateOnScroll from '../components/AnimateOnScroll';

const COUNTRIES = [
  "Nigeria", "Ghana", "Kenya", "South Africa", "United States", "United Kingdom",
  "Canada", "Australia", "Uganda", "Cameroon", "Liberia", "Sierra Leone", "Zambia",
  "Zimbabwe", "Tanzania", "Rwanda", "India", "Philippines", "Germany", "France",
  "Brazil", "Jamaica", "Trinidad and Tobago", "Other"
];

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [portalMode, setPortalMode] = useState('participant'); // 'participant' or 'admin'
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [adminPasskey, setAdminPasskey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, loginAdmin, registerAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const portalParam = searchParams.get('portal') || searchParams.get('role');
    if (portalParam === 'admin') {
      setPortalMode('admin');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (portalMode === 'admin') {
        if (isRegister) {
          await registerAdmin(email, password, fullName, country, adminPasskey);
        } else {
          await loginAdmin(email, password);
        }
        navigate('/admin');
      } else {
        if (isRegister) {
          await register(email, password, fullName, country);
        } else {
          await login(email, password);
        }
        const redirectPath = location.state?.from || '/dashboard';
        navigate(redirectPath);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px 16px' }}>
      <AnimateOnScroll animation="scaleIn" className="w-full flex-center">
        <div className="auth-container" style={{ maxWidth: '980px', width: '100%' }}>
          
          {/* Left: Brand Panel */}
          <div className="auth-brand-panel" style={{
            background: portalMode === 'admin'
              ? 'linear-gradient(135deg, #1a1409, #3a2d1d, #b8860b)'
              : 'linear-gradient(135deg, var(--accent-gold), var(--accent-warm), var(--accent-brown))'
          }}>
            <div className="auth-watermark">{portalMode === 'admin' ? 'A' : 'S'}</div>

            <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
              <span className="text-label" style={{ color: 'white', opacity: 0.9 }}>
                {portalMode === 'admin' ? 'ADMINISTRATOR PORTAL' : 'SLAP BIBLE CHALLENGE'}
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', color: 'white', margin: 0, lineHeight: 1.2 }}>
                {portalMode === 'admin'
                  ? <>Platform Oversight.<br />Member Records.<br />Super Admin Controls.</>
                  : <>Build People.<br />Build Faith.<br />Build on Christ.</>}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px', width: '100%', maxWidth: '280px' }}>
                {portalMode === 'admin' ? (
                  [
                    { icon: <ShieldCheck size={18} />, text: 'Super admin authorization' },
                    { icon: <UserCheck size={18} />, text: 'Full participant records & streaks' },
                    { icon: <BookOpen size={18} />, text: 'Global submissions inspection' }
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'rgba(255,255,255,0.95)', textAlign: 'left' }}>
                      <div style={{ opacity: 0.9, flexShrink: 0, color: 'var(--accent-gold)' }}>{item.icon}</div>
                      <span>{item.text}</span>
                    </div>
                  ))
                ) : (
                  [
                    { icon: <BookOpen size={18} />, text: 'Daily structured Bible study' },
                    { icon: <Flame size={18} />, text: 'Streak tracking & accountability' },
                    { icon: <ShieldCheck size={18} />, text: 'iSPEAK & iDECLARE cards' }
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'rgba(255,255,255,0.95)', textAlign: 'left' }}>
                      <div style={{ opacity: 0.8, flexShrink: 0 }}>{item.icon}</div>
                      <span>{item.text}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right: Form Panel */}
          <div className="auth-form-panel">
            
            {/* Portal Switcher (Participant vs Admin) */}
            <div style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: '8px', padding: '4px', border: '1px solid var(--border-color)', marginBottom: '8px' }}>
              <button
                type="button"
                onClick={() => { setPortalMode('participant'); setError(''); }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: portalMode === 'participant' ? 'var(--accent-gold)' : 'transparent',
                  color: portalMode === 'participant' ? '#1a1409' : 'var(--text-secondary)'
                }}
              >
                Participant Portal
              </button>
              <button
                type="button"
                onClick={() => { setPortalMode('admin'); setError(''); }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: portalMode === 'admin' ? 'rgba(212, 160, 23, 0.2)' : 'transparent',
                  color: portalMode === 'admin' ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  border: portalMode === 'admin' ? '1px solid var(--accent-gold)' : '1px solid transparent'
                }}
              >
                <Shield size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> Admin Portal
              </button>
            </div>

            <div className="text-center">
              <h2 style={{ fontSize: '26px', color: 'var(--text-primary)', margin: '0 0 6px' }}>
                {portalMode === 'admin'
                  ? (isRegister ? 'Admin Registration' : 'Admin Sign In')
                  : (isRegister ? 'Join SLAP Challenge' : 'Participant Sign In')}
              </h2>
              <p style={{ fontSize: '13px', margin: 0, color: 'var(--text-secondary)' }}>
                {portalMode === 'admin'
                  ? (isRegister ? 'Create an authorized administrator account with passkey' : 'Enter administrator credentials to access the admin dashboard')
                  : (isRegister ? 'Create an account to start logging your daily devotions' : 'Sign in to access your personal study logs & streaks')}
              </p>
            </div>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {isRegister && (
                <>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '13px' }}>Full Name</label>
                    <div style={{ position: 'relative' }}>
                      <User size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-secondary)' }} />
                      <input
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        style={{ paddingLeft: '44px' }}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '13px' }}>Nationality / Country</label>
                    <div style={{ position: 'relative' }}>
                      <Globe size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-secondary)' }} />
                      <select
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                        style={{ paddingLeft: '44px' }}
                      >
                        {COUNTRIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Required Admin Authorization Passkey for Admin Sign-Up */}
                  {portalMode === 'admin' && (
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '13px', color: 'var(--accent-gold)', fontWeight: '700' }}>
                        Admin Authorization Passkey
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Key size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--accent-gold)' }} />
                        <input
                          type="password"
                          required
                          placeholder="Enter confidential administrator passkey"
                          value={adminPasskey}
                          onChange={e => setAdminPasskey(e.target.value)}
                          style={{ paddingLeft: '44px', borderColor: 'var(--accent-gold)' }}
                        />
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', display: 'block' }}>
                        Confidential key issued only by the Lead Administrator.
                      </span>
                    </div>
                  )}
                </>
              )}

              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '13px' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-secondary)' }} />
                  <input
                    type="email"
                    required
                    placeholder={portalMode === 'admin' ? "admin@slapbible.org" : "you@example.com"}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ paddingLeft: '44px' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '13px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-secondary)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ paddingLeft: '44px', paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '12px',
                      background: 'none',
                      border: 'none',
                      padding: '4px',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '8px',
                opacity: loading ? 0.7 : 1,
                padding: '14px',
                background: portalMode === 'admin' ? 'var(--accent-gold)' : undefined,
                color: portalMode === 'admin' ? '#1a1409' : undefined,
                fontWeight: '700'
              }}>
                {loading ? 'Authenticating...' : isRegister ? (portalMode === 'admin' ? 'Register Admin Account' : 'Register Participant Account') : (portalMode === 'admin' ? 'Sign In to Admin Dashboard' : 'Sign In')} <ArrowRight size={16} />
              </button>
            </form>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-gold)',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '700',
                padding: '4px 8px',
              }} onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}>
                {isRegister
                  ? (portalMode === 'admin' ? 'Already an authorized admin? Sign In' : 'Already have an account? Sign In')
                  : (portalMode === 'admin' ? 'Need to register a new Admin? Admin Sign-Up' : "Don't have an account? Sign Up")}
              </button>
            </div>
          </div>
        </div>
      </AnimateOnScroll>
    </div>
  );
}
