import React, { useState } from 'react';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import AnimateOnScroll from '../components/AnimateOnScroll';

const ARTICLES = [
  {
    id: 1,
    title: 'The Discipline of Devotion',
    excerpt: 'How creating a structural routine anchors your day and clarifies spiritual insights.',
    date: 'July 8, 2026',
    author: 'Pastor John Mark',
    image: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800&auto=format&fit=crop&q=70',
    content: `A consistent devotional routine is not legalism — it is wisdom. The Word of God compares a person who reads and forgets to someone who looks in a mirror and walks away, forgetting what they look like (James 1:23-24). Structure combats this forgetfulness.

When you create a fixed time and space for your devotions — whether it's 5:30 AM with coffee or 10 PM before bed — your mind and spirit begin to expect and prepare for that encounter with God. Over time, missing it creates a spiritual restlessness.

The SLAP method provides the scaffolding. By forcing yourself to identify a Striking Verse, you engage your attention. By recording a Lesson, you deepen comprehension. By writing an Action Plan, you bridge the gap between hearing and doing. By praying, you seal the word in your heart.

This is not about performance. It is about posture — showing up to the Word consistently and expectantly.`
  },
  {
    id: 2,
    title: 'Speaking Faith in Times of Trial',
    excerpt: 'Understanding the biblical mandate behind daily confessions and proclamations.',
    date: 'July 5, 2026',
    author: 'Sarah Jenkins',
    image: 'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=800&auto=format&fit=crop&q=70',
    content: `"Death and life are in the power of the tongue" — Proverbs 18:21. This is not poetry. It is a principle of the kingdom.

When circumstances are hard — when sickness, financial pressure, or broken relationships feel overwhelming — the natural human response is to speak what we see. But faith is called to speak what God says about the situation.

This is the heartbeat of the iDECLARE feature. It is not positive thinking — it is a scriptural discipline of aligning your words with God's promises. Romans 4:17 tells us God "calls those things which do not exist as though they do."

Daily declarations done consistently rewire your internal narrative. You begin to see yourself as God sees you — healed, provided for, guided, loved, and called. The trial does not disappear immediately, but your posture shifts from victim to victor.

Begin today. Choose one scripture. Speak it out loud. Do it again tomorrow.`
  },
  {
    id: 3,
    title: 'Action Plans: From Study to Execution',
    excerpt: 'Moving past reading to practical execution. Being doers of the word, not hearers only.',
    date: 'June 29, 2026',
    author: 'David Vance',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=70',
    content: `James 1:22 is unambiguous: "Be doers of the word, and not hearers only, deceiving yourselves." This is one of the most uncomfortable verses in the Bible, because most of us enjoy the hearing far more than the doing.

The Action Plan portion of the SLAP report forces you to answer: "What will I actually do differently today as a result of what I read?"

This is not about grand gestures. It could be as simple as: "I will call my mother today because the passage spoke about honor." Or: "I will apologize to my colleague because the Word said not to let the sun go down on your anger."

Small, specific, time-bound actions, taken daily, compound into transformation. This is discipleship — not theory, but practice. Not just knowing, but becoming.

The SLAP method closes the loop. It does not let you walk away from the mirror and forget what you look like.`
  }
];

export default function Blog() {
  const [activeArticle, setActiveArticle] = useState(null);

  if (activeArticle) {
    return (
      <div className="page-wrapper">
        <button
          className="btn-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start' }}
          onClick={() => { setActiveArticle(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          <ArrowLeft size={16} /> Back to Newsroom
        </button>

        <article className="article-full">
          <div
            className="article-full-image"
            style={{ backgroundImage: `url(${activeArticle.image})` }}
          />

          <div className="article-meta" style={{ marginBottom: '16px' }}>
            <span><Calendar size={14} /> {activeArticle.date}</span>
            <span><User size={14} /> {activeArticle.author}</span>
          </div>

          <h1 style={{ fontSize: '32px', marginBottom: '24px', lineHeight: 1.3 }}>{activeArticle.title}</h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {activeArticle.content.split('\n\n').map((paragraph, i) => (
              <p key={i} style={{ fontSize: '17px', lineHeight: 1.8, margin: 0, color: 'var(--text-secondary)' }}>
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="page-wrapper-lg">
      <AnimateOnScroll animation="fadeUp">
        <section className="page-header">
          <span className="text-label">SPIRITUAL FORMATION &amp; ARTICLES</span>
          <h1>Newsroom &amp; Devotional Blog</h1>
          <p>
            Explore articles on spiritual disciplines, Bible study tips, and challenge updates from our community.
          </p>
        </section>
      </AnimateOnScroll>

      <div className="grid-auto-sm">
        {ARTICLES.map((a, i) => (
          <AnimateOnScroll key={a.id} animation="fadeUp" delay={i * 120}>
            <div
              className="glass-card"
              style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px', cursor: 'pointer', height: '100%' }}
              onClick={() => { setActiveArticle(a); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <div
                className="article-image"
                style={{ height: '180px', backgroundImage: `url(${a.image})` }}
              />
              <div className="article-meta">
                <span><Calendar size={12} /> {a.date}</span>
                <span><User size={12} /> {a.author}</span>
              </div>
              <h3 style={{ margin: 0, fontSize: '20px' }}>{a.title}</h3>
              <p style={{ margin: 0, fontSize: '14px', flexGrow: 1 }}>{a.excerpt}</p>
              <button
                className="btn-secondary"
                style={{ width: '100%', marginTop: '8px' }}
                onClick={(e) => { e.stopPropagation(); setActiveArticle(a); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                Read Article →
              </button>
            </div>
          </AnimateOnScroll>
        ))}
      </div>
    </div>
  );
}
