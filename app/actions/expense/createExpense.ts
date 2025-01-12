"use server";

import { db } from "@/lib/db";
import {
  createExpenseBodySchema,
  CreateExpenseBodySchema,
} from "@/schema/expense";
import dayjs from "dayjs";
import { formatErrorMessage } from "@/utils/formatter";

export async function createExpense(body: CreateExpenseBodySchema) {
  const validatedFields = createExpenseBodySchema.safeParse(body);
  if (!validatedFields.success) {
    return { error: true, message: "Invalid body." };
  }

  const { name, date, description, total, expenseTag, walletId, userId, type } =
    validatedFields.data;

  try {
    await db.$transaction(async (prisma) => {
      const expenseTags = [];
      const wallet = await prisma.wallet.findUnique({
        where: {
          id: walletId,
        },
      });
      if (!wallet) {
        throw new Error("Wallet is not found.");
      }
      let newBalance = wallet.balance;
      if (type === "i") {
        newBalance += +total;
      } else {
        newBalance -= +total;
      }

      await prisma.wallet.update({
        where: {
          id: walletId,
        },
        data: {
          balance: newBalance,
        },
      });

      for (let i = 0; i < expenseTag.length; i++) {
        const tag = expenseTag[i];
        const existTag = await prisma.tag.findFirst({
          where: {
            userId,
            name: tag.label,
          },
        });
        if (!existTag) {
          const newTag = await prisma.tag.create({
            data: {
              name: tag.value,
              userId,
            },
          });
          expenseTags.push(newTag.id);
        } else {
          expenseTags.push(existTag.id);
        }
      }

      const dateThai = dayjs(date).add(7, "hour").toDate();
      const newExpense = await prisma.expense.create({
        data: {
          title: name,
          description: description || "",
          total: +total || 0,
          type,
          date: dateThai,
          userId,
          walletId,
        },
      });

      for (let i = 0; i < expenseTags.length; i++) {
        await prisma.expenseTag.create({
          data: {
            expenseId: newExpense.id,
            tagId: expenseTags[i],
          },
        });
      }
    });

    return { error: false, message: "Create new expense successfully." };
  } catch (err) {
    return {
      error: true,
      message: formatErrorMessage(err),
    };
  }
}
