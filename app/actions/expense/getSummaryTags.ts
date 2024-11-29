'use server'

import { formatErrorMessage } from "@/utils/formatter";
import dayjs from "dayjs";

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
        userId,
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
        userId,
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
