import React from 'react';
import { Award, Flame, Users, Calendar, BookOpen, ShieldCheck, Heart, ArrowRight, Compass, Sparkles, Target, Zap, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', paddingBottom: '80px' }}>

      {/* Hero Banner Section */}
      <section style={{
        position: 'relative',
        borderRadius: '24px',
        padding: '80px 48px',
        background: 'linear-gradient(135deg, var(--accent-cream) 0%, var(--bg-secondary) 100%)',
        border: '1px solid var(--border-color)',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(184,134,11,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{ maxWidth: '850px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-gold)', letterSpacing: '2.5px', textTransform: 'uppercase' }}>
            OUR MISSION &amp; HERITAGE
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', marginTop: '12px', marginBottom: '20px', lineHeight: 1.1 }}>
            Forming Grounded,<br />Scripture-Steeped Disciples
          </h1>
          <p style={{ fontSize: '18px', lineHeight: 1.8, color: 'var(--text-secondary)', maxWidth: '720px', margin: '0 auto 32px' }}>
            The SLAP Bible Pattern Challenge is a worldwide discipleship initiative designed to cultivate daily spiritual consistency through structured biblical devotion, prophetic confessions, and continuous growth.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/dashboard" className="btn-primary" style={{ padding: '14px 32px', borderRadius: '6px', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase', textDecoration: 'none' }}>
              JOIN THE MOVEMENT →
            </Link>
            <Link to="/contact" className="btn-secondary" style={{ padding: '14px 32px', borderRadius: '6px', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase', textDecoration: 'none' }}>
              PARTNER WITH US
            </Link>
          </div>
        </div>
      </section>

      {/* Pioneer Spotlight Section */}
      <section className="grid-2" style={{ alignItems: 'center', gap: '64px' }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: 'var(--card-shadow-hover)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '100%',
              aspectRatio: '1/1',
              borderRadius: '16px',
              background: 'var(--accent-cream)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              border: '1px solid var(--border-color)'
            }}>
              <img src="/logo-slap.png" alt="SLAP Bible Pattern Emblem" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '24px', margin: '0 0 4px', fontFamily: 'var(--font-display)' }}>David Anibe Daniel</h3>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--accent-gold)', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Pioneer &amp; Visionary Leader
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-gold)', letterSpacing: '2px', textTransform: 'uppercase' }}>
              ABOUT THE PIONEER
            </span>
            <h2 style={{ fontSize: '38px', margin: '8px 0 0', lineHeight: 1.15 }}>Passion for the Word &amp; Prophetic Prayer</h2>
          </div>

          <p style={{ fontSize: '16px', lineHeight: 1.7, margin: 0, color: 'var(--text-secondary)' }}>
            <strong>David Anibe Daniel</strong> is a Physicist by academic training, a Leader, a Software Engineer, and a passionate Evangelist. His heart burns with a singular mission: to see believers deeply grounded in the Word of God, fervently praying scriptures, and confidently speaking prophetic declarations daily.
          </p>

          <p style={{ fontSize: '16px', lineHeight: 1.7, margin: 0, color: 'var(--text-secondary)' }}>
            Recognizing the common struggle many face in maintaining long-term devotional fire, David architected the <strong>SLAP Bible Pattern</strong>—a structured daily methodology built upon four transformative pillars: <em>Striking Verses, Lessons Learnt, Action Plans, and Prayers</em>.
          </p>

          {/* Quote Box */}
          <div style={{
            background: 'var(--accent-cream)',
            borderLeft: '4px solid var(--accent-gold)',
            padding: '20px 24px',
            borderRadius: '0 12px 12px 0',
            marginTop: '8px'
          }}>
            <Quote size={24} style={{ color: 'var(--accent-gold)', marginBottom: '8px' }} />
            <p style={{ fontSize: '15px', fontStyle: 'italic', margin: 0, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', lineHeight: 1.6 }}>
              "My deepest desire is to see a generation of believers who don't just read the Bible passively, but pray scriptures and speak prophetic declarations from the Word of God over their families, cities, and destinies."
            </p>
            <span style={{ display: 'block', marginTop: '10px', fontSize: '12px', fontWeight: '700', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              — David Anibe Daniel
            </span>
          </div>
        </div>
      </section>

      {/* The 4 Pillars Discipleship Framework */}
      <section style={{
        background: 'var(--accent-cream)',
        margin: '0 -24px',
        padding: '80px 24px',
        borderRadius: '32px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px', maxWidth: '650px', margin: '0 auto 56px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-gold)', letterSpacing: '2px', textTransform: 'uppercase' }}>
              THE DEVOTIONAL ENGINE
            </span>
            <h2 style={{ fontSize: '38px', marginTop: '8px' }}>The 4 Pillars of Formation</h2>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', margin: '12px 0 0' }}>
              Every morning quiet time with the SLAP Bible Pattern guides you through four intentional phases:
            </p>
          </div>

          <div className="grid-4">
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '32px 24px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={24} style={{ color: 'var(--accent-gold)' }} />
              </div>
              <div>
                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>PILLAR I</span>
                <h3 style={{ margin: '4px 0 8px', fontSize: '20px' }}>Striking Verses</h3>
              </div>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                Highlighting specific verses that arrested your attention, spoke to your heart, or carried immediate relevance for your day.
              </p>
            </div>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '32px 24px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(92, 74, 50, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={24} style={{ color: 'var(--accent-brown)' }} />
              </div>
              <div>
                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--accent-brown)', textTransform: 'uppercase', letterSpacing: '1px' }}>PILLAR II</span>
                <h3 style={{ margin: '4px 0 8px', fontSize: '20px' }}>Lessons Learnt</h3>
              </div>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                Extracting theological revelations, spiritual principles, and practical wisdom embedded within the passage.
              </p>
            </div>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '32px 24px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(107, 124, 63, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={24} style={{ color: 'var(--accent-olive)' }} />
              </div>
              <div>
                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--accent-olive)', textTransform: 'uppercase', letterSpacing: '1px' }}>PILLAR III</span>
                <h3 style={{ margin: '4px 0 8px', fontSize: '20px' }}>Action Plans</h3>
              </div>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                Translating hearing into doing—setting clear, actionable, and measurable steps to obey the Word daily.
              </p>
            </div>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '32px 24px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(184, 67, 61, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={24} style={{ color: 'var(--accent-rose)' }} />
              </div>
              <div>
                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--accent-rose)', textTransform: 'uppercase', letterSpacing: '1px' }}>PILLAR IV</span>
                <h3 style={{ margin: '4px 0 8px', fontSize: '20px' }}>Prayers</h3>
              </div>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                Praying scripture back to God and releasing prophetic declarations to seal the Word deep into your life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Movement Impact Grid */}
      <section style={{ textAlign: 'center' }}>
        <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-gold)', letterSpacing: '2px', textTransform: 'uppercase' }}>
          GLOBAL MOVEMENT METRICS
        </span>
        <h2 style={{ fontSize: '36px', marginTop: '8px', marginBottom: '40px' }}>Spiritual Impact in Numbers</h2>

        <div className="grid-4">
          <div className="glass-card" style={{ padding: '36px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <Award size={36} style={{ color: 'var(--accent-gold)' }} />
            <h3 style={{ fontSize: '42px', margin: 0, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>4 Pillars</h3>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Structured Blueprint</span>
          </div>

          <div className="glass-card" style={{ padding: '36px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <Flame size={36} style={{ color: 'var(--accent-brown)' }} />
            <h3 style={{ fontSize: '42px', margin: 0, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>10,000+</h3>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Believers</span>
          </div>

          <div className="glass-card" style={{ padding: '36px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <Users size={36} style={{ color: 'var(--accent-olive)' }} />
            <h3 style={{ fontSize: '42px', margin: 0, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>150+</h3>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Nations Reached</span>
          </div>

          <div className="glass-card" style={{ padding: '36px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <Calendar size={36} style={{ color: 'var(--accent-rose)' }} />
            <h3 style={{ fontSize: '42px', margin: 0, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>365 Days</h3>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Daily Consistency</span>
          </div>
        </div>
      </section>

    </div>
  );
}
