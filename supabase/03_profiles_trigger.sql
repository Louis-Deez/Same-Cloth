-- ============================================================
--  THE SAME CLOTH — PROFILES, SIGNUP TRIGGER, ACCESS RULES
--  (03_profiles_trigger.sql)   Run AFTER 01 and 02.
--
--  This file CHANGES user_profile from 01_schema.sql. Read both.
--
--  Quoted definitions are verbatim from the Supabase docs:
--    [T] supabase.com/docs/guides/database/postgres/triggers
--    [F] supabase.com/docs/guides/database/functions
--    [R] supabase.com/docs/guides/database/postgres/row-level-security
-- ============================================================
--
--  [T] "a trigger executes a set of actions automatically on table events such as INSERTs, UPDATEs, DELETEs, or TRUNCATE operations."
--
--  WHY TWO PROFILE TABLES
--  RLS works per row, not per column, so one table can't be half public and half private.
--    public_profile → handle, display name, bio
--    user_profile   → legal name, date of birth, country, gender
-- ============================================================

-- 1 ----------------------------------------------------------
-- user_profile is private
-- The public fields move out to public_profile, so each field has one home
ALTER TABLE public.user_profile
    DROP COLUMN IF EXISTS handle,
    DROP COLUMN IF EXISTS display_name,
    DROP COLUMN IF EXISTS bio;

-- 2 ----------------------------------------------------------
-- public_profile — what other signed-in users can see
-- Same user_id as the login account, so both profile rows and the login share one ID
CREATE TABLE IF NOT EXISTS public.public_profile (
    user_id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    handle          TEXT UNIQUE,
    display_name    TEXT,
    bio             TEXT
);

-- 3 ----------------------------------------------------------
-- enable RLS on both tables
-- [R] "Postgres Row Level Security (RLS) gives you granular authorization rules that run inside the database."
-- With RLS on and no policies, nobody can read or write anything. Policies come in section 6.
ALTER TABLE public.user_profile   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_profile ENABLE ROW LEVEL SECURITY;

-- 4 ----------------------------------------------------------
-- THE FUNCTION — makes the private and public profile rows when someone signs up
-- [F] "Postgres runs a function either as the user calling it (invoker) or as its creator (definer)."
--     SECURITY DEFINER lets it write the profile rows even though RLS would block the user
-- [F] "When you use security definer, you must set the search_path."
-- [T] NEW — "A record variable holding the new row's data in UPDATE and INSERT triggers."
--     Here, NEW is the row just added to or changed in auth.users
-- ->> pulls one field out of the sign-in provider's JSON as text
-- COALESCE takes the first value that isn't null. NULLIF(TRIM(x), '') turns blank text into null
-- SPLIT_PART is the fallback: first and second word of the full name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE

    full_name_value     TEXT;
    display_name_value  TEXT;
    first_name_value    TEXT;
    last_name_value     TEXT;

BEGIN

    full_name_value := NULLIF(
        TRIM(
            COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name')
        ),
        ''
    );

    display_name_value := full_name_value;

    first_name_value := COALESCE(
        NULLIF(TRIM(NEW.raw_user_meta_data ->> 'given_name'), ''),
        NULLIF(TRIM(NEW.raw_user_meta_data ->> 'first_name'), ''),
        NULLIF(TRIM(SPLIT_PART(full_name_value, ' ', 1)), '')
    );

    last_name_value := COALESCE(
        NULLIF(TRIM(NEW.raw_user_meta_data ->> 'family_name'), ''),
        NULLIF(TRIM(NEW.raw_user_meta_data ->> 'last_name'), ''),
        NULLIF(TRIM(SPLIT_PART(full_name_value, ' ', 2)), '')
    );

    -- private info
    -- ON CONFLICT DO UPDATE, since this also runs on metadata updates
    -- COALESCE(EXCLUDED.x, table.x) fills blanks without wiping what the user already has
    INSERT INTO public.user_profile (user_id, first_name, last_name)
    VALUES (NEW.id, first_name_value, last_name_value)
    ON CONFLICT (user_id) DO UPDATE
        SET first_name = COALESCE(EXCLUDED.first_name, user_profile.first_name),
            last_name  = COALESCE(EXCLUDED.last_name,  user_profile.last_name);

    -- public info
    INSERT INTO public.public_profile (user_id, display_name)
    VALUES (NEW.id, display_name_value)
    ON CONFLICT (user_id) DO UPDATE
        SET display_name = COALESCE(EXCLUDED.display_name, public_profile.display_name);

    RETURN NEW;
END;
$$;

-- 5 ----------------------------------------------------------
-- THE TRIGGER — when the function runs
-- Dropped first so the file can be re-run without erroring
-- [T] AFTER — "Executes after the triggering event."
-- [T] FOR EACH ROW — "specifies that the trigger function should be executed once for each affected row."
-- Fires on INSERT and on metadata UPDATE, because the name can arrive a moment after signup
DROP TRIGGER IF EXISTS on_auth_user_created   -- auth signup trigger
    ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT OR UPDATE OF raw_user_meta_data ON auth.users
    FOR EACH ROW
        EXECUTE FUNCTION public.handle_new_user();

