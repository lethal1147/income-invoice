import { BillMembers, BillMenus, MemberMenus, PartyBill } from "@prisma/client";

export interface PartyBillTypeWithInclude extends PartyBill {
  member: BillMemberWithInclude[];
  billMenus: BillMenus[];
}

export type PartyBillCalendar = Record<string, { id: string; name: string }[]>;

export interface BillMemberWithInclude extends BillMembers {
  memberMenus: MemberMenus[];
}
