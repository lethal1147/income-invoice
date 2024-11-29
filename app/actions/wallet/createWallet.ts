'use server'

import { db } from "@/lib/db";
import { walletSchema, WalletSchemaType } from "@/schema/wallet";

export async function createWallet(body: WalletSchemaType) {
  const validatedFields = walletSchema.safeParse(body);
  if (!validatedFields.success) {
    return { error: true, message: "Invalid body." };
  }

  const { name, description, balance, userId } = validatedFields.data;
  try {
    const newWallet = db.wallet.create({
      data: {
        name,
        description,
        balance: +balance,
        userId,
      },
    });

    return { error: false, wallet: newWallet };
  } catch (err) {
    return { error: true, message: err };
  }
}
