"use client"

import * as React from "react"
import countries from "world-countries"
import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const formattedCountries = countries.map((country) => ({
  value: country.cca2,
  label: country.name.common,
}))

function CountrySelectFeilds() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<string>("")

  const selectedCountry = formattedCountries.find(
    (country) => country.value === value
  )

  // Helper for flag emoji (optional)
  const getFlag = (code: string) =>
    String.fromCodePoint(...code.split("").map((c) => 127397 + c.charCodeAt(0)))

  return (
    <Popover open={open} onOpenChange={setOpen} >
      <PopoverTrigger  asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[270px] justify-between bg-gray-800 dark:bg-neutral-900 dark:text-white dark:border-neutral-700 hover:bg-gray-700 dark:hover:bg-neutral-800"
        >
          {selectedCountry ? (
            <span className="flex items-center gap-2 text-white ">
              <span>{getFlag(selectedCountry.value)}</span>
              {selectedCountry.label}
            </span>
          ) : (
            <span className="text-white">
              Select country
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
       <PopoverContent className="w-[250px]  p-0  dark:bg-neutral-900 dark:border-neutral-800">
        <Command className="bg-gray-800  dark:bg-neutral-900 text-white dark:text-white">
          <CommandInput
            placeholder="Search country..."
            className="text-white placeholder:text-neutral-400  dark:placeholder:text-neutral-500"
          />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandGroup className="max-h-[250px] overflow-auto bg-gray-800  dark:bg-neutral-900 text-white no-scrollbar">
            {formattedCountries.map((country) => (
              <CommandItem
                key={country.value}
                value={country.label}
                onSelect={() => {
                  setValue(country.value)
                  setOpen(false)
                }}
                className="hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <span className="flex items-center gap-2">
                  <span>{getFlag(country.value)}</span>
                  {country.label}
                </span>
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === country.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
export default CountrySelectFeilds