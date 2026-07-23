CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text NOT NULL,
	"role" varchar(20) DEFAULT 'admin' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "admissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_name" text NOT NULL,
	"guardian_name" text NOT NULL,
	"phone" varchar(20) NOT NULL,
	"email" text,
	"grade_applying" varchar(10) NOT NULL,
	"dob" text NOT NULL,
	"address" text NOT NULL,
	"previous_school" text,
	"message" text,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "albums" (
	"id" serial PRIMARY KEY NOT NULL,
	"title_en" text NOT NULL,
	"title_np" text NOT NULL,
	"description_en" text,
	"description_np" text,
	"cover_url" text NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"album_id" integer NOT NULL,
	"url" text NOT NULL,
	"caption_en" text,
	"caption_np" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hero_slides" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_url" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notices" (
	"id" serial PRIMARY KEY NOT NULL,
	"title_en" text NOT NULL,
	"title_np" text NOT NULL,
	"content_en" text NOT NULL,
	"content_np" text NOT NULL,
	"category" varchar(50) DEFAULT 'general' NOT NULL,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"pdf_url" text,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "results" (
	"id" serial PRIMARY KEY NOT NULL,
	"roll_no" varchar(30) NOT NULL,
	"student_name" text NOT NULL,
	"grade" varchar(10) NOT NULL,
	"academic_year" varchar(20) NOT NULL,
	"exam_type" varchar(30) DEFAULT 'terminal' NOT NULL,
	"subjects" jsonb DEFAULT '{}' NOT NULL,
	"total_marks" integer,
	"obtained_marks" integer,
	"percentage" text,
	"division" varchar(30),
	"remarks" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"key" varchar(100) PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" serial PRIMARY KEY NOT NULL,
	"name_en" text NOT NULL,
	"name_np" text NOT NULL,
	"role_en" text NOT NULL,
	"role_np" text NOT NULL,
	"department" varchar(80) DEFAULT 'general' NOT NULL,
	"qualification" text,
	"photo_url" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
CREATE TABLE "calendar_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"month_name" varchar(30) NOT NULL,
	"month_index" integer NOT NULL,
	"days" jsonb DEFAULT '[]' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_name" text NOT NULL,
	"sender_email" text NOT NULL,
	"sender_phone" varchar(30),
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"is_replied" boolean DEFAULT false NOT NULL,
	"admin_notes" text,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title_en" text NOT NULL,
	"title_np" text NOT NULL,
	"date_bs" varchar(50) NOT NULL,
	"date_en" varchar(50) NOT NULL,
	"description_en" text,
	"description_np" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "milestones" (
	"id" serial PRIMARY KEY NOT NULL,
	"title_en" text NOT NULL,
	"title_np" text NOT NULL,
	"date_label" varchar(50) NOT NULL,
	"year_ad" varchar(20),
	"description_en" text NOT NULL,
	"description_np" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "calendar_data" ADD COLUMN "academic_year" varchar(10) DEFAULT '२०८३' NOT NULL;
CREATE TABLE "academic_programs" (
	"id" serial PRIMARY KEY NOT NULL,
	"level_en" varchar(50) NOT NULL,
	"level_np" varchar(50) NOT NULL,
	"description_en" text NOT NULL,
	"description_np" text NOT NULL,
	"subjects" jsonb DEFAULT '[]' NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_promotions" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"from_class" varchar(20) NOT NULL,
	"to_class" varchar(20) NOT NULL,
	"from_academic_year" varchar(10) NOT NULL,
	"to_academic_year" varchar(10) NOT NULL,
	"result_id" integer,
	"promotion_type" varchar(20) DEFAULT 'auto' NOT NULL,
	"remarks" text,
	"promoted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"reg_no" varchar(30) NOT NULL,
	"student_name_en" text NOT NULL,
	"student_name_np" text DEFAULT '' NOT NULL,
	"dob" varchar(30),
	"gender" varchar(10) DEFAULT 'Male' NOT NULL,
	"religion" varchar(50),
	"ethnicity" varchar(50),
	"guardian_name" text DEFAULT '' NOT NULL,
	"guardian_relation" varchar(30),
	"contact_no" varchar(20),
	"address" text,
	"current_class" varchar(20) NOT NULL,
	"current_section" varchar(5) DEFAULT 'A',
	"roll_no" varchar(20),
	"academic_year" varchar(10) NOT NULL,
	"status" varchar(20) DEFAULT 'Active' NOT NULL,
	"photo_url" text,
	"previous_school" text,
	"admission_date" varchar(30),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "students_reg_no_unique" UNIQUE("reg_no")
);
--> statement-breakpoint
ALTER TABLE "hero_slides" ADD COLUMN "caption" text;--> statement-breakpoint
ALTER TABLE "student_promotions" ADD CONSTRAINT "student_promotions_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_promotions" ADD CONSTRAINT "student_promotions_result_id_results_id_fk" FOREIGN KEY ("result_id") REFERENCES "public"."results"("id") ON DELETE no action ON UPDATE no action;
