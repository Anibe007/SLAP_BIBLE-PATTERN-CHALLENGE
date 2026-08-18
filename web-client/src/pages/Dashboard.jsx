import React, { useState, useEffect, useCallback } from 'react';
import { dbService } from '../services/db';
import { Flame, CheckCircle, Calendar, Plus, BookOpen, AlertCircle, Eye, Sparkles, ChevronLeft, ChevronRight, Loader, Search, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

/* ─── Bible Books Data with chapter counts ─── */
const BIBLE_BOOKS = [
  { name: 'Genesis', chapters: 50, testament: 'OT' }, { name: 'Exodus', chapters: 40, testament: 'OT' },
  { name: 'Leviticus', chapters: 27, testament: 'OT' }, { name: 'Numbers', chapters: 36, testament: 'OT' },
  { name: 'Deuteronomy', chapters: 34, testament: 'OT' }, { name: 'Joshua', chapters: 24, testament: 'OT' },
  { name: 'Judges', chapters: 21, testament: 'OT' }, { name: 'Ruth', chapters: 4, testament: 'OT' },
  { name: '1 Samuel', chapters: 31, testament: 'OT' }, { name: '2 Samuel', chapters: 24, testament: 'OT' },
  { name: '1 Kings', chapters: 22, testament: 'OT' }, { name: '2 Kings', chapters: 25, testament: 'OT' },
  { name: '1 Chronicles', chapters: 29, testament: 'OT' }, { name: '2 Chronicles', chapters: 36, testament: 'OT' },
  { name: 'Ezra', chapters: 10, testament: 'OT' }, { name: 'Nehemiah', chapters: 13, testament: 'OT' },
  { name: 'Esther', chapters: 10, testament: 'OT' }, { name: 'Job', chapters: 42, testament: 'OT' },
  { name: 'Psalms', chapters: 150, testament: 'OT' }, { name: 'Proverbs', chapters: 31, testament: 'OT' },
  { name: 'Ecclesiastes', chapters: 12, testament: 'OT' }, { name: 'Song of Solomon', chapters: 8, testament: 'OT' },
  { name: 'Isaiah', chapters: 66, testament: 'OT' }, { name: 'Jeremiah', chapters: 52, testament: 'OT' },
  { name: 'Lamentations', chapters: 5, testament: 'OT' }, { name: 'Ezekiel', chapters: 48, testament: 'OT' },
  { name: 'Daniel', chapters: 12, testament: 'OT' }, { name: 'Hosea', chapters: 14, testament: 'OT' },
  { name: 'Joel', chapters: 3, testament: 'OT' }, { name: 'Amos', chapters: 9, testament: 'OT' },
  { name: 'Obadiah', chapters: 1, testament: 'OT' }, { name: 'Jonah', chapters: 4, testament: 'OT' },
  { name: 'Micah', chapters: 7, testament: 'OT' }, { name: 'Nahum', chapters: 3, testament: 'OT' },
  { name: 'Habakkuk', chapters: 3, testament: 'OT' }, { name: 'Zephaniah', chapters: 3, testament: 'OT' },
  { name: 'Haggai', chapters: 2, testament: 'OT' }, { name: 'Zechariah', chapters: 14, testament: 'OT' },
  { name: 'Malachi', chapters: 4, testament: 'OT' },
  { name: 'Matthew', chapters: 28, testament: 'NT' }, { name: 'Mark', chapters: 16, testament: 'NT' },
  { name: 'Luke', chapters: 24, testament: 'NT' }, { name: 'John', chapters: 21, testament: 'NT' },
  { name: 'Acts', chapters: 28, testament: 'NT' }, { name: 'Romans', chapters: 16, testament: 'NT' },
  { name: '1 Corinthians', chapters: 16, testament: 'NT' }, { name: '2 Corinthians', chapters: 13, testament: 'NT' },
  { name: 'Galatians', chapters: 6, testament: 'NT' }, { name: 'Ephesians', chapters: 6, testament: 'NT' },
  { name: 'Philippians', chapters: 4, testament: 'NT' }, { name: 'Colossians', chapters: 4, testament: 'NT' },
  { name: '1 Thessalonians', chapters: 5, testament: 'NT' }, { name: '2 Thessalonians', chapters: 3, testament: 'NT' },
  { name: '1 Timothy', chapters: 6, testament: 'NT' }, { name: '2 Timothy', chapters: 4, testament: 'NT' },
  { name: 'Titus', chapters: 3, testament: 'NT' }, { name: 'Philemon', chapters: 1, testament: 'NT' },
  { name: 'Hebrews', chapters: 13, testament: 'NT' }, { name: 'James', chapters: 5, testament: 'NT' },
  { name: '1 Peter', chapters: 5, testament: 'NT' }, { name: '2 Peter', chapters: 3, testament: 'NT' },
  { name: '1 John', chapters: 5, testament: 'NT' }, { name: '2 John', chapters: 1, testament: 'NT' },
  { name: '3 John', chapters: 1, testament: 'NT' }, { name: 'Jude', chapters: 1, testament: 'NT' },
  { name: 'Revelation', chapters: 22, testament: 'NT' }
];

/* ─── Translation mapping for bible-api.com ─── */
const API_TRANSLATIONS = {
  'KJV': { id: 'kjv', label: 'KJV (King James Version)' },
  'ASV': { id: 'asv', label: 'ASV (American Standard Version)' },
  'WEB': { id: 'web', label: 'WEB (World English Bible)' },
  'BBE': { id: 'bbe', label: 'BBE (Bible in Basic English)' },
  'DARBY': { id: 'darby', label: 'DARBY (Darby Translation)' },
  'YLT': { id: 'ylt', label: 'YLT (Young\'s Literal Translation)' },
  'CLEMENTINE': { id: 'clementine', label: 'CLEMENTINE (Clementine Latin Vulgate)' },
  'ALMEIDA': { id: 'almeida', label: 'ALMEIDA (João Ferreira de Almeida)' },
  'RCCV': { id: 'rccv', label: 'RCCV (Romanian Cornilescu)' },
};

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [streak, setStreak] = useState({ current_streak: 0, longest_streak: 0, last_activity_date: null });
  const [book, setBook] = useState('John');
  const [chapter, setChapter] = useState('3');
  const [verses, setVerses] = useState('');
  const [translation, setTranslation] = useState('KJV');
  const [strikingVerses, setStrikingVerses] = useState('');
  const [lessonsLearnt, setLessonsLearnt] = useState('');
  const [actionPlans, setActionPlans] = useState('');
  const [prayers, setPrayers] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedReport, setExpandedReport] = useState(null);

  /* ─── Bible Reader State ─── */
  const [readerBook, setReaderBook] = useState('John');
  const [readerChapter, setReaderChapter] = useState(3);
  const [readerTranslation, setReaderTranslation] = useState('KJV');
  const [bibleText, setBibleText] = useState(null);
  const [bibleLoading, setBibleLoading] = useState(false);
  const [bibleError, setBibleError] = useState('');
  const [activeTab, setActiveTab] = useState('read'); // 'read' or 'report'

  const fetchDashboardData = async () => {
    try {
      const reportList = await dbService.getReports();
      const streakInfo = await dbService.getStreak();
      setReports(reportList);
      setStreak(streakInfo);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  /* ─── Bible Reader: Fetch scripture text ─── */
  const fetchBibleText = useCallback(async (bk, ch, trans) => {
    setBibleLoading(true);
    setBibleError('');
    setBibleText(null);

    const apiTrans = API_TRANSLATIONS[trans]?.id || 'kjv';
    // bible-api.com format: book+chapter?translation=xxx
    const query = `${bk} ${ch}`;
    const url = `https://bible-api.com/${encodeURIComponent(query)}?translation=${apiTrans}`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Scripture not found for this translation.');
      const data = await res.json();
      setBibleText(data);
    } catch (err) {
      setBibleError(err.message || 'Failed to load scripture. Please try another translation.');
    } finally {
      setBibleLoading(false);
    }
  }, []);

  // Load Bible text on mount and when reader settings change
  useEffect(() => {
    fetchBibleText(readerBook, readerChapter, readerTranslation);
  }, [readerBook, readerChapter, readerTranslation, fetchBibleText]);

  const getBookData = (bookName) => BIBLE_BOOKS.find(b => b.name === bookName);
  
  const goToPrevChapter = () => {
    if (readerChapter > 1) {
      setReaderChapter(prev => prev - 1);
    } else {
      // Go to previous book's last chapter
      const idx = BIBLE_BOOKS.findIndex(b => b.name === readerBook);
      if (idx > 0) {
        const prevBook = BIBLE_BOOKS[idx - 1];
        setReaderBook(prevBook.name);
        setReaderChapter(prevBook.chapters);
      }
    }
  };

  const goToNextChapter = () => {
    const bookData = getBookData(readerBook);
    if (readerChapter < bookData.chapters) {
      setReaderChapter(prev => prev + 1);
    } else {
      // Go to next book's chapter 1
      const idx = BIBLE_BOOKS.findIndex(b => b.name === readerBook);
      if (idx < BIBLE_BOOKS.length - 1) {
        const nextBook = BIBLE_BOOKS[idx + 1];
        setReaderBook(nextBook.name);
        setReaderChapter(1);
      }
    }
  };

  // When user finishes reading and wants to report, pre-fill the SLAP form
  const startReport = () => {
    setBook(readerBook);
    setChapter(String(readerChapter));
    setTranslation(readerTranslation);
    setActiveTab('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSLAPSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!strikingVerses || !lessonsLearnt || !actionPlans || !prayers) {
      setError('Please fill in all four elements of the SLAP report.');
      return;
    }

    try {
      const result = await dbService.submitReport({
        book,
        chapter,
        verses,
        translation,
        strikingVerses,
        lessonsLearnt,
        actionPlans,
        prayers
      });

      setSuccess('Daily SLAP report successfully submitted! Streak updated! 🔥');
      
      // Fire confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#b8860b', '#d4a843', '#fbbf24']
      });

      // Reset form fields
      setStrikingVerses('');
      setLessonsLearnt('');
      setActionPlans('');
      setPrayers('');
      setVerses('');

      // Reload
      fetchDashboardData();
    } catch (err) {
      setError(err.message || 'Failed to submit report.');
    }
  };

  // Generate 28 boxes representing consistency grid
  const renderContributionGrid = () => {
    const boxes = [];
    const today = new Date();
    
    for (let i = 27; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      // Check if there is a report on this date
      const isCompleted = reports.some(r => r.submission_date === dateStr);
      
      boxes.push(
        <div
          key={dateStr}
          title={`${d.toDateString()}: ${isCompleted ? 'SLAP Complete!' : 'No report'}`}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '4px',
            backgroundColor: isCompleted ? 'var(--accent-gold)' : 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            opacity: isCompleted ? 1 : 0.4,
            cursor: 'help',
            boxShadow: isCompleted ? '0 0 8px var(--accent-gold)' : 'none'
          }}
        />
      );
    }
    return boxes;
  };

  const bookData = getBookData(readerBook);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '60px' }}>
      
      {/* Top Welcome / Stats */}
      <section style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '24px',
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(184,134,11,0.08), rgba(212,168,67,0.05))',
        borderRadius: '16px',
        border: '1px solid var(--border-color)'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px' }}>Your Daily Study Dashboard</h1>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>Read scripture, study the Word, and submit your daily SLAP report.</p>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div className="glass-card" style={{ padding: '12px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Current Streak</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '24px', fontWeight: '800', color: 'var(--accent-gold)' }}>
              <Flame fill="var(--accent-gold)" size={20} />
              {streak.current_streak} Days
            </div>
          </div>

          <div className="glass-card" style={{ padding: '12px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Longest Streak</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '24px', fontWeight: '800', color: 'var(--accent-gold)' }}>
              <Sparkles size={20} />
              {streak.longest_streak} Days
            </div>
          </div>
        </div>
      </section>

      {/* Consistency Calendar grid */}
      <section className="glass-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', marginBottom: '16px' }}>
          <Calendar size={18} /> Consistency Tracker (Last 28 Days)
        </h3>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {renderContributionGrid()}
        </div>
      </section>

      {/* ═══════════ Tab Switcher: Read / Report ═══════════ */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid var(--border-color)' }}>
        <button
          onClick={() => setActiveTab('read')}
          style={{
            flex: 1,
            padding: '14px 20px',
            background: activeTab === 'read' ? 'var(--accent-gold)' : 'transparent',
            color: activeTab === 'read' ? '#fff' : 'var(--text-secondary)',
            border: 'none',
            borderBottom: activeTab === 'read' ? '3px solid var(--accent-gold)' : '3px solid transparent',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '700',
            fontFamily: 'var(--font-display)',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            borderRadius: '8px 8px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.3s ease'
          }}
        >
          <BookOpen size={18} /> Read Scripture
        </button>
        <button
          onClick={() => setActiveTab('report')}
          style={{
            flex: 1,
            padding: '14px 20px',
            background: activeTab === 'report' ? 'var(--accent-gold)' : 'transparent',
            color: activeTab === 'report' ? '#fff' : 'var(--text-secondary)',
            border: 'none',
            borderBottom: activeTab === 'report' ? '3px solid var(--accent-gold)' : '3px solid transparent',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '700',
            fontFamily: 'var(--font-display)',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            borderRadius: '8px 8px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.3s ease'
          }}
        >
          <Plus size={18} /> Write Report
        </button>
      </div>

      {/* ═══════════ TAB: Bible Reader ═══════════ */}
      {activeTab === 'read' && (
        <section className="glass-card" style={{ padding: '0' }}>
          {/* Reader Toolbar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-color)',
            alignItems: 'flex-end',
            background: 'linear-gradient(135deg, rgba(184,134,11,0.06), transparent)'
          }}>
            <div className="form-group" style={{ margin: 0, flex: '2', minWidth: '160px' }}>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>Book</label>
              <select value={readerBook} onChange={e => { setReaderBook(e.target.value); setReaderChapter(1); }}>
                <optgroup label="Old Testament">
                  {BIBLE_BOOKS.filter(b => b.testament === 'OT').map(b => (
                    <option key={b.name} value={b.name}>{b.name}</option>
                  ))}
                </optgroup>
                <optgroup label="New Testament">
                  {BIBLE_BOOKS.filter(b => b.testament === 'NT').map(b => (
                    <option key={b.name} value={b.name}>{b.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0, flex: '1', minWidth: '100px' }}>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>Chapter</label>
              <select value={readerChapter} onChange={e => setReaderChapter(Number(e.target.value))}>
                {bookData && Array.from({ length: bookData.chapters }, (_, i) => i + 1).map(ch => (
                  <option key={ch} value={ch}>{ch}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0, flex: '1.5', minWidth: '180px' }}>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>Translation</label>
              <select value={readerTranslation} onChange={e => setReaderTranslation(e.target.value)}>
                {Object.entries(API_TRANSLATIONS).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Chapter Title & Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <button
              onClick={goToPrevChapter}
              disabled={readerBook === 'Genesis' && readerChapter === 1}
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '8px 14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '13px',
                color: 'var(--text-primary)',
                opacity: (readerBook === 'Genesis' && readerChapter === 1) ? 0.4 : 1
              }}
            >
              <ChevronLeft size={16} /> Prev
            </button>

            <h2 style={{
              margin: 0,
              fontFamily: 'var(--font-serif)',
              fontSize: '22px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              textAlign: 'center'
            }}>
              {readerBook} {readerChapter}
              <span style={{ display: 'block', fontSize: '12px', fontWeight: '400', color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', marginTop: '2px' }}>
                {API_TRANSLATIONS[readerTranslation]?.label || readerTranslation}
              </span>
            </h2>

            <button
              onClick={goToNextChapter}
              disabled={readerBook === 'Revelation' && readerChapter === 22}
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '8px 14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '13px',
                color: 'var(--text-primary)',
                opacity: (readerBook === 'Revelation' && readerChapter === 22) ? 0.4 : 1
              }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>

          {/* Scripture Content */}
          <div style={{ padding: '28px 32px', minHeight: '300px' }}>
            {bibleLoading && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 0', gap: '12px', color: 'var(--text-secondary)' }}>
                <Loader size={24} style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: '15px' }}>Loading scripture...</span>
              </div>
            )}

            {bibleError && (
              <div style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', padding: '16px 20px', borderRadius: '10px', color: '#f43f5e', display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px' }}>
                <AlertCircle size={18} />
                <div>
                  <strong>Unable to load this passage.</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', opacity: 0.8 }}>{bibleError} Try using KJV or WEB translation.</p>
                </div>
              </div>
            )}

            {bibleText && bibleText.verses && (
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', lineHeight: '1.9', color: 'var(--text-primary)' }}>
                {bibleText.verses.map((v, idx) => (
                  <span key={idx} style={{ marginBottom: '4px' }}>
                    <sup style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: 'var(--accent-gold)',
                      marginRight: '4px',
                      verticalAlign: 'super'
                    }}>
                      {v.verse}
                    </sup>
                    {v.text}
                  </span>
                ))}
              </div>
            )}

            {bibleText && !bibleText.verses && bibleText.text && (
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', lineHeight: '1.9', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                {bibleText.text}
              </div>
            )}
          </div>

          {/* Bottom Navigation + CTA */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            borderTop: '1px solid var(--border-color)',
            background: 'linear-gradient(135deg, rgba(184,134,11,0.04), transparent)',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={goToPrevChapter} className="btn-secondary" style={{ padding: '10px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ChevronLeft size={14} /> Previous Chapter
              </button>
              <button onClick={goToNextChapter} className="btn-secondary" style={{ padding: '10px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Next Chapter <ChevronRight size={14} />
              </button>
            </div>

            <button
              onClick={startReport}
              className="btn-primary"
              style={{ padding: '12px 24px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              Done Reading — Write SLAP Report <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}

      {/* ═══════════ TAB: SLAP Report Form ═══════════ */}
      {activeTab === 'report' && (
        <div className="grid-2" style={{ alignItems: 'flex-start' }}>
          
          {/* SLAP Form */}
          <section className="glass-card">
            <h2>Submit Daily SLAP</h2>
            
            {error && (
              <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', padding: '12px', borderRadius: '8px', color: '#f43f5e', display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px', fontSize: '13px' }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {success && (
              <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '12px', borderRadius: '8px', color: '#10b981', display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px', fontSize: '13px' }}>
                <CheckCircle size={16} /> {success}
              </div>
            )}

            <form onSubmit={handleSLAPSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Bible Book</label>
                  <select value={book} onChange={e => setBook(e.target.value)}>
                    <optgroup label="Old Testament">
                      {BIBLE_BOOKS.filter(b => b.testament === 'OT').map(b => (
                        <option key={b.name} value={b.name}>{b.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="New Testament">
                      {BIBLE_BOOKS.filter(b => b.testament === 'NT').map(b => (
                        <option key={b.name} value={b.name}>{b.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Chapter</label>
                  <input type="number" min="1" max="150" required value={chapter} onChange={e => setChapter(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Verses (optional)</label>
                  <input type="text" placeholder="e.g. 16-21" value={verses} onChange={e => setVerses(e.target.value)} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Translation</label>
                  <select value={translation} onChange={e => setTranslation(e.target.value)}>
                    {Object.entries(API_TRANSLATIONS).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                    <option value="NIV">NIV (New International Version)</option>
                    <option value="ESV">ESV (English Standard Version)</option>
                    <option value="NKJV">NKJV (New King James Version)</option>
                    <option value="NLT">NLT (New Living Translation)</option>
                    <option value="AMP">AMP (Amplified Bible)</option>
                    <option value="AMPC">AMPC (Amplified Bible Classic)</option>
                    <option value="TLB">TLB (The Living Bible)</option>
                    <option value="NCV">NCV (New Century Version)</option>
                    <option value="CSB">CSB (Christian Standard Bible)</option>
                    <option value="NASB">NASB (New American Standard)</option>
                    <option value="TPT">TPT (The Passion Translation)</option>
                    <option value="MSG">MSG (The Message)</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label>S – Striking Verses</label>
                <textarea rows="3" placeholder="Which scripture stood out today?" value={strikingVerses} onChange={e => setStrikingVerses(e.target.value)} />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label>L – Lessons Learnt</label>
                <textarea rows="3" placeholder="What core revelations did you extract?" value={lessonsLearnt} onChange={e => setLessonsLearnt(e.target.value)} />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label>A – Action Plans</label>
                <textarea rows="3" placeholder="What specific actions will you take today?" value={actionPlans} onChange={e => setActionPlans(e.target.value)} />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label>P – Prayers</label>
                <textarea rows="3" placeholder="Write a short sealing prayer..." value={prayers} onChange={e => setPrayers(e.target.value)} />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Submit SLAP Devotion</button>
            </form>
          </section>

          {/* Report Log History */}
          <section className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '725px', overflowY: 'auto' }}>
            <h2>Report Log History ({reports.length})</h2>
            {reports.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '40px 0' }}>No reports logged yet. Start today!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {reports.map((r) => (
                  <div key={r.id} style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '16px',
                    background: 'var(--bg-secondary)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BookOpen size={16} /> {r.book} {r.chapter}{r.verses ? `:${r.verses}` : ''} ({r.translation})
                      </h3>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} /> {new Date(r.submission_date).toLocaleDateString()}
                      </span>
                    </div>

                    <button
                      className="btn-secondary"
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        alignSelf: 'flex-start',
                        marginTop: '4px'
                      }}
                      onClick={() => setExpandedReport(expandedReport === r.id ? null : r.id)}
                    >
                      <Eye size={12} /> {expandedReport === r.id ? 'Collapse SLAP' : 'Expand SLAP'}
                    </button>

                    {expandedReport === r.id && (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        marginTop: '12px',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border-color)',
                        fontSize: '14px'
                      }}>
                        <div>
                          <strong style={{ color: 'var(--accent-gold)' }}>Striking Verses:</strong>
                          <p style={{ margin: '4px 0 0', fontSize: '13px' }}>{r.striking_verses || r.strikingVerses}</p>
                        </div>
                        <div>
                          <strong style={{ color: 'var(--accent-gold)' }}>Lessons Learnt:</strong>
                          <p style={{ margin: '4px 0 0', fontSize: '13px' }}>{r.lessons_learnt || r.lessonsLearnt}</p>
                        </div>
                        <div>
                          <strong style={{ color: 'var(--accent-gold)' }}>Action Plans:</strong>
                          <p style={{ margin: '4px 0 0', fontSize: '13px' }}>{r.action_plans || r.actionPlans}</p>
                        </div>
                        <div>
                          <strong style={{ color: '#10b981' }}>Prayers:</strong>
                          <p style={{ margin: '4px 0 0', fontSize: '13px' }}>{r.prayers}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
