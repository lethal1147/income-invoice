import { PartyBillTypeWithInclude } from "@/types/partyBillType";
import { BillMenus } from "@prisma/client";

export const sumTotalPartyPay = (
  billMenus: BillMenus[]
): { quantity: number; total: number } => {
  let sumTotal = 0;
  let sumQuantity = 0;

  billMenus.forEach((menu) => {
    sumQuantity += menu.quantity;
    sumTotal += menu.quantity * menu.pricePerItem;
  });

  return {
    quantity: sumQuantity,
    total: sumTotal,
  };
};
