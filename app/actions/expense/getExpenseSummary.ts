'use server'

import { ExpenseSummaryDataType } from "@/types/expenseType";
import { formatErrorMessage } from "@/utils/formatter";
import dayjs from "dayjs";

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
