import { expenseTag } from "./../schema/expense";
import { FilterQuery } from "./utilsType";
import { TagType } from "./tagsType";
import { Expense, ExpenseTag, Prisma, User, Wallet } from "@prisma/client";
import { DateRange } from "react-day-picker";

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
  date?: DateRange;
  tags?: string;
  type?: "e" | "i";
  userId?: string;
}

export interface ExpenseWhereQuery {
  name?: Prisma.StringFilter;
  date?: Prisma.DateTimeFilter;
  expenseTag?: Prisma.ExpenseTagListRelationFilter;
  walletId?: Prisma.WalletRelationFilter;
}
