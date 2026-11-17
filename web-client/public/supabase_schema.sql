-- =========================================================================
-- SLAP BIBLE PATTERN CHALLENGE — SUPABASE PRODUCTION DATABASE SCHEMA
-- Handles unlimited users, daily devotional reports, streaks, declarations,
-- video library, and cloud storage buckets with Row-Level Security (RLS).
-- =========================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. PROFILES TABLE (Linked directly to Supabase auth.users)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    country TEXT DEFAULT '',
    is_admin BOOLEAN DEFAULT FALSE,
    role TEXT DEFAULT 'user', -- 'user', 'admin', 'super_admin'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user search and admin lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles" 
ON public.profiles FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND (is_admin = TRUE OR role = 'admin')
    )
);

-- -------------------------------------------------------------------------
-- 2. SLAP DEVOTIONAL REPORTS TABLE (Daily Bible Pattern Submissions)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.slap_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    book TEXT NOT NULL,
    chapter INTEGER NOT NULL,
    verses TEXT,
    translation TEXT DEFAULT 'KJV',
    striking_verses TEXT NOT NULL,
    lessons_learnt TEXT NOT NULL,
    action_plans TEXT NOT NULL,
    prayers TEXT NOT NULL,
    submission_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast queries across unlimited submissions
CREATE INDEX IF NOT EXISTS idx_slap_reports_user_id ON public.slap_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_slap_reports_submission_date ON public.slap_reports(submission_date DESC);
CREATE INDEX IF NOT EXISTS idx_slap_reports_user_date ON public.slap_reports(user_id, submission_date DESC);

-- Enable RLS on slap_reports
ALTER TABLE public.slap_reports ENABLE ROW LEVEL SECURITY;

-- Slap Reports Policies
CREATE POLICY "Users can view their own reports" 
ON public.slap_reports FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reports" 
ON public.slap_reports FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports" 
ON public.slap_reports FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reports" 
ON public.slap_reports FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view and manage all reports" 
ON public.slap_reports FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND (is_admin = TRUE OR role = 'admin')
    )
);

-- -------------------------------------------------------------------------
-- 3. USER STREAKS TABLE (Tracks daily streaks & consistency)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_streaks_user_id ON public.user_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_streaks_current_streak ON public.user_streaks(current_streak DESC);

-- Enable RLS on user_streaks
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

-- Streaks Policies
CREATE POLICY "Users can view their own streak" 
ON public.user_streaks FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert their own streak" 
ON public.user_streaks FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all streaks for leaderboard" 
ON public.user_streaks FOR SELECT 
USING (true);

-- -------------------------------------------------------------------------
-- 4. SCRIPTURE DECLARATIONS TABLE (Proclamations & Custom Cards)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.declarations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    declaration_text TEXT NOT NULL,
    scripture_reference TEXT NOT NULL,
    background_style TEXT DEFAULT 'gilded-obsidian',
    exported_image_url TEXT,
    category TEXT DEFAULT 'faith',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_declarations_user_id ON public.declarations(user_id);
CREATE INDEX IF NOT EXISTS idx_declarations_category ON public.declarations(category);
CREATE INDEX IF NOT EXISTS idx_declarations_created_at ON public.declarations(created_at DESC);

-- Enable RLS on declarations
ALTER TABLE public.declarations ENABLE ROW LEVEL SECURITY;

-- Declarations Policies
CREATE POLICY "Public declarations are viewable by all" 
ON public.declarations FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert declarations" 
ON public.declarations FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own declarations" 
ON public.declarations FOR DELETE 
USING (auth.uid() = user_id);

-- -------------------------------------------------------------------------
-- 5. VIDEO LIBRARY TABLE (Discipleship & Devotional Videos)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'Bible Study',
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_videos_category ON public.videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON public.videos(created_at DESC);

-- Enable RLS on videos
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Videos are viewable by everyone" 
ON public.videos FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users or admins can upload videos" 
ON public.videos FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update or delete videos" 
ON public.videos FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND (is_admin = TRUE OR role = 'admin')
    )
);

-- -------------------------------------------------------------------------
-- 6. AUTOMATED USER PROVISIONING TRIGGER (auth.users -> profiles & streaks)
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- 1. Create Profile Row
    INSERT INTO public.profiles (id, email, full_name, avatar_url, country, is_admin, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Participant'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
        COALESCE(NEW.raw_user_meta_data->>'country', ''),
        COALESCE((NEW.raw_user_meta_data->>'is_admin')::boolean, FALSE),
        COALESCE(NEW.raw_user_meta_data->>'role', 'user')
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

-- Trigger execution whenever a user registers in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -------------------------------------------------------------------------
-- 7. SUPABASE STORAGE BUCKETS CONFIGURATION (Avatars, Cards, Media)
-- -------------------------------------------------------------------------
-- Insert storage buckets (if not already existing)
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('avatars', 'avatars', true),
    ('declarations', 'declarations', true),
    ('media_uploads', 'media_uploads', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies for Avatars
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatar images" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update or delete their own avatars" 
ON storage.objects FOR UPDATE 
USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage Policies for Declaration Cards
CREATE POLICY "Declaration card images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'declarations');

CREATE POLICY "Users can upload declaration card renders" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'declarations' 
    AND auth.role() = 'authenticated'
);

-- Storage Policies for Media Uploads
CREATE POLICY "Media uploads are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'media_uploads');

CREATE POLICY "Authenticated users can upload media" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'media_uploads' 
    AND auth.role() = 'authenticated'
);
