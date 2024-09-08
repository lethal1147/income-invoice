import {
  getMenusByBillId,
  getPartyPayBillByBillId,
} from "@/app/actions/partyPay";
import { PartyBillTypeWithInclude } from "@/types/partyBillType";
import { OptionType } from "@/types/utilsType";
import { formatOptionDropdown } from "@/utils/formatter";
import { create } from "zustand";

interface MemberBillState {
  billInfo: PartyBillTypeWithInclude | null;
  menusDropdown: OptionType[];
  getPartyPayBillByBillId: (billId: string) => void;
  getMenusByBillId: (billId: string) => void;
}

const useMemberBillStore = create<MemberBillState>()((set) => ({
  billInfo: null,
  menusDropdown: [],
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
      });
    } catch (err) {
      console.log(err);
    }
  },
  getMenusByBillId: async (billId: string) => {
    try {
      const response = await getMenusByBillId(billId);
      if (response.error || !response.data) throw new Error(response.message);

      set({
        menusDropdown: formatOptionDropdown(response.data, "name", "id"),
      });
    } catch (err) {
      console.log(err);
    }
  },
}));

export default useMemberBillStore;
