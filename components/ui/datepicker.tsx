"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function DatePickerDemo({ date, setDate }: {date: Date | null; setDate: (date: Date | null) => void}) {

  // Function to set "Today"
  const setToday = () => setDate(new Date());

  // Function to set "Tomorrow"
  const setTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow);
  };

  return (
    <div className="flex flex-col md:flex-row gap-1 justify-between border rounded-lg py-2 px-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "border-none justify-start text-left font-normal cursor-pointer",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date instanceof Date && !isNaN(date.getTime()) ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar 
          mode="single" 
          selected={date ?? undefined} 
          onSelect={(selectedDate) => setDate(selectedDate ?? null)} 
          initialFocus />
        </PopoverContent>
      </Popover>

      {/* Buttons for Today & Tomorrow */}
      <div className="flex gap-4 items-center">
        <Button variant={"outline"} className="cursor-pointer" onClick={setToday}>
          Today
        </Button>
        <Button variant={"outline"} className="cursor-pointer" onClick={setTomorrow}>
          Tomorrow
        </Button>
      </div>
    </div>
  );
}
