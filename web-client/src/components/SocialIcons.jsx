import React from 'react';

/**
 * Authentic Brand SVG Logos
 */

export function WhatsAppIcon({ size = 24, className = '', style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    >
      <circle cx="24" cy="24" r="23" fill="#25D366" />
      <path
        fill="#FFFFFF"
        d="M34.6 29.5c-.5-.2-2.8-1.4-3.3-1.6-.4-.2-.8-.2-1.1.2-.3.5-1.3 1.6-1.5 1.9-.3.3-.5.3-1 .1-.5-.2-2-0.7-3.8-2.3-1.4-1.3-2.4-2.8-2.6-3.3-.3-.5 0-.7.2-1 .2-.2.5-.5.7-.8.2-.3.3-.5.5-.8.1-.3.1-.6 0-.8-.1-.2-1.1-2.7-1.5-3.7-.4-.9-.8-.8-1.1-.8h-1c-.3 0-.9.1-1.4.7-.5.5-1.9 1.9-1.9 4.6 0 2.7 2 5.3 2.3 5.7.3.4 3.9 6 9.4 8.4 1.3.6 2.3.9 3.1 1.2 1.3.4 2.5.3 3.4.2 1.1-.2 2.8-1.1 3.2-2.2.4-1.1.4-2 .3-2.2-.1-.2-.5-.4-1-.7zM24 6C14.1 6 6 14.1 6 24c0 3.5 1 6.8 2.8 9.6L7 41l7.6-2c2.6 1.4 5.6 2.2 8.9 2.2 9.9 0 18-8.1 18-18S33.9 6 24 6zm0 33c-3 0-5.7-.8-8.1-2.3l-.6-.4-4.8 1.3 1.3-4.7-.4-.6c-1.6-2.5-2.4-5.4-2.4-8.3 0-8.3 6.7-15 15-15s15 6.7 15 15-6.7 15-15 15z"
      />
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
