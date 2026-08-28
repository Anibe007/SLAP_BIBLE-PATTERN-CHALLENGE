import React from 'react';

export default function FloatingWhatsApp() {
  return (
    <>
      <style>{`
        .floating-whatsapp-btn {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9999;
          width: 62px;
          height: 62px;
          border-radius: 50%;
          background: #25D366;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 24px rgba(37, 211, 102, 0.6), 0 2px 8px rgba(0,0,0,0.15);
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          animation: wa-pulse 2.8s ease-in-out infinite;
        }
        .floating-whatsapp-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 10px 36px rgba(37, 211, 102, 0.8), 0 4px 12px rgba(0,0,0,0.2);
          animation: none;
        }
        @keyframes wa-pulse {
          0%, 100% { box-shadow: 0 6px 24px rgba(37,211,102,0.6), 0 2px 8px rgba(0,0,0,0.15); }
          50%       { box-shadow: 0 6px 40px rgba(37,211,102,0.95), 0 2px 8px rgba(0,0,0,0.15); }
        }
      `}</style>
      <a
        href="https://wa.me/2348155180000"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp-btn"
        aria-label="Chat with us on WhatsApp"
        title="Chat with us on WhatsApp (08155180000)"
      >
        {/* Official WhatsApp logo — white icon on green */}
        <svg width="34" height="34" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 1C7.716 1 1 7.716 1 16c0 2.703.707 5.243 1.946 7.447L1 31l7.796-2.04A14.94 14.94 0 0016 31c8.284 0 15-6.716 15-15S24.284 1 16 1zm0 2.727a12.273 12.273 0 110 24.546A12.253 12.253 0 019.56 26.25l-.474-.283-4.919 1.287 1.316-4.8-.31-.49A12.222 12.222 0 013.727 16 12.273 12.273 0 0116 3.727z"
            fill="white"
          />
          <path
            d="M21.94 19.02c-.3-.15-1.77-.874-2.044-.974-.274-.1-.473-.15-.672.15-.2.298-.772.974-.946 1.173-.174.2-.348.224-.648.074-.3-.15-1.266-.467-2.412-1.488-.89-.796-1.492-1.779-1.666-2.079-.174-.3-.018-.462.13-.61.135-.135.3-.349.45-.524.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.524-.075-.15-.672-1.62-.921-2.22-.243-.582-.49-.502-.672-.511l-.573-.01c-.2 0-.523.075-.797.375s-1.047 1.023-1.047 2.494c0 1.471 1.072 2.893 1.222 3.093.15.2 2.11 3.22 5.11 4.514.715.308 1.272.492 1.708.63.717.228 1.37.196 1.886.118.575-.085 1.77-.723 2.02-1.42.249-.698.249-1.297.174-1.422-.075-.125-.274-.2-.573-.35z"
            fill="white"
          />
        </svg>
      </a>
    </>
  );
}
