import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ArrowLeft, BookOpen, Flame, ShieldCheck, ShieldAlert, Eye, EyeOff, Globe, Key, UserCheck, Shield, Search, Check, CheckCircle, ChevronDown, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimateOnScroll from '../components/AnimateOnScroll';
import CelebrationModal from '../components/CelebrationModal';

// Complete & Comprehensive Canonical List of all Nations & Territories of the World
const ALL_WORLD_COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
  "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
  "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
  "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada",
  "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
  "Congo (Republic of)", "Congo (DRC)", "Costa Rica", "Croatia", "Cuba", "Cyprus",
  "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
  "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia",
  "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
  "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India",
  "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast (Côte d'Ivoire)",
  "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait",
  "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
  "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Madagascar", "Malawi",
  "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro",
  "Morocco", "Mozambique", "Myanmar (Burma)", "Namibia", "Nauru", "Nepal",
  "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea",
  "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama",
  "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Puerto Rico", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
  "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
  "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
  "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan",
  "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania",
  "Thailand", "Timor-Leste (East Timor)", "Togo", "Tonga", "Trinidad and Tobago",
  "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
  "United Arab Emirates", "United Kingdom", "United States", "Uruguay",
  "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen",
  "Zambia", "Zimbabwe", "Other"
];

