-- ============================================================
--  THE SAME CLOTH — GROUPS AND COMMUNITIES
--  (08_groups.sql)   Run AFTER 01 through 07.
--
--  Needs public_profile and answer_option. Safe to re-run.
--  `owner` in the database = `host` in the app.
--  Groups are made with create_community_group(), never by direct insert.
--
--  Quoted definitions are verbatim from the Supabase docs:
--    [F] supabase.com/docs/guides/database/functions
--    [R] supabase.com/docs/guides/database/postgres/row-level-security
--    [G] supabase.com/docs/guides/database/postgres/roles
-- ============================================================

-- 1 ----------------------------------------------------------
-- A group has a name, a short bio, and the user who created it.
CREATE TABLE IF NOT EXISTS public.community_group (
    group_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL CHECK (char_length(BTRIM(name)) BETWEEN 3 AND 60),
    description     TEXT CHECK (description IS NULL OR char_length(description) <= 300),
    created_by      UUID NOT NULL REFERENCES public.public_profile(user_id) ON DELETE CASCADE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- No two groups can share a name, even with different capital letters.
CREATE UNIQUE INDEX IF NOT EXISTS community_group_name_unique_idx
    ON public.community_group (LOWER(name));

-- 2 ----------------------------------------------------------
-- The interests that define a group (option ids picked at signup).
-- Matching users to groups is based on overlapping interests.
CREATE TABLE IF NOT EXISTS public.community_group_criteria (
    group_id        UUID NOT NULL REFERENCES public.community_group(group_id) ON DELETE CASCADE,
    option_id       INT  NOT NULL REFERENCES public.answer_option(option_id),

    PRIMARY KEY (group_id, option_id)
);

-- 3 ----------------------------------------------------------
-- Who belongs to a group. The primary key prevents joining twice.
CREATE TABLE IF NOT EXISTS public.community_group_member (
    group_id        UUID NOT NULL REFERENCES public.community_group(group_id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES public.public_profile(user_id) ON DELETE CASCADE,
    role            TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
    joined_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    PRIMARY KEY (group_id, user_id)
);

-- Only one owner per group. A handoff demotes the old owner first.
CREATE UNIQUE INDEX IF NOT EXISTS community_group_one_owner_idx
    ON public.community_group_member (group_id)
    WHERE role = 'owner';

-- 4 ----------------------------------------------------------
-- A host handoff: the owner offers, the receiver must accept.
-- Nobody writes here directly. The functions in section 8 do it.
CREATE TABLE IF NOT EXISTS public.community_group_host_transfer (
    transfer_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id        UUID NOT NULL REFERENCES public.community_group(group_id) ON DELETE CASCADE,
    from_user_id    UUID NOT NULL REFERENCES public.public_profile(user_id) ON DELETE CASCADE,
    to_user_id      UUID NOT NULL REFERENCES public.public_profile(user_id) ON DELETE CASCADE,
    status          TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled')),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    responded_at    TIMESTAMP WITH TIME ZONE,

    CHECK (from_user_id <> to_user_id)
);

-- At most one open offer per group.
CREATE UNIQUE INDEX IF NOT EXISTS community_group_one_pending_transfer_idx
    ON public.community_group_host_transfer (group_id)
    WHERE status = 'pending';

-- 5 ----------------------------------------------------------
-- Groups page and relationship lookups.
CREATE INDEX IF NOT EXISTS community_group_feed_idx
    ON public.community_group (created_at DESC, group_id DESC);

CREATE INDEX IF NOT EXISTS community_group_criteria_option_idx
    ON public.community_group_criteria (option_id);

CREATE INDEX IF NOT EXISTS community_group_member_user_idx
    ON public.community_group_member (user_id);

CREATE INDEX IF NOT EXISTS community_group_transfer_to_idx
    ON public.community_group_host_transfer (to_user_id, status);

-- 6 ----------------------------------------------------------
-- [R] auth.uid() — "Returns the ID of the user making the request."
-- [R] "Wrapping the function causes an initPlan to be run by the Postgres optimizer."
-- Signed-in users can see every group, its interests, and its members.
-- Only the owner can edit or delete a group. Owner rights follow the
-- `owner` role (not created_by), so they move with a host handoff.
ALTER TABLE public.community_group               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_group_criteria      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_group_member        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_group_host_transfer ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view groups"   ON public.community_group;
DROP POLICY IF EXISTS "Group owners can update their groups"  ON public.community_group;
DROP POLICY IF EXISTS "Group owners can delete their groups"  ON public.community_group;

CREATE POLICY "Authenticated users can view groups" ON public.community_group
    FOR SELECT TO authenticated
        USING (true);

CREATE POLICY "Group owners can update their groups" ON public.community_group
    FOR UPDATE TO authenticated
        USING (
            EXISTS (
                SELECT 1
                FROM public.community_group_member AS m
                WHERE m.group_id = community_group.group_id
                    AND m.user_id = (SELECT auth.uid())
                    AND m.role = 'owner'
            )
        )
        WITH CHECK (
            EXISTS (
                SELECT 1
                FROM public.community_group_member AS m
                WHERE m.group_id = community_group.group_id
                    AND m.user_id = (SELECT auth.uid())
                    AND m.role = 'owner'
            )
        );

CREATE POLICY "Group owners can delete their groups" ON public.community_group
    FOR DELETE TO authenticated
        USING (
            EXISTS (
                SELECT 1
                FROM public.community_group_member AS m
                WHERE m.group_id = community_group.group_id
                    AND m.user_id = (SELECT auth.uid())
                    AND m.role = 'owner'
            )
        );

DROP POLICY IF EXISTS "Authenticated users can view group criteria" ON public.community_group_criteria;

CREATE POLICY "Authenticated users can view group criteria" ON public.community_group_criteria
    FOR SELECT TO authenticated
        USING (true);

-- Join: only as yourself, only as a member.
-- Leave: only your own row, and not the host. (The app should use
-- leave_community_group() instead, which also handles the host.)
DROP POLICY IF EXISTS "Authenticated users can view group members" ON public.community_group_member;
DROP POLICY IF EXISTS "Users can join groups as members"           ON public.community_group_member;
DROP POLICY IF EXISTS "Members can leave groups"                   ON public.community_group_member;

CREATE POLICY "Authenticated users can view group members" ON public.community_group_member
    FOR SELECT TO authenticated
        USING (true);

CREATE POLICY "Users can join groups as members" ON public.community_group_member
    FOR INSERT TO authenticated
        WITH CHECK (
            (SELECT auth.uid()) = user_id
            AND role = 'member'
        );

CREATE POLICY "Members can leave groups" ON public.community_group_member
    FOR DELETE TO authenticated
        USING (
            (SELECT auth.uid()) = user_id
            AND role <> 'owner'
        );

-- Only the two people in a handoff can see it.
DROP POLICY IF EXISTS "People in a transfer can view it" ON public.community_group_host_transfer;

CREATE POLICY "People in a transfer can view it" ON public.community_group_host_transfer
    FOR SELECT TO authenticated
        USING ((SELECT auth.uid()) IN (from_user_id, to_user_id));

-- 7 ----------------------------------------------------------
-- [G] "Roles can be granted various permissions on database objects using the `GRANT` command."
-- GRANT decides which table operations are available; RLS limits the rows.
-- Owners can only edit the name and description, not the creator or date.
-- Joining sets only group_id and user_id, so role and joined_at use defaults.
GRANT SELECT                         ON public.community_group               TO authenticated;
GRANT UPDATE (name, description)     ON public.community_group               TO authenticated;
GRANT DELETE                         ON public.community_group               TO authenticated;
GRANT SELECT                         ON public.community_group_criteria      TO authenticated;
GRANT SELECT                         ON public.community_group_member        TO authenticated;
GRANT INSERT (group_id, user_id)     ON public.community_group_member        TO authenticated;
GRANT DELETE                         ON public.community_group_member        TO authenticated;
GRANT SELECT                         ON public.community_group_host_transfer TO authenticated;

-- 8 ----------------------------------------------------------
-- [F] "Postgres runs a function either as the user calling it (invoker) or as its creator (definer)."
-- [F] "When you use security definer, you must set the search_path."
-- Functions. SECURITY DEFINER lets them do what users cannot do directly
-- (create the owner row, swap roles). They take the user id from
-- auth.uid(), never from the caller.

-- 8a. Create a group (max 3 per creator).
CREATE OR REPLACE FUNCTION public.create_community_group(
    group_name          TEXT,
    group_description   TEXT DEFAULT NULL,
    option_ids          INT[] DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    current_user_id     UUID := (SELECT auth.uid());
    clean_name          TEXT := BTRIM(COALESCE(group_name, ''));
    clean_description   TEXT := NULLIF(BTRIM(COALESCE(group_description, '')), '');
    picked_ids          INT[];
    new_group_id        UUID;
BEGIN
    -- 1) Must be signed in.
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'you must be signed in to create a group';
    END IF;

    -- 2) Max 3 groups. The lock stops two fast clicks from making a 4th.
    PERFORM pg_advisory_xact_lock(HASHTEXT(current_user_id::TEXT));

    IF (SELECT COUNT(*) FROM public.community_group
        WHERE created_by = current_user_id) >= 3 THEN
        RAISE EXCEPTION 'you can create at most 3 groups';
    END IF;

    -- 3) Remove duplicate interest ids, then require at least one.
    SELECT COALESCE(ARRAY_AGG(DISTINCT picked.id), '{}')
        INTO picked_ids
        FROM UNNEST(option_ids) AS picked(id);

    IF CARDINALITY(picked_ids) = 0 THEN
        RAISE EXCEPTION 'pick at least one interest for the group';
    END IF;

    -- 4) Every picked interest must exist.
    IF EXISTS (
        SELECT 1
        FROM UNNEST(picked_ids) AS picked(id)
        WHERE NOT EXISTS (
            SELECT 1 FROM public.answer_option AS option_row
            WHERE option_row.option_id = picked.id
        )
    ) THEN
        RAISE EXCEPTION 'one of the picked interests does not exist';
    END IF;

    -- 5) Save the group, its interests, and the creator as owner.
    INSERT INTO public.community_group (name, description, created_by)
    VALUES (clean_name, clean_description, current_user_id)
    RETURNING group_id INTO new_group_id;

    INSERT INTO public.community_group_criteria (group_id, option_id)
    SELECT new_group_id, picked.id
    FROM UNNEST(picked_ids) AS picked(id);

    INSERT INTO public.community_group_member (group_id, user_id, role)
    VALUES (new_group_id, current_user_id, 'owner');

    RETURN new_group_id;
