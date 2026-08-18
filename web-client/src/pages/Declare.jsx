import React, { useState, useEffect, useRef } from 'react';
import { dbService } from '../services/db';
import { Sparkles, Download, Share2, RefreshCw, Palette, User, BookOpen } from 'lucide-react';

const BACKGROUND_STYLES = [
  { id: 'golden-sunrise', name: 'Golden Sunrise', type: 'image', url: '/bg-sunrise.png', colors: ['#b8860b', '#d4a017'], overlay: 'rgba(26, 20, 9, 0.65)' },
  { id: 'altar-scripture', name: 'Altar & Scripture', type: 'image', url: '/bg-prayer.png', colors: ['#5c4a32', '#8c6d46'], overlay: 'rgba(26, 20, 9, 0.68)' },
  { id: 'sanctuary-pillars', name: 'Sanctuary Pillars', type: 'image', url: '/bg-sanctuary.png', colors: ['#2e2518', '#1a1409'], overlay: 'rgba(26, 20, 9, 0.72)' },
  { id: 'royal-gold', name: 'Royal Gold Gradient', type: 'gradient', colors: ['#b8860b', '#d4a017'] },
  { id: 'warm-amber', name: 'Warm Amber Gradient', type: 'gradient', colors: ['#5c4a32', '#8c6d46'] },
  { id: 'deep-bronze', name: 'Deep Bronze Gradient', type: 'gradient', colors: ['#2e2518', '#1a1409'] },
  { id: 'rose-gold', name: 'Rose Gold Gradient', type: 'gradient', colors: ['#b8433d', '#d4a017'] }
];

