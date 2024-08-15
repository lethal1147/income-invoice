import { getExpenseByUserId } from "@/app/actions/expense";
import { ExpenseQueryOption, ExpenseWithInclude } from "@/types/expenseType";
import { create } from "zustand";

interface ExpenseState {
  expenses: ExpenseWithInclude[];
  getExpenseByUserId: (userId: string, query?: ExpenseQueryOption) => void;
}

const useExpenseStore = create<ExpenseState>()((set) => ({
  expenses: [],
  getExpenseByUserId: async (userId: string, query?: ExpenseQueryOption) => {
    try {
      const response = await getExpenseByUserId(userId, query);
      if (response.error) throw new Error(response.message);

      set({
        expenses: response.expenses,
      });
    } catch (err) {
      console.error(err);
    }
  },
}));

export default useExpenseStore;
