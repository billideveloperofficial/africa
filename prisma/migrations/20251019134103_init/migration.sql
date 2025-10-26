-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" DATETIME
);

-- CreateTable
CREATE TABLE "creators" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "bio" TEXT,
    "skills" TEXT,
    "social_links" TEXT,
    "portfolio_urls" TEXT,
    "sample_media" TEXT,
    "rates" JSONB,
    "metrics" JSONB,
    CONSTRAINT "creators_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "company_website" TEXT,
    "billing_info" JSONB,
    CONSTRAINT "brands_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "briefs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brand_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "budget" REAL,
    "deliverables" TEXT,
    "deadline" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    CONSTRAINT "briefs_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "offers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brief_id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "brand_id" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "platform_fee" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    CONSTRAINT "offers_brief_id_fkey" FOREIGN KEY ("brief_id") REFERENCES "briefs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "offers_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "creators" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "offers_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "offer_id" TEXT NOT NULL,
    "stripe_payment_id" TEXT,
    "amount" REAL NOT NULL,
    "platform_fee" REAL NOT NULL,
    "payout_status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "transactions_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "communities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "communities_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "community_members" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "community_id" TEXT NOT NULL,
    "joined_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "community_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "community_members_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "communities" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "community_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "posts_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "communities" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversation_id" TEXT NOT NULL,
    "from_user_id" TEXT NOT NULL,
    "to_user_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "read_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "messages_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "messages_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "audience_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "creator_id" TEXT NOT NULL,
    "country_breakdown" JSONB NOT NULL,
    "age_breakdown" JSONB NOT NULL,
    "gender_breakdown" JSONB NOT NULL,
    "languages" JSONB NOT NULL,
    "fake_follower_score" REAL,
    "last_updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audience_profiles_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "creators" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "content_metrics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "post_id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "impressions" INTEGER,
    "views" INTEGER,
    "likes" INTEGER,
    "comments" INTEGER,
    "engagement_rate" REAL,
    "date_collected" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "content_metrics_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "creators" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "campaign_metrics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaign_id" TEXT NOT NULL,
    "brief_id" TEXT NOT NULL,
    "impressions" INTEGER,
    "clicks" INTEGER,
    "conversions" INTEGER,
    "spend" REAL,
    "date_collected" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "campaign_metrics_brief_id_fkey" FOREIGN KEY ("brief_id") REFERENCES "briefs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "site_name" TEXT NOT NULL DEFAULT 'Content Africa',
    "site_description" TEXT,
    "favicon_url" TEXT,
    "logo_url" TEXT,
    "copyright" TEXT NOT NULL DEFAULT '© 2024 Content Africa. All rights reserved.',
    "contact_email" TEXT NOT NULL DEFAULT 'hello@contentafrica.com',
    "support_email" TEXT NOT NULL DEFAULT 'support@contentafrica.com',
    "social_links" JSONB,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "google_analytics_id" TEXT,
    "maintenance_mode" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" DATETIME NOT NULL,
    "updated_by" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "creators_user_id_key" ON "creators"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "brands_user_id_key" ON "brands"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "communities_slug_key" ON "communities"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "community_members_user_id_community_id_key" ON "community_members"("user_id", "community_id");

-- CreateIndex
CREATE UNIQUE INDEX "audience_profiles_creator_id_key" ON "audience_profiles"("creator_id");
