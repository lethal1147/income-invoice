/*
  Warnings:

  - Added the required column `serviceChargeFlag` to the `PartyBill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vatFlag` to the `PartyBill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PartyBill" ADD COLUMN     "serviceChargeFlag" BOOLEAN NOT NULL,
ADD COLUMN     "vatFlag" BOOLEAN NOT NULL;