// Helper to match countries including common abbreviations/aliases
function matchCountry(countryName, searchTerm) {
  if (!searchTerm || !searchTerm.trim()) return true;
  const term = searchTerm.trim().toLowerCase();
  const c = countryName.toLowerCase();

  if (c.includes(term)) return true;

  // Aliases & Popular Abbreviations
  if ((term === 'usa' || term === 'us' || term === 'america' || term === 'u.s.' || term === 'u.s.a.') && c.includes('united states')) return true;
  if ((term === 'uk' || term === 'gb' || term === 'britain' || term === 'england' || term === 'scotland' || term === 'wales' || term === 'u.k.') && c.includes('united kingdom')) return true;
  if ((term === 'uae' || term === 'dubai' || term === 'abu dhabi' || term === 'u.a.e.') && c.includes('united arab emirates')) return true;
  if ((term === 'drc' || term === 'dr congo' || term === 'democratic congo' || term === 'kinshasa') && c.includes('congo (drc)')) return true;
  if ((term === 'roc' || term === 'congo brazzaville' || term === 'brazzaville') && c.includes('congo (republic of)')) return true;
  if (term === 'korea' && (c.includes('south korea') || c.includes('north korea'))) return true;
  if (term === 'holland' && c.includes('netherlands')) return true;
  if ((term === 'burma' || term === 'myanmar') && c.includes('myanmar')) return true;
  if ((term === 'cote' || term === "côte" || term === 'ivory' || term === "cote d'ivoire") && c.includes('ivory coast')) return true;
  if (term === 'timor' && c.includes('timor')) return true;
  if (term === 'cape verde' && c.includes('cabo verde')) return true;
  if (term === 'vatican' && c.includes('vatican')) return true;
  if (term.startsWith('st ') && c.startsWith('saint ')) {
    if (c.includes(term.slice(3))) return true;
  }

  return false;
}


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
  const countryPickerRef = useRef(null);

  // Close country dropdown on outside click or tap
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryPickerRef.current && !countryPickerRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const filteredCountries = ALL_WORLD_COUNTRIES.filter(c => matchCountry(c, countrySearch));
  const [adminPasskey, setAdminPasskey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [celebrationData, setCelebrationData] = useState(null);

  // Forgot Password / Password Reset State
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [demoUserFound, setDemoUserFound] = useState(null);

  const { login, register, loginAdmin, registerAdmin, requestPasswordReset, updateUserPassword, resetLocalUserPassword, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect already-authenticated users away from /auth (unless resetting password)
  useEffect(() => {
    if (isAuthenticated && !isUpdatingPassword) {
      const from = location.state?.from;
      // Disallow non-admins from being redirected to /admin
      const target = (from && (from !== '/admin' || isAdmin)) ? from : (isAdmin ? '/admin' : '/dashboard');
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate, location.state, isUpdatingPassword]);

  useEffect(() => {
    const portalParam = searchParams.get('portal') || searchParams.get('role');
    if (portalParam === 'admin') {
      setPortalMode('admin');
    }
    const modeParam = searchParams.get('mode') || searchParams.get('type');
    if (modeParam === 'update-password' || modeParam === 'recovery' || modeParam === 'reset') {
      setIsUpdatingPassword(true);
    }
  }, [searchParams]);

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResetSuccessMessage('');
    setResetLoading(true);

    try {
      const targetEmail = resetEmail || email;
      const res = await requestPasswordReset(targetEmail);
      setResetSuccessMessage(res.message);
      if (res.user) {
        setDemoUserFound(res.user);
      }
    } catch (err) {
      setError(err.message || 'Failed to initiate password reset. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleUpdatePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResetSuccessMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setResetLoading(true);
    try {
      if (demoUserFound) {
        await resetLocalUserPassword(demoUserFound.email, newPassword);
      } else {
        await updateUserPassword(newPassword);
      }
      setResetSuccessMessage('Your password has been successfully reset! You can now sign in with your new password.');
      setTimeout(() => {
        setIsUpdatingPassword(false);
        setIsForgotPassword(false);
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setDemoUserFound(null);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let submitEmail = (email || '').trim();
      if (portalMode === 'admin' && (submitEmail.toLowerCase() === 'admin' || !submitEmail.includes('@'))) {
        submitEmail = 'slapbiblechallenge@gmail.com';
      }

      if (portalMode === 'admin') {
        if (isRegister) {
          await registerAdmin(submitEmail, password, fullName, country, adminPasskey);
          setLoading(false);
          setCelebrationData({
            isOpen: true,
            type: 'signup',
            title: `🎉 Congratulations & Welcome, ${fullName || 'Administrator'}!`,
            subtitle: `Your Super Administrator account has been successfully created with full platform oversight controls.`,
            details: [
              { label: '📧 Admin Email', value: submitEmail },
              { label: '🛡️ Role', value: 'Super Administrator' },
              { label: '🌍 Nation', value: country || 'Global' }
            ],
            targetPath: '/admin'
          });
        } else {
          const loggedAdmin = await loginAdmin(submitEmail, password);
          setLoading(false);
          setCelebrationData({
            isOpen: true,
            type: 'signin',
            title: `🎉 Welcome Back, ${loggedAdmin?.user_metadata?.full_name || loggedAdmin?.fullName || 'Administrator'}!`,
            subtitle: `Successfully authenticated into the SLAP Administrator Portal.`,
            details: [
              { label: '📧 Admin Account', value: submitEmail },
              { label: '🛡️ Access Level', value: 'Full Super-Admin Controls' }
            ],
            targetPath: '/admin'
          });
        }
      } else {
        if (isRegister) {
          await register(submitEmail, password, fullName, country);
          setLoading(false);
          setCelebrationData({
            isOpen: true,
            type: 'signup',
            title: `🎉 Congratulations & Welcome, ${fullName || 'Believer'}!`,
            subtitle: `You have successfully joined the global SLAP Bible Challenge family! Ready to build consistency in the Word?`,
            details: [
              { label: '📧 Member Email', value: submitEmail },
              { label: '🌍 Nation', value: country || 'Global' },
              { label: '🔥 Initial Goal', value: 'Start Day 1 Devotion' }
            ],
            targetPath: location.state?.from || '/dashboard'
          });
        } else {
          const loggedUser = await login(submitEmail, password);
          setLoading(false);
          setCelebrationData({
            isOpen: true,
            type: 'signin',
            title: `🎉 Welcome Back, ${loggedUser?.user_metadata?.full_name || loggedUser?.fullName || 'Believer'}!`,
            subtitle: `Authentication successful! Let's continue your daily scripture devotion and keep your streak burning.`,
            details: [
              { label: '📧 Account', value: submitEmail },
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
            <img src="/SLAP LOGO-Picsart-AiImageEnhancer.jpeg" alt="SLAP Bible" style={{ width: '72px', height: '72px', borderRadius: '12px', objectFit: 'contain', border: '2px solid rgba(178,13,48,0.4)', boxShadow: '0 0 24px rgba(178,13,48,0.25)', marginBottom: '4px' }} onError={e => e.target.style.display = 'none'} />

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
            {isForgotPassword ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setError('');
                    setResetSuccessMessage('');
                    setDemoUserFound(null);
                  }}
                  style={{
                    alignSelf: 'flex-start',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    padding: '4px 0'
                  }}
                >
                  <ArrowLeft size={16} /> Back to Sign In
                </button>

                <div className="text-center">
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: 'rgba(178, 13, 48, 0.12)',
                    border: '1px solid rgba(178, 13, 48, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    color: 'var(--brand-crimson)'
                  }}>
                    <Lock size={24} />
                  </div>
                  <h2 style={{ fontSize: '24px', color: 'var(--text-primary)', margin: '0 0 6px' }}>
                    Reset Your Password
                  </h2>
                  <p style={{ fontSize: '13px', margin: 0, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Enter the email address registered with your SLAP account. We'll send you instructions to reset your password.
                  </p>
                </div>

                {error && (
                  <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{error}</span>
                  </div>
                )}

                {resetSuccessMessage && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    background: 'rgba(46, 160, 67, 0.12)',
                    border: '1px solid rgba(46, 160, 67, 0.35)',
                    color: '#3fb950',
                    padding: '14px 16px',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <CheckCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>{resetSuccessMessage}</div>
                    </div>
                    {demoUserFound && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(false);
                          setIsUpdatingPassword(true);
                          setError('');
                          setResetSuccessMessage('');
                        }}
                        style={{
                          background: 'var(--brand-crimson)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '10px 14px',
                          fontSize: '13px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        Set New Password Now <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                )}

                <form onSubmit={handleForgotPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '13px' }}>Registered Email Address</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-secondary)' }} />
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={resetEmail || email}
                        onChange={e => {
                          setResetEmail(e.target.value);
                          setEmail(e.target.value);
                        }}
                        style={{ paddingLeft: '44px' }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={resetLoading}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '8px', padding: '14px', fontWeight: '800', letterSpacing: '0.5px',
                      fontSize: '14px', borderRadius: '8px',
                      background: 'var(--brand-crimson)',
                      boxShadow: '0 4px 20px rgba(178,13,48,0.45)',
                      opacity: resetLoading ? 0.7 : 1
                    }}
                  >
                    {resetLoading ? 'Sending Instructions...' : 'Send Password Reset Link'} <ArrowRight size={16} />
                  </button>
                </form>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setError('');
                      setResetSuccessMessage('');
                      setDemoUserFound(null);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      fontSize: '13px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Remembered your password? <span style={{ color: 'var(--brand-crimson)', fontWeight: '700' }}>Sign In</span>
                  </button>
                </div>
              </div>
            ) : isUpdatingPassword ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsUpdatingPassword(false);
                    setError('');
                    setResetSuccessMessage('');
                  }}
                  style={{
                    alignSelf: 'flex-start',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    padding: '4px 0'
                  }}
                >
                  <ArrowLeft size={16} /> Back to Sign In
                </button>

                <div className="text-center">
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: 'rgba(212, 160, 23, 0.15)',
                    border: '1px solid rgba(212, 160, 23, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    color: 'var(--accent-gold)'
                  }}>
                    <Key size={24} />
                  </div>
                  <h2 style={{ fontSize: '24px', color: 'var(--text-primary)', margin: '0 0 6px' }}>
                    Create New Password
                  </h2>
                  <p style={{ fontSize: '13px', margin: 0, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Enter your new secure password below to regain access to your account.
                  </p>
                </div>

                {error && (
                  <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{error}</span>
                  </div>
                )}

                {resetSuccessMessage && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(46, 160, 67, 0.12)',
                    border: '1px solid rgba(46, 160, 67, 0.35)',
                    color: '#3fb950',
                    padding: '14px 16px',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}>
                    <CheckCircle size={18} style={{ flexShrink: 0 }} />
                    <div>{resetSuccessMessage}</div>
                  </div>
                )}

                <form onSubmit={handleUpdatePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '13px' }}>New Password</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-secondary)' }} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="At least 6 characters"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
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

                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '13px' }}>Confirm New Password</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-secondary)' }} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        style={{ paddingLeft: '44px', paddingRight: '44px' }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={resetLoading}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '8px', padding: '14px', fontWeight: '800', letterSpacing: '0.5px',
                      fontSize: '14px', borderRadius: '8px',
                      background: 'var(--brand-crimson)',
                      boxShadow: '0 4px 20px rgba(178,13,48,0.45)',
                      opacity: resetLoading ? 0.7 : 1
                    }}
                  >
                    {resetLoading ? 'Updating Password...' : 'Save New Password'} <ArrowRight size={16} />
                  </button>
                </form>
              </div>
            ) : (
              <>
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

                      <div className="form-group" style={{ margin: 0 }} ref={countryPickerRef}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
                            Nationality / Country of Residence <span style={{ color: 'var(--brand-crimson)' }}>*</span>
                          </label>
                          {country && (
                            <span style={{
                              fontSize: '11px',
                              fontWeight: '700',
                              color: 'var(--accent-gold)',
                              background: 'rgba(212, 160, 23, 0.12)',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              border: '1px solid rgba(212, 160, 23, 0.3)'
                            }}>
                              Selected: {country}
                            </span>
                          )}
                        </div>

                        <div style={{ position: 'relative' }}>
                          {/* Left Globe/Search Icon */}
                          <Globe
                            size={17}
                            style={{
                              position: 'absolute',
                              left: '14px',
                              top: '15px',
                              color: showCountryDropdown ? 'var(--brand-crimson)' : 'var(--text-secondary)',
                              zIndex: 2,
                              pointerEvents: 'none',
                              transition: 'color 0.2s ease'
                            }}
                          />

                          {/* Interactive Search Input */}
                          <input
                            type="text"
                            aria-label="Country or Nationality"
                            placeholder={country ? `Selected: ${country} (Type to search...)` : "Search your country..."}
                            value={countrySearch}
                            onChange={e => {
                              setCountrySearch(e.target.value);
                              if (!showCountryDropdown) setShowCountryDropdown(true);
                            }}
                            onFocus={() => setShowCountryDropdown(true)}
                            onClick={() => setShowCountryDropdown(true)}
                            style={{
                              paddingLeft: '44px',
                              paddingRight: countrySearch ? '66px' : '38px',
                              cursor: 'text',
                              background: 'var(--bg-secondary)',
                              borderColor: showCountryDropdown ? 'var(--brand-crimson)' : undefined,
                              boxShadow: showCountryDropdown ? '0 0 0 3px rgba(178, 13, 48, 0.15)' : undefined
                            }}
                            autoComplete="off"
                          />

                          {/* Right icons: Clear button + Dropdown Chevron */}
                          <div style={{
                            position: 'absolute',
                            right: '10px',
                            top: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            zIndex: 2
                          }}>
                            {countrySearch && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCountrySearch('');
                                }}
                                title="Clear search"
                                style={{
                                  background: 'rgba(178, 13, 48, 0.12)',
                                  border: 'none',
                                  borderRadius: '50%',
                                  width: '22px',
                                  height: '22px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  color: 'var(--brand-crimson)',
                                  padding: 0
                                }}
                              >
                                <X size={12} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowCountryDropdown(prev => !prev);
                              }}
                              aria-label="Toggle country list"
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px',
                                color: 'var(--text-secondary)',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <ChevronDown
                                size={16}
                                style={{
                                  transform: showCountryDropdown ? 'rotate(180deg)' : 'none',
                                  transition: 'transform 0.2s ease',
                                  color: showCountryDropdown ? 'var(--brand-crimson)' : 'var(--text-secondary)'
                                }}
                              />
                            </button>
                          </div>

                          {/* Dropdown Menu */}
                          {showCountryDropdown && (
                            <div className="country-dropdown-menu">
                              {/* Dropdown header counter */}
                              <div style={{
                                padding: '8px 14px',
                                fontSize: '11px',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                color: 'var(--text-secondary)',
                                background: 'var(--bg-tertiary)',
                                borderBottom: '1px solid var(--border-color)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                position: 'sticky',
                                top: 0,
                                zIndex: 3
                              }}>
                                <span>
                                  {countrySearch
                                    ? `Matching Nations (${filteredCountries.length})`
                                    : `All Nations of the World (${ALL_WORLD_COUNTRIES.length})`}
                                </span>
                                {countrySearch && (
                                  <button
                                    type="button"
                                    onClick={() => setCountrySearch('')}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: 'var(--brand-crimson)',
                                      cursor: 'pointer',
                                      fontSize: '11px',
                                      fontWeight: '600',
                                      padding: 0
                                    }}
                                  >
                                    Show All
                                  </button>
                                )}
                              </div>

                              {/* Country list items */}
                              {filteredCountries.length === 0 ? (
                                <div style={{ padding: '20px 16px', textAlign: 'center' }}>
                                  <p style={{ margin: '0 0 10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                    No nation found matching "<strong>{countrySearch}</strong>"
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => setCountrySearch('')}
                                    className="btn btn-secondary"
                                    style={{
                                      fontSize: '12px',
                                      padding: '6px 14px',
                                      borderRadius: '8px'
                                    }}
                                  >
                                    Show all {ALL_WORLD_COUNTRIES.length} nations
                                  </button>
                                </div>
                              ) : (
                                filteredCountries.map(c => {
                                  const isSelected = c === country;
                                  return (
                                    <div
                                      key={c}
                                      role="button"
                                      tabIndex={0}
                                      className={`country-option-item ${isSelected ? 'selected' : ''}`}
                                      onClick={() => {
                                        setCountry(c);
                                        setCountrySearch('');
                                        setShowCountryDropdown(false);
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                          e.preventDefault();
                                          setCountry(c);
                                          setCountrySearch('');
                                          setShowCountryDropdown(false);
                                        }
                                      }}
                                    >
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Globe
                                          size={15}
                                          style={{
                                            color: isSelected ? 'var(--brand-crimson)' : 'var(--text-secondary)',
                                            flexShrink: 0
                                          }}
                                        />
                                        <span style={{ color: isSelected ? 'var(--brand-crimson)' : 'var(--text-primary)' }}>
                                          {c}
                                        </span>
                                      </div>
                                      {isSelected && (
                                        <span style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                          fontSize: '11px',
                                          fontWeight: '700',
                                          color: 'var(--brand-crimson)',
                                          background: 'rgba(178, 13, 48, 0.12)',
                                          padding: '2px 8px',
                                          borderRadius: '10px'
                                        }}>
                                          <Check size={12} strokeWidth={3} /> Selected
                                        </span>
                                      )}
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </div>
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
                    <label style={{ fontSize: '13px' }}>
                      {portalMode === 'admin' ? "Admin Email or Username" : "Email Address"}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-secondary)' }} />
                      <input
                        type={portalMode === 'admin' ? "text" : "email"}
                        required
                        placeholder={portalMode === 'admin' ? "slapbiblechallenge@gmail.com (or admin)" : "you@example.com"}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={{ paddingLeft: '44px' }}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label style={{ fontSize: '13px', margin: 0 }}>Password</label>
                      {!isRegister && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsForgotPassword(true);
                            setError('');
                            setResetSuccessMessage('');
                            setResetEmail(email);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--brand-crimson)',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            padding: 0
                          }}
                          onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                          onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
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

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
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
              </>
            )}
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
