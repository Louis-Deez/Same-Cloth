-- ============================================================
--  THE SAME CLOTH — QUESTIONNAIRE ACCESS RULES
--  (04_questionnaire_rls.sql)   Run AFTER 01, 02 and 03.
-- ============================================================

-- 1 ----------------------------------------------------------
-- question — reference data, everyone reads, nobody edits
-- [R] "Postgres Row Level Security (RLS) gives you granular authorization rules that run inside the database."
ALTER TABLE public.question ENABLE ROW LEVEL SECURITY; 

DROP POLICY IF EXISTS "Authenticated users can view questions" ON public.question;

CREATE POLICY "Authenticated users can view questions" ON public.question
    FOR SELECT TO authenticated
        USING (true);

-- 2 ----------------------------------------------------------
-- answer_option — reference data, same deal
ALTER TABLE public.answer_option ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view answer options" ON public.answer_option;

CREATE POLICY "Authenticated users can view answer options" ON public.answer_option
    FOR SELECT TO authenticated
        USING (true);

-- 3 ----------------------------------------------------------
-- user_selected_option — picks are public so people can see each other's styles and so group matching can compare them
-- Adding and removing stay restricted to the owner
-- [R] auth.uid() — "Returns the ID of the user making the request."
ALTER TABLE public.user_selected_option ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view selections" ON public.user_selected_option;
DROP POLICY IF EXISTS "Users can add their own selections"      ON public.user_selected_option;
DROP POLICY IF EXISTS "Users can remove their own selections"   ON public.user_selected_option;

CREATE POLICY "Authenticated users can view selections" ON public.user_selected_option
    FOR SELECT TO authenticated
        USING (true);

CREATE POLICY "Users can add their own selections" ON public.user_selected_option
    FOR INSERT TO authenticated
        WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can remove their own selections" ON public.user_selected_option
    FOR DELETE TO authenticated
        USING ((SELECT auth.uid()) = user_id);

-- 4 ----------------------------------------------------------
-- user_written_response — typed answers stay private
-- [R] "The with check expression ensures that any new row adheres to the policy constraints."
ALTER TABLE public.user_written_response ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own responses"   ON public.user_written_response;
DROP POLICY IF EXISTS "Users can add their own responses"    ON public.user_written_response;
DROP POLICY IF EXISTS "Users can update their own responses" ON public.user_written_response;
DROP POLICY IF EXISTS "Users can remove their own responses" ON public.user_written_response;

CREATE POLICY "Users can view their own responses" ON public.user_written_response
    FOR SELECT TO authenticated
        USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can add their own responses" ON public.user_written_response
    FOR INSERT TO authenticated
        WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own responses" ON public.user_written_response
    FOR UPDATE TO authenticated
        USING ((SELECT auth.uid()) = user_id)
        WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can remove their own responses" ON public.user_written_response
    FOR DELETE TO authenticated
        USING ((SELECT auth.uid()) = user_id);