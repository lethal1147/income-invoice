'use server'

import { db } from "@/lib/db";
import { formatErrorMessage } from "@/utils/formatter";

export async function getMenusByBillId(billId: string) {
  try {
    if (!billId) {
      return { error: true, message: "User id is required." };
    }

    const result = await db.billMenus.findMany({
      where: {
        partyBillId: billId,
      },
    });

    return { error: false, data: result };
  } catch (err) {
    console.log(err);
    return { error: true, message: formatErrorMessage(err) };
  }
}
