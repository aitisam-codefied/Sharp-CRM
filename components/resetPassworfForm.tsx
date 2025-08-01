
"use client";

import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { AlertCircle, Check, Eye, EyeOff, Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResetPassword } from "@/hooks/use-resetPassword";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const [otp, setOtp] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const otpFromQuery = searchParams.get("otp");

  const router = useRouter();
  const { toast } = useToast();
  const { mutate: resetPassword, isPending } = useResetPassword();

  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;

  useEffect(() => {
    if (otpFromQuery) {
      setOtp(otpFromQuery);
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
    if (!otp) {
      setError("OTP is missing. Please request reset again.");
      return;
    }
    setError("");
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
          localStorage.removeItem("otp");
          setTimeout(() => router.push("/login"), 2500);
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
    <div className="max-w-sm mx-auto w-full">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="h-8 w-8 text-red-400" />
        </div>
        <h1 className="text-xl font-bold mb-2 text-gray-900">Set New Password</h1>
      </div>

      {error && (
        <Alert variant="default" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Password */}
        <div>
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your new password"
              className="text-base pr-10"
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

        {/* Confirm Password */}
        <div>
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your new password"
              className="text-base pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </Button>
          </div>
          {confirmPassword && (
            <div className="mt-2">
              {passwordsMatch ? (
                <div className="text-green-600 text-xs flex items-center">
                  <Check className="h-3 w-3 mr-1" />
                  Passwords match
                </div>
              ) : (
                <div className="text-red-600 text-xs flex items-center">
                  <X className="h-3 w-3 mr-1" />
                  Passwords do not match
                </div>
              )}
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full mt-6 rounded-full text-base font-semibold"
          style={{ backgroundColor: "#ff7b7b", color: "white" }}
          disabled={isPending}
        >
          {isPending ? "Updating Password..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
}
