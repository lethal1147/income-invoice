/*
  Warnings:

  - You are about to drop the column `billPublicId` on the `BillMenus` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[billPublicId]` on the table `PartyBill` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `billPublicId` to the `PartyBill` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "BillMenus_billPublicId_idx";

-- DropIndex
DROP INDEX "BillMenus_billPublicId_key";

-- AlterTable
ALTER TABLE "BillMenus" DROP COLUMN "billPublicId";

-- AlterTable
ALTER TABLE "PartyBill" ADD COLUMN     "billPublicId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PartyBill_billPublicId_key" ON "PartyBill"("billPublicId");

-- CreateIndex
CREATE INDEX "PartyBill_billPublicId_idx" ON "PartyBill"("billPublicId");
