import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { dbService } from '../services/db';
import { Flame, CheckCircle, Calendar, Plus, Minus, BookOpen, AlertCircle, Eye, Sparkles, ChevronLeft, ChevronRight, Loader, Search, ArrowRight, Download, FileText, Printer, X, Share2, Copy, Check, Bookmark, Volume2, VolumeX, Play, Pause, Square, List, AlignLeft, Type } from 'lucide-react';
import confetti from 'canvas-confetti';
import AnimateOnScroll from '../components/AnimateOnScroll';
import CelebrationModal from '../components/CelebrationModal';
import { useAuth } from '../context/AuthContext';
import { audioReader } from '../services/audioReader';

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

/* ─── Translation mapping for bolls.life API & Local Pidgin ─── */
const API_TRANSLATIONS = {
  'KJV':    { id: 'KJV',      label: 'KJV (King James Version)' },
  'NKJV':   { id: 'NKJV',    label: 'NKJV (New King James Version)' },
  'AMP':    { id: 'AMP',     label: 'AMP (Amplified Bible)' },
  'AMPC':   { id: 'AMP',     label: 'AMPC (Amplified Bible Classic)' },
  'NIV':    { id: 'NIV2011', label: 'NIV (New International Version)' },
  'NLT':    { id: 'NLT',     label: 'NLT (New Living Translation)' },
  'TLB':    { id: 'NLT',     label: 'TLB (The Living Bible)' },
  'TPT':    { id: 'NLT',     label: 'TPT (The Passion Translation)' },
  'NCV':    { id: 'ERV',     label: 'NCV (New Century Version)' },
  'MSG':    { id: 'MSG',     label: 'MSG (The Message)' },
  'ESV':    { id: 'ESV',     label: 'ESV (English Standard Version)' },
  'PIDGIN': { id: 'PIDGIN',  label: 'Pidgin Bible (Original Nigerian Pidgin)' },
  'PIGEON': { id: 'PIDGIN',  label: 'Pidgin Bible (Original Nigerian Pidgin)', alias: true },
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
    .replace(/©.*$/gi, '')
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
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  /* ─── Enhanced Bible Reader Experience State ─── */
  const [readerLayout, setReaderLayout] = useState(() => {
    return localStorage.getItem('slap_reader_layout') || 'verse'; // 'verse' (Verse-by-Verse) or 'paragraph' (Flowing)
  });
  const [readerFontSize, setReaderFontSize] = useState(() => {
    return parseInt(localStorage.getItem('slap_reader_fontsize') || '18', 10);
  });
  const [readerFontFamily, setReaderFontFamily] = useState(() => {
    return localStorage.getItem('slap_reader_font') || 'serif'; // 'serif' or 'sans'
  });
  const [highlightedVerses, setHighlightedVerses] = useState(new Set());
  const [copiedVerse, setCopiedVerse] = useState(null);
  const [readerToast, setReaderToast] = useState('');
  const [audioState, setAudioState] = useState('IDLE'); // 'IDLE' | 'PLAYING' | 'PAUSED' | 'ERROR'
  const [activeAudioVerse, setActiveAudioVerse] = useState(null);

  /* ─── Daily SLAP Target (chapters per day) ─── */
  const [dailyTarget, setDailyTarget] = useState(() => {
    const saved = localStorage.getItem('slap_daily_target');
    return saved ? parseInt(saved, 10) : 1;
  });

  const handleDailyTargetChange = (val) => {
    const n = Math.max(1, Math.min(70, parseInt(val, 10) || 1));
    setDailyTarget(n);
    localStorage.setItem('slap_daily_target', String(n));
  };

  /* ─── Concordance / Search State ─── */
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTranslation, setSearchTranslation] = useState('KJV');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  /* ─── Hebrew / Greek Word Definitions State ─── */
  const [wordDefinitions, setWordDefinitions] = useState(null);
  const [defLoading, setDefLoading] = useState(false);

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

    const transKey = trans || 'KJV';
    const isPidgin = transKey === 'PIDGIN' || transKey === 'PIGEON';

    if (isPidgin) {
      try {
        // Load original Nigerian Pidgin Bible
        const res = await fetch(`/bible/pcm/${encodeURIComponent(bk)}.json`);
        if (!res.ok) throw new Error('Pidgin scripture not found for this book.');
        const bookData = await res.json();
        const chapterVerses = bookData[String(ch)] || [];
        if (!chapterVerses || chapterVerses.length === 0) {
          throw new Error(`Chapter ${ch} not found in Pidgin Bible for ${bk}.`);
        }
        setBibleText({ verses: chapterVerses, reference: `${bk} ${ch}` });
      } catch (err) {
        setBibleError(err.message || 'Failed to load Pidgin scripture.');
      } finally {
        setBibleLoading(false);
      }
      return;
    }

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
    setWordDefinitions(null);
    setHasSearched(true);

    const isPidgin = searchTranslation === 'PIDGIN' || searchTranslation === 'PIGEON';

    if (isPidgin) {
      try {
        const q = searchQuery.trim().toLowerCase();
        const results = [];
        // Priority books for instant search
        const priorityBooks = [readerBook, 'John', 'Romans', 'Genesis', 'Psalms', 'Matthew', 'Proverbs', 'Acts', 'Ephesians', 'Hebrews', 'James'];
        const uniqueBooks = Array.from(new Set(priorityBooks));

        for (const bk of uniqueBooks) {
          try {
            const res = await fetch(`/bible/pcm/${encodeURIComponent(bk)}.json`);
            if (res.ok) {
              const bookData = await res.json();
              for (const [chNum, vList] of Object.entries(bookData)) {
                for (const v of vList) {
                  if (v.text && v.text.toLowerCase().includes(q)) {
                    results.push({
                      book: bk,
                      bookname: bk,
                      chapter: Number(chNum),
                      verse: v.verse,
                      text: v.text
                    });
                    if (results.length >= 100) break;
                  }
                }
                if (results.length >= 100) break;
              }
            }
          } catch (_) {}
          if (results.length >= 100) break;
        }

        setSearchResults(results);
        fetchWordDefinitions(searchQuery.trim());
      } catch (err) {
        setSearchError('Search failed in Pidgin Bible.');
      } finally {
        setSearchLoading(false);
      }
      return;
    }

    const apiTrans = API_TRANSLATIONS[searchTranslation]?.id || 'KJV';
    // Search across all 66 books (bolls.life default searches all books)
    const url = `https://bolls.life/search/${apiTrans}/${encodeURIComponent(searchQuery.trim())}/`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Search failed. Please try again.');
      const data = await res.json();
      // Sort results by book order (canonical)
      const sorted = (Array.isArray(data) ? data : []).sort((a, b) => {
        const bookA = a.bookid ?? a.book ?? 99;
        const bookB = b.bookid ?? b.book ?? 99;
        if (bookA !== bookB) return bookA - bookB;
        if (a.chapter !== b.chapter) return a.chapter - b.chapter;
        return a.verse - b.verse;
      });
      setSearchResults(sorted.slice(0, 150));

      // Also fetch Hebrew/Greek word definitions
      fetchWordDefinitions(searchQuery.trim());
    } catch (err) {
      setSearchError(err.message || 'Search failed.');
    } finally {
      setSearchLoading(false);
    }
  };

  /* ─── Hebrew/Greek definition lookup via Free Dictionary + Bible Hub ─── */
  const fetchWordDefinitions = async (word) => {
    setDefLoading(true);
    try {
      // Use the Free Dictionary API for English meaning
      const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`);
      let englishDef = null;
      if (dictRes.ok) {
        const dictData = await dictRes.json();
        if (Array.isArray(dictData) && dictData.length > 0) {
          const entry = dictData[0];
          const meanings = entry.meanings?.slice(0, 2).map(m => ({
            partOfSpeech: m.partOfSpeech,
            definition: m.definitions?.[0]?.definition || ''
          })) || [];
          englishDef = { word: entry.word, phonetic: entry.phonetic || '', meanings };
        }
      }

      // Hebrew & Greek Strong's concordance data (curated key words)
      const hebrewGreekMap = getHebrewGreekData(word.toLowerCase());

      setWordDefinitions({ english: englishDef, biblical: hebrewGreekMap });
    } catch {
      setWordDefinitions({ english: null, biblical: null });
    } finally {
      setDefLoading(false);
    }
  };

  /* ─── Curated Hebrew/Greek Strong's data for common Bible words ─── */
  const getHebrewGreekData = (word) => {
    const data = {
      // Hebrew OT words
      'love': {
        hebrew: [{ strongs: 'H157', transliteration: 'ʾāhab', meaning: 'To love, to have affection for, to like; a deep emotional attachment or strong desire.' }],
        greek:  [{ strongs: 'G26', transliteration: 'agapē', meaning: 'Unconditional, selfless, divine love — the highest form of love, used for God\'s love for humanity.' }, { strongs: 'G5368', transliteration: 'phileō', meaning: 'Brotherly affection, friendship love; warm regard and fondness.' }]
      },
      'faith': {
        hebrew: [{ strongs: 'H530', transliteration: 'ʾĕmûnāh', meaning: 'Faithfulness, steadiness, reliability; trustworthiness of God and His word.' }],
        greek:  [{ strongs: 'G4102', transliteration: 'pistis', meaning: 'Faith, belief, trust; conviction of the truth of something, reliance upon God.' }]
      },
      'grace': {
        hebrew: [{ strongs: 'H2580', transliteration: 'ḥēn', meaning: 'Grace, favor, kindness shown to one who does not deserve it; beauty and elegance.' }],
        greek:  [{ strongs: 'G5485', transliteration: 'charis', meaning: 'Grace, unmerited favor; God\'s free and undeserved gift, the divine influence on the heart.' }]
      },
      'peace': {
        hebrew: [{ strongs: 'H7965', transliteration: 'shālôm', meaning: 'Peace, completeness, wholeness, welfare, safety; a state of harmony and well-being.' }],
        greek:  [{ strongs: 'G1515', transliteration: 'eirēnē', meaning: 'Peace, quietness, rest; a state of national tranquility, harmony between individuals.' }]
      },
      'holy': {
        hebrew: [{ strongs: 'H6918', transliteration: 'qādôsh', meaning: 'Holy, sacred, set apart; morally pure, belonging exclusively to God.' }],
        greek:  [{ strongs: 'G40', transliteration: 'hagios', meaning: 'Holy, set apart, consecrated; separated from common use and dedicated to God.' }]
      },
      'word': {
        hebrew: [{ strongs: 'H1697', transliteration: 'dābār', meaning: 'Word, speech, saying; a matter, thing, or commandment.' }],
        greek:  [{ strongs: 'G3056', transliteration: 'logos', meaning: 'Word, the divine expression; Christ as the living Word of God. Also: reason, account, message.' }, { strongs: 'G4487', transliteration: 'rhēma', meaning: 'A spoken word, specific utterance; what is declared by the living voice.' }]
      },
      'spirit': {
        hebrew: [{ strongs: 'H7307', transliteration: 'rûaḥ', meaning: 'Spirit, wind, breath; the animating principle of life, the Spirit of God.' }],
        greek:  [{ strongs: 'G4151', transliteration: 'pneuma', meaning: 'Spirit, breath; the Holy Spirit; the human spirit; a spiritual being.' }]
      },
      'salvation': {
        hebrew: [{ strongs: 'H3444', transliteration: 'yĕshûʿāh', meaning: 'Salvation, deliverance, rescue; the saving acts of God, welfare and victory.' }],
        greek:  [{ strongs: 'G4991', transliteration: 'sōtēria', meaning: 'Salvation, deliverance, preservation; rescue from danger or destruction through Christ.' }]
      },
      'righteousness': {
        hebrew: [{ strongs: 'H6664', transliteration: 'ṣedeq', meaning: 'Righteousness, justice, rightness; conformity to a standard of right, virtue.' }],
        greek:  [{ strongs: 'G1343', transliteration: 'dikaiosynē', meaning: 'Righteousness, justice; the state of being right before God, uprightness of heart.' }]
      },
      'prayer': {
        hebrew: [{ strongs: 'H8605', transliteration: 'tĕpillāh', meaning: 'Prayer, intercession; a formal petition or song of praise directed to God.' }],
        greek:  [{ strongs: 'G4335', transliteration: 'proseuchē', meaning: 'Prayer, a vow; the act of addressing God, communicating with the divine.' }]
      },
      'strength': {
        hebrew: [{ strongs: 'H2428', transliteration: 'ḥayil', meaning: 'Strength, might, ability, valor; military force, wealth, and capability.' }],
        greek:  [{ strongs: 'G1411', transliteration: 'dynamis', meaning: 'Power, might, ability; miraculous power, the power of God at work.' }]
      },
      'truth': {
        hebrew: [{ strongs: 'H571', transliteration: 'ʾĕmet', meaning: 'Truth, faithfulness, reliability; that which is stable and sure, the opposite of falsehood.' }],
        greek:  [{ strongs: 'G225', transliteration: 'alētheia', meaning: 'Truth, reality; what is genuine and actual, the truth as revealed by God.' }]
      },
      'heart': {
        hebrew: [{ strongs: 'H3820', transliteration: 'lēb', meaning: 'Heart, mind, inner man; the seat of thought, will, emotion, and moral character.' }],
        greek:  [{ strongs: 'G2588', transliteration: 'kardia', meaning: 'Heart; the center of physical and spiritual life, the seat of thoughts and feelings.' }]
      },
      'sin': {
        hebrew: [{ strongs: 'H2398', transliteration: 'ḥāṭā', meaning: 'To sin, miss the mark; to deviate from righteousness, to fall short of God\'s standard.' }],
        greek:  [{ strongs: 'G266', transliteration: 'hamartia', meaning: 'Sin, missing the mark; deviation from the will of God; moral failure.' }]
      },
      'covenant': {
        hebrew: [{ strongs: 'H1285', transliteration: 'bĕrît', meaning: 'Covenant, agreement, treaty; a binding agreement between God and His people.' }],
        greek:  [{ strongs: 'G1242', transliteration: 'diathēkē', meaning: 'Covenant, testament; a solemn agreement that defines the relationship between God and His people.' }]
      },
      'worship': {
        hebrew: [{ strongs: 'H7812', transliteration: 'shāḥāh', meaning: 'To worship, bow down, prostrate oneself; an act of reverence before God.' }],
        greek:  [{ strongs: 'G4352', transliteration: 'proskuneō', meaning: 'To worship, adore, bow in reverence; to show honor and submission to God.' }]
      },
      'blessing': {
        hebrew: [{ strongs: 'H1293', transliteration: 'bĕrākāh', meaning: 'Blessing, praise, gift; divine favor bestowed upon a person; an act of invoking God\'s favor.' }],
        greek:  [{ strongs: 'G2129', transliteration: 'eulogia', meaning: 'Blessing, praise, consecration; speaking well of someone; divine favor and gift.' }]
      },
      'glory': {
        hebrew: [{ strongs: 'H3519', transliteration: 'kābôd', meaning: 'Glory, honor, majesty; the visible manifestation of God\'s presence and splendor.' }],
        greek:  [{ strongs: 'G1391', transliteration: 'doxa', meaning: 'Glory, honor, renown; the brightness and splendor of God\'s presence, divine radiance.' }]
      },
      'mercy': {
        hebrew: [{ strongs: 'H2617', transliteration: 'ḥesed', meaning: 'Mercy, lovingkindness, steadfast love; loyal love and kindness that exceeds what is expected.' }],
        greek:  [{ strongs: 'G1656', transliteration: 'eleos', meaning: 'Mercy, compassion; kindness or good will toward the miserable, help given in distress.' }]
      },
      'wisdom': {
        hebrew: [{ strongs: 'H2451', transliteration: 'ḥokmāh', meaning: 'Wisdom, skill; the ability to make right decisions and live skillfully before God.' }],
        greek:  [{ strongs: 'G4678', transliteration: 'sophia', meaning: 'Wisdom, insight; skill in managing affairs, understanding of divine things.' }]
      },
    };
    const entry = data[word];
    if (!entry) return null;
    return entry;
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

  // Subscribe to Audio Reader updates
  useEffect(() => {
    const unsubscribe = audioReader.subscribe(({ state, activeVerse, error }) => {
      setAudioState(state);
      setActiveAudioVerse(activeVerse);
      if (error) {
        setReaderToast(`⚠️ ${error}`);
        setTimeout(() => setReaderToast(''), 4000);
      }
    });
    return () => unsubscribe();
  }, []);

  // When active audio verse changes, smoothly scroll it into view
  useEffect(() => {
    if (activeAudioVerse && (audioState === 'PLAYING' || audioState === 'PAUSED')) {
      const el = document.getElementById(`verse-${activeAudioVerse}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeAudioVerse, audioState]);

  // Stop audio and clear highlights when switching passage
  useEffect(() => {
    audioReader.stop();
    setHighlightedVerses(new Set());
  }, [readerBook, readerChapter, readerTranslation]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      audioReader.stop();
    };
  }, []);

  const handleAudioPlayPause = () => {
    if (!audioReader.isSupported) {
      setReaderToast("⚠️ Text-to-speech audio reader is not supported in this browser.");
      setTimeout(() => setReaderToast(''), 4000);
      return;
    }

    if (audioState === 'PLAYING') {
      audioReader.pause();
    } else if (audioState === 'PAUSED') {
      audioReader.resume();
    } else {
      if (!bibleText?.verses?.length) {
        setReaderToast("⚠️ No scripture verses available to read.");
        setTimeout(() => setReaderToast(''), 3000);
        return;
      }
      audioReader.play(readerBook, readerChapter, bibleText.verses, 0);
    }
  };

  const handleAudioStop = () => {
    audioReader.stop();
  };

  const handleCopyVerse = (v) => {
    const ref = `${readerBook} ${readerChapter}:${v.verse}`;
    const transName = API_TRANSLATIONS[readerTranslation]?.id || readerTranslation;
    const txt = cleanScriptureText(v.text);
    const toCopy = `${ref} (${transName})\n"${txt}"`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(toCopy);
    }
    setCopiedVerse(v.verse);
    setReaderToast(`📋 Copied ${ref} to clipboard`);
    setTimeout(() => {
      setCopiedVerse(null);
      setReaderToast('');
    }, 2500);
  };

  const handleSetStrikingVerse = (v) => {
    const ref = `${readerBook} ${readerChapter}:${v.verse}`;
    const txt = cleanScriptureText(v.text);
    const striking = `${ref} — "${txt}"`;
    setStrikingVerses(striking);
    setBook(readerBook);
    setChapter(String(readerChapter));
    setVerses(String(v.verse));
    setTranslation(readerTranslation);
    setReaderToast(`✨ Added ${ref} to SLAP Striking Verses!`);
    setTimeout(() => setReaderToast(''), 3000);
  };

  const toggleHighlightVerse = (vNum) => {
    setHighlightedVerses(prev => {
      const next = new Set(prev);
      if (next.has(vNum)) {
        next.delete(vNum);
      } else {
        next.add(vNum);
      }
      return next;
    });
  };

  const changeFontSize = (delta) => {
    setReaderFontSize(prev => {
      const next = Math.max(15, Math.min(26, prev + delta));
      localStorage.setItem('slap_reader_fontsize', String(next));
      return next;
    });
  };

  const toggleFontFamily = () => {
    setReaderFontFamily(prev => {
      const next = prev === 'serif' ? 'sans' : 'serif';
      localStorage.setItem('slap_reader_font', next);
      return next;
    });
  };

  const setViewLayout = (mode) => {
    setReaderLayout(mode);
    localStorage.setItem('slap_reader_layout', mode);
  };

  const readingStats = useMemo(() => {
    if (!bibleText?.verses?.length) return { verseCount: 0, wordCount: 0, readMinutes: 1 };
    let words = 0;
    bibleText.verses.forEach(v => {
      words += (v.text || '').split(/\s+/).filter(Boolean).length;
    });
    const minutes = Math.max(1, Math.ceil(words / 190));
    return {
      verseCount: bibleText.verses.length,
      wordCount: words,
      readMinutes: minutes
    };
  }, [bibleText]);

  const paragraphGroups = useMemo(() => {
    if (!bibleText?.verses?.length) return [];
    const groups = [];
    const chunkSize = 4;
    for (let i = 0; i < bibleText.verses.length; i += chunkSize) {
      groups.push(bibleText.verses.slice(i, i + chunkSize));
    }
    return groups;
  }, [bibleText]);

  const jumpMilestones = useMemo(() => {
    if (!bibleText?.verses?.length || bibleText.verses.length < 16) return [];
    const milestones = [];
    const step = bibleText.verses.length > 50 ? 10 : 5;
    for (let i = 1; i <= bibleText.verses.length; i += step) {
      milestones.push(i);
    }
    return milestones;
  }, [bibleText]);

  const handleSLAPSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const cleanStriking = (strikingVerses || '').trim();
    const cleanLessons = (lessonsLearnt || '').trim();
    const cleanActions = (actionPlans || '').trim();
    const cleanPrayers = (prayers || '').trim();

    const missingFields = [];
    if (!cleanStriking) missingFields.push('S – Striking Verses');
    if (!cleanLessons)  missingFields.push('L – Lessons Learnt');
    if (!cleanActions)  missingFields.push('A – Action Plans');
    if (!cleanPrayers)  missingFields.push('P – Prayers');

    if (missingFields.length > 0) {
      setError(`Please complete: ${missingFields.join(', ')} before submitting your devotion.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await dbService.submitReport({
        book,
        chapter: parseInt(chapter, 10) || 1,
        verses: (verses || '').trim(),
        translation,
        strikingVerses: cleanStriking,
        lessonsLearnt: cleanLessons,
        actionPlans: cleanActions,
        prayers: cleanPrayers
      }, user);

      const updatedStreak = response?.streak?.current_streak || (streak?.current_streak ? streak.current_streak + 1 : 1);

      setSuccess('Thank You! Your Report has been submitted Successfully');
      
      // Fire celebratory thank-you modal
      setCelebrationData({
        isOpen: true,
        type: 'report',
        title: `Thank You! 🙏`,
        subtitle: `Your Report has been submitted Successfully`,
        details: [
          { label: '📖 Scripture Studied', value: `${book} ${chapter}${verses ? ':' + verses : ''} (${translation})` },
          { label: '🔥 Current Streak', value: `${updatedStreak} Days Consecutive` },
          { label: '📅 Submitted On', value: new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) }
        ]
      });

      // Reset form fields
      setStrikingVerses('');
      setLessonsLearnt('');
      setActionPlans('');
      setPrayers('');
      setVerses('');

      // Reload dashboard entries
      await fetchDashboardData();
    } catch (err) {
      console.error("Submit devotion failed:", err);
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate consistency grid boxes based on dailyTarget
  // A day is "completed" if the user submitted at least dailyTarget SLAP reports on that date
  const renderContributionGrid = () => {
    const boxes = [];
    const today = new Date();
    const daysToShow = 28;

    // Group reports by submission date to count how many were submitted per day
    const reportsByDate = {};
    reports.forEach(r => {
      const dateStr = r.submission_date || (r.created_at ? r.created_at.split('T')[0] : null);
      if (dateStr) reportsByDate[dateStr] = (reportsByDate[dateStr] || 0) + 1;
    });
    
    for (let i = daysToShow - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = reportsByDate[dateStr] || 0;
      const isCompleted = count >= dailyTarget;
      const isPartial = count > 0 && count < dailyTarget;
      
      boxes.push(
        <div
          key={dateStr}
          title={`${d.toDateString()}: ${count === 0 ? 'No report' : isCompleted ? `✓ Complete (${count}/${dailyTarget} SLAPs)` : `In Progress (${count}/${dailyTarget} SLAPs)`}`}
          className={`contribution-cell ${isCompleted ? 'completed' : isPartial ? 'partial' : 'empty'}`}
        />
      );
    }
    return boxes;
  };

  const bookData = getBookData(readerBook);

  // ─── Derive user display info ───
  const displayName = user?.fullName || user?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Believer';
  const avatarUrl   = user?.avatar_url || user?.user_metadata?.avatar_url || null;
  const userCountry = user?.country || user?.user_metadata?.country || '';
  const userEmail   = user?.email || '';
  const initials    = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="page-wrapper">
      
      {/* ─── Personalized Profile Welcome Banner ─── */}
      <AnimateOnScroll animation="fadeUp">
        <section className="dashboard-welcome" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          {/* Avatar + Name block */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flex: 1 }}>
            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  style={{
                    width: '68px', height: '68px', borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid var(--brand-crimson)',
                    boxShadow: '0 0 0 4px rgba(178,13,48,0.18)'
                  }}
                  onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
                />
              ) : null}
              <div style={{
                width: '68px', height: '68px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--brand-crimson), #8a0a26)',
                display: avatarUrl ? 'none' : 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '24px', fontWeight: '800', color: '#ffffff',
                border: '3px solid var(--brand-crimson)',
                boxShadow: '0 0 0 4px rgba(178,13,48,0.18)'
              }}>
                {initials}
              </div>
              {/* Online dot */}
              <div style={{
                width: '14px', height: '14px', borderRadius: '50%', background: '#22c55e',
                position: 'absolute', bottom: '2px', right: '2px',
                border: '2px solid var(--bg-primary)'
              }} />
            </div>

            {/* Name & Info */}
            <div>
              <div style={{ fontSize: '13px', color: 'var(--brand-crimson)', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '2px' }}>
                {greeting()}, Believer! 👋
              </div>
              <h1 style={{ margin: '0 0 4px', fontSize: '26px', lineHeight: 1.2 }}>{displayName}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {userEmail && (
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{userEmail}</span>
                )}
                {userCountry && (
                  <span style={{
                    fontSize: '12px', fontWeight: '700', color: 'var(--brand-crimson)',
                    background: 'rgba(178,13,48,0.10)', padding: '2px 10px', borderRadius: '20px',
                    border: '1px solid rgba(178,13,48,0.2)'
                  }}>🌍 {userCountry}</span>
                )}
                <span style={{
                  fontSize: '12px', fontWeight: '700', color: '#22c55e',
                  background: 'rgba(34,197,94,0.12)', padding: '2px 10px', borderRadius: '20px'
                }}>● Active Believer</span>
              </div>
            </div>
          </div>

          {/* Streak Stats */}
          <div className="dashboard-stats">
            <div className="glass-card streak-card" style={{ borderTop: '3px solid var(--brand-crimson)' }}>
              <span className="streak-label">Current Streak</span>
              <div className="streak-value">
                <Flame fill="var(--brand-crimson)" color="var(--brand-crimson)" size={20} />
                {streak.current_streak} Days
              </div>
            </div>

            <div className="glass-card streak-card" style={{ borderTop: '3px solid var(--brand-navy)' }}>
              <span className="streak-label">Longest Streak</span>
              <div className="streak-value">
                <Sparkles size={20} style={{ color: 'var(--brand-navy)' }} />
                {streak.longest_streak} Days
              </div>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      {/* Consistency Calendar grid */}
      <AnimateOnScroll animation="fadeUp" delay={100}>
        <section className="glass-card">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', margin: '0 0 4px' }}>
                <Calendar size={18} /> Consistency Tracker (Last 28 Days)
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                Showing days where you met your daily target of <strong style={{ color: 'var(--brand-crimson)' }}>{dailyTarget} SLAP{dailyTarget > 1 ? 's' : ''}</strong> per day.
              </p>
            </div>
            {/* Daily Target Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                📖 Daily SLAP Target:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={() => handleDailyTargetChange(dailyTarget - 1)}
                  disabled={dailyTarget <= 1}
                  style={{
                    width: '30px', height: '30px', borderRadius: '6px',
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)', fontWeight: '700', fontSize: '16px',
                    cursor: dailyTarget <= 1 ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: dailyTarget <= 1 ? 0.4 : 1,
                  }}
                  aria-label="Decrease daily target"
                >−</button>
                <input
                  type="number"
                  min="1" max="70"
                  value={dailyTarget}
                  onChange={e => handleDailyTargetChange(e.target.value)}
                  style={{
                    width: '52px', height: '30px',
                    textAlign: 'center', fontWeight: '800',
                    fontSize: '15px', padding: '0 4px',
                    borderRadius: '6px', border: '1.5px solid var(--brand-crimson)',
                    background: 'var(--bg-card)', color: 'var(--brand-crimson)',
                  }}
                  aria-label="Daily SLAP chapters target"
                />
                <button
                  onClick={() => handleDailyTargetChange(dailyTarget + 1)}
                  disabled={dailyTarget >= 70}
                  style={{
                    width: '30px', height: '30px', borderRadius: '6px',
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)', fontWeight: '700', fontSize: '16px',
                    cursor: dailyTarget >= 70 ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: dailyTarget >= 70 ? 0.4 : 1,
                  }}
                  aria-label="Increase daily target"
                >+</button>
              </div>
              <span style={{
                fontSize: '11px', color: 'var(--text-secondary)',
                background: 'var(--bg-tertiary)', padding: '3px 8px', borderRadius: '20px',
              }}>chapters/day · 1–70</span>
            </div>
          </div>
          <div className="contribution-grid">
            {renderContributionGrid()}
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: 'linear-gradient(135deg, var(--brand-crimson), var(--brand-navy))' }} />
              Target met
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: 'rgba(212,160,23,0.5)' }} />
              Partial progress
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }} />
              No report
            </div>
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
                {Object.entries(API_TRANSLATIONS).filter(([_, val]) => !val.alias).map(([key, val]) => (
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

          {/* Enhanced Reader Experience & Controls Bar */}
          <div className="reader-controls-bar">
            {/* Left: View Mode Toggle & Chapter Metadata */}
            <div className="reader-control-group">
              <button
                type="button"
                onClick={() => setViewLayout('verse')}
                className={`reader-toggle-btn ${readerLayout === 'verse' ? 'active' : ''}`}
                title="Switch to Verse-by-Verse structured study layout"
              >
                <List size={14} />
                <span>Verse-by-Verse</span>
              </button>
              <button
                type="button"
                onClick={() => setViewLayout('paragraph')}
                className={`reader-toggle-btn ${readerLayout === 'paragraph' ? 'active' : ''}`}
                title="Switch to flowing paragraph reading layout"
              >
                <AlignLeft size={14} />
                <span>Paragraphs</span>
              </button>

              {readingStats.verseCount > 0 && (
                <span className="reader-meta-pill">
                  📖 {readingStats.verseCount} Verses · ⏱ ~{readingStats.readMinutes} min read
                </span>
              )}
            </div>

            {/* Right: Typography, Font Size, Audio Speech Reader */}
            <div className="reader-control-group">
              {/* Font Size Adjusters */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <button
                  type="button"
                  onClick={() => changeFontSize(-1)}
                  disabled={readerFontSize <= 15}
                  className="reader-font-btn"
                  title="Smaller text"
                  aria-label="Decrease font size"
                >
                  <Minus size={12} />
                </button>
                <span style={{ fontSize: '12px', fontWeight: '800', minWidth: '34px', textAlign: 'center', color: 'var(--text-primary)' }}>
                  {readerFontSize}px
                </span>
                <button
                  type="button"
                  onClick={() => changeFontSize(1)}
                  disabled={readerFontSize >= 26}
                  className="reader-font-btn"
                  title="Larger text"
                  aria-label="Increase font size"
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* Font Style Toggle */}
              <button
                type="button"
                onClick={toggleFontFamily}
                className="reader-toggle-btn"
                title="Toggle between Classical Serif and Modern Sans font"
              >
                <Type size={13} />
                <span>{readerFontFamily === 'serif' ? 'Serif' : 'Modern'}</span>
              </button>

              {/* Audio Listen Aloud Controls (Play, Pause, Resume, Stop) */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <button
                  type="button"
                  onClick={handleAudioPlayPause}
                  className={`reader-audio-btn ${audioState === 'PLAYING' ? 'playing' : audioState === 'PAUSED' ? 'paused' : ''}`}
                  title={
                    audioState === 'PLAYING'
                      ? "Pause Audio Reader"
                      : audioState === 'PAUSED'
                      ? "Resume Audio Reader"
                      : "Listen to this chapter read aloud"
                  }
                  aria-label="Audio Reader Play Pause"
                >
                  {audioState === 'PLAYING' ? (
                    <>
                      <Pause size={14} />
                      <span>Pause</span>
                    </>
                  ) : audioState === 'PAUSED' ? (
                    <>
                      <Play size={14} />
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={14} />
                      <span>Listen Aloud</span>
                    </>
                  )}
                </button>

                {(audioState === 'PLAYING' || audioState === 'PAUSED') && (
                  <button
                    type="button"
                    onClick={handleAudioStop}
                    className="reader-audio-btn stop-btn"
                    title="Stop Audio Reader"
                    aria-label="Stop audio playback"
                  >
                    <Square size={12} fill="currentColor" />
                    <span>Stop</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Jump Bar for Long Chapters */}
          {jumpMilestones.length > 0 && (
            <div className="reader-jump-bar">
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--brand-crimson)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Jump to:
              </span>
              {jumpMilestones.map(vNum => (
                <button
                  key={vNum}
                  type="button"
                  className="reader-jump-pill"
                  onClick={() => {
                    const el = document.getElementById(`verse-${vNum}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                >
                  v.{vNum}
                </button>
              ))}
            </div>
          )}

          {/* Scripture Content Container */}
          <div className={`scripture-body ${readerFontFamily === 'serif' ? 'font-serif' : 'font-sans'}`} style={{ fontSize: `${readerFontSize}px` }}>
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
              <div className="scripture-container">
                {/* ─── Mode 1: Structured Verse-by-Verse ─── */}
                {readerLayout === 'verse' ? (
                  <div className="bible-verse-list">
                    {bibleText.verses.map((v) => {
                      const isHighlighted = highlightedVerses.has(v.verse);
                      const cleaned = cleanScriptureText(v.text);
                      return (
                        <div
                          key={v.verse}
                          id={`verse-${v.verse}`}
                          className={`bible-verse-card ${isHighlighted ? 'is-highlighted' : ''} ${activeAudioVerse === v.verse ? 'is-audio-active' : ''}`}
                          onClick={() => toggleHighlightVerse(v.verse)}
                        >
                          <div className="verse-gutter">
                            <span className="verse-pill-badge" title={`Verse ${v.verse}`}>
                              {v.verse}
                            </span>
                          </div>

                          <div className="verse-text-body">
                            <p className="verse-paragraph">
                              {cleaned}
                            </p>
                          </div>

                          <div className="verse-quick-actions" onClick={e => e.stopPropagation()}>
                            <button
                              type="button"
                              className="verse-tool-btn"
                              onClick={() => handleCopyVerse(v)}
                              title="Copy verse reference & text"
                            >
                              {copiedVerse === v.verse ? <Check size={13} style={{ color: '#16a34a' }} /> : <Copy size={13} />}
                            </button>

                            <button
                              type="button"
                              className="verse-tool-btn slap-accent-btn"
                              onClick={() => handleSetStrikingVerse(v)}
                              title="Set as Striking Verse in SLAP Devotional Journal"
                            >
                              <Sparkles size={12} />
                              <span>SLAP</span>
                            </button>

                            <button
                              type="button"
                              className={`verse-tool-btn ${isHighlighted ? 'highlight-active' : ''}`}
                              onClick={() => toggleHighlightVerse(v.verse)}
                              title={isHighlighted ? "Remove highlight" : "Highlight this verse"}
                            >
                              <Bookmark size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* ─── Mode 2: Flowing Structured Paragraphs ─── */
                  <div className="bible-paragraph-container">
                    {paragraphGroups.map((chunk, pIdx) => (
                      <div key={pIdx} className="bible-paragraph-block">
                        {chunk.map(v => {
                          const isHighlighted = highlightedVerses.has(v.verse);
                          const cleaned = cleanScriptureText(v.text);
                          return (
                            <span
                              key={v.verse}
                              id={`verse-${v.verse}`}
                              className={`inline-verse-wrapper ${isHighlighted ? 'is-highlighted' : ''} ${activeAudioVerse === v.verse ? 'is-audio-active' : ''}`}
                              onClick={() => toggleHighlightVerse(v.verse)}
                              title={`Verse ${v.verse} — Click to highlight. Double click to copy.`}
                              onDoubleClick={(e) => { e.stopPropagation(); handleCopyVerse(v); }}
                            >
                              <span className="inline-verse-num">{v.verse}</span>
                              <span style={{ marginRight: '6px' }}>{cleaned}</span>
                            </span>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Floating Action Feedback Toast */}
          {readerToast && (
            <div className="reader-floating-toast">
              <span>{readerToast}</span>
            </div>
          )}

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
                    {Object.entries(API_TRANSLATIONS).filter(([_, val]) => !val.alias).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label><strong style={{ color: 'var(--brand-crimson)' }}>S</strong> – Striking Verses</label>
                <textarea rows="3" placeholder="Which scripture stood out today?" value={strikingVerses} onChange={e => setStrikingVerses(e.target.value)} />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label><strong style={{ color: 'var(--brand-navy)' }}>L</strong> – Lessons Learnt</label>
                <textarea rows="3" placeholder="What core revelations did you extract?" value={lessonsLearnt} onChange={e => setLessonsLearnt(e.target.value)} />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label><strong style={{ color: '#2d7d46' }}>A</strong> – Action Plans</label>
                <textarea rows="3" placeholder="What specific actions will you take today?" value={actionPlans} onChange={e => setActionPlans(e.target.value)} />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label><strong style={{ color: '#7c3aed' }}>P</strong> – Prayers</label>
                <textarea rows="3" placeholder="Write a short sealing prayer..." value={prayers} onChange={e => setPrayers(e.target.value)} />
              </div>

              {error && (
                <div className="alert alert-error" style={{ margin: '4px 0', fontSize: '13px' }}>
                  <AlertCircle size={16} style={{ flexShrink: 0 }} /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontWeight: '800',
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: isSubmitting ? 0.75 : 1,
                  cursor: isSubmitting ? 'wait' : 'pointer'
                }}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin" style={{ display: 'inline-block' }}>✦</span>
                    Submitting SLAP Devotion...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Submit SLAP Devotion
                  </>
                )}
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
                {Object.entries(API_TRANSLATIONS).filter(([_, val]) => !val.alias).map(([key, val]) => (
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
                Found {searchResults.length}{searchResults.length >= 150 ? '+' : ''} results for "{searchQuery}" in {API_TRANSLATIONS[searchTranslation]?.label}
              </p>

              {/* Hebrew & Greek Word Definitions Panel */}
              {(defLoading || wordDefinitions) && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(16,31,85,0.06), rgba(178,13,48,0.04))',
                  border: '1px solid var(--border-color)',
                  borderRadius: '14px', padding: '20px', marginBottom: '20px',
                }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-gold)' }}>
                    📜 Word Study: "{searchQuery}"
                  </h4>
                  {defLoading ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Loading word definitions…</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {/* English Meaning */}
                      {wordDefinitions?.english && (
                        <div>
                          <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>🇬🇧 English Meaning</span>
                          <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {wordDefinitions.english.phonetic && (
                              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>{wordDefinitions.english.phonetic}</span>
                            )}
                            {wordDefinitions.english.meanings.map((m, mi) => (
                              <div key={mi} style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                                <span style={{ fontWeight: '700', color: 'var(--brand-navy)', fontSize: '11px', textTransform: 'capitalize' }}>{m.partOfSpeech}: </span>
                                {m.definition}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Hebrew Meanings */}
                      {wordDefinitions?.biblical?.hebrew && wordDefinitions.biblical.hebrew.length > 0 && (
                        <div>
                          <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>🕎 Hebrew (Old Testament)</span>
                          <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {wordDefinitions.biblical.hebrew.map((h, hi) => (
                              <div key={hi} style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: '8px', padding: '10px 14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                                  <span style={{ fontWeight: '800', fontSize: '13px', color: 'var(--accent-gold)', fontFamily: 'monospace' }}>{h.strongs}</span>
                                  <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)', fontFamily: 'serif', fontStyle: 'italic' }}>{h.transliteration}</span>
                                </div>
                                <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: 'var(--text-secondary)' }}>{h.meaning}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Greek Meanings */}
                      {wordDefinitions?.biblical?.greek && wordDefinitions.biblical.greek.length > 0 && (
                        <div>
                          <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>☩ Greek (New Testament)</span>
                          <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {wordDefinitions.biblical.greek.map((g, gi) => (
                              <div key={gi} style={{ background: 'rgba(16,31,85,0.08)', border: '1px solid rgba(16,31,85,0.15)', borderRadius: '8px', padding: '10px 14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                                  <span style={{ fontWeight: '800', fontSize: '13px', color: 'var(--brand-navy)', fontFamily: 'monospace' }}>{g.strongs}</span>
                                  <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)', fontFamily: 'serif', fontStyle: 'italic' }}>{g.transliteration}</span>
                                </div>
                                <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: 'var(--text-secondary)' }}>{g.meaning}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* No biblical data found */}
                      {!wordDefinitions?.biblical && wordDefinitions?.english && (
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>
                          Hebrew/Greek Strong's data not available for this word. Try searching a core biblical term like "love", "faith", "grace", "peace", or "spirit".
                        </p>
                      )}
                      {!wordDefinitions?.english && !wordDefinitions?.biblical && (
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>
                          No word study data found for "{searchQuery}". Try searching a common biblical term.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Scripture Results */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px', overflowY: 'auto' }}>
                {searchResults.map((result, idx) => {
                  const bookId = Number(result.bookid ?? result.book);
                  const bookName = getBookNameById(bookId);
                  return (
                    <div
                      key={idx}
                      className="search-result-card"
                      onClick={() => {
                        setReaderBook(bookName);
                        setReaderChapter(result.chapter);
                        setReaderTranslation(searchTranslation);
                        setActiveTab('read');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', flexWrap: 'wrap', gap: '4px' }}>
                        <strong style={{ color: 'var(--accent-gold)', fontSize: '14px' }}>
                          {bookName} {result.chapter}:{result.verse}
                        </strong>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Click to read chapter</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>
                        {cleanScriptureText(result.text)}
                      </p>
                    </div>
                  );
                })}
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
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
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
      font-family: 'Sora', Georgia, serif;
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
      font-family: 'Sora', Georgia, serif;
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

