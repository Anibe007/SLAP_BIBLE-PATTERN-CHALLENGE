import React, { useEffect } from 'react';
import { Sparkles, CheckCircle2, Flame, Download, Heart, ArrowRight, X, ShieldCheck, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CelebrationModal({
  isOpen,
  onClose,
  type = 'generic', // 'report' | 'download' | 'signup' | 'signin' | 'generic'
  title,
  subtitle,
  details = [],
  primaryBtnText = 'Continue',
  primaryBtnAction,
  secondaryBtnText,
  secondaryBtnAction
}) {
  useEffect(() => {
    if (isOpen) {
      // Fire vibrant multi-angle celebratory confetti bursts
      const count = 200;
      const defaults = {
        origin: { y: 0.6 },
        colors: ['#b8860b', '#d4a843', '#fbbf24', '#ffffff', '#22c55e', '#3b82f6']
      };

      function fire(particleRatio, opts) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Smart Icon and Palette based on event type
  const getModalConfig = () => {
    switch (type) {
      case 'report':
        return {
          icon: <Flame size={38} style={{ color: '#ffffff' }} />,
          iconBg: 'linear-gradient(135deg, #e11d48, #b8860b)',
          badgeText: 'DAILY DEVOTIONAL LOGGED',
          defaultTitle: '🎉 Congratulations on Today\'s SLAP Devotion!',
          defaultSubtitle: 'Your devotional report has been recorded in Heaven and on Earth.'
        };
      case 'download':
        return {
          icon: <Download size={36} style={{ color: '#ffffff' }} />,
          iconBg: 'linear-gradient(135deg, #b8860b, #d97706)',
          badgeText: 'CARD DOWNLOADED SUCCESSFULLY',
          defaultTitle: '🎉 Proclamation Card Downloaded!',
          defaultSubtitle: 'Your high-resolution scripture declaration is saved and ready to share.'
        };
      case 'signup':
        return {
          icon: <Award size={36} style={{ color: '#ffffff' }} />,
          iconBg: 'linear-gradient(135deg, #10b981, #b8860b)',
          badgeText: 'WELCOME TO THE SLAP FAMILY',
          defaultTitle: '🎉 Congratulations & Welcome!',
          defaultSubtitle: 'Your SLAP Bible Challenge account has been successfully registered.'
        };
      case 'signin':
        return {
          icon: <ShieldCheck size={36} style={{ color: '#ffffff' }} />,
          iconBg: 'linear-gradient(135deg, #3b82f6, #b8860b)',
          badgeText: 'AUTHENTICATION SUCCESSFUL',
          defaultTitle: '🎉 Welcome Back!',
          defaultSubtitle: 'You are signed in and ready to continue your spiritual journey.'
        };
      default:
        return {
          icon: <Sparkles size={36} style={{ color: '#ffffff' }} />,
          iconBg: 'linear-gradient(135deg, #b8860b, #e5c07b)',
          badgeText: 'CONGRATULATIONS',
          defaultTitle: '🎉 Request Successfully Completed!',
          defaultSubtitle: 'Your request was processed and concluded with full success.'
        };
    }
  };

  const config = getModalConfig();

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'rgba(10, 8, 5, 0.72)',
        backdropFilter: 'blur(10px)',
        animation: 'fadeIn 0.25s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'var(--bg-secondary, #ffffff)',
          borderRadius: '24px',
          border: '1.5px solid rgba(212, 160, 23, 0.4)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5), 0 0 35px rgba(212, 160, 23, 0.2)',
          padding: '36px 28px 30px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Decorative ambient gold glow in top corner */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '240px',
          height: '140px',
          background: 'radial-gradient(circle, rgba(212, 160, 23, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'var(--bg-tertiary, #f3ede4)',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary, #6b5d4d)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--accent-gold-light)';
            e.currentTarget.style.color = 'var(--accent-gold)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--bg-tertiary, #f3ede4)';
            e.currentTarget.style.color = 'var(--text-secondary, #6b5d4d)';
          }}
        >
          <X size={18} />
        </button>

        {/* Floating Celebration Emblem */}
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: config.iconBg,
          margin: '0 auto 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 25px rgba(184, 134, 11, 0.35)',
          border: '3px solid rgba(255, 255, 255, 0.85)',
          animation: 'bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          {config.icon}
        </div>

        {/* Badge Label */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 14px',
          borderRadius: '20px',
          background: 'rgba(212, 160, 23, 0.12)',
          border: '1px solid rgba(212, 160, 23, 0.35)',
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '1px',
          color: 'var(--accent-gold, #b8860b)',
          marginBottom: '12px',
          textTransform: 'uppercase'
        }}>
          <Sparkles size={12} /> {config.badgeText}
        </div>

        {/* Main Title */}
        <h2 style={{
          fontSize: '24px',
          fontWeight: '800',
          fontFamily: 'var(--font-serif)',
          color: 'var(--text-primary)',
          margin: '0 0 8px',
          lineHeight: 1.25
        }}>
          {title || config.defaultTitle}
        </h2>

        {/* Subtitle Message */}
        <p style={{
          fontSize: '14.5px',
          color: 'var(--text-secondary)',
          lineHeight: 1.55,
          margin: '0 0 20px'
        }}>
          {subtitle || config.defaultSubtitle}
        </p>

        {/* Detail Badges/Cards */}
        {details && details.length > 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '24px',
            background: 'var(--bg-tertiary, #faf7f2)',
            padding: '14px 16px',
            borderRadius: '14px',
            border: '1px solid var(--border-color, rgba(90, 70, 40, 0.1))',
            textAlign: 'left'
          }}>
            {details.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13.5px' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>{item.label}</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions Button Row */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {secondaryBtnText && (
            <button
              onClick={secondaryBtnAction || onClose}
              className="btn-outline-gold"
              style={{
                flex: 1,
                padding: '12px 18px',
                fontSize: '13.5px',
                fontWeight: '700',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              {secondaryBtnText}
            </button>
          )}

          <button
            onClick={primaryBtnAction || onClose}
            className="btn-primary"
            style={{
              flex: 1,
              padding: '12px 20px',
              fontSize: '13.5px',
              fontWeight: '700',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            {primaryBtnText} <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
