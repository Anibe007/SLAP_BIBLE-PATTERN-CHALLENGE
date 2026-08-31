import React, { useState, useEffect, useCallback } from 'react';
import { dbService } from '../services/db';
import { Flame, CheckCircle, Calendar, Plus, BookOpen, AlertCircle, Eye, Sparkles, ChevronLeft, ChevronRight, Loader, Search, ArrowRight, Download, FileText, Printer, X, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import AnimateOnScroll from '../components/AnimateOnScroll';
import CelebrationModal from '../components/CelebrationModal';
import { useAuth } from '../context/AuthContext';

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

/* ─── Translation mapping for bolls.life API ─── */
const API_TRANSLATIONS = {
  'KJV':  { id: 'KJV',    label: 'KJV (King James Version)' },
  'NKJV': { id: 'NKJV',   label: 'NKJV (New King James Version)' },
  'AMPC': { id: 'AMP',    label: 'AMPC (Amplified Bible Classic)' },
  'NIV':  { id: 'NIV2011', label: 'NIV (New International Version)' },
  'NLT':  { id: 'NLT',    label: 'NLT (New Living Translation)' },
  'TLB':  { id: 'NLT',    label: 'TLB (The Living Bible)' },
  'TPT':  { id: 'NLT',    label: 'TPT (The Passion Translation)' },
  'NCV':  { id: 'ERV',    label: 'NCV (New Century Version)' },
  'MSG':  { id: 'MSG',    label: 'MSG (The Message)' },
  'ESV':  { id: 'ESV',    label: 'ESV (English Standard Version)' },
};

/* ─── Book Name to numeric ID mapping (bolls.life uses 1-66) ─── */
const BOOK_ID_MAP = {};
BIBLE_BOOKS.forEach((b, idx) => { BOOK_ID_MAP[b.name] = idx + 1; });

/* ─── Helper to clean and format scripture text ─── */
export function cleanScriptureText(rawText) {
  if (!rawText) return '';
  return rawText
    .replace(/<S>[^<]*<\/S>/gi, '')
    .replace(/<s\d+>[^<]*<\/s\d+>/gi, '')
    .replace(/<sup[^>]*>.*?<\/sup>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&para;/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.:;?!])/g, '$1')
    .trim();
}

