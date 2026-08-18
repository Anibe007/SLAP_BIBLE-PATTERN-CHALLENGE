import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '64px', paddingBottom: '60px' }}>

      {/* Header */}
      <section style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto' }}>
        <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-gold)', letterSpacing: '2px', textTransform: 'uppercase' }}>
          WE WOULD LOVE TO HEAR FROM YOU
        </span>
        <h1 style={{ fontSize: '46px', marginTop: '8px', marginBottom: '16px' }}>Get in Touch</h1>
        <p style={{ fontSize: '18px', lineHeight: 1.8 }}>
          Have questions about bringing SLAP Bible Challenge to your church, partnering with us, or need support? Our team is here to help.
        </p>
      </section>

      {/* Contact Cards Strip */}
      <div className="grid-3">
        <div className="glass-card" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', padding: '28px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Mail size={22} style={{ color: 'var(--accent-gold)' }} />
          </div>
          <div>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>EMAIL US</span>
            <h3 style={{ margin: '4px 0 6px', fontSize: '18px' }}>Direct Support</h3>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>support@slapbible.com</p>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Response within 24 hours</p>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', padding: '28px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Phone size={22} style={{ color: 'var(--accent-gold)' }} />
          </div>
          <div>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>CALL US</span>
            <h3 style={{ margin: '4px 0 6px', fontSize: '18px' }}>Ministry Enquiries</h3>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)', fontWeight: '700' }}>08155180000</p>
            <p style={{ margin: '2px 0 0', fontSize: '14px', color: 'var(--text-primary)', fontWeight: '700' }}>08100900094</p>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', padding: '28px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <MapPin size={22} style={{ color: 'var(--accent-gold)' }} />
          </div>
          <div>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>VISIT US</span>
            <h3 style={{ margin: '4px 0 6px', fontSize: '18px' }}>Headquarters</h3>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>100 Faith Parkway</p>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Austin, TX 78701</p>
          </div>
        </div>
      </div>

      {/* Form & FAQ Grid */}
      <div className="grid-2" style={{ alignItems: 'flex-start', gap: '48px' }}>

        {/* Left: Contact Form */}
        <div className="glass-card" style={{ padding: '36px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={36} style={{ color: 'var(--accent-gold)' }} />
              </div>
              <h2 style={{ fontSize: '28px', margin: 0 }}>Message Received</h2>
              <p style={{ maxWidth: '360px', margin: 0, fontSize: '15px' }}>
                Thank you for reaching out. A representative from our ministry team will review your message and respond within 24 hours.
              </p>
              <button className="btn-secondary" onClick={() => setSubmitted(false)} style={{ marginTop: '12px' }}>
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-gold)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  SEND A MESSAGE
                </span>
                <h2 style={{ fontSize: '28px', margin: '4px 0 0' }}>How Can We Help You?</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label>Inquiry Topic</label>
                <select
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Church Partnership">Bring SLAP to My Church</option>
                  <option value="Technical Support">App &amp; Dashboard Support</option>
                  <option value="Product Orders">Journal &amp; Resource Orders</option>
                  <option value="Media & Speaking">Media &amp; Press Inquiry</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label>Your Message *</label>
                <textarea
                  rows="5"
                  required
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details about your request or inquiry..."
                ></textarea>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                SEND MESSAGE <Send size={16} />
              </button>
            </form>
          )}
        </div>

        {/* Right: Church & Community Info Block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <div style={{
            background: 'var(--accent-cream)',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            padding: '36px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-gold)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              FOR PASTORS &amp; CHURCH LEADERS
            </span>
            <h3 style={{ fontSize: '26px', margin: 0, lineHeight: 1.2 }}>Bring SLAP Bible Challenge to Your Church</h3>
            <p style={{ fontSize: '15px', lineHeight: 1.7, margin: 0, color: 'var(--text-secondary)' }}>
              Looking to ignite daily Scripture engagement across your congregation or small group ministry? We offer turnkey leader guides, custom reading tracks, and bulk study materials.
            </p>
            <div style={{ paddingTop: '8px' }}>
              <button
                className="btn-outline-gold"
                onClick={() => setFormData({ ...formData, subject: 'Church Partnership' })}
                style={{ width: 'auto' }}
              >
                REQUEST CHURCH PACKET →
              </button>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ margin: 0, fontSize: '18px' }}>Frequently Asked Questions</h4>
            
            <div>
              <h5 style={{ margin: '0 0 4px', fontSize: '14px', color: 'var(--text-primary)' }}>How long does support take to respond?</h5>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>Our team responds to all inquiries within 24 business hours.</p>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
              <h5 style={{ margin: '0 0 4px', fontSize: '14px', color: 'var(--text-primary)' }}>Can individuals join without a church group?</h5>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>Yes! Over 10,000 individual believers participate daily using our web client and dashboard.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
