import React, { useState, useEffect } from 'react';
import { Award, Flame, Users, Calendar, BookOpen, ShieldCheck, Heart, Target, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimateOnScroll from '../components/AnimateOnScroll';
import CountUp from '../components/CountUp';
import { dbService } from '../services/db';

export default function About() {
  const [stats, setStats] = useState({ activeBelievers: 0, nationsReached: 0, totalReports: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await dbService.getGlobalStats();
        setStats(data);
      } catch (err) {
        console.error('Error loading stats:', err);
      }
    };
    loadStats();
    const handleStatsUpdated = () => loadStats();
    const handleStorage = (e) => { if (e.key === 'slap_users' || e.key === 'slap_reports') loadStats(); };
    window.addEventListener('slap_stats_updated', handleStatsUpdated);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('slap_stats_updated', handleStatsUpdated);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return (
    <div className="page-wrapper-lg">

      {/* Hero Banner Section */}
      <AnimateOnScroll animation="scaleIn">
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
            <span className="text-label">
              OUR MISSION &amp; HERITAGE
            </span>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', marginTop: '12px', marginBottom: '20px', lineHeight: 1.1 }}>
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
      </AnimateOnScroll>

      {/* Pioneer Spotlight Section */}
      <section className="grid-2" style={{ alignItems: 'center', gap: '48px' }}>
        <AnimateOnScroll animation="fadeLeft">
          <div style={{ position: 'relative' }}>
            <div className="glass-card" style={{ padding: '28px', textAlign: 'center' }}>
              {/* Portrait Photo */}
              <div style={{
                width: '100%',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '3px solid var(--accent-gold)',
                boxShadow: '0 20px 60px rgba(184,134,11,0.25)',
                aspectRatio: '3/4',
                background: 'var(--accent-cream)',
              }}>
                <img
                  src="/david-anibe.jpg"
                  alt="David Anibe Daniel – Pioneer & Visionary Leader"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                />
              </div>

              {/* Name Badge */}
              <div style={{
                marginTop: '20px',
                padding: '16px',
                background: 'var(--accent-gold-light)',
                borderRadius: '12px',
                border: '1px solid rgba(184,134,11,0.2)'
              }}>
                <h3 style={{ fontSize: '22px', margin: '0 0 4px', fontFamily: 'var(--font-display)' }}>David Anibe Daniel</h3>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--accent-gold)', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  Pioneer &amp; Visionary Leader
                </p>
              </div>
            </div>

            {/* Decorative accent dot */}
            <div style={{
              position: 'absolute',
              top: '-16px',
              right: '-16px',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'var(--accent-gold)',
              opacity: 0.15,
              zIndex: 0
            }} />
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fadeRight" delay={200}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span className="text-label">
                ABOUT THE PIONEER
              </span>
              <h2 style={{ fontSize: '36px', margin: '8px 0 0', lineHeight: 1.15 }}>Passion for the Word &amp; Prophetic Prayer</h2>
            </div>

            <p style={{ fontSize: '16px', lineHeight: 1.7, margin: 0, color: 'var(--text-secondary)' }}>
              <strong>David Anibe Daniel</strong> is a Physicist by academic training, a Leader, a Software Engineer, and a passionate Evangelist. His heart burns with a singular mission: to see believers deeply grounded in the Word of God, fervently praying scriptures, and confidently speaking prophetic declarations daily.
            </p>

            <p style={{ fontSize: '16px', lineHeight: 1.7, margin: 0, color: 'var(--text-secondary)' }}>
              Recognizing the common struggle many face in maintaining long-term devotional fire, David architected the <strong>SLAP Bible Pattern</strong>—a structured daily methodology built upon four transformative pillars: <em>Striking Verses, Lessons Learnt, Action Plans, and Prayers</em>.
            </p>

            {/* Quote Box */}
            <div className="quote-box">
              <Quote size={24} style={{ color: 'var(--accent-gold)', marginBottom: '8px' }} />
              <p>
                "My deepest desire is to see a generation of believers who don't just read the Bible passively, but pray scriptures and speak prophetic declarations from the Word of God over their families, cities, and destinies."
              </p>
              <span style={{ display: 'block', marginTop: '10px', fontSize: '12px', fontWeight: '700', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                — David Anibe Daniel
              </span>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* The 4 Pillars Discipleship Framework */}
      <section style={{
        background: 'var(--accent-cream)',
        margin: '0 -24px',
        padding: '80px 24px',
        borderRadius: '32px'
      }}>
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
          <AnimateOnScroll animation="fadeUp">
            <div style={{ textAlign: 'center', marginBottom: '56px', maxWidth: '650px', margin: '0 auto 56px' }}>
              <span className="text-label">
                THE DEVOTIONAL ENGINE
              </span>
              <h2 style={{ fontSize: '38px', marginTop: '8px' }}>The 4 Pillars of Formation</h2>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', margin: '12px 0 0' }}>
                Every morning quiet time with the SLAP Bible Pattern guides you through four intentional phases:
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid-4">
            {[
              { icon: <BookOpen size={24} style={{ color: 'var(--accent-gold)' }} />, bg: 'var(--accent-gold-light)', label: 'PILLAR I', labelColor: 'var(--accent-gold)', title: 'Striking Verses', desc: 'Highlighting specific verses that arrested your attention, spoke to your heart, or carried immediate relevance for your day.' },
              { icon: <ShieldCheck size={24} style={{ color: 'var(--accent-brown)' }} />, bg: 'rgba(92, 74, 50, 0.1)', label: 'PILLAR II', labelColor: 'var(--accent-brown)', title: 'Lessons Learnt', desc: 'Extracting theological revelations, spiritual principles, and practical wisdom embedded within the passage.' },
              { icon: <Target size={24} style={{ color: 'var(--accent-olive)' }} />, bg: 'rgba(107, 124, 63, 0.1)', label: 'PILLAR III', labelColor: 'var(--accent-olive)', title: 'Action Plans', desc: 'Translating hearing into doing—setting clear, actionable, and measurable steps to obey the Word daily.' },
              { icon: <Heart size={24} style={{ color: 'var(--accent-rose)' }} />, bg: 'rgba(184, 67, 61, 0.1)', label: 'PILLAR IV', labelColor: 'var(--accent-rose)', title: 'Prayers', desc: 'Praying scripture back to God and releasing prophetic declarations to seal the Word deep into your life.' },
            ].map((p, i) => (
              <AnimateOnScroll key={i} animation="fadeUp" delay={i * 120}>
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '32px 24px', height: '100%' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {p.icon}
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: p.labelColor, textTransform: 'uppercase', letterSpacing: '1px' }}>{p.label}</span>
                    <h3 style={{ margin: '4px 0 8px', fontSize: '20px' }}>{p.title}</h3>
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                    {p.desc}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="section-divider">✦</div>

      {/* Global Movement Impact Grid */}
      <section style={{ textAlign: 'center' }}>
        <AnimateOnScroll animation="fadeUp">
          <span className="text-label">
            GLOBAL MOVEMENT METRICS
          </span>
          <h2 style={{ fontSize: '36px', marginTop: '8px', marginBottom: '40px' }}>Spiritual Impact in Numbers</h2>
        </AnimateOnScroll>

        <div className="grid-4">
          {[
            { icon: <Award size={36} style={{ color: 'var(--accent-gold)' }} />, number: 4, suffix: ' Pillars', label: 'Structured Blueprint' },
            { icon: <Flame size={36} style={{ color: 'var(--accent-brown)' }} />, number: stats.activeBelievers, suffix: '', label: 'Believers Registered' },
            { icon: <Users size={36} style={{ color: 'var(--accent-olive)' }} />, number: stats.nationsReached, suffix: '', label: 'Nations Represented' },
            { icon: <Calendar size={36} style={{ color: 'var(--accent-rose)' }} />, number: stats.totalReports, suffix: '', label: 'SLAP Reports' },
          ].map((s, i) => (
            <AnimateOnScroll key={i} animation="fadeUp" delay={i * 120}>
              <div className="glass-card" style={{ padding: '36px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                {s.icon}
                <CountUp
                  end={s.number}
                  suffix={s.suffix}
                  duration={2000}
                  style={{ fontSize: '42px', margin: 0, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', fontWeight: '700' }}
                />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</span>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

    </div>
  );
}
