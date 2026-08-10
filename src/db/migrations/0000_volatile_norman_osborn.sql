CREATE TABLE "search_chunks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" text NOT NULL,
	"source_path" text NOT NULL,
	"url" text NOT NULL,
	"title" text NOT NULL,
	"chunk_text" text NOT NULL,
	"embedding" vector(384),
	"meta" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "search_chunks_kind_idx" ON "search_chunks" USING btree ("kind");--> statement-breakpoint
CREATE INDEX "search_chunks_source_path_idx" ON "search_chunks" USING btree ("source_path");