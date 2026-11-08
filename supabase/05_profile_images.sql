ALTER TABLE public.public_profile
  ADD COLUMN IF NOT EXISTS profile_picture_url TEXT,
  ADD COLUMN IF NOT EXISTS banner_url TEXT;