"use server";

import { formatErrorMessage } from "@/utils/formatter";

export async function getPartyPayBillByBillId(billId: string) {
  if (!billId) {
    return { error: true, message: "User id is required." };
  }
  try {
    const partyBill = await prisma?.partyBill.findUnique({
      include: {
        billMembers: {
          include: {
            memberMenus: {
              include: {
                billMenu: true,
              },
            },
          },
        },
        billMenus: true,
      },
      where: {
        id: billId,
      },
    });

    return { error: false, data: partyBill };
  } catch (err) {
    return { error: true, message: formatErrorMessage(err) };
  }
}