END;
$$;

-- 8b. Owner offers the host title to a current member.
CREATE OR REPLACE FUNCTION public.offer_host_transfer(p_group_id UUID, p_to_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    current_user_id     UUID := (SELECT auth.uid());
    new_transfer_id     UUID;
BEGIN
    -- 1) Must be signed in.
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'you must be signed in';
    END IF;

    -- 2) Only the current owner can give up the title.
    IF NOT EXISTS (
        SELECT 1 FROM public.community_group_member
        WHERE group_id = p_group_id AND user_id = current_user_id AND role = 'owner'
    ) THEN
        RAISE EXCEPTION 'only the host can give up the host title';
    END IF;

    -- 3) The new host must already be a member.
    IF NOT EXISTS (
        SELECT 1 FROM public.community_group_member
        WHERE group_id = p_group_id AND user_id = p_to_user_id AND role = 'member'
    ) THEN
        RAISE EXCEPTION 'the new host must be a member of the group';
    END IF;

    -- 4) Only one open offer per group.
    IF EXISTS (
        SELECT 1 FROM public.community_group_host_transfer
        WHERE group_id = p_group_id AND status = 'pending'
    ) THEN
        RAISE EXCEPTION 'this group already has a pending host offer';
    END IF;

    -- 5) Save the offer.
    INSERT INTO public.community_group_host_transfer (group_id, from_user_id, to_user_id)
    VALUES (p_group_id, current_user_id, p_to_user_id)
    RETURNING transfer_id INTO new_transfer_id;

    RETURN new_transfer_id;
