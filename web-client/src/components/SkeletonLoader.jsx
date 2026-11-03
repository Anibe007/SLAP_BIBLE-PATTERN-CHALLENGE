import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="skeleton-page">
      {/* Brand Top Progress Aura */}
      <div className="skeleton-brand-bar" />

      {/* Header Skeleton */}
      <div className="skeleton-page-header">
        <div className="skeleton skeleton-pill" style={{ width: '160px', height: '26px' }} />
        <div className="skeleton skeleton-title" style={{ width: '55%', maxWidth: '520px', height: '36px' }} />
        <div className="skeleton skeleton-line" style={{ width: '40%', maxWidth: '380px', height: '16px' }} />
      </div>

      {/* Quick Action Navigation Pills Skeleton */}
      <div className="skeleton-pills-row">
        {[110, 140, 120, 150].map((width, idx) => (
          <div key={idx} className="skeleton skeleton-pill" style={{ width: `${width}px`, height: '34px' }} />
        ))}
      </div>

      {/* Responsive Cards Grid Skeleton */}
      <div className="skeleton-grid">
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div className="skeleton skeleton-icon" />
              <div style={{ flex: 1 }}>
                <div className="skeleton skeleton-line" style={{ width: '65%', height: '18px', marginBottom: '8px' }} />
                <div className="skeleton skeleton-line" style={{ width: '40%', height: '13px', margin: 0 }} />
              </div>
            </div>
            <div className="skeleton skeleton-media" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
              <div className="skeleton skeleton-line full" />
              <div className="skeleton skeleton-line medium" />
              <div className="skeleton skeleton-line short" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
              <div className="skeleton skeleton-pill" style={{ width: '90px', height: '24px' }} />
              <div className="skeleton skeleton-btn" style={{ width: '110px', height: '32px' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
