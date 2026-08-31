import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Detect if supabase credentials are real and valid
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseUrl.trim() !== '' &&
  supabaseUrl !== 'YOUR_SUPABASE_URL' && 
  supabaseAnonKey && 
  supabaseAnonKey.trim() !== '' &&
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY'
);

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
    return { connected: false, mode: 'demo_local_storage', message: 'Running in local fallback mode. Configure VITE_SUPABASE_URL in .env for production cloud storage.' };
  }
  try {
    const { error } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
    if (error) throw error;
    return { connected: true, mode: 'supabase_cloud', message: 'Successfully connected to Supabase Database & Storage.' };
  } catch (err) {
    return { connected: false, mode: 'error', error: err.message };
  }
};
