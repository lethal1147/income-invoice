import NavMenu from "@/components/sidebar/navMenu";
import React from "react";
import CalendarPage from "./components/calendar";

export default function Page() {
  return (
    <main className="flex text-gray-800">
      <NavMenu />
      <div className="p-10 gap-10 flex flex-col w-full loginBackGround">
        <div className="size-full bg-white shadow-lg border rounded-lg">
          <CalendarPage />
        </div>
      </div>
    </main>
  );
}
