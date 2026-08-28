import React from 'react';
import { BookOpen, Users, BellRing, Sparkles } from 'lucide-react';
import AnimateOnScroll from '../components/AnimateOnScroll';

export default function GetInvolved() {
  return (
    <div className="page-wrapper-lg">
      <AnimateOnScroll animation="fadeUp">
        <section className="page-header">
          <span className="text-label">COMMUNITY ACTION</span>
          <h1>Get Involved</h1>
          <p>
            Discover how you can participate in the SLAP challenge, join groups, and grow with other believers.
          </p>
        </section>
      </AnimateOnScroll>

      <div className="grid-auto-sm">
        <AnimateOnScroll animation="fadeUp" delay={0}>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
            <div className="icon-badge-lg" style={{ background: 'rgba(184, 67, 61, 0.1)', color: 'var(--accent-rose)' }}>
              <BookOpen size={26} />
            </div>
            <h3>1. Start a Bible Reading Plan</h3>
            <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.7 }}>
              Choose from a library of structured plans: read the Gospels in 30 days, the New Testament in 90 days, or the entire Bible in a year using the daily SLAP report.
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fadeUp" delay={100}>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
            <div className="icon-badge-lg" style={{ background: 'rgba(92, 74, 50, 0.1)', color: 'var(--accent-brown)' }}>
              <Users size={26} />
            </div>
            <h3>2. Join a Study Circle</h3>
            <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.7 }}>
              Connect with local or virtual SLAP accountability groups. Share your daily reports, discuss lessons, and pray for one another.
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fadeUp" delay={200}>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
            <div className="icon-badge-lg" style={{ background: 'var(--accent-gold-light)', color: 'var(--accent-gold)' }}>
              <BellRing size={26} />
            </div>
            <h3>3. Share Your Testimony</h3>
            <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.7 }}>
              Has your lifestyle changed since starting the SLAP challenge? Share your story to encourage and inspire others.
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fadeUp" delay={300}>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
            <div className="icon-badge-lg" style={{ background: 'rgba(107, 124, 63, 0.1)', color: 'var(--accent-olive)' }}>
              <Sparkles size={26} />
            </div>
            <h3>4. Become a Leader</h3>
            <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.7 }}>
              Open a study group in your church, school, or community. We will provide resources, discussion guides, and training.
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  );
}
