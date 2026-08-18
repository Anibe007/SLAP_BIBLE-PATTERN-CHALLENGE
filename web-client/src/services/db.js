import { supabase, isSupabaseConfigured } from '../supabaseClient';

// --- SEED DATA FOR DEMO MODE ---
const DEFAULT_DECLARATIONS = [
  {
    id: 'decl-1',
    text: "The blessings of God are on my life and empower me to prosper. The favor of God produces divine opportunities to make it happen. Because the Holy Spirit that is in me guides my steps, I am always at the right place at the right time.",
    ref: "Deuteronomy 28:8, Psalm 5:12"
  },
  {
    id: 'decl-2',
    text: "The steps of my life are ordered by the Lord. I am always at the right place at the right time.",
    ref: "Psalm 37:23, Romans 8:14"
  },
  {
    id: 'decl-3',
    text: "I walk in faith, hope, and love. I am guided by light and understanding.",
    ref: "1 Corinthians 13:13, Psalm 119:105"
  },
  {
    id: 'decl-4',
    text: "I am strong in the Lord and in the power of His might. No weapon formed against me shall prosper, and every tongue that rises against me in judgment is condemned.",
    ref: "Ephesians 6:10, Isaiah 54:17"
  }
];

const DEFAULT_VIDEOS = [
  {
    id: 'vid-1',
    title: 'Developing Consistency in the Word',
    description: 'Learn practical steps to building a daily routine of reading, studying, and applying scripture to your life.',
    category: 'Bible Study',
    video_url: 'https://www.youtube.com/embed/ysz5S6PUM-U',
    thumbnail_url: 'https://images.unsplash.com/photo-1504052434569-70ad58565b90?w=600&auto=format&fit=crop&q=60',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'vid-2',
    title: 'The Power of Daily Devotion',
    description: 'A powerful teaching on how starting your day in prayer and meditation anchors your spirit and guides your decisions.',
    category: 'Inspirational',
    video_url: 'https://www.youtube.com/embed/jNQXAC9IVRw',
    thumbnail_url: 'https://images.unsplash.com/photo-1447069387593-a5de0862481e?w=600&auto=format&fit=crop&q=60',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'vid-3',
    title: 'How to Pray Effectively',
    description: 'Understanding the biblical patterns of prayer that build intimacy with God and produce results in your everyday life.',
    category: 'Prayer',
    video_url: 'https://www.youtube.com/embed/P_PqC208g28',
    thumbnail_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=60',
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

// Helper to calculate streaks
function calculateUpdatedStreak(lastActivityDateStr, currentStreak, longestStreak) {
  const todayStr = new Date().toISOString().split('T')[0];
  if (!lastActivityDateStr) {
    return { current: 1, longest: 1, date: todayStr };
  }

  const lastDate = new Date(lastActivityDateStr);
  const today = new Date(todayStr);
  
  // Calculate difference in days
  const diffTime = Math.abs(today - lastDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Already did it today, streak doesn't change
    return { current: currentStreak, longest: longestStreak, date: todayStr };
  } else if (diffDays === 1) {
    // Consecutive day
    const newCurrent = currentStreak + 1;
    const newLongest = Math.max(newCurrent, longestStreak);
    return { current: newCurrent, longest: newLongest, date: todayStr };
  } else {
    // Streak broken (diffDays > 1)
    return { current: 1, longest: longestStreak, date: todayStr };
  }
}

// Initialize LocalStorage DB if empty
if (!localStorage.getItem('slap_users')) {
  localStorage.setItem('slap_users', JSON.stringify([]));
}
if (!localStorage.getItem('slap_reports')) {
  localStorage.setItem('slap_reports', JSON.stringify([]));
}
if (!localStorage.getItem('slap_declarations')) {
  localStorage.setItem('slap_declarations', JSON.stringify([]));
}
if (!localStorage.getItem('slap_videos')) {
  localStorage.setItem('slap_videos', JSON.stringify(DEFAULT_VIDEOS));
}
if (!localStorage.getItem('slap_streaks')) {
  localStorage.setItem('slap_streaks', JSON.stringify({}));
}

// Core Database Service
export const dbService = {
  // --- AUTH SERVICE ---
  async signUp(email, password, fullName) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      });
      if (error) throw error;
      
      // Sync with user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ id: data.user.id, email, full_name: fullName });
      if (profileError) console.error("Error creating profile:", profileError);

      return data.user;
    } else {
      // LocalStorage Auth Mock
      const users = JSON.parse(localStorage.getItem('slap_users'));
      if (users.find(u => u.email === email)) {
        throw new Error("User already exists with this email address");
      }
      const newUser = {
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        email,
        password, // stored plain for demo mock purposes
        user_metadata: { full_name: fullName },
        created_at: new Date().toISOString()
      };
      users.push(newUser);
      localStorage.setItem('slap_users', JSON.stringify(users));
      localStorage.setItem('slap_current_user', JSON.stringify(newUser));
      return newUser;
    }
  },

  async signIn(email, password) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data.user;
    } else {
      const users = JSON.parse(localStorage.getItem('slap_users'));
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        throw new Error("Invalid email or password");
      }
      localStorage.setItem('slap_current_user', JSON.stringify(user));
      return user;
    }
  },

  async signOut() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('slap_current_user');
    }
    return true;
  },

  async getCurrentUser() {
    if (isSupabaseConfigured) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch full profile info
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (profile) {
          user.user_metadata = { ...user.user_metadata, ...profile };
        }
      }
      return user;
    } else {
      const user = localStorage.getItem('slap_current_user');
      return user ? JSON.parse(user) : null;
    }
  },

  async updateUserProfile(fullName, avatarUrl) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error("Not authenticated");

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, full_name: fullName, avatar_url: avatarUrl });
      if (error) throw error;
      return { ...user, user_metadata: { ...user.user_metadata, full_name: fullName, avatar_url: avatarUrl } };
    } else {
      const users = JSON.parse(localStorage.getItem('slap_users'));
      const index = users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        users[index].user_metadata.full_name = fullName;
        users[index].avatar_url = avatarUrl;
        localStorage.setItem('slap_users', JSON.stringify(users));
        localStorage.setItem('slap_current_user', JSON.stringify(users[index]));
        return users[index];
      }
      throw new Error("User profile not found");
    }
  },

  // --- SLAP REPORTS SERVICE ---
  async submitReport(report) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error("Authentication required to submit report");

    const todayStr = new Date().toISOString().split('T')[0];

    if (isSupabaseConfigured) {
      // 1. Submit report
      const { data, error } = await supabase
        .from('slap_reports')
        .insert({
          user_id: user.id,
          book: report.book,
          chapter: parseInt(report.chapter),
          verses: report.verses,
          translation: report.translation,
          striking_verses: report.strikingVerses,
          lessons_learnt: report.lessonsLearnt,
          action_plans: report.actionPlans,
          prayers: report.prayers,
          submission_date: todayStr
        })
        .select()
        .single();
      if (error) throw error;

      // 2. Update Streak
      const { data: streak } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const newStreakData = calculateUpdatedStreak(
        streak?.last_activity_date,
        streak?.current_streak || 0,
        streak?.longest_streak || 0
      );

      await supabase
        .from('user_streaks')
        .upsert({
          user_id: user.id,
          current_streak: newStreakData.current,
          longest_streak: newStreakData.longest,
          last_activity_date: newStreakData.date
        });

      return { report: data, streak: newStreakData };
    } else {
      const reports = JSON.parse(localStorage.getItem('slap_reports'));
      const newReport = {
        id: 'rep-' + Math.random().toString(36).substr(2, 9),
        user_id: user.id,
        ...report,
        submission_date: todayStr,
        created_at: new Date().toISOString()
      };
      reports.push(newReport);
      localStorage.setItem('slap_reports', JSON.stringify(reports));

      // Update Streak
      const streaks = JSON.parse(localStorage.getItem('slap_streaks'));
      const userStreak = streaks[user.id] || { current_streak: 0, longest_streak: 0, last_activity_date: null };

      const newStreakData = calculateUpdatedStreak(
        userStreak.last_activity_date,
        userStreak.current_streak,
        userStreak.longest_streak
      );

      streaks[user.id] = {
        current_streak: newStreakData.current,
        longest_streak: newStreakData.longest,
        last_activity_date: newStreakData.date
      };
      localStorage.setItem('slap_streaks', JSON.stringify(streaks));

      return { report: newReport, streak: streaks[user.id] };
    }
  },

  async getReports() {
    const user = await this.getCurrentUser();
    if (!user) return [];

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('slap_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } else {
      const reports = JSON.parse(localStorage.getItem('slap_reports'));
      return reports.filter(r => r.user_id === user.id).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    }
  },

  async getStreak() {
    const user = await this.getCurrentUser();
    if (!user) return { current_streak: 0, longest_streak: 0, last_activity_date: null };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is code for no rows returned
      return data || { current_streak: 0, longest_streak: 0, last_activity_date: null };
    } else {
      const streaks = JSON.parse(localStorage.getItem('slap_streaks'));
      return streaks[user.id] || { current_streak: 0, longest_streak: 0, last_activity_date: null };
    }
  },

  // --- DECLARATIONS SERVICE ---
  async getPreseededDeclarations() {
    return DEFAULT_DECLARATIONS;
  },

  async saveDeclaration(decl) {
    const user = await this.getCurrentUser();
    const userId = user ? user.id : 'anonymous';

    if (isSupabaseConfigured && user) {
      const { data, error } = await supabase
        .from('declarations')
        .insert({
          user_id: userId,
          declaration_text: decl.text,
          scripture_reference: decl.ref,
          background_style: decl.backgroundStyle,
          exported_image_url: decl.imageUrl || ''
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const declarations = JSON.parse(localStorage.getItem('slap_declarations'));
      const newDecl = {
        id: 'decl-user-' + Math.random().toString(36).substr(2, 9),
        user_id: userId,
        declaration_text: decl.text,
        scripture_reference: decl.ref,
        background_style: decl.backgroundStyle,
        exported_image_url: decl.imageUrl || '',
        created_at: new Date().toISOString()
      };
      declarations.push(newDecl);
      localStorage.setItem('slap_declarations', JSON.stringify(declarations));
      return newDecl;
    }
  },

  async getDeclarations() {
    const user = await this.getCurrentUser();
    if (!user) return [];

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('declarations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } else {
      const declarations = JSON.parse(localStorage.getItem('slap_declarations'));
      return declarations.filter(d => d.user_id === user.id).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    }
  },

  // --- VIDEO LIBRARY SERVICE ---
  async getVideos() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } else {
      const videos = JSON.parse(localStorage.getItem('slap_videos'));
      return videos.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    }
  },

  async uploadVideo(video) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error("Authentication required to add video");

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('videos')
        .insert({
          title: video.title,
          description: video.description,
          category: video.category,
          video_url: video.videoUrl,
          thumbnail_url: video.thumbnailUrl || 'https://images.unsplash.com/photo-1504052434569-70ad58565b90?w=600&auto=format&fit=crop&q=60',
          uploaded_by: user.id
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const videos = JSON.parse(localStorage.getItem('slap_videos'));
      const newVideo = {
        id: 'vid-' + Math.random().toString(36).substr(2, 9),
        title: video.title,
        description: video.description,
        category: video.category,
        video_url: video.videoUrl,
        thumbnail_url: video.thumbnailUrl || 'https://images.unsplash.com/photo-1504052434569-70ad58565b90?w=600&auto=format&fit=crop&q=60',
        uploaded_by: user.id,
        created_at: new Date().toISOString()
      };
      videos.push(newVideo);
      localStorage.setItem('slap_videos', JSON.stringify(videos));
      return newVideo;
    }
  }
};
