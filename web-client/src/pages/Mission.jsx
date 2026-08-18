import React from 'react';
import { Target, Eye, Heart } from 'lucide-react';

export default function Mission() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', paddingBottom: '40px' }}>
      <section style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '38px', marginBottom: '16px' }}>Mission & Vision</h1>
        <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '18px' }}>
          Providing a global digital sanctuary that empowers believers to cultivate accountability, depth, and practical execution of the word of God.
        </p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: 'rgba(244,63,94,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-rose)'
          }}>
            <Target size={24} />
          </div>
          <h2>Our Mission</h2>
          <p style={{ margin: 0 }}>
            To build a digital platform that helps believers cultivate a consistent lifestyle of Bible study, prayer, declarations, and practical application of God's Word while fostering a community of spiritual growth and accountability.
          </p>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: 'rgba(99,102,241,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-indigo)'
          }}>
            <Eye size={24} />
          </div>
          <h2>Our Vision</h2>
          <p style={{ margin: 0 }}>
            To see a generation of believers anchored in the truth of scripture, living out their faith actively through structured devotion, daily prayer, and bold declarations that impact their families, communities, and nations.
          </p>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: 'rgba(251,191,36,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-gold)'
          }}>
            <Heart size={24} />
          </div>
          <h2>Our Core Values</h2>
          <p style={{ margin: 0 }}>
            Scriptural integrity, daily consistency, practical obedience (being doers of the Word, not hearers only), bold faith proclamation, and mutual accountability within the body of Christ.
          </p>
        </div>
      </div>
    </div>
  );
}