END;
$$;

-- 8c. Receiver accepts or declines. Accepting swaps the roles in one step.
CREATE OR REPLACE FUNCTION public.respond_host_transfer(p_transfer_id UUID, p_accept BOOLEAN)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    current_user_id     UUID := (SELECT auth.uid());
    t                   public.community_group_host_transfer%ROWTYPE;
BEGIN
    -- 1) Must be signed in.
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'you must be signed in';
    END IF;

    -- 2) Find the offer and lock it so it cannot be answered twice.
    SELECT * INTO t
    FROM public.community_group_host_transfer
    WHERE transfer_id = p_transfer_id
    FOR UPDATE;

    -- 3) It must exist, be addressed to you, and still be open.
    IF NOT FOUND OR t.to_user_id <> current_user_id THEN
        RAISE EXCEPTION 'no host offer found for you';
    END IF;

    IF t.status <> 'pending' THEN
        RAISE EXCEPTION 'this offer was already answered';
    END IF;

    -- 4) Declined: record it and stop.
    IF NOT p_accept THEN
        UPDATE public.community_group_host_transfer
        SET status = 'declined', responded_at = NOW()
        WHERE transfer_id = t.transfer_id;
        RETURN;
    END IF;

    -- 5) Offer is stale if either person is no longer in the right role.
    IF NOT EXISTS (
        SELECT 1 FROM public.community_group_member
        WHERE group_id = t.group_id AND user_id = t.from_user_id AND role = 'owner'
    ) OR NOT EXISTS (
        SELECT 1 FROM public.community_group_member
        WHERE group_id = t.group_id AND user_id = t.to_user_id AND role = 'member'
    ) THEN
        UPDATE public.community_group_host_transfer
        SET status = 'cancelled', responded_at = NOW()
        WHERE transfer_id = t.transfer_id;
        RAISE EXCEPTION 'this offer is no longer valid';
    END IF;

    -- 6) Swap roles. Demote first, then promote (one owner at a time).
    UPDATE public.community_group_member
    SET role = 'member'
    WHERE group_id = t.group_id AND user_id = t.from_user_id;

    UPDATE public.community_group_member
    SET role = 'owner'
    WHERE group_id = t.group_id AND user_id = t.to_user_id;

    -- 7) Record the answer.
    UPDATE public.community_group_host_transfer
    SET status = 'accepted', responded_at = NOW()
    WHERE transfer_id = t.transfer_id;
