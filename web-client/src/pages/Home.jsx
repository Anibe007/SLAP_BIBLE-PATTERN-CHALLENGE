import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Flame, ShieldCheck, Share2, Award, Users, TrendingUp, Heart, Layers, Zap, ArrowRight, Calendar, ChevronLeft, ChevronRight, Sparkles, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/db';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { getDeclarationByOffset } from '../services/dailyDeclarations';
import AnimateOnScroll from '../components/AnimateOnScroll';
import CountUp from '../components/CountUp';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const [stats, setStats] = useState({ activeBelievers: 0, totalParticipants: 0, nationsReached: 0, totalReports: 0 });
  const [dailyOffset, setDailyOffset] = useState(0);
  const [declarantName, setDeclarantName] = useState(() => {
    return localStorage.getItem('slap_declarant_name') || '';
  });

  // Pre-fill user's name if logged in and not already set
  useEffect(() => {
    if (user && !declarantName) {
      const uName = user.fullName || user.user_metadata?.full_name || '';
      if (uName) {
        setDeclarantName(uName);
        localStorage.setItem('slap_declarant_name', uName);
      }
    }
  }, [user]);

  const dailyDecl = getDeclarationByOffset(dailyOffset, declarantName);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        const data = await dbService.getGlobalStats();
        if (isMounted && data) {
          setStats(data);
        }
      } catch (err) {
        console.error("Error loading stats:", err);
      }
    };

    // Initial load
    loadStats();

    // Re-fetch when another tab updates localStorage (cross-tab)
    const handleStorage = (e) => {
      if (e.key === 'slap_users' || e.key === 'slap_reports') {
        loadStats();
      }
    };

    // Re-fetch on same-tab registration/report events
    const handleStatsUpdated = () => loadStats();

    window.addEventListener('storage', handleStorage);
    window.addEventListener('slap_stats_updated', handleStatsUpdated);

    // Periodic heartbeat sync every 4 seconds to guarantee live updates
    const interval = setInterval(loadStats, 4000);

    // Real-time Supabase subscription on profiles and slap_reports
    let subscription = null;
    if (isSupabaseConfigured && supabase) {
      const channel = supabase.channel('realtime_home_stats')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
          loadStats();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'slap_reports' }, () => {
          loadStats();
        })
        .subscribe();
      subscription = channel;
    }

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('slap_stats_updated', handleStatsUpdated);
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, []);

  return (
    <div>

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION — Full-width with image background
          ═══════════════════════════════════════════════════════════ */}
      <section className="hero-section">
        <img src="/home-hero-bible.jpg" alt="Open Bible with Divine Light" className="hero-bg" />
        <div className="hero-overlay" />

        {/* Floating animated orbs */}
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        <div className="hero-content">
          {/* Left Column: Headline, Description & CTAs */}
          <div className="hero-text slide-down">
            {/* Tagline Badge - Commented out as requested
            <div className="hero-tagline-badge">
              <span className="hero-pulse-dot" />
              <span>Global Discipleship Movement</span>
            </div>
            */}
            <h1>
              Build People.<br />
              Build Faith.<br />
              Build on Christ.
            </h1>
            <p>
              SLAP Bible Challenge creates daily devotional journeys for believers
              — biblically rooted habits that help form mature, grounded and fruitful
              followers of Jesus.
            </p>
            <div className="hero-cta-group">
              <Link
                to={isAuthenticated ? '/dashboard' : '/auth'}
                className="btn-outline-gold"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', color: '#101F55', border: '2px solid white', fontWeight: '800' }}
              >
                START SLAP <ArrowRight size={14} />
              </Link>
              <Link
                to="/declare"
                className="btn-outline-gold hero-ispeak-btn"
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderColor: 'rgba(255,255,255,0.7)',
                  color: 'white',
                  fontWeight: '700',
                  textTransform: 'none',
                  letterSpacing: '1px'
                }}
              >
                <span style={{ textTransform: 'none' }}>i</span>SPEAK &amp; <span style={{ textTransform: 'none' }}>i</span>DECLARE <ArrowRight size={14} />
              </Link>
            </div>

            {/* Quick Trust Highlights below buttons */}
            <div className="hero-trust-row">
              <div className="hero-trust-item">
                <Flame size={15} style={{ color: '#f87171' }} />
                <span>Daily Accountability</span>
              </div>
              <div className="hero-trust-divider" />
              <div className="hero-trust-item">
                <Users size={15} style={{ color: '#60a5fa' }} />
                <span>30+ Nations Active</span>
              </div>
              <div className="hero-trust-divider" />
              <div className="hero-trust-item">
                <ShieldCheck size={15} style={{ color: '#4ade80' }} />
                <span>100% Free Forever</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Today's Devotional Spotlight & Live SLAP Hub */}
          <div className="hero-showcase slide-up">
            {/* Floating Top Accent Badge */}
            <div className="hero-floating-badge top-right">
              <Flame size={13} style={{ color: '#f87171' }} />
              <span>Live Habit Formation</span>
            </div>

            <div className="hero-spotlight-card">
              {/* Card Header */}
              <div className="hero-card-header">
                <div className="hero-card-badge">
                  <span className="live-dot" />
                  <span>TODAY'S DEVOTIONAL SPOTLIGHT</span>
                </div>
                <span className="hero-card-date">
                  <Calendar size={12} />
                  {dailyDecl.dateString || 'Today'}
                </span>
              </div>

              {/* Devotional Theme */}
              <div className="hero-devotional-theme">
                <Sparkles size={14} style={{ color: 'var(--brand-crimson)' }} />
                <span>{dailyDecl.theme || 'Living Faith & Bold Declarations'}</span>
              </div>

              {/* Striking Scripture Quote Preview */}
              <div className="hero-scripture-box">
                <div className="quote-mark">“</div>
                <p className="hero-scripture-text">
                  {dailyDecl.text || "Your word is a lamp to my feet and a light to my path."}
                </p>
                <div className="hero-scripture-ref">
                  — {dailyDecl.ref || "Psalm 119:105"}
                </div>
              </div>

              {/* 4 Pillars Interactive Tour */}
              <div className="hero-pillars-container">
                <div className="hero-pillars-label">THE 4 PILLARS OF DAILY DEVOTION</div>
                <div className="hero-pillars-grid">
                  <div className="hero-pillar-item">
                    <span className="pillar-letter" style={{ color: '#eab308', background: 'rgba(234, 179, 8, 0.15)' }}>S</span>
                    <div className="pillar-info">
                      <div className="pillar-name">Striking Verses</div>
                      <div className="pillar-desc">Personal Revelation</div>
                    </div>
                  </div>
                  <div className="hero-pillar-item">
                    <span className="pillar-letter" style={{ color: '#60a5fa', background: 'rgba(96, 165, 250, 0.15)' }}>L</span>
                    <div className="pillar-info">
                      <div className="pillar-name">Lessons Learnt</div>
                      <div className="pillar-desc">Biblical Truths</div>
                    </div>
                  </div>
                  <div className="hero-pillar-item">
                    <span className="pillar-letter" style={{ color: '#4ade80', background: 'rgba(74, 222, 128, 0.15)' }}>A</span>
                    <div className="pillar-info">
                      <div className="pillar-name">Action Plans</div>
                      <div className="pillar-desc">Practical Works</div>
                    </div>
                  </div>
                  <div className="hero-pillar-item">
                    <span className="pillar-letter" style={{ color: '#f43f5e', background: 'rgba(244, 63, 94, 0.15)' }}>P</span>
                    <div className="pillar-info">
                      <div className="pillar-name">Daily Prayers</div>
                      <div className="pillar-desc">Spiritual Sealing</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="hero-card-actions">
                <Link
                  to={isAuthenticated ? '/dashboard' : '/auth'}
                  className="hero-action-primary"
                >
                  <BookOpen size={14} /> Open Study Journal <ArrowRight size={13} />
                </Link>
                <Link
                  to="/singing-bible"
                  className="hero-action-secondary"
                >
                  🎵 Singing Bible
                </Link>
              </div>
            </div>

            {/* Floating Bottom Accent Badge */}
            <div className="hero-floating-badge bottom-left">
              <Zap size={13} style={{ color: '#eab308' }} />
              <span>4 Pillars • 15 Mins Daily Habit</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PROGRAM CARDS — MOG/WOG style
          ═══════════════════════════════════════════════════════════ */}
      <section style={{ background: 'var(--accent-cream)' }}>
        <div className="program-cards">
          {/* Card 1: SLAP Daily */}
          <AnimateOnScroll animation="fadeUp" delay={0}>
            <div className="program-card dark">
              <img src="/home-daily-study.jpg" alt="SLAP Daily Devotion" />
              <div className="program-card-overlay" />
              <div className="program-card-content">
                <h3 style={{ fontFamily: 'var(--font-display)', letterSpacing: '1px' }}>SLAP DAILY</h3>
                <div className="card-subtitle" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  DAILY DEVOTIONAL PATTERN
                </div>
                <p>
                  A discipleship program for believers who want to grow in
                  faith, leadership, and spiritual character.
                </p>
                <Link to={isAuthenticated ? '/dashboard' : '/auth'} className="card-link">
                  LEARN MORE ABOUT SLAP <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Card 2: iSPEAK & iDECLARE */}
          <AnimateOnScroll animation="fadeUp" delay={150}>
            <div className="program-card dark ispeak-card">
              <img src="/home-ispeak-ideclare.jpg" alt="iSPEAK & iDECLARE" />
              <div className="program-card-overlay" />
              <div className="program-card-content ispeak-card-content">
                <h3 className="ispeak-card-title">
                  iSPEAK &amp; iDECLARE
                </h3>
                <div className="card-subtitle ispeak-card-subtitle">
                  SCRIPTURE DECLARATIONS
                </div>
                <p className="ispeak-card-desc">
                  A declaration program for believers who want to live out
                  their God-given identity, strength, and purpose.
                </p>
                <Link to="/declare" className="card-link ispeak-card-link">
                  <span>LEARN MORE ABOUT <span style={{ textTransform: 'none' }}>i</span>SPEAK &amp; <span style={{ textTransform: 'none' }}>i</span>DECLARE</span>
                  <ArrowRight size={13} style={{ flexShrink: 0 }} />
                </Link>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Card 3: SLAP Journal */}
          <AnimateOnScroll animation="fadeUp" delay={300}>
            <div className="program-card dark">
              <img src="/home-slap-journal.jpg" alt="SLAP Journal" />
              <div className="program-card-overlay" />
              <div className="program-card-content">
                <h3 style={{ fontFamily: 'var(--font-display)', letterSpacing: '1px' }}>SLAP JOURNAL</h3>
                <div className="card-subtitle" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  4 PILLARS OF DAILY DEVOTION
                </div>
                <p>
                  A practical and challenging journal for members who want to grow in
                  character, discipline, leadership, and biblical maturity.
                </p>
                <Link to={isAuthenticated ? '/dashboard' : '/auth'} className="card-link">
                  LEARN MORE ABOUT JOURNAL <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURE STRIP — Icon bar
          ═══════════════════════════════════════════════════════════ */}
      <section className="feature-strip">
        <div className="feature-strip-inner">
          <AnimateOnScroll as="div" className="feature-strip-item" animation="fadeUp" delay={0}>
            <BookOpen size={24} className="icon" style={{ color: 'var(--accent-gold)' }} />
            <h4>Biblical Foundation</h4>
            <p>All teaching is built on the Word of God and the foundation of the Christian faith.</p>
          </AnimateOnScroll>
          <AnimateOnScroll as="div" className="feature-strip-item" animation="fadeUp" delay={100}>
            <Layers size={24} className="icon" style={{ color: 'var(--accent-gold)' }} />
            <h4>4 Pillars</h4>
            <p>A structured SLAP method designed for steady growth, formation, and spiritual maturity.</p>
          </AnimateOnScroll>
          <AnimateOnScroll as="div" className="feature-strip-item" animation="fadeUp" delay={200}>
            <Zap size={24} className="icon" style={{ color: 'var(--accent-gold)' }} />
            <h4>Plug &amp; Play</h4>
            <p>Includes Dashboard, Declaration Canvas, Video Library, and streak tracking tools.</p>
          </AnimateOnScroll>
          <AnimateOnScroll as="div" className="feature-strip-item" animation="fadeUp" delay={300}>
            <Heart size={24} className="icon" style={{ color: 'var(--accent-gold)' }} />
            <h4>For Everyone</h4>
            <p>Devotional journeys designed for men and women to grow in their God-given calling.</p>
          </AnimateOnScroll>
          <AnimateOnScroll as="div" className="feature-strip-item" animation="fadeUp" delay={400} style={{ background: 'var(--accent-cream)' }}>
            <h4 style={{ fontSize: '18px', fontStyle: 'normal', fontFamily: 'var(--font-serif)' }}>Bring this to your church</h4>
            <p>Explore the SLAP Bible Challenge for your church community and help your congregation grow rooted in Scripture.</p>
            <Link
              to="/contact"
              className="btn-outline-gold"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'fit-content', padding: '8px 20px', marginTop: '4px' }}
            >
              CONTACT NOW <ArrowRight size={12} />
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SLAP METHOD — 4 Pillars
          ═══════════════════════════════════════════════════════════ */}
      <section className="section-default">
        <div className="section-container text-center">
          <AnimateOnScroll animation="fadeUp">
            <h2 style={{ fontSize: '36px', marginBottom: '12px' }}>The SLAP Bible Study Method</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto 48px', fontSize: '17px' }}>
              SLAP is a structured approach to daily devotions designed to help you not just read the Bible, but <em>live it</em> daily.
            </p>
          </AnimateOnScroll>

          <div className="grid-4">
            {[
              { letter: 'S', label: 'Striking Verses', color: 'var(--accent-gold-light)', textColor: 'var(--accent-gold)', desc: 'Highlight the specific verses that stood out, arrested your attention, or spoke directly to your situation.' },
              { letter: 'L', label: 'Lessons Learnt', color: 'rgba(92, 74, 50, 0.08)', textColor: 'var(--accent-brown)', desc: 'Meditate on the chapter and extract the theological truths, revelations, and practical wisdom conveyed.' },
              { letter: 'A', label: 'Action Plans', color: 'rgba(107, 124, 63, 0.1)', textColor: 'var(--accent-olive)', desc: 'Convert the word into works. Define specific steps to apply these lessons in your daily life.' },
              { letter: 'P', label: 'Prayers', color: 'rgba(184, 67, 61, 0.08)', textColor: 'var(--accent-rose)', desc: 'Intercede and communicate. Write a prayer sealing the Word in your heart and asking for grace.' }
            ].map((item, i) => (
              <AnimateOnScroll key={item.letter} animation="fadeUp" delay={i * 120}>
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left', height: '100%' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    background: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.textColor,
                    fontWeight: '900',
                    fontSize: '26px',
                    fontFamily: 'var(--font-serif)',
                    flexShrink: 0
                  }}>{item.letter}</div>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{item.label}</h3>
                  <p style={{ fontSize: '14px', margin: 0, lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="section-divider">✦</div>

      {/* ═══════════════════════════════════════════════════════════
          SPEAK & DECLARE — Feature Section
          ═══════════════════════════════════════════════════════════ */}
      <section className="section-warm">
        <div className="section-container">
          <div className="grid-2" style={{ alignItems: 'center', gap: '64px' }}>
            <AnimateOnScroll animation="fadeLeft">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '38px', lineHeight: '1.15', margin: 0 }}>
                  Speak the Word,<br />Declare Your Victory
                </h2>
                <p style={{ margin: 0, fontSize: '16px' }}>
                  With the integrated <strong>iSPEAK &amp; iDECLARE</strong> card builder, customize daily confessions,
                  choose beautiful backgrounds, and export your declarations as shareable visual cards.
                </p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', margin: 0, padding: 0 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px' }}>
                    <ShieldCheck size={20} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
                    Custom design canvas with 7 premium themes
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px' }}>
                    <Share2 size={20} style={{ color: 'var(--accent-brown)', flexShrink: 0 }} />
                    Instant image export &amp; social share support
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px' }}>
                    <BookOpen size={20} style={{ color: 'var(--accent-olive)', flexShrink: 0 }} />
                    Save history of all your daily declarations to review anytime
                  </li>
                </ul>
                <div>
                  <Link
                    to="/declare"
                    state={{
                      text: dailyDecl.text,
                      ref: dailyDecl.ref,
                      theme: dailyDecl.theme,
                      name: declarantName
                    }}
                    className="btn-outline-gold"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    CREATE AN <span style={{ textTransform: 'none' }}>i</span>SPEAK &amp; <span style={{ textTransform: 'none' }}>i</span>DECLARE CARD <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Decorative Preview Card — Changes Daily & Unique per Name */}
            <AnimateOnScroll animation="fadeRight" delay={200}>
              <div style={{
                position: 'relative',
                borderRadius: '20px',
                minHeight: '430px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--card-shadow)',
                overflow: 'hidden',
                padding: '36px 20px'
              }}>
                <img
                  src="/home-ispeak-ideclare.jpg"
                  alt="iSpeak & iDeclare Scripture"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(16, 31, 85, 0.45) 0%, rgba(10, 17, 50, 0.65) 100%)'
                }} />
                <div className="float" style={{
                  position: 'relative',
                  zIndex: 2,
                  background: 'rgba(255, 255, 255, 0.96)',
                  backdropFilter: 'blur(14px)',
                  padding: '24px 22px',
                  borderRadius: '18px',
                  width: '100%',
                  maxWidth: '330px',
                  border: '1px solid rgba(255,255,255,0.7)',
                  textAlign: 'center',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                  transform: 'rotate(-1.5deg)',
                  transition: 'all 0.3s ease'
                }}>
                  {/* Daily Date Badge & Navigator */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '800',
                      color: 'var(--brand-crimson)',
                      textTransform: 'uppercase',
                      letterSpacing: '1.2px',
                      background: 'rgba(178,13,48,0.08)',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <Calendar size={11} />
                      {dailyOffset === 0 ? `Today • ${dailyDecl.dateString}` : dailyDecl.dateString}
                    </span>

                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setDailyOffset(prev => prev - 1)}
                        title="Previous Daily Scripture"
                        style={{
                          background: 'rgba(16,31,85,0.07)',
                          border: 'none',
                          borderRadius: '6px',
                          width: '26px',
                          height: '26px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: '#101F55',
                          transition: 'background 0.2s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,31,85,0.15)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(16,31,85,0.07)'}
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDailyOffset(prev => prev + 1)}
                        title="Next Daily Scripture"
                        style={{
                          background: 'rgba(16,31,85,0.07)',
                          border: 'none',
                          borderRadius: '6px',
                          width: '26px',
                          height: '26px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: '#101F55',
                          transition: 'background 0.2s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,31,85,0.15)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(16,31,85,0.07)'}
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Header Title & Theme */}
                  <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '2px' }}>
                    DAILY SCRIPTURE PROCLAMATION
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#101F55', marginBottom: '8px' }}>
                    {dailyDecl.theme}
                  </div>

                  {/* Declarant Name Input for Unique Quotes per Name */}
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'rgba(16, 31, 85, 0.04)',
                      border: '1px solid rgba(16, 31, 85, 0.12)',
                      borderRadius: '8px',
                      padding: '4px 8px',
                      gap: '6px'
                    }}>
                      <User size={13} style={{ color: 'var(--brand-crimson)', flexShrink: 0 }} />
                      <input
                        type="text"
                        value={declarantName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDeclarantName(val);
                          localStorage.setItem('slap_declarant_name', val);
                        }}
                        placeholder="Your name for personal quote..."
                        style={{
                          border: 'none',
                          outline: 'none',
                          background: 'transparent',
                          fontSize: '11px',
                          color: '#101F55',
                          width: '100%',
                          fontWeight: '600'
                        }}
                      />
                      {declarantName && (
                        <button
                          type="button"
                          onClick={() => {
                            setDeclarantName('');
                            localStorage.removeItem('slap_declarant_name');
                          }}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            fontSize: '13px',
                            lineHeight: 1,
                            padding: '0 2px'
                          }}
                          title="Reset to general quote"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '3px', textAlign: 'left', paddingLeft: '2px' }}>
                      {declarantName.trim()
                        ? `✨ Unique daily scripture for ${declarantName.trim()}`
                        : '💡 Enter name for a personalized daily quote'}
                    </div>
                  </div>

                  {/* Scripture Declaration text */}
                  <p style={{
                    margin: '6px 0 10px',
                    fontSize: '14px',
                    fontStyle: 'italic',
                    color: '#101F55',
                    lineHeight: 1.6,
                    fontFamily: 'var(--font-serif)',
                    minHeight: '75px'
                  }}>
                    “<strong style={{ fontStyle: 'normal', fontWeight: '800', color: 'var(--brand-crimson)', marginRight: '6px', fontFamily: 'var(--font-sans)', letterSpacing: '0.3px' }}>iSPEAK &amp; iDECLARE:</strong>{dailyDecl.text}”
                  </p>

                  {/* Scripture Reference & Declarant */}
                  <div style={{ borderTop: '1px solid rgba(16,31,85,0.12)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--brand-crimson)' }}>
                      — {dailyDecl.ref}
                    </span>
                    {declarantName.trim() && (
                      <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                        Declarant: {declarantName.trim()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          COMMUNITY STATS — Animated CountUp
          ═══════════════════════════════════════════════════════════ */}
      <section className="section-white">
        <div className="section-container text-center">
          <AnimateOnScroll animation="fadeUp">
            {/* Live badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(34,197,94,0.12)',
                border: '1px solid rgba(34,197,94,0.35)',
                color: '#16a34a',
                fontSize: '11px',
                fontWeight: '800',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                padding: '4px 12px',
                borderRadius: '999px',
              }}>
                <span style={{
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: '#22c55e',
                  display: 'inline-block',
                  animation: 'wa-pulse 1.8s ease-in-out infinite'
                }} />
                Live Data
              </span>
            </div>
            <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>Trusted by Believers Worldwide</h2>
            <p style={{ marginBottom: '48px', maxWidth: '500px', margin: '0 auto 48px' }}>
              Numbers update in real time as participants register and submit their SLAP reports.
            </p>
          </AnimateOnScroll>
          <div className="grid-4">
            {[
              { icon: <Users size={32} style={{ color: 'var(--accent-gold)' }} />, number: stats.activeBelievers, suffix: '', label: 'Believers Registered' },
              { icon: <Flame size={32} style={{ color: 'var(--accent-brown)' }} />, number: stats.totalReports, suffix: '', label: 'SLAP Reports' },
              { icon: <TrendingUp size={32} style={{ color: 'var(--accent-olive)' }} />, number: stats.nationsReached, suffix: '', label: 'Nations Represented' },
              { icon: <Award size={32} style={{ color: 'var(--accent-rose)' }} />, number: 4, suffix: '', label: 'Core Pillars' },
            ].map((s, i) => (
              <AnimateOnScroll key={i} animation="fadeUp" delay={i * 120}>
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '32px 20px' }}>
                  {s.icon}
                  <CountUp
                    end={s.number}
                    suffix={s.suffix}
                    duration={1800}
                    style={{ fontSize: '36px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1, fontFamily: 'var(--font-serif)' }}
                  />
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500' }}>{s.label}</span>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          COMMUNITY IMAGE + TEXT
          ═══════════════════════════════════════════════════════════ */}
      <section className="section-warm">
        <div className="section-container">
          <div className="grid-2" style={{ alignItems: 'center', gap: '64px' }}>
            <AnimateOnScroll animation="fadeLeft">
              <div style={{
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: 'var(--card-shadow)',
                aspectRatio: '4/3'
              }}>
                <img
                  src="/home-community-reading.jpg"
                  alt="Devotional Bible Study"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 75%', display: 'block' }}
                />
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll animation="fadeRight" delay={200}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '36px', margin: 0, lineHeight: 1.15 }}>
                  Join a Global<br />Community of Faith
                </h2>
                <p style={{ margin: 0, fontSize: '16px' }}>
                  Connect with thousands of believers across the globe who are committed to daily Scripture study.
                  Track your streaks, share declarations, and grow together in accountability and love.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Link
                    to={isAuthenticated ? '/dashboard' : '/auth'}
                    className="btn-outline-gold"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    JOIN THE CHALLENGE <ArrowRight size={14} />
                  </Link>
                  <Link
                    to="/about"
                    style={{
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      border: '2px solid var(--text-primary)',
                      color: 'var(--text-primary)',
                      padding: '12px 28px',
                      borderRadius: '4px',
                      fontWeight: '700',
                      fontSize: '12px',
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    LEARN MORE <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FINAL CTA BANNER
          ═══════════════════════════════════════════════════════════ */}
      <AnimateOnScroll animation="fadeUp">
        <section className="cta-banner" style={{ position: 'relative' }}>
          <img
            src="/home-daily-study.jpg"
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.14,
              pointerEvents: 'none'
            }}
          />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2>Begin Your Journey Today</h2>
            <p>
              Join thousands of believers building a daily habit of God's Word.
              It starts with a single SLAP report.
            </p>
            <Link
              to={isAuthenticated ? '/dashboard' : '/auth'}
              style={{
                background: 'white',
                color: '#101F55',
                fontWeight: '800',
                fontSize: '12px',
                padding: '14px 32px',
                borderRadius: '4px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              {isAuthenticated ? 'GO TO DASHBOARD' : 'CREATE FREE ACCOUNT'} <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </AnimateOnScroll>
    </div>
  );
}
