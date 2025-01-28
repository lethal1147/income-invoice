"use client";

import { getPartyPayBillByUserId } from "@/app/actions/partyPay/";
import { PartyBillCalendar } from "@/types/partyBillType";
import { handleError } from "@/utils/utils";
import { create } from "zustand";

const formatCalendarData = (
  partyBill: { date: Date; id: string; name: string }[]
) => {
  const calendar = partyBill.reduce((acc, bill) => {
    const date = bill.date.toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push({ id: bill.id, name: bill.name });
    return acc;
  }, {} as PartyBillCalendar);

  return calendar;
};

interface PartyBillState {
  calendarPartyBill: PartyBillCalendar;
  getPartyBillCalendar: (userId: string) => void;
}

const usePartyBillStore = create<PartyBillState>()((set) => ({
  calendarPartyBill: {},
  getPartyBillCalendar: async (userId: string) => {
    try {
      const result = await getPartyPayBillByUserId(userId);
      if (result.error || !result.data) throw new Error(result.message);

      const calendarData = formatCalendarData(result.data);
      set({
        calendarPartyBill: calendarData,
      });
    } catch (err) {
      handleError(err);
    }
  },
}));

export default usePartyBillStore;
