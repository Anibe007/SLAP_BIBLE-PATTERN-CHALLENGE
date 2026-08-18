import React from 'react';
import { Award, Flame, Users, Calendar, BookOpen, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '64px', paddingBottom: '60px' }}>

      {/* Hero Header */}
      <section style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-gold)', letterSpacing: '2px', textTransform: 'uppercase' }}>
          OUR MISSION &amp; HERITAGE
        </span>
        <h1 style={{ fontSize: '46px', marginTop: '8px', marginBottom: '16px' }}>About SLAP Bible Challenge</h1>
        <p style={{ fontSize: '18px', lineHeight: 1.8 }}>
          SLAP Bible Challenge is a global discipleship movement dedicated to forming mature, grounded, and fruitful followers of Jesus through daily scripture study, structured reports, confessions, and community accountability.
        </p>
      </section>

      {/* Story Section with Image Grid */}
      <section className="grid-2" style={{ alignItems: 'center', gap: '56px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-gold)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            HOW IT BEGAN
          </span>
          <h2 style={{ fontSize: '36px', margin: 0, lineHeight: 1.2 }}>Building Discipline in the Word of God</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.7, margin: 0 }}>
            The SLAP Bible Challenge was born out of a profound passion to solve a universal struggle: maintaining daily consistency in God's Word. While many believers begin reading plans with zeal, maintaining daily fire requires clear structure, practical action, and spiritual fellowship.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.7, margin: 0 }}>
            By introducing the 4 Pillars framework—<strong>Striking Verses, Lessons Learnt, Action Plans, and Prayers</strong>—we established a daily blueprint that converts passive reading into active, transformed living.
          </p>
          <div>
            <Link to="/dashboard" className="btn-outline-gold" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              START YOUR JOURNEY <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: 'var(--card-shadow-hover)',
            aspectRatio: '4/3'
          }}>
            <img src="/slap-community.png" alt="SLAP Bible Community" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* Core Values / Pillars Cards */}
      <section className="section-warm" style={{ margin: '0 -24px', padding: '64px 24px', borderRadius: '24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-gold)', letterSpacing: '2px', textTransform: 'uppercase' }}>
              THE DISCIPLESHIP FRAMEWORK
            </span>
            <h2 style={{ fontSize: '36px', marginTop: '8px' }}>The 4 Pillars of Formation</h2>
          </div>

          <div className="grid-4">
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={20} style={{ color: 'var(--accent-gold)' }} />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Striking Verses</h3>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6 }}>Highlighting specific scriptures that speak directly into your life circumstances today.</p>
            </div>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={20} style={{ color: 'var(--accent-gold)' }} />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Lessons Learnt</h3>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6 }}>Extracting eternal principles, wisdom, and theological revelations from every chapter.</p>
            </div>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Flame size={20} style={{ color: 'var(--accent-gold)' }} />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Action Plans</h3>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6 }}>Setting clear, practical steps to ensure God's Word actively shapes your daily choices.</p>
            </div>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={20} style={{ color: 'var(--accent-gold)' }} />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Prayers</h3>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6 }}>Sealing the Word in your heart through intimate prayer and dependence on the Spirit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Impact Numbers */}
      <section className="grid-4" style={{ textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '32px 20px' }}>
          <Award size={32} style={{ color: 'var(--accent-gold)', marginBottom: '8px' }} />
          <h3 style={{ fontSize: '36px', margin: 0, fontFamily: 'var(--font-serif)' }}>4 Pillars</h3>
          <p style={{ fontSize: '13px', margin: '4px 0 0', color: 'var(--text-secondary)' }}>Biblical Framework</p>
        </div>
        <div className="glass-card" style={{ padding: '32px 20px' }}>
          <Flame size={32} style={{ color: 'var(--accent-gold)', marginBottom: '8px' }} />
          <h3 style={{ fontSize: '36px', margin: 0, fontFamily: 'var(--font-serif)' }}>10,000+</h3>
          <p style={{ fontSize: '13px', margin: '4px 0 0', color: 'var(--text-secondary)' }}>Active Believers</p>
        </div>
        <div className="glass-card" style={{ padding: '32px 20px' }}>
          <Users size={32} style={{ color: 'var(--accent-gold)', marginBottom: '8px' }} />
          <h3 style={{ fontSize: '36px', margin: 0, fontFamily: 'var(--font-serif)' }}>150+</h3>
          <p style={{ fontSize: '13px', margin: '4px 0 0', color: 'var(--text-secondary)' }}>Nations Reached</p>
        </div>
        <div className="glass-card" style={{ padding: '32px 20px' }}>
          <Calendar size={32} style={{ color: 'var(--accent-gold)', marginBottom: '8px' }} />
          <h3 style={{ fontSize: '36px', margin: 0, fontFamily: 'var(--font-serif)' }}>365 Days</h3>
          <p style={{ fontSize: '13px', margin: '4px 0 0', color: 'var(--text-secondary)' }}>Daily Devotion</p>
        </div>
      </section>
    </div>
  );
}
