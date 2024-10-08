"use server";

import { db } from "@/lib/db";
import {
  walletSchema,
  WalletSchemaType,
  WalletSchemaTypeWithId,
} from "@/schema/wallet";
import { formatErrorMessage } from "@/utils/formatter";

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

export async function getWalletListByUserId(userId: string) {
  if (!userId) {
    return { error: true, message: "User id is missing", data: [] };
  }

  const walletList = await db.wallet.findMany({
    where: {
      userId,
    },
  });
  return { error: false, data: walletList };
}

export async function getOneWalletByWalletId(walletId: string) {
  try {
    if (!walletId) {
      throw new Error("WalletId is required.");
    }

    const wallet = await db.wallet.findUnique({
      where: {
        id: walletId,
      },
    });

    return { error: false, wallet };
  } catch (err) {
    return { error: true, message: formatErrorMessage(err) };
  }
}