END;
$$;

-- 8d. Owner takes an open offer back.
CREATE OR REPLACE FUNCTION public.cancel_host_transfer(p_transfer_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    current_user_id     UUID := (SELECT auth.uid());
BEGIN
    -- 1) Only your own open offer can be cancelled.
    UPDATE public.community_group_host_transfer
    SET status = 'cancelled', responded_at = NOW()
    WHERE transfer_id = p_transfer_id
        AND from_user_id = current_user_id
        AND status = 'pending';

    -- 2) Nothing changed means there was no such offer.
    IF NOT FOUND THEN
        RAISE EXCEPTION 'no pending offer of yours found';
    END IF;
END;
$$;

-- 8e. Groups that match a user's interests, best match first.
-- The app passes in the user's picked option ids.
-- No SECURITY DEFINER, so it runs as the caller (invoker) and RLS still applies.
CREATE OR REPLACE FUNCTION public.matching_community_groups(p_option_ids INT[])
RETURNS TABLE (
    group_id        UUID,
    name            TEXT,
    description     TEXT,
    match_count     BIGINT,
    member_count    BIGINT
)
LANGUAGE sql
STABLE
SET search_path = public, pg_temp
AS $$
    SELECT g.group_id,
           g.name,
           g.description,
           COUNT(c.option_id) FILTER (WHERE c.option_id = ANY (p_option_ids)) AS match_count,
           (SELECT COUNT(*) FROM public.community_group_member AS m
            WHERE m.group_id = g.group_id) AS member_count
    FROM public.community_group AS g
    LEFT JOIN public.community_group_criteria AS c ON c.group_id = g.group_id
    GROUP BY g.group_id
    HAVING COUNT(c.option_id) FILTER (WHERE c.option_id = ANY (p_option_ids)) > 0
    ORDER BY match_count DESC, g.created_at DESC
