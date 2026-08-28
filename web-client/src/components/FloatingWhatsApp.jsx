import React from 'react';
import { WhatsAppIcon } from './SocialIcons';

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/2348155180000"
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp-btn"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp (08155180000)"
    >
      <WhatsAppIcon size={56} />
    </a>
  );
}
