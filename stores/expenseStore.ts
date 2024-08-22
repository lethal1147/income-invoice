import { getExpenseByUserId } from "@/app/actions/expense";
import { ExpenseQueryOption, ExpenseWithInclude } from "@/types/expenseType";
import { create } from "zustand";

interface ExpenseState {
  expenses: ExpenseWithInclude[];
  totalExpenses: number;
  getExpenseByUserId: (userId: string, query?: ExpenseQueryOption) => void;
}

const useExpenseStore = create<ExpenseState>()((set) => ({
  expenses: [],
  totalExpenses: 0,
  getExpenseByUserId: async (userId: string, query?: ExpenseQueryOption) => {
    try {
      const response = await getExpenseByUserId(userId, query);
      if (response.error) throw new Error(response.message);

      set({
        expenses: response.expenses,
        totalExpenses: response.total,
      });
    } catch (err) {
      console.error(err);
    }
  },
}));

export default useExpenseStore;