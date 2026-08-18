import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Supabase Client for backend database sync if config is present
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
let supabase = null;

if (supabaseUrl && supabaseServiceKey && supabaseUrl !== 'YOUR_SUPABASE_URL') {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
  console.log('Backend connected to Supabase database.');
} else {
  console.log('Backend running in local memory/fallback mode (no Supabase credentials provided).');
}

// In-memory mock database for fallback when Supabase is not configured
const mockDB = {
  users: [],
  reports: [],
  declarations: [
    {
      id: 'decl-1',
      declaration_text: "The blessings of God are on my life and empower me to prosper...",
      scripture_reference: "Deuteronomy 28:8, Psalm 5:12",
      background_style: "rose-gradient",
      created_at: new Date().toISOString()
    }
  ],
  videos: [
    {
      id: 'vid-1',
      title: 'Developing Consistency in the Word',
      description: 'Learn practical steps to building a daily routine of reading and studying scripture.',
      category: 'Bible Study',
      video_url: 'https://www.youtube.com/embed/ysz5S6PUM-U',
      thumbnail_url: 'https://images.unsplash.com/photo-1504052434569-70ad58565b90?w=600&auto=format&fit=crop&q=60',
      created_at: new Date().toISOString()
    }
  ],
  streaks: {}
};

// --- AUTH ROUTING ---
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, fullName } = req.body;
  try {
    if (supabase) {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName }
      });
      if (error) return res.status(400).json({ error: error.message });
      
      // Create user profile row
      await supabase.from('profiles').upsert({ id: data.user.id, email, full_name: fullName });
      return res.status(201).json({ user: data.user });
    } else {
      if (mockDB.users.find(u => u.email === email)) {
        return res.status(400).json({ error: "User already exists" });
      }
      const user = { id: 'u-' + Math.random().toString(36).substr(2, 9), email, password, fullName, created_at: new Date().toISOString() };
      mockDB.users.push(user);
      return res.status(201).json({ user: { id: user.id, email, user_metadata: { full_name: fullName } } });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json({ user: data.user, token: data.session.access_token });
    } else {
      const user = mockDB.users.find(u => u.email === email && u.password === password);
      if (!user) return res.status(400).json({ error: "Invalid credentials" });
      return res.status(200).json({ user: { id: user.id, email: user.email, user_metadata: { full_name: user.fullName } }, token: 'mock-jwt-token' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- REPORTS ROUTING ---
app.get('/api/reports', async (req, res) => {
  const userId = req.headers['x-user-id'] || 'anonymous';
  try {
    if (supabase && userId !== 'anonymous') {
      const { data, error } = await supabase.from('slap_reports').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json(data);
    } else {
      const reports = mockDB.reports.filter(r => r.user_id === userId);
      return res.status(200).json(reports);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reports', async (req, res) => {
  const userId = req.headers['x-user-id'] || 'anonymous';
  const report = req.body;
  const todayStr = new Date().toISOString().split('T')[0];
  try {
    if (supabase && userId !== 'anonymous') {
      const { data, error } = await supabase.from('slap_reports').insert({
        user_id: userId,
        book: report.book,
        chapter: parseInt(report.chapter),
        verses: report.verses,
        translation: report.translation,
        striking_verses: report.strikingVerses,
        lessons_learnt: report.lessonsLearnt,
        action_plans: report.actionPlans,
        prayers: report.prayers,
        submission_date: todayStr
      }).select().single();
      if (error) return res.status(400).json({ error: error.message });

      // Streak calculation
      const { data: streak } = await supabase.from('user_streaks').select('*').eq('user_id', userId).single();
      let lastDate = streak?.last_activity_date;
      let currentStreak = streak?.current_streak || 0;
      let longestStreak = streak?.longest_streak || 0;

      let newCurrent = 1;
      let newLongest = longestStreak;

      if (lastDate) {
        const diffDays = Math.ceil(Math.abs(new Date(todayStr) - new Date(lastDate)) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) {
          newCurrent = currentStreak;
        } else if (diffDays === 1) {
          newCurrent = currentStreak + 1;
          newLongest = Math.max(newCurrent, longestStreak);
        }
      } else {
        newLongest = 1;
      }

      await supabase.from('user_streaks').upsert({
        user_id: userId,
        current_streak: newCurrent,
        longest_streak: newLongest,
        last_activity_date: todayStr
      });

      return res.status(201).json({ report: data, streak: { current_streak: newCurrent, longest_streak: newLongest } });
    } else {
      const newReport = { id: 'rep-' + Math.random().toString(36).substr(2, 9), user_id: userId, ...report, submission_date: todayStr, created_at: new Date().toISOString() };
      mockDB.reports.push(newReport);

      // In-memory streak tracking
      const userStreak = mockDB.streaks[userId] || { current_streak: 0, longest_streak: 0, last_activity_date: null };
      let lastDate = userStreak.last_activity_date;
      let currentStreak = userStreak.current_streak;
      let longestStreak = userStreak.longest_streak;

      let newCurrent = 1;
      let newLongest = longestStreak;

      if (lastDate) {
        const diffDays = Math.ceil(Math.abs(new Date(todayStr) - new Date(lastDate)) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) {
          newCurrent = currentStreak;
        } else if (diffDays === 1) {
          newCurrent = currentStreak + 1;
          newLongest = Math.max(newCurrent, longestStreak);
        }
      } else {
        newLongest = 1;
      }

      mockDB.streaks[userId] = { current_streak: newCurrent, longest_streak: newLongest, last_activity_date: todayStr };
      return res.status(201).json({ report: newReport, streak: mockDB.streaks[userId] });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reports/streak', async (req, res) => {
  const userId = req.headers['x-user-id'] || 'anonymous';
  try {
    if (supabase && userId !== 'anonymous') {
      const { data, error } = await supabase.from('user_streaks').select('*').eq('user_id', userId).single();
      if (error && error.code !== 'PGRST116') return res.status(400).json({ error: error.message });
      return res.status(200).json(data || { current_streak: 0, longest_streak: 0, last_activity_date: null });
    } else {
      return res.status(200).json(mockDB.streaks[userId] || { current_streak: 0, longest_streak: 0, last_activity_date: null });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- DECLARATIONS ROUTING ---
app.get('/api/declarations', async (req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase.from('declarations').select('*').order('created_at', { ascending: false });
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json(data);
    } else {
      return res.status(200).json(mockDB.declarations);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/declarations', async (req, res) => {
  const { text, ref, backgroundStyle, imageUrl } = req.body;
  const userId = req.headers['x-user-id'] || 'anonymous';
  try {
    if (supabase) {
      const { data, error } = await supabase.from('declarations').insert({
        user_id: userId,
        declaration_text: text,
        scripture_reference: ref,
        background_style: backgroundStyle,
        exported_image_url: imageUrl || ''
      }).select().single();
      if (error) return res.status(400).json({ error: error.message });
      return res.status(201).json(data);
    } else {
      const newDecl = {
        id: 'decl-' + Math.random().toString(36).substr(2, 9),
        user_id: userId,
        declaration_text: text,
        scripture_reference: ref,
        background_style: backgroundStyle,
        exported_image_url: imageUrl || '',
        created_at: new Date().toISOString()
      };
      mockDB.declarations.push(newDecl);
      return res.status(201).json(newDecl);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- VIDEOS ROUTING ---
app.get('/api/videos', async (req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json(data);
    } else {
      return res.status(200).json(mockDB.videos);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/videos', async (req, res) => {
  const video = req.body;
  const userId = req.headers['x-user-id'] || 'anonymous';
  try {
    if (supabase) {
      const { data, error } = await supabase.from('videos').insert({
        title: video.title,
        description: video.description,
        category: video.category,
        video_url: video.videoUrl,
        thumbnail_url: video.thumbnailUrl || 'https://images.unsplash.com/photo-1504052434569-70ad58565b90?w=600&auto=format&fit=crop&q=60',
        uploaded_by: userId
      }).select().single();
      if (error) return res.status(400).json({ error: error.message });
      return res.status(201).json(data);
    } else {
      const newVideo = {
        id: 'vid-' + Math.random().toString(36).substr(2, 9),
        title: video.title,
        description: video.description,
        category: video.category,
        video_url: video.videoUrl,
        thumbnail_url: video.thumbnailUrl || 'https://images.unsplash.com/photo-1504052434569-70ad58565b90?w=600&auto=format&fit=crop&q=60',
        uploaded_by: userId,
        created_at: new Date().toISOString()
      };
      mockDB.videos.push(newVideo);
      return res.status(201).json(newVideo);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// App healthcheck
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
