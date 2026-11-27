// =========================================================================
// SLAP BIBLE PATTERN CHALLENGE — EMAIL NOTIFICATION SERVICE
// Automated Supabase Edge Functions & Resend Transactional Email Integrator
// =========================================================================

import { supabase, isSupabaseConfigured } from '../supabaseClient';

class EmailNotificationService {
  /**
   * Helper to safely get the active application URL (browser origin or default)
   */
  getAppUrl() {
    if (typeof window !== 'undefined' && window.location?.origin) {
      return window.location.origin;
    }
    return import.meta.env?.VITE_APP_URL || 'https://slapbiblepattern.org';
  }

  /**
   * 1. TRIGGER WELCOME EMAIL ON REGISTRATION
   * Invokes the Supabase Edge Function 'send-email' with type: 'welcome'.
   * Edge Function verifies the JWT, checks if already sent, renders the template,
   * sends via Resend, updates profiles.welcome_email_sent_at, and logs in email_logs.
   *
   * Guaranteed: Never throws an error that would interrupt participant registration.
   */
  async triggerWelcomeEmail(user) {
    if (!user || (!user.email && !user.id)) {
      console.warn('[SLAP Email] Cannot send welcome email: missing user object.');
      return { success: false, reason: 'missing_user' };
    }

    const cleanEmail = (user.email || '').trim().toLowerCase();
    const userId = user.id || user.uid;

    console.info(`[SLAP Email] Initiating welcome email trigger for: ${cleanEmail}`);

    // If Supabase is configured, invoke the secure server-side Edge Function
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.functions.invoke('send-email', {
          body: {
            type: 'welcome',
            appUrl: this.getAppUrl()
          }
        });

        if (error) {
          console.warn('[SLAP Email] Supabase Edge Function notice on welcome email:', error.message || error);
          this.logLocalEmail({
            userId,
            email: cleanEmail,
            type: 'welcome',
            status: 'pending_edge_function',
            error: error.message || 'Edge function unavailable'
          });
          return { success: false, error: error.message };
        }

        if (data?.skipped) {
          console.info('[SLAP Email] Welcome email skipped (already sent previously):', data.message);
          return { success: true, skipped: true };
        }

        if (data?.success) {
          console.info('[SLAP Email] Welcome email successfully dispatched via Resend. ID:', data.id);
          this.logLocalEmail({
            userId,
            email: cleanEmail,
            type: 'welcome',
            status: 'sent',
            resendId: data.id
          });
          return { success: true, id: data.id };
        } else {
          console.warn('[SLAP Email] Edge function returned status:', data?.error || data?.message);
          return { success: false, message: data?.message || data?.error };
        }
      } catch (err) {
        // Non-blocking: registration must never fail due to email notification network glitches
        console.warn('[SLAP Email] Non-blocking exception during welcome email invoke:', err?.message || err);
        return { success: false, error: err?.message };
      }
    } else {
      // Offline / Local Development Fallback mode
      console.info(`[SLAP Email] Local mode: Welcome email recorded for ${cleanEmail} (Supabase Cloud not active)`);
      this.logLocalEmail({
        userId,
        email: cleanEmail,
        type: 'welcome',
        status: 'simulated_local',
        metadata: { name: user.fullName || user.full_name || 'Participant' }
      });
      return { success: true, local: true };
    }
  }

  /**
   * 2. TRIGGER LOGIN NOTIFICATION EMAIL
   * Invokes the Supabase Edge Function 'send-email' with type: 'login'.
   * Only sends if participant has login notifications enabled.
   *
   * Guaranteed: Never throws an error that would interrupt participant login.
   */
  async triggerLoginNotification(user) {
    if (!user || (!user.email && !user.id)) {
      return { success: false, reason: 'missing_user' };
    }

    const cleanEmail = (user.email || '').trim().toLowerCase();
    const userId = user.id || user.uid;

    console.info(`[SLAP Email] Checking login notification for: ${cleanEmail}`);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.functions.invoke('send-email', {
          body: {
            type: 'login',
            timestamp: new Date().toISOString(),
            appUrl: this.getAppUrl()
          }
        });

        if (error) {
          console.warn('[SLAP Email] Supabase Edge Function notice on login notification:', error.message || error);
          return { success: false, error: error.message };
        }

        if (data?.skipped) {
          console.info('[SLAP Email] Routine login notification skipped per user preferences or default settings.');
          return { success: true, skipped: true };
        }

        if (data?.success) {
          console.info('[SLAP Email] Login notification successfully dispatched via Resend. ID:', data.id);
          this.logLocalEmail({
            userId,
            email: cleanEmail,
            type: 'login',
            status: 'sent',
            resendId: data.id
          });
          return { success: true, id: data.id };
        }

        return { success: false, message: data?.message || data?.error };
      } catch (err) {
        console.warn('[SLAP Email] Non-blocking exception during login email invoke:', err?.message || err);
        return { success: false, error: err?.message };
      }
    } else {
      // Local check
      const enabled = this.getLocalPreference(userId);
      if (enabled) {
        console.info(`[SLAP Email] Local mode: Login notification recorded for ${cleanEmail}`);
        this.logLocalEmail({
          userId,
          email: cleanEmail,
          type: 'login',
          status: 'simulated_local'
        });
      }
      return { success: true, local: true };
    }
  }

  /**
   * 3. MANAGE LOGIN NOTIFICATION PREFERENCES
   * Toggles whether the participant receives an email on every successful login.
   */
  async setLoginNotificationsEnabled(userId, enabled) {
    if (!userId) return false;

    // Save in browser localStorage for instant UI feedback
    this.setLocalPreference(userId, enabled);

    // Save in Supabase profiles table
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            login_notifications_enabled: Boolean(enabled),
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (error) {
          console.warn('[SLAP Email] Could not update login notification setting in Supabase:', error.message);
        }
      } catch (e) {
        console.warn('[SLAP Email] Supabase notification preference error:', e);
      }
    }

    // Update active user object in localStorage
    try {
      const stored = localStorage.getItem('slap_current_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.id === userId) {
          parsed.login_notifications_enabled = Boolean(enabled);
          localStorage.setItem('slap_current_user', JSON.stringify(parsed));
        }
      }
    } catch (_e) {}

    // Dispatch global auth event so all UI components update synchronously
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('slap_auth_updated', { detail: { login_notifications_enabled: enabled } }));
    }

    return true;
  }

  /**
   * Check participant's current login notification preference
   */
  async getLoginNotificationsEnabled(userId) {
    if (!userId) return false;

    // Check Supabase Cloud first if available
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('login_notifications_enabled')
          .eq('id', userId)
          .maybeSingle();

        if (!error && data !== null && typeof data?.login_notifications_enabled === 'boolean') {
          this.setLocalPreference(userId, data.login_notifications_enabled);
          return data.login_notifications_enabled;
        }
      } catch (_e) {}
    }

    return this.getLocalPreference(userId);
  }

  // --- Local Storage Helpers for Resilient Offline / Fallback Support ---

  getLocalPreference(userId) {
    if (typeof window === 'undefined') return false;
    try {
      const stored = localStorage.getItem(`slap_login_notif_${userId}`);
      if (stored !== null) return stored === 'true';
      const currentUser = JSON.parse(localStorage.getItem('slap_current_user') || 'null');
      if (currentUser?.id === userId && typeof currentUser.login_notifications_enabled === 'boolean') {
        return currentUser.login_notifications_enabled;
      }
    } catch (_e) {}
    return false;
  }

  setLocalPreference(userId, enabled) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`slap_login_notif_${userId}`, String(Boolean(enabled)));
    } catch (_e) {}
  }

  logLocalEmail(logEntry) {
    if (typeof window === 'undefined') return;
    try {
      const logs = JSON.parse(localStorage.getItem('slap_email_logs') || '[]');
      logs.unshift({
        id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        created_at: new Date().toISOString(),
        ...logEntry
      });
      // Keep last 100 entries
      localStorage.setItem('slap_email_logs', JSON.stringify(logs.slice(0, 100)));
    } catch (_e) {}
  }

  /**
   * Retrieve email logs (from Supabase or local storage)
   */
  async getEmailLogs(userId = null) {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('email_logs').select('*').order('created_at', { ascending: false }).limit(50);
        if (userId) {
          query = query.eq('user_id', userId);
        }
        const { data, error } = await query;
        if (!error && data) return data;
      } catch (_e) {}
    }

    try {
      const logs = JSON.parse(localStorage.getItem('slap_email_logs') || '[]');
      if (userId) {
        return logs.filter(l => l.userId === userId);
      }
      return logs;
    } catch (_e) {
      return [];
    }
  }
}

export const emailNotificationService = new EmailNotificationService();
export default emailNotificationService;
