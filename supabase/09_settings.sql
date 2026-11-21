-- ============================================================
--  THE SAME CLOTH — USER SETTINGS
--  (09_settings.sql)   Run AFTER 01 through 08.
--
--  Settings are private, so they live on user_profile,
--  not public_profile. Safe to re-run.
--
--  Access rules for user_profile live in 03_profiles_trigger.sql.
-- ============================================================

-- 1 ----------------------------------------------------------
-- Theme: light, dark, or follow the device (system).
-- Saved per user so it stays after a hard refresh.
ALTER TABLE public.user_profile
    ADD COLUMN IF NOT EXISTS theme TEXT NOT NULL DEFAULT 'system'
        CHECK (theme IN ('light', 'dark', 'system'));

-- 2 ----------------------------------------------------------
-- No new policy or GRANT needed. 03 already lets users read and
-- update their own user_profile row, so the new column is covered.

-- 3 ----------------------------------------------------------
-- CHECK — every user should show 'system' until they change it
SELECT user_id, theme
FROM public.user_profile;
