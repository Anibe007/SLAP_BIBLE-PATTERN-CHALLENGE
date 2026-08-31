import { supabase, isSupabaseConfigured, STORAGE_BUCKETS } from '../supabaseClient';

// --- CATEGORIZED SEED DECLARATIONS ---
export const DECLARATION_CATEGORIES = [
  { id: 'faith', name: 'Faith', icon: '✦', color: '#b8860b' },
  { id: 'hope', name: 'Hope', icon: '☼', color: '#d97706' },
  { id: 'health', name: 'Health', icon: '♥', color: '#e11d48' },
  { id: 'finance', name: 'Finance', icon: '♦', color: '#10b981' },
  { id: 'healing', name: 'Healing', icon: '✚', color: '#06b6d4' },
  { id: 'miracles', name: 'Miracles', icon: '★', color: '#8b5cf6' }
];

const DEFAULT_DECLARATIONS = [
  // FAITH
  {
    id: 'decl-f-0',
    category: 'faith',
    text: "The blessings of God are on my life and empower me to prosper. The favor of God produces divine opportunities to make it happen. Because the Holy Spirit that is in me guides my steps, I am always at the right place at the right time.",
    ref: "Deuteronomy 28:8, Psalm 5:12"
  },
  {
    id: 'decl-f-1',
    category: 'faith',
    text: "I walk by faith and not by sight. The Word of God is a lamp to my feet and a light to my path. My heart is steadfast, trusting completely in the Lord.",
    ref: "2 Corinthians 5:7, Psalm 119:105"
  },
  {
    id: 'decl-f-2',
    category: 'faith',
    text: "My faith is the victory that overcomes the world. No mountain is too great, and no obstacle can stand before the power of God operating in me.",
    ref: "1 John 5:4, Mark 11:23"
  },
  {
    id: 'decl-f-3',
    category: 'faith',
    text: "I am rooted, built up, and established in faith. God is able to do exceedingly, abundantly above all that I ask or think according to His power in me.",
    ref: "Colossians 2:7, Ephesians 3:20"
  },

  // HOPE
  {
    id: 'decl-h-1',
    category: 'hope',
    text: "The Lord is my hope and my shield. I will not be shaken, for His promises are yes and amen in Christ Jesus.",
    ref: "Psalm 33:20, 2 Corinthians 1:20"
  },
  {
    id: 'decl-h-2',
    category: 'hope',
    text: "Those who wait on the Lord shall renew their strength. They shall mount up with wings like eagles; they shall run and not be weary, they shall walk and not faint.",
    ref: "Isaiah 40:31"
  },
  {
    id: 'decl-h-3',
    category: 'hope',
    text: "The God of hope fills me with all joy and peace as I trust in Him, so that I overflow with hope by the power of the Holy Spirit.",
    ref: "Romans 15:13"
  },

  // HEALTH
  {
    id: 'decl-hl-1',
    category: 'health',
    text: "My body is the temple of the Holy Spirit. Divine life, strength, and energy vitalize every cell, organ, and tissue in my body today.",
    ref: "1 Corinthians 6:19, Romans 8:11"
  },
  {
    id: 'decl-hl-2',
    category: 'health',
    text: "The Lord strengthens me on my bed of illness and sustains me in full health. With long life He satisfies me and shows me His salvation.",
    ref: "Psalm 41:3, Psalm 91:16"
  },
  {
    id: 'decl-hl-3',
    category: 'health',
    text: "I prosper in all things and remain in vibrant health, just as my soul prospers in the truth of God's Word.",
    ref: "3 John 1:2"
  },

  // FINANCE
  {
    id: 'decl-fin-1',
    category: 'finance',
    text: "The blessings of God are on my life and empower me to prosper. My God supplies all my needs according to His riches in glory by Christ Jesus.",
    ref: "Deuteronomy 28:8, Philippians 4:19"
  },
  {
    id: 'decl-fin-2',
    category: 'finance',
    text: "God gives me the power to get wealth to establish His covenant. I am a cheerful giver, and all grace abounds toward me with all sufficiency in all things.",
    ref: "Deuteronomy 8:18, 2 Corinthians 9:8"
  },
  {
    id: 'decl-fin-3',
    category: 'finance',
    text: "The Lord opens the heavens to bless the work of my hands. I lend and do not borrow, and I walk in divine wisdom for financial multiplication.",
    ref: "Deuteronomy 28:12, Proverbs 3:9-10"
  },

  // HEALING
  {
    id: 'decl-hea-1',
    category: 'healing',
    text: "By His stripes I was healed and made whole. He sent His word and healed me, delivering me from all destructions.",
    ref: "1 Peter 2:24, Psalm 107:20"
  },
  {
    id: 'decl-hea-2',
    category: 'healing',
    text: "The Lord forgives all my iniquities and heals all my diseases. He redeems my life from the pit and crowns me with love and compassion.",
    ref: "Psalm 103:2-4"
  },
  {
    id: 'decl-hea-3',
    category: 'healing',
    text: "No weapon of infirmity formed against me shall prosper. The law of the Spirit of life in Christ Jesus has set me free from the law of sin and death.",
    ref: "Isaiah 54:17, Romans 8:2"
  },

  // MIRACLES
  {
    id: 'decl-mir-1',
    category: 'miracles',
    text: "I am a living testimony of God's supernatural power. With God, nothing is impossible, and miracles follow me everywhere I go.",
    ref: "Luke 1:37, Mark 16:17"
  },
  {
    id: 'decl-mir-2',
    category: 'miracles',
    text: "The same Spirit that raised Jesus from the dead dwells in me. I walk in supernatural favor, breakthroughs, and divine acceleration.",
    ref: "Romans 8:11, Amos 9:13"
  },
  {
    id: 'decl-mir-3',
    category: 'miracles',
    text: "Behold, I and the children whom the Lord has given me are for signs and for wonders in Israel from the Lord of hosts.",
    ref: "Isaiah 8:18"
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
  
  const diffTime = Math.abs(today - lastDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { current: currentStreak, longest: longestStreak, date: todayStr };
  } else if (diffDays === 1) {
    const newCurrent = currentStreak + 1;
    const newLongest = Math.max(newCurrent, longestStreak);
    return { current: newCurrent, longest: newLongest, date: todayStr };
  } else {
    return { current: 1, longest: longestStreak, date: todayStr };
  }
}

// Data URI to Blob conversion helper
function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

// LocalStorage Fallback Seed
const INITIAL_DEMO_USERS = [
  {
    id: 'user-admin-1',
    email: 'admin@slapbible.org',
    password: 'password123',
    fullName: 'David Anibe Daniel',
    user_metadata: { full_name: 'David Anibe Daniel', country: 'Nigeria', role: 'admin', is_admin: true, title: 'Lead Admin' },
    country: 'Nigeria',
    role: 'admin',
    is_admin: true,
    created_at: new Date(Date.now() - 86400000 * 30).toISOString()
  }
];

const SLAP_DB_VERSION = 'slap_db_v4';
if (typeof window !== 'undefined' && window.localStorage) {
  // Preserve existing users and reports across code updates
  localStorage.setItem('slap_db_version', SLAP_DB_VERSION);

  if (!localStorage.getItem('slap_users') || JSON.parse(localStorage.getItem('slap_users') || '[]').length === 0) {
    localStorage.setItem('slap_users', JSON.stringify(INITIAL_DEMO_USERS));
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
  if (!localStorage.getItem('slap_streaks') || Object.keys(JSON.parse(localStorage.getItem('slap_streaks') || '{}')).length === 0) {
    localStorage.setItem('slap_streaks', JSON.stringify({
      'user-admin-1': { current_streak: 21, longest_streak: 21, last_activity_date: new Date().toISOString().split('T')[0] }
    }));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CORE DATABASE & STORAGE SERVICE (Direct-to-Supabase)
// ─────────────────────────────────────────────────────────────────────────────
export const dbService = {

  // --- SUPABASE STORAGE SERVICE (Unlimited User Media Storage) ---

  /**
   * Upload user profile avatar to Supabase Storage bucket 'avatars'
   */
  async uploadAvatar(file, userId) {
    if (!file) throw new Error("No file provided for upload");
    const uid = userId || (await this.getCurrentUser())?.id;
    if (!uid) throw new Error("Authentication required to upload avatar");

    const fileExt = file.name ? file.name.split('.').pop() : 'png';
    const filePath = `${uid}/${Date.now()}.${fileExt}`;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKETS.AVATARS)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKETS.AVATARS)
        .getPublicUrl(data.path);

      // Update user profile with new avatar URL
      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', uid);

      return publicUrl;
    } else {
      // Local fallback: convert to base64 DataURL
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result;
          const users = JSON.parse(localStorage.getItem('slap_users') || '[]');
          const idx = users.findIndex(u => u.id === uid);
          if (idx !== -1) {
            users[idx].avatar_url = dataUrl;
            users[idx].user_metadata = { ...(users[idx].user_metadata || {}), avatar_url: dataUrl };
            localStorage.setItem('slap_users', JSON.stringify(users));
            localStorage.setItem('slap_current_user', JSON.stringify(users[idx]));
          }
          resolve(dataUrl);
        };
        reader.readAsDataURL(file);
      });
    }
  },

  /**
   * Upload rendered declaration card (Blob / DataURI) to Supabase Storage bucket 'declarations'
   */
  async uploadDeclarationImage(imageBlobOrDataUri, userId) {
    const uid = userId || (await this.getCurrentUser())?.id || 'anonymous';
    const filename = `${uid}/decl_${Date.now()}.png`;

    let blob = imageBlobOrDataUri;
    if (typeof imageBlobOrDataUri === 'string' && imageBlobOrDataUri.startsWith('data:')) {
      blob = dataURItoBlob(imageBlobOrDataUri);
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKETS.DECLARATIONS)
        .upload(filename, blob, {
          contentType: 'image/png',
          cacheControl: '86400',
          upsert: true
        });

      if (error) {
        console.warn("Could not upload card to Supabase Storage, using fallback:", error.message);
        return typeof imageBlobOrDataUri === 'string' ? imageBlobOrDataUri : '';
      }

      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKETS.DECLARATIONS)
        .getPublicUrl(data.path);

      return publicUrl;
    } else {
      return typeof imageBlobOrDataUri === 'string' ? imageBlobOrDataUri : '';
    }
  },

  /**
   * General file upload helper to Supabase Storage
   */
  async uploadFile(file, bucket = STORAGE_BUCKETS.MEDIA, customPath = '') {
    if (!file) throw new Error("No file provided");
    const user = await this.getCurrentUser();
    const uid = user?.id || 'public';
    const fileExt = file.name ? file.name.split('.').pop() : 'bin';
    const filePath = customPath || `${uid}/${Date.now()}_${Math.random().toString(36).substr(2, 6)}.${fileExt}`;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return publicUrl;
    } else {
      return URL.createObjectURL(file);
    }
  },

  // --- AUTH SERVICE (Supabase Auth) ---

  async signUp(email, password, fullName, country = '') {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            country: country,
            is_admin: false,
            role: 'user'
          }
        }
      });
      if (error) throw error;

      if (data.user) {
        await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email,
            full_name: fullName,
            country: country,
            is_admin: false,
            role: 'user',
            updated_at: new Date().toISOString()
          });

        await supabase
          .from('user_streaks')
          .upsert({
            user_id: data.user.id,
            current_streak: 0,
            longest_streak: 0,
            last_activity_date: null
          });
      }

      if (typeof window !== 'undefined') window.dispatchEvent(new Event('slap_stats_updated'));
      return data.user;
    } else {
      const users = JSON.parse(localStorage.getItem('slap_users') || '[]');
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("User with this email already exists");
      }

      const newUser = {
        id: 'u-' + Math.random().toString(36).substr(2, 9),
        email,
        password,
        fullName,
        country,
        is_admin: false,
        role: 'user',
        user_metadata: { full_name: fullName, country, is_admin: false, role: 'user' },
        created_at: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('slap_users', JSON.stringify(users));
      localStorage.setItem('slap_current_user', JSON.stringify(newUser));

      const streaks = JSON.parse(localStorage.getItem('slap_streaks') || '{}');
      streaks[newUser.id] = { current_streak: 0, longest_streak: 0, last_activity_date: null };
      localStorage.setItem('slap_streaks', JSON.stringify(streaks));

      if (typeof window !== 'undefined') window.dispatchEvent(new Event('slap_stats_updated'));
      return newUser;
    }
  },

  async signUpAdmin(email, password, fullName, country = '', adminPasskey = '') {
    const VALID_ADMIN_KEYS = ['SLAP_ADMIN_2026', 'admin123', 'admin'];
    if (!VALID_ADMIN_KEYS.includes(adminPasskey.trim())) {
      throw new Error("Invalid admin authorization passkey. Please check with the lead administrator.");
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            country: country,
            is_admin: true,
            role: 'admin'
          }
        }
      });
      if (error) throw error;

      if (data.user) {
        await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email,
            full_name: fullName,
            country: country,
            is_admin: true,
            role: 'admin',
            updated_at: new Date().toISOString()
          });

        await supabase
          .from('user_streaks')
          .upsert({
            user_id: data.user.id,
            current_streak: 0,
            longest_streak: 0,
            last_activity_date: null
          });
      }

      if (typeof window !== 'undefined') window.dispatchEvent(new Event('slap_stats_updated'));
      return data.user;
    } else {
      const users = JSON.parse(localStorage.getItem('slap_users') || '[]');
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("Account with this email already exists");
      }

      const newAdmin = {
        id: 'u-adm-' + Math.random().toString(36).substr(2, 9),
        email,
        password,
        fullName,
        country,
        is_admin: true,
        role: 'admin',
        user_metadata: { full_name: fullName, country, is_admin: true, role: 'admin' },
        created_at: new Date().toISOString()
      };

      users.push(newAdmin);
      localStorage.setItem('slap_users', JSON.stringify(users));
      localStorage.setItem('slap_current_user', JSON.stringify(newAdmin));

      const streaks = JSON.parse(localStorage.getItem('slap_streaks') || '{}');
      streaks[newAdmin.id] = { current_streak: 0, longest_streak: 0, last_activity_date: null };
      localStorage.setItem('slap_streaks', JSON.stringify(streaks));

      if (typeof window !== 'undefined') window.dispatchEvent(new Event('slap_stats_updated'));
      return newAdmin;
    }
  },

  async signIn(email, password) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const profile = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      if (profile.data) {
        data.user.user_metadata = { ...data.user.user_metadata, ...profile.data };
        data.user.is_admin = !!profile.data.is_admin;
        data.user.role = profile.data.role || 'user';
      }
      return data.user;
    } else {
      const users = JSON.parse(localStorage.getItem('slap_users') || '[]');
      // Case-insensitive email + exact password match
      const user = users.find(
        u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
      );
      if (!user) {
        throw new Error("Invalid email or password. Please check your credentials and try again.");
      }
      localStorage.setItem('slap_current_user', JSON.stringify(user));
      return user;
    }
  },

  async signInWithGoogle(portalMode = 'participant') {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${portalMode === 'admin' ? '/admin' : '/dashboard'}`
        }
      });
      if (error) throw error;
      return data;
    } else {
      const users = JSON.parse(localStorage.getItem('slap_users') || '[]');
      const isAdminPortal = portalMode === 'admin';
      const googleEmail = isAdminPortal ? 'admin.google@slapbible.org' : 'believer.google@gmail.com';
      const googleName = isAdminPortal ? 'Admin Believer (Google)' : 'Believer (Google User)';
      
      let user = users.find(u => u.email === googleEmail);
      if (!user) {
        user = {
          id: 'u-google-' + Math.random().toString(36).substr(2, 9),
          email: googleEmail,
          fullName: googleName,
          country: 'Nigeria',
          is_admin: isAdminPortal,
          role: isAdminPortal ? 'admin' : 'user',
          user_metadata: { full_name: googleName, country: 'Nigeria', is_admin: isAdminPortal, role: isAdminPortal ? 'admin' : 'user', provider: 'google' },
          created_at: new Date().toISOString()
        };
        users.push(user);
        localStorage.setItem('slap_users', JSON.stringify(users));
      }

      localStorage.setItem('slap_current_user', JSON.stringify(user));
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('slap_stats_updated'));
      return user;
    }
  },

  async getGlobalStats() {
    if (isSupabaseConfigured) {
      try {
        const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        const { data: countries } = await supabase.from('profiles').select('country');
        const { count: reportCount } = await supabase.from('slap_reports').select('*', { count: 'exact', head: true });

        const uniqueCountries = new Set((countries || []).map(c => c.country).filter(Boolean));

        const result = {
          activeBelievers: userCount || 0,
          totalParticipants: userCount || 0,
          nationsReached: uniqueCountries.size || 0,
          totalReports: reportCount || 0
        };
        return result;
      } catch (e) {
        console.warn("Could not fetch global stats from Supabase:", e);
      }
    }

    const users = JSON.parse(localStorage.getItem('slap_users') || '[]');
    const reports = JSON.parse(localStorage.getItem('slap_reports') || '[]');
    const countries = new Set(users.map(u => u.country || u.user_metadata?.country).filter(Boolean));

    return {
      activeBelievers: users.length,
      totalParticipants: users.length,
      nationsReached: countries.size,
      totalReports: reports.length
    };
  },

  async signInAdmin(email, password) {
    if (isSupabaseConfigured) {
      const user = await this.signIn(email, password);
      const isAdm = await this.isCurrentUserAdmin();
      if (!isAdm) {
        await this.signOut();
        throw new Error("Access restricted: This account does not have administrator privileges.");
      }
      return user;
    } else {
      const users = JSON.parse(localStorage.getItem('slap_users') || '[]');
      const user = users.find(
        u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
      );
      if (!user) throw new Error("Invalid email or password. Please check your credentials.");
      if (!user.is_admin && user.role !== 'admin' && user.email !== 'admin@slapbible.org') {
        throw new Error("Access restricted: This account does not have administrator privileges.");
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
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (profile) {
          user.user_metadata = { ...user.user_metadata, ...profile };
          user.is_admin = !!profile.is_admin;
          user.role = profile.role || 'user';
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
        .upsert({ 
          id: user.id, 
          full_name: fullName, 
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        });
      if (error) throw error;
      return { ...user, user_metadata: { ...user.user_metadata, full_name: fullName, avatar_url: avatarUrl } };
    } else {
      const users = JSON.parse(localStorage.getItem('slap_users'));
      const index = users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        users[index].user_metadata = { ...(users[index].user_metadata || {}), full_name: fullName };
        users[index].fullName = fullName;
        users[index].avatar_url = avatarUrl;
        localStorage.setItem('slap_users', JSON.stringify(users));
        localStorage.setItem('slap_current_user', JSON.stringify(users[index]));
        return users[index];
      }
      throw new Error("User profile not found");
    }
  },

  // --- SLAP REPORTS SERVICE (PostgreSQL with RLS) ---

  async submitReport(report) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error("Authentication required to submit report");

    const todayStr = new Date().toISOString().split('T')[0];

    if (isSupabaseConfigured) {
      // 1. Submit report to Supabase slap_reports table
      const { data, error } = await supabase
        .from('slap_reports')
        .insert({
          user_id: user.id,
          book: report.book,
          chapter: parseInt(report.chapter) || 1,
          verses: report.verses,
          translation: report.translation || 'KJV',
          striking_verses: report.strikingVerses,
          lessons_learnt: report.lessonsLearnt,
          action_plans: report.actionPlans,
          prayers: report.prayers,
          submission_date: todayStr
        })
        .select()
        .single();
      if (error) throw error;

      // 2. Fetch and Update Streak
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
          last_activity_date: newStreakData.date,
          updated_at: new Date().toISOString()
        });

      return { report: data, streak: newStreakData };
    } else {
      const reports = JSON.parse(localStorage.getItem('slap_reports') || '[]');
      const newReport = {
        id: 'rep-' + Math.random().toString(36).substr(2, 9),
        user_id: user.id,
        ...report,
        submission_date: todayStr,
        created_at: new Date().toISOString()
      };
      reports.push(newReport);
      localStorage.setItem('slap_reports', JSON.stringify(reports));
      window.dispatchEvent(new Event('slap_stats_updated'));

      // Update Streak in localStorage
      const streaks = JSON.parse(localStorage.getItem('slap_streaks') || '{}');
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
      const reports = JSON.parse(localStorage.getItem('slap_reports') || '[]');
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
      
      if (error && error.code !== 'PGRST116') throw error;
      return data || { current_streak: 0, longest_streak: 0, last_activity_date: null };
    } else {
      const streaks = JSON.parse(localStorage.getItem('slap_streaks') || '{}');
      return streaks[user.id] || { current_streak: 0, longest_streak: 0, last_activity_date: null };
    }
  },

  // --- DECLARATIONS SERVICE ---

  async getPreseededDeclarations() {
    return DEFAULT_DECLARATIONS;
  },

  async saveDeclaration(decl) {
    const user = await this.getCurrentUser();
    const userId = user ? user.id : null;

    // If a canvas render or card image is provided, upload to Supabase Storage
    let finalImageUrl = decl.imageUrl || '';
    if (decl.cardDataUrl && isSupabaseConfigured) {
      try {
        finalImageUrl = await this.uploadDeclarationImage(decl.cardDataUrl, userId);
      } catch (err) {
        console.warn("Storage upload failed, fallback to local URL:", err);
      }
    }

    if (isSupabaseConfigured && user) {
      const { data, error } = await supabase
        .from('declarations')
        .insert({
          user_id: userId,
          declaration_text: decl.text,
          scripture_reference: decl.ref,
          background_style: decl.backgroundStyle,
          exported_image_url: finalImageUrl,
          category: decl.category || 'faith'
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const declarations = JSON.parse(localStorage.getItem('slap_declarations') || '[]');
      const newDecl = {
        id: 'decl-user-' + Math.random().toString(36).substr(2, 9),
        user_id: userId || 'anonymous',
        declaration_text: decl.text,
        scripture_reference: decl.ref,
        background_style: decl.backgroundStyle,
        exported_image_url: finalImageUrl,
        category: decl.category || 'faith',
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
      const declarations = JSON.parse(localStorage.getItem('slap_declarations') || '[]');
      return declarations.filter(d => d.user_id === user.id).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    }
  },

  // --- ADMIN SERVICES & PERMISSION CONTROL ---

  async getAdminMetrics() {
    const isCurAdmin = await this.isCurrentUserAdmin();
    if (!isCurAdmin) throw new Error("Unauthorized: Admin permissions required");

    const users = await this.getAllUsers();
    const reports = await this.getAllReports();

    const todayStr = new Date().toISOString().split('T')[0];
    const todayReports = reports.filter(r => (r.submission_date || r.created_at?.split('T')[0]) === todayStr);
    const nations = new Set(users.map(u => u.country || u.user_metadata?.country).filter(Boolean));

    let totalDeclarations = 0;
    let topStreaks = [];

    if (isSupabaseConfigured) {
      const { count } = await supabase
        .from('declarations')
        .select('*', { count: 'exact', head: true });
      totalDeclarations = count || 0;

      const { data: streakRows } = await supabase
        .from('user_streaks')
        .select('user_id, current_streak, longest_streak, last_activity_date')
        .order('current_streak', { ascending: false })
        .limit(5);
      topStreaks = streakRows || [];
    } else {
      const declarations = JSON.parse(localStorage.getItem('slap_declarations') || '[]');
      totalDeclarations = declarations.length;
      const streaks = JSON.parse(localStorage.getItem('slap_streaks') || '{}');
      topStreaks = Object.values(streaks)
        .sort((a, b) => (b.current_streak || 0) - (a.current_streak || 0))
        .slice(0, 5);
    }

    return {
      totalParticipants: users.length,
      todaySubmissions: todayReports.length,
      totalSubmissions: reports.length,
      totalDeclarations,
      nationsReached: nations.size,
      topStreaks
    };
  },

  async getAllUsers() {
    const isCurAdmin = await this.isCurrentUserAdmin();
    if (!isCurAdmin) throw new Error("Unauthorized: Admin permissions required");

    if (isSupabaseConfigured) {
      const [profilesRes, reportsRes, streaksRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('slap_reports').select('user_id'),
        supabase.from('user_streaks').select('user_id, current_streak, longest_streak, last_activity_date')
      ]);

      if (profilesRes.error) console.error("Error fetching users from Supabase:", profilesRes.error);

      const users = profilesRes.data || [];
      const reports = reportsRes.data || [];
      const streaksArr = streaksRes.data || [];
      const streaksMap = Object.fromEntries(streaksArr.map(s => [s.user_id, s]));

      return users.map(u => {
        const userReports = reports.filter(r => r.user_id === u.id);
        const userStreak = streaksMap[u.id] || { current_streak: 0, longest_streak: 0, last_activity_date: null };
        return {
          ...u,
          totalSubmissions: userReports.length,
          current_streak: userStreak.current_streak || 0,
          longest_streak: userStreak.longest_streak || 0,
          last_activity_date: userStreak.last_activity_date,
          isAdmin: !!(u.is_admin || u.role === 'admin' || u.email === 'admin@slapbible.org')
        };
      });
    } else {
      const users = JSON.parse(localStorage.getItem('slap_users') || '[]');
      const reports = JSON.parse(localStorage.getItem('slap_reports') || '[]');
      const streaks = JSON.parse(localStorage.getItem('slap_streaks') || '{}');

      return users.map(u => {
        const userReports = reports.filter(r => r.user_id === u.id);
        const userStreak = streaks[u.id] || { current_streak: 0, longest_streak: 0, last_activity_date: null };
        return {
          ...u,
          totalSubmissions: userReports.length,
          current_streak: userStreak.current_streak || 0,
          longest_streak: userStreak.longest_streak || 0,
          last_activity_date: userStreak.last_activity_date,
          isAdmin: !!(u.is_admin || u.role === 'admin' || u.email === 'admin@slapbible.org')
        };
      });
    }
  },

  async getAllReports() {
    const isCurAdmin = await this.isCurrentUserAdmin();
    if (!isCurAdmin) throw new Error("Unauthorized: Admin permissions required");

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('slap_reports')
        .select('*, profiles(full_name, email, country)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(r => ({
        ...r,
        userName: r.profiles?.full_name || 'Participant',
        userEmail: r.profiles?.email || '',
        userCountry: r.profiles?.country || ''
      }));
    } else {
      const localReports = JSON.parse(localStorage.getItem('slap_reports') || '[]');
      const users = JSON.parse(localStorage.getItem('slap_users') || '[]');
      return localReports.map(r => {
        const u = users.find(user => user.id === r.user_id);
        return {
          ...r,
          userName: u?.user_metadata?.full_name || u?.fullName || 'Participant',
          userEmail: u?.email || '',
          userCountry: u?.country || u?.user_metadata?.country || ''
        };
      }).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }
  },

  async grantAdminPermission(userId) {
    const isCurAdmin = await this.isCurrentUserAdmin();
    if (!isCurAdmin) throw new Error("Unauthorized: Super-admin permission required to grant access");

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: true, role: 'admin' })
        .eq('id', userId);
      if (error) throw error;
      return true;
    } else {
      const users = JSON.parse(localStorage.getItem('slap_users') || '[]');
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex].is_admin = true;
        users[userIndex].role = 'admin';
        localStorage.setItem('slap_users', JSON.stringify(users));

        const currentUser = await this.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
          currentUser.is_admin = true;
          currentUser.role = 'admin';
          localStorage.setItem('slap_current_user', JSON.stringify(currentUser));
        }
        return true;
      }
      return false;
    }
  },

  async revokeAdminPermission(userId) {
    const isCurAdmin = await this.isCurrentUserAdmin();
    if (!isCurAdmin) throw new Error("Unauthorized: Super-admin permission required to revoke access");

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: false, role: 'user' })
        .eq('id', userId);
      if (error) throw error;
      return true;
    } else {
      const users = JSON.parse(localStorage.getItem('slap_users') || '[]');
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex].is_admin = false;
        users[userIndex].role = 'user';
        localStorage.setItem('slap_users', JSON.stringify(users));
        return true;
      }
      return false;
    }
  },

  async verifyAdminKey(secretKey) {
    const VALID_ADMIN_KEYS = ['SLAP_ADMIN_2026', 'admin123', 'admin'];
    if (!VALID_ADMIN_KEYS.includes(secretKey.trim())) {
      throw new Error("Invalid admin authorization passkey");
    }

    let user = await this.getCurrentUser();

    if (isSupabaseConfigured) {
      if (!user) throw new Error("Please sign in to your account before authorizing admin privileges.");
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: true, role: 'admin' })
        .eq('id', user.id);
      if (error) throw error;

      await supabase.auth.updateUser({
        data: { is_admin: true, role: 'admin' }
      });
    } else {
      const users = JSON.parse(localStorage.getItem('slap_users') || '[]');
      if (!user) {
        // Auto-authenticate as Lead Admin if unauthenticated in demo mode
        user = users.find(u => u.is_admin || u.role === 'admin' || u.email === 'admin@slapbible.org') || INITIAL_DEMO_USERS[0];
        if (!users.some(u => u.id === user.id)) {
          users.push(user);
        }
      }

      user.is_admin = true;
      user.role = 'admin';
      localStorage.setItem('slap_current_user', JSON.stringify(user));

      const idx = users.findIndex(u => u.id === user.id);
      if (idx !== -1) {
        users[idx].is_admin = true;
        users[idx].role = 'admin';
        localStorage.setItem('slap_users', JSON.stringify(users));
      }
    }
    return true;
  },

  async isCurrentUserAdmin() {
    const user = await this.getCurrentUser();
    if (!user) return false;

    const cachedIsAdmin = !!(user.is_admin || user.role === 'admin'
      || user.user_metadata?.is_admin || user.user_metadata?.role === 'admin'
      || user.email === 'admin@slapbible.org');
    if (cachedIsAdmin) return true;

    if (isSupabaseConfigured && user.id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin, role')
        .eq('id', user.id)
        .single();
      if (profile) {
        return !!(profile.is_admin || profile.role === 'admin');
      }
    }

    return false;
  },

  async deleteReportByAdmin(reportId) {
    const isCurAdmin = await this.isCurrentUserAdmin();
    if (!isCurAdmin) throw new Error("Unauthorized");

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('slap_reports')
        .delete()
        .eq('id', reportId);
      if (error) throw error;
    } else {
      const reports = JSON.parse(localStorage.getItem('slap_reports') || '[]');
      const filtered = reports.filter(r => r.id !== reportId);
      localStorage.setItem('slap_reports', JSON.stringify(filtered));
    }
    return true;
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
      const videos = JSON.parse(localStorage.getItem('slap_videos') || '[]');
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
      const videos = JSON.parse(localStorage.getItem('slap_videos') || '[]');
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
