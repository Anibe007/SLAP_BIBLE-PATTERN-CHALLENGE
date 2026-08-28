export default function SkeletonLoader() {
  return (
    <div className="skeleton-page">
      <div className="skeleton-page-header">
        <div className="skeleton skeleton-line" style={{ width: '40%', height: '32px', margin: '0 auto 16px' }} />
        <div className="skeleton skeleton-line" style={{ width: '65%', height: '16px', margin: '0 auto 8px' }} />
        <div className="skeleton skeleton-line" style={{ width: '50%', height: '16px', margin: '0 auto' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '48px' }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton-card">
            <div className="skeleton" style={{ width: '100%', height: '180px', borderRadius: '12px', marginBottom: '16px' }} />
            <div className="skeleton skeleton-line" style={{ width: '70%', height: '20px', marginBottom: '12px' }} />
            <div className="skeleton skeleton-line full" />
            <div className="skeleton skeleton-line medium" />
          </div>
        ))}
      </div>
    </div>
  );
}
