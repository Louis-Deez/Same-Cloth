-- ============================================================
--  THE SAME CLOTH — POSTS, PHOTOS, LIKES, AND COMMENTS
--  (07_posts.sql)   Run AFTER 01 through 06.
--
--  Photo files live in the private `post-images` Storage bucket.
--  `post_image.storage_path` stores each object's path, not its bytes.
-- ============================================================

-- 1 ----------------------------------------------------------
-- A post can have a caption and multiple photos.
CREATE TABLE IF NOT EXISTS public.post (
    post_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES public.public_profile(user_id) ON DELETE CASCADE,
    caption         TEXT CHECK (caption IS NULL OR char_length(caption) <= 2000),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.post_image (
    post_image_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id         UUID NOT NULL REFERENCES public.post(post_id) ON DELETE CASCADE,
    -- Relative to `post-images`, e.g. `<user_id>/<post_id>/<filename>`.
    storage_path    TEXT NOT NULL UNIQUE,
    display_order   SMALLINT NOT NULL DEFAULT 0 CHECK (display_order >= 0),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    UNIQUE (post_id, display_order)
);

-- 2 ----------------------------------------------------------
-- A user's primary key prevents duplicate likes on the same post.
CREATE TABLE IF NOT EXISTS public.post_like (
    post_id         UUID NOT NULL REFERENCES public.post(post_id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    PRIMARY KEY (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.post_comment (
    comment_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id         UUID NOT NULL REFERENCES public.post(post_id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES public.public_profile(user_id) ON DELETE CASCADE,
    body            TEXT NOT NULL CHECK (char_length(BTRIM(body)) BETWEEN 1 AND 2000),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 3 ----------------------------------------------------------
-- Feed and relationship lookups.
CREATE INDEX IF NOT EXISTS post_feed_idx
    ON public.post (created_at DESC, post_id DESC);

CREATE INDEX IF NOT EXISTS post_author_feed_idx
    ON public.post (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS post_image_order_idx
    ON public.post_image (post_id, display_order);

CREATE INDEX IF NOT EXISTS post_comment_feed_idx
    ON public.post_comment (post_id, created_at, comment_id);

CREATE INDEX IF NOT EXISTS post_like_user_idx
    ON public.post_like (user_id, created_at DESC);

-- 4 ----------------------------------------------------------
-- Signed-in users can read the feed. Authors control their own posts.
ALTER TABLE public.post         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_image   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_like    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comment ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view posts" ON public.post;
DROP POLICY IF EXISTS "Users can create their own posts" ON public.post;
DROP POLICY IF EXISTS "Users can update their own posts" ON public.post;
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.post;

CREATE POLICY "Authenticated users can view posts" ON public.post
    FOR SELECT TO authenticated
        USING (true);

CREATE POLICY "Users can create their own posts" ON public.post
    FOR INSERT TO authenticated
        WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own posts" ON public.post
    FOR UPDATE TO authenticated
        USING ((SELECT auth.uid()) = user_id)
        WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own posts" ON public.post
    FOR DELETE TO authenticated
        USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Authenticated users can view post images" ON public.post_image;
DROP POLICY IF EXISTS "Post owners can add images" ON public.post_image;
DROP POLICY IF EXISTS "Post owners can update images" ON public.post_image;
DROP POLICY IF EXISTS "Post owners can delete images" ON public.post_image;

CREATE POLICY "Authenticated users can view post images" ON public.post_image
    FOR SELECT TO authenticated
        USING (true);

CREATE POLICY "Post owners can add images" ON public.post_image
    FOR INSERT TO authenticated
        WITH CHECK (
            EXISTS (
                SELECT 1
                FROM public.post
                WHERE post.post_id = post_image.post_id
                    AND post.user_id = (SELECT auth.uid())
            )
            AND split_part(storage_path, '/', 1) = (SELECT auth.uid())::text
        );

CREATE POLICY "Post owners can update images" ON public.post_image
    FOR UPDATE TO authenticated
        USING (
            EXISTS (
                SELECT 1
                FROM public.post
                WHERE post.post_id = post_image.post_id
                    AND post.user_id = (SELECT auth.uid())
            )
            AND split_part(storage_path, '/', 1) = (SELECT auth.uid())::text
        )
        WITH CHECK (
            EXISTS (
                SELECT 1
                FROM public.post
                WHERE post.post_id = post_image.post_id
                    AND post.user_id = (SELECT auth.uid())
            )
            AND split_part(storage_path, '/', 1) = (SELECT auth.uid())::text
        );

CREATE POLICY "Post owners can delete images" ON public.post_image
    FOR DELETE TO authenticated
        USING (
            EXISTS (
                SELECT 1
                FROM public.post
                WHERE post.post_id = post_image.post_id
                    AND post.user_id = (SELECT auth.uid())
            )
        );

DROP POLICY IF EXISTS "Authenticated users can view post likes" ON public.post_like;
DROP POLICY IF EXISTS "Users can like posts as themselves" ON public.post_like;
DROP POLICY IF EXISTS "Users can remove their own likes" ON public.post_like;

CREATE POLICY "Authenticated users can view post likes" ON public.post_like
    FOR SELECT TO authenticated
        USING (true);

CREATE POLICY "Users can like posts as themselves" ON public.post_like
    FOR INSERT TO authenticated
        WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can remove their own likes" ON public.post_like
    FOR DELETE TO authenticated
        USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Authenticated users can view post comments" ON public.post_comment;
DROP POLICY IF EXISTS "Users can add their own comments" ON public.post_comment;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.post_comment;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.post_comment;

CREATE POLICY "Authenticated users can view post comments" ON public.post_comment
    FOR SELECT TO authenticated
        USING (true);

CREATE POLICY "Users can add their own comments" ON public.post_comment
    FOR INSERT TO authenticated
        WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own comments" ON public.post_comment
    FOR UPDATE TO authenticated
        USING ((SELECT auth.uid()) = user_id)
        WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own comments" ON public.post_comment
    FOR DELETE TO authenticated
        USING ((SELECT auth.uid()) = user_id);

-- 5 ----------------------------------------------------------
-- Create a private bucket for user-uploaded post photos.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('post-images', 'post-images', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE 
SET public = false,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

DROP POLICY IF EXISTS "Authenticated users can view post photo objects" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload post photos to their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can update post photos in their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete post photos in their own folder" ON storage.objects;

CREATE POLICY "Authenticated users can view post photo objects" ON storage.objects
    FOR SELECT TO authenticated
        USING (bucket_id = 'post-images');

CREATE POLICY "Users can upload post photos to their own folder" ON storage.objects
    FOR INSERT TO authenticated
        WITH CHECK (
            bucket_id = 'post-images'
            AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
        );

CREATE POLICY "Users can update post photos in their own folder" ON storage.objects
    FOR UPDATE TO authenticated
        USING (
            bucket_id = 'post-images'
            AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
        )
        WITH CHECK (
            bucket_id = 'post-images'
            AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
        );

CREATE POLICY "Users can delete post photos in their own folder" ON storage.objects
    FOR DELETE TO authenticated
        USING (
            bucket_id = 'post-images'
            AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
        );

-- 6 ----------------------------------------------------------
-- GRANT decides which table operations are available; RLS limits the rows.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post         TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_image   TO authenticated;
GRANT SELECT, INSERT, DELETE         ON public.post_like    TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_comment TO authenticated;

SELECT conrelid::regclass AS table_name,
       conname,
       confrelid::regclass AS points_to
FROM pg_constraint
WHERE contype = 'f'
  AND conrelid IN ('public.post'::regclass, 'public.post_comment'::regclass);