import React, { useState, useEffect, useRef } from 'react';
import { dbService, DECLARATION_CATEGORIES } from '../services/db';
import { 
  Sparkles, Download, Share2, Palette, User, BookOpen, Check, 
  Copy, RefreshCw, Heart, Zap, Coins, Cross, Sun, MessageCircle, 
  Layers, Maximize2, Type, Sliders, CheckCircle2, Shield, Flame,
  Image as ImageIcon, Upload, Eye, SlidersHorizontal
} from 'lucide-react';
import confetti from 'canvas-confetti';
import AnimateOnScroll from '../components/AnimateOnScroll';
import CelebrationModal from '../components/CelebrationModal';

// ─── CURATED HIGH-RESOLUTION SPIRITUAL BACKGROUND IMAGES ───
const IMAGE_BACKGROUNDS = [
  {
    id: 'altar-bible',
    name: 'Sanctuary Open Bible',
    subtitle: 'Holy Scripture on Cathedral Altar',
    category: 'faith',
    url: '/bg-sanctuary.png',
    tint: 'rgba(12, 8, 4, 0.42)',
    badge: '★ Exact Match'
  },
  {
    id: 'golden-sanctuary',
    name: 'Golden Sanctuary',
    subtitle: 'Cathedral Archways & Radiant Light',
    category: 'all',
    url: '/bg-sanctuary.png',
    tint: 'rgba(10, 6, 2, 0.45)',
    badge: 'Popular'
  },
  {
    id: 'dawn-sunrise',
    name: 'Dawn of Glory',
    subtitle: 'Majestic Mountain Summit Sunrise',
    category: 'hope',
    url: '/bg-sunrise.png',
    tint: 'rgba(16, 6, 2, 0.40)',
    badge: 'Uplifting'
  },
  {
    id: 'sacred-prayer',
    name: 'Sacred Solitude',
    subtitle: 'Prayer & Communion in Divine Presence',
    category: 'health',
    url: '/bg-prayer.png',
    tint: 'rgba(15, 8, 12, 0.45)',
    badge: 'Peace'
  },
  {
    id: 'slap-community',
    name: 'Kingdom Fellowship',
    subtitle: 'Faith Community & Discipleship',
    category: 'finance',
    url: '/slap-community.png',
    tint: 'rgba(6, 18, 12, 0.45)',
    badge: 'Unity'
  },
  {
    id: 'slap-journal',
    name: 'Scripture Journal',
    subtitle: 'Daily Word & Devotional Study',
    category: 'miracles',
    url: '/slap-journal.png',
    tint: 'rgba(16, 10, 4, 0.45)',
    badge: 'Study'
  }
];

// ─── LUXURY WORLD-CLASS METALLIC GRADIENT THEMES ───
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
    textColor: '#ffffff',
    cardBg: 'rgba(18, 14, 10, 0.72)',
    cardBorder: 'rgba(212, 160, 23, 0.55)',
    quoteColor: 'rgba(247, 208, 112, 0.45)'
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
    cardBg: 'rgba(10, 20, 45, 0.72)',
    cardBorder: 'rgba(147, 197, 253, 0.55)',
    quoteColor: 'rgba(147, 197, 253, 0.45)'
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
    cardBg: 'rgba(32, 14, 8, 0.72)',
    cardBorder: 'rgba(245, 158, 11, 0.55)',
    quoteColor: 'rgba(253, 230, 138, 0.45)'
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
    cardBg: 'rgba(32, 8, 16, 0.72)',
    cardBorder: 'rgba(251, 113, 133, 0.55)',
    quoteColor: 'rgba(253, 164, 175, 0.45)'
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
    cardBg: 'rgba(6, 32, 22, 0.72)',
    cardBorder: 'rgba(52, 211, 153, 0.55)',
    quoteColor: 'rgba(167, 243, 208, 0.45)'
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
    cardBg: 'rgba(24, 10, 48, 0.72)',
    cardBorder: 'rgba(192, 132, 252, 0.55)',
    quoteColor: 'rgba(233, 213, 255, 0.45)'
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
    cardBg: 'rgba(255, 255, 255, 0.85)',
    cardBorder: 'rgba(184, 134, 11, 0.65)',
    quoteColor: 'rgba(184, 134, 11, 0.35)'
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

const DEFAULT_DECLARATION = {
  text: "The blessings of God are on my life and empower me to prosper. The favor of God produces divine opportunities to make it happen. Because the Holy Spirit that is in me guides my steps, I am always at the right place at the right time.",
  ref: "Deuteronomy 28:8, Psalm 5:12",
  name: ""
};

export default function Declare() {
  const canvasRef = useRef(null);
  const cardContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageCacheRef = useRef({});

  const [declarations, setDeclarations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('faith');
  const [text, setText] = useState(DEFAULT_DECLARATION.text);
  const [ref, setRef] = useState(DEFAULT_DECLARATION.ref);
  const [name, setName] = useState(DEFAULT_DECLARATION.name);

  // Background System States
  const [bgMode, setBgMode] = useState('image'); // 'image' | 'gradient' | 'custom'
  const [selectedImageBgId, setSelectedImageBgId] = useState('altar-bible');
  const [customImageUrl, setCustomImageUrl] = useState(null);
  const [themeId, setThemeId] = useState('gilded-obsidian');
  const [overlayDarkness, setOverlayDarkness] = useState(0.48); // 0.2 to 0.8

  // Visual parameters
  const [aspectRatio, setAspectRatio] = useState('portrait');
  const [fontStyle, setFontStyle] = useState('cormorant');
  const [showParticles, setShowParticles] = useState(false);
  const [showLightAura, setShowLightAura] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [celebrationData, setCelebrationData] = useState(null);
  
  // 3D Tilt State
  const [tiltStyle, setTiltStyle] = useState({});

  // Pre-load declarations
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const declList = await dbService.getPreseededDeclarations();
        setDeclarations(declList);
      } catch (err) {
        console.error("Error fetching declarations:", err);
      }
    };
    loadInitialData();
  }, []);

  // Preload Image helper
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      if (imageCacheRef.current[src]) {
        resolve(imageCacheRef.current[src]);
        return;
      }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imageCacheRef.current[src] = img;
        resolve(img);
      };
      img.onerror = (err) => reject(err);
      img.src = src;
    });
  };

  // Redraw canvas whenever any visual parameter changes
  useEffect(() => {
    drawCard();
  }, [
    text, ref, name, bgMode, selectedImageBgId, customImageUrl, themeId, 
    overlayDarkness, aspectRatio, fontStyle, showParticles, showLightAura, selectedCategory
  ]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    const categoryDecls = declarations.filter(d => d.category === catId);
    if (categoryDecls.length > 0) {
      setText(categoryDecls[0].text);
      setRef(categoryDecls[0].ref);
    }
  };

  const selectDeclaration = (decl) => {
    setText(decl.text);
    setRef(decl.ref);
  };

  // Custom Image Upload Handler
  const handleCustomImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) {
        setCustomImageUrl(dataUrl);
        setBgMode('custom');
        setToastMessage('✨ Custom background image applied!');
        setTimeout(() => setToastMessage(''), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  // Shuffle & Inspire Me
  const handleInspireMe = () => {
    if (declarations.length === 0) return;
    const randomCategory = DECLARATION_CATEGORIES[Math.floor(Math.random() * DECLARATION_CATEGORIES.length)];
    const matchingDecls = declarations.filter(d => d.category === randomCategory.id);
    const chosenDecl = matchingDecls[Math.floor(Math.random() * matchingDecls.length)] || declarations[Math.floor(Math.random() * declarations.length)];
    
    setSelectedCategory(chosenDecl.category || randomCategory.id);
    setText(chosenDecl.text);
    setRef(chosenDecl.ref);

    // Randomize background image or theme
    if (Math.random() > 0.4) {
      const randomBg = IMAGE_BACKGROUNDS[Math.floor(Math.random() * IMAGE_BACKGROUNDS.length)];
      setSelectedImageBgId(randomBg.id);
      setBgMode('image');
    } else {
      const randomTheme = LUXURY_THEMES[Math.floor(Math.random() * LUXURY_THEMES.length)];
      setThemeId(randomTheme.id);
      setBgMode('gradient');
    }

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#d4a017', '#f7d070', '#ffffff', '#3b82f6', '#10b981']
    });

    setToastMessage('✨ Inspired with a new powerful proclamation!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  // 3D Tilt Hover
  const handleMouseMove = (e) => {
    if (!cardContainerRef.current) return;
    const rect = cardContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    });
  };

  // ─── MASTER CANVAS RENDERING ENGINE (EXACT MATCH TO REFERENCE DESIGN) ───
  const drawCard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const ratio = ASPECT_RATIOS.find(r => r.id === aspectRatio) || ASPECT_RATIOS[0];
    const theme = LUXURY_THEMES.find(t => t.id === themeId) || LUXURY_THEMES[0];
    const fontObj = FONT_STYLES.find(f => f.id === fontStyle) || FONT_STYLES[0];

    canvas.width = ratio.width;
    canvas.height = ratio.height;

    const W = canvas.width;
    const H = canvas.height;

    // 1. DRAW BACKGROUND
    if (bgMode === 'image' || bgMode === 'custom') {
      let imageSrc = '/bg-altar-bible.jpg';
      if (bgMode === 'custom' && customImageUrl) {
        imageSrc = customImageUrl;
      } else {
        const bgObj = IMAGE_BACKGROUNDS.find(b => b.id === selectedImageBgId) || IMAGE_BACKGROUNDS[0];
        imageSrc = bgObj.url;
      }

      try {
        const img = await loadImage(imageSrc);
        
        // Draw image covering the entire canvas (aspect fill / cover)
        const imgRatio = img.width / img.height;
        const canvasRatio = W / H;
        let renderW, renderH, renderX, renderY;

        if (canvasRatio > imgRatio) {
          renderW = W;
          renderH = W / imgRatio;
          renderX = 0;
          renderY = (H - renderH) / 2;
        } else {
          renderH = H;
          renderW = H * imgRatio;
          renderX = (W - renderW) / 2;
          renderY = 0;
        }

        ctx.drawImage(img, renderX, renderY, renderW, renderH);

        // Apply dark cinematic vignette and darkening layer
        const darkOverlay = ctx.createLinearGradient(0, 0, 0, H);
        darkOverlay.addColorStop(0, `rgba(0, 0, 0, ${Math.min(0.85, overlayDarkness + 0.15)})`);
        darkOverlay.addColorStop(0.35, `rgba(0, 0, 0, ${overlayDarkness})`);
        darkOverlay.addColorStop(0.7, `rgba(0, 0, 0, ${overlayDarkness})`);
        darkOverlay.addColorStop(1, `rgba(0, 0, 0, ${Math.min(0.9, overlayDarkness + 0.25)})`);
        ctx.fillStyle = darkOverlay;
        ctx.fillRect(0, 0, W, H);

        // Warm ambient center glow
        if (showLightAura) {
          const warmGlow = ctx.createRadialGradient(W / 2, H * 0.45, 100, W / 2, H * 0.45, W * 0.65);
          warmGlow.addColorStop(0, 'rgba(212, 160, 23, 0.12)');
          warmGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = warmGlow;
          ctx.fillRect(0, 0, W, H);
        }

      } catch (err) {
        console.warn("Image load fallback to gradient:", err);
        // Fallback gradient
        const fallbackGrad = ctx.createLinearGradient(0, 0, 0, H);
        fallbackGrad.addColorStop(0, '#120d08');
        fallbackGrad.addColorStop(0.5, '#241a10');
        fallbackGrad.addColorStop(1, '#0e0a06');
        ctx.fillStyle = fallbackGrad;
        ctx.fillRect(0, 0, W, H);
      }

    } else {
      // LUXURY GRADIENT MODE
      const bgGradient = ctx.createLinearGradient(0, 0, W, H);
      bgGradient.addColorStop(0, theme.bg[0]);
      bgGradient.addColorStop(0.5, theme.bg[1] || theme.bg[0]);
      bgGradient.addColorStop(1, theme.bg[2] || theme.bg[1]);
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, W, H);

      if (showLightAura) {
        const auraGradient = ctx.createRadialGradient(W / 2, H * 0.42, 60, W / 2, H * 0.42, W * 0.6);
        auraGradient.addColorStop(0, theme.glow);
        auraGradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = auraGradient;
        ctx.fillRect(0, 0, W, H);
      }
    }

    // 2. STARDUST PARTICLES (OPTIONAL TOGGLE)
    if (showParticles) {
      const seed = (text.length * 37 + 13);
      for (let i = 0; i < 28; i++) {
        const px = ((seed * (i + 1) * 7919) % 1000) / 1000 * (W - 120) + 60;
        const py = ((seed * (i + 1) * 6271) % 1000) / 1000 * (H - 120) + 60;
        const radius = (((i * 17) % 3) + 1.2);
        const opacity = (((i * 23) % 5) + 3) / 10;

        ctx.fillStyle = `rgba(247, 208, 112, ${opacity * 0.7})`;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. TOP HEADER: "ISPEAK & IDECLARE" (MATCHES DESIGN REFERENCE)
    const headerY = H > 1400 ? 150 : (H < 1200 ? 105 : 125);

    ctx.save();
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 3;

    // Header Title
    ctx.font = '700 44px "Cinzel", "Times New Roman", serif';
    ctx.fillStyle = '#e5c07b'; // Warm Radiant Gold
    ctx.letterSpacing = '2px';
    ctx.fillText('ISPEAK & IDECLARE', W / 2, headerY);

    // Header Fine Gold Underline Bar
    ctx.strokeStyle = 'rgba(212, 160, 23, 0.55)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const lineHalfWidth = 140;
    ctx.moveTo(W / 2 - lineHalfWidth, headerY + 22);
    ctx.lineTo(W / 2 + lineHalfWidth, headerY + 22);
    ctx.stroke();
    ctx.restore();

    // 4. INNER FRAMED CARD CONTAINER
    const cardTop = headerY + 54;
    const cardBottom = H > 1400 ? H - 240 : (H < 1200 ? H - 180 : H - 200);
    const cardMarginX = 80;
    const cardWidth = W - (cardMarginX * 2);
    const cardHeight = cardBottom - cardTop;
    const cardRadius = 24;

    ctx.save();
    // Card Background Tint
    ctx.fillStyle = bgMode === 'gradient' ? theme.cardBg : 'rgba(18, 14, 10, 0.65)';
    ctx.beginPath();
    ctx.roundRect(cardMarginX, cardTop, cardWidth, cardHeight, cardRadius);
    ctx.fill();

    // Fine Gold Border
    ctx.strokeStyle = bgMode === 'gradient' ? theme.cardBorder : 'rgba(179, 135, 67, 0.65)';
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.restore();

    // 5. EDITORIAL QUOTATION MARKS
    ctx.save();
    ctx.font = '64px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = 'rgba(212, 160, 23, 0.65)';
    
    // Top-left quote
    ctx.textAlign = 'left';
    ctx.fillText('“', cardMarginX + 35, cardTop + 75);

    // Bottom-right quote
    ctx.textAlign = 'right';
    ctx.fillText('”', cardMarginX + cardWidth - 35, cardBottom - 105);
    ctx.restore();

    // 6. FORMAT PERSONALIZED DECLARATION TEXT
    let processedText = text.trim() || DEFAULT_DECLARATION.text;
    if (name.trim()) {
      const pName = name.trim();
      // Natural pronoun replacements ONLY when declarant inserts His/Her name
      processedText = processedText
        .replace(/\bmy life\b/gi, `${pName}'s life`)
        .replace(/\bmy steps\b/gi, `${pName}'s steps`)
        .replace(/\bmy body\b/gi, `${pName}'s body`)
        .replace(/\bmy hands\b/gi, `${pName}'s hands`)
        .replace(/\bmy needs\b/gi, `${pName}'s needs`)
        .replace(/\bmy\b/gi, `${pName}'s`)
        .replace(/\bI am always\b/gi, `${pName} is always`)
        .replace(/\bI am\b/gi, `${pName} is`)
        .replace(/\bI have\b/gi, `${pName} has`)
        .replace(/\bI walk\b/gi, `${pName} walks`)
        .replace(/\bI prosper\b/gi, `${pName} prospers`)
        .replace(/\bempower me\b/gi, `empower ${pName}`)
        .replace(/\bguides me\b/gi, `guides ${pName}`);
    }

    // 7. RENDER CENTER DECLARATION TEXT (AUTO-FILL DYNAMIC DENSITY)
    const maxTextWidth = cardWidth - 90;
    const hasName = name.trim().length > 0;
    const availableAreaTop = cardTop + 65;
    const availableAreaBottom = cardBottom - (hasName ? 130 : 95);
    const availableHeight = availableAreaBottom - availableAreaTop;

    // Dynamic auto-fill font calculation
    let optimalFontSize = 58;
    let optimalLineHeight = 78;
    let textLines = [];

    for (let fontCandidate = 58; fontCandidate >= 24; fontCandidate -= 2) {
      const candidateLineHeight = Math.round(fontCandidate * 1.40);
      ctx.font = `italic 600 ${fontCandidate}px "Cormorant Garamond", Georgia, serif`;
      const lines = getWrappedLines(ctx, processedText, maxTextWidth);
      const totalH = lines.length * candidateLineHeight;

      if (totalH <= availableHeight) {
        optimalFontSize = fontCandidate;
        optimalLineHeight = candidateLineHeight;
        textLines = lines;
        break;
      }
    }

    if (textLines.length === 0) {
      optimalFontSize = 24;
      optimalLineHeight = 34;
      ctx.font = `italic 600 ${optimalFontSize}px "Cormorant Garamond", Georgia, serif`;
      textLines = getWrappedLines(ctx, processedText, maxTextWidth);
    }

    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 2;
    ctx.font = `italic 600 ${optimalFontSize}px "Cormorant Garamond", Georgia, serif`;

    const totalBlockHeight = textLines.length * optimalLineHeight;
    const startY = availableAreaTop + ((availableHeight - totalBlockHeight) / 2) + (optimalFontSize * 0.75);

    textLines.forEach((l, idx) => {
      ctx.fillText(l, W / 2, startY + (idx * optimalLineHeight));
    });
    ctx.restore();

    // 8. SCRIPTURE REFERENCE & DECLARANT (INSIDE CARD AT BOTTOM)
    ctx.save();
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 10;

    const refY = hasName ? cardBottom - 80 : cardBottom - 52;

    // Scripture Reference (Larger Bold Off-White / Gold)
    ctx.font = '700 34px "Plus Jakarta Sans", "Outfit", sans-serif';
    ctx.fillStyle = '#f8f6f0';
    ctx.fillText(ref || DEFAULT_DECLARATION.ref, W / 2, refY);

    // Declarant: [Name] - ONLY rendered when declarant inserts His/Her Name
    if (hasName) {
      const declarantY = cardBottom - 36;
      ctx.font = '700 28px "Plus Jakarta Sans", "Inter", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`Declarant: ${name.trim()}`, W / 2, declarantY);
    }
    ctx.restore();

    // 9. FOOTER OUTSIDE CARD (EXACT MATCH)
    const footerY = H - 85;

    ctx.save();
    ctx.textAlign = 'center';
    
    // Top Footer Title: SLAP BIBLE PATTERN CHALLENGE
    ctx.font = '700 20px "Plus Jakarta Sans", "Outfit", sans-serif';
    ctx.fillStyle = '#f0eeeb';
    ctx.letterSpacing = '1.8px';
    ctx.fillText('SLAP BIBLE PATTERN CHALLENGE', W / 2, footerY);

    // Bottom Subtitle: Daily Scripture Declaration & Faith Formation
    ctx.font = '500 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(235, 230, 222, 0.72)';
    ctx.letterSpacing = '0.5px';
    ctx.fillText('Daily Scripture Declaration & Faith Formation', W / 2, footerY + 26);
    ctx.restore();
  };

  // Helper to split text into wrapped lines for auto-fill calculations
  const getWrappedLines = (ctx, textContent, maxWidth) => {
    const words = textContent.split(' ');
    const lines = [];
    let currentLine = '';

    for (let n = 0; n < words.length; n++) {
      const testLine = currentLine + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        lines.push(currentLine.trim());
        currentLine = words[n] + ' ';
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }
    return lines;
  };

  // Canvas text-wrapping utility
  const wrapText = (ctx, textContent, x, startY, maxWidth, lineHeight) => {
    const words = textContent.split(' ');
    let line = '';
    let testY = startY;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, testY);
        line = words[n] + ' ';
        testY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, testY);
  };

  // ─── DOWNLOAD HIGH-RES PNG ───
  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    const safeCategory = selectedCategory.toLowerCase();
    link.download = `SLAP-iSPEAK-iDECLARE-${safeCategory}-${aspectRatio}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();

    setCelebrationData({
      isOpen: true,
      type: 'download',
      title: '🎉 Proclamation Card Downloaded!',
      subtitle: 'Your high-resolution scripture declaration card is saved to your device and ready to share with friends, family, or fellowship circles!',
      details: [
        { label: '📖 Proclamation Theme', value: (selectedCategory || 'FAITH').toUpperCase() },
        { label: '✦ Declarant Name', value: name.trim() || 'Believer in Christ' },
        { label: '📐 Format Ratio', value: aspectRatio === 'portrait' ? 'Story / Mobile (9:16)' : (aspectRatio === 'square' ? 'Instagram Square (1:1)' : 'Classic Frame (4:5)') },
        { label: '🛡️ Scripture Reference', value: ref }
      ]
    });
  };

  // ─── COPY IMAGE DIRECTLY TO CLIPBOARD ───
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
            setToastMessage('📋 Card Image copied! Paste (Ctrl+V) directly into WhatsApp, Instagram, or Slack!');
            setTimeout(() => setToastMessage(''), 4000);
          }
        }, 'image/png');
      } else {
        await navigator.clipboard.writeText(`✦ iSPEAK & iDECLARE ✦\n\n“${text}”\n\n📖 ${ref}\nDeclarant: ${name || 'Believer in Christ'}\n\nSLAP Bible Pattern Challenge: ${window.location.origin}/declare`);
        setToastMessage('📋 Declaration text copied to clipboard!');
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (err) {
      console.warn("Clipboard copy fallback:", err);
      await navigator.clipboard.writeText(`✦ iSPEAK & iDECLARE ✦\n\n“${text}”\n\n📖 ${ref}\nDeclarant: ${name || 'Believer in Christ'}\n\nSLAP Bible Pattern Challenge: ${window.location.origin}/declare`);
      setToastMessage('📋 Declaration text copied to clipboard!');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  // ─── SHARE TO WHATSAPP ───
  const handleShareToWhatsApp = () => {
    const pName = name.trim() ? `\n— *Declarant:* ${name.trim()}` : '';
    const shareMessage = `✦ *ISPEAK & IDECLARE* (${selectedCategory.toUpperCase()}) ✦\n\n“${text}”\n\n📖 *Scripture:* ${ref}${pName}\n\n*SLAP BIBLE PATTERN CHALLENGE*\nDaily Scripture Declaration & Faith Formation\n👉 ${window.location.origin}/declare`;
    
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // ─── NATIVE SOCIAL SHARE & CLOUD STORAGE SYNC ───
  const handleShareCard = async () => {
    setLoading(true);
    try {
      const canvas = canvasRef.current;
      const cardDataUrl = canvas ? canvas.toDataURL('image/png') : null;

      await dbService.saveDeclaration({
        text,
        ref,
        category: selectedCategory,
        backgroundStyle: bgMode === 'image' ? selectedImageBgId : themeId,
        cardDataUrl
      });

      const shareText = `✦ ISPEAK & IDECLARE (${selectedCategory.toUpperCase()})\n\n"${text}"\n\nScripture: ${ref}\n${name.trim() ? `Declarant: ${name.trim()}\n` : ''}\nJoin the SLAP Bible Challenge: ${window.location.origin}/declare`;

      if (navigator.share) {
        await navigator.share({
          title: `SLAP ${selectedCategory.toUpperCase()} Proclamation`,
          text: shareText,
          url: window.location.origin
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        setToastMessage('Declaration saved & copied to clipboard! 📋');
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
    <div className="section-container" style={{ maxWidth: '1380px', margin: '0 auto', padding: '0 24px 70px' }}>
      
      {/* Page Title & Mission Banner */}
      <AnimateOnScroll animation="fadeUp">
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', borderRadius: '30px', background: 'rgba(212, 160, 23, 0.12)', border: '1px solid var(--accent-gold)', marginBottom: '12px' }}>
            <Sparkles size={16} style={{ color: 'var(--accent-gold)' }} />
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--accent-gold)', letterSpacing: '1.2px', textTransform: 'uppercase' }}>
              Scripture Declaration &amp; Proclamation Studio
            </span>
          </div>
          <h1 style={{ fontSize: '38px', margin: '8px 0', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            iSPEAK &amp; iDECLARE <span className="gradient-text">Studio</span>
          </h1>
          <p style={{ maxWidth: '720px', margin: '0 auto', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Create and customize stunning scripture proclamation cards with sacred sanctuary backdrops, personalized declarant names, and one-click social media exports.
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

      {/* Category Tabs & Quick Shuffle Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '28px' }}>
        
        {/* 6 Category Tabs */}
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
                boxShadow: selectedCategory === cat.id ? `0 0 16px ${cat.color}50` : 'none',
                transition: 'all 0.2s ease'
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
            padding: '9px 20px',
            borderRadius: '30px',
            fontSize: '13px',
            fontWeight: '700',
            borderColor: 'var(--accent-gold)',
            color: 'var(--accent-gold)'
          }}
          title="Randomly pick an uplifting declaration and matching background"
        >
          <RefreshCw size={15} /> Inspire Me
        </button>
      </div>

      <div className="grid-2" style={{ alignItems: 'flex-start', gap: '32px' }}>
        
        {/* ════════ LEFT COLUMN: STUDIO CONTROLS & BACKGROUND PICKERS ════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

          {/* 1. BACKGROUND SELECTION & GALLERY */}
          <div className="glass-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ImageIcon size={18} style={{ color: 'var(--accent-gold)' }} />
                Background &amp; Backdrop Gallery
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--accent-gold)', fontWeight: '700' }}>
                {bgMode === 'image' ? '🖼️ Spiritual Photos' : (bgMode === 'custom' ? '✨ Custom Upload' : '🎨 Luxury Gradients')}
              </span>
            </div>

            {/* Mode Switcher Tabs */}
            <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '10px' }}>
              <button
                onClick={() => setBgMode('image')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  background: bgMode === 'image' ? 'var(--accent-gold)' : 'transparent',
                  color: bgMode === 'image' ? '#18140a' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}
              >
                Spiritual Photos
              </button>
              <button
                onClick={() => setBgMode('gradient')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  background: bgMode === 'gradient' ? 'var(--accent-gold)' : 'transparent',
                  color: bgMode === 'gradient' ? '#18140a' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}
              >
                Foil Gradients
              </button>
              <button
                onClick={() => {
                  setBgMode('custom');
                  if (!customImageUrl) fileInputRef.current?.click();
                }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  background: bgMode === 'custom' ? 'var(--accent-gold)' : 'transparent',
                  color: bgMode === 'custom' ? '#18140a' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}
              >
                Upload Photo
              </button>
            </div>

            {/* A. Photographic Backgrounds Grid */}
            {bgMode === 'image' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                {IMAGE_BACKGROUNDS.map(bg => (
                  <button
                    key={bg.id}
                    onClick={() => {
                      setSelectedImageBgId(bg.id);
                      setBgMode('image');
                    }}
                    style={{
                      position: 'relative',
                      height: '90px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      border: selectedImageBgId === bg.id && bgMode === 'image' ? '2.5px solid var(--accent-gold)' : '1px solid var(--border-color)',
                      boxShadow: selectedImageBgId === bg.id && bgMode === 'image' ? '0 0 14px rgba(212, 160, 23, 0.6)' : 'none',
                      cursor: 'pointer',
                      padding: 0,
                      textAlign: 'left'
                    }}
                  >
                    <img 
                      src={bg.url} 
                      alt={bg.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '4px 6px',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.2))',
                      color: '#ffffff'
                    }}>
                      <div style={{ fontSize: '10px', fontWeight: '800', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {bg.name}
                      </div>
                      {bg.badge && (
                        <span style={{ fontSize: '8px', color: 'var(--accent-gold)', fontWeight: '700' }}>
                          {bg.badge}
                        </span>
                      )}
                    </div>
                    {selectedImageBgId === bg.id && (
                      <div style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        background: 'var(--accent-gold)',
                        color: '#1a1409',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: '900'
                      }}>
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* B. Foil & Metallic Gradients Grid */}
            {bgMode === 'gradient' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                {LUXURY_THEMES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setThemeId(t.id);
                      setBgMode('gradient');
                    }}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: t.id === 'alabaster-gold' ? '#18181b' : '#ffffff',
                      cursor: 'pointer',
                      background: `linear-gradient(135deg, ${t.bg[0]}, ${t.bg[1] || t.bg[0]})`,
                      border: themeId === t.id && bgMode === 'gradient' ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.15)',
                      boxShadow: themeId === t.id && bgMode === 'gradient' ? '0 0 12px rgba(212, 160, 23, 0.6)' : 'none',
                      transition: 'all 0.2s ease',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ fontWeight: '800' }}>{t.name}</div>
                    <div style={{ fontSize: '9px', opacity: 0.8, marginTop: '2px' }}>{t.subtitle}</div>
                  </button>
                ))}
              </div>
            )}

            {/* C. Custom User Photo Upload Box */}
            {bgMode === 'custom' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleCustomImageUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                
                {customImageUrl ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-secondary)', padding: '12px', borderRadius: '10px' }}>
                    <img 
                      src={customImageUrl} 
                      alt="Custom Backdrop" 
                      style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} 
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>Custom Backdrop Active</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Rendered onto high-resolution canvas</div>
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '11px' }}
                    >
                      Replace
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed var(--accent-gold)',
                      borderRadius: '12px',
                      padding: '24px',
                      background: 'rgba(212, 160, 23, 0.04)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Upload size={24} style={{ color: 'var(--accent-gold)' }} />
                    <span style={{ fontWeight: '700', fontSize: '13px' }}>Click to Upload Custom Photo or Wallpaper</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Supports JPG, PNG, WebP from your device</span>
                  </button>
                )}
              </div>
            )}

            {/* Background Dimmer / Contrast Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <SlidersHorizontal size={14} style={{ color: 'var(--accent-gold)' }} />
                  Backdrop Dimmer / Contrast:
                </span>
                <span style={{ fontWeight: '700', color: 'var(--accent-gold)' }}>
                  {Math.round(overlayDarkness * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.15"
                max="0.80"
                step="0.05"
                value={overlayDarkness}
                onChange={e => setOverlayDarkness(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* 2. CARD RATIO & SCRIPTURE CURATED PICKER */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              <Maximize2 size={16} style={{ color: 'var(--accent-gold)' }} />
              Card Aspect Ratio
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
                    color: aspectRatio === r.id ? 'var(--accent-gold)' : 'var(--text-secondary)',
                    padding: '10px'
                  }}
                >
                  <span>{r.icon}</span>
                  <span>{r.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. CURATED DECLARATIONS LIST */}
          <div className="glass-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} style={{ color: 'var(--accent-gold)' }} />
                Curated {DECLARATION_CATEGORIES.find(c => c.id === selectedCategory)?.name} Proclamations
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {activeCategoryDeclarations.length} available
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto', paddingRight: '6px' }}>
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
                    gap: '6px',
                    width: '100%',
                    boxSizing: 'border-box',
                    borderColor: text === d.text ? 'var(--accent-gold)' : 'var(--border-color)',
                    background: text === d.text ? 'rgba(212, 160, 23, 0.12)' : 'var(--bg-secondary)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontStyle: 'italic', color: 'var(--text-primary)', wordBreak: 'break-word' }}>"{d.text}"</span>
                  <span style={{ fontSize: '12px', color: 'var(--accent-gold)', fontWeight: '700' }}>📖 {d.ref}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. PERSONALIZATION & SCRIPTURE FIELDS */}
          <div className="glass-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: '16px' }}>Declarant Name &amp; Proclamation</h3>

            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                <User size={14} style={{ color: 'var(--accent-gold)' }} /> Declarant Name
              </label>
              <input
                type="text"
                placeholder="Enter declarant name (optional)"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ fontSize: '14px' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', display: 'block' }}>
                💡 Personalizes declaration pronouns when entered (e.g. "my life" → "Grace's life")
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
                placeholder="e.g. Deuteronomy 28:8, Psalm 5:12"
                style={{ fontSize: '14px' }}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                Proclamation Text
              </label>
              <textarea
                rows="5"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Type or customize your personal faith proclamation..."
                style={{
                  width: '100%',
                  minHeight: '130px',
                  maxHeight: '260px',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Atmosphere Toggles */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showLightAura}
                  onChange={e => setShowLightAura(e.target.checked)}
                />
                <span>Warm Center Aura ☼</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showParticles}
                  onChange={e => setShowParticles(e.target.checked)}
                />
                <span>Golden Stardust ✨</span>
              </label>
            </div>
          </div>

        </div>

        {/* ════════ RIGHT COLUMN: LIVE CARD PREVIEW & EXPORT ACTIONS ════════ */}
        <div style={{ position: 'sticky', top: '90px' }}>
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
            
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="animate-spin" style={{ color: 'var(--accent-gold)', fontSize: '14px' }}>✦</span>
                <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Live Proclamation Card
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
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              <div
                className="card-tilt-inner"
                style={{
                  ...tiltStyle,
                  width: '100%',
                  maxWidth: aspectRatio === 'story' ? '320px' : (aspectRatio === 'square' ? '400px' : '380px'),
                  aspectRatio: aspectRatio === 'story' ? '9 / 16' : (aspectRatio === 'square' ? '1 / 1' : '4 / 5'),
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 160, 23, 0.2)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'transform 0.15s ease-out'
                }}
              >
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
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
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

      {/* Celebratory Modal for Card Downloads */}
      <CelebrationModal
        isOpen={!!celebrationData?.isOpen}
        onClose={() => setCelebrationData(null)}
        type={celebrationData?.type || 'download'}
        title={celebrationData?.title}
        subtitle={celebrationData?.subtitle}
        details={celebrationData?.details || []}
        primaryBtnText="Done"
        primaryBtnAction={() => setCelebrationData(null)}
      />
    </div>
  );
}