export default function Declare() {
  const canvasRef = useRef(null);
  const [preseeded, setPreseeded] = useState([]);
  const [text, setText] = useState('');
  const [ref, setRef] = useState('');
  const [name, setName] = useState('');
  const [bgStyle, setBgStyle] = useState('rose-fire');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const declList = await dbService.getPreseededDeclarations();
        setPreseeded(declList);
        // Set first declaration as default
        if (declList.length > 0) {
          setText(declList[0].text);
          setRef(declList[0].ref);
        }
        
        const userHistory = await dbService.getDeclarations();
        setHistory(userHistory);
      } catch (err) {
        console.error("Error fetching declarations:", err);
      }
    };
    loadInitialData();
  }, []);

  // Redraw canvas whenever inputs change
  useEffect(() => {
    drawCard();
  }, [text, ref, name, bgStyle, qrLoaded]);

  const selectDeclaration = (decl) => {
    setText(decl.text);
    setRef(decl.ref);
  };

  const drawCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const selectedBg = BACKGROUND_STYLES.find(b => b.id === bgStyle) || BACKGROUND_STYLES[0];

    // Reset canvas dimensions (High Resolution)
    canvas.width = 800;
    canvas.height = 1000;

    const renderForeground = () => {
      // Draw background glass card container for maximum text legibility
      ctx.fillStyle = 'rgba(26, 20, 9, 0.55)';
      ctx.strokeStyle = 'rgba(212, 160, 23, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(60, 140, 680, 570, 20);
      ctx.fill();
      ctx.stroke();

      // Enable subtle text drop shadow for maximum crispness
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;

      // Draw Card Header
      ctx.fillStyle = '#f5e2b3';
      ctx.textAlign = 'center';
      ctx.font = 'bold 36px Cinzel, Georgia, serif';
      ctx.fillText('iSPEAK & iDECLARE', canvas.width / 2, 90);

      // Draw subtle header divider line
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = 'rgba(212, 160, 23, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(150, 115);
      ctx.lineTo(650, 115);
      ctx.stroke();

      // Reset text shadow for declaration content
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 10;

      // Draw quote marks
      ctx.font = '80px Cormorant Garamond, Georgia, serif';
      ctx.fillStyle = 'rgba(245, 226, 179, 0.4)';
      ctx.fillText('“', 105, 230);

      // Draw declaration text (wrapped)
      ctx.font = 'italic bold 34px Cormorant Garamond, Georgia, serif';
      ctx.fillStyle = '#ffffff';
      const cleanText = text.trim() || "Proclaim your faith today...";
      
      // Process text if name is entered
      let processedText = cleanText;
      if (name.trim()) {
        const pName = name.trim();
        processedText = cleanText
          .replace(/my life/gi, `${pName}'s life`)
          .replace(/\bmy\b/gi, `${pName}'s`)
          .replace(/\bI am\b/gi, `${pName} is`)
          .replace(/\bI have\b/gi, `${pName} has`);
      }

      wrapText(ctx, processedText, canvas.width / 2, 260, 540, 48);

      ctx.font = '80px Cormorant Garamond, Georgia, serif';
      ctx.fillStyle = 'rgba(245, 226, 179, 0.4)';
      ctx.fillText('”', 695, 610);

      // Draw Scripture Reference
      ctx.font = 'bold 26px Plus Jakarta Sans, sans-serif';
      ctx.fillStyle = '#f5e2b3';
      ctx.fillText(ref || 'Scripture Reference', canvas.width / 2, 640);

      // Draw Author Name
      if (name.trim()) {
        ctx.font = 'bold 22px Plus Jakarta Sans, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`Declarant: ${name.trim()}`, canvas.width / 2, 680);
      }

      // Reset shadow for bottom elements
      ctx.shadowColor = 'transparent';

      // Draw QR Code block at the bottom
      const qrSize = 120;
      const qrX = canvas.width / 2 - qrSize / 2;
      const qrY = 750;

      // Draw white QR container background
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 12);
      ctx.fill();

      // Draw QR code image
      const qrCanvas = document.getElementById('decl-qr-code');
      if (qrCanvas) {
        try {
          ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);
        } catch (e) {
          console.log("QR code drawing fallback");
        }
      }

      // Draw footer badge text
      ctx.font = '700 13px Plus Jakarta Sans, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillText('SLAP BIBLE PATTERN CHALLENGE', canvas.width / 2, 930);
      ctx.font = '500 11px Plus Jakarta Sans, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillText('Scan to join the daily scripture declaration movement', canvas.width / 2, 950);
    };

    if (selectedBg.type === 'image' && selectedBg.url) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = selectedBg.url;
      img.onload = () => {
        // Draw background image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // Draw dark tint overlay for readability
        ctx.fillStyle = selectedBg.overlay || 'rgba(26, 20, 9, 0.65)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        renderForeground();
      };
      img.onerror = () => {
        // Fallback gradient if image fails
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, selectedBg.colors[0]);
        gradient.addColorStop(1, selectedBg.colors[1]);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        renderForeground();
      };
    } else {
      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, selectedBg.colors[0]);
      gradient.addColorStop(1, selectedBg.colors[1]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      renderForeground();
    }
  };

  // Text Wrapping Logic for HTML5 Canvas
  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    let words = text.split(' ');
    let line = '';
    let testY = y;

    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = ctx.measureText(testLine);
      let width = metrics.width;

      if (width > maxWidth && n > 0) {
        ctx.fillText(line, x, testY);
        line = words[n] + ' ';
        testY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, testY);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `slap-declaration-${bgStyle}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
  };

  const handleSaveAndShare = async () => {
    setLoading(true);
    try {
      // Save declaration to database history
      await dbService.saveDeclaration({
        text,
        ref,
        backgroundStyle: bgStyle
      });

      // Fetch updated history
      const updatedHistory = await dbService.getDeclarations();
      setHistory(updatedHistory);

      const shareText = `Check out my SLAP Bible Challenge declaration:\n\n"${text}"\nRef: ${ref}\nJoin us at ${window.location.origin}/auth`;

      if (navigator.share) {
        await navigator.share({
          title: 'SLAP Bible Challenge Declaration',
          text: shareText,
          url: window.location.origin
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareText);
        alert('Declaration copied to clipboard! Share it with friends. 📲');
      }
    } catch (err) {
      console.error("Sharing failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '60px' }}>
      
      <section style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '38px', marginBottom: '12px' }}>iSPEAK & iDECLARE</h1>
        <p style={{ maxWidth: '600px', margin: '0 auto' }}>
          Build daily declarations, customize their visual styles, and share beautiful graphics with your friends.
        </p>
      </section>

      <div className="grid-2" style={{ alignItems: 'flex-start' }}>
        {/* Workspace panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Preseeded templates list */}
          <div className="glass-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={18} /> Daily Inspirations</h3>
            <p style={{ fontSize: '13px', marginBottom: '16px' }}>Select a scripture theme to generate your card:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {preseeded.map(d => (
                <button
                  key={d.id}
                  className="btn-secondary"
                  style={{
                    textAlign: 'left',
                    padding: '12px',
                    fontSize: '13px',
                    lineHeight: '1.4',
                    fontWeight: 'normal',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                  onClick={() => selectDeclaration(d)}
                >
                  <span style={{ fontStyle: 'italic' }}>"{d.text.substring(0, 80)}..."</span>
                  <span style={{ fontSize: '11px', color: 'var(--accent-rose)', fontWeight: 'bold' }}>{d.ref}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form customize panel */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3>Customize Your Proclamation</h3>

            <div className="form-group" style={{ margin: 0 }}>
              <label><User size={14} style={{ marginRight: '4px' }} /> Proclaim as (Your Name)</label>
              <input
                type="text"
                placeholder="Enter your name (e.g. David)"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label><BookOpen size={14} style={{ marginRight: '4px' }} /> Scripture Reference</label>
              <input
                type="text"
                value={ref}
                onChange={e => setRef(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label>Declaration Statement</label>
              <textarea
                rows="4"
                value={text}
                onChange={e => setText(e.target.value)}
              />
            </div>

            {/* Background Style Switcher */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Palette size={14} /> Background Style</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginTop: '8px' }}>
                {BACKGROUND_STYLES.map(b => (
                  <button
                    key={b.id}
                    className="btn-secondary"
                    style={{
                      padding: '10px',
                      fontSize: '12px',
                      border: bgStyle === b.id ? '2px solid var(--accent-rose)' : '1px solid var(--border-color)',
                      background: `linear-gradient(135deg, ${b.colors[0]}, ${b.colors[1]})`,
                      color: 'white',
                      textShadow: '0 1px 3px rgba(0,0,0,0.5)'
                    }}
                    onClick={() => setBgStyle(b.id)}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA controls */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button
                className="btn-primary"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                onClick={handleDownload}
              >
                <Download size={16} /> Download JPG
              </button>
              <button
                className="btn-secondary"
                disabled={loading}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                onClick={handleSaveAndShare}
              >
                <Share2 size={16} /> {loading ? 'Saving...' : 'Share Card'}
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Display Card preview */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div className="glass-card" style={{ padding: '16px', display: 'flex', justifyContent: 'center', width: '100%' }}>
            <canvas
              ref={canvasRef}
              style={{
                width: '100%',
                maxWidth: '380px',
                aspectRatio: '8/10',
                borderRadius: '12px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)'
              }}
            />
          </div>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Real-time preview. Custom name updates replace "my" and "I am" terms dynamically!
          </span>
        </div>
      </div>
    </div>
  );
}