export default function Dashboard() {
  const { user } = useAuth();
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
  const [selectedReportModal, setSelectedReportModal] = useState(null);
  const [celebrationData, setCelebrationData] = useState(null);

  /* ─── Bible Reader State ─── */
  const [readerBook, setReaderBook] = useState('John');
  const [readerChapter, setReaderChapter] = useState(3);
  const [readerTranslation, setReaderTranslation] = useState('KJV');
  const [bibleText, setBibleText] = useState(null);
  const [bibleLoading, setBibleLoading] = useState(false);
  const [bibleError, setBibleError] = useState('');
  const [activeTab, setActiveTab] = useState('read'); // 'read', 'report', or 'concordance'

  /* ─── Concordance / Search State ─── */
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTranslation, setSearchTranslation] = useState('KJV');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

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

  /* ─── Bible Reader: Fetch scripture text from bolls.life ─── */
  const fetchBibleText = useCallback(async (bk, ch, trans) => {
    setBibleLoading(true);
    setBibleError('');
    setBibleText(null);

    const apiTrans = API_TRANSLATIONS[trans]?.id || 'KJV';
    const bookId = BOOK_ID_MAP[bk] || 43; // default to John
    const url = `https://bolls.life/get-text/${apiTrans}/${bookId}/${ch}/`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Scripture not found for this translation.');
      const data = await res.json();
      setBibleText({ verses: data, reference: `${bk} ${ch}` });
    } catch (err) {
      setBibleError(err.message || 'Failed to load scripture. Please try another translation.');
    } finally {
      setBibleLoading(false);
    }
  }, []);

  /* ─── Concordance: Search scripture text ─── */
  const handleConcordanceSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setSearchLoading(true);
    setSearchError('');
    setSearchResults([]);
    setHasSearched(true);

    const apiTrans = API_TRANSLATIONS[searchTranslation]?.id || 'KJV';
    const url = `https://bolls.life/search/${apiTrans}/${encodeURIComponent(searchQuery.trim())}/`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Search failed. Please try again.');
      const data = await res.json();
      setSearchResults(data.slice(0, 100)); // limit to 100 results
    } catch (err) {
      setSearchError(err.message || 'Search failed.');
    } finally {
      setSearchLoading(false);
    }
  };

  /* ─── Helper: Get book name from numeric ID ─── */
  const getBookNameById = (id) => {
    const bookObj = BIBLE_BOOKS[id - 1];
    return bookObj ? bookObj.name : `Book ${id}`;
  };

  // Load Bible text on mount and when reader settings change
  useEffect(() => {
    fetchBibleText(readerBook, readerChapter, readerTranslation);
  }, [readerBook, readerChapter, readerTranslation, fetchBibleText]);

  const getBookData = (bookName) => BIBLE_BOOKS.find(b => b.name === bookName);
  
  const goToPrevChapter = () => {
    if (readerChapter > 1) {
      setReaderChapter(prev => prev - 1);
    } else {
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
      const response = await dbService.submitReport({
        book,
        chapter,
        verses,
        translation,
        strikingVerses,
        lessonsLearnt,
        actionPlans,
        prayers
      });

      const updatedStreak = response?.streak?.current_streak || (streak?.current_streak ? streak.current_streak + 1 : 1);

      setSuccess('Daily SLAP report successfully submitted! Streak updated! 🔥');
      
      // Fire congratulations modal
      setCelebrationData({
        isOpen: true,
        type: 'report',
        title: `🎉 Congratulations on Today's SLAP Devotion!`,
        subtitle: `Your daily scripture reflections have been recorded. Keep your spiritual consistency burning bright!`,
        details: [
          { label: '📖 Scripture Studied', value: `${book} ${chapter}${verses ? ':' + verses : ''} (${translation})` },
          { label: '🔥 Current Consistency Streak', value: `${updatedStreak} Days Consecutive` },
          { label: '📅 Submission Date', value: new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) }
        ]
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
      
      const isCompleted = reports.some(r => r.submission_date === dateStr);
      
      boxes.push(
        <div
          key={dateStr}
          title={`${d.toDateString()}: ${isCompleted ? 'SLAP Complete!' : 'No report'}`}
          className={`contribution-cell ${isCompleted ? 'completed' : 'empty'}`}
        />
      );
    }
    return boxes;
  };

  const bookData = getBookData(readerBook);

  return (
    <div className="page-wrapper">
      
      {/* Top Welcome / Stats */}
      <AnimateOnScroll animation="fadeUp">
        <section className="dashboard-welcome">
          <div>
            <h1>Your Daily Study Dashboard</h1>
            <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
              Read scripture, study the Word, and submit your daily SLAP report.
            </p>
          </div>

          <div className="dashboard-stats">
            <div className="glass-card streak-card">
              <span className="streak-label">Current Streak</span>
              <div className="streak-value">
                <Flame fill="var(--accent-gold)" size={20} />
                {streak.current_streak} Days
              </div>
            </div>

            <div className="glass-card streak-card">
              <span className="streak-label">Longest Streak</span>
              <div className="streak-value">
                <Sparkles size={20} />
                {streak.longest_streak} Days
              </div>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      {/* Consistency Calendar grid */}
      <AnimateOnScroll animation="fadeUp" delay={100}>
        <section className="glass-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', marginBottom: '16px' }}>
            <Calendar size={18} /> Consistency Tracker (Last 28 Days)
          </h3>
          <div className="contribution-grid">
            {renderContributionGrid()}
          </div>
        </section>
      </AnimateOnScroll>

      {/* ═══════════ Tab Switcher: Read / Report / Concordance ═══════════ */}
      <div className="tab-bar">
        {[
          { key: 'read', icon: <BookOpen size={16} />, label: 'Read Scripture' },
          { key: 'concordance', icon: <Search size={16} />, label: 'Concordance' },
          { key: 'report', icon: <Plus size={16} />, label: 'Write Report' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`tab-item ${activeTab === tab.key ? 'active' : ''}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ═══════════ TAB: Bible Reader ═══════════ */}
      {activeTab === 'read' && (
        <section className="glass-card-static" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Reader Toolbar */}
          <div className="reader-toolbar">
            <div className="form-group book-select">
              <label className="text-label-sm">Book</label>
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

            <div className="form-group chapter-select">
              <label className="text-label-sm">Chapter</label>
              <select value={readerChapter} onChange={e => setReaderChapter(Number(e.target.value))}>
                {bookData && Array.from({ length: bookData.chapters }, (_, i) => i + 1).map(ch => (
                  <option key={ch} value={ch}>{ch}</option>
                ))}
              </select>
            </div>

            <div className="form-group translation-select">
              <label className="text-label-sm">Translation</label>
              <select value={readerTranslation} onChange={e => setReaderTranslation(e.target.value)}>
                {Object.entries(API_TRANSLATIONS).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Chapter Title & Navigation */}
          <div className="reader-nav">
            <button
              onClick={goToPrevChapter}
              disabled={readerBook === 'Genesis' && readerChapter === 1}
              className="reader-nav-btn"
            >
              <ChevronLeft size={16} /> Prev
            </button>

            <h2 className="reader-chapter-title">
              {readerBook} {readerChapter}
              <span className="reader-chapter-subtitle">
                {API_TRANSLATIONS[readerTranslation]?.label || readerTranslation}
              </span>
            </h2>

            <button
              onClick={goToNextChapter}
              disabled={readerBook === 'Revelation' && readerChapter === 22}
              className="reader-nav-btn"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>

          {/* Scripture Content */}
          <div className="scripture-body">
            {bibleLoading && (
              <div className="flex-center" style={{ padding: '80px 0', gap: '12px', color: 'var(--text-secondary)' }}>
                <Loader size={24} className="animate-spin" />
                <span>Loading scripture...</span>
              </div>
            )}

            {bibleError && (
              <div className="alert alert-error">
                <AlertCircle size={18} />
                <div>
                  <strong>Unable to load this passage.</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', opacity: 0.85 }}>{bibleError} Try selecting another translation.</p>
                </div>
              </div>
            )}

            {bibleText && bibleText.verses && (
              <div>
                {bibleText.verses.map((v, idx) => (
                  <span key={idx} style={{ marginRight: '4px' }}>
                    <sup className="verse-number">{v.verse}</sup>
                    {cleanScriptureText(v.text)}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Navigation + CTA */}
          <div className="reader-bottom-bar">
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={goToPrevChapter} className="btn-secondary" style={{ padding: '10px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ChevronLeft size={14} /> Previous
              </button>
              <button onClick={goToNextChapter} className="btn-secondary" style={{ padding: '10px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Next <ChevronRight size={14} />
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
              <div className="alert alert-error" style={{ marginBottom: '16px' }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success" style={{ marginBottom: '16px' }}>
                <CheckCircle size={16} /> {success}
              </div>
            )}

            <form onSubmit={handleSLAPSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div className="form-grid-2">
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

              <div className="form-grid-2">
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
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label><strong style={{ color: 'var(--accent-gold)' }}>S</strong> – Striking Verses</label>
                <textarea rows="3" placeholder="Which scripture stood out today?" value={strikingVerses} onChange={e => setStrikingVerses(e.target.value)} />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label><strong style={{ color: 'var(--accent-brown)' }}>L</strong> – Lessons Learnt</label>
                <textarea rows="3" placeholder="What core revelations did you extract?" value={lessonsLearnt} onChange={e => setLessonsLearnt(e.target.value)} />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label><strong style={{ color: 'var(--accent-olive)' }}>A</strong> – Action Plans</label>
                <textarea rows="3" placeholder="What specific actions will you take today?" value={actionPlans} onChange={e => setActionPlans(e.target.value)} />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label><strong style={{ color: 'var(--accent-rose)' }}>P</strong> – Prayers</label>
                <textarea rows="3" placeholder="Write a short sealing prayer..." value={prayers} onChange={e => setPrayers(e.target.value)} />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px' }}>
                Submit SLAP Devotion
              </button>
            </form>
          </section>

          {/* Report Log History & Documents */}
          <section className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '725px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px' }}>My SLAP Journal ({reports.length})</h2>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>View and download your daily study documents</p>
              </div>
              {reports.length > 0 && (
                <button
                  onClick={() => printOrDownloadFullJournal(reports, user)}
                  className="btn-secondary"
                  style={{
                    padding: '8px 14px',
                    fontSize: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--accent-gold)',
                    borderColor: 'var(--accent-gold)'
                  }}
                  title="Download all entries as a compiled study journal document"
                >
                  <Download size={14} /> Export Full Journal (PDF/Doc)
                </button>
              )}
            </div>

            {reports.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                <BookOpen size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                <p style={{ fontSize: '15px', fontWeight: '600' }}>No devotions logged yet</p>
                <p style={{ fontSize: '13px' }}>Submit your daily SLAP study to build your personal faith archive.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {reports.map((r) => (
                  <div key={r.id} className="report-card" style={{ padding: '16px', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                    <div className="report-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                          <BookOpen size={16} style={{ color: 'var(--accent-gold)' }} /> {r.book} {r.chapter}{r.verses ? `:${r.verses}` : ''} <span style={{ fontSize: '12px', opacity: 0.7 }}>({r.translation || 'KJV'})</span>
                        </h3>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                          <Calendar size={12} /> {new Date(r.submission_date || r.created_at).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn-secondary"
                          style={{
                            padding: '6px 12px',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          onClick={() => setSelectedReportModal(r)}
                          title="View complete report in detail"
                        >
                          <Eye size={12} /> View Report
                        </button>
                        <button
                          className="btn-primary"
                          style={{
                            padding: '6px 12px',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'var(--accent-gold)',
                            color: '#1a1409'
                          }}
                          onClick={() => printOrDownloadSingleReport(r, user)}
                          title="Print or Save as Document/PDF"
                        >
                          <Printer size={12} /> Document
                        </button>
                      </div>
                    </div>

                    {/* Quick collapsible snippet */}
                    <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px' }}>
                        <strong style={{ color: 'var(--accent-gold)' }}>Striking: </strong>
                        {((r.striking_verses || r.strikingVerses || '').slice(0, 110)) + ((r.striking_verses || r.strikingVerses || '').length > 110 ? '...' : '')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* ═══════════ VIEW REPORT MODAL ═══════════ */}
      {selectedReportModal && (
        <div className="drawer-backdrop open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1100 }}>
          <div className="glass-card" style={{ maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', border: '1px solid var(--accent-gold)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedReportModal(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
              aria-label="Close Modal"
            >
              <X size={22} />
            </button>

            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <BookOpen size={16} /> SLAP Bible Daily Devotion Report
              </div>
              <h2 style={{ fontSize: '24px', margin: '6px 0 2px', color: 'var(--text-primary)' }}>
                {selectedReportModal.book} {selectedReportModal.chapter}{selectedReportModal.verses ? `:${selectedReportModal.verses}` : ''}
              </h2>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <span><strong>Date:</strong> {new Date(selectedReportModal.submission_date || selectedReportModal.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span><strong>Translation:</strong> {selectedReportModal.translation || 'KJV'}</span>
              </div>
            </div>

            {/* S-L-A-P Content Blocks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Striking Verse */}
              <div style={{ background: 'rgba(212, 160, 23, 0.08)', borderLeft: '4px solid var(--accent-gold)', padding: '14px', borderRadius: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-gold)', letterSpacing: '1px' }}>
                  [S] Striking Scripture
                </span>
                <p style={{ margin: '6px 0 0', fontSize: '14px', lineHeight: '1.6', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
                  "{selectedReportModal.striking_verses || selectedReportModal.strikingVerses || 'None recorded'}"
                </p>
              </div>

              {/* Lessons Learnt */}
              <div style={{ background: 'rgba(92, 74, 50, 0.1)', borderLeft: '4px solid var(--accent-brown)', padding: '14px', borderRadius: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-brown)', letterSpacing: '1px' }}>
                  [L] Lessons Learnt & Revelations
                </span>
                <p style={{ margin: '6px 0 0', fontSize: '14px', lineHeight: '1.6' }}>
                  {selectedReportModal.lessons_learnt || selectedReportModal.lessonsLearnt || 'None recorded'}
                </p>
              </div>

              {/* Action Plans */}
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', borderLeft: '4px solid #10b981', padding: '14px', borderRadius: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#10b981', letterSpacing: '1px' }}>
                  [A] Action Plans & Application
                </span>
                <p style={{ margin: '6px 0 0', fontSize: '14px', lineHeight: '1.6' }}>
                  {selectedReportModal.action_plans || selectedReportModal.actionPlans || 'None recorded'}
                </p>
              </div>

              {/* Prayers */}
              <div style={{ background: 'rgba(244, 63, 94, 0.08)', borderLeft: '4px solid #f43f5e', padding: '14px', borderRadius: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#f43f5e', letterSpacing: '1px' }}>
                  [P] Sealing Prayers & Declarations
                </span>
                <p style={{ margin: '6px 0 0', fontSize: '14px', lineHeight: '1.6' }}>
                  {selectedReportModal.prayers || 'None recorded'}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <button
                className="btn-secondary"
                onClick={() => {
                  const textContent = `SLAP BIBLE REPORT\nScripture: ${selectedReportModal.book} ${selectedReportModal.chapter} (${selectedReportModal.translation})\nDate: ${selectedReportModal.submission_date}\n\n[S] Striking Verses:\n${selectedReportModal.striking_verses || selectedReportModal.strikingVerses}\n\n[L] Lessons Learnt:\n${selectedReportModal.lessons_learnt || selectedReportModal.lessonsLearnt}\n\n[A] Action Plans:\n${selectedReportModal.action_plans || selectedReportModal.actionPlans}\n\n[P] Prayers:\n${selectedReportModal.prayers}`;
                  navigator.clipboard.writeText(textContent);
                  alert('Report copied to clipboard! 📋');
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
              >
                <Share2 size={15} /> Copy Text
              </button>

              <button
                className="btn-primary"
                onClick={() => printOrDownloadSingleReport(selectedReportModal, user)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', background: 'var(--accent-gold)', color: '#1a1409' }}
              >
                <Printer size={15} /> Print / Save PDF Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ TAB: Concordance / Bible Search ═══════════ */}
      {activeTab === 'concordance' && (
        <section className="glass-card">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Search size={22} /> Bible Concordance
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Search for any word or phrase across the entire Bible. Find every verse where a word appears.
          </p>

          <form onSubmit={handleConcordanceSearch} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <div className="form-group" style={{ margin: 0, flex: '3', minWidth: '200px' }}>
              <label className="text-label-sm">Search Word or Phrase</label>
              <input
                type="text"
                placeholder='e.g. "faith", "love", "Holy Spirit", "grace"'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ fontSize: '15px' }}
                required
              />
            </div>
            <div className="form-group" style={{ margin: 0, flex: '1.5', minWidth: '180px' }}>
              <label className="text-label-sm">Translation</label>
              <select value={searchTranslation} onChange={e => setSearchTranslation(e.target.value)}>
                {Object.entries(API_TRANSLATIONS).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="btn-primary" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '6px' }} disabled={searchLoading}>
                <Search size={16} /> {searchLoading ? 'Searching...' : 'Search Bible'}
              </button>
            </div>
          </form>

          {/* Search Results */}
          {searchLoading && (
            <div className="flex-center" style={{ padding: '60px 0', gap: '12px', color: 'var(--text-secondary)' }}>
              <Loader size={24} className="animate-spin" />
              <span>Searching scripture for "{searchQuery}"...</span>
            </div>
          )}

          {searchError && (
            <div className="alert alert-error">
              <AlertCircle size={18} /> {searchError}
            </div>
          )}

          {hasSearched && !searchLoading && searchResults.length === 0 && !searchError && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: '16px' }}>No results found for "{searchQuery}".</p>
              <p style={{ fontSize: '13px' }}>Try a different word or translation.</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', fontWeight: '600' }}>
                Found {searchResults.length}{searchResults.length >= 100 ? '+' : ''} results for "{searchQuery}" in {API_TRANSLATIONS[searchTranslation]?.label}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px', overflowY: 'auto' }}>
                {searchResults.map((result, idx) => (
                  <div
                    key={idx}
                    className="search-result-card"
                    onClick={() => {
                      setReaderBook(getBookNameById(result.bookid || result.book));
                      setReaderChapter(result.chapter);
                      setReaderTranslation(searchTranslation);
                      setActiveTab('read');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ color: 'var(--accent-gold)', fontSize: '14px' }}>
                        {getBookNameById(result.bookid || result.book)} {result.chapter}:{result.verse}
                      </strong>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Click to read chapter</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>
                      {cleanScriptureText(result.text)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Celebratory Modal for Report Submissions */}
      <CelebrationModal
        isOpen={!!celebrationData?.isOpen}
        onClose={() => setCelebrationData(null)}
        type={celebrationData?.type || 'report'}
        title={celebrationData?.title}
        subtitle={celebrationData?.subtitle}
        details={celebrationData?.details || []}
        primaryBtnText="Continue to Journal"
        primaryBtnAction={() => setCelebrationData(null)}
      />
    </div>
  );
}

/* ═══════════ DOCUMENT EXPORT UTILITIES (Single & Full Journal) ═══════════ */

export function printOrDownloadSingleReport(report, user) {
  const participantName = user?.user_metadata?.full_name || user?.fullName || 'Participant';
  const participantEmail = user?.email || '';
  const dateFormatted = new Date(report.submission_date || report.created_at).toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const docHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SLAP Report - ${report.book} ${report.chapter} - ${participantName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    @page { size: A4; margin: 20mm; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #1a1a1a;
      background: #ffffff;
      line-height: 1.6;
      margin: 0;
      padding: 24px;
    }
    .doc-container {
      max-width: 800px;
      margin: 0 auto;
      border: 2px solid #d4a017;
      padding: 32px;
      border-radius: 8px;
      background: #fff;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #f1f1f1;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .logo-title {
      font-family: 'Cinzel', Georgia, serif;
      font-size: 26px;
      font-weight: 700;
      color: #92660a;
      letter-spacing: 2px;
      margin: 0 0 6px;
    }
    .subtitle {
      font-size: 13px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0;
    }
    .meta-bar {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      background: #fdfaf3;
      border: 1px solid #fae8b6;
      border-radius: 6px;
      padding: 12px 18px;
      font-size: 13px;
      margin-bottom: 28px;
    }
    .meta-item {
      margin: 4px 12px 4px 0;
    }
    .meta-item strong {
      color: #92660a;
    }
    .section-box {
      margin-bottom: 22px;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
      overflow: hidden;
    }
    .section-title {
      background: #f8fafc;
      padding: 8px 16px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      border-bottom: 1px solid #e5e7eb;
    }
    .section-title.s { background: #fef9ed; color: #92660a; border-color: #fae8b6; }
    .section-title.l { background: #fbf7f4; color: #5c4a32; border-color: #eeddd0; }
    .section-title.a { background: #f0fdf4; color: #047857; border-color: #bbf7d0; }
    .section-title.p { background: #fff1f2; color: #be123c; border-color: #fecdd3; }
    .section-content {
      padding: 14px 18px;
      font-size: 14px;
      color: #222;
      background: #fff;
    }
    .verse-quote {
      font-style: italic;
      font-size: 15px;
      line-height: 1.7;
    }
    .footer {
      text-align: center;
      margin-top: 36px;
      padding-top: 18px;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #888;
    }
    @media print {
      body { padding: 0; }
      .doc-container { border: 1px solid #ccc; padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="doc-container">
    <div class="header">
      <h1 class="logo-title">SLAP BIBLE CHALLENGE</h1>
      <p class="subtitle">Daily Scriptural Devotion & Study Report</p>
    </div>

    <div class="meta-bar">
      <div class="meta-item"><strong>Participant:</strong> ${participantName} ${participantEmail ? '(' + participantEmail + ')' : ''}</div>
      <div class="meta-item"><strong>Scripture:</strong> ${report.book} ${report.chapter}${report.verses ? ':' + report.verses : ''} (${report.translation || 'KJV'})</div>
      <div class="meta-item"><strong>Date:</strong> ${dateFormatted}</div>
    </div>

    <div class="section-box">
      <div class="section-title s">[S] – Striking Scripture Verse</div>
      <div class="section-content verse-quote">
        "${report.striking_verses || report.strikingVerses || 'None recorded'}"
      </div>
    </div>

    <div class="section-box">
      <div class="section-title l">[L] – Lessons Learnt & Spiritual Revelations</div>
      <div class="section-content">
        ${(report.lessons_learnt || report.lessonsLearnt || 'None recorded').replace(/\\n/g, '<br>')}
      </div>
    </div>

    <div class="section-box">
      <div class="section-title a">[A] – Action Plans & Life Application</div>
      <div class="section-content">
        ${(report.action_plans || report.actionPlans || 'None recorded').replace(/\\n/g, '<br>')}
      </div>
    </div>

    <div class="section-box">
      <div class="section-title p">[P] – Sealing Prayers & Declarations</div>
      <div class="section-content">
        ${(report.prayers || 'None recorded').replace(/\\n/g, '<br>')}
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 4px; font-weight: 600; color: #92660a;">Build People. Build Faith. Build on Christ.</p>
      <p style="margin: 0;">SLAP Bible Challenge Devotional System • Generated on ${new Date().toLocaleDateString()}</p>
    </div>
  </div>
  <script>
    window.onload = function() {
      window.print();
    }
  </script>
</body>
</html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(docHtml);
    printWindow.document.close();
  } else {
    // Fallback: download as .html document
    const blob = new Blob([docHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SLAP-Report-${report.book}-${report.chapter}.html`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

export function printOrDownloadFullJournal(reports, user) {
  const participantName = user?.user_metadata?.full_name || user?.fullName || 'Participant';
  const participantEmail = user?.email || '';

  const entriesHtml = reports.map((report, idx) => {
    const dateFormatted = new Date(report.submission_date || report.created_at).toLocaleDateString(undefined, {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });

    return `
    <div class="journal-entry" style="${idx > 0 ? 'page-break-before: always; margin-top: 40px;' : ''}">
      <div class="entry-header">
        <span class="entry-number">Entry #${reports.length - idx}</span>
        <h2 style="font-size: 20px; margin: 4px 0; color: #92660a;">${report.book} ${report.chapter}${report.verses ? ':' + report.verses : ''} (${report.translation || 'KJV'})</h2>
        <span style="font-size: 12px; color: #666;">Date: ${dateFormatted}</span>
      </div>

      <div class="section-box" style="margin-top: 16px;">
        <div class="section-title s">[S] Striking Scripture</div>
        <div class="section-content" style="font-style: italic;">"${report.striking_verses || report.strikingVerses || 'None'}"</div>
      </div>

      <div class="section-box">
        <div class="section-title l">[L] Lessons Learnt</div>
        <div class="section-content">${(report.lessons_learnt || report.lessonsLearnt || 'None').replace(/\\n/g, '<br>')}</div>
      </div>

      <div class="section-box">
        <div class="section-title a">[A] Action Plans</div>
        <div class="section-content">${(report.action_plans || report.actionPlans || 'None').replace(/\\n/g, '<br>')}</div>
      </div>

      <div class="section-box">
        <div class="section-title p">[P] Prayers</div>
        <div class="section-content">${(report.prayers || 'None').replace(/\\n/g, '<br>')}</div>
      </div>
    </div>
    `;
  }).join('');

  const fullDocHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SLAP Bible Devotional Journal - ${participantName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    @page { size: A4; margin: 15mm; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #1a1a1a;
      background: #ffffff;
      line-height: 1.6;
      margin: 0;
      padding: 24px;
    }
    .journal-cover {
      text-align: center;
      padding: 60px 20px 40px;
      border-bottom: 2px dashed #d4a017;
      margin-bottom: 40px;
    }
    .title {
      font-family: 'Cinzel', Georgia, serif;
      font-size: 32px;
      font-weight: 700;
      color: #92660a;
      letter-spacing: 2px;
      margin: 0 0 8px;
    }
    .section-box {
      margin-bottom: 14px;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
      overflow: hidden;
    }
    .section-title {
      background: #f8fafc;
      padding: 6px 14px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      border-bottom: 1px solid #e5e7eb;
    }
    .section-title.s { background: #fef9ed; color: #92660a; }
    .section-title.l { background: #fbf7f4; color: #5c4a32; }
    .section-title.a { background: #f0fdf4; color: #047857; }
    .section-title.p { background: #fff1f2; color: #be123c; }
    .section-content {
      padding: 10px 14px;
      font-size: 13px;
      color: #222;
      background: #fff;
    }
    .entry-number {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #92660a;
    }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="journal-cover">
    <h1 class="title">MY SLAP BIBLE JOURNAL</h1>
    <p style="font-size: 15px; color: #666; margin: 0 0 16px;">Daily Study &amp; Spiritual Reflections Archive</p>
    <div style="font-size: 14px; color: #333;">
      <strong>Participant:</strong> ${participantName} | <strong>Total Devotions:</strong> ${reports.length} Entries
    </div>
  </div>

  ${entriesHtml}

  <script>
    window.onload = function() {
      window.print();
    }
  </script>
</body>
</html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(fullDocHtml);
    printWindow.document.close();
  } else {
    const blob = new Blob([fullDocHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SLAP-Full-Journal-${participantName.replace(/\s+/g, '-')}.html`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

