"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import * as React from "react";
import { DateRange } from "react-day-picker";
import { ptBR } from "date-fns/locale";

//React.HTMLAttributes<HTMLDivElement>
export function CalendarDateRangePicker({
  className,
  onChange,
  from,
  to,
}: any) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from,
    to,
  });

  React.useEffect(() => {
    onChange({ from: date?.from, to: date?.to });
  }, [date]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd LLL, y", { locale: ptBR })} -{" "}
                  {format(date.to, "dd LLL, y", { locale: ptBR })}
                </>
              ) : (
                format(date.from, "LLL dd, y", { locale: ptBR })
              )
            ) : (
              <span>Selecione a data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      {date?.from !== undefined && <span> <Button className="w-[30px]  bg-red-400" onClick={() => setDate({to: undefined, from: undefined})} > X </Button> </span>  }
    </div>
  );
}
