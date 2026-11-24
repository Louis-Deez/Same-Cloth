-- Run after 03_profiles_trigger.sql.
CREATE TABLE IF NOT EXISTS public.user_follow (
    follower_id  UUID NOT NULL REFERENCES public.public_profile(user_id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES public.public_profile(user_id) ON DELETE CASCADE,
    created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    PRIMARY KEY (follower_id, following_id),
    CHECK (follower_id <> following_id)
);

CREATE INDEX IF NOT EXISTS user_follow_following_idx
    ON public.user_follow (following_id, created_at DESC);

ALTER TABLE public.user_follow ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view follows" ON public.user_follow;
DROP POLICY IF EXISTS "Users can follow as themselves" ON public.user_follow;
DROP POLICY IF EXISTS "Users can unfollow as themselves" ON public.user_follow;

CREATE POLICY "Authenticated users can view follows" ON public.user_follow
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Users can follow as themselves" ON public.user_follow
    FOR INSERT TO authenticated
    WITH CHECK (
        (SELECT auth.uid()) = follower_id
        AND follower_id <> following_id
    );

CREATE POLICY "Users can unfollow as themselves" ON public.user_follow
    FOR DELETE TO authenticated
    USING ((SELECT auth.uid()) = follower_id);

GRANT SELECT, INSERT, DELETE ON public.user_follow TO authenticated;