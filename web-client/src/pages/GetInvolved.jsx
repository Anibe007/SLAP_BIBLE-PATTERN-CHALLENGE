import React from 'react';
import { BookOpen, Users, BellRing, Sparkles } from 'lucide-react';

export default function GetInvolved() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', paddingBottom: '40px' }}>
      <section style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '38px', marginBottom: '16px' }}>Get Involved</h1>
        <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '18px' }}>
          Discover how you can participate in the SLAP challenge, join groups, and grow with other believers.
        </p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <BookOpen size={36} style={{ color: 'var(--accent-rose)' }} />
          <h3>1. Start a Bible Reading Plan</h3>
          <p style={{ margin: 0, fontSize: '14px' }}>
            Choose from a library of structured plans: read the Gospels in 30 days, the New Testament in 90 days, or the entire Bible in a year using the daily SLAP report.
          </p>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Users size={36} style={{ color: 'var(--accent-indigo)' }} />
          <h3>2. Join a Study Circle</h3>
          <p style={{ margin: 0, fontSize: '14px' }}>
            Connect with local or virtual SLAP accountability groups. Share your daily reports, discuss lessons, and pray for one another.
          </p>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <BellRing size={36} style={{ color: 'var(--accent-gold)' }} />
          <h3>3. Share Your Testimony</h3>
          <p style={{ margin: 0, fontSize: '14px' }}>
            Has your lifestyle changed since starting the SLAP challenge? Share your story to encourage and inspire others.
          </p>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Sparkles size={36} style={{ color: '#10b981' }} />
          <h3>4. Become a Leader</h3>
          <p style={{ margin: 0, fontSize: '14px' }}>
            Open a study group in your church, school, or community. We will provide resources, discussion guides, and training.
          </p>
        </div>
      </div>
    </div>
  );
}
