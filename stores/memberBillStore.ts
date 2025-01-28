"use client";

import {
  getMenusByBillId,
  getPartyPayBillByBillId,
  updateMemberMenu,
} from "@/app/actions/partyPay/";
import { MemberBillSchemaType } from "@/schema/memberBill";
import { PartyBillTypeWithInclude } from "@/types/partyBillType";
import { OptionType } from "@/types/utilsType";
import { sumTotalPartyPay } from "@/utils/calculator";
import { formatOptionDropdown } from "@/utils/formatter";
import { handleError } from "@/utils/utils";
import { BillMenus } from "@prisma/client";
import { create } from "zustand";

interface MemberBillState {
  billInfo: PartyBillTypeWithInclude | null;
  summaryData: {
    total: number;
    quantity: number;
  };
  menusDropdown: OptionType[];
  menus: BillMenus[];
  getPartyPayBillByBillId: (billId: string) => void;
  getMenusByBillId: (billId: string) => void;
  submitMemberMenu: (body: MemberBillSchemaType) => Promise<string>;
}

const useMemberBillStore = create<MemberBillState>()((set) => ({
  billInfo: null,
  summaryData: {
    total: 0,
    quantity: 0,
  },
  menusDropdown: [],
  menus: [],
  getPartyPayBillByBillId: async (billId: string) => {
    try {
      const response = await getPartyPayBillByBillId(billId);
      if (response.error || !response.data) throw new Error(response.message);
      const formatted = {
        ...response.data,
        member: response.data.billMembers,
      };
      set({
        billInfo: formatted,
        summaryData: sumTotalPartyPay(formatted.billMenus),
      });
    } catch (err) {
      handleError(err);
    }
  },
  getMenusByBillId: async (billId: string) => {
    try {
      const response = await getMenusByBillId(billId);
      if (response.error || !response.data) throw new Error(response.message);

      set({
        menusDropdown: formatOptionDropdown(response.data, "name", "id"),
        menus: response.data,
      });
    } catch (err) {
      handleError(err);
    }
  },
  submitMemberMenu: async (body: MemberBillSchemaType) => {
    try {
      const response = await updateMemberMenu(body);
      if (response.error) throw new Error(response.message);

      return response.message;
    } catch (err) {
      handleError(err);
      return "";
    }
  },
}));

export default useMemberBillStore;
