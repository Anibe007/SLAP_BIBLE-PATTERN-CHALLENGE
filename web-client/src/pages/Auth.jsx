import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, BookOpen, Flame, ShieldCheck, ShieldAlert, Eye, EyeOff, Globe, Key, UserCheck, Shield, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimateOnScroll from '../components/AnimateOnScroll';
import CelebrationModal from '../components/CelebrationModal';

const COUNTRIES = [
  // ── Africa (Primary Audience First) ──
  "Nigeria", "Ghana", "Kenya", "South Africa", "Uganda", "Tanzania", "Rwanda",
  "Cameroon", "Liberia", "Sierra Leone", "Zambia", "Zimbabwe", "Ethiopia",
  "Senegal", "Ivory Coast", "Benin", "Togo", "Mali", "Burkina Faso", "Niger",
  "Guinea", "Guinea-Bissau", "Gambia", "Cape Verde", "São Tomé and Príncipe",
  "Mauritania", "Morocco", "Algeria", "Tunisia", "Libya", "Egypt", "Sudan",
  "South Sudan", "Chad", "Central African Republic", "Democratic Republic of Congo",
  "Republic of Congo", "Gabon", "Equatorial Guinea", "Angola", "Namibia",
  "Botswana", "Lesotho", "Eswatini", "Mozambique", "Malawi", "Madagascar",
  "Comoros", "Mauritius", "Seychelles", "Djibouti", "Eritrea", "Somalia",
  "Burundi", "Sao Tome and Principe",

  // ── Americas ──
  "United States", "Canada", "Brazil", "Jamaica", "Trinidad and Tobago",
  "Barbados", "Bahamas", "Antigua and Barbuda", "Saint Lucia", "Saint Vincent and the Grenadines",
  "Grenada", "Dominica", "Saint Kitts and Nevis", "Haiti", "Dominican Republic",
  "Cuba", "Puerto Rico", "Mexico", "Guatemala", "Belize", "Honduras",
  "El Salvador", "Nicaragua", "Costa Rica", "Panama", "Colombia", "Venezuela",
  "Guyana", "Suriname", "Ecuador", "Peru", "Bolivia", "Paraguay",
  "Uruguay", "Argentina", "Chile",

  // ── Europe ──
  "United Kingdom", "Ireland", "France", "Germany", "Italy", "Spain",
  "Portugal", "Netherlands", "Belgium", "Luxembourg", "Switzerland", "Austria",
  "Denmark", "Sweden", "Norway", "Finland", "Iceland", "Poland", "Czech Republic",
  "Slovakia", "Hungary", "Romania", "Bulgaria", "Greece", "Croatia",
  "Slovenia", "Serbia", "Bosnia and Herzegovina", "Montenegro", "North Macedonia",
  "Albania", "Kosovo", "Moldova", "Ukraine", "Belarus", "Russia",
  "Estonia", "Latvia", "Lithuania", "Malta", "Cyprus", "Andorra",
  "Monaco", "Liechtenstein", "San Marino", "Vatican City",

  // ── Asia ──
  "India", "Philippines", "China", "Japan", "South Korea", "North Korea",
  "Indonesia", "Malaysia", "Singapore", "Thailand", "Vietnam", "Cambodia",
  "Laos", "Myanmar", "Bangladesh", "Sri Lanka", "Nepal", "Pakistan",
  "Afghanistan", "Maldives", "Bhutan", "Mongolia", "Taiwan", "Hong Kong",
  "Macau", "Brunei", "East Timor", "Papua New Guinea",

  // ── Middle East ──
  "Saudi Arabia", "United Arab Emirates", "Israel", "Palestine", "Jordan",
  "Lebanon", "Syria", "Iraq", "Iran", "Kuwait", "Qatar", "Bahrain",
  "Oman", "Yemen", "Turkey", "Azerbaijan", "Armenia", "Georgia",
  "Kazakhstan", "Uzbekistan", "Turkmenistan", "Tajikistan", "Kyrgyzstan",

  // ── Oceania ──
  "Australia", "New Zealand", "Fiji", "Papua New Guinea", "Solomon Islands",
  "Vanuatu", "Samoa", "Tonga", "Kiribati", "Micronesia", "Palau",
  "Marshall Islands", "Nauru", "Tuvalu",

  "Other"
];


