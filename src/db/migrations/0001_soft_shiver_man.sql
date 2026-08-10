CREATE TABLE "action_vocabulary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"normalized_action_family" text NOT NULL,
	"examples" text,
	"do_not_use_as_proof" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "curriculum_topic_songs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"curriculum_topic_id" uuid NOT NULL,
	"search_chunk_id" uuid NOT NULL,
	"link_type" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "curriculum_topics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"grade_key" text NOT NULL,
	"grade" text NOT NULL,
	"early_years" boolean NOT NULL,
	"subject" text NOT NULL,
	"category" text,
	"seq_number" integer,
	"lesson_topic" text NOT NULL,
	"skill_statement" text,
	"standards" text,
	"song_count" integer DEFAULT 0,
	"linked_songs" text,
	"linked_resources" text,
	"tags" text,
	"circle_time_slot" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "research_queue" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"priority" integer NOT NULL,
	"resource" text NOT NULL,
	"why_it_matters" text,
	"source_url" text,
	"download_filename" text,
	"assigned_to" text,
	"status" text DEFAULT 'Download needed',
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "research_sources" (
	"id" text PRIMARY KEY NOT NULL,
	"educator_org" text NOT NULL,
	"source_title" text NOT NULL,
	"source_type" text NOT NULL,
	"age_setting" text,
	"songs_covered" text,
	"direct_url" text,
	"local_pdf_filename" text,
	"download_status" text DEFAULT 'Download needed',
	"research_notes" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "song_action_chunks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"song_action_id" uuid NOT NULL,
	"search_chunk_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "song_actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"song_title" text NOT NULL,
	"alternate_title" text,
	"tradition_performer" text,
	"action_wording" text,
	"normalized_action" text,
	"action_sequence" text,
	"song_cue" text,
	"action_classification" text,
	"core_or_optional" text,
	"age_range_stated" text,
	"educator_org" text,
	"source_title" text,
	"source_type" text,
	"page_timestamp" text,
	"source_url" text,
	"evidence_note" text,
	"research_status" text DEFAULT 'Not started',
	"reviewer_notes" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "curriculum_topic_songs" ADD CONSTRAINT "curriculum_topic_songs_curriculum_topic_id_curriculum_topics_id_fk" FOREIGN KEY ("curriculum_topic_id") REFERENCES "public"."curriculum_topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "curriculum_topic_songs" ADD CONSTRAINT "curriculum_topic_songs_search_chunk_id_search_chunks_id_fk" FOREIGN KEY ("search_chunk_id") REFERENCES "public"."search_chunks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "song_action_chunks" ADD CONSTRAINT "song_action_chunks_song_action_id_song_actions_id_fk" FOREIGN KEY ("song_action_id") REFERENCES "public"."song_actions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "song_action_chunks" ADD CONSTRAINT "song_action_chunks_search_chunk_id_search_chunks_id_fk" FOREIGN KEY ("search_chunk_id") REFERENCES "public"."search_chunks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "action_vocabulary_family_idx" ON "action_vocabulary" USING btree ("normalized_action_family");--> statement-breakpoint
CREATE INDEX "curriculum_topic_songs_topic_idx" ON "curriculum_topic_songs" USING btree ("curriculum_topic_id");--> statement-breakpoint
CREATE INDEX "curriculum_topic_songs_chunk_idx" ON "curriculum_topic_songs" USING btree ("search_chunk_id");--> statement-breakpoint
CREATE INDEX "curriculum_topics_grade_key_idx" ON "curriculum_topics" USING btree ("grade_key");--> statement-breakpoint
CREATE INDEX "curriculum_topics_subject_idx" ON "curriculum_topics" USING btree ("subject");--> statement-breakpoint
CREATE INDEX "curriculum_topics_early_years_idx" ON "curriculum_topics" USING btree ("early_years");--> statement-breakpoint
CREATE INDEX "curriculum_topics_circle_time_idx" ON "curriculum_topics" USING btree ("circle_time_slot");--> statement-breakpoint
CREATE INDEX "research_queue_priority_idx" ON "research_queue" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "research_queue_status_idx" ON "research_queue" USING btree ("status");--> statement-breakpoint
CREATE INDEX "research_sources_download_status_idx" ON "research_sources" USING btree ("download_status");--> statement-breakpoint
CREATE INDEX "song_action_chunks_action_idx" ON "song_action_chunks" USING btree ("song_action_id");--> statement-breakpoint
CREATE INDEX "song_action_chunks_chunk_idx" ON "song_action_chunks" USING btree ("search_chunk_id");--> statement-breakpoint
CREATE INDEX "song_actions_song_title_idx" ON "song_actions" USING btree ("song_title");--> statement-breakpoint
CREATE INDEX "song_actions_normalized_action_idx" ON "song_actions" USING btree ("normalized_action");--> statement-breakpoint
CREATE INDEX "song_actions_research_status_idx" ON "song_actions" USING btree ("research_status");