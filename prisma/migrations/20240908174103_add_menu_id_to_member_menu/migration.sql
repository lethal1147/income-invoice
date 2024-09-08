/*
  Warnings:

  - Added the required column `billMenuId` to the `MemberMenus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MemberMenus" ADD COLUMN     "billMenuId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "MemberMenus" ADD CONSTRAINT "MemberMenus_billMenuId_fkey" FOREIGN KEY ("billMenuId") REFERENCES "BillMenus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
