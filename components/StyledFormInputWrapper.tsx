"use client";

import dynamic from 'next/dynamic';

// Dynamically import StyledPhoneInput without SSR
export const StyledPhoneInput = dynamic(
  () => import('./StyledFormInput').then(mod => ({ default: mod.StyledPhoneInput })),
  { ssr: false }
);

export const validatePhone = (phone?: string) => {
  if (typeof window === 'undefined') return "";
  
  // Import the validation function only on client side
  const { isValidPhoneNumber } = require('react-phone-number-input');
  return phone && !isValidPhoneNumber(phone)
    ? "Please enter a valid phone number"
    : "";
};

