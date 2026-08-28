import React from 'react';
import { Target, Eye, Heart } from 'lucide-react';
import AnimateOnScroll from '../components/AnimateOnScroll';

export default function Mission() {
  return (
    <div className="page-wrapper-lg">
      <AnimateOnScroll animation="fadeUp">
        <section className="page-header">
          <span className="text-label">OUR CORE FOUNDATION</span>
          <h1>Mission &amp; Vision</h1>
          <p>
            Providing a global digital sanctuary that empowers believers to cultivate accountability, depth, and practical execution of the word of God.
          </p>
        </section>
      </AnimateOnScroll>

      <div className="grid-3">
        <AnimateOnScroll animation="fadeUp" delay={0}>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
            <div className="icon-badge-lg" style={{ background: 'rgba(244,63,94,0.1)', color: 'var(--accent-rose)' }}>
              <Target size={26} />
            </div>
            <h2>Our Mission</h2>
            <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.7 }}>
              To build a digital platform that helps believers cultivate a consistent lifestyle of Bible study, prayer, declarations, and practical application of God's Word while fostering a community of spiritual growth and accountability.
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fadeUp" delay={120}>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
            <div className="icon-badge-lg" style={{ background: 'rgba(92, 74, 50, 0.1)', color: 'var(--accent-brown)' }}>
              <Eye size={26} />
            </div>
            <h2>Our Vision</h2>
            <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.7 }}>
              To see a generation of believers anchored in the truth of scripture, living out their faith actively through structured devotion, daily prayer, and bold declarations that impact their families, communities, and nations.
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fadeUp" delay={240}>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
            <div className="icon-badge-lg" style={{ background: 'var(--accent-gold-light)', color: 'var(--accent-gold)' }}>
              <Heart size={26} />
            </div>
            <h2>Our Core Values</h2>
            <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.7 }}>
              Scriptural integrity, daily consistency, practical obedience (being doers of the Word, not hearers only), bold faith proclamation, and mutual accountability within the body of Christ.
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  );
}
