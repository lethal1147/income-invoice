"use server";

import { db } from "@/lib/db";
import {
  createExpenseBodySchema,
  CreateExpenseBodySchema,
} from "@/schema/expense";
import { formatErrorMessage } from "@/utils/formatter";
import dayjs from "dayjs";

export async function updateExpenseById(
  id: string,
  body: CreateExpenseBodySchema
) {
  const validatedFields = createExpenseBodySchema.safeParse(body);
  if (!validatedFields.success || !id) {
    return { error: true, message: "Invalid body." };
  }

  try {
    await db.$transaction(async (prisma) => {
      const existExpense = await prisma.expense.findUnique({
        where: { id },
        include: {
          user: true,
          wallet: true,
          expenseTag: {
            include: {
              tag: true,
            },
          },
        },
      });

      if (!existExpense) {
        return { error: true, message: "Expenss not found." };
      }

      const {
        name,
        date,
        description,
        total,
        expenseTag,
        walletId,
        userId,
        type,
      } = validatedFields.data;

      const wallet = await prisma.wallet.findUnique({
        where: {
          id: walletId,
        },
      });
      if (!wallet) {
        throw new Error("Wallet is not found.");
      }

      const difference = existExpense.total - +total;
      const newBalance =
        type === "e"
          ? wallet.balance + difference
          : wallet.balance - difference;

      await prisma.wallet.update({
        where: {
          id: walletId,
        },
        data: {
          balance: newBalance,
        },
      });

      const expenseTags = [];
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

      await prisma.expenseTag.deleteMany({
        where: {
          id: {
            in: existExpense.expenseTag.map((expTag) => expTag.id),
          },
        },
      });

      for (let i = 0; i < expenseTags.length; i++) {
        await prisma.expenseTag.create({
          data: {
            expenseId: existExpense.id,
            tagId: expenseTags[i],
          },
        });
      }
      const dateThai = dayjs(date).add(7, "hour").toDate();
      await prisma.expense.update({
        where: {
          id,
        },
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
    });

    return {
      error: false,
      message: "Update expense successfully.",
    };
  } catch (err) {
    return {
      error: true,
      message: formatErrorMessage(err),
    };
  }
}
