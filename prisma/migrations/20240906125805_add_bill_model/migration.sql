-- CreateTable
CREATE TABLE "PartyBill" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PartyBill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillMenus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "pricePerItem" INTEGER NOT NULL,
    "partyBillId" TEXT NOT NULL,

    CONSTRAINT "BillMenus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillMembers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "partyBillId" TEXT NOT NULL,

    CONSTRAINT "BillMembers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberMenus" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "billMembersId" TEXT NOT NULL,

    CONSTRAINT "MemberMenus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PartyBill_userId_idx" ON "PartyBill"("userId");

-- AddForeignKey
ALTER TABLE "PartyBill" ADD CONSTRAINT "PartyBill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillMenus" ADD CONSTRAINT "BillMenus_partyBillId_fkey" FOREIGN KEY ("partyBillId") REFERENCES "PartyBill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillMembers" ADD CONSTRAINT "BillMembers_partyBillId_fkey" FOREIGN KEY ("partyBillId") REFERENCES "PartyBill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberMenus" ADD CONSTRAINT "MemberMenus_billMembersId_fkey" FOREIGN KEY ("billMembersId") REFERENCES "BillMembers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
