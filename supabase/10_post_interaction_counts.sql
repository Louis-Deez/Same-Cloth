-- Run after 07_posts.sql.
CREATE OR REPLACE FUNCTION public.get_post_interaction_counts(p_post_ids UUID[])
RETURNS TABLE (
    post_id UUID,
    like_count BIGINT,
    comment_count BIGINT
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
    SELECT requested.post_id,
           (SELECT COUNT(*) FROM public.post_like AS likes
            WHERE likes.post_id = requested.post_id),
           (SELECT COUNT(*) FROM public.post_comment AS comments
            WHERE comments.post_id = requested.post_id)
    FROM UNNEST(COALESCE(p_post_ids, '{}'::UUID[])) AS requested(post_id)
$$;

REVOKE ALL ON FUNCTION public.get_post_interaction_counts(UUID[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_post_interaction_counts(UUID[]) TO authenticated;