"use client";

import { getExpenseSummary, getSummaryTags } from "@/app/actions/expense";
import { ExpenseSummaryDataType } from "@/types/expenseType";
import { CurrentFilterStateType } from "@/types/utilsType";
import { handleError } from "@/utils/utils";
import dayjs from "dayjs";
import { create } from "zustand";

interface DashboardState {
  currentFilter: CurrentFilterStateType;
  dateFilter: {
    from: Date;
    to: Date;
  };
  expenseSummaryData: ExpenseSummaryDataType[];
  expenseTagSummary: { [key: string]: number };
  summary: {
    totalIncome: number;
    totalExpense: number;
    totalSave: number;
  };
  year: number;
  fetchExpenseData: (userId: string) => Promise<void>;
  fetchExpenseSummaryOfTag: (userId: string) => Promise<void>;
  onChangeFilter: (type: CurrentFilterStateType) => void;
  increaseYear: (mode: "increase" | "decrease") => void;
  setCurrentFilter: (mode: CurrentFilterStateType) => void;
  updateDateFilter: (range: { from: Date; to: Date }) => void;
}

const useDashboardStore = create<DashboardState>((set, get) => ({
  currentFilter: "month",
  dateFilter: {
    from: dayjs().startOf("month").toDate(),
    to: dayjs().endOf("month").toDate(),
  },
  expenseSummaryData: [],
  expenseTagSummary: {},
  summary: {
    totalIncome: 0,
    totalExpense: 0,
    totalSave: 0,
  },
  year: dayjs().year(),
  fetchExpenseData: async (userId: string) => {
    try {
      const year = get().year;
      const response = await getExpenseSummary(userId, year);
      if (response.error) throw new Error("Error on get expense summary");
      set({ expenseSummaryData: response.data });
    } catch (err) {
      handleError(err);
    }
  },
  fetchExpenseSummaryOfTag: async (userId: string) => {
    try {
      const dateFilter = get().dateFilter;
      const response = await getSummaryTags(userId, {
        startDate: dateFilter.from,
        endDate: dateFilter.to,
      });

      set({
        expenseTagSummary: response.data,
        summary: {
          totalExpense: response.totalExpense,
          totalIncome: response.totalIncome,
          totalSave: response.totalIncome - response.totalExpense,
        },
      });
    } catch (err) {}
  },
  onChangeFilter: (type: CurrentFilterStateType) => {
    const currentDateFilter = get().dateFilter;
    let newDateFilter: {
      from: Date;
      to: Date;
    } = currentDateFilter;
    switch (type) {
      case "month":
        newDateFilter = {
          from: dayjs().startOf("month").toDate(),
          to: dayjs().endOf("month").toDate(),
        };
        break;
      case "quarter":
        newDateFilter = {
          from: dayjs().startOf("quarter").toDate(),
          to: dayjs().endOf("quarter").toDate(),
        };
        break;
      case "year":
        newDateFilter = {
          from: dayjs().startOf("year").toDate(),
          to: dayjs().endOf("year").toDate(),
        };
      default:
        break;
    }
    set({ currentFilter: type, dateFilter: newDateFilter });
  },
  increaseYear: (type: "decrease" | "increase") => {
    const year = get().year;
    set({ year: type === "increase" ? year + 1 : year - 1 });
  },
  setCurrentFilter: (mode: CurrentFilterStateType) => {
    set({ currentFilter: mode });
  },
  updateDateFilter: (range: { from: Date; to: Date }) => {
    set({ dateFilter: range });
  },
}));

export default useDashboardStore;
