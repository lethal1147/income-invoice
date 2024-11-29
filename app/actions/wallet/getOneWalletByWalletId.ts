'use server'

import { db } from "@/lib/db";
import { formatErrorMessage } from "@/utils/formatter";

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
