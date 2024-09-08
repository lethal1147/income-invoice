"use client";

import NavMenu from "@/components/sidebar/navMenu";
import React, { useEffect } from "react";
import CalendarPage from "./components/calendar";
import usePartyBillStore from "@/stores/partyBillStore";
import { useSession } from "next-auth/react";

export default function Page() {
  const { calendarPartyBill, getPartyBillCalendar } = usePartyBillStore();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.id) return;
    getPartyBillCalendar(session.user.id);
  }, [session?.user?.id]);

  return (
    <main className="flex text-gray-800">
      <NavMenu />
      <div className="p-10 gap-10 flex flex-col w-full loginBackGround">
        <div className="size-full bg-white shadow-lg border rounded-lg">
          <CalendarPage data={calendarPartyBill} />
        </div>
      </div>
    </main>
  );
}
