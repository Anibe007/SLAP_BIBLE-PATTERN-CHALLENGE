import React, { useState } from 'react';
import { HeartHandshake, CheckCircle } from 'lucide-react';

export default function Partner() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', type: 'financial', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', paddingBottom: '40px' }}>
      <section style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '38px', marginBottom: '16px' }}>Partner Together</h1>
        <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '18px' }}>
          Help us expand our reach and build more resources for believers globally.
        </p>
      </section>

      <div className="grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2>Why Partner with Us?</h2>
          <p>
            The SLAP Bible Challenge is committed to keeping its study tools and community features free for believers everywhere. Your partnership allows us to:
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={18} style={{ color: 'var(--accent-rose)' }} /> Upgrade cloud server and database structures.
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={18} style={{ color: 'var(--accent-rose)' }} /> Support translate modules for multiple languages.
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={18} style={{ color: 'var(--accent-rose)' }} /> Develop local groups and publish physical journals.
            </li>
          </ul>
          <p>
            Whether through financial partnership, content creation, or volunteer coordination, your involvement makes a tangible difference.
          </p>
        </div>

        <div className="glass-card">
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <HeartHandshake size={64} style={{ color: 'var(--accent-rose)' }} />
              <h2>Thank You for Partnering!</h2>
              <p style={{ maxWidth: '300px' }}>Our coordination team will contact you shortly with next steps.</p>
              <button className="btn-secondary" onClick={() => setSubmitted(false)}>Submit Another Inquiry</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3>Partnership Application</h3>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                />
              </div>
              <div className="form-group">
                <label>Partnership Type</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="financial">Financial Sponsor</option>
                  <option value="volunteer">Volunteer Facilitator</option>
                  <option value="content">Content Creator (Devotionals/Videos)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Message/Inquiry</label>
                <textarea
                  rows="4"
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How would you like to support the challenge?"
                ></textarea>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Send Message</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
