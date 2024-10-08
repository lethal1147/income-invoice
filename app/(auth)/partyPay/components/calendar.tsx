"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateBillModal from "./createBillModal";
import { PartyBillCalendar } from "@/types/partyBillType";
import Link from "next/link";

type CalendarPagePropsType = {
  data: PartyBillCalendar;
};

export default function CalendarPage({ data }: CalendarPagePropsType) {
  const [date, setDate] = useState<Date>(new Date());

  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <section className="container min-w-full mx-auto p-4">
      <div className="flex w-full justify-between">
        <h1 className="text-2xl font-bold mb-4">Calendar</h1>
        <CreateBillModal />
      </div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{format(date, "MMMM yyyy")}</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setDate(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
              )
            }
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous month</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setDate(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
              )
            }
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next month</span>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-semibold">
            {day}
          </div>
        ))}
        {monthDays.map((day) => (
          <Dialog key={day.toISOString()}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-16 w-full",
                  !isSameMonth(day, date) && "text-muted-foreground",
                  isSameDay(day, new Date()) &&
                    "bg-accent text-accent-foreground",
                  data[format(day, "yyyy-MM-dd")] &&
                    "font-bold !text-green-main bg-green-main/10"
                )}
              >
                {format(day, "d")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{format(day, "MMMM d, yyyy")}</DialogTitle>
                <DialogDescription>
                  {data[format(day, "yyyy-MM-dd")] ? (
                    <ul className="list-disc list-inside">
                      {data[format(day, "yyyy-MM-dd")].map((task) => (
                        <li key={task.id}>
                          <Link href={`/bill/${task.id}`}>{task.name}</Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "No bills for this day."
                  )}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </section>
  );
}
