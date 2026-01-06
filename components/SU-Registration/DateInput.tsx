"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface DateInputProps {
  id: string;
  label: string;
  value: string | Date | undefined;
  onChange: (value: string) => void;
  max?: string; // YYYY-MM-DD format
  min?: string; // YYYY-MM-DD format
  required?: boolean;
  error?: string;
  className?: string;
}

// Convert YYYY-MM-DD to DD/MM/YYYY
const formatToDDMMYYYY = (dateStr: string | Date | undefined): string => {
  if (!dateStr) return "";
  
  let date: Date;
  if (typeof dateStr === "string") {
    // Check if it's already in DD/MM/YYYY format
    if (dateStr.includes("/")) {
      return dateStr;
    }
    // Assume YYYY-MM-DD format
    date = new Date(dateStr);
  } else {
    date = dateStr;
  }
  
  if (isNaN(date.getTime())) return "";
  
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

// Convert DD/MM/YYYY to YYYY-MM-DD
const formatToYYYYMMDD = (dateStr: string): string => {
  if (!dateStr) return "";
  
  // If already in YYYY-MM-DD format, return as is
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateStr;
  }
  
  // Parse DD/MM/YYYY format
  const parts = dateStr.split("/");
  if (parts.length !== 3) return "";
  
  const day = parts[0].padStart(2, "0");
  const month = parts[1].padStart(2, "0");
  const year = parts[2];
  
  // Validate
  if (day.length !== 2 || month.length !== 2 || year.length !== 4) {
    return "";
  }
  
  return `${year}-${month}-${day}`;
};

export default function DateInput({
  id,
  label,
  value,
  onChange,
  max,
  min,
  required = false,
  error,
  className = "",
}: DateInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    setDisplayValue(formatToDDMMYYYY(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    // If empty, clear everything
    if (inputValue === "") {
      setDisplayValue("");
      onChange("");
      return;
    }
    
    // Remove non-numeric characters except /
    inputValue = inputValue.replace(/[^\d/]/g, "");
    
    // Auto-format as user types
    let formatted = inputValue;
    // Add first slash after 2 digits
    if (inputValue.length > 2 && !inputValue.substring(0, 3).includes("/")) {
      formatted = inputValue.slice(0, 2) + "/" + inputValue.slice(2);
    }
    // Add second slash after 5 characters (DD/MM)
    if (formatted.length > 5 && formatted.split("/").length === 2) {
      const parts = formatted.split("/");
      if (parts[1].length > 2) {
        formatted = parts[0] + "/" + parts[1].slice(0, 2) + "/" + parts[1].slice(2, 6);
      }
    }
    
    // Limit to DD/MM/YYYY format (10 characters)
    if (formatted.length <= 10) {
      setDisplayValue(formatted);
      
      // Convert to YYYY-MM-DD and call onChange only when complete
      if (formatted.length === 10) {
        const yyyymmdd = formatToYYYYMMDD(formatted);
        if (yyyymmdd) {
          // Validate against min/max
          if (min && yyyymmdd < min) {
            return; // Don't update if less than min
          }
          if (max && yyyymmdd > max) {
            return; // Don't update if greater than max
          }
          onChange(yyyymmdd);
        }
      }
    }
  };

  const handleBlur = () => {
    // Validate and format on blur
    if (displayValue && displayValue.length === 10) {
      const yyyymmdd = formatToYYYYMMDD(displayValue);
      if (yyyymmdd) {
        // Validate against min/max
        if (min && yyyymmdd < min) {
          setDisplayValue(formatToDDMMYYYY(min));
          onChange(min);
        } else if (max && yyyymmdd > max) {
          setDisplayValue(formatToDDMMYYYY(max));
          onChange(max);
        } else {
          onChange(yyyymmdd);
        }
      } else {
        // Invalid format, reset to empty or previous value
        setDisplayValue(formatToDDMMYYYY(value));
      }
    } else if (displayValue && displayValue.length > 0 && displayValue.length < 10) {
      // Incomplete date, reset
      setDisplayValue(formatToDDMMYYYY(value));
    }
  };

  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-gray-700 font-medium">
        {label} {required && "*"}
      </Label>
      <Input
        id={id}
        type="text"
        placeholder="DD/MM/YYYY"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={10}
        className={`mt-1 rounded-lg border-gray-300 focus:border-[#F87D7D] focus:ring-[#F87D7D] ${className}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

