/*
  Warnings:

  - You are about to drop the column `footer_description` on the `site_settings` table. All the data in the column will be lost.
  - You are about to drop the column `footer_sections` on the `site_settings` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "footers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "updated_by" TEXT
);

-- CreateTable
CREATE TABLE "footer_links" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "footer_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'URL',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "updated_by" TEXT,
    CONSTRAINT "footer_links_footer_id_fkey" FOREIGN KEY ("footer_id") REFERENCES "footers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_site_settings" (
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
INSERT INTO "new_site_settings" ("contact_email", "copyright", "favicon_url", "google_analytics_id", "id", "logo_url", "maintenance_mode", "meta_description", "meta_title", "site_description", "site_name", "social_links", "support_email", "updated_at", "updated_by") SELECT "contact_email", "copyright", "favicon_url", "google_analytics_id", "id", "logo_url", "maintenance_mode", "meta_description", "meta_title", "site_description", "site_name", "social_links", "support_email", "updated_at", "updated_by" FROM "site_settings";
DROP TABLE "site_settings";
ALTER TABLE "new_site_settings" RENAME TO "site_settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
