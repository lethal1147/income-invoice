-- CreateEnum
CREATE TYPE "MemberPaymentStatus" AS ENUM ('paid', 'idle');

-- AlterTable
ALTER TABLE "BillMembers" ADD COLUMN     "status" "MemberPaymentStatus" NOT NULL DEFAULT 'idle';
