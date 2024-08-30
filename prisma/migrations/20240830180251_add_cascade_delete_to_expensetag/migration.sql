-- DropForeignKey
ALTER TABLE "ExpenseTag" DROP CONSTRAINT "ExpenseTag_expenseId_fkey";

-- AddForeignKey
ALTER TABLE "ExpenseTag" ADD CONSTRAINT "ExpenseTag_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense"("id") ON DELETE CASCADE ON UPDATE CASCADE;
