"use server";

import { db } from "@/lib/db";
import {
  CreateExpenseBodySchema,
  createExpenseBodySchema,
} from "@/schema/expense";
import { ExpenseQueryOption } from "@/types/expenseType";
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

      const newExpense = await prisma.expense.create({
        data: {
          title: name,
          description: description || "",
          total: +total || 0,
          type,
          date,
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

export async function getExpenseByUserId(
  userId: string,
  options: ExpenseQueryOption = {}
) {
  try {
    const whereQuery: ExpenseQueryOption = {
      userId,
    };

    if (options.walletId) {
      whereQuery.walletId = options.walletId;
    }

    const { page = 1, pageLimit = 10 } = options;

    const expenses = await db.expense.findMany({
      include: {
        user: true,
        wallet: true,
        expenseTag: {
          include: {
            tag: true,
          },
        },
      },
      where: whereQuery,
      skip: (page - 1) * pageLimit,
      take: pageLimit,
    });

    return {
      error: false,
      message: "Get expense list successfully.",
      expenses,
    };
  } catch (err) {
    console.log(err);
    return { error: true, message: formatErrorMessage(err) };
  }
}
