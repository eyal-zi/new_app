ALTER TABLE "sessions" ADD COLUMN "variationa_info" jsonb;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "variationb_info" jsonb;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "recommendations" jsonb;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "statistics" jsonb;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "training_type" text;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "s8_link" text;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "evaluated_image_url" text;