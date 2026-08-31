import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  BookOpen, Flame, Calendar, Sparkles, CheckCircle2, Volume2, VolumeX,
  Share2, ArrowRight, RefreshCw, Bookmark, Award, Heart, Shield,
  MessageSquare, Feather, Layers, Send
} from 'lucide-react';
import { dbService } from '../services/db';
import { useAuth } from '../context/AuthContext';
import AnimateOnScroll from '../components/AnimateOnScroll';
import CelebrationModal from '../components/CelebrationModal';

const FEATURED_PASSAGES = [
  {
    book: 'John',
    chapter: 3,
    verses: '1-21',
    title: 'The New Birth & God’s Infinite Love',
    text: `1 There was a man of the Pharisees, named Nicodemus, a ruler of the Jews: 2 The same came to Jesus by night, and said unto him, Rabbi, we know that thou art a teacher come from God: for no man can do these miracles that thou doest, except God be with him.\n\n3 Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God.\n\n16 For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life. 17 For God sent not his Son into the world to condemn the world; but that the world through him might be saved.`,
    keyVerse: `John 3:16 — "For God so loved the world, that he gave his only begotten Son..."`
  },
  {
    book: 'Psalms',
    chapter: 23,
    verses: '1-6',
    title: 'The Lord is My Shepherd',
    text: `1 The Lord is my shepherd; I shall not want. 2 He maketh me to lie down in green pastures: he leadeth me beside the still waters. 3 He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.\n\n4 Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me. 5 Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over. 6 Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the Lord for ever.`,
    keyVerse: `Psalm 23:1 — "The Lord is my shepherd; I shall not want."`
  },
  {
    book: 'Romans',
    chapter: 8,
    verses: '28-39',
    title: 'More Than Conquerors Through Christ',
    text: `28 And we know that all things work together for good to them that love God, to them who are the called according to his purpose.\n\n31 What shall we then say to these things? If God be for us, who can be against us?\n\n37 Nay, in all these things we are more than conquerors through him that loved us. 38 For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come, 39 Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.`,
    keyVerse: `Romans 8:31 — "If God be for us, who can be against us?"`
  },
  {
    book: 'Philippians',
    chapter: 4,
    verses: '4-13',
    title: 'Rejoice & Walk in Divine Peace',
    text: `4 Rejoice in the Lord alway: and again I say, Rejoice. 5 Let your moderation be known unto all men. The Lord is at hand. 6 Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. 7 And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.\n\n13 I can do all things through Christ which strengtheneth me.`,
    keyVerse: `Philippians 4:13 — "I can do all things through Christ which strengtheneth me."`
  }
];

