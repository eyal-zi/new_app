ALTER TABLE "sessions" ALTER COLUMN "status" SET DEFAULT 'running';
--> statement-breakpoint
UPDATE "sessions" SET "status" = 'running' WHERE "status" = 'pending';
--> statement-breakpoint
UPDATE "sessions" SET "status" = 'started' WHERE "status" = 'in_progress';
