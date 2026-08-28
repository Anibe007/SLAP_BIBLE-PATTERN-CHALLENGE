import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageCircle, Share2, ArrowRight } from 'lucide-react';
import AnimateOnScroll from '../components/AnimateOnScroll';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const SOCIAL_CHANNELS = [
    {
      name: 'WhatsApp',
      handle: '08155180000',
      desc: 'Instant chat & ministry support',
      url: 'https://wa.me/2348155180000?text=Hello%2C%20I%20would%20like%20to%20learn%20more%20about%20the%20SLAP%20Bible%20Pattern%20Challenge',
      color: '#25D366',
      bg: 'rgba(37, 211, 102, 0.12)',
      action: 'Chat on WhatsApp →',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.015.376-.101c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.135.56 4.139 1.536 5.88l-1.636 5.948 6.137-1.609c1.701.928 3.649 1.458 5.72 1.458 6.627 0 12-5.373 12-12s-5.373-12-12-12z"/>
        </svg>
      )
    },
    {
      name: 'Instagram',
      handle: '@slapbiblepattern',
      desc: 'Daily declarations & video clips',
      url: 'https://instagram.com',
      color: '#E1306C',
      bg: 'rgba(225, 48, 108, 0.12)',
      action: 'Follow on Instagram →',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      name: 'Facebook',
      handle: 'SLAP Bible Challenge',
      desc: 'Community updates & livestreams',
      url: 'https://facebook.com',
      color: '#1877F2',
      bg: 'rgba(24, 119, 242, 0.12)',
      action: 'Connect on Facebook →',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      handle: 'SLAP Bible Pattern',
      desc: 'Leadership, articles & mission',
      url: 'https://linkedin.com',
      color: '#0A66C2',
      bg: 'rgba(10, 102, 194, 0.12)',
      action: 'Connect on LinkedIn →',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="page-wrapper-lg">

      {/* Header */}
      <AnimateOnScroll animation="fadeUp">
        <section className="page-header">
          <span className="text-label">
            WE WOULD LOVE TO HEAR FROM YOU
          </span>
          <h1>Get in Touch</h1>
          <p>
            Have questions about bringing SLAP Bible Challenge to your church, partnering with us, or need support? Our team is available 24/7.
          </p>
        </section>
      </AnimateOnScroll>

      {/* ═══════════ DIRECT SOCIAL & MESSAGING STRIP ═══════════ */}
      <section>
        <AnimateOnScroll animation="fadeUp">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span className="text-label">DIRECT MESSAGING &amp; SOCIAL CHANNELS</span>
            <h2 style={{ fontSize: '28px', marginTop: '4px' }}>Connect With Us Anywhere</h2>
          </div>
        </AnimateOnScroll>

        <div className="grid-4">
          {SOCIAL_CHANNELS.map((ch, idx) => (
            <AnimateOnScroll key={ch.name} animation="fadeUp" delay={idx * 100}>
              <a
                href={ch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  padding: '24px',
                  textDecoration: 'none',
                  color: 'inherit',
                  height: '100%',
                  position: 'relative'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: ch.bg,
                  color: ch.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {ch.icon}
                </div>

                <div>
                  <h3 style={{ margin: '0 0 2px', fontSize: '18px', color: 'var(--text-primary)' }}>{ch.name}</h3>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: ch.color, fontFamily: 'var(--font-sans)' }}>
                    {ch.handle}
                  </div>
                  <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {ch.desc}
                  </p>
                </div>

                <div style={{
                  marginTop: 'auto',
                  paddingTop: '12px',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: ch.color,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {ch.action}
                </div>
              </a>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* Traditional Contact Cards Strip */}
      <div className="grid-3">
        {[
          { icon: <Mail size={22} style={{ color: 'var(--accent-gold)' }} />, label: 'EMAIL US', title: 'Direct Support', line1: 'support@slapbible.com', line2: 'Response within 24 hours' },
          { icon: <Phone size={22} style={{ color: 'var(--accent-gold)' }} />, label: 'CALL / WHATSAPP', title: 'Ministry Enquiries', line1: '08155180000', line2: '08100900094', line1Bold: true, line2Bold: true },
          { icon: <MapPin size={22} style={{ color: 'var(--accent-gold)' }} />, label: 'VISIT US', title: 'Headquarters', line1: '100 Faith Parkway', line2: 'Austin, TX 78701' },
        ].map((card, i) => (
          <AnimateOnScroll key={i} animation="fadeUp" delay={i * 120}>
            <div className="glass-card contact-card">
              <div className="icon-badge" style={{ background: 'var(--accent-gold-light)' }}>
                {card.icon}
              </div>
              <div>
                <span className="text-label-sm" style={{ color: 'var(--accent-gold)' }}>{card.label}</span>
                <h3 style={{ margin: '4px 0 6px', fontSize: '18px' }}>{card.title}</h3>
                <p style={{ margin: 0, fontSize: '14px', color: card.line1Bold ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: card.line1Bold ? '700' : '400' }}>{card.line1}</p>
                <p style={{ margin: '2px 0 0', fontSize: '13px', color: card.line2Bold ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: card.line2Bold ? '700' : '400' }}>{card.line2}</p>
              </div>
            </div>
          </AnimateOnScroll>
        ))}
      </div>

      {/* Form & FAQ Grid */}
      <div className="grid-2" style={{ alignItems: 'flex-start', gap: '48px' }}>

        {/* Left: Contact Form */}
        <AnimateOnScroll animation="fadeLeft">
          <div className="glass-card" style={{ padding: '36px' }}>
            {submitted ? (
              <div className="text-center" style={{ padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
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
                  <span className="text-label">
                    SEND A MESSAGE
                  </span>
                  <h2 style={{ fontSize: '28px', margin: '4px 0 0' }}>How Can We Help You?</h2>
                </div>

                <div className="form-grid-2">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Your Name *</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Email Address *</label>
                    <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label>Inquiry Topic</label>
                  <select value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })}>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Church Partnership">Bring SLAP to My Church</option>
                    <option value="WhatsApp Support">WhatsApp Direct Support</option>
                    <option value="Technical Support">App &amp; Dashboard Support</option>
                    <option value="Product Orders">Journal &amp; Resource Orders</option>
                    <option value="Media & Speaking">Media &amp; Press Inquiry</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label>Your Message *</label>
                  <textarea rows="5" required value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} placeholder="Share details about your request or inquiry..."></textarea>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  SEND MESSAGE <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </AnimateOnScroll>

        {/* Right: Church & Community Info Block */}
        <AnimateOnScroll animation="fadeRight" delay={200}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            <div className="church-promo-card">
              <span className="text-label">
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
                <h5 style={{ margin: '0 0 4px', fontSize: '14px', color: 'var(--text-primary)' }}>Can I reach out on WhatsApp directly?</h5>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Yes! Message us directly on <strong>08155180000</strong> for rapid response and study assistance.
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <h5 style={{ margin: '0 0 4px', fontSize: '14px', color: 'var(--text-primary)' }}>How long does support take to respond?</h5>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>Our team responds on WhatsApp within minutes and via email within 24 hours.</p>
              </div>
            </div>

          </div>
        </AnimateOnScroll>

      </div>
    </div>
  );
}
