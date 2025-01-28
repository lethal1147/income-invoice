"use server";

import { db } from "@/lib/db";
import { ExpenseQueryOption } from "@/types/expenseType";
import { formatErrorMessage } from "@/utils/formatter";
// import { handleError } from "@/utils/utils";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";

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
    // handleError(err);
    return { error: true, message: formatErrorMessage(err) };
  }
}
