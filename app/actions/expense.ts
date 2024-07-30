import { db } from "@/lib/db";
import {
  CreateExpenseBodySchema,
  createExpenseBodySchema,
} from "@/schema/expense";
export async function createExpense(body: CreateExpenseBodySchema) {
  const validatedFields = createExpenseBodySchema.safeParse(body);
  if (!validatedFields.success) {
    return { error: true, message: "Invalid body." };
  }

  const { name, date, description, total, expenseTag, walletId, userId } = validatedFields.data;
  try {
    const expenseIds = [];
    for (let i = 0; i < expenseTag.length; i++) {
      if (!expenseTag[i].id) {
        const newTag = await db.tag.create({
          data: {
            name: expenseTag[i].name,
            userId,
          },
        });
        expenseIds.push(newTag.id);
      }
    }
    db.expense.create({ data: {

    } });
  } catch (err) {
    return { error: true, message: err };
  }
}
