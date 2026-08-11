-- Additional field renames for clarity

-- topics.lesson_topic → topic (shorter, cleaner)
ALTER TABLE topics RENAME COLUMN lesson_topic TO topic;

-- topics.skill_statement → skill (shorter)
ALTER TABLE topics RENAME COLUMN skill_statement TO skill;

-- topics.seq_num → sequence (clearer)
ALTER TABLE topics RENAME COLUMN seq_num TO sequence;

-- topics.taught → taught_status (clearer)
ALTER TABLE topics RENAME COLUMN taught TO taught_status;

-- topics.merged_into_topic_id → merged_into (shorter)
ALTER TABLE topics RENAME COLUMN merged_into_topic_id TO merged_into;

-- topics.circle_time_slot → circle_time (shorter)
ALTER TABLE topics RENAME COLUMN circle_time_slot TO circle_time;
