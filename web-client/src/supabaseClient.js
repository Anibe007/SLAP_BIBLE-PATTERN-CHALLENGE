import { createClient } from '@supabase/supabase-js';

// Read from environment variables or persistent browser storage (configured via Admin Dashboard)
const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('slap_supabase_url') || '' : '';
const storedAnonKey = typeof window !== 'undefined' ? localStorage.getItem('slap_supabase_anon_key') || '' : '';

const rawUrl = (
  import.meta.env?.VITE_SUPABASE_URL ||
  (typeof process !== 'undefined' && (process.env?.VITE_SUPABASE_URL || process.env?.SUPABASE_URL)) ||
  storedUrl ||
  ''
).trim();

const rawAnonKey = (
  import.meta.env?.VITE_SUPABASE_ANON_KEY ||
  (typeof process !== 'undefined' && (process.env?.VITE_SUPABASE_ANON_KEY || process.env?.SUPABASE_ANON_KEY)) ||
  storedAnonKey ||
  ''
).trim();

// Detect if supabase credentials are real and valid
// Valid anon keys are JWTs and always start with 'eyJ'
export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawUrl !== 'YOUR_SUPABASE_URL' &&
  !rawUrl.includes('your-project-id') &&
  !rawUrl.includes('your-supabase-project-id') &&
  rawAnonKey &&
  rawAnonKey !== 'YOUR_SUPABASE_ANON_KEY' &&
  rawAnonKey !== 'your-supabase-anon-key-here' &&
  rawAnonKey.startsWith('eyJ') &&        // All valid Supabase JWTs start with eyJ
  !rawAnonKey.startsWith('sb_publishable_') // Reject legacy/wrong key format
);

export const currentSupabaseUrl = isSupabaseConfigured ? rawUrl : '';

if (!isSupabaseConfigured) {
  console.info(
    '%c[SLAP Bible] Running in local fallback mode.\n' +
    'To enable multi-device cloud sync, configure your Supabase URL & Anon Key via the Admin Dashboard or in web-client/.env',
    'color: #b8860b; font-weight: bold;'
  );
}

// Single Supabase Client instance configured with auto-refresh and persistent session storage
export const supabase = isSupabaseConfigured
  ? createClient(rawUrl, rawAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage
    }
  })
  : null;

// Storage Buckets constants
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  DECLARATIONS: 'declarations',
  MEDIA: 'media_uploads'
};

// Diagnostics helper to verify Supabase connectivity
export const testSupabaseConnection = async (customUrl = null, customKey = null) => {
  const urlToTest = customUrl || rawUrl;
  const keyToTest = customKey || rawAnonKey;

  if (!urlToTest || !keyToTest) {
    return {
      connected: false,
      mode: 'demo_local_storage',
      message: 'Supabase credentials are not configured.'
    };
  }

  try {
    const testClient = createClient(urlToTest, keyToTest, {
      auth: { persistSession: false }
    });
    const { data, error } = await testClient.from('profiles').select('id').limit(1);
    if (error) {
      if (
        error.code === 'PGRST205' ||
        error.code === '42P01' ||
        error.message?.includes('schema cache') ||
        error.message?.includes('does not exist')
      ) {
        return {
          connected: false,
          needsSchema: true,
          mode: 'missing_tables',
          message: 'Connected to Supabase project, but the database tables (public.profiles) have not been created yet! Please copy and run supabase_schema.sql in your Supabase SQL Editor.'
        };
      }
      throw error;
    }
    return { connected: true, mode: 'supabase_cloud', message: 'Successfully connected to Supabase Cloud Database.' };
  } catch (err) {
    return { connected: false, mode: 'error', error: err.message || 'Connection failed' };
  }
};

// Save credentials directly from Admin UI (enables cloud sync across all devices)
export const saveSupabaseCredentials = (url, anonKey) => {
  if (url && anonKey) {
    localStorage.setItem('slap_supabase_url', url.trim());
    localStorage.setItem('slap_supabase_anon_key', anonKey.trim());
  } else {
    localStorage.removeItem('slap_supabase_url');
    localStorage.removeItem('slap_supabase_anon_key');
  }
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
};

// Clear credentials to revert to demo fallback
export const clearSupabaseCredentials = () => {
  localStorage.removeItem('slap_supabase_url');
  localStorage.removeItem('slap_supabase_anon_key');
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
};
