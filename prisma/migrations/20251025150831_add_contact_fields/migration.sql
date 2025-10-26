/*
  Warnings:

  - You are about to drop the `footer_links` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `footers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `footer_description` on the `site_settings` table. All the data in the column will be lost.
  - You are about to drop the column `support_email` on the `site_settings` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "footer_links";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "footers";
PRAGMA foreign_keys=on;

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
    "phone" TEXT NOT NULL DEFAULT '+1 (555) 123-4567',
    "address" TEXT NOT NULL DEFAULT '123 Content Street
Creative District
New York, NY 10001
United States',
    "social_links" JSONB,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "google_analytics_id" TEXT,
    "maintenance_mode" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" DATETIME NOT NULL,
    "updated_by" TEXT
);
INSERT INTO "new_site_settings" ("contact_email", "copyright", "favicon_url", "google_analytics_id", "id", "logo_url", "maintenance_mode", "meta_description", "meta_title", "site_description", "site_name", "social_links", "updated_at", "updated_by") SELECT "contact_email", "copyright", "favicon_url", "google_analytics_id", "id", "logo_url", "maintenance_mode", "meta_description", "meta_title", "site_description", "site_name", "social_links", "updated_at", "updated_by" FROM "site_settings";
DROP TABLE "site_settings";
ALTER TABLE "new_site_settings" RENAME TO "site_settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
