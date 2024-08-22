"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

export function DatePickerWithRange({ ...props }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !props.value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {props.value?.from ? (
            props.value?.to ? (
              <>
                {format(props.value?.from, "LLL dd, y")} -{" "}
                {format(props.value?.to, "LLL dd, y")}
              </>
            ) : (
              format(props.value?.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          {...props}
          initialFocus
          mode="range"
          defaultMonth={props.value?.from}
          selected={props.value}
          onSelect={props.onSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