export default function Auth() {
  const [searchParams] = useSearchParams();
  const [portalMode, setPortalMode] = useState('participant'); // 'participant' or 'admin'
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [adminPasskey, setAdminPasskey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [celebrationData, setCelebrationData] = useState(null);

  const { login, register, loginAdmin, registerAdmin, loginWithGoogle, simulateTestLogin, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect already-authenticated users away from /auth
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from;
      navigate(from || (isAdmin ? '/admin' : '/dashboard'), { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate, location.state]);

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
          setLoading(false);
          setCelebrationData({
            isOpen: true,
            type: 'signup',
            title: `🎉 Congratulations & Welcome, ${fullName || 'Administrator'}!`,
            subtitle: `Your Super Administrator account has been successfully created with full platform oversight controls.`,
            details: [
              { label: '📧 Admin Email', value: email },
              { label: '🛡️ Role', value: 'Super Administrator' },
              { label: '🌍 Nation', value: country || 'Global' }
            ],
            targetPath: '/admin'
          });
        } else {
          const loggedAdmin = await loginAdmin(email, password);
          setLoading(false);
          setCelebrationData({
            isOpen: true,
            type: 'signin',
            title: `🎉 Welcome Back, ${loggedAdmin?.user_metadata?.full_name || loggedAdmin?.fullName || 'Administrator'}!`,
            subtitle: `Successfully authenticated into the SLAP Administrator Portal.`,
            details: [
              { label: '📧 Admin Account', value: email },
              { label: '🛡️ Access Level', value: 'Full Super-Admin Controls' }
            ],
            targetPath: '/admin'
          });
        }
      } else {
        if (isRegister) {
          await register(email, password, fullName, country);
          setLoading(false);
          setCelebrationData({
            isOpen: true,
            type: 'signup',
            title: `🎉 Congratulations & Welcome, ${fullName || 'Believer'}!`,
            subtitle: `You have successfully joined the global SLAP Bible Challenge family! Ready to build consistency in the Word?`,
            details: [
              { label: '📧 Member Email', value: email },
              { label: '🌍 Nation', value: country || 'Global' },
              { label: '🔥 Initial Goal', value: 'Start Day 1 Devotion' }
            ],
            targetPath: location.state?.from || '/dashboard'
          });
        } else {
          const loggedUser = await login(email, password);
          setLoading(false);
          setCelebrationData({
            isOpen: true,
            type: 'signin',
            title: `🎉 Welcome Back, ${loggedUser?.user_metadata?.full_name || loggedUser?.fullName || 'Believer'}!`,
            subtitle: `Authentication successful! Let's continue your daily scripture devotion and keep your streak burning.`,
            details: [
              { label: '📧 Account', value: email },
              { label: '📖 Status', value: "Ready for Today's Devotion" }
            ],
            targetPath: location.state?.from || '/dashboard'
          });
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);
    try {
      const gUser = await loginWithGoogle(portalMode);
      setLoading(false);
      setCelebrationData({
        isOpen: true,
        type: 'signin',
        title: `🎉 Welcome, ${gUser?.fullName || gUser?.user_metadata?.full_name || 'Believer'}!`,
        subtitle: `Google Authentication successful! You are connected to the SLAP Bible Challenge.`,
        details: [
          { label: '📧 Google Account', value: gUser?.email || 'google.user@gmail.com' },
          { label: '🛡️ Access Level', value: portalMode === 'admin' ? 'Super Administrator' : 'Devotional Participant' },
          { label: '🔑 Provider', value: 'Google Single Sign-On' }
        ],
        targetPath: portalMode === 'admin' ? '/admin' : '/dashboard'
      });
    } catch (err) {
      setError(err.message || 'Google Sign-In failed. Please try again.');
      setLoading(false);
    }
  };

  const handleSimulateTestLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await simulateTestLogin(portalMode);
      setLoading(false);
      setCelebrationData({
        isOpen: true,
        type: 'signin',
        title: `🎉 Test Account Authenticated & Devotion Logged!`,
        subtitle: `Logged into simulated test account (${res.user.fullName}) and auto-created a sample SLAP study log for testing!`,
        details: [
          { label: '📧 Account Email', value: res.user.email },
          { label: '📖 Auto Journal Log', value: `${res.report.book} ${res.report.chapter}:${res.report.verses}` },
          { label: '🔥 Updated Streak', value: `${res.streak.current_streak} Days Active` }
        ],
        targetPath: portalMode === 'admin' ? '/admin' : '/dashboard'
      });
    } catch (err) {
      setError(err.message || 'Simulated test login failed.');
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
              ? 'linear-gradient(150deg, #07090f 0%, #0d1840 50%, #1a0a18 100%)'
              : 'linear-gradient(150deg, #070c22 0%, #0d1840 50%, #101f55 100%)'
          }}>
            <div className="auth-watermark" style={{ color: portalMode === 'admin' ? 'rgba(178,13,48,0.08)' : 'rgba(178,13,48,0.07)' }}>{portalMode === 'admin' ? 'A' : 'S'}</div>

            {/* Logo */}
            <img src="/SLAP LOGO-Picsart-AiImageEnhancer.jpeg" alt="SLAP Bible" style={{ width: '72px', height: '72px', borderRadius: '12px', objectFit: 'contain', border: '2px solid rgba(178,13,48,0.4)', boxShadow: '0 0 24px rgba(178,13,48,0.25)', marginBottom: '4px' }} onError={e => e.target.style.display='none'} />

            <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(178,13,48,0.15)', border: '1px solid rgba(178,13,48,0.3)', borderRadius: '30px', padding: '5px 14px' }}>
                <span style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '2.5px', color: '#f2a8b6', textTransform: 'uppercase' }}>
                  {portalMode === 'admin' ? 'ADMINISTRATOR PORTAL' : 'SLAP BIBLE CHALLENGE'}
                </span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '800', color: 'white', margin: 0, lineHeight: 1.15, textAlign: 'center' }}>
                {portalMode === 'admin'
                  ? <>Platform Oversight.<br />Member Records.<br /><span style={{ color: 'var(--brand-crimson)' }}>Super Admin.</span></>
                  : <>Build People.<br />Build Faith.<br /><span style={{ color: 'var(--brand-crimson)' }}>Build on Christ.</span></>}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '280px' }}>
                {portalMode === 'admin' ? (
                  [
                    { icon: <ShieldCheck size={16} />, text: 'Super admin authorization' },
                    { icon: <UserCheck size={16} />, text: 'Full participant records & streaks' },
                    { icon: <BookOpen size={16} />, text: 'Global submissions inspection' }
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'rgba(255,255,255,0.85)', textAlign: 'left', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ flexShrink: 0, color: 'var(--brand-crimson)' }}>{item.icon}</div>
                      <span>{item.text}</span>
                    </div>
                  ))
                ) : (
                  [
                    { icon: <BookOpen size={16} />, text: 'Daily structured Bible study' },
                    { icon: <Flame size={16} />, text: 'Streak tracking & accountability' },
                    { icon: <ShieldCheck size={16} />, text: 'iSPEAK & iDECLARE cards' }
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'rgba(255,255,255,0.85)', textAlign: 'left', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ flexShrink: 0, color: 'var(--brand-crimson)' }}>{item.icon}</div>
                      <span>{item.text}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Trusted by line */}
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: '8px' }}>
                Trusted by believers in <strong style={{ color: 'rgba(255,255,255,0.65)' }}>30+ nations</strong>
              </div>
            </div>
          </div>

          {/* Right: Form Panel */}
          <div className="auth-form-panel">
            
            {/* Portal Switcher (Participant vs Admin) */}
            <div style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: '10px', padding: '4px', border: '1px solid var(--border-color)', marginBottom: '8px' }}>
              <button
                type="button"
                onClick={() => { setPortalMode('participant'); setError(''); }}
                style={{
                  flex: 1, padding: '9px 12px', borderRadius: '7px', border: 'none',
                  fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: portalMode === 'participant' ? 'var(--brand-crimson)' : 'transparent',
                  color: portalMode === 'participant' ? '#ffffff' : 'var(--text-secondary)',
                  boxShadow: portalMode === 'participant' ? '0 2px 12px rgba(178,13,48,0.4)' : 'none'
                }}
              >
                Participant Portal
              </button>
              <button
                type="button"
                onClick={() => { setPortalMode('admin'); setError(''); }}
                style={{
                  flex: 1, padding: '9px 12px', borderRadius: '7px', border: 'none',
                  fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: portalMode === 'admin' ? 'rgba(16,31,85,0.5)' : 'transparent',
                  color: portalMode === 'admin' ? '#ffffff' : 'var(--text-secondary)',
                  boxShadow: portalMode === 'admin' ? '0 2px 12px rgba(16,31,85,0.3)' : 'none',
                  border: portalMode === 'admin' ? '1px solid rgba(178,13,48,0.25)' : '1px solid transparent'
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
                      {/* Search Input */}
                      <Search size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--accent-gold)', zIndex: 2, pointerEvents: 'none' }} />
                      <input
                        type="text"
                        placeholder={country || 'Search your country...'}
                        value={countrySearch}
                        onChange={e => { setCountrySearch(e.target.value); setShowCountryDropdown(true); }}
                        onFocus={() => setShowCountryDropdown(true)}
                        onBlur={() => setTimeout(() => setShowCountryDropdown(false), 180)}
                        style={{
                          paddingLeft: '44px',
                          paddingRight: '36px',
                          cursor: 'text',
                          background: 'var(--bg-card)'
                        }}
                        autoComplete="off"
                      />
                      {/* Globe icon right side showing selected */}
                      <Globe size={15} style={{ position: 'absolute', right: '12px', top: '15px', color: 'var(--text-secondary)', pointerEvents: 'none' }} />

                      {/* Dropdown List */}
                      {showCountryDropdown && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          zIndex: 999,
                          background: 'var(--bg-card)',
                          border: '1px solid var(--accent-gold)',
                          borderRadius: '8px',
                          maxHeight: '220px',
                          overflowY: 'auto',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                          marginTop: '4px'
                        }}>
                          {COUNTRIES.filter(c =>
                            c.toLowerCase().includes(countrySearch.toLowerCase())
                          ).length === 0 ? (
                            <div style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                              No country found for "{countrySearch}"
                            </div>
                          ) : (
                            COUNTRIES.filter(c =>
                              c.toLowerCase().includes(countrySearch.toLowerCase())
                            ).map(c => (
                              <div
                                key={c}
                                onMouseDown={() => {
                                  setCountry(c);
                                  setCountrySearch('');
                                  setShowCountryDropdown(false);
                                }}
                                style={{
                                  padding: '10px 16px',
                                  fontSize: '14px',
                                  cursor: 'pointer',
                                  color: c === country ? 'var(--brand-crimson)' : 'var(--text-primary)',
                                  background: c === country ? 'rgba(178,13,48,0.10)' : 'transparent',
                                  fontWeight: c === country ? '700' : '400',
                                  borderBottom: '1px solid var(--border-color)',
                                  transition: 'background 0.15s ease'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(178,13,48,0.08)'}
                                onMouseLeave={e => e.currentTarget.style.background = c === country ? 'rgba(178,13,48,0.10)' : 'transparent'}
                              >
                                {c === country && <span style={{ marginRight: '6px', fontSize: '11px' }}>✓</span>}
                                {c}
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                    {/* Show selected country as a badge */}
                    {country && !showCountryDropdown && (
                      <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Selected:</span>
                        <span style={{
                          fontSize: '12px', fontWeight: '700',
                          color: 'var(--accent-gold)',
                          background: 'rgba(212,160,23,0.12)',
                          padding: '2px 10px', borderRadius: '20px',
                          border: '1px solid rgba(178,13,48,0.3)'
                        }}>{country}</span>
                      </div>
                    )}
                  </div>

                  {/* Required Admin Authorization Passkey for Admin Sign-Up */}
                  {portalMode === 'admin' && (
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '13px', color: 'var(--brand-crimson)', fontWeight: '700' }}>
                        Admin Authorization Passkey
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Key size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--brand-crimson)' }} />
                        <input
                          type="password"
                          required
                          placeholder="Enter confidential administrator passkey"
                          value={adminPasskey}
                          onChange={e => setAdminPasskey(e.target.value)}
                          style={{ paddingLeft: '44px', borderColor: 'var(--brand-crimson)' }}
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
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '8px', marginTop: '8px', opacity: loading ? 0.7 : 1,
                padding: '15px', fontWeight: '800', letterSpacing: '0.5px',
                fontSize: '14px', borderRadius: '8px',
                background: portalMode === 'admin'
                  ? 'linear-gradient(135deg, #0d1840, #101f55)'
                  : 'var(--brand-crimson)',
                boxShadow: portalMode === 'admin'
                  ? '0 4px 20px rgba(16,31,85,0.5)'
                  : '0 4px 20px rgba(178,13,48,0.45)'
              }}>
                {loading ? 'Authenticating...' : isRegister ? (portalMode === 'admin' ? 'Register Admin Account' : 'Register Participant Account') : (portalMode === 'admin' ? 'Sign In to Admin Dashboard' : 'Sign In')} <ArrowRight size={16} />
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0 12px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
            </div>

            {/* Google OAuth Login Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              style={{
                width: '100%', padding: '13px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '10px', fontSize: '14px', fontWeight: '700',
                background: 'var(--bg-secondary)',
                border: '1.5px solid var(--border-color)',
                borderRadius: '8px', color: 'var(--text-primary)',
                cursor: 'pointer', transition: 'all 0.2s ease',
                boxShadow: 'var(--card-shadow)'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(178,13,48,0.3)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(178,13,48,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'var(--card-shadow)'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>



            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button style={{
                background: 'none', border: 'none',
                color: 'var(--brand-crimson)',
                fontSize: '14px', cursor: 'pointer',
                fontWeight: '700', padding: '4px 8px',
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

      {/* Celebration Modal for Signup and Signin */}
      <CelebrationModal
        isOpen={!!celebrationData?.isOpen}
        onClose={() => {
          const path = celebrationData?.targetPath || '/dashboard';
          setCelebrationData(null);
          navigate(path);
        }}
        type={celebrationData?.type || 'signup'}
        title={celebrationData?.title}
        subtitle={celebrationData?.subtitle}
        details={celebrationData?.details || []}
        primaryBtnText="Enter Dashboard"
        primaryBtnAction={() => {
          const path = celebrationData?.targetPath || '/dashboard';
          setCelebrationData(null);
          navigate(path);
        }}
      />
    </div>
  );
}
