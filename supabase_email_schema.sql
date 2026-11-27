-- =========================================================================
-- SLAP BIBLE PATTERN CHALLENGE — AUTOMATED EMAIL NOTIFICATION SYSTEM MIGRATION
-- Adds:
-- 1. login_notifications_enabled & welcome_email_sent_at to public.profiles
-- 2. public.email_logs table with indexes and Row-Level Security (RLS)
-- 3. Automatic provisioning trigger updates
-- =========================================================================

-- 1. Add notification preference and welcome delivery timestamp to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS login_notifications_enabled BOOLEAN DEFAULT FALSE;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS welcome_email_sent_at TIMESTAMPTZ DEFAULT NULL;

-- 2. Create email_logs table for audit tracking & duplicate prevention
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    email_type TEXT NOT NULL, -- 'welcome', 'login'
    status TEXT NOT NULL,     -- 'sent', 'failed', 'skipped'
    resend_id TEXT,
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast queries and delivery status lookups
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON public.email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_email ON public.email_logs(email);
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON public.email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON public.email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON public.email_logs(created_at DESC);

-- Enable Row Level Security (RLS) on email_logs
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- 3. Row Level Security Policies for email_logs
DROP POLICY IF EXISTS "Users can view their own email logs" ON public.email_logs;
CREATE POLICY "Users can view their own email logs"
ON public.email_logs FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view and manage all email logs" ON public.email_logs;
CREATE POLICY "Admins can view and manage all email logs"
ON public.email_logs FOR ALL
USING (public.is_admin());

-- 4. Update the handle_new_user() trigger to preserve notification preferences
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- 1. Create Profile Row
    INSERT INTO public.profiles (
        id, 
        email, 
        full_name, 
        avatar_url, 
        country, 
        is_admin, 
        role, 
        login_notifications_enabled,
        welcome_email_sent_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Participant'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
        COALESCE(NEW.raw_user_meta_data->>'country', ''),
        COALESCE((NEW.raw_user_meta_data->>'is_admin')::boolean, FALSE),
        COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
        COALESCE((NEW.raw_user_meta_data->>'login_notifications_enabled')::boolean, FALSE),
        NULL
    )
    ON CONFLICT (id) DO UPDATE 
    SET 
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
        updated_at = NOW();

    -- 2. Initialize User Streak
    INSERT INTO public.user_streaks (user_id, current_streak, longest_streak, last_activity_date)
    VALUES (NEW.id, 0, 0, NULL)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