-- 6 ----------------------------------------------------------
-- ACCESS RULES
-- [R] "Each policy is attached to a table, and the policy is executed every time a table is accessed."
-- [R] auth.uid() — "Returns the ID of the user making the request."
-- [R] "The using clause decides which existing rows can be updated."
-- [R] "The with check expression ensures that any new row adheres to the policy constraints."
-- [R] "Wrapping the function causes an initPlan to be run by the Postgres optimizer."

-- 6a. remove old policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile"                 ON public.user_profile;
DROP POLICY IF EXISTS "Users can update their own profile"               ON public.user_profile;
DROP POLICY IF EXISTS "Users can view their own private profile"         ON public.user_profile;
DROP POLICY IF EXISTS "Users can update their own private profile"       ON public.user_profile;

-- 6b. users can view only their own private data
CREATE POLICY "Users can view their own private profile" ON public.user_profile
    FOR SELECT TO authenticated
        USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own private profile" ON public.user_profile
    FOR UPDATE TO authenticated
        USING ((SELECT auth.uid()) = user_id)
        WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Authenticated users can view public profiles" ON public.public_profile;
DROP POLICY IF EXISTS "Users can update their own public profile"    ON public.public_profile;

-- 6c. signed-in users can view everyone, edit only their own
-- USING (true) means every row passes the read check
CREATE POLICY "Authenticated users can view public profiles" ON public.public_profile
    FOR SELECT TO authenticated
        USING (true);

CREATE POLICY "Users can update their own public profile" ON public.public_profile
    FOR UPDATE TO authenticated
        USING ((SELECT auth.uid()) = user_id)
        WITH CHECK ((SELECT auth.uid()) = user_id);

-- 7 ----------------------------------------------------------
-- BACKFILL — accounts made before the trigger existed have no profile rows
-- WITH source AS (...) pulls each name field once, so the INSERT below can reuse them
-- ON CONFLICT handles accounts that already have a row
-- NULLIF(existing, '') keeps what's already filled in and only fills blanks

-- 7a. private profiles, including ones with no profile row
WITH source AS (
    SELECT id,
        NULLIF(TRIM(COALESCE(raw_user_meta_data ->> 'full_name', raw_user_meta_data ->> 'name')), '') AS full_name,
        NULLIF(TRIM(raw_user_meta_data ->> 'given_name'),  '') AS given_name,
        NULLIF(TRIM(raw_user_meta_data ->> 'family_name'), '') AS family_name,
        NULLIF(TRIM(raw_user_meta_data ->> 'first_name'),  '') AS first_name,
        NULLIF(TRIM(raw_user_meta_data ->> 'last_name'),   '') AS last_name
    FROM auth.users
)
INSERT INTO public.user_profile (user_id, first_name, last_name)
SELECT id,
    COALESCE(given_name,  first_name, NULLIF(SPLIT_PART(full_name, ' ', 1), '')),
    COALESCE(family_name, last_name,  NULLIF(SPLIT_PART(full_name, ' ', 2), ''))
FROM source
ON CONFLICT (user_id) DO UPDATE
    SET first_name = COALESCE(NULLIF(user_profile.first_name, ''), EXCLUDED.first_name),
        last_name  = COALESCE(NULLIF(user_profile.last_name,  ''), EXCLUDED.last_name);

-- 7b. public profiles
WITH source AS (
    SELECT id,
        NULLIF(TRIM(COALESCE(raw_user_meta_data ->> 'full_name', raw_user_meta_data ->> 'name')), '') AS full_name
    FROM auth.users
)
INSERT INTO public.public_profile (user_id, display_name)
SELECT id, full_name
FROM source
ON CONFLICT (user_id) DO UPDATE
    SET display_name = COALESCE(NULLIF(public_profile.display_name, ''), EXCLUDED.display_name);

-- 8 ----------------------------------------------------------
-- CHECK — one row per account, with both profile rows joined on
-- LEFT JOIN keeps an account with no profile row, showing nulls beside it
-- A null name only means the provider sent none, not that the trigger failed
SELECT
    auth_user.id    AS auth_user_id,
    auth_user.email,

    private_profile.user_id AS private_profile_id,
    private_profile.first_name,
    private_profile.last_name,

    public_profile.user_id  AS public_profile_id,
    public_profile.display_name,
    public_profile.handle,
    public_profile.bio

FROM auth.users AS auth_user
LEFT JOIN public.user_profile AS private_profile
    ON private_profile.user_id = auth_user.id
LEFT JOIN public.public_profile AS public_profile
    ON public_profile.user_id = auth_user.id
ORDER BY auth_user.created_at DESC;