"use server";

import { db } from "@/lib/db";
import {
  CreateExpenseBodySchema,
  createExpenseBodySchema,
} from "@/schema/expense";
import { ExpenseQueryOption } from "@/types/expenseType";
import { formatErrorMessage } from "@/utils/formatter";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";

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

      await prisma.expense.update({
        where: {
          id,
        },
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

export async function getExpenseByUserId(
  userId: string,
  options: ExpenseQueryOption = {}
) {
  try {
    const { walletId, name, tags, date, type } = options;
    const whereQuery: Prisma.ExpenseWhereInput = {
      userId,
      ...(name && {
        title: {
          contains: name,
          mode: "insensitive",
        },
      }),
      ...(walletId && { walletId: walletId }),
      ...(date && {
        date: { gte: dayjs(date.from).toDate(), lte: dayjs(date.to).toDate() },
      }),
      ...(tags && {
        expenseTag: {
          some: {
            tag: {
              name: {
                contains: tags,
                mode: "insensitive",
              },
            },
          },
        },
      }),
      ...(type && { type }),
    };

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
      orderBy: {
        date: "desc",
      },
    });
    const totalExpenses = await db.expense.count({
      where: whereQuery,
    });

    return {
      error: false,
      message: "Get expense list successfully.",
      expenses,
      total: totalExpenses,
    };
  } catch (err) {
    console.log(err);
    return { error: true, message: formatErrorMessage(err) };
  }
}

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
