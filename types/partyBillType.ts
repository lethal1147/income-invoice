import { BillMembers, BillMenus, MemberMenus, PartyBill } from "@prisma/client";

export interface PartyBillTypeWithInclude extends PartyBill {
  member: BillMembers[];
  billMenus: BillMenus[];
}

export type PartyBillCalendar = Record<string, { id: string; name: string }[]>;
