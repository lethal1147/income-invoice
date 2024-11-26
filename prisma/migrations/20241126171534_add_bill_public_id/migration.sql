/*
  Warnings:

  - A unique constraint covering the columns `[billPublicId]` on the table `BillMenus` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `billPublicId` to the `BillMenus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BillMenus" ADD COLUMN     "billPublicId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BillMenus_billPublicId_key" ON "BillMenus"("billPublicId");

-- CreateIndex
CREATE INDEX "BillMenus_billPublicId_idx" ON "BillMenus"("billPublicId");
