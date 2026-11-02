-- ============================================================
--  THE SAME CLOTH — QUESTION & OPTION DATA  (02_answers.sql)
--  Run AFTER 01_schema.sql.
-- ============================================================
--  option_value must match the frontend's `value` in src/app/(auth)/signup/_config/fields.ts exactly, character for character. If a value changes there, change it here.
--  Q1, Q9, Q10, Q11 are free text, so no options. Their answers go in user_written_response.
--  Q8 and Q12 have no options yet. Q8's input is not built, so there are no frontend values to match. Q12 belonged to the three-phrase style profile the team dropped.
--  No selection limits. The team decided not to cap how many options a user can pick, so the question text says nothing about a maximum.
-- ============================================================

INSERT INTO question (question_id, question_text) VALUES
    (1,  'What should we call you?'),
    (2,  'What interests influence your style?'),
    (3,  'Which words describe how you want your clothing to feel?'),
    (4,  'What should we consider when recommending clothing?'),
    (5,  'Which colors are you most drawn to?'),
    (6,  'Which fashion era inspires you?'),
    (7,  'Which styles or subcultures interest you?'),
    (8,  'What fit or silhouette do you usually prefer?'),
    (9,  'Anything else you want to include?'),
    (10, 'What does your favorite outfit help you express?'),
    (11, 'Any style not listed above?'),
    (12, 'Does this sound like you?');

INSERT INTO answer_option (option_id, question_id, option_value, option_text) VALUES
    -- Q2 — INTERESTS (13 ITEMS)
    (201, 2, 'music',                    'Music'),
    (202, 2, 'books',                    'Books'),
    (203, 2, 'film_and_tv',              'Film and TV'),
    (204, 2, 'art',                      'Art'),
    (205, 2, 'gaming',                   'Gaming'),
    (206, 2, 'sports',                   'Sports'),
    (207, 2, 'nature',                   'Nature'),
    (208, 2, 'travel',                   'Travel'),
    (209, 2, 'history',                  'History'),
    (210, 2, 'activism',                 'Activism'),
    (211, 2, 'cultural_traditions',      'Cultural Traditions'),
    (212, 2, 'hobbies',                  'Hobbies'),
    (213, 2, 'academia',                 'Academia'),

    -- Q3 — CLOTHING_AESTHETICS (14 ITEMS)
    (301, 3, 'comfortable',              'Comfortable'),
    (302, 3, 'bold',                     'Bold'),
    (303, 3, 'soft',                     'Soft'),
    (304, 3, 'practical',                'Practical'),
    (305, 3, 'creative',                 'Creative'),
    (306, 3, 'elegant',                  'Elegant'),
    (307, 3, 'expressive',               'Expressive'),
    (308, 3, 'nostalgic',                'Nostalgic'),
    (309, 3, 'minimal',                  'Minimal'),
    (310, 3, 'casual',                   'Casual'),
    (311, 3, 'professional',             'Professional'),
    (312, 3, 'experimental',             'Experimental'),
    (313, 3, 'protective',               'Protective'),
    (314, 3, 'playful',                  'Playful'),

    -- Q4 — CLOTHING_NEEDS (13 ITEMS)
    (401, 4, 'comfort',                  'Comfort'),
    (402, 4, 'mobility',                 'Mobility'),
    (403, 4, 'sensory_needs',            'Sensory Needs'),
    (404, 4, 'hot_weather',              'Hot-Weather'),
    (405, 4, 'cold_weather',             'Cold-Weather'),
    (406, 4, 'modesty',                  'Modesty'),
    (407, 4, 'cultural_religious',       'Cultural/Religious Considerations'),
    (408, 4, 'professional_dress_codes', 'Professional dress codes'),
    (409, 4, 'budget',                   'Budget'),
    (410, 4, 'size_fit',                 'Size/Fit'),
    (411, 4, 'sustainable_clothing',     'Sustainable Clothing'),
    (412, 4, 'no_specific_needs',        'No Specific needs'),
    (413, 4, 'prefer_not_to_say',        'Prefer not to say'),

    -- Q5 — COLOR_PREFERENCES (10 ITEMS)
    (501, 5, 'neutrals',                 'Neutrals'),
    (502, 5, 'muted_colors',             'Muted Colors'),
    (503, 5, 'earth_tones',              'Earth Tones'),
    (504, 5, 'pastels',                  'Pastels'),
    (505, 5, 'bright_colors',            'Bright Colors'),
    (506, 5, 'jewel_tones',              'Jewel Tones'),
    (507, 5, 'neons',                    'Neons'),
    (508, 5, 'monochromes',              'Monochromes'),
    (509, 5, 'metallics',                'Metallics'),
    (510, 5, 'no_preference',            'No preference'),

    -- Q6 — FASHION_ERAS (12 ITEMS)
    (601, 6, '1920s',                    '1920s'),
    (602, 6, '1930s',                    '1930s'),
    (603, 6, '1940s',                    '1940s'),
    (604, 6, '1950s',                    '1950s'),
    (605, 6, '1960s',                    '1960s'),
    (606, 6, '1970s',                    '1970s'),
    (607, 6, '1980s',                    '1980s'),
    (608, 6, '1990s',                    '1990s'),
    (609, 6, '2000s',                    '2000s'),
    (610, 6, '2010s',                    '2010s'),
    (611, 6, 'contemporary',             'Contemporary'),
    (612, 6, 'no_specific_era',          'No specific era'),

    -- Q7 — STYLE_SUBCULTURES (18 ITEMS)
    (701, 7, 'goth',                     'Goth'),
    (702, 7, 'punk',                     'Punk'),
    (703, 7, 'grunge',                   'Grunge'),
    (704, 7, 'streetwear',               'Streetwear'),
    (705, 7, 'vintage',                  'Vintage'),
    (706, 7, 'cottagecore',              'Cottagecore'),
    (707, 7, 'dark_academia',            'Dark Academia'),
    (708, 7, 'light_academia',           'Light Academia'),
    (709, 7, 'techwear',                 'Techwear'),
    (710, 7, 'workwear',                 'Workwear'),
    (711, 7, 'preppy',                   'Preppy'),
    (712, 7, 'retro',                    'Retro'),
    (713, 7, 'athletic',                 'Athletic'),
    (714, 7, 'avant_garde',              'Avant-Garde'),
    (715, 7, 'diy_upcycled',             'DIY/Upcycled'),
    (716, 7, 'alternative',              'Alternative'),
    (717, 7, 'traditional_dress',        'Traditional dress'),
    (718, 7, 'still_exploring',          'I am still exploring');

-- ============================================================
--  CLEANUP FOR DATABASES THAT ALREADY RAN THIS FILE
--  Q4 and Q7 used to end with "Select all that apply" and "Choose all that apply" while the other ten were bare questions. 
-- Every question is multi-select, so the instruction was both uneven and redundant. 
-- The INSERT above is already fixed, but an INSERT does nothing to rows that exist, so these two UPDATEs bring an existing database in line. 
-- Harmless to run on a fresh one, they just set the same value twice.
-- ============================================================

UPDATE question SET question_text = 'What should we consider when recommending clothing?' WHERE question_id = 4;
UPDATE question SET question_text = 'Which styles or subcultures interest you?'            WHERE question_id = 7;