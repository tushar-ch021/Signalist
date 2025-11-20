"use client"

import * as React from "react"
import countries from "world-countries"
import { Check, ChevronsUpDown } from "lucide-react"
import { Control, Controller, FieldError } from "react-hook-form"

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
import { Label } from "@/components/ui/label"

const formattedCountries = countries.map((country) => ({
  value: country.cca2,
  label: country.name.common,
}))

interface CountrySelectFieldsProps {
  name: string;
  label: string;
  control: Control<SignUpFormData>;
  error?: FieldError;
  required?: boolean;
}

function CountrySelectFeilds({ name, label, control, error, required }: CountrySelectFieldsProps) {
  const [open, setOpen] = React.useState(false)

  // Helper for flag emoji (optional)
  const getFlag = (code: string) =>
    String.fromCodePoint(...code.split("").map((c) => 127397 + c.charCodeAt(0)))

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-gray-200">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Controller
        name={name as keyof SignUpFormData}
        control={control}
        rules={{ required: required ? `${label} is required` : false }}
        render={({ field }) => {
          const selectedCountry = formattedCountries.find(
            (country) => country.value === field.value
          )

          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between bg-gray-800 dark:bg-neutral-900 dark:text-white dark:border-neutral-700 hover:bg-gray-700 dark:hover:bg-neutral-800"
                >
                  {selectedCountry ? (
                    <span className="flex items-center gap-2 text-white">
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
              <PopoverContent className="w-full p-0 dark:bg-neutral-900 dark:border-neutral-800">
                <Command className="bg-gray-800 dark:bg-neutral-900 text-white dark:text-white">
                  <CommandInput
                    placeholder="Search country..."
                    className="text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                  />
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup className="max-h-[250px] overflow-auto bg-gray-800 dark:bg-neutral-900 text-white no-scrollbar">
                    {formattedCountries.map((country) => (
                      <CommandItem
                        key={country.value}
                        value={country.label}
                        onSelect={() => {
                          field.onChange(country.value)
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
                            field.value === country.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          )
        }}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">{error.message}</p>
      )}
    </div>
  )
}

export default CountrySelectFeilds