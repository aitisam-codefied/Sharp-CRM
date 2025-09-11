"use client";

import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { cn } from "@/lib/utils"; // shadcn helper for merging classes

interface StyledPhoneInputProps {
  value: any;
  onChange: (value: any) => void;
  id?: string;
  error?: string;
  defaultCountry?: any;
}

export function StyledPhoneInput({
  value,
  onChange,
  id,
  error,
  defaultCountry = "GB",
}: StyledPhoneInputProps) {
  return (
    <div>
      <PhoneInput
        id={id}
        international
        countryCallingCodeEditable={false}
        defaultCountry={defaultCountry}
        value={value}
        onChange={onChange}
        className={cn(
          "flex w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-[#F87D7D] focus-visible:border-[#F87D7D]",
          error ? "border-red-500 focus-visible:ring-red-500" : ""
        )}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

// Utility for validation
export const validatePhone = (phone?: string) =>
  phone && !isValidPhoneNumber(phone)
    ? "Please enter a valid phone number"
    : "";
