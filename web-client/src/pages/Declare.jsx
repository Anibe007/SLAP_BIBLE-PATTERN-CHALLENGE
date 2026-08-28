import React, { useState, useEffect, useRef } from 'react';
import { dbService, DECLARATION_CATEGORIES } from '../services/db';
import { 
  Sparkles, Download, Share2, Palette, User, BookOpen, Check, 
  Copy, RefreshCw, Heart, Zap, Coins, Cross, Sun, MessageCircle, 
  Layers, Maximize2, Type, Sliders, CheckCircle2, Shield, Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import AnimateOnScroll from '../components/AnimateOnScroll';

// ─── LUXURY WORLD-CLASS THEMES ───
const LUXURY_THEMES = [
  {
    id: 'gilded-obsidian',
    name: '24K Imperial Gold',
    subtitle: 'Midnight Obsidian & Gold Foil',
    category: 'all',
    bg: ['#070605', '#16120c', '#0a0805'],
    glow: 'rgba(212, 160, 23, 0.28)',
    goldPrimary: '#f7d070',
    goldSecondary: '#d4a017',
    textColor: '#fefaf0',
    accentPill: '#b8860b',
    cardBg: 'rgba(18, 14, 10, 0.72)',
    cardBorder: 'rgba(212, 160, 23, 0.45)',
    quoteColor: 'rgba(247, 208, 112, 0.28)'
  },
  {
    id: 'celestial-sapphire',
    name: 'Celestial Faith',
    subtitle: 'Deep Sapphire & Icy Diamond',
    category: 'faith',
    bg: ['#040916', '#0f224a', '#060f24'],
    glow: 'rgba(59, 130, 246, 0.32)',
    goldPrimary: '#93c5fd',
    goldSecondary: '#3b82f6',
    textColor: '#ffffff',
    accentPill: '#2563eb',
    cardBg: 'rgba(10, 20, 45, 0.70)',
    cardBorder: 'rgba(147, 197, 253, 0.45)',
    quoteColor: 'rgba(147, 197, 253, 0.25)'
  },
  {
    id: 'amber-hope',
    name: 'Dawn of Hope',
    subtitle: 'Sunburst Terracotta & Amber',
    category: 'hope',
    bg: ['#180802', '#542007', '#1a0b06'],
    glow: 'rgba(245, 158, 11, 0.32)',
    goldPrimary: '#fde68a',
    goldSecondary: '#f59e0b',
    textColor: '#fffbeb',
    accentPill: '#d97706',
    cardBg: 'rgba(32, 14, 8, 0.70)',
    cardBorder: 'rgba(245, 158, 11, 0.45)',
    quoteColor: 'rgba(253, 230, 138, 0.28)'
  },
  {
    id: 'vital-crimson',
    name: 'Living Vitality',
    subtitle: 'Royal Burgundy & Rose Quartz',
    category: 'health',
    bg: ['#140207', '#50071b', '#1c030b'],
    glow: 'rgba(244, 63, 94, 0.30)',
    goldPrimary: '#fda4af',
    goldSecondary: '#f43f5e',
    textColor: '#ffffff',
    accentPill: '#e11d48',
    cardBg: 'rgba(32, 8, 16, 0.72)',
    cardBorder: 'rgba(251, 113, 133, 0.45)',
    quoteColor: 'rgba(253, 164, 175, 0.25)'
  },
  {
    id: 'covenant-emerald',
    name: 'Imperial Emerald',
    subtitle: 'Velvet Jade & Minted Gold',
    category: 'finance',
    bg: ['#02140e', '#064e3b', '#031f17'],
    glow: 'rgba(16, 185, 129, 0.30)',
    goldPrimary: '#a7f3d0',
    goldSecondary: '#10b981',
    textColor: '#ffffff',
    accentPill: '#059669',
    cardBg: 'rgba(6, 32, 22, 0.72)',
    cardBorder: 'rgba(52, 211, 153, 0.45)',
    quoteColor: 'rgba(167, 243, 208, 0.25)'
  },
  {
    id: 'miraculous-amethyst',
    name: 'Glory Amethyst',
    subtitle: 'Cosmic Violet & Starlight',
    category: 'miracles',
    bg: ['#0c051f', '#3b0764', '#170a30'],
    glow: 'rgba(168, 85, 247, 0.35)',
    goldPrimary: '#e9d5ff',
    goldSecondary: '#a855f7',
    textColor: '#ffffff',
    accentPill: '#7c3aed',
    cardBg: 'rgba(24, 10, 48, 0.72)',
    cardBorder: 'rgba(192, 132, 252, 0.45)',
    quoteColor: 'rgba(233, 213, 255, 0.25)'
  },
  {
    id: 'alabaster-gold',
    name: 'Ivory Marble',
    subtitle: 'Warm Alabaster & Gilded Gold',
    category: 'all',
    bg: ['#fbf9f4', '#eae2d3', '#f6f2e9'],
    glow: 'rgba(184, 134, 11, 0.15)',
    goldPrimary: '#996515',
    goldSecondary: '#b8860b',
    textColor: '#18181b',
    accentPill: '#8c6710',
    cardBg: 'rgba(255, 255, 255, 0.82)',
    cardBorder: 'rgba(184, 134, 11, 0.55)',
    quoteColor: 'rgba(184, 134, 11, 0.20)'
  }
];

const ASPECT_RATIOS = [
  { id: 'portrait', name: 'Feed Post (4:5)', width: 1080, height: 1350, icon: '📱' },
  { id: 'story', name: 'Story / Reel (9:16)', width: 1080, height: 1920, icon: '✨' },
  { id: 'square', name: 'Square Post (1:1)', width: 1080, height: 1080, icon: '⏹' }
];

const FONT_STYLES = [
  { id: 'cormorant', name: 'Cormorant Garamond (Editorial Serif)', family: '"Cormorant Garamond", Georgia, serif' },
  { id: 'cinzel', name: 'Cinzel (Royal Display)', family: '"Cinzel", "Times New Roman", serif' },
  { id: 'jakarta', name: 'Plus Jakarta (Modern Bold)', family: '"Plus Jakarta Sans", "Outfit", sans-serif' }
];

const FRAME_STYLES = [
  { id: 'royal-filigree', name: 'Royal Gold Filigree' },
  { id: 'modern-glow', name: 'Modern Minimalist Glow' },
  { id: 'sacred-arch', name: 'Sacred Temple Double Border' }
];

export default function Declare() {
  const canvasRef = useRef(null);
  const cardContainerRef = useRef(null);

  const [declarations, setDeclarations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('faith');
  const [text, setText] = useState('');
  const [ref, setRef] = useState('');
  const [name, setName] = useState('');
  const [themeId, setThemeId] = useState('gilded-obsidian');
  const [aspectRatio, setAspectRatio] = useState('portrait');
  const [fontStyle, setFontStyle] = useState('cormorant');
  const [frameStyle, setFrameStyle] = useState('royal-filigree');
  const [showParticles, setShowParticles] = useState(true);
  const [showLightAura, setShowLightAura] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // 3D Tilt State
  const [tiltStyle, setTiltStyle] = useState({});

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const declList = await dbService.getPreseededDeclarations();
        setDeclarations(declList);
        
        // Pick first faith declaration
        const faithFirst = declList.find(d => d.category === 'faith') || declList[0];
        if (faithFirst) {
          setText(faithFirst.text);
          setRef(faithFirst.ref);
          setThemeId('celestial-sapphire');
        }
      } catch (err) {
        console.error("Error fetching declarations:", err);
      }
    };
    loadInitialData();
  }, []);

  // Redraw canvas whenever any visual parameters change
  useEffect(() => {
    drawWorldClassCard();
  }, [text, ref, name, themeId, aspectRatio, fontStyle, frameStyle, showParticles, showLightAura, selectedCategory]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    const categoryDecls = declarations.filter(d => d.category === catId);
    if (categoryDecls.length > 0) {
      setText(categoryDecls[0].text);
      setRef(categoryDecls[0].ref);
    }
    // Auto-match background theme to category
    const matchingTheme = LUXURY_THEMES.find(b => b.category === catId);
    if (matchingTheme) {
      setThemeId(matchingTheme.id);
    }
  };

  const selectDeclaration = (decl) => {
    setText(decl.text);
    setRef(decl.ref);
  };

  // ─── SHUFFLE & INSPIRE ME ───
  const handleInspireMe = () => {
    if (declarations.length === 0) return;
    const randomCategory = DECLARATION_CATEGORIES[Math.floor(Math.random() * DECLARATION_CATEGORIES.length)];
    const matchingDecls = declarations.filter(d => d.category === randomCategory.id);
    const chosenDecl = matchingDecls[Math.floor(Math.random() * matchingDecls.length)] || declarations[Math.floor(Math.random() * declarations.length)];
    
    setSelectedCategory(chosenDecl.category || randomCategory.id);
    setText(chosenDecl.text);
    setRef(chosenDecl.ref);

    // Pick a random luxury theme
    const randomTheme = LUXURY_THEMES[Math.floor(Math.random() * LUXURY_THEMES.length)];
    setThemeId(randomTheme.id);

    // Fire celebratory stardust confetti
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#d4a017', '#f7d070', '#ffffff', '#3b82f6', '#10b981']
    });

    setToastMessage('✨ Inspired with a new powerful proclamation!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  // ─── 3D PERSPECTIVE TILT HOVER HANDLERS ───
  const handleMouseMove = (e) => {
    if (!cardContainerRef.current) return;
    const rect = cardContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTiltStyle({
      transform: `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.015)`,
      '--glare-x': `${glareX}%`,
      '--glare-y': `${glareY}%`
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'rotateX(0deg) rotateY(0deg) scale(1)',
      '--glare-x': '50%',
      '--glare-y': '50%'
    });
  };

  // ─── WORLD-CLASS HIGH-RES CANVAS RENDERING ENGINE ───
  const drawWorldClassCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const theme = LUXURY_THEMES.find(t => t.id === themeId) || LUXURY_THEMES[0];
    const ratio = ASPECT_RATIOS.find(r => r.id === aspectRatio) || ASPECT_RATIOS[0];
    const fontObj = FONT_STYLES.find(f => f.id === fontStyle) || FONT_STYLES[0];

    // Set High-DPI Canvas Dimensions
    canvas.width = ratio.width;
    canvas.height = ratio.height;

    const W = canvas.width;
    const H = canvas.height;

    // 1. Draw Multi-Layered Luxury Gradient Background
    const bgGradient = ctx.createLinearGradient(0, 0, W, H);
    bgGradient.addColorStop(0, theme.bg[0]);
    bgGradient.addColorStop(0.5, theme.bg[1] || theme.bg[0]);
    bgGradient.addColorStop(1, theme.bg[2] || theme.bg[1]);
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, W, H);

    // 2. Draw Divine Radial Light Halo (Sacred Aura)
    if (showLightAura) {
      const auraGradient = ctx.createRadialGradient(W / 2, H * 0.38, 50, W / 2, H * 0.38, W * 0.65);
      auraGradient.addColorStop(0, theme.glow);
      auraGradient.addColorStop(0.5, theme.glow.replace(/[\d.]+\)$/, '0.08)'));
      auraGradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = auraGradient;
      ctx.fillRect(0, 0, W, H);

      // Top sunbeam aura
      const topBeam = ctx.createRadialGradient(W / 2, 0, 10, W / 2, 0, W * 0.5);
      topBeam.addColorStop(0, theme.glow);
      topBeam.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = topBeam;
      ctx.fillRect(0, 0, W, H);
    }

    // 3. Draw Atmospheric Stardust Particles & Golden Sparkles
    if (showParticles) {
      // Deterministic particle positions based on text length for visual stability
      const seed = (text.length * 37 + 13);
      for (let i = 0; i < 36; i++) {
        const px = ((seed * (i + 1) * 7919) % 1000) / 1000 * (W - 120) + 60;
        const py = ((seed * (i + 1) * 6271) % 1000) / 1000 * (H - 120) + 60;
        const radius = (((i * 17) % 4) + 1.2);
        const opacity = (((i * 23) % 6) + 3) / 10;

        ctx.fillStyle = theme.id === 'alabaster-gold' ? `rgba(184, 134, 11, ${opacity * 0.6})` : `rgba(255, 255, 255, ${opacity * 0.75})`;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();

        // Add 4-point cross glimmer to select particles
        if (i % 6 === 0) {
          ctx.strokeStyle = theme.goldPrimary;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(px - 6, py);
          ctx.lineTo(px + 6, py);
          ctx.moveTo(px, py - 6);
          ctx.lineTo(px, py + 6);
          ctx.stroke();
        }
      }
    }

    // 4. Draw World-Class Ornate Borders & Filigree Frame
    const margin = 48;
    const innerMargin = 64;

    if (frameStyle === 'royal-filigree') {
      // Outer Gilded Metallic Border
      ctx.strokeStyle = theme.goldSecondary;
      ctx.lineWidth = 3.5;
      ctx.strokeRect(margin, margin, W - margin * 2, H - margin * 2);

      // Inner Hairline Frame
      ctx.strokeStyle = theme.id === 'alabaster-gold' ? 'rgba(184, 134, 11, 0.35)' : 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(innerMargin, innerMargin, W - innerMargin * 2, H - innerMargin * 2);

      // 4 Sacred Corner Filigree Ornaments
      const drawCornerFiligree = (cx, cy, dirX, dirY) => {
        ctx.strokeStyle = theme.goldPrimary;
        ctx.lineWidth = 3;
        ctx.beginPath();
        // Corner bracket
        ctx.moveTo(cx, cy + 36 * dirY);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx + 36 * dirX, cy);
        ctx.stroke();

        // Inner decorative diamond
        ctx.fillStyle = theme.goldSecondary;
        ctx.beginPath();
        const dx = cx + 18 * dirX;
        const dy = cy + 18 * dirY;
        ctx.moveTo(dx, dy - 6);
        ctx.lineTo(dx + 6, dy);
        ctx.lineTo(dx, dy + 6);
        ctx.lineTo(dx - 6, dy);
        ctx.closePath();
        ctx.fill();

        // Flourish line
        ctx.strokeStyle = theme.goldPrimary;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx + 46 * dirX, cy);
        ctx.lineTo(cx + 12 * dirX, cy);
        ctx.lineTo(cx, cy + 12 * dirY);
        ctx.lineTo(cx, cy + 46 * dirY);
        ctx.stroke();
      };

      drawCornerFiligree(innerMargin + 8, innerMargin + 8, 1, 1);
      drawCornerFiligree(W - innerMargin - 8, innerMargin + 8, -1, 1);
      drawCornerFiligree(innerMargin + 8, H - innerMargin - 8, 1, -1);
      drawCornerFiligree(W - innerMargin - 8, H - innerMargin - 8, -1, -1);

    } else if (frameStyle === 'modern-glow') {
      // Modern Glass Border with dynamic corner rounding
      ctx.strokeStyle = theme.goldPrimary;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(margin, margin, W - margin * 2, H - margin * 2, 28);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(margin + 14, margin + 14, W - (margin + 14) * 2, H - (margin + 14) * 2, 20);
      ctx.stroke();
    } else {
      // Sacred Temple Double Line
      ctx.strokeStyle = theme.goldSecondary;
      ctx.lineWidth = 4;
      ctx.strokeRect(margin, margin, W - margin * 2, H - margin * 2);

      ctx.strokeStyle = theme.goldPrimary;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(margin + 10, margin + 10, W - (margin + 10) * 2, H - (margin + 10) * 2);
    }

    // 5. Draw Top Crown & Brand Emblem
    const topCenterY = H > 1400 ? 160 : (H < 1200 ? 125 : 140);

    // Gilded Crown Crest
    ctx.fillStyle = theme.goldPrimary;
    ctx.font = '24px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.fillText('♦ ─── ❖ ─── ♦', W / 2, topCenterY - 38);

    // Top Main Header: iSPEAK & iDECLARE
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;

    ctx.fillStyle = theme.goldPrimary;
    ctx.font = 'bold 44px "Cinzel", Georgia, serif';
    ctx.fillText('iSPEAK & iDECLARE', W / 2, topCenterY + 12);

    // 6. Category Pill Badge with Icon
    const catObj = DECLARATION_CATEGORIES.find(c => c.id === selectedCategory) || DECLARATION_CATEGORIES[0];
    const categoryY = topCenterY + 68;

    // Badge Pill Background
    const badgeText = `${catObj.icon}  ${catObj.name.toUpperCase()} PROCLAMATION`;
    ctx.font = 'bold 20px "Plus Jakarta Sans", "Inter", sans-serif';
    const badgeWidth = ctx.measureText(badgeText).width + 50;
    
    ctx.fillStyle = theme.id === 'alabaster-gold' ? 'rgba(184, 134, 11, 0.12)' : 'rgba(255, 255, 255, 0.1)';
    ctx.strokeStyle = theme.goldPrimary;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(W / 2 - badgeWidth / 2, categoryY - 22, badgeWidth, 38, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = theme.textColor;
    ctx.fillText(badgeText, W / 2, categoryY + 4);

    // 7. Center Elevated Glass Container (Plaque)
    const glassTop = categoryY + 45;
    const glassBottom = H > 1400 ? H - 280 : (H < 1200 ? H - 210 : H - 240);
    const glassHeight = glassBottom - glassTop;
    const glassWidth = W - 190;
    const glassX = 95;

    ctx.fillStyle = theme.cardBg;
    ctx.strokeStyle = theme.cardBorder;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(glassX, glassTop, glassWidth, glassHeight, 24);
    ctx.fill();
    ctx.stroke();

    // 8. Large Editorial Quotation Marks
    ctx.font = 'bold 120px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = theme.quoteColor;
    ctx.textAlign = 'left';
    ctx.fillText('“', glassX + 35, glassTop + 100);

    ctx.textAlign = 'right';
    ctx.fillText('”', glassX + glassWidth - 35, glassBottom - 50);

    // 9. Format Personalized Text
    let processedText = text.trim() || "Proclaim your faith in God's promises today...";
    if (name.trim()) {
      const pName = name.trim();
      processedText = processedText
        .replace(/\bmy life\b/gi, `${pName}'s life`)
        .replace(/\bmy\b/gi, `${pName}'s`)
        .replace(/\bI am\b/gi, `${pName} is`)
        .replace(/\bI have\b/gi, `${pName} has`)
        .replace(/\bI walk\b/gi, `${pName} walks`)
        .replace(/\bme\b/gi, pName);
    }

    // Dynamic Typography Sizing based on text length
    let fontSize = 42;
    let lineHeight = 58;
    if (processedText.length < 80) {
      fontSize = 50;
      lineHeight = 68;
    } else if (processedText.length > 220) {
      fontSize = 34;
      lineHeight = 48;
    } else if (processedText.length > 150) {
      fontSize = 38;
      lineHeight = 52;
    }

    ctx.font = `italic 600 ${fontSize}px ${fontObj.family}`;
    ctx.fillStyle = theme.textColor;
    ctx.textAlign = 'center';

    const maxTextWidth = glassWidth - 110;
    const textStartY = glassTop + (glassHeight * 0.32);

    wrapText(ctx, processedText, W / 2, textStartY, maxTextWidth, lineHeight);

    // 10. Scripture Reference Ribbon / Banner
    const refY = glassBottom - 85;
    ctx.shadowColor = 'transparent';

    // Fine gold divider
    ctx.strokeStyle = theme.goldPrimary;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 160, refY - 26);
    ctx.lineTo(W / 2 + 160, refY - 26);
    ctx.stroke();

    ctx.font = 'bold 30px "Cinzel", "Plus Jakarta Sans", serif';
    ctx.fillStyle = theme.goldPrimary;
    ctx.fillText(`—  ${(ref || 'Scripture Reference').toUpperCase()}  —`, W / 2, refY + 4);

    // 11. Personalized Proclamation Signature
    if (name.trim()) {
      const sigY = glassBottom - 26;
      ctx.font = '600 24px "Plus Jakarta Sans", "Inter", sans-serif';
      ctx.fillStyle = theme.id === 'alabaster-gold' ? '#3f3f46' : 'rgba(255, 255, 255, 0.9)';
      ctx.fillText(`PROCLAIMED IN FAITH BY ${name.trim().toUpperCase()}  ✓`, W / 2, sigY);
    }

    // 12. Footer Branding & Verified Movement Seal
    const footerY = H - 90;
    
    // Slap Brand Title
    ctx.font = 'bold 24px "Cinzel", Georgia, serif';
    ctx.fillStyle = theme.goldPrimary;
    ctx.fillText('SLAP BIBLE CHALLENGE', W / 2, footerY);

    // Official Tagline
    ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = theme.id === 'alabaster-gold' ? '#71717a' : 'rgba(255, 255, 255, 0.65)';
    ctx.fillText('Build People. Build Faith. Build on Christ.', W / 2, footerY + 28);

    // Verified Hallmark / Web link
    ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = theme.goldSecondary;
    ctx.fillText('✦  SLAPBIBLE.ORG  ✦', W / 2, footerY + 52);
  };

  // Text wrap utility for Canvas
  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(' ');
    let line = '';
    let testY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const width = metrics.width;

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

  // ─── DOWNLOAD HIGH-RES PNG ───
  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    const safeCategory = selectedCategory.toLowerCase();
    link.download = `SLAP-${safeCategory}-Declaration-${aspectRatio}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();

    // Fire golden celebration confetti
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#d4a017', '#f7d070', '#ffffff', '#3b82f6']
    });

    setToastMessage('🎉 High-Resolution Declaration Card Downloaded!');
    setTimeout(() => setToastMessage(''), 3500);
  };

  // ─── COPY IMAGE TO CLIPBOARD (DIRECT PASTE) ───
  const handleCopyImageToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      if (navigator.clipboard && window.ClipboardItem) {
        canvas.toBlob(async (blob) => {
          if (blob) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            setToastMessage('📋 Card Image copied! Paste (Ctrl+V) directly into WhatsApp, Twitter, or Slack!');
            setTimeout(() => setToastMessage(''), 4000);
          }
        }, 'image/png');
      } else {
        // Fallback: Copy formatted text
        await navigator.clipboard.writeText(`“${text}” — ${ref}\n\nProclaimed on SLAP Bible Challenge: ${window.location.origin}`);
        setToastMessage('📋 Declaration text copied to clipboard!');
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (err) {
      console.warn("Direct clipboard image copy not permitted by browser, copying text fallback:", err);
      await navigator.clipboard.writeText(`“${text}” — ${ref}\n\nProclaimed on SLAP Bible Challenge: ${window.location.origin}`);
      setToastMessage('📋 Declaration text copied to clipboard!');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  // ─── SHARE TO WHATSAPP ───
  const handleShareToWhatsApp = () => {
    const pName = name.trim() ? `\n— Proclaimed by: *${name.trim()}*` : '';
    const shareMessage = `✦ *iSPEAK & iDECLARE* (${selectedCategory.toUpperCase()}) ✦\n\n“${text}”\n\n📖 *Scripture Reference:* ${ref}${pName}\n\nJoin the *SLAP Bible Challenge* and speak the Word daily:\n👉 ${window.location.origin}/declare`;
    
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // ─── NATIVE SHARE / SAVE ───
  const handleShareCard = async () => {
    setLoading(true);
    try {
      await dbService.saveDeclaration({
        text,
        ref,
        category: selectedCategory,
        backgroundStyle: themeId
      });

      const shareText = `✦ SLAP BIBLE DECLARATION (${selectedCategory.toUpperCase()})\n\n"${text}"\n\nScripture: ${ref}\n\nJoin the SLAP Bible Challenge: ${window.location.origin}`;

      if (navigator.share) {
        await navigator.share({
          title: `SLAP ${selectedCategory.toUpperCase()} Declaration`,
          text: shareText,
          url: window.location.origin
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        setToastMessage('Declaration copied to clipboard! 📋');
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (err) {
      console.error("Share failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const activeCategoryDeclarations = declarations.filter(d => d.category === selectedCategory);

  return (
    <div className="section-container" style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 24px 70px' }}>
      
      {/* Page Header */}
      <AnimateOnScroll animation="fadeUp">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '30px', background: 'rgba(212, 160, 23, 0.12)', border: '1px solid var(--accent-gold)', marginBottom: '12px' }}>
            <Sparkles size={16} style={{ color: 'var(--accent-gold)' }} />
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--accent-gold)', letterSpacing: '1.2px', textTransform: 'uppercase' }}>
              World-Class Scriptural Proclamations Studio
            </span>
          </div>
          <h1 style={{ fontSize: '38px', margin: '8px 0', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            iSPEAK &amp; iDECLARE <span className="gradient-text">Studio</span>
          </h1>
          <p style={{ maxWidth: '680px', margin: '0 auto', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Create breathtaking, social-media ready proclamation cards with 24K gold foil aesthetics, customizable typography, and instant one-click sharing.
          </p>
        </div>
      </AnimateOnScroll>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification" style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'fixed', bottom: '28px', right: '28px', zIndex: 1200, background: 'var(--bg-card)', border: '1px solid var(--accent-gold)', padding: '14px 22px', borderRadius: '10px', boxShadow: '0 12px 35px rgba(0,0,0,0.6)' }}>
          <CheckCircle2 size={22} style={{ color: 'var(--accent-gold)' }} />
          <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{toastMessage}</span>
        </div>
      )}

      {/* Top Action Bar: 6 Categories + Quick Shuffle "Inspire Me" */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '28px' }}>
        
        {/* 6 Category Selector Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {DECLARATION_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className="studio-tab-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                borderRadius: '30px',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                border: selectedCategory === cat.id ? `2px solid ${cat.color}` : '1px solid var(--border-color)',
                background: selectedCategory === cat.id ? `${cat.color}25` : 'var(--bg-card)',
                color: selectedCategory === cat.id ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: selectedCategory === cat.id ? `0 0 16px ${cat.color}50` : 'none'
              }}
            >
              <span style={{ color: cat.color }}>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Quick Shuffle "Inspire Me" Button */}
        <button
          onClick={handleInspireMe}
          className="btn-secondary gold-shine-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: '30px',
            fontSize: '13px',
            fontWeight: '700',
            borderColor: 'var(--accent-gold)',
            color: 'var(--accent-gold)'
          }}
          title="Randomly pick an uplifting declaration and matching theme"
        >
          <RefreshCw size={15} /> Inspire Me
        </button>
      </div>

      <div className="grid-2" style={{ alignItems: 'flex-start', gap: '32px' }}>
        
        {/* ════════ LEFT COLUMN: STUDIO CONTROLS & PICKERS ════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Card Dimensions & Aspect Ratio Switcher */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              <Maximize2 size={16} style={{ color: 'var(--accent-gold)' }} />
              Card Canvas Aspect Ratio
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {ASPECT_RATIOS.map(r => (
                <button
                  key={r.id}
                  onClick={() => setAspectRatio(r.id)}
                  className="ratio-btn"
                  style={{
                    justifyContent: 'center',
                    border: aspectRatio === r.id ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                    background: aspectRatio === r.id ? 'rgba(212, 160, 23, 0.15)' : 'var(--bg-secondary)',
                    color: aspectRatio === r.id ? 'var(--accent-gold)' : 'var(--text-secondary)'
                  }}
                >
                  <span>{r.icon}</span>
                  <span>{r.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Declarations Picker for Active Category */}
          <div className="glass-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} style={{ color: 'var(--accent-gold)' }} />
                Curated {DECLARATION_CATEGORIES.find(c => c.id === selectedCategory)?.name} Declarations
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {activeCategoryDeclarations.length} available
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '220px', overflowY: 'auto', paddingRight: '4px' }}>
              {activeCategoryDeclarations.map(d => (
                <button
                  key={d.id}
                  onClick={() => selectDeclaration(d)}
                  className="btn-secondary"
                  style={{
                    textAlign: 'left',
                    padding: '12px 14px',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    borderColor: text === d.text ? 'var(--accent-gold)' : 'var(--border-color)',
                    background: text === d.text ? 'rgba(212, 160, 23, 0.12)' : 'var(--bg-secondary)'
                  }}
                >
                  <span style={{ fontStyle: 'italic', color: 'var(--text-primary)' }}>"{d.text}"</span>
                  <span style={{ fontSize: '12px', color: 'var(--accent-gold)', fontWeight: '700' }}>{d.ref}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Card Text & Participant Personalization */}
          <div className="glass-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: '16px' }}>Personalization &amp; Scripture</h3>

            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                <User size={14} style={{ color: 'var(--accent-gold)' }} /> Proclaim as (Participant Name)
              </label>
              <input
                type="text"
                placeholder="Enter your name (e.g. Kezia, David, Grace)"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ fontSize: '14px' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', display: 'block' }}>
                💡 Automatically personalizes declaration pronouns (e.g. "my life" → "Kezia's life")
              </span>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                <BookOpen size={14} style={{ color: 'var(--accent-gold)' }} /> Scripture Reference
              </label>
              <input
                type="text"
                value={ref}
                onChange={e => setRef(e.target.value)}
                placeholder="e.g. Romans 8:37, Psalm 119:105"
                style={{ fontSize: '14px' }}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '13px' }}>Custom Declaration Content</label>
              <textarea
                rows="3"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Type or customize your personal faith proclamation..."
                style={{ fontSize: '14px', lineHeight: '1.5' }}
              />
            </div>
          </div>

          {/* Luxury Visual Themes & Typography Selectors */}
          <div className="glass-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Palette size={16} style={{ color: 'var(--accent-gold)' }} />
              Luxury Theme &amp; Typography
            </h3>

            {/* Themes Palette */}
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                Select Master Visual Theme:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: '8px' }}>
                {LUXURY_THEMES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setThemeId(t.id)}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: t.id === 'alabaster-gold' ? '#18181b' : '#ffffff',
                      cursor: 'pointer',
                      background: `linear-gradient(135deg, ${t.bg[0]}, ${t.bg[1] || t.bg[0]})`,
                      border: themeId === t.id ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.15)',
                      boxShadow: themeId === t.id ? '0 0 12px rgba(212, 160, 23, 0.6)' : 'none',
                      transition: 'all 0.2s ease',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ fontWeight: '800' }}>{t.name}</div>
                    <div style={{ fontSize: '9px', opacity: 0.8, marginTop: '2px' }}>{t.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Typography Font Choice */}
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                Declaration Font Style:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
                {FONT_STYLES.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFontStyle(f.id)}
                    className="font-choice-btn"
                    style={{
                      border: fontStyle === f.id ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                      background: fontStyle === f.id ? 'rgba(212, 160, 23, 0.12)' : 'var(--bg-secondary)',
                      color: fontStyle === f.id ? 'var(--accent-gold)' : 'var(--text-primary)'
                    }}
                  >
                    <div style={{ fontWeight: '700', fontFamily: f.family }}>{f.name.split('(')[0]}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{f.name.split('(')[1]?.replace(')', '')}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Ornaments & Visual Toggles */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showParticles}
                  onChange={e => setShowParticles(e.target.checked)}
                />
                <span>Golden Stardust ✨</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showLightAura}
                  onChange={e => setShowLightAura(e.target.checked)}
                />
                <span>Divine Light Aura ☼</span>
              </label>
            </div>
          </div>

        </div>

        {/* ════════ RIGHT COLUMN: LIVE 3D PERSPECTIVE CARD & EXPORT ECOSYSTEM ════════ */}
        <div style={{ position: 'sticky', top: '90px' }}>
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
            
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="animate-spin" style={{ color: 'var(--accent-gold)', fontSize: '14px' }}>✦</span>
                <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Live 3D Card Studio
                </span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '4px 10px', borderRadius: '12px' }}>
                {ASPECT_RATIOS.find(r => r.id === aspectRatio)?.name}
              </span>
            </div>

            {/* 3D Perspective Card Container */}
            <div
              ref={cardContainerRef}
              className="card-tilt-container"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className="card-tilt-inner"
                style={{
                  ...tiltStyle,
                  width: '100%',
                  maxWidth: aspectRatio === 'story' ? '320px' : (aspectRatio === 'square' ? '400px' : '380px'),
                  aspectRatio: aspectRatio === 'story' ? '9 / 16' : (aspectRatio === 'square' ? '1 / 1' : '4 / 5'),
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 25px rgba(212, 160, 23, 0.15)'
                }}
              >
                <div className="card-tilt-glare" />
                <canvas
                  ref={canvasRef}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '16px',
                    display: 'block'
                  }}
                />
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', width: '100%' }}>
              <button
                onClick={handleDownloadImage}
                className="btn-primary gold-shine-btn"
                style={{
                  padding: '14px',
                  fontSize: '13px',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'var(--accent-gold)',
                  color: '#1a1409',
                  borderRadius: '8px'
                }}
              >
                <Download size={16} /> Download HD Image
              </button>

              <button
                onClick={handleCopyImageToClipboard}
                className="btn-secondary"
                style={{
                  padding: '14px',
                  fontSize: '13px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: '8px'
                }}
                title="Copy image directly to clipboard for pasting into WhatsApp, Instagram, or Slack"
              >
                <Copy size={16} /> Copy Image
              </button>
            </div>

            {/* Secondary Sharing Channels */}
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <button
                onClick={handleShareToWhatsApp}
                style={{
                  flex: 1,
                  padding: '12px',
                  fontSize: '12px',
                  fontWeight: '700',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#25D366',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <MessageCircle size={15} /> WhatsApp Share
              </button>

              <button
                onClick={handleShareCard}
                disabled={loading}
                className="btn-secondary"
                style={{
                  flex: 1,
                  padding: '12px',
                  fontSize: '12px',
                  fontWeight: '700',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Share2 size={15} /> {loading ? 'Saving...' : 'Social Share'}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
