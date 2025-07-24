"use client";
import type React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  ArrowLeft,
  Lock,
  CheckCircle,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useResetPassword } from "@/hooks/use-resetPassword";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");

  const router = useRouter();

  const { toast } = useToast();

  // Validation
  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;

  const { mutate: resetPassword, isPending } = useResetPassword();

  const searchParams = useSearchParams();
  const otpFromQuery = searchParams.get("otp");

  const [otp, setOtp] = useState<string | null>(null);

  useEffect(() => {
    if (otpFromQuery) {
      setOtp(otpFromQuery);

      // Clean the URL by removing the OTP from query params
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("otp");
      window.history.replaceState({}, "", newUrl.toString());
    }
  }, [otpFromQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    setError("");

    if (!otp) {
      setError("OTP is missing. Please request reset again.");
      return;
    }

    resetPassword(
      {
        otp,
        newPassword: password,
        confirmPassword: confirmPassword,
      },
      {
        onSuccess: () => {
          toast({
            title: "Password Reset Successful",
            description: "Redirecting to login...",
          });

          // Clear OTP from localStorage (optional)
          localStorage.removeItem("otp");

          setTimeout(() => {
            router.push("/login");
          }, 2500);
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message || "Failed to reset password.";
          setError(msg);
          toast({
            title: "Error",
            description: msg,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        background: "linear-gradient(100deg, #ff7b7b 60%, #fafafa 40%)",
      }}
    >
      <div className="hidden md:block absolute -top-2 -left-2 w-full">
        <Image
          src="/stripe1.png"
          alt=""
          width={600}
          height={60}
          className="object-cover"
        />
      </div>
      <div className="hidden md:block absolute top-5 -right-5 w-full">
        <Image
          src="/stripe2.png"
          alt=""
          width={1400}
          height={60}
          className="object-cover"
        />
      </div>
      <div className="hidden md:block absolute top-80 -left-5 w-full">
        <Image
          src="/stripe3.png"
          alt=""
          width={1400}
          height={60}
          className="object-contain"
        />
      </div>

      {/* Main container */}
      <div className="relative z-10 flex flex-col md:flex-row justify-center items-center min-h-screen p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col md:flex-row overflow-hidden p-5">
          {/* Left side - Image */}
          <div className="hidden md:block md:w-1/2 relative">
            <Image
              src="/sideimg.png"
              alt="Venice canal with colorful buildings"
              fill
              className="object-contain rounded-l-3xl"
            />
          </div>

          {/* Right side - Reset Password form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
            <div className="max-w-sm mx-auto w-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-red-400" />
                </div>
                <h1 className="text-xl font-bold mb-2 text-gray-900">
                  Set New Password
                </h1>
              </div>

              {error && (
                <Alert variant="default" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Password Field */}
                <div>
                  <Label
                    htmlFor="password"
                    className="text-sm text-gray-600 mb-2 block"
                  >
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your new password"
                      required
                      className="text-base border-gray-200 rounded-xl bg-white focus:border-gray-300 focus:ring-0 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm text-gray-600 mb-2 block"
                  >
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      required
                      className={`text-base border-gray-200 rounded-xl bg-white focus:border-gray-300 focus:ring-0 pr-10 ${
                        confirmPassword && !passwordsMatch
                          ? "border-red-300 focus:border-red-400"
                          : ""
                      }`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>

                  {/* Password Match Indicator */}
                  {confirmPassword && (
                    <div className="mt-2">
                      {passwordsMatch ? (
                        <div className="flex items-center text-xs text-green-600">
                          <Check className="h-3 w-3 mr-1" />
                          Passwords match
                        </div>
                      ) : (
                        <div className="flex items-center text-xs text-red-600">
                          <X className="h-3 w-3 mr-1" />
                          Passwords do not match
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full text-base font-semibold rounded-full mt-6"
                  style={{
                    backgroundColor: "#ff7b7b",
                    color: "white",
                  }}
                  disabled={isPending}
                >
                  {isPending ? "Updating Password..." : "Update Password"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
