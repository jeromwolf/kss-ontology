CREATE TABLE "daily_insights" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"date" timestamp NOT NULL,
	"companies" jsonb NOT NULL,
	"relationships" jsonb NOT NULL,
	"urgent_items" jsonb NOT NULL,
	"watch_items" jsonb NOT NULL,
	"opportunity_items" jsonb NOT NULL,
	"summary" text,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "entities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"type" varchar(50) NOT NULL,
	"first_seen" timestamp DEFAULT now() NOT NULL,
	"last_seen" timestamp DEFAULT now() NOT NULL,
	"mention_count" integer DEFAULT 1 NOT NULL,
	"source_links" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "news_articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"link" text NOT NULL,
	"title" varchar(500),
	"pub_date" timestamp,
	"source" varchar(100),
	"fetched_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "news_articles_link_unique" UNIQUE("link")
);
--> statement-breakpoint
CREATE TABLE "relationships" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_entity_id" integer NOT NULL,
	"target_entity_id" integer NOT NULL,
	"relation_type" varchar(50) NOT NULL,
	"confidence" integer NOT NULL,
	"first_seen" timestamp DEFAULT now() NOT NULL,
	"last_seen" timestamp DEFAULT now() NOT NULL,
	"source_links" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"notification_enabled" boolean DEFAULT true NOT NULL,
	"notification_time" varchar(5) DEFAULT '08:00',
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "watchlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"company_name" varchar(100) NOT NULL,
	"ticker" varchar(20),
	"priority" integer DEFAULT 5 NOT NULL,
	"notes" text,
	"added_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "daily_insights" ADD CONSTRAINT "daily_insights_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_source_entity_id_entities_id_fk" FOREIGN KEY ("source_entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_target_entity_id_entities_id_fk" FOREIGN KEY ("target_entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "daily_insights_user_id_idx" ON "daily_insights" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "daily_insights_date_idx" ON "daily_insights" USING btree ("date");--> statement-breakpoint
CREATE INDEX "entities_name_idx" ON "entities" USING btree ("name");--> statement-breakpoint
CREATE INDEX "entities_type_idx" ON "entities" USING btree ("type");--> statement-breakpoint
CREATE INDEX "news_articles_link_idx" ON "news_articles" USING btree ("link");--> statement-breakpoint
CREATE INDEX "news_articles_pub_date_idx" ON "news_articles" USING btree ("pub_date");--> statement-breakpoint
CREATE INDEX "relationships_source_idx" ON "relationships" USING btree ("source_entity_id");--> statement-breakpoint
CREATE INDEX "relationships_target_idx" ON "relationships" USING btree ("target_entity_id");--> statement-breakpoint
CREATE INDEX "relationships_type_idx" ON "relationships" USING btree ("relation_type");--> statement-breakpoint
CREATE INDEX "watchlist_user_id_idx" ON "watchlist" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "watchlist_company_name_idx" ON "watchlist" USING btree ("company_name");