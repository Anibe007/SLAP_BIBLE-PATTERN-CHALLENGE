import React, { useState, useEffect } from 'react';
import { dbService } from '../services/db';
import { Flame, CheckCircle, Calendar, Plus, BookOpen, AlertCircle, Eye, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [streak, setStreak] = useState({ current_streak: 0, longest_streak: 0, last_activity_date: null });
  const [book, setBook] = useState('John');
  const [chapter, setChapter] = useState('3');
  const [verses, setVerses] = useState('16-21');
  const [translation, setTranslation] = useState('KJV');
  const [strikingVerses, setStrikingVerses] = useState('');
  const [lessonsLearnt, setLessonsLearnt] = useState('');
  const [actionPlans, setActionPlans] = useState('');
  const [prayers, setPrayers] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedReport, setExpandedReport] = useState(null);

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
        colors: ['#f43f5e', '#6366f1', '#fbbf24']
      });

      // Reset form fields
      setStrikingVerses('');
      setLessonsLearnt('');
      setActionPlans('');
      setPrayers('');

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
            backgroundColor: isCompleted ? 'var(--accent-rose)' : 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            opacity: isCompleted ? 1 : 0.4,
            cursor: 'help',
            boxShadow: isCompleted ? '0 0 8px var(--accent-rose)' : 'none'
          }}
        />
      );
    }
    return boxes;
  };

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
        background: 'linear-gradient(135deg, rgba(244,63,94,0.05), rgba(99,102,241,0.05))',
        borderRadius: '16px',
        border: '1px solid var(--border-color)'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px' }}>Your Daily Study Dashboard</h1>
          <p style={{ margin: '4px 0 0', fontSize: '14px' }}>Submit today's report and log your consistency.</p>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="glass-card" style={{ padding: '12px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Current Streak</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '24px', fontWeight: '800', color: 'var(--accent-rose)' }}>
              <Flame fill="var(--accent-rose)" size={20} />
              {streak.current_streak} Days
            </div>
          </div>

          <div className="glass-card" style={{ padding: '12px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Longest Streak</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '24px', fontWeight: '800', color: 'var(--accent-indigo)' }}>
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

      {/* Main Workspace grid */}
      <div className="grid-2" style={{ alignItems: 'flex-start' }}>
        
        {/* SLAP Form */}
        <section className="glass-card">
          <h2>Submit Daily SLAP</h2>
          
          {error && (
            <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', padding: '12px', borderRadius: '8px', color: 'var(--accent-rose)', display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px', fontSize: '13px' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {success && (
            <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '12px', borderRadius: '8px', color: '#10b981', display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px', fontSize: '13px' }}>
              <CheckCircle size={16} /> {success}
            </div>
          )}

          <form onSubmit={handleSLAPSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '12px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Bible Book</label>
                <select value={book} onChange={e => setBook(e.target.value)}>
                  <optgroup label="Old Testament">
                    {['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </optgroup>
                  <optgroup label="New Testament">
                    {['Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Chapter</label>
                <input type="number" min="1" max="150" required value={chapter} onChange={e => setChapter(e.target.value)} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Verses</label>
                <input type="text" placeholder="e.g. 16-21" required value={verses} onChange={e => setVerses(e.target.value)} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Translation</label>
                <select value={translation} onChange={e => setTranslation(e.target.value)}>
                  <option value="KJV">KJV (King James Version)</option>
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
                      <BookOpen size={16} /> {r.book} {r.chapter}:{r.verses} ({r.translation})
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
                        <strong style={{ color: 'var(--accent-rose)' }}>Striking Verses:</strong>
                        <p style={{ margin: '4px 0 0', fontSize: '13px' }}>{r.striking_verses || r.strikingVerses}</p>
                      </div>
                      <div>
                        <strong style={{ color: 'var(--accent-indigo)' }}>Lessons Learnt:</strong>
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
    </div>
  );
}