$$;

-- 8f. Leave a group. Use this for every leave (members and host).
-- Member: just removed.
-- Host: the member who joined next becomes host automatically
--       (no accept needed). Any open host offer is cancelled.
-- Last person out: the group is deleted.
CREATE OR REPLACE FUNCTION public.leave_community_group(p_group_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    current_user_id     UUID := (SELECT auth.uid());
    my_role             TEXT;
    next_host_id        UUID;
BEGIN
    -- 1) Must be signed in.
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'you must be signed in';
    END IF;

    -- 2) Lock the group so two people leaving at once cannot clash.
    PERFORM 1 FROM public.community_group
    WHERE group_id = p_group_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'group not found';
    END IF;

    -- 3) Must be in the group.
    SELECT role INTO my_role
    FROM public.community_group_member
    WHERE group_id = p_group_id AND user_id = current_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'you are not in this group';
    END IF;

    -- 4) Members just leave.
    IF my_role = 'member' THEN
        DELETE FROM public.community_group_member
        WHERE group_id = p_group_id AND user_id = current_user_id;
        RETURN;
    END IF;

    -- 5) Host leaving: cancel any open host offer.
    UPDATE public.community_group_host_transfer
    SET status = 'cancelled', responded_at = NOW()
    WHERE group_id = p_group_id AND status = 'pending';

    -- 6) Find the member who joined next (earliest join date).
    SELECT user_id INTO next_host_id
    FROM public.community_group_member
    WHERE group_id = p_group_id AND role = 'member'
    ORDER BY joined_at, user_id
    LIMIT 1;

    -- 7) Nobody left: delete the group (members, interests, offers go with it).
    IF next_host_id IS NULL THEN
        DELETE FROM public.community_group WHERE group_id = p_group_id;
        RETURN;
    END IF;

    -- 8) Remove the old host first, then promote (one owner at a time).
    DELETE FROM public.community_group_member
    WHERE group_id = p_group_id AND user_id = current_user_id;

    UPDATE public.community_group_member
    SET role = 'owner'
    WHERE group_id = p_group_id AND user_id = next_host_id;
END;
$$;

-- 9 ----------------------------------------------------------
-- Only signed-in users can run the functions.
REVOKE ALL ON FUNCTION public.create_community_group(TEXT, TEXT, INT[])  FROM public, anon;
REVOKE ALL ON FUNCTION public.offer_host_transfer(UUID, UUID)            FROM public, anon;
REVOKE ALL ON FUNCTION public.respond_host_transfer(UUID, BOOLEAN)       FROM public, anon;
REVOKE ALL ON FUNCTION public.cancel_host_transfer(UUID)                 FROM public, anon;
REVOKE ALL ON FUNCTION public.matching_community_groups(INT[])           FROM public, anon;
REVOKE ALL ON FUNCTION public.leave_community_group(UUID)                FROM public, anon;

GRANT EXECUTE ON FUNCTION public.create_community_group(TEXT, TEXT, INT[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.offer_host_transfer(UUID, UUID)           TO authenticated;
GRANT EXECUTE ON FUNCTION public.respond_host_transfer(UUID, BOOLEAN)      TO authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_host_transfer(UUID)                TO authenticated;
GRANT EXECUTE ON FUNCTION public.matching_community_groups(INT[])          TO authenticated;
GRANT EXECUTE ON FUNCTION public.leave_community_group(UUID)               TO authenticated;

-- 10 ---------------------------------------------------------
-- Check: every group should have exactly one owner.
SELECT g.group_id,
       g.name,
       COUNT(m.user_id) FILTER (WHERE m.role = 'owner') AS owners
FROM public.community_group AS g
LEFT JOIN public.community_group_member AS m ON m.group_id = g.group_id
GROUP BY g.group_id, g.name
ORDER BY owners;