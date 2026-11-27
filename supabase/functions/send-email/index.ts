// =========================================================================
// SLAP BIBLE PATTERN CHALLENGE — SUPABASE EDGE FUNCTION: SEND-EMAIL
// Automated, Secure Transactional Email Delivery with Resend
// =========================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { getWelcomeEmailHtml, getLoginEmailHtml } from './templates.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

interface RequestPayload {
  type: 'welcome' | 'login';
  timestamp?: string;
  appUrl?: string;
}

// Helper to validate email format
function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

Deno.serve(async (req: Request) => {
  // 1. Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed. Use POST.' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    );
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  const resendApiKey = Deno.env.get('RESEND_API_KEY') || '';
  const resendFromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'SLAP Bible Challenge <onboarding@resend.dev>';
  const defaultAppUrl = Deno.env.get('APP_URL') || 'https://slapbiblepattern.org';

  // 2. Validate Resend Configuration
  if (!resendApiKey) {
    console.warn('[SLAP Email] RESEND_API_KEY secret is not configured in Supabase Edge Functions.');
    return new Response(
      JSON.stringify({
        success: false,
        configured: false,
        error: 'RESEND_API_KEY is not configured in Supabase Edge Function secrets.',
        message: 'To enable automated email delivery, please set RESEND_API_KEY in your Supabase dashboard under Edge Functions > Secrets.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }

  // 3. Authenticate Caller Session (Server-Side Security Check)
  const authHeader = req.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized: Missing or invalid Authorization header.' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
    );
  }

  const token = authHeader.replace('Bearer ', '').trim();

  // Initialize clients: one to verify user token, one with service role for database updates
  const supabaseAuthClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false }
  });

  const { data: { user }, error: authError } = await supabaseAuthClient.auth.getUser(token);

  if (authError || !user) {
    console.warn('[SLAP Email] Auth token verification failed:', authError?.message);
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized: Session is invalid or expired.' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
    );
  }

  const userId = user.id;
  const recipientEmail = (user.email || '').trim().toLowerCase();

  if (!isValidEmail(recipientEmail)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid recipient email address on authenticated account.' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }

  // 4. Initialize Admin Client for Secure Database Lookups & Updates
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
    auth: { persistSession: false }
  });

  // Parse Payload
  let payload: RequestPayload;
  try {
    payload = await req.json();
  } catch (_e) {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid JSON request body.' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }

  const emailType = payload.type;
  if (emailType !== 'welcome' && emailType !== 'login') {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid email type. Supported types: welcome, login.' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }

  const appUrl = (payload.appUrl || defaultAppUrl).replace(/\/$/, '');

  // 5. Retrieve Participant Profile from Database
  const { data: profile, error: profileErr } = await supabaseAdmin
    .from('profiles')
    .select('full_name, login_notifications_enabled, welcome_email_sent_at')
    .eq('id', userId)
    .maybeSingle();

  if (profileErr) {
    console.warn('[SLAP Email] Profile lookup warning:', profileErr.message);
  }

  const participantName = (
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    'Beloved Participant'
  ).trim();

  // =========================================================================
  // CASE 1: WELCOME EMAIL ON REGISTRATION
  // =========================================================================
  if (emailType === 'welcome') {
    // Check Idempotency: Prevent duplicate welcome emails even during retries
    if (profile?.welcome_email_sent_at) {
      console.info(`[SLAP Email] Welcome email already sent for user ${userId} at ${profile.welcome_email_sent_at}. Skipping.`);
      return new Response(
        JSON.stringify({
          success: true,
          skipped: true,
          message: 'Welcome email has already been sent to this participant.',
          sent_at: profile.welcome_email_sent_at
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const htmlContent = getWelcomeEmailHtml({
      name: participantName,
      email: recipientEmail,
      appUrl
    });

    try {
      // Send via Resend REST API
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: resendFromEmail,
          to: [recipientEmail],
          subject: `Welcome to the SLAP Bible Challenge, ${participantName}! 📖✨`,
          html: htmlContent
        })
      });

      const resendData = await resendRes.json();

      if (!resendRes.ok) {
        console.error('[SLAP Email] Resend API error on welcome email:', resendData);
        // Log failure in database
        await supabaseAdmin.from('email_logs').insert({
          user_id: userId,
          email: recipientEmail,
          email_type: 'welcome',
          status: 'failed',
          error_message: resendData.message || JSON.stringify(resendData),
          metadata: { resend_response: resendData }
        }).catch((e: Error) => console.warn('[SLAP Email] Logging error:', e.message));

        return new Response(
          JSON.stringify({ success: false, error: resendData.message || 'Resend delivery failed' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      // Mark welcome email sent in profiles table to guarantee strictly-once delivery
      const sentTimestamp = new Date().toISOString();
      await supabaseAdmin
        .from('profiles')
        .update({ welcome_email_sent_at: sentTimestamp })
        .eq('id', userId)
        .catch((e: Error) => console.warn('[SLAP Email] Failed to update welcome_email_sent_at:', e.message));

      // Record successful delivery in email_logs
      await supabaseAdmin.from('email_logs').insert({
        user_id: userId,
        email: recipientEmail,
        email_type: 'welcome',
        status: 'sent',
        resend_id: resendData.id,
        metadata: { resend_id: resendData.id, sent_at: sentTimestamp }
      }).catch((e: Error) => console.warn('[SLAP Email] Logging error:', e.message));

      console.info(`[SLAP Email] Welcome email successfully sent to ${recipientEmail} (ID: ${resendData.id})`);
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Welcome email sent successfully.',
          id: resendData.id
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown network error';
      console.error('[SLAP Email] Exception during welcome email delivery:', errorMsg);
      return new Response(
        JSON.stringify({ success: false, error: errorMsg }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }
  }

  // =========================================================================
  // CASE 2: LOGIN NOTIFICATION EMAIL
  // =========================================================================
  if (emailType === 'login') {
    // Check participant preference: enable/disable routine login notifications
    const isLoginNotificationEnabled = Boolean(profile?.login_notifications_enabled);

    if (!isLoginNotificationEnabled) {
      console.info(`[SLAP Email] Login email skipped: User ${userId} has routine login notifications disabled.`);
      // Record skipped log for audit tracking
      await supabaseAdmin.from('email_logs').insert({
        user_id: userId,
        email: recipientEmail,
        email_type: 'login',
        status: 'skipped',
        metadata: { reason: 'notifications_disabled_by_user' }
      }).catch(() => {});

      return new Response(
        JSON.stringify({
          success: true,
          skipped: true,
          message: 'Login email notification skipped: preference is disabled by participant.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const loginTimestamp = payload.timestamp
      ? new Date(payload.timestamp).toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short'
        })
      : new Date().toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short'
        });

    const htmlContent = getLoginEmailHtml({
      name: participantName,
      email: recipientEmail,
      loginTime: loginTimestamp,
      appUrl
    });

    try {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: resendFromEmail,
          to: [recipientEmail],
          subject: `Successful Login Notification — SLAP Bible Challenge`,
          html: htmlContent
        })
      });

      const resendData = await resendRes.json();

      if (!resendRes.ok) {
        console.error('[SLAP Email] Resend API error on login email:', resendData);
        await supabaseAdmin.from('email_logs').insert({
          user_id: userId,
          email: recipientEmail,
          email_type: 'login',
          status: 'failed',
          error_message: resendData.message || JSON.stringify(resendData),
          metadata: { resend_response: resendData }
        }).catch(() => {});

        return new Response(
          JSON.stringify({ success: false, error: resendData.message || 'Resend login delivery failed' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      await supabaseAdmin.from('email_logs').insert({
        user_id: userId,
        email: recipientEmail,
        email_type: 'login',
        status: 'sent',
        resend_id: resendData.id,
        metadata: { resend_id: resendData.id, timestamp: loginTimestamp }
      }).catch(() => {});

      console.info(`[SLAP Email] Login notification successfully sent to ${recipientEmail} (ID: ${resendData.id})`);
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Login notification sent successfully.',
          id: resendData.id
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown network error';
      console.error('[SLAP Email] Exception during login email delivery:', errorMsg);
      return new Response(
        JSON.stringify({ success: false, error: errorMsg }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }
  }

  return new Response(
    JSON.stringify({ success: false, error: 'Unhandled request' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
  );
});
