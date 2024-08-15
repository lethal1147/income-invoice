import { FilterQuery } from "./utilsType";
import { TagType } from "./tagsType";
import { Expense, ExpenseTag, User, Wallet } from "@prisma/client";

export interface ExpenseTagInclude extends ExpenseTag {
  tag: TagType;
}

export interface ExpenseWithInclude extends Expense {
  expenseTag: ExpenseTagInclude[];
  user: User;
  wallet: Wallet;
}

export interface ExpenseQueryOption extends FilterQuery {
  walletId?: string;
  name?: string;
  date?: Date;
  tags?: string;
  type?: "e" | "i";
  userId?: string;
}
