-- =========================================================================
-- SLAP BIBLE PATTERN CHALLENGE — LEAD ADMINISTRATOR PROVISIONING SCRIPT
-- Official Lead Admin Email: slapbiblechallenge@gmail.com
-- =========================================================================

-- 1. Update is_admin() helper to grant Lead Admin full administrative authorization
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND (is_admin = TRUE OR role = 'admin' OR role = 'super_admin' OR role = 'lead_admin')
    ) OR (
        COALESCE(auth.jwt() ->> 'email', '') = 'slapbiblechallenge@gmail.com'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Elevate slapbiblechallenge@gmail.com in public.profiles to highest administrative role (Super Admin)
UPDATE public.profiles
SET 
    is_admin = TRUE,
    role = 'super_admin',
    full_name = 'Lead Administrator',
    updated_at = NOW()
WHERE email = 'slapbiblechallenge@gmail.com';

-- 3. Migrate any legacy admin@slapbible.org profile to slapbiblechallenge@gmail.com if no profile exists yet
UPDATE public.profiles
SET 
    email = 'slapbiblechallenge@gmail.com',
    is_admin = TRUE,
    role = 'super_admin',
    full_name = 'Lead Administrator',
    updated_at = NOW()
WHERE email = 'admin@slapbible.org'
AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE email = 'slapbiblechallenge@gmail.com');

-- 4. Eliminate duplicate legacy admin@slapbible.org if slapbiblechallenge@gmail.com already exists
DELETE FROM public.profiles 
WHERE email = 'admin@slapbible.org' 
AND EXISTS (SELECT 1 FROM public.profiles WHERE email = 'slapbiblechallenge@gmail.com');

-- 5. Security Trigger: Prevent ordinary participants or sub-admins from revoking Lead Admin privileges
CREATE OR REPLACE FUNCTION public.protect_lead_admin()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.email = 'slapbiblechallenge@gmail.com' AND (NEW.is_admin = FALSE OR NEW.role NOT IN ('super_admin', 'lead_admin')) THEN
        RAISE EXCEPTION 'Action Prohibited: The Lead Administrator privileges cannot be revoked or downgraded.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_protect_lead_admin ON public.profiles;
CREATE TRIGGER trg_protect_lead_admin
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.protect_lead_admin();
