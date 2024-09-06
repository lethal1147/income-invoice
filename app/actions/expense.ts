"use server";

import { db } from "@/lib/db";
import {
  CreateExpenseBodySchema,
  createExpenseBodySchema,
} from "@/schema/expense";
import {
  ExpenseQueryOption,
  ExpenseSummaryDataType,
} from "@/types/expenseType";
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

export async function getExpenseSummary(
  userId: string,
  year: number
): Promise<{
  error: boolean;
  data: ExpenseSummaryDataType[];
  message?: string;
}> {
  try {
    const summary = [];

    for (let month = 0; month < 12; month++) {
      const startDate = dayjs()
        .year(year)
        .month(month)
        .startOf("month")
        .add(7, "hour")
        .toDate();
      const endDate = dayjs()
        .year(year)
        .month(month)
        .endOf("month")
        .add(7, "hour")
        .toDate();
      const expenses = await prisma?.expense.groupBy({
        by: ["type"],
        _sum: {
          total: true,
        },
        where: {
          userId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      let income = 0;
      let expense = 0;

      expenses?.forEach((exp) => {
        if (exp.type === "i") {
          income = exp._sum.total ?? 0;
        } else {
          expense = exp._sum.total ?? 0;
        }
      });

      summary.push({
        month: dayjs(startDate).format("MMMM"),
        income,
        expense,
      });
    }

    return { error: false, data: summary };
  } catch (err) {
    return { error: true, data: [], message: formatErrorMessage(err) };
  }
}

type ReturnOfSummaryTag = { tagname: string; totalamount: number };

export async function getSummaryTags(
  userId: string,
  filter: { startDate: Date; endDate: Date }
): Promise<{
  error: boolean;
  data: { [key: string]: number };
  message?: string;
  totalIncome: number;
  totalExpense: number;
}> {
  try {
    if (!prisma)
      return {
        error: true,
        data: {},
        message: "Database not initial.",
        totalIncome: 0,
        totalExpense: 0,
      };
    const startDate = dayjs(filter.startDate)
      .startOf("day")
      .add(7, "hour")
      .toDate();
    const endDate = dayjs(filter.endDate).endOf("day").add(7, "hour").toDate();

    const result: ReturnOfSummaryTag[] = await prisma.$queryRaw`
    SELECT t."name" AS tagName, CAST(SUM(e.total) AS INTEGER) AS totalAmount FROM "Expense" e
    LEFT JOIN "ExpenseTag" et ON e.id = et."expenseId"
    LEFT JOIN "Tag" t ON et."tagId" = t.id
    WHERE e."date" BETWEEN ${startDate} AND ${endDate} AND e."userId" = ${userId} AND e."type" = 'e'
    GROUP BY t."name"
    ORDER BY totalAmount DESC
  `;

    const totalIncome = await prisma.expense.aggregate({
      where: {
        type: "i",
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        total: true,
      },
    });
    const totalExpense = await prisma.expense.aggregate({
      where: {
        type: "e",
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        total: true,
      },
    });

    const tagTotals: { [key: string]: number } = {};
    let othersTotal = 0;
    result.forEach((row: ReturnOfSummaryTag, index: number) => {
      if (index < 4) {
        tagTotals[row.tagname] = row.totalamount;
      } else {
        othersTotal += row.totalamount;
      }
    });

    if (othersTotal > 0) {
      tagTotals["others"] = othersTotal;
    }

    return {
      error: false,
      data: tagTotals,
      totalIncome: totalIncome._sum.total ?? 0,
      totalExpense: totalExpense._sum.total ?? 0,
    };
  } catch (err) {
    return {
      error: true,
      data: {},
      totalIncome: 0,
      totalExpense: 0,
      message: formatErrorMessage(err),
    };
  }
}
