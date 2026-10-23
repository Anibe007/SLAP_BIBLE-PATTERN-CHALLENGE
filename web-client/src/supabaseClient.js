import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Detect if supabase credentials are real and valid
// Valid anon keys are JWTs and always start with 'eyJ'
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl.trim() !== '' &&
  supabaseUrl !== 'YOUR_SUPABASE_URL' &&
  !supabaseUrl.includes('your-project-id') &&
  supabaseAnonKey &&
  supabaseAnonKey.trim() !== '' &&
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' &&
  supabaseAnonKey.startsWith('eyJ') &&        // All valid Supabase JWTs start with eyJ
  !supabaseAnonKey.startsWith('sb_publishable_') // Reject legacy/wrong key format
);

if (!isSupabaseConfigured) {
  console.info(
    '%c[SLAP Bible] Running in local fallback mode.\n' +
    'To enable cloud sync, create a Supabase project at https://supabase.com\n' +
    'and add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (starting with eyJ) to web-client/.env',
    'color: #b8860b; font-weight: bold;'
  );
}

// Single Supabase Client instance configured with auto-refresh and persistent session storage
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
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
export const testSupabaseConnection = async () => {
  if (!isSupabaseConfigured || !supabase) {
    return {
      connected: false,
      mode: 'demo_local_storage',
      message: 'Running in local fallback mode. Follow the Supabase Setup Guide to enable cloud storage.'
    };
  }
  try {
    const { error } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
    if (error) throw error;
    return { connected: true, mode: 'supabase_cloud', message: 'Successfully connected to Supabase.' };
  } catch (err) {
    return { connected: false, mode: 'error', error: err.message };
  }
};
