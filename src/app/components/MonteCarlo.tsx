"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

interface Stock {
  value: string;
  label: string;
}

export function StockSearch() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [stocks, setStocks] = React.useState<Stock[]>([]);

  const fetchStocks = React.useCallback(async (query: string) => {
    if (query.length < 2) return;

    try {
      const response = await fetch(
        `/api/stock-lookup?query=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.log("Received non-JSON response:", text);
        // Handle non-JSON response here
        return;
      }

      const formattedStocks: Stock[] = data.map((item: any) => ({
        value: item.symbol,
        label: `${item.symbol} - ${item.name}`,
      }));
      setStocks(formattedStocks);
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  }, []);

  React.useEffect(() => {
    if (open) {
      fetchStocks(value);
    }
  }, [open, value, fetchStocks]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {value
            ? stocks.find((stock) => stock.value === value)?.label
            : "Search for a stock..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder="Search for a stock..."
            onValueChange={(search) => {
              setValue(search);
              fetchStocks(search);
            }}
          />
          <CommandList>
            <CommandEmpty>No stocks found.</CommandEmpty>
            <CommandGroup>
              {stocks.map((stock) => (
                <CommandItem
                  key={stock.value}
                  value={stock.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === stock.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {stock.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
