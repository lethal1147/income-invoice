'use server'

import { formatErrorMessage } from "@/utils/formatter";

export async function getPartyPayBillByUserId(userId: string) {
  if (!userId) {
    return { error: true, message: "User id is required." };
  }
  try {
    const partyBills = await prisma?.partyBill.findMany({
      include: {
        billMembers: {
          include: { memberMenus: true },
        },
        billMenus: true,
      },
      where: {
        userId,
      },
    });

    return { error: false, data: partyBills };
  } catch (err) {
    return { error: true, message: formatErrorMessage(err) };
  }
}
