import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Flame, Compass, HeartHandshake, ShieldCheck, Share2, Video, Award, Users, TrendingUp, Heart, Layers, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div>

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION — Full-width with image background
          ═══════════════════════════════════════════════════════════ */}
      <section className="hero-section">
        <img src="/hero-bg.png" alt="" className="hero-bg" />
        <div className="hero-overlay" />

        <div className="hero-content">
          {/* Left: Text */}
          <div className="hero-text slide-down">
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
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', color: '#1a1409', border: '2px solid white' }}
              >
                START SLAP <ArrowRight size={14} />
              </Link>
              <Link
                to="/declare"
                className="btn-outline-gold"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}
              >
                SEE <span style={{ textTransform: 'none' }}>i</span>SPEAK &amp; <span style={{ textTransform: 'none' }}>i</span>DECLARE <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right: Product Card */}
          <div className="hero-product-card fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="subtitle">SLAP BIBLE PATTERN</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontStyle: 'normal', color: '#1a1409', fontSize: '26px', letterSpacing: '1px', marginBottom: '8px' }}>SLAP JOURNAL</h3>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--accent-gold)', marginBottom: '14px' }}>THE 4 PILLARS OF DAILY DEVOTION</div>
            <p style={{ fontSize: '14px', color: '#6b5d4d', lineHeight: 1.7 }}>
              A practical and challenging journal for members who want to strengthen their
              character, build discipline, and walk in their calling through the 4 pillars of SLAP:
              Striking Verses, Lessons Learnt, Action Plans, and Prayers.
            </p>
            <Link
              to={isAuthenticated ? '/dashboard' : '/auth'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--accent-gold)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '12px',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginTop: '12px',
                transition: 'all 0.2s ease'
              }}
            >
              ACCESS JOURNAL <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PROGRAM CARDS — MOG/WOG style
          ═══════════════════════════════════════════════════════════ */}
      <section style={{ background: 'var(--accent-cream)' }}>
        <div className="program-cards">
          {/* Card 1: SLAP Daily */}
          <div className="program-card dark">
            <img src="/slap-men.png" alt="SLAP Daily Devotion" />
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

          {/* Card 2: iSPEAK & iDECLARE */}
          <div className="program-card dark">
            <img src="/slap-women.png" alt="iSPEAK & iDECLARE" />
            <div className="program-card-overlay" />
            <div className="program-card-content">
              <h3 style={{ fontFamily: 'var(--font-display)', letterSpacing: '1px' }}>
                <span style={{ textTransform: 'none', fontFamily: 'var(--font-sans)', fontWeight: '700' }}>i</span>SPEAK & <span style={{ textTransform: 'none', fontFamily: 'var(--font-sans)', fontWeight: '700' }}>i</span>DECLARE
              </h3>
              <div className="card-subtitle" style={{ color: 'rgba(255,255,255,0.7)' }}>
                SCRIPTURE DECLARATIONS
              </div>
              <p>
                A declaration program for believers who want to live out
                their God-given identity, strength, and purpose.
              </p>
              <Link to="/declare" className="card-link">
                LEARN MORE ABOUT <span style={{ textTransform: 'none' }}>i</span>SPEAK &amp; <span style={{ textTransform: 'none' }}>i</span>DECLARE <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Card 3: SLAP Journal */}
          <div className="program-card dark">
            <img src="/slap-journal.png" alt="SLAP Journal" />
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
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURE STRIP — Icon bar
          ═══════════════════════════════════════════════════════════ */}
      <section className="feature-strip">
        <div className="feature-strip-inner">
          <div className="feature-strip-item">
            <BookOpen size={24} className="icon" style={{ color: 'var(--accent-gold)' }} />
            <h4>Biblical Foundation</h4>
            <p>All teaching is built on the Word of God and the foundation of the Christian faith.</p>
          </div>
          <div className="feature-strip-item">
            <Layers size={24} className="icon" style={{ color: 'var(--accent-gold)' }} />
            <h4>4 Pillars</h4>
            <p>A structured SLAP method designed for steady growth, formation, and spiritual maturity.</p>
          </div>
          <div className="feature-strip-item">
            <Zap size={24} className="icon" style={{ color: 'var(--accent-gold)' }} />
            <h4>Plug & Play</h4>
            <p>Includes Dashboard, Declaration Canvas, Video Library, and streak tracking tools.</p>
          </div>
          <div className="feature-strip-item">
            <Heart size={24} className="icon" style={{ color: 'var(--accent-gold)' }} />
            <h4>For Everyone</h4>
            <p>Devotional journeys designed for men and women to grow in their God-given calling.</p>
          </div>
          <div className="feature-strip-item" style={{ background: 'var(--accent-cream)' }}>
            <h4 style={{ fontSize: '18px', fontStyle: 'normal', fontFamily: 'var(--font-serif)' }}>Bring this to your church</h4>
            <p>Explore the SLAP Bible Challenge for your church community and help your congregation grow rooted in Scripture.</p>
            <Link
              to="/contact"
              className="btn-outline-gold"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'fit-content', padding: '8px 20px', marginTop: '4px' }}
            >
              CONTACT NOW <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SLAP METHOD — 4 Pillars
          ═══════════════════════════════════════════════════════════ */}
      <section className="section-default">
        <div className="section-container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', marginBottom: '12px' }}>The SLAP Bible Study Method</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 48px', fontSize: '17px' }}>
            SLAP is a structured approach to daily devotions designed to help you not just read the Bible, but <em>live it</em> daily.
          </p>

          <div className="grid-4">
            {[
              { letter: 'S', label: 'Striking Verses', color: 'var(--accent-gold-light)', textColor: 'var(--accent-gold)', desc: 'Highlight the specific verses that stood out, arrested your attention, or spoke directly to your situation.' },
              { letter: 'L', label: 'Lessons Learnt', color: 'rgba(92, 74, 50, 0.08)', textColor: 'var(--accent-brown)', desc: 'Meditate on the chapter and extract the theological truths, revelations, and practical wisdom conveyed.' },
              { letter: 'A', label: 'Action Plans', color: 'rgba(107, 124, 63, 0.1)', textColor: 'var(--accent-olive)', desc: 'Convert the word into works. Define specific steps to apply these lessons in your daily life.' },
              { letter: 'P', label: 'Prayers', color: 'rgba(184, 67, 61, 0.08)', textColor: 'var(--accent-rose)', desc: 'Intercede and communicate. Write a prayer sealing the Word in your heart and asking for grace.' }
            ].map(item => (
              <div key={item.letter} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
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
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SPEAK & DECLARE — Feature Section
          ═══════════════════════════════════════════════════════════ */}
      <section className="section-warm">
        <div className="section-container">
          <div className="grid-2" style={{ alignItems: 'center', gap: '64px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '38px', lineHeight: '1.15', margin: 0 }}>
                Speak the Word,<br />Declare Your Victory
              </h2>
              <p style={{ margin: 0, fontSize: '16px' }}>
                With the integrated <strong>iSPEAK & iDECLARE</strong> card builder, customize daily confessions,
                choose beautiful backgrounds, and export your declarations as shareable visual cards.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', margin: 0, padding: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px' }}>
                  <ShieldCheck size={20} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
                  Custom design canvas with 4 premium gradient themes
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px' }}>
                  <Share2 size={20} style={{ color: 'var(--accent-brown)', flexShrink: 0 }} />
                  Auto-generates a QR Code for others to join your declaration
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px' }}>
                  <BookOpen size={20} style={{ color: 'var(--accent-olive)', flexShrink: 0 }} />
                  Save history of all your daily declarations to review anytime
                </li>
              </ul>
              <div>
                <Link to="/declare" className="btn-outline-gold" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  CREATE AN <span style={{ textTransform: 'none' }}>i</span>SPEAK &amp; <span style={{ textTransform: 'none' }}>i</span>DECLARE CARD <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Decorative Preview Card */}
            <div style={{
              background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-warm))',
              borderRadius: '20px',
              minHeight: '380px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--card-shadow)',
              position: 'relative',
              overflow: 'hidden',
              padding: '40px'
            }}>
              <div className="float" style={{
                background: 'var(--bg-secondary)',
                padding: '32px',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '300px',
                border: '1px solid var(--border-color)',
                textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                transform: 'rotate(-2deg)'
              }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                  I SPEAK & I DECLARE
                </span>
                <p style={{ margin: '16px 0', fontSize: '16px', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.7, fontFamily: 'var(--font-serif)' }}>
                  "The steps of my life are ordered by the Lord. I am always at the right place at the right time."
                </p>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  — Psalm 37:23
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          COMMUNITY STATS
          ═══════════════════════════════════════════════════════════ */}
      <section className="section-white">
        <div className="section-container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>Trusted by Believers Worldwide</h2>
          <p style={{ marginBottom: '48px', maxWidth: '500px', margin: '0 auto 48px' }}>
            A growing global community building daily habits in God's Word.
          </p>
          <div className="grid-4">
            {[
              { icon: <Users size={32} style={{ color: 'var(--accent-gold)' }} />, number: '10,000+', label: 'Believers Joined' },
              { icon: <Flame size={32} style={{ color: 'var(--accent-brown)' }} />, number: '250,000+', label: 'SLAP Reports' },
              { icon: <TrendingUp size={32} style={{ color: 'var(--accent-olive)' }} />, number: '150+', label: 'Countries Active' },
              { icon: <Award size={32} style={{ color: 'var(--accent-rose)' }} />, number: '4', label: 'Core Pillars' },
            ].map((s, i) => (
              <div key={i} className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '32px 20px' }}>
                {s.icon}
                <span style={{ fontSize: '36px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1, fontFamily: 'var(--font-serif)' }}>{s.number}</span>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500' }}>{s.label}</span>
              </div>
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
            <div style={{
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: 'var(--card-shadow)',
              aspectRatio: '4/3'
            }}>
              <img src="/slap-community.png" alt="SLAP Bible Community" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
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
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FINAL CTA BANNER
          ═══════════════════════════════════════════════════════════ */}
      <section className="cta-banner">
        <h2>Begin Your Journey Today</h2>
        <p>
          Join thousands of believers building a daily habit of God's Word.
          It starts with a single SLAP report.
        </p>
        <Link
          to={isAuthenticated ? '/dashboard' : '/auth'}
          style={{
            background: 'white',
            color: '#b8860b',
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
          onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
          onMouseLeave={e => { e.target.style.transform = ''; e.target.style.boxShadow = ''; }}
        >
          {isAuthenticated ? 'GO TO DASHBOARD' : 'CREATE FREE ACCOUNT'} <ArrowRight size={14} />
        </Link>
      </section>
    </div>
  );
}
