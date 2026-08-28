import React, { useState } from 'react';
import { ShoppingBag, CheckCircle, X, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import AnimateOnScroll from '../components/AnimateOnScroll';

const PRODUCTS = [
  {
    id: 1,
    title: 'SLAP Devotional Journal',
    subtitle: '4 Pillars of Daily Devotion',
    price: '$24.99',
    originalPrice: '$34.99',
    badge: 'Best Seller',
    description: 'A premium clothbound hardcover notebook with structured templates for Striking Verses, Lessons Learnt, Action Plans, and Prayers. Includes ribbon bookmarks and lay-flat binding.',
    image: '/slap-journal.png'
  },
  {
    id: 2,
    title: 'iSPEAK & iDECLARE Card Deck',
    subtitle: '52 Confession & Scripture Cards',
    price: '$16.99',
    originalPrice: '$22.99',
    badge: 'Popular',
    description: 'A luxurious gold-foil boxed set of 52 scriptures and faith declarations designed for daily morning proclamation, meditation, and memorization.',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=70'
  },
  {
    id: 3,
    title: 'Focus Study Bible Companion',
    subtitle: 'Durable Canvas & Genuine Leather',
    price: '$34.99',
    originalPrice: '$44.99',
    badge: 'Premium',
    description: 'Water-resistant, handcrafted cover with pen loops, journal slot, and bookmark ribbons. Built to protect your sacred scriptures on the go.',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=70'
  }
];

export default function Products() {
  const [toast, setToast] = useState(null);
  const [cart, setCart] = useState([]);

  const handlePurchase = (product) => {
    setCart(prev => [...prev, product]);
    setToast(product.title);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="page-wrapper-lg">

      {/* Toast Notification */}
      {toast && (
        <div className="toast-notification">
          <CheckCircle size={20} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>Added to Cart!</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{toast}</div>
          </div>
          <button
            onClick={() => setToast(null)}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', padding: '4px', marginLeft: 'auto', cursor: 'pointer' }}
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <AnimateOnScroll animation="fadeUp">
        <section className="page-header">
          <span className="text-label">
            MINISTRY STORE &amp; RESOURCES
          </span>
          <h1>Study Resources &amp; Gear</h1>
          <p>
            Equip your daily quiet times with custom-designed journals, Scripture confession decks, and durable Bible accessories crafted for a lifetime of growth.
          </p>

          {cart.length > 0 && (
            <div style={{ marginTop: '20px', display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'var(--accent-gold-light)', border: '1px solid var(--accent-gold)', borderRadius: '24px', padding: '10px 20px' }}>
              <ShoppingBag size={18} style={{ color: 'var(--accent-gold)' }} />
              <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent-gold)' }}>
                {cart.length} item{cart.length > 1 ? 's' : ''} in cart
              </span>
            </div>
          )}
        </section>
      </AnimateOnScroll>

      {/* Product Grid */}
      <div className="grid-auto-sm">
        {PRODUCTS.map((p, i) => (
          <AnimateOnScroll key={p.id} animation="fadeUp" delay={i * 150}>
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px', position: 'relative', height: '100%' }}>
              {p.badge && (
                <div className="badge badge-gold product-badge">
                  {p.badge}
                </div>
              )}
              <div
                className="product-image"
                style={{ backgroundImage: `url(${p.image})` }}
              />

              <div>
                <span className="text-label-sm" style={{ color: 'var(--accent-gold)', display: 'block', marginBottom: '4px' }}>
                  {p.subtitle}
                </span>
                <h3 style={{ margin: '4px 0 8px', fontSize: '22px' }}>{p.title}</h3>
                <div className="product-price">
                  <span className="current">{p.price}</span>
                  {p.originalPrice && (
                    <span className="original">{p.originalPrice}</span>
                  )}
                </div>
              </div>

              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, flexGrow: 1 }}>{p.description}</p>

              <button
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', borderRadius: '6px' }}
                onClick={() => handlePurchase(p)}
              >
                <ShoppingBag size={18} /> ADD TO CART
              </button>
            </div>
          </AnimateOnScroll>
        ))}
      </div>

      {/* Feature Strip */}
      <AnimateOnScroll animation="fadeUp">
        <div className="grid-3" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '40px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <ShieldCheck size={28} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
            <div>
              <h4 style={{ margin: 0, fontSize: '15px' }}>Premium Quality</h4>
              <p style={{ margin: 0, fontSize: '13px' }}>Crafted with archivist-grade materials for daily durability.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Truck size={28} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
            <div>
              <h4 style={{ margin: 0, fontSize: '15px' }}>Global Shipping</h4>
              <p style={{ margin: 0, fontSize: '13px' }}>Dispatched worldwide with tracked delivery services.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <RotateCcw size={28} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
            <div>
              <h4 style={{ margin: 0, fontSize: '15px' }}>30-Day Guarantee</h4>
              <p style={{ margin: 0, fontSize: '13px' }}>100% satisfaction guarantee or hassle-free return.</p>
            </div>
          </div>
        </div>
      </AnimateOnScroll>
    </div>
  );
}
