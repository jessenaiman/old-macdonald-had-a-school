CREATE TABLE `action_vocabulary` (
	`id` text PRIMARY KEY NOT NULL,
	`normalized_action_family` text NOT NULL,
	`examples` text,
	`do_not_use_as_proof` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `ACTIVITIES` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`type` text,
	`instructions` text,
	`materials_needed` text,
	`age_range` text,
	`duration_minutes` integer,
	`source_id` integer
);
--> statement-breakpoint
CREATE TABLE `BOOK_SUGGESTIONS` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text,
	`author` text,
	`description` text,
	`age_range` text,
	`isbn` text,
	`url` text
);
--> statement-breakpoint
CREATE TABLE `curriculum_topic_songs` (
	`id` text PRIMARY KEY NOT NULL,
	`curriculum_topic_id` text NOT NULL,
	`search_chunk_id` text NOT NULL,
	`link_type` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`topic_id` integer,
	FOREIGN KEY (`search_chunk_id`) REFERENCES `search_chunks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`topic_id`) REFERENCES `TOPICS`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `curriculum_topics` (
	`id` text PRIMARY KEY NOT NULL,
	`grade_key` text NOT NULL,
	`grade` text NOT NULL,
	`early_years` integer NOT NULL,
	`subject` text NOT NULL,
	`category` text,
	`seq_number` integer,
	`lesson_topic` text NOT NULL,
	`skill_statement` text,
	`standards` text,
	`song_count` integer DEFAULT 0,
	`linked_songs` text,
	`linked_resources` text,
	`tags` text,
	`circle_time_slot` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `GRADES` (
	`id` integer PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`label` text NOT NULL,
	`age_range` text,
	`sort_order` integer
);
--> statement-breakpoint
CREATE TABLE `import_batches` (
	`id` integer PRIMARY KEY NOT NULL,
	`migration_id` text,
	`source_name` text,
	`source_path` text,
	`source_sha256` text,
	`imported_at` text,
	FOREIGN KEY (`migration_id`) REFERENCES `schema_migrations`(`migration_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `lesson_assets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`lesson_id` integer,
	`asset_type` text DEFAULT 'worksheet' NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`file_path` text,
	`format` text,
	`generation_prompt` text,
	`visual_notes` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`worksheet_brief_id` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `lesson_blueprints` (
	`id` integer PRIMARY KEY NOT NULL,
	`curriculum_topic_id` integer,
	`slug` text,
	`title` text,
	`subject` text,
	`category` text,
	`grade_band` text,
	`summary` text,
	`purpose` text,
	`lesson_mode` text,
	`duration_minutes` integer,
	`learning_goals_json` text,
	`success_criteria_json` text,
	`vocabulary_json` text,
	`materials_json` text,
	`teacher_prep` text,
	`assessment_plan` text,
	`differentiation_support` text,
	`extension` text,
	`cross_curricular` text,
	`staff_lead` text,
	`student_characters` text,
	`character_rationale` text,
	`source_provenance` text,
	`editorial_status` text,
	`review_state` text,
	`review_flags` text,
	`version` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `lesson_materials` (
	`id` integer PRIMARY KEY NOT NULL,
	`lesson_id` integer,
	`material_kind` text,
	`material_id` integer,
	`role` text,
	`use_in_phase` text,
	`teacher_rationale` text,
	`verification_state` text,
	`source_table` text,
	`source_row_id` integer
);
--> statement-breakpoint
CREATE TABLE `lesson_resource_guidance` (
	`id` integer PRIMARY KEY NOT NULL,
	`lesson_id` integer,
	`resource_id` integer,
	`relevance` text,
	`use_in_phase` text,
	`teacher_rationale` text,
	`verification_state` text,
	`scope_note` text
);
--> statement-breakpoint
CREATE TABLE `lesson_review` (
	`id` integer PRIMARY KEY NOT NULL,
	`lesson_id` integer,
	`source_topic_present` integer,
	`standards_present` integer,
	`linked_songs_count` integer,
	`linked_resources_count` integer,
	`step_count` integer,
	`worksheet_count` integer,
	`search_prompt_count` integer,
	`completeness_score` integer,
	`review_state` text,
	`automated_flags` text,
	`reviewer_notes` text,
	`reviewed_at` text
);
--> statement-breakpoint
CREATE TABLE `lesson_search_prompts` (
	`id` integer PRIMARY KEY NOT NULL,
	`lesson_id` integer,
	`prompt_type` text,
	`prompt` text,
	`rationale` text
);
--> statement-breakpoint
CREATE TABLE `lesson_song_guidance` (
	`id` integer PRIMARY KEY NOT NULL,
	`lesson_id` integer,
	`song_id` integer,
	`relevance` text,
	`use_in_phase` text,
	`teacher_rationale` text
);
--> statement-breakpoint
CREATE TABLE `lesson_steps` (
	`id` integer PRIMARY KEY NOT NULL,
	`lesson_id` integer,
	`step_order` integer,
	`phase` text,
	`title` text,
	`minutes` integer,
	`teacher_actions` text,
	`student_actions` text,
	`look_fors` text,
	`assessment_prompt` text,
	`resource_state` text,
	`resource_note` text
);
--> statement-breakpoint
CREATE TABLE `MATERIAL_RELATIONS` (
	`id` integer PRIMARY KEY NOT NULL,
	`from_kind` text,
	`from_id` integer,
	`relation_type` text,
	`to_kind` text,
	`to_id` integer
);
--> statement-breakpoint
CREATE TABLE `MATERIAL_TAGS` (
	`id` integer PRIMARY KEY NOT NULL,
	`material_kind` text NOT NULL,
	`material_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	FOREIGN KEY (`tag_id`) REFERENCES `TAGS`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `research_queue` (
	`id` text PRIMARY KEY NOT NULL,
	`priority` integer NOT NULL,
	`resource` text NOT NULL,
	`why_it_matters` text,
	`source_url` text,
	`download_filename` text,
	`assigned_to` text,
	`status` text DEFAULT 'Download needed',
	`notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `research_sources` (
	`id` text PRIMARY KEY NOT NULL,
	`educator_org` text NOT NULL,
	`source_title` text NOT NULL,
	`source_type` text NOT NULL,
	`age_setting` text,
	`songs_covered` text,
	`direct_url` text,
	`local_pdf_filename` text,
	`download_status` text DEFAULT 'Download needed',
	`research_notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `RESOURCES` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`type` text,
	`description` text,
	`url` text,
	`free` integer,
	`paywalled` integer,
	`verified` integer,
	`source_id` integer
);
--> statement-breakpoint
CREATE TABLE `schema_migrations` (
	`migration_id` text PRIMARY KEY NOT NULL,
	`applied_at` text,
	`omhas_sha256` text,
	`curriculum_sha256` text,
	`generated_sha256` text
);
--> statement-breakpoint
CREATE TABLE `search_chunk_sources` (
	`search_chunk_id` text NOT NULL,
	`source_document_id` integer NOT NULL,
	FOREIGN KEY (`search_chunk_id`) REFERENCES `search_chunks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`source_document_id`) REFERENCES `source_documents`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `search_chunks` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`source_path` text NOT NULL,
	`url` text NOT NULL,
	`title` text NOT NULL,
	`chunk_text` text NOT NULL,
	`lyrics` text,
	`instructions` text,
	`embedding` text,
	`meta` text DEFAULT '{}',
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `song_action_chunks` (
	`id` text PRIMARY KEY NOT NULL,
	`song_action_id` text NOT NULL,
	`search_chunk_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`song_action_id`) REFERENCES `song_actions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`search_chunk_id`) REFERENCES `search_chunks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `song_actions` (
	`id` text PRIMARY KEY NOT NULL,
	`song_title` text NOT NULL,
	`alternate_title` text,
	`tradition_performer` text,
	`action_wording` text,
	`normalized_action` text,
	`action_sequence` text,
	`song_cue` text,
	`action_classification` text,
	`core_or_optional` text,
	`age_range_stated` text,
	`educator_org` text,
	`source_title` text,
	`source_type` text,
	`page_timestamp` text,
	`source_url` text,
	`evidence_note` text,
	`research_status` text DEFAULT 'Not started',
	`reviewer_notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `song_curriculum_links` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`song_id` integer NOT NULL,
	`subject` text NOT NULL,
	`description` text NOT NULL,
	`relevance` text,
	`link_type` text DEFAULT 'curriculum' NOT NULL,
	FOREIGN KEY (`song_id`) REFERENCES `SONGS`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `SONGS` (
	`id` integer PRIMARY KEY NOT NULL,
	`song_name` text NOT NULL,
	`artist` text,
	`catalog` text,
	`lyrics` text,
	`url` text,
	`instructions` text,
	`actions` text,
	`age_range` text,
	`source_id` integer,
	`verified` integer,
	`type` text,
	`educational_domain` text,
	`materials_needed` text,
	`tags` text,
	`creator_artist` text,
	`source_title` text,
	`curriculum_links` text,
	`early_years_links` text,
	`markdown_path` text
);
--> statement-breakpoint
CREATE TABLE `source_documents` (
	`id` integer PRIMARY KEY NOT NULL,
	`source_path` text NOT NULL,
	`source_kind` text,
	`review_state` text,
	`checksum` text,
	`imported_at` text
);
--> statement-breakpoint
CREATE TABLE `SOURCES` (
	`id` integer PRIMARY KEY NOT NULL,
	`path_or_url` text,
	`type` text,
	`checksum` text
);
--> statement-breakpoint
CREATE TABLE `STANDARDS` (
	`id` integer PRIMARY KEY NOT NULL,
	`parent_standard_id` integer,
	`framework` text,
	`code` text,
	`full_text` text,
	`source` text,
	`external_id` text,
	FOREIGN KEY (`parent_standard_id`) REFERENCES `STANDARDS`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `SUBJECTS` (
	`id` integer PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`label` text NOT NULL,
	`sort_order` integer
);
--> statement-breakpoint
CREATE TABLE `TAGS` (
	`id` integer PRIMARY KEY NOT NULL,
	`parent_tag_id` integer,
	`name` text NOT NULL,
	`definition` text,
	FOREIGN KEY (`parent_tag_id`) REFERENCES `TAGS`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `TOPIC_GRADES` (
	`id` integer PRIMARY KEY NOT NULL,
	`topic_id` integer NOT NULL,
	`grade_id` integer NOT NULL,
	FOREIGN KEY (`topic_id`) REFERENCES `TOPICS`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`grade_id`) REFERENCES `GRADES`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `TOPIC_MATERIALS` (
	`id` integer PRIMARY KEY NOT NULL,
	`topic_id` integer NOT NULL,
	`material_kind` text NOT NULL,
	`material_id` integer NOT NULL,
	`role` text,
	`use_in_phase` text,
	`routine_slot` text,
	`teacher_rationale` text,
	FOREIGN KEY (`topic_id`) REFERENCES `TOPICS`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `TOPIC_STANDARDS` (
	`id` integer PRIMARY KEY NOT NULL,
	`topic_id` integer NOT NULL,
	`standard_id` integer NOT NULL,
	`alignment_notes` text,
	FOREIGN KEY (`topic_id`) REFERENCES `TOPICS`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`standard_id`) REFERENCES `STANDARDS`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `TOPIC_TAGS` (
	`id` integer PRIMARY KEY NOT NULL,
	`topic_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	FOREIGN KEY (`topic_id`) REFERENCES `TOPICS`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `TAGS`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `TOPICS` (
	`id` integer PRIMARY KEY NOT NULL,
	`subject_id` integer,
	`category` text,
	`lesson_topic` text NOT NULL,
	`skill_statement` text,
	`seq_num` real,
	`taught` text,
	`merged_into_topic_id` integer,
	`circle_time_slot` text,
	FOREIGN KEY (`subject_id`) REFERENCES `SUBJECTS`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`merged_into_topic_id`) REFERENCES `TOPICS`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `WEEKLY_PACING` (
	`id` integer PRIMARY KEY NOT NULL,
	`topic_grade_id` integer NOT NULL,
	`week_number` integer NOT NULL,
	`month` text,
	`notes` text,
	FOREIGN KEY (`topic_grade_id`) REFERENCES `TOPIC_GRADES`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `worksheet_briefs` (
	`id` integer PRIMARY KEY NOT NULL,
	`lesson_id` integer,
	`worksheet_order` integer,
	`title` text,
	`purpose` text,
	`activity_type` text,
	`child_directions` text,
	`answer_key_guidance` text,
	`visual_notes` text,
	`differentiation` text,
	`materials_json` text,
	`generation_prompt` text,
	`status` text,
	`review_flags` text,
	`lesson_asset_id` integer
);
