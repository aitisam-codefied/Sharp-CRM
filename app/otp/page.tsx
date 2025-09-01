"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useVerifyOtp } from "@/hooks/use-verifyOTP";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  const { mutate: verifyOtp, isPending, isError, error } = useVerifyOtp();

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 7) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleVerifyOtp = () => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter all 6 digits.",
        variant: "destructive",
      });
      return;
    }

    verifyOtp(otpString, {
      onSuccess: () => {
        toast({
          title: "OTP Verified",
          description: "Redirecting to reset password...",
        });
        router.push(`/reset-password?otp=${otpString}`);
      },
      onError: () => {
        toast({
          title: "OTP verification failed",
          description: "Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8">
        <Link
          href="/forget-password"
          className="text-sm text-gray-500 mb-6 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Enter Verification Code
          </h1>
          <p className="text-sm text-gray-600">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {isError && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {(error as any)?.response?.data?.message ||
                "Verification failed."}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-center gap-2 mb-6">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              className="w-12 h-12 text-center text-lg font-bold border-gray-300 rounded-xl focus:border-red-500 focus:ring-0"
            />
          ))}
        </div>

        <Button
          onClick={handleVerifyOtp}
          className="w-full bg-red-400 hover:bg-red-500 text-white font-semibold rounded-full"
          disabled={isPending}
        >
          {isPending ? "Verifying..." : "Verify Code"}
        </Button>
      </div>
    </div>
  );
}
