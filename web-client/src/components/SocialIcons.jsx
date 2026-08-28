import React from 'react';

/**
 * Authentic Brand SVG Logos
 */

export function WhatsAppIcon({ size = 24, className = '', style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 175.216 175.552"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    >
      <defs>
        <linearGradient id="wa-grad-b" x1="85.915%" x2="14.083%" y1="14.089%" y2="85.912%">
          <stop offset="0%" stopColor="#57d163"/>
          <stop offset="100%" stopColor="#23b33a"/>
        </linearGradient>
        <linearGradient id="wa-grad-a" x1="85.915%" x2="14.083%" y1="14.089%" y2="85.912%">
          <stop offset="0%" stopColor="#57d163"/>
          <stop offset="100%" stopColor="#23b33a"/>
        </linearGradient>
      </defs>
      <path d="M87.184 0C39.04 0 0 39.025 0 87.154c0 15.396 4.042 30.464 11.83 43.792L.474 174.96l45.174-11.82C58.88 170.661 72.87 174.31 87.184 174.31c48.143 0 87.184-39.025 87.184-87.154C174.368 39.025 135.327 0 87.184 0z" fill="url(#wa-grad-a)"/>
      <path d="M87.184 8.148c43.6 0 79.036 35.424 79.036 79.008 0 43.58-35.437 79.005-79.036 79.005-13.624 0-27.102-3.554-38.903-10.23l-2.79-1.638-28.946 7.578 7.72-28.154-1.82-2.88C15.56 118.408 8.148 103.156 8.148 87.156c0-43.584 35.437-79.008 79.036-79.008z" fill="#ffffff"/>
      <path d="M63.89 49.658c-1.76-3.923-3.614-4.002-5.29-4.07-1.37-.059-2.938-.055-4.504-.055-1.569 0-4.12.587-6.278 2.936-2.16 2.35-8.24 8.056-8.24 19.643 0 11.587 8.437 22.78 9.614 24.349 1.177 1.566 16.342 26.21 40.302 35.692 19.956 7.87 24.013 6.308 28.34 5.914 4.326-.394 13.95-5.707 15.91-11.218 1.96-5.51 1.96-10.236 1.372-11.216-.589-.98-2.158-1.568-4.514-2.744-2.357-1.176-13.946-6.882-16.108-7.666-2.159-.784-3.727-.98-5.294 1.176-1.568 2.157-6.083 7.666-7.454 9.234-1.371 1.567-2.742 1.762-5.098.588-2.356-1.176-9.942-3.663-18.934-11.682-6.997-6.242-11.72-13.946-13.09-16.3-1.37-2.354-.147-3.63 1.03-4.803.954-.948 2.157-2.353 3.33-3.531 1.172-1.177 1.565-1.96 2.354-3.53.783-1.569.39-2.94-.196-4.116-.587-1.177-5.098-12.37-7.252-16.91z" fill="url(#wa-grad-b)"/>
    </svg>
  );
}

export function InstagramIcon({ size = 24, className = '', style = {} }) {
  const id = `ig-grad-${Math.random().toString(36).substr(2, 6)}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', borderRadius: '22%', ...style }}
    >
      <defs>
        <radialGradient id={id} cx="19%" cy="99%" r="108%" fx="19%" fy="99%">
          <stop offset="0%" stopColor="#ffd600" />
          <stop offset="25%" stopColor="#ff0100" />
          <stop offset="50%" stopColor="#d800b9" />
          <stop offset="100%" stopColor="#7000ff" />
        </radialGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill={`url(#${id})`} />
      <rect x="9" y="9" width="30" height="30" rx="9" fill="none" stroke="#FFFFFF" strokeWidth="3" />
      <circle cx="24" cy="24" r="7.5" fill="none" stroke="#FFFFFF" strokeWidth="3" />
      <circle cx="32.5" cy="15.5" r="2" fill="#FFFFFF" />
    </svg>
  );
}

export function FacebookIcon({ size = 24, className = '', style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    >
      <circle cx="24" cy="24" r="23" fill="#1877F2" />
      <path
        fill="#FFFFFF"
        d="M29.5 24.5l.8-5.5h-5.3v-3.6c0-1.5.7-3 3.1-3h2.4V7.7s-2.2-.4-4.3-.4c-4.4 0-7.3 2.7-7.3 7.5v4.7h-4.8v5.5h4.8V39c1 .2 2 .2 3 .2s2 0 3-.2V24.5h4.6z"
      />
    </svg>
  );
}

export function LinkedInIcon({ size = 24, className = '', style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', borderRadius: '18%', ...style }}
    >
      <rect width="48" height="48" rx="10" fill="#0A66C2" />
      <path
        fill="#FFFFFF"
        d="M13.5 18.5h6v17h-6v-17zm3-8.8c1.9 0 3.5 1.6 3.5 3.5s-1.6 3.5-3.5 3.5-3.5-1.6-3.5-3.5 1.6-3.5 3.5-3.5zm11.5 8.8h5.8v2.3h.1c.8-1.5 2.8-3.1 5.7-3.1 6.1 0 7.2 4 7.2 9.2v10.6h-6v-9.4c0-2.2 0-5.1-3.1-5.1s-3.6 2.4-3.6 4.9v9.6h-6.1v-19z"
      />
    </svg>
  );
}