export default function DailyDevotion() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [selectedPassageIndex, setSelectedPassageIndex] = useState(0);
  const [translation, setTranslation] = useState('KJV');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [streakData, setStreakData] = useState({ current_streak: 1, longest_streak: 1 });
  const [userLogs, setUserLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State for SLAP Method
  const [strikingVerses, setStrikingVerses] = useState('');
  const [lessonsLearnt, setLessonsLearnt] = useState('');
  const [actionPlans, setActionPlans] = useState('');
  const [prayers, setPrayers] = useState('');
  const [celebrationData, setCelebrationData] = useState(null);

  const activePassage = FEATURED_PASSAGES[selectedPassageIndex];

  useEffect(() => {
    // Pre-populate striking verses from key verse
    if (activePassage) {
      setStrikingVerses(activePassage.keyVerse);
    }
    loadDevotionalData();
  }, [selectedPassageIndex, user]);

  const loadDevotionalData = async () => {
    if (!user) return;
    try {
      const reports = await dbService.getUserReports(user.id);
      const streak = await dbService.getUserStreak(user.id);
      setUserLogs(reports || []);
      if (streak) setStreakData(streak);
    } catch (err) {
      console.error("Error loading devotion data:", err);
    }
  };

  const handleSpeechToggle = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        const textToRead = `${activePassage.book} chapter ${activePassage.chapter}. ${activePassage.title}. ${activePassage.text}`;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    } else {
      alert("Text-to-speech audio reader is not supported in your browser.");
    }
  };

  const handleSubmitSLAPDevotion = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: '/daily-devotion' } });
      return;
    }

    if (!strikingVerses.trim() || !lessonsLearnt.trim() || !actionPlans.trim() || !prayers.trim()) {
      alert("Please fill in all four SLAP sections (Scripture, Lessons, Action Plan, Prayer) to complete your devotion.");
      return;
    }

    setLoading(true);
    try {
      const reportPayload = {
        book: activePassage.book,
        chapter: activePassage.chapter,
        verses: activePassage.verses,
        translation,
        strikingVerses,
        lessonsLearnt,
        actionPlans,
        prayers
      };

      const result = await dbService.submitReport(reportPayload);
      setLoading(false);

      if (result?.streak) {
        setStreakData(result.streak);
      }

      setCelebrationData({
        isOpen: true,
        type: 'devotion',
        title: `🎉 Daily Devotion Completed!`,
        subtitle: `Awesome job! You have successfully completed your SLAP daily devotion for ${activePassage.book} ${activePassage.chapter}!`,
        details: [
          { label: '📖 Reading Passage', value: `${activePassage.book} ${activePassage.chapter}:${activePassage.verses}` },
          { label: '🔥 Active Streak', value: `${result?.streak?.current || streakData.current_streak + 1} Days` },
          { label: '✦ SLAP Pattern', value: 'Scripture • Lesson • Action • Prayer' }
        ],
        targetPath: '/dashboard'
      });
    } catch (err) {
      alert(err.message || "Failed to submit devotion");
      setLoading(false);
    }
  };

  const todayDateString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="section-container" style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 24px 60px' }}>
      
      {/* Hero Header */}
      <AnimateOnScroll animation="fadeIn">
        <div style={{
          background: 'linear-gradient(135deg, rgba(26, 20, 9, 0.9), rgba(58, 45, 29, 0.8), rgba(184, 134, 11, 0.2))',
          borderRadius: '20px',
          border: '1px solid rgba(212, 160, 23, 0.35)',
          padding: '40px 32px',
          marginBottom: '32px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(212, 160, 23, 0.15)', color: 'var(--accent-gold)', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                <Calendar size={14} /> {todayDateString}
              </div>

              <h1 style={{ fontSize: '36px', margin: '0 0 10px', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                Daily Bible Devotion
              </h1>

              <p style={{ margin: 0, fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '640px', lineHeight: '1.6' }}>
                Anchor your soul in God's Word every day. Read today's scripture passage, listen aloud, and log your personal <strong>SLAP Reflection</strong> (Scripture, Lesson, Action Plan, Prayer).
              </p>
            </div>

            {/* Streak Counter Box */}
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(212, 160, 23, 0.4)',
              borderRadius: '16px',
              padding: '20px 28px',
              textAlign: 'center',
              minWidth: '160px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#f43f5e', marginBottom: '4px' }}>
                <Flame size={24} className="animate-pulse" />
                <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {streakData.current_streak || 1}
                </span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Day Devotion Streak
              </div>
            </div>
          </div>
        </div>
      </AnimateOnScroll>

      {/* Main Grid: Left Scripture Reader | Right SLAP Form */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
        
        {/* LEFT COLUMN: Scripture Reader & Passage Chooser */}
        <AnimateOnScroll animation="fadeInLeft">
          <div className="glass-card" style={{ padding: '28px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            
            {/* Passage Selector Tabs */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>
                Choose Devotional Reading
              </label>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
                {FEATURED_PASSAGES.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPassageIndex(idx)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: idx === selectedPassageIndex ? '1px solid var(--accent-gold)' : '1px solid var(--border-color)',
                      background: idx === selectedPassageIndex ? 'rgba(212, 160, 23, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                      color: idx === selectedPassageIndex ? 'var(--accent-gold)' : 'var(--text-primary)',
                      fontWeight: idx === selectedPassageIndex ? '700' : '500',
                      fontSize: '13px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {p.book} {p.chapter}
                  </button>
                ))}
              </div>
            </div>

            {/* Passage Title Bar & Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '22px', margin: 0, color: 'var(--text-primary)' }}>
                  {activePassage.book} {activePassage.chapter}:{activePassage.verses}
                </h2>
                <div style={{ fontSize: '13px', color: 'var(--accent-gold)', fontWeight: '600', marginTop: '2px' }}>
                  {activePassage.title}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Audio Speech Reader */}
                <button
                  onClick={handleSpeechToggle}
                  className="btn-secondary"
                  style={{
                    padding: '8px 12px',
                    fontSize: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: isPlayingAudio ? '#f43f5e' : 'var(--accent-gold)',
                    borderColor: isPlayingAudio ? '#f43f5e' : 'var(--accent-gold)'
                  }}
                  title={isPlayingAudio ? "Stop Audio Reader" : "Listen to Scripture"}
                >
                  {isPlayingAudio ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  <span>{isPlayingAudio ? "Stop Reading" : "Audio Reader"}</span>
                </button>

                {/* Translation Selector */}
                <select
                  value={translation}
                  onChange={e => setTranslation(e.target.value)}
                  style={{ width: '80px', padding: '6px 8px', fontSize: '12px' }}
                >
                  <option value="KJV">KJV</option>
                  <option value="NIV">NIV</option>
                  <option value="AMP">AMP</option>
                  <option value="NLT">NLT</option>
                </select>
              </div>
            </div>

            {/* Scripture Text Box */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.25)',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid var(--border-color)',
              flex: 1,
              overflowY: 'auto',
              maxHeight: '380px',
              marginBottom: '20px',
              fontSize: '15px',
              lineHeight: '1.8',
              color: 'rgba(255, 255, 255, 0.9)',
              whiteSpace: 'pre-line'
            }}>
              {activePassage.text}
            </div>

            {/* Key Verse Highlight Box */}
            <div style={{
              background: 'rgba(212, 160, 23, 0.12)',
              borderLeft: '4px solid var(--accent-gold)',
              padding: '14px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontStyle: 'italic',
              color: 'var(--text-primary)'
            }}>
              <strong>Key Verse:</strong> {activePassage.keyVerse}
            </div>
          </div>
        </AnimateOnScroll>

        {/* RIGHT COLUMN: Interactive SLAP Method Reflection Form */}
        <AnimateOnScroll animation="fadeInRight">
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Feather size={20} style={{ color: 'var(--accent-gold)' }} />
                <h2 style={{ fontSize: '22px', margin: 0 }}>Log SLAP Devotion</h2>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                Fill out the 4 steps of the SLAP pattern (Scripture, Lesson, Action, Prayer) to anchor today's reading into your spirit.
              </p>
            </div>

            <form onSubmit={handleSubmitSLAPDevotion} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* S: Scripture */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="text-label-sm" style={{ color: 'var(--accent-gold)', fontWeight: '700' }}>
                  S — Scripture (Striking Verses)
                </label>
                <textarea
                  rows="2"
                  required
                  placeholder="Which verse or statement stood out to you during today's reading?"
                  value={strikingVerses}
                  onChange={e => setStrikingVerses(e.target.value)}
                  style={{ fontSize: '14px' }}
                />
              </div>

              {/* L: Lessons Learnt */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="text-label-sm" style={{ color: '#10b981', fontWeight: '700' }}>
                  L — Lessons Learnt
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="What spiritual truths or lessons did the Holy Spirit reveal to you?"
                  value={lessonsLearnt}
                  onChange={e => setLessonsLearnt(e.target.value)}
                  style={{ fontSize: '14px' }}
                />
              </div>

              {/* A: Action Plan */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="text-label-sm" style={{ color: '#06b6d4', fontWeight: '700' }}>
                  A — Action Plan
                </label>
                <textarea
                  rows="2"
                  required
                  placeholder="What practical step will you take today to live out this scripture?"
                  value={actionPlans}
                  onChange={e => setActionPlans(e.target.value)}
                  style={{ fontSize: '14px' }}
                />
              </div>

              {/* P: Prayer */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="text-label-sm" style={{ color: '#8b5cf6', fontWeight: '700' }}>
                  P — Prayer
                </label>
                <textarea
                  rows="2"
                  required
                  placeholder="Write out a personal prayer of faith and commitment based on this Word..."
                  value={prayers}
                  onChange={e => setPrayers(e.target.value)}
                  style={{ fontSize: '14px' }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '15px',
                  fontWeight: '700',
                  marginTop: '8px',
                  background: 'var(--accent-gold)',
                  color: '#1a1409'
                }}
              >
                <Send size={16} /> {loading ? 'Saving Devotion...' : 'Complete & Log Daily SLAP'}
              </button>
            </form>
          </div>
        </AnimateOnScroll>
      </div>

      {/* Celebration Modal Trigger */}
      <CelebrationModal
        isOpen={!!celebrationData?.isOpen}
        onClose={() => {
          setCelebrationData(null);
          navigate('/dashboard');
        }}
        type={celebrationData?.type || 'devotion'}
        title={celebrationData?.title}
        subtitle={celebrationData?.subtitle}
        details={celebrationData?.details || []}
        primaryBtnText="Go to Dashboard"
        primaryBtnAction={() => {
          setCelebrationData(null);
          navigate('/dashboard');
        }}
      />
    </div>
  );
}
