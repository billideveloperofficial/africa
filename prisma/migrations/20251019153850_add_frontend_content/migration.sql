-- CreateTable
CREATE TABLE "frontend_content" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "section" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "updated_by" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "frontend_content_section_key_key" ON "frontend_content"("section", "key");
