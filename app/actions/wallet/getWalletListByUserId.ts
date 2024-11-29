"use server";

import { db } from "@/lib/db";

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
