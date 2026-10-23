import React, { useState } from 'react';
import {
  HeartHandshake, CheckCircle, Globe, BookOpen, Users, Zap,
  DollarSign, Edit3, Megaphone, ArrowRight, Star, Shield, Heart
} from 'lucide-react';
import AnimateOnScroll from '../components/AnimateOnScroll';

/* ─── Partnership Tiers ─── */
const TIERS = [
  {
    icon: <DollarSign size={28} />,
    title: 'Financial Sponsor',
    value: 'financial',
    tag: 'Most Impactful',
    tagColor: 'var(--brand-crimson)',
    desc: 'Fund infrastructure, server costs, language translation, and physical journal production to keep SLAP free for believers everywhere.',
    perks: [
      'Named acknowledgement in monthly newsletter',
      'Priority access to new features & resources',
      'Quarterly impact reports on your contribution',
      'Dedicated partnership coordinator',
    ],
    highlight: true,
  },
  {
    icon: <Edit3 size={28} />,
    title: 'Content Creator',
    value: 'content',
    tag: 'Creative Role',
    tagColor: 'var(--brand-navy)',
    desc: 'Write devotionals, produce study videos, or create social media content that deepens believers\' engagement with God\'s Word.',
    perks: [
      'Published credit on all contributed content',
      'Access to the SLAP Creator community',
      'Brand partnership opportunity',
      'Build your ministry platform',
    ],
    highlight: false,
  },
  {
    icon: <Users size={28} />,
    title: 'Volunteer Facilitator',
    value: 'volunteer',
    tag: 'Community Builder',
    tagColor: '#2d7d46',
    desc: 'Coordinate local SLAP groups, run church partnerships, or help onboard new believers into the challenge in your community.',
    perks: [
      'Official SLAP Facilitator certification',
      'Access to group leader resources & tools',
      'Recognition on the SLAP website',
      'Impact reports for your local group',
    ],
    highlight: false,
  },
];

/* ─── Impact Stats ─── */
const STATS = [
  { value: '5,000+', label: 'Active Believers', icon: <Users size={20} /> },
  { value: '30+',    label: 'Nations Reached',  icon: <Globe size={20} /> },
  { value: '50K+',   label: 'SLAP Reports',     icon: <BookOpen size={20} /> },
  { value: '100%',   label: 'Free to Use',      icon: <Heart size={20} /> },
];

/* ─── Why Partner Benefits ─── */
const BENEFITS = [
  {
    icon: <Globe size={24} />,
    title: 'Global Kingdom Reach',
    desc: 'Your support directly expands SLAP Bible Challenge into new nations and languages, bringing God\'s Word to communities that have never had access to structured discipleship tools.',
  },
  {
    icon: <BookOpen size={24} />,
    title: 'Free for Believers Everywhere',
    desc: 'We are committed to keeping every feature free. Partners make this possible by funding the infrastructure, development, and physical resources that power the platform.',
  },
  {
    icon: <Zap size={24} />,
    title: 'Tangible, Measurable Impact',
    desc: 'Receive quarterly impact reports showing exactly how your partnership has contributed — nations reached, lives changed, and reports submitted.',
  },
  {
    icon: <Shield size={24} />,
    title: 'Kingdom-First Stewardship',
    desc: 'Every contribution is managed with full transparency and accountability, directed toward building believers in the faith and equipping the body of Christ.',
  },
];

