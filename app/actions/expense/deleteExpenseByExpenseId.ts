'use server'

import { formatErrorMessage } from "@/utils/formatter";

export async function deleteExpenseByExpenseId(expenseId: string) {
  try {
    await prisma?.expense.delete({
      where: { id: expenseId },
    });
    return { error: false, message: "Delete expense successfully." };
  } catch (err) {
    return { error: true, message: formatErrorMessage(err) };
  }
}
