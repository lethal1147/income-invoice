"use server";

import { formatErrorMessage } from "@/utils/formatter";

export async function deleteExpenseByExpenseId(expenseId: string) {
  try {
    const existExpense = await prisma?.expense.findFirst({
      where: {
        id: expenseId,
      },
    });
    if (!existExpense)
      throw new Error(`Expense id '${expenseId}' is not exist`);

    const wallet = await prisma?.wallet.findFirst({
      where: {
        id: existExpense.walletId,
      },
    });
    if (!wallet)
      throw new Error(`Wallet id '${existExpense.walletId}' is not exist`);
    const newBalance =
      existExpense.type === "e"
        ? wallet?.balance + existExpense.total
        : wallet?.balance - existExpense.total;

    await prisma?.wallet.update({
      where: {
        id: existExpense.walletId,
      },
      data: {
        balance: newBalance,
      },
    });
    await prisma?.expense.delete({
      where: { id: expenseId },
    });
    return { error: false, message: "Delete expense successfully." };
  } catch (err) {
    return { error: true, message: formatErrorMessage(err) };
  }
}
