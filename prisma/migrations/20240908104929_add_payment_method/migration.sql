/*
  Warnings:

  - Added the required column `bank` to the `PartyBill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bankNumber` to the `PartyBill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `PartyBill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `promptpay` to the `PartyBill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qrcode` to the `PartyBill` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('promptpay', 'bank', 'qrcode');

-- AlterTable
ALTER TABLE "PartyBill" ADD COLUMN     "bank" TEXT NOT NULL,
ADD COLUMN     "bankNumber" TEXT NOT NULL,
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL,
ADD COLUMN     "promptpay" TEXT NOT NULL,
ADD COLUMN     "qrcode" TEXT NOT NULL;