export default function Partner() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedTier, setSelectedTier] = useState('financial');
  const [formData, setFormData] = useState({
    name: '', email: '', organization: '', type: 'financial', message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleTierSelect = (value) => {
    setSelectedTier(value);
    setFormData(f => ({ ...f, type: value }));
    document.getElementById('partner-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div style={{ paddingBottom: '80px' }}>

      {/* ══════════════════════════════════════════════════════
          HERO BANNER
      ══════════════════════════════════════════════════════ */}
      <section style={{
        background: 'linear-gradient(135deg, #070c22 0%, #0d1840 45%, #101f55 100%)',
        padding: '80px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background glow orbs */}
        <div style={{
          position: 'absolute', top: '-80px', left: '10%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(178,13,48,0.12) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', right: '5%',
          width: '350px', height: '350px',
          background: 'radial-gradient(circle, rgba(16,31,85,0.4) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '720px', margin: '0 auto' }}>
          <AnimateOnScroll animation="fadeUp">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: 'rgba(178,13,48,0.15)', border: '1px solid rgba(178,13,48,0.3)',
              borderRadius: '30px', padding: '6px 18px',
              color: '#f2a8b6', fontSize: '11px', fontWeight: '800',
              letterSpacing: '2.5px', textTransform: 'uppercase',
              marginBottom: '28px',
            }}>
              <HeartHandshake size={14} />
              KINGDOM PARTNERSHIP
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
              fontWeight: '800', color: '#ffffff', lineHeight: 1.08,
              letterSpacing: '-1px', marginBottom: '20px',
            }}>
              Partner with the<br />
              <span style={{ color: 'var(--brand-crimson)' }}>SLAP Bible Challenge</span>
            </h1>
            <p style={{
              color: 'rgba(255,255,255,0.72)', fontSize: '17px',
              lineHeight: 1.75, maxWidth: '560px', margin: '0 auto 36px',
            }}>
              Join a growing movement of believers, churches, and organizations
              helping us keep discipleship tools free and accessible to every nation on earth.
            </p>
            <a href="#partner-form" style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: 'var(--brand-crimson)', color: 'white',
              padding: '14px 32px', borderRadius: '6px', textDecoration: 'none',
              fontWeight: '700', fontSize: '13px', letterSpacing: '1.5px',
              textTransform: 'uppercase',
              boxShadow: '0 4px 24px rgba(178,13,48,0.45)',
              transition: 'all 0.25s ease',
            }}>
              Become a Partner <ArrowRight size={16} />
            </a>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          IMPACT STATS BAR
      ══════════════════════════════════════════════════════ */}
      <section style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <div style={{
          maxWidth: '1000px', margin: '0 auto', padding: '0 24px',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        }}>
          {STATS.map((s, i) => (
            <AnimateOnScroll key={i} animation="fadeUp" delay={i * 80}>
              <div style={{
                padding: '32px 20px', textAlign: 'center',
                borderRight: i < 3 ? '1px solid var(--border-color)' : 'none',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '8px',
              }}>
                <div style={{ color: 'var(--brand-crimson)', marginBottom: '4px' }}>{s.icon}</div>
                <div style={{
                  fontSize: '2rem', fontWeight: '800',
                  fontFamily: 'var(--font-display)', color: 'var(--text-primary)', lineHeight: 1,
                }}>{s.value}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>{s.label}</div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PARTNERSHIP TIERS
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <AnimateOnScroll animation="fadeUp">
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span className="text-label" style={{ marginBottom: '12px' }}>CHOOSE YOUR ROLE</span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', marginBottom: '12px' }}>
                How Would You Like to Partner?
              </h2>
              <p style={{ maxWidth: '520px', margin: '0 auto', fontSize: '16px' }}>
                Every type of partner is essential to the mission. Choose the role that fits your calling and capacity.
              </p>
            </div>
          </AnimateOnScroll>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {TIERS.map((tier, i) => (
              <AnimateOnScroll key={i} animation="fadeUp" delay={i * 120}>
                <div
                  onClick={() => handleTierSelect(tier.value)}
                  style={{
                    background: tier.highlight
                      ? 'linear-gradient(145deg, #101f55, #162870)'
                      : 'var(--bg-secondary)',
                    border: `2px solid ${selectedTier === tier.value ? 'var(--brand-crimson)' : tier.highlight ? 'rgba(178,13,48,0.3)' : 'var(--border-color)'}`,
                    borderRadius: '20px',
                    padding: '36px 28px',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    boxShadow: selectedTier === tier.value
                      ? '0 0 0 3px rgba(178,13,48,0.2), 0 8px 40px rgba(178,13,48,0.2), 0 0 60px rgba(16,31,85,0.15)'
                      : tier.highlight
                        ? '0 8px 32px rgba(16,31,85,0.3), 0 0 40px rgba(178,13,48,0.1)'
                        : 'var(--card-shadow), var(--card-glow)',
                    transform: selectedTier === tier.value ? 'translateY(-4px)' : 'none',
                  }}
                >
                  {/* Tag */}
                  <div style={{
                    position: 'absolute', top: '18px', right: '18px',
                    background: tier.tagColor, color: 'white',
                    fontSize: '9px', fontWeight: '800', letterSpacing: '1.5px',
                    textTransform: 'uppercase', padding: '4px 10px', borderRadius: '20px',
                  }}>
                    {tier.tag}
                  </div>

                  {/* Icon */}
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '14px',
                    background: tier.highlight ? 'rgba(178,13,48,0.25)' : 'var(--bg-tertiary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: tier.highlight ? '#f2a8b6' : 'var(--brand-crimson)',
                    marginBottom: '20px',
                    boxShadow: tier.highlight ? '0 0 20px rgba(178,13,48,0.2)' : 'none',
                  }}>
                    {tier.icon}
                  </div>

                  <h3 style={{
                    fontFamily: 'var(--font-display)', fontSize: '20px',
                    fontWeight: '700', marginBottom: '12px',
                    color: tier.highlight ? '#ffffff' : 'var(--text-primary)',
                  }}>
                    {tier.title}
                  </h3>
                  <p style={{
                    fontSize: '14px', lineHeight: 1.7, marginBottom: '20px',
                    color: tier.highlight ? 'rgba(255,255,255,0.75)' : 'var(--text-secondary)',
                  }}>
                    {tier.desc}
                  </p>

                  {/* Perks */}
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {tier.perks.map((perk, pi) => (
                      <li key={pi} style={{
                        display: 'flex', alignItems: 'flex-start', gap: '10px',
                        fontSize: '13px',
                        color: tier.highlight ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)',
                      }}>
                        <CheckCircle size={15} style={{ color: 'var(--brand-crimson)', flexShrink: 0, marginTop: '2px' }} />
                        {perk}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleTierSelect(tier.value)}
                    style={{
                      width: '100%', padding: '12px',
                      background: selectedTier === tier.value ? 'var(--brand-crimson)' : 'transparent',
                      color: selectedTier === tier.value ? 'white' : tier.highlight ? 'rgba(255,255,255,0.8)' : 'var(--brand-crimson)',
                      border: `1.5px solid ${selectedTier === tier.value ? 'var(--brand-crimson)' : tier.highlight ? 'rgba(255,255,255,0.3)' : 'var(--brand-crimson)'}`,
                      borderRadius: '8px', fontWeight: '700', fontSize: '12px',
                      letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {selectedTier === tier.value ? '✓ Selected' : 'Select This Role'}
                  </button>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          WHY PARTNER — 4 Benefits
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <AnimateOnScroll animation="fadeUp">
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span className="text-label" style={{ marginBottom: '12px' }}>YOUR KINGDOM INVESTMENT</span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}>
                Why Partner with Us?
              </h2>
            </div>
          </AnimateOnScroll>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            {BENEFITS.map((b, i) => (
              <AnimateOnScroll key={i} animation="fadeUp" delay={i * 100}>
                <div className="glass-card" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '14px', flexShrink: 0,
                    background: 'linear-gradient(135deg, rgba(178,13,48,0.12), rgba(16,31,85,0.08))',
                    border: '1px solid rgba(178,13,48,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--brand-crimson)',
                  }}>
                    {b.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '8px' }}>{b.title}</h3>
                    <p style={{ fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          QUOTE / TESTIMONIAL BAND
      ══════════════════════════════════════════════════════ */}
      <section style={{
        background: 'linear-gradient(135deg, #0a1538 0%, #101f55 50%, #0a1538 100%)',
        padding: '72px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '2px solid var(--brand-crimson)',
        borderBottom: '2px solid rgba(178,13,48,0.3)',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(178,13,48,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <AnimateOnScroll animation="fadeUp">
          <div style={{ maxWidth: '680px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '24px' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} style={{ color: '#f2a040', fill: '#f2a040' }} />
              ))}
            </div>
            <blockquote style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)',
              fontStyle: 'italic', color: 'rgba(255,255,255,0.92)', lineHeight: 1.6,
              margin: '0 0 28px', fontWeight: '500',
            }}>
              "The SLAP Bible Challenge transformed how our church approaches daily devotion.
              Partnering with them was the best Kingdom investment we made this year."
            </blockquote>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <img
                src="/david-anibe.jpg"
                alt="Pastor David Anibe"
                style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(178,13,48,0.5)' }}
                onError={e => { e.target.style.display = 'none'; }}
              />
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '14px' }}>Pastor David Anibe</div>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px' }}>SLAP Bible Challenge Founder</div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ══════════════════════════════════════════════════════
          APPLICATION FORM
      ══════════════════════════════════════════════════════ */}
      <section id="partner-form" style={{ padding: '80px 24px', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <AnimateOnScroll animation="fadeUp">
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <span className="text-label" style={{ marginBottom: '12px' }}>GET STARTED</span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', marginBottom: '12px' }}>
                Partnership Application
              </h2>
              <p style={{ fontSize: '16px', maxWidth: '480px', margin: '0 auto' }}>
                Fill in the form below and our coordination team will reach out within 48 hours to discuss next steps.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fadeUp" delay={100}>
            <div className="glass-card" style={{ padding: '48px 40px', borderRadius: '24px',
              boxShadow: '0 8px 48px rgba(16,31,85,0.12), 0 0 60px rgba(178,13,48,0.06), var(--card-glow)'
            }}>
              {submitted ? (
                <div style={{
                  textAlign: 'center', padding: '40px 20px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px'
                }}>
                  <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(178,13,48,0.15), rgba(16,31,85,0.1))',
                    border: '2px solid rgba(178,13,48,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'pulseGlow 2s ease-in-out infinite',
                  }}>
                    <HeartHandshake size={36} style={{ color: 'var(--brand-crimson)' }} />
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>
                    Thank You for Partnering!
                  </h2>
                  <p style={{ maxWidth: '380px', fontSize: '16px', lineHeight: 1.7 }}>
                    Your application has been received. Our partnership coordinator will contact you within
                    48 hours with next steps and resources.
                  </p>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(16,31,85,0.06), rgba(178,13,48,0.04))',
                    border: '1px solid var(--border-color)', borderRadius: '12px',
                    padding: '16px 24px', display: 'flex', gap: '10px', alignItems: 'center',
                    fontSize: '14px', color: 'var(--text-secondary)',
                  }}>
                    <CheckCircle size={16} style={{ color: 'var(--brand-crimson)', flexShrink: 0 }} />
                    A confirmation email has been noted for your records.
                  </div>
                  <button
                    className="btn-secondary"
                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', organization: '', type: selectedTier, message: '' }); }}
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>Full Name *</label>
                      <input
                        type="text" required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>Email Address *</label>
                      <input
                        type="email" required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Church / Organisation (Optional)</label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={e => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="Your church or organisation name"
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Partnership Role *</label>
                    <select
                      value={formData.type}
                      onChange={e => { setFormData({ ...formData, type: e.target.value }); setSelectedTier(e.target.value); }}
                    >
                      <option value="financial">Financial Sponsor</option>
                      <option value="content">Content Creator (Devotionals / Videos)</option>
                      <option value="volunteer">Volunteer Facilitator</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Message / How You'd Like to Help *</label>
                    <textarea
                      rows="5" required
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your vision, capacity, and how you'd like to partner with SLAP Bible Challenge..."
                    />
                  </div>

                  {/* Privacy note */}
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                    🔒 Your information is kept private and will only be used by the SLAP coordination team to contact you about your partnership inquiry.
                  </p>

                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ padding: '16px', fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase', borderRadius: '8px' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      Submit Partnership Application <ArrowRight size={16} />
                    </span>
                  </button>
                </form>
              )}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          BOTTOM CTA STRIP
      ══════════════════════════════════════════════════════ */}
      <section style={{
        background: 'var(--brand-navy)', padding: '48px 24px', textAlign: 'center',
        borderTop: '1px solid rgba(178,13,48,0.2)',
      }}>
        <AnimateOnScroll animation="fadeUp">
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: '700' }}>
            Have a quick question?
          </p>
          <h3 style={{ color: '#ffffff', fontSize: '1.5rem', marginBottom: '20px', fontFamily: 'var(--font-display)' }}>
            Reach us directly on WhatsApp
          </h3>
          <a
            href="https://wa.me/2348155180000"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: '#25D366', color: 'white', padding: '12px 28px',
              borderRadius: '6px', textDecoration: 'none', fontWeight: '700',
              fontSize: '14px', transition: 'all 0.25s ease',
              boxShadow: '0 4px 20px rgba(37,211,102,0.35)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.015.376-.101c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.135.56 4.139 1.536 5.88l-1.636 5.948 6.137-1.609c1.701.928 3.649 1.458 5.72 1.458 6.627 0 12-5.373 12-12s-5.373-12-12-12z" />
            </svg>
            Chat on WhatsApp
          </a>
        </AnimateOnScroll>
      </section>

    </div>
  );
}
