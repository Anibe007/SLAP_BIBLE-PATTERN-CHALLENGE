import React, { useState, useEffect, useRef } from 'react';
import { dbService } from '../services/db';
import { Sparkles, Download, Share2, RefreshCw, Palette, User, BookOpen } from 'lucide-react';

const BACKGROUND_STYLES = [
  { id: 'royal-gold', name: 'Royal Gold', colors: ['#b8860b', '#d4a017'] },
  { id: 'warm-amber', name: 'Warm Amber', colors: ['#5c4a32', '#8c6d46'] },
  { id: 'deep-bronze', name: 'Deep Bronze', colors: ['#2e2518', '#1a1409'] },
  { id: 'rose-gold', name: 'Rose Gold', colors: ['#b8433d', '#d4a017'] }
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

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, selectedBg.colors[0]);
    gradient.addColorStop(1, selectedBg.colors[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw styling overlay (subtle circle designs for premium feel)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.beginPath();
    ctx.arc(0, 0, 400, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(canvas.width, canvas.height, 500, 0, Math.PI * 2);
    ctx.fill();

    // Draw Card Header
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 36px Outfit, Inter, sans-serif';
    ctx.fillText('I SPEAK & I DECLARE', canvas.width / 2, 90);

    // Draw subtle divider line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, 130);
    ctx.lineTo(650, 130);
    ctx.stroke();

    // Draw quote marks
    ctx.font = '80px Georgia, serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillText('“', 100, 260);

    // Draw declaration text (wrapped)
    ctx.font = 'italic 32px Outfit, Inter, sans-serif';
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

    wrapText(ctx, processedText, canvas.width / 2, 280, 580, 42);

    ctx.font = '80px Georgia, serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillText('”', 700, 620);

    // Draw Scripture Reference
    ctx.font = 'bold 26px Outfit, Inter, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillText(ref || 'Scripture Reference', canvas.width / 2, 650);

    // Draw Author Name
    if (name.trim()) {
      ctx.font = 'bold 24px Outfit, Inter, sans-serif';
      ctx.fillStyle = 'var(--accent-gold)';
      ctx.fillText(`Declarant: ${name.trim()}`, canvas.width / 2, 700);
    }

    // Draw QR Code block at the bottom
    const qrSize = 120;
    const qrX = canvas.width / 2 - qrSize / 2;
    const qrY = 760;

    // Draw white QR container background
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 12);
    ctx.fill();

    // Load QR Image
    const shareUrl = window.location.origin + '/auth';
    const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareUrl)}`;
    
    const qrImg = new Image();
    qrImg.crossOrigin = 'anonymous';
    qrImg.src = qrSrc;
    qrImg.onload = () => {
      // Draw image once loaded. We avoid infinite loop by using a state latch
      if (!qrLoaded) {
        setQrLoaded(true);
      }
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
    };

    // Draw QR Code text prompt
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.font = 'bold 16px Outfit, Inter, sans-serif';
    ctx.fillText('Scan to join SLAP Bible Challenge', canvas.width / 2, 940);
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
