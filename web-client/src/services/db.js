import { supabase, isSupabaseConfigured, STORAGE_BUCKETS } from '../supabaseClient.js';

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

// UUID validation helper for PostgreSQL compatibility
function isValidUUID(str) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str || '');
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

// Master Seeded Administrator Account (Initial seeded password: admin)
const INITIAL_ADMIN_ACCOUNT = {
  id: 'admin-seeded-master',
  email: 'admin@slapbible.org',
  password: 'admin',
  fullName: 'Lead Administrator',
  user_metadata: {
    full_name: 'Lead Administrator',
    country: 'Nigeria',
    role: 'admin',
    is_admin: true,
    title: 'Lead Administrator',
    is_default_password: true
  },
  country: 'Nigeria',
  role: 'admin',
  is_admin: true,
  created_at: new Date().toISOString()
};

const SLAP_DB_VERSION = 'slap_db_v5_clean';
if (typeof window !== 'undefined' && window.localStorage) {
  const currentVersion = localStorage.getItem('slap_db_version');

  if (currentVersion !== SLAP_DB_VERSION) {
    // Purge any legacy dummy accounts and reset to a clean state:
    // Only the seeded Admin account exists. Every participant must sign up!
    localStorage.setItem('slap_db_version', SLAP_DB_VERSION);
    if (!localStorage.getItem('slap_admin_password')) {
      localStorage.setItem('slap_admin_password', 'admin');
    }
    const currentAdminPass = localStorage.getItem('slap_admin_password') || 'admin';
    const seededAdmin = {
      ...INITIAL_ADMIN_ACCOUNT,
      password: currentAdminPass,
      user_metadata: {
        ...INITIAL_ADMIN_ACCOUNT.user_metadata,
        is_default_password: currentAdminPass === 'admin'
      }
    };
    localStorage.setItem('slap_users', JSON.stringify([seededAdmin]));
    localStorage.setItem('slap_reports', JSON.stringify([]));
    localStorage.setItem('slap_declarations', JSON.stringify([]));
    localStorage.setItem('slap_streaks', JSON.stringify({}));
  } else {
    // Preserve current clean database
    if (!localStorage.getItem('slap_admin_password')) {
      localStorage.setItem('slap_admin_password', 'admin');
    }
    if (!localStorage.getItem('slap_users') || JSON.parse(localStorage.getItem('slap_users') || '[]').length === 0) {
      const currentAdminPass = localStorage.getItem('slap_admin_password') || 'admin';
      const seededAdmin = {
        ...INITIAL_ADMIN_ACCOUNT,
        password: currentAdminPass,
        user_metadata: {
          ...INITIAL_ADMIN_ACCOUNT.user_metadata,
          is_default_password: currentAdminPass === 'admin'
        }
      };
      localStorage.setItem('slap_users', JSON.stringify([seededAdmin]));
    }
    if (!localStorage.getItem('slap_reports')) {
      localStorage.setItem('slap_reports', JSON.stringify([]));
    }
    if (!localStorage.getItem('slap_declarations')) {
      localStorage.setItem('slap_declarations', JSON.stringify([]));
    }
    if (!localStorage.getItem('slap_streaks')) {
      localStorage.setItem('slap_streaks', JSON.stringify({}));
    }
  }

  if (!localStorage.getItem('slap_videos')) {
    localStorage.setItem('slap_videos', JSON.stringify(DEFAULT_VIDEOS));
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

  // --- AUTH SERVICE (Dual-Layer: Supabase Cloud + Persistent Local Storage) ---

  async signUp(email, password, fullName, country = '') {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '');
    const cleanName = (fullName || '').trim() || 'Participant';
    const cleanCountry = (country || '').trim() || 'Global';

    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error("Please enter a valid email address.");
    }
    if (!cleanPassword || cleanPassword.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }

    // 1. Prevent duplicate sign-up for existing accounts
    const localUsers = JSON.parse(localStorage.getItem('slap_users') || '[]');
    const existingUser = localUsers.find(
      u => (u.email || '').toLowerCase().trim() === cleanEmail
    );
    if (existingUser) {
      throw new Error("An account with this email address already exists. Please sign in instead.");
    }

    let supabaseUser = null;
    let userId = 'u-' + Date.now() + '-' + Math.random().toString(36).substr(2, 7);

    // 2. Cloud Registration via Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: {
            data: {
              full_name: cleanName,
              country: cleanCountry,
              is_admin: false,
              role: 'user'
            }
          }
        });

        if (error) {
          if (error.message?.toLowerCase().includes('already registered')) {
            throw new Error("An account with this email is already registered. Please sign in instead.");
          }
          console.warn("Supabase auth signUp warning:", error.message);
        }

        if (data?.user) {
          supabaseUser = data.user;
          userId = data.user.id;

          try {
            await supabase
              .from('profiles')
              .upsert({
                id: data.user.id,
                email: cleanEmail,
                full_name: cleanName,
                country: cleanCountry,
                is_admin: false,
                role: 'user',
                updated_at: new Date().toISOString()
              });
          } catch (pe) {
            console.warn("Supabase profiles upsert warning:", pe?.message);
          }

          try {
            await supabase
              .from('user_streaks')
              .upsert({
                user_id: data.user.id,
                current_streak: 0,
                longest_streak: 0,
                last_activity_date: null
              });
          } catch (se) {
            console.warn("Supabase user_streaks upsert warning:", se?.message);
          }
        }
      } catch (authErr) {
        if (authErr.message?.includes('already registered')) {
          throw authErr;
        }
        console.warn("Supabase signUp exception:", authErr);
      }
    }

    // 3. Build unified persistent participant record
    const userRecord = {
      id: userId,
      email: cleanEmail,
      password: cleanPassword, // Preserved for resilient multi-layer authentication
      fullName: cleanName,
      country: cleanCountry,
      is_admin: false,
      role: 'user',
      login_count: 1,
      user_metadata: {
        full_name: cleanName,
        country: cleanCountry,
        is_admin: false,
        role: 'user',
        ...(supabaseUser?.user_metadata || {})
      },
      created_at: supabaseUser?.created_at || new Date().toISOString()
    };

    // 4. Persist in local storage registered users list
    localUsers.push(userRecord);
    localStorage.setItem('slap_users', JSON.stringify(localUsers));

    // 5. Establish immediate active session (survives refreshes & restarts)
    localStorage.setItem('slap_current_user', JSON.stringify(userRecord));

    // 6. Initialize streak record
    const streaks = JSON.parse(localStorage.getItem('slap_streaks') || '{}');
    if (!streaks[userId]) {
      streaks[userId] = { current_streak: 0, longest_streak: 0, last_activity_date: null };
      localStorage.setItem('slap_streaks', JSON.stringify(streaks));
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('slap_stats_updated'));
      window.dispatchEvent(new Event('slap_auth_updated'));
    }

    return userRecord;
  },

  async signUpAdmin(email, password, fullName, country = '', adminPasskey = '') {
    const VALID_ADMIN_KEYS = ['SLAP_ADMIN_2026#@'];
    if (!VALID_ADMIN_KEYS.includes(adminPasskey.trim())) {
      throw new Error("Invalid admin authorization passkey. Please check with the lead administrator.");
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '');
    const cleanName = (fullName || '').trim() || 'Administrator';
    const cleanCountry = (country || '').trim() || 'Global';

    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error("Please enter a valid email address.");
    }
    if (!cleanPassword || cleanPassword.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }

    const localUsers = JSON.parse(localStorage.getItem('slap_users') || '[]');
    const existing = localUsers.find(u => (u.email || '').toLowerCase().trim() === cleanEmail);
    if (existing) {
      throw new Error("An account with this email address already exists. Please sign in instead.");
    }

    let supabaseUser = null;
    let userId = 'u-adm-' + Date.now() + '-' + Math.random().toString(36).substr(2, 7);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: {
            data: {
              full_name: cleanName,
              country: cleanCountry,
              is_admin: true,
              role: 'admin'
            }
          }
        });

        if (error) {
          if (error.message?.toLowerCase().includes('already registered')) {
            throw new Error("An account with this email is already registered. Please sign in instead.");
          }
          console.warn("Supabase auth signUp admin warning:", error.message);
        }

        if (data?.user) {
          supabaseUser = data.user;
          userId = data.user.id;

          try {
            await supabase
              .from('profiles')
              .upsert({
                id: data.user.id,
                email: cleanEmail,
                full_name: cleanName,
                country: cleanCountry,
                is_admin: true,
                role: 'admin',
                updated_at: new Date().toISOString()
              });
          } catch (pe) {
            console.warn("Supabase profiles upsert warning:", pe?.message);
          }

          try {
            await supabase
              .from('user_streaks')
              .upsert({
                user_id: data.user.id,
                current_streak: 0,
                longest_streak: 0,
                last_activity_date: null
              });
          } catch (se) {
            console.warn("Supabase user_streaks upsert warning:", se?.message);
          }
        }
      } catch (authErr) {
        if (authErr.message?.includes('already registered')) {
          throw authErr;
        }
        console.warn("Supabase signUp admin exception:", authErr);
      }
    }

    const newAdmin = {
      id: userId,
      email: cleanEmail,
      password: cleanPassword,
      fullName: cleanName,
      country: cleanCountry,
      is_admin: true,
      role: 'admin',
      login_count: 1,
      user_metadata: {
        full_name: cleanName,
        country: cleanCountry,
        is_admin: true,
        role: 'admin',
        ...(supabaseUser?.user_metadata || {})
      },
      created_at: supabaseUser?.created_at || new Date().toISOString()
    };

    localUsers.push(newAdmin);
    localStorage.setItem('slap_users', JSON.stringify(localUsers));
    localStorage.setItem('slap_current_user', JSON.stringify(newAdmin));

    const streaks = JSON.parse(localStorage.getItem('slap_streaks') || '{}');
    if (!streaks[userId]) {
      streaks[userId] = { current_streak: 0, longest_streak: 0, last_activity_date: null };
      localStorage.setItem('slap_streaks', JSON.stringify(streaks));
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('slap_stats_updated'));
      window.dispatchEvent(new Event('slap_auth_updated'));
    }

    return newAdmin;
  },

  async signIn(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '');
    const isAdminLookup = cleanEmail === 'admin@slapbible.org' || cleanEmail === 'admin';

    // 1. Seeded Master Administrator Authentication (Initial seeded password: admin)
    if (isAdminLookup) {
      const storedAdminPassword = (typeof window !== 'undefined' ? localStorage.getItem('slap_admin_password') : null) || 'admin';

      // Match current admin password (default: admin, or updated by the admin)
      if (cleanPassword === storedAdminPassword) {
        const users = JSON.parse(localStorage.getItem('slap_users') || '[]');
        let adminUser = users.find(u => u.email === 'admin@slapbible.org' || u.id === 'admin-seeded-master');

        if (!adminUser) {
          adminUser = {
            id: 'admin-seeded-master',
            email: 'admin@slapbible.org',
            password: storedAdminPassword,
            fullName: 'Lead Administrator',
            country: 'Nigeria',
            is_admin: true,
            role: 'admin',
            user_metadata: {
              full_name: 'Lead Administrator',
              country: 'Nigeria',
              role: 'admin',
              is_admin: true,
              title: 'Lead Administrator',
              is_default_password: storedAdminPassword === 'admin'
            },
            created_at: new Date().toISOString()
          };
          users.unshift(adminUser);
          localStorage.setItem('slap_users', JSON.stringify(users));
        } else {
          adminUser.is_admin = true;
          adminUser.role = 'admin';
          adminUser.password = storedAdminPassword;
          if (!adminUser.user_metadata) adminUser.user_metadata = {};
          adminUser.user_metadata.is_admin = true;
          adminUser.user_metadata.role = 'admin';
          adminUser.user_metadata.is_default_password = storedAdminPassword === 'admin';
        }

        localStorage.setItem('slap_current_user', JSON.stringify(adminUser));

        // If Supabase is connected, attempt sync with Supabase Auth
        if (isSupabaseConfigured && supabase) {
          try {
            await supabase.auth.signInWithPassword({
              email: 'admin@slapbible.org',
              password: storedAdminPassword
            }).catch(() => { });
          } catch (e) { }
        }

        return adminUser;
      } else {
        throw new Error("Invalid administrator password. Please check your password or reset it.");
      }
    }

    // 2. Regular Participant & Custom Admin Authentication (Dual-Layer: Cloud + Resilient Local Store)
    const localUsers = JSON.parse(localStorage.getItem('slap_users') || '[]');
    const matchingLocalUser = localUsers.find(
      u => (u.email || '').toLowerCase().trim() === cleanEmail
    );

    // Layer A: Attempt Supabase Cloud Authentication if configured
    let authenticatedUser = null;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword
        });

        if (!error && data?.user) {
          authenticatedUser = data.user;

          try {
            const profile = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
            if (profile?.data) {
              authenticatedUser.user_metadata = { ...authenticatedUser.user_metadata, ...profile.data };
              authenticatedUser.is_admin = !!profile.data.is_admin;
              authenticatedUser.role = profile.data.role || 'user';
              authenticatedUser.fullName = profile.data.full_name || authenticatedUser.fullName;
              authenticatedUser.country = profile.data.country || authenticatedUser.country;
            }
          } catch (pe) { }
        } else if (error) {
          console.warn("Supabase signIn response:", error.message);
        }
      } catch (cloudErr) {
        console.warn("Supabase signIn exception:", cloudErr);
      }
    }

    // Layer B: If Supabase succeeded, update local storage session & user record
    if (authenticatedUser) {
      const existingIdx = localUsers.findIndex(u => (u.email || '').toLowerCase().trim() === cleanEmail || u.id === authenticatedUser.id);
      const unifiedUser = {
        ...authenticatedUser,
        fullName: authenticatedUser.user_metadata?.full_name || authenticatedUser.fullName || cleanEmail.split('@')[0],
        country: authenticatedUser.user_metadata?.country || authenticatedUser.country || 'Global',
        password: cleanPassword, // Preserve for resilient offline/refresh fallback
        login_count: ((existingIdx !== -1 ? localUsers[existingIdx].login_count : 0) || 0) + 1
      };

      if (existingIdx !== -1) {
        localUsers[existingIdx] = { ...localUsers[existingIdx], ...unifiedUser };
      } else {
        localUsers.push(unifiedUser);
      }
      localStorage.setItem('slap_users', JSON.stringify(localUsers));
      localStorage.setItem('slap_current_user', JSON.stringify(unifiedUser));
      return unifiedUser;
    }

    // Layer C: Resilient Local Store Fallback (Handles unconfirmed email, offline, or network timeouts)
    if (matchingLocalUser) {
      if (matchingLocalUser.password === cleanPassword) {
        // Password verified successfully!
        matchingLocalUser.login_count = (matchingLocalUser.login_count || 0) + 1;
        const userIdx = localUsers.findIndex(u => u.id === matchingLocalUser.id);
        if (userIdx !== -1) localUsers[userIdx].login_count = matchingLocalUser.login_count;
        localStorage.setItem('slap_users', JSON.stringify(localUsers));
        localStorage.setItem('slap_current_user', JSON.stringify(matchingLocalUser));
        return matchingLocalUser;
      } else {
        throw new Error("Incorrect password. Please verify your password or use 'Forgot Password' to reset it.");
      }
    }

    // Layer D: User does not exist anywhere
    throw new Error("No account found with this email. Every participant must sign up first before signing in.");
  },

  /**
   * Change password for the Administrator after login
   */
  async changeAdminPassword(currentPassword, newPassword) {
    if (!newPassword || newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters.");
    }
    const storedAdminPassword = (typeof window !== 'undefined' ? localStorage.getItem('slap_admin_password') : null) || 'admin';
    if (currentPassword !== storedAdminPassword) {
      throw new Error("Current password does not match. Please verify your current password.");
    }

    // 1. Update local storage admin password
    localStorage.setItem('slap_admin_password', newPassword);

    // 2. Update admin in slap_users list
    const users = JSON.parse(localStorage.getItem('slap_users') || '[]');
    const adminIdx = users.findIndex(u => u.email === 'admin@slapbible.org' || u.id === 'admin-seeded-master');
    if (adminIdx !== -1) {
      users[adminIdx].password = newPassword;
      if (!users[adminIdx].user_metadata) users[adminIdx].user_metadata = {};
      users[adminIdx].user_metadata.is_default_password = false;
      localStorage.setItem('slap_users', JSON.stringify(users));
    }

    // 3. Update current user session
    const currentUser = JSON.parse(localStorage.getItem('slap_current_user') || 'null');
    if (currentUser && (currentUser.is_admin || currentUser.email === 'admin@slapbible.org')) {
      currentUser.password = newPassword;
      if (!currentUser.user_metadata) currentUser.user_metadata = {};
      currentUser.user_metadata.is_default_password = false;
      localStorage.setItem('slap_current_user', JSON.stringify(currentUser));
    }

    // 4. If Supabase is connected, update Supabase user password as well
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.updateUser({ password: newPassword });
      } catch (err) {
        console.warn("Supabase auth password update:", err?.message);
      }
    }

    return {
      success: true,
      message: "Admin password successfully updated! Please use your new password next time you sign in."
    };
  },

  /**
   * Request a password reset link to be sent to user's registered email
   */
  async requestPasswordReset(email) {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) {
      throw new Error("Please enter your registered email address.");
    }

    let cloudResetSent = false;
    if (isSupabaseConfigured && supabase) {
      try {
        const redirectTo = `${window.location.origin}/auth?mode=update-password`;
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo
        });
        if (!error) {
          cloudResetSent = true;
        }
      } catch (e) {
        console.warn("Supabase resetPasswordForEmail exception:", e);
      }
    }

    const users = JSON.parse(localStorage.getItem('slap_users') || '[]');
    const user = users.find(u => (u.email || '').toLowerCase().trim() === cleanEmail);

    if (cloudResetSent) {
      return {
        success: true,
        message: `Password reset instructions have been sent to ${cleanEmail}. Please check your inbox and spam folder.`,
        user
      };
    }

    if (user) {
      return {
        success: true,
        message: `Password reset instructions initiated for ${cleanEmail}. You can now set your new password below.`,
        user
      };
    }

    throw new Error("No account found with this email address. Please check your spelling or sign up first.");
  },

  /**
   * Update password for an authenticated or recovery-mode user
   */
  async updateUserPassword(newPassword) {
    if (!newPassword || newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }

    const currentUser = JSON.parse(localStorage.getItem('slap_current_user') || 'null');
    const isAdmin = !!(currentUser && (currentUser.is_admin || currentUser.role === 'admin' || currentUser.email === 'admin@slapbible.org'));
    if (isAdmin) {
      localStorage.setItem('slap_admin_password', newPassword);
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.updateUser({
          password: newPassword
        });
        if (data?.user) return data.user;
        if (error) console.warn("Supabase auth updateUser:", error.message);
      } catch (e) {
        console.warn("Supabase updateUser catch:", e);
      }
    }

    const users = JSON.parse(localStorage.getItem('slap_users') || '[]');
    if (currentUser) {
      currentUser.password = newPassword;
      if (currentUser.user_metadata) currentUser.user_metadata.is_default_password = false;
      const idx = users.findIndex(u => u.id === currentUser.id || u.email === currentUser.email);
      if (idx !== -1) {
        users[idx].password = newPassword;
        if (users[idx].user_metadata) users[idx].user_metadata.is_default_password = false;
      }
      localStorage.setItem('slap_users', JSON.stringify(users));
      localStorage.setItem('slap_current_user', JSON.stringify(currentUser));
      return currentUser;
    }
    throw new Error("No active password recovery session found.");
  },

  /**
   * Direct password reset helper for local fallback mode
   */
  async resetLocalUserPassword(email, newPassword) {
    if (!newPassword || newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }
    const cleanEmail = (email || '').trim().toLowerCase();
    const users = JSON.parse(localStorage.getItem('slap_users') || '[]');
    const idx = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
    if (idx === -1) {
      throw new Error("Account not found for this email address.");
    }
    users[idx].password = newPassword;
    localStorage.setItem('slap_users', JSON.stringify(users));
    localStorage.setItem('slap_current_user', JSON.stringify(users[idx]));
    return users[idx];
  },


  async getGlobalStats() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: profiles } = await supabase.from('profiles').select('email, country');
        const { count: reportCount } = await supabase.from('slap_reports').select('*', { count: 'exact', head: true });

        const localUsers = JSON.parse(localStorage.getItem('slap_users') || '[]');
        const localReports = JSON.parse(localStorage.getItem('slap_reports') || '[]');

        const allUsers = [...(profiles || []), ...localUsers];
        const uniqueEmails = new Set(allUsers.map(p => (p.email || '').toLowerCase().trim()).filter(Boolean));
        const uniqueCountries = new Set(allUsers.map(c => c.country || c.user_metadata?.country).filter(Boolean));

        const effectiveReports = Math.max(reportCount || 0, localReports.length);

        return {
          activeBelievers: uniqueEmails.size || allUsers.length,
          totalParticipants: uniqueEmails.size || allUsers.length,
          nationsReached: uniqueCountries.size || 0,
          totalReports: effectiveReports
        };
      } catch (e) {
        console.warn("Could not fetch global stats from Supabase:", e);
      }
    }

    const users = JSON.parse(localStorage.getItem('slap_users') || '[]');
    const reports = JSON.parse(localStorage.getItem('slap_reports') || '[]');
    const uniqueEmails = new Set(users.map(u => (u.email || '').toLowerCase().trim()).filter(Boolean));
    const countries = new Set(users.map(u => u.country || u.user_metadata?.country).filter(Boolean));

    return {
      activeBelievers: uniqueEmails.size,
      totalParticipants: uniqueEmails.size,
      nationsReached: countries.size,
      totalReports: reports.length
    };
  },

  async simulateTestLoginAndReport() {
    throw new Error("Simulated dummy accounts are disabled. Every user must sign up before signing in.");
  },

  async signInAdmin(email, password) {
    const user = await this.signIn(email, password);
    const isAdm = await this.isCurrentUserAdmin();
    if (!isAdm && !user?.is_admin && user?.role !== 'admin' && user?.email !== 'admin@slapbible.org') {
      await this.signOut();
      throw new Error("Access restricted: This account does not have administrator privileges.");
    }
    return user;
  },

  async signOut() {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn("Supabase signOut error:", e);
      }
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('slap_current_user');
      window.dispatchEvent(new Event('slap_stats_updated'));
      window.dispatchEvent(new Event('slap_auth_updated'));
    }
    return true;
  },

  async getCurrentUser() {
    let user = null;

    // Layer 1: Check persistent local session first
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem('slap_current_user');
        if (stored) {
          user = JSON.parse(stored);
        }
      }
    } catch (e) {
      console.warn("Error reading local current user session:", e);
    }

    // If local session is active as Admin, preserve admin session immediately
    if (user && (user.is_admin || user.role === 'admin' || user.email === 'admin@slapbible.org')) {
      user.is_admin = true;
      user.role = 'admin';
      return user;
    }

    // Layer 2: Check Supabase Auth if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          const cloudUser = data.user;
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', cloudUser.id)
              .single();
            if (profile) {
              cloudUser.user_metadata = { ...cloudUser.user_metadata, ...profile };
              cloudUser.is_admin = !!profile.is_admin;
              cloudUser.role = profile.role || 'user';
              cloudUser.fullName = profile.full_name || cloudUser.fullName;
              cloudUser.country = profile.country || cloudUser.country;
            }
          } catch (e) { }

          // Sync if matching session or no active local user
          if (!user || user.id === cloudUser.id || (user.email && user.email.toLowerCase() === cloudUser.email?.toLowerCase())) {
            const merged = {
              ...(user || {}),
              ...cloudUser,
              fullName: cloudUser.fullName || user?.fullName || cloudUser.user_metadata?.full_name,
              country: cloudUser.country || user?.country || cloudUser.user_metadata?.country,
              user_metadata: { ...(user?.user_metadata || {}), ...(cloudUser.user_metadata || {}) }
            };
            try {
              localStorage.setItem('slap_current_user', JSON.stringify(merged));
            } catch (se) { }
            return merged;
          }
        }
      } catch (err) {
        console.warn("Supabase getCurrentUser warning, checking persistent local session:", err?.message);
      }
    }

    // Layer 3: Return verified local user session
    if (user && (user.id || user.email)) {
      return user;
    }

    return null;
  },

  async updateUserProfile(fullName, avatarUrl) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error("Not authenticated");

    const cleanName = (fullName || '').trim() || user.fullName || user.user_metadata?.full_name;

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            full_name: cleanName,
            avatar_url: avatarUrl || user.avatar_url,
            updated_at: new Date().toISOString()
          });
      } catch (err) {
        console.warn("Supabase profile update warning:", err?.message);
      }
    }

    // Always synchronize local storage users and active session
    const users = JSON.parse(localStorage.getItem('slap_users') || '[]');
    const index = users.findIndex(u => u.id === user.id || (u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase()));
    const updatedUser = {
      ...user,
      fullName: cleanName,
      avatar_url: avatarUrl || user.avatar_url,
      user_metadata: {
        ...(user.user_metadata || {}),
        full_name: cleanName,
        avatar_url: avatarUrl || user.avatar_url
      }
    };

    if (index !== -1) {
      users[index] = { ...users[index], ...updatedUser };
      localStorage.setItem('slap_users', JSON.stringify(users));
    }
    localStorage.setItem('slap_current_user', JSON.stringify(updatedUser));
    return updatedUser;
  },

  // --- SLAP REPORTS SERVICE (PostgreSQL with RLS + Resilient Local Store) ---

  async submitReport(report, activeUser = null) {
    let user = activeUser;
    if (!user) {
      try {
        user = await this.getCurrentUser();
      } catch (e) {
        console.warn("getCurrentUser in submitReport caught:", e);
      }
    }
    if (!user) {
      try {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('slap_current_user') : null;
        if (stored) user = JSON.parse(stored);
      } catch (e) {}
    }
    if (!user) {
      try {
        const localUsers = JSON.parse(localStorage.getItem('slap_users') || '[]');
        if (localUsers.length > 0) user = localUsers[localUsers.length - 1];
      } catch (e) {}
    }
    if (!user) {
      throw new Error("Authentication required to submit devotion report. Please sign in or register.");
    }

    if (!user.id) {
      user.id = 'u-' + Date.now() + '-' + Math.random().toString(36).substr(2, 7);
      try {
        localStorage.setItem('slap_current_user', JSON.stringify(user));
      } catch (e) {}
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const reportId = 'rep-' + Date.now() + '-' + Math.random().toString(36).substr(2, 7);

    const striking = report.strikingVerses || report.striking_verses || '';
    const lessons = report.lessonsLearnt || report.lessons_learnt || '';
    const actions = report.actionPlans || report.action_plans || '';
    const prayers = report.prayers || '';

    const cleanReport = {
      id: reportId,
      user_id: user.id,
      book: report.book || 'Genesis',
      chapter: parseInt(report.chapter, 10) || 1,
      verses: report.verses || '',
      translation: report.translation || 'KJV',
      striking_verses: striking,
      strikingVerses: striking,
      lessons_learnt: lessons,
      lessonsLearnt: lessons,
      action_plans: actions,
      actionPlans: actions,
      prayers: prayers,
      submission_date: todayStr,
      created_at: new Date().toISOString(),
      userName: user.user_metadata?.full_name || user.fullName || 'Participant',
      userEmail: user.email || '',
      userCountry: user.country || user.user_metadata?.country || ''
    };

    // 1. ALWAYS persist locally first (zero network lag, guaranteed submission durability)
    const localReports = JSON.parse(localStorage.getItem('slap_reports') || '[]');
    localReports.unshift(cleanReport);
    try {
      localStorage.setItem('slap_reports', JSON.stringify(localReports));
    } catch (e) {
      console.warn("Error saving to localStorage.slap_reports:", e);
    }

    // Update Streak in localStorage
    const streaks = JSON.parse(localStorage.getItem('slap_streaks') || '{}');
    const userStreak = streaks[user.id] || { current_streak: 0, longest_streak: 0, last_activity_date: null };

    const newStreakData = calculateUpdatedStreak(
      userStreak.last_activity_date,
      userStreak.current_streak,
      userStreak.longest_streak
    );

    streaks[user.id] = {
      current_streak: Math.max(1, newStreakData.current || 1),
      longest_streak: Math.max(1, newStreakData.longest || 1),
      last_activity_date: newStreakData.date
    };
    try {
      localStorage.setItem('slap_streaks', JSON.stringify(streaks));
    } catch (e) {}

    // 2. Synchronize to Supabase Cloud if configured & user ID is valid UUID
    let cloudSynced = false;
    if (isSupabaseConfigured && supabase && isValidUUID(user.id)) {
      try {
        const { data, error } = await supabase
          .from('slap_reports')
          .insert({
            user_id: user.id,
            book: cleanReport.book,
            chapter: cleanReport.chapter,
            verses: cleanReport.verses,
            translation: cleanReport.translation,
            striking_verses: cleanReport.striking_verses,
            lessons_learnt: cleanReport.lessons_learnt,
            action_plans: cleanReport.action_plans,
            prayers: cleanReport.prayers,
            submission_date: todayStr
          })
          .select()
          .single();

        if (!error && data) {
          cloudSynced = true;
          try {
            await supabase
              .from('user_streaks')
              .upsert({
                user_id: user.id,
                current_streak: streaks[user.id].current_streak,
                longest_streak: streaks[user.id].longest_streak,
                last_activity_date: streaks[user.id].last_activity_date,
                updated_at: new Date().toISOString()
              });
          } catch (se) {
            console.warn("Supabase user_streaks update warning:", se?.message);
          }
        } else if (error) {
          console.warn("Supabase slap_reports insert warning (saved locally):", error.message);
        }
      } catch (cloudErr) {
        console.warn("Supabase cloud report insert exception (saved locally):", cloudErr);
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('slap_stats_updated'));
      window.dispatchEvent(new Event('slap_reports_updated'));
    }

    return {
      report: cleanReport,
      streak: streaks[user.id],
      cloudSynced
    };
  },

  async getReports() {
    let user = null;
    try {
      user = await this.getCurrentUser();
    } catch (e) {}
    if (!user) {
      try {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('slap_current_user') : null;
        if (stored) user = JSON.parse(stored);
      } catch (e) {}
    }
    if (!user) return [];

    let cloudReports = [];
    if (isSupabaseConfigured && supabase && isValidUUID(user.id)) {
      try {
        const { data, error } = await supabase
          .from('slap_reports')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          cloudReports = data.map(r => ({
            ...r,
            strikingVerses: r.striking_verses || r.strikingVerses || '',
            striking_verses: r.striking_verses || r.strikingVerses || '',
            lessonsLearnt: r.lessons_learnt || r.lessonsLearnt || '',
            lessons_learnt: r.lessons_learnt || r.lessonsLearnt || '',
            actionPlans: r.action_plans || r.actionPlans || '',
            action_plans: r.action_plans || r.actionPlans || '',
            prayers: r.prayers || ''
          }));
        }
      } catch (e) {
        console.warn("Supabase getReports warning:", e?.message);
      }
    }

    const localReports = JSON.parse(localStorage.getItem('slap_reports') || '[]');
    const userEmail = (user.email || '').toLowerCase().trim();
    const userLocalReports = localReports.filter(r => 
      (user.id && r.user_id === user.id) || 
      (userEmail && r.userEmail && r.userEmail.toLowerCase().trim() === userEmail)
    ).map(r => ({
      ...r,
      strikingVerses: r.strikingVerses || r.striking_verses || '',
      striking_verses: r.striking_verses || r.strikingVerses || '',
      lessonsLearnt: r.lessonsLearnt || r.lessons_learnt || '',
      lessons_learnt: r.lessons_learnt || r.lessonsLearnt || '',
      actionPlans: r.actionPlans || r.action_plans || '',
      action_plans: r.action_plans || r.actionPlans || '',
      prayers: r.prayers || ''
    }));

    // Combine unique reports by id
    const reportMap = new Map();
    cloudReports.forEach(r => reportMap.set(String(r.id), r));
    userLocalReports.forEach(r => {
      if (!reportMap.has(String(r.id))) {
        reportMap.set(String(r.id), r);
      }
    });

    return Array.from(reportMap.values()).sort(
      (a, b) => new Date(b.created_at || b.submission_date || 0) - new Date(a.created_at || a.submission_date || 0)
    );
  },

  async getStreak() {
    const user = await this.getCurrentUser();
    if (!user) return { current_streak: 0, longest_streak: 0, last_activity_date: null };

    const localStreaks = JSON.parse(localStorage.getItem('slap_streaks') || '{}');
    const localUserStreak = localStreaks[user.id] || { current_streak: 0, longest_streak: 0, last_activity_date: null };

    if (isSupabaseConfigured && supabase && isValidUUID(user.id)) {
      try {
        const { data, error } = await supabase
          .from('user_streaks')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!error && data) {
          return {
            current_streak: Math.max(data.current_streak || 0, localUserStreak.current_streak || 0),
            longest_streak: Math.max(data.longest_streak || 0, localUserStreak.longest_streak || 0),
            last_activity_date: data.last_activity_date || localUserStreak.last_activity_date
          };
        }
      } catch (e) {
        console.warn("Supabase getStreak warning:", e?.message);
      }
    }

    return localUserStreak;
  },

  // --- DECLARATIONS SERVICE ---

  async getPreseededDeclarations() {
    return DEFAULT_DECLARATIONS;
  },

  async saveDeclaration(decl) {
    const user = await this.getCurrentUser();
    const userId = user ? user.id : 'anonymous';

    // If a canvas render or card image is provided, upload to Supabase Storage
    let finalImageUrl = decl.imageUrl || '';
    if (decl.cardDataUrl && isSupabaseConfigured) {
      try {
        finalImageUrl = await this.uploadDeclarationImage(decl.cardDataUrl, userId);
      } catch (err) {
        console.warn("Storage upload failed, fallback to local URL:", err);
      }
    }

    const declarations = JSON.parse(localStorage.getItem('slap_declarations') || '[]');
    const newDecl = {
      id: 'decl-user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 7),
      user_id: userId,
      declaration_text: decl.text,
      scripture_reference: decl.ref,
      background_style: decl.backgroundStyle,
      exported_image_url: finalImageUrl,
      category: decl.category || 'faith',
      created_at: new Date().toISOString()
    };
    declarations.unshift(newDecl);
    localStorage.setItem('slap_declarations', JSON.stringify(declarations));

    if (isSupabaseConfigured && supabase && user && isValidUUID(user.id)) {
      try {
        await supabase
          .from('declarations')
          .insert({
            user_id: userId,
            declaration_text: decl.text,
            scripture_reference: decl.ref,
            background_style: decl.backgroundStyle,
            exported_image_url: finalImageUrl,
            category: decl.category || 'faith'
          });
      } catch (e) {
        console.warn("Supabase declaration insert warning (saved locally):", e?.message);
      }
    }

    return newDecl;
  },

  async getDeclarations() {
    const user = await this.getCurrentUser();
    if (!user) return [];

    let cloudDecls = [];
    if (isSupabaseConfigured && supabase && isValidUUID(user.id)) {
      try {
        const { data, error } = await supabase
          .from('declarations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (!error && data) {
          cloudDecls = data;
        }
      } catch (e) {
        console.warn("Supabase getDeclarations warning:", e?.message);
      }
    }

    const localDecls = JSON.parse(localStorage.getItem('slap_declarations') || '[]');
    const userLocalDecls = localDecls.filter(d => d.user_id === user.id);

    const declMap = new Map();
    cloudDecls.forEach(d => declMap.set(String(d.id), d));
    userLocalDecls.forEach(d => {
      if (!declMap.has(String(d.id))) {
        declMap.set(String(d.id), d);
      }
    });

    return Array.from(declMap.values()).sort(
      (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
    );
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

    const localDeclarations = JSON.parse(localStorage.getItem('slap_declarations') || '[]');
    const localStreaks = JSON.parse(localStorage.getItem('slap_streaks') || '{}');

    if (isSupabaseConfigured && supabase) {
      try {
        const { count } = await supabase
          .from('declarations')
          .select('*', { count: 'exact', head: true });
        totalDeclarations = Math.max(count || 0, localDeclarations.length);
      } catch (e) {
        totalDeclarations = localDeclarations.length;
      }

      try {
        const { data: streakRows } = await supabase
          .from('user_streaks')
          .select('user_id, current_streak, longest_streak, last_activity_date')
          .order('current_streak', { ascending: false })
          .limit(5);

        const streakMap = new Map();
        (streakRows || []).forEach(s => streakMap.set(s.user_id, s));
        Object.entries(localStreaks).forEach(([uid, s]) => {
          if (!streakMap.has(uid) || (s.current_streak > (streakMap.get(uid)?.current_streak || 0))) {
            streakMap.set(uid, { user_id: uid, ...s });
          }
        });
        topStreaks = Array.from(streakMap.values()).sort((a, b) => (b.current_streak || 0) - (a.current_streak || 0)).slice(0, 5);
      } catch (e) {
        topStreaks = Object.values(localStreaks).sort((a, b) => (b.current_streak || 0) - (a.current_streak || 0)).slice(0, 5);
      }
    } else {
      totalDeclarations = localDeclarations.length;
      topStreaks = Object.values(localStreaks)
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

    const localUsers = JSON.parse(localStorage.getItem('slap_users') || '[]');
    const localReports = JSON.parse(localStorage.getItem('slap_reports') || '[]');
    const localStreaks = JSON.parse(localStorage.getItem('slap_streaks') || '{}');

    if (isSupabaseConfigured && supabase) {
      let supabaseProfiles = [];
      let cloudReports = [];
      let streaksArr = [];

      try {
        const [profilesRes, reportsRes, streaksRes] = await Promise.all([
          supabase.from('profiles').select('*').order('created_at', { ascending: false }),
          supabase.from('slap_reports').select('user_id'),
          supabase.from('user_streaks').select('user_id, current_streak, longest_streak, last_activity_date')
        ]);
        supabaseProfiles = profilesRes?.data || [];
        cloudReports = reportsRes?.data || [];
        streaksArr = streaksRes?.data || [];
      } catch (e) {
        console.warn("Supabase getAllUsers warning:", e?.message);
      }

      // Harmonize cloud and local participants into a single consolidated roster
      const combinedUserMap = new Map();
      supabaseProfiles.forEach(p => {
        const k = (p.email || p.id).toLowerCase();
        combinedUserMap.set(k, {
          ...p,
          fullName: p.full_name || '',
          country: p.country || ''
        });
      });
      localUsers.forEach(u => {
        const k = (u.email || u.id).toLowerCase();
        if (!combinedUserMap.has(k)) {
          combinedUserMap.set(k, {
            ...u,
            full_name: u.fullName || u.user_metadata?.full_name || '',
            country: u.country || u.user_metadata?.country || ''
          });
        }
      });

      const users = Array.from(combinedUserMap.values());
      const streaksMap = Object.fromEntries(streaksArr.map(s => [s.user_id, s]));
      const allReports = [...cloudReports, ...localReports];

      const rawUserList = users.map(u => {
        const uEmail = (u.email || '').toLowerCase().trim();
        const userReports = allReports.filter(r => 
          (r.user_id && r.user_id === u.id) ||
          (uEmail && r.userEmail && r.userEmail.toLowerCase().trim() === uEmail)
        );
        const cloudStreak = streaksMap[u.id] || {};
        const localStreak = localStreaks[u.id] || {};
        const curStreak = Math.max(cloudStreak.current_streak || 0, localStreak.current_streak || 0);
        const longStreak = Math.max(cloudStreak.longest_streak || 0, localStreak.longest_streak || 0);
        const lastAct = cloudStreak.last_activity_date || localStreak.last_activity_date || null;

        return {
          ...u,
          totalSubmissions: userReports.length,
          loginCount: u.login_count || 1,
          current_streak: curStreak,
          longest_streak: longStreak,
          last_activity_date: lastAct,
          isAdmin: !!(u.is_admin || u.role === 'admin' || u.email === 'admin@slapbible.org')
        };
      });

      const emailMap = new Map();
      rawUserList.forEach(u => {
        const cleanEmail = (u.email || '').trim().toLowerCase();
        if (!cleanEmail) return;
        if (!emailMap.has(cleanEmail)) {
          emailMap.set(cleanEmail, { ...u, totalLogins: u.loginCount || 1 });
        } else {
          const existing = emailMap.get(cleanEmail);
          existing.totalSubmissions = Math.max(existing.totalSubmissions || 0, u.totalSubmissions || 0);
          existing.totalLogins = (existing.totalLogins || 1) + (u.loginCount || 1);
          existing.current_streak = Math.max(existing.current_streak || 0, u.current_streak || 0);
          existing.longest_streak = Math.max(existing.longest_streak || 0, u.longest_streak || 0);
          existing.isAdmin = existing.isAdmin || u.isAdmin;
          if (u.full_name && !existing.full_name) existing.full_name = u.full_name;
        }
      });
      return Array.from(emailMap.values());
    } else {
      const allReports = localReports;

      const rawUserList = localUsers.map(u => {
        const uEmail = (u.email || '').toLowerCase().trim();
        const userReports = allReports.filter(r => 
          (r.user_id && r.user_id === u.id) ||
          (uEmail && r.userEmail && r.userEmail.toLowerCase().trim() === uEmail)
        );
        const userStreak = localStreaks[u.id] || { current_streak: 0, longest_streak: 0, last_activity_date: null };
        return {
          ...u,
          totalSubmissions: userReports.length,
          loginCount: u.login_count || 1,
          current_streak: userStreak.current_streak || 0,
          longest_streak: userStreak.longest_streak || 0,
          last_activity_date: userStreak.last_activity_date,
          isAdmin: !!(u.is_admin || u.role === 'admin' || u.email === 'admin@slapbible.org')
        };
      });

      const emailMap = new Map();
      rawUserList.forEach(u => {
        const cleanEmail = (u.email || '').trim().toLowerCase();
        if (!cleanEmail) return;
        if (!emailMap.has(cleanEmail)) {
          emailMap.set(cleanEmail, { ...u, totalLogins: u.loginCount || 1 });
        } else {
          const existing = emailMap.get(cleanEmail);
          existing.totalSubmissions = Math.max(existing.totalSubmissions || 0, u.totalSubmissions || 0);
          existing.totalLogins = (existing.totalLogins || 1) + (u.loginCount || 1);
          existing.current_streak = Math.max(existing.current_streak || 0, u.current_streak || 0);
          existing.longest_streak = Math.max(existing.longest_streak || 0, u.longest_streak || 0);
          existing.isAdmin = existing.isAdmin || u.isAdmin;
          if ((u.fullName || u.user_metadata?.full_name) && !existing.fullName) {
            existing.fullName = u.fullName || u.user_metadata?.full_name;
          }
        }
      });
      return Array.from(emailMap.values());
    }
  },

  async getAllReports() {
    const isCurAdmin = await this.isCurrentUserAdmin();
    if (!isCurAdmin) throw new Error("Unauthorized: Admin permissions required");

    let cloudReports = [];
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('slap_reports')
          .select('*, profiles(full_name, email, country)')
          .order('created_at', { ascending: false });

        if (!error && data) {
          cloudReports = data.map(r => ({
            ...r,
            userName: r.profiles?.full_name || 'Participant',
            userEmail: r.profiles?.email || '',
            userCountry: r.profiles?.country || '',
            strikingVerses: r.striking_verses || r.strikingVerses || '',
            striking_verses: r.striking_verses || r.strikingVerses || '',
            lessonsLearnt: r.lessons_learnt || r.lessonsLearnt || '',
            lessons_learnt: r.lessons_learnt || r.lessonsLearnt || '',
            actionPlans: r.action_plans || r.actionPlans || '',
            action_plans: r.action_plans || r.actionPlans || '',
            prayers: r.prayers || ''
          }));
        }
      } catch (e) {
        console.warn("Supabase getAllReports warning:", e?.message);
      }
    }

    const localReports = JSON.parse(localStorage.getItem('slap_reports') || '[]');
    const users = JSON.parse(localStorage.getItem('slap_users') || '[]');
    const formattedLocal = localReports.map(r => {
      const rEmail = (r.userEmail || '').toLowerCase().trim();
      const u = users.find(user => 
        (user.id && user.id === r.user_id) || 
        (rEmail && (user.email || '').toLowerCase().trim() === rEmail)
      );
      return {
        ...r,
        userName: r.userName || u?.user_metadata?.full_name || u?.fullName || 'Participant',
        userEmail: r.userEmail || u?.email || '',
        userCountry: r.userCountry || u?.country || u?.user_metadata?.country || '',
        strikingVerses: r.strikingVerses || r.striking_verses || '',
        striking_verses: r.striking_verses || r.strikingVerses || '',
        lessonsLearnt: r.lessonsLearnt || r.lessons_learnt || '',
        lessons_learnt: r.lessons_learnt || r.lessonsLearnt || '',
        actionPlans: r.actionPlans || r.action_plans || '',
        action_plans: r.action_plans || r.actionPlans || '',
        prayers: r.prayers || ''
      };
    });

    const reportMap = new Map();
    cloudReports.forEach(r => reportMap.set(String(r.id), r));
    formattedLocal.forEach(r => {
      if (!reportMap.has(String(r.id))) {
        reportMap.set(String(r.id), r);
      }
    });

    return Array.from(reportMap.values()).sort(
      (a, b) => new Date(b.created_at || b.submission_date || 0) - new Date(a.created_at || a.submission_date || 0)
    );
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

  async deleteParticipantByAdmin(userEmail, userId) {
    const isCurAdmin = await this.isCurrentUserAdmin();
    if (!isCurAdmin) throw new Error("Unauthorized: Admin permissions required to remove participants");

    const cleanEmail = (userEmail || '').trim().toLowerCase();

    if (isSupabaseConfigured) {
      if (cleanEmail) {
        await supabase.from('profiles').delete().eq('email', cleanEmail);
      }
      if (userId) {
        await supabase.from('profiles').delete().eq('id', userId);
        await supabase.from('slap_reports').delete().eq('user_id', userId);
        await supabase.from('user_streaks').delete().eq('user_id', userId);
      }
      return true;
    } else {
      let users = JSON.parse(localStorage.getItem('slap_users') || '[]');
      let reports = JSON.parse(localStorage.getItem('slap_reports') || '[]');
      let streaks = JSON.parse(localStorage.getItem('slap_streaks') || '{}');

      const targetUserIds = new Set();
      if (userId) targetUserIds.add(userId);
      users.filter(u => (u.email || '').trim().toLowerCase() === cleanEmail).forEach(u => targetUserIds.add(u.id));

      users = users.filter(u => !targetUserIds.has(u.id) && (u.email || '').trim().toLowerCase() !== cleanEmail);
      reports = reports.filter(r => !targetUserIds.has(r.user_id));
      targetUserIds.forEach(id => { delete streaks[id]; });

      localStorage.setItem('slap_users', JSON.stringify(users));
      localStorage.setItem('slap_reports', JSON.stringify(reports));
      localStorage.setItem('slap_streaks', JSON.stringify(streaks));
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('slap_stats_updated'));
      return true;
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
      const videos = JSON.parse(localStorage.getItem('slap_videos') || '[]');
      return videos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
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
