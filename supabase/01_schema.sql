-- ============================================================
--  THE SAME CLOTH — DATABASE SCHEMA
--  Supabase project: same-cloth  |  Schema: public
--  Run this FIRST, in order. Inserts and RLS come after.
-- ============================================================
--
--  1. user_profile          one row per account, linked to Supabase Auth
--  2. question              one row per questionnaire question
--  3. answer_option         one row per selectable choice
--  4. user_selected_option  which options a user picked
--  5. user_written_response a user's typed answer to a question
--
--  NOTES
--  - No CREATE DATABASE. Supabase already made one.
--  - user_profile.user_id is NOT generated here. It comes from
--    auth.users, so the profile and the login account share an ID.
--  - Email and password live in auth.users, never in these tables.
--  - answer_option keeps an INT id, with option_value holding the
--    frontend string (e.g. 'dark_academia') for lookups.
-- ============================================================


-- 1 ----------------------------------------------------------
--  user_profile
--  user_id is both the primary key and a foreign key to the
--  Auth account. ON DELETE CASCADE means deleting the account
--  deletes the profile with it.
CREATE TABLE user_profile (
    user_id             UUID,
    handle              TEXT NOT NULL UNIQUE,
    display_name        TEXT,
    bio                 TEXT,
    first_name          TEXT,
    last_name           TEXT,
    date_of_birth       DATE,
    country             CHAR(2),
    gender              TEXT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);


-- 2 ----------------------------------------------------------
--  question
--  Both multiple-choice and written questions live here.
CREATE TABLE question (
    question_id         INT,
    question_text       TEXT NOT NULL,

    PRIMARY KEY (question_id)
);


-- 3 ----------------------------------------------------------
--  answer_option
--  option_id    our number (2xx = Q2, 7xx = Q7)
--  option_value the frontend's string, must match fields.ts exactly
--  option_text  what the user reads on screen
--
--  UNIQUE (question_id, option_value) means a word only has to be
--  unique within its own question, so two questions can both use
--  something like 'budget'. Look up with BOTH question_id and
--  option_value.
CREATE TABLE answer_option (
    option_id           INT,
    question_id         INT NOT NULL,
    option_value        TEXT NOT NULL,
    option_text         TEXT NOT NULL,

    PRIMARY KEY (option_id),
    UNIQUE (question_id, option_value),
    FOREIGN KEY (question_id) REFERENCES question(question_id)
);


-- 4 ----------------------------------------------------------
--  user_selected_option
--  The pair (user_id, option_id) is the key, so a user can pick
--  many options but never the same one twice.
CREATE TABLE user_selected_option (
    user_id             UUID,
    option_id           INT,

    PRIMARY KEY (user_id, option_id),
    FOREIGN KEY (user_id)   REFERENCES user_profile(user_id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES answer_option(option_id)
);


-- 5 ----------------------------------------------------------
--  user_written_response
--  One stored response per user per question.
CREATE TABLE user_written_response (
    user_id             UUID,
    question_id         INT,
    response_text       TEXT NOT NULL,

    PRIMARY KEY (user_id, question_id),
    FOREIGN KEY (user_id)     REFERENCES user_profile(user_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES question(question_id)
);