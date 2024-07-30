import { z } from "zod";

export const expenseType = ["e", "i"] as const;

export const expenseTag = z.object({
  value: z.string(),
  label: z.string(),
});

export const expenseBodySchema = z.object({
  id: z.string(),
  name: z.string(),
  total: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Expected number, received a string",
  }),
  date: z.date(),
  expenseTag: z.array(expenseTag),
  type: z.enum(expenseType),
  description: z.string().optional(),
  walletId: z.string(),
  userId: z.string(),
});

export const createExpenseBodySchema = expenseBodySchema.omit({ id: true });

export type CreateExpenseBodySchema = z.infer<typeof createExpenseBodySchema>;
