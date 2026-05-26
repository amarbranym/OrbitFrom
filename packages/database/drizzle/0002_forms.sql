CREATE TABLE "forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"slug" varchar(120) NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"visibility" varchar(20) DEFAULT 'unlisted' NOT NULL,
	"presentation_mode" varchar(20) DEFAULT 'classic' NOT NULL,
	"theme" jsonb NOT NULL,
	"settings" jsonb,
	"fields" jsonb NOT NULL,
	"logic" jsonb,
	"response_count" integer DEFAULT 0 NOT NULL,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"answers" jsonb NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ip_hash" varchar(64),
	"user_agent" text
);
--> statement-breakpoint
ALTER TABLE "forms" ADD CONSTRAINT "forms_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "forms_user_id_idx" ON "forms" ("user_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "forms_slug_unique" ON "forms" ("slug");
--> statement-breakpoint
CREATE INDEX "forms_status_visibility_idx" ON "forms" ("status","visibility");
--> statement-breakpoint
CREATE INDEX "form_submissions_form_id_submitted_at_idx" ON "form_submissions" ("form_id","submitted_at");
