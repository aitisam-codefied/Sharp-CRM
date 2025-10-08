"use client";

export const dynamic = "force-dynamic";

import type React from "react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/providers/auth-provider";

export default function LoginPage() {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userResponse = await login(emailAddress, password);
      console.log("userResponse", userResponse);

      if (
        !userResponse ||
        typeof userResponse !== "object" ||
        !("roles" in userResponse)
      ) {
        toast({
          title: "Login Failed",
          description: "Invalid response from server.",
          variant: "destructive",
        });
        return;
      }

      const roles = (userResponse as any).roles || [];
      const isAuthorized = roles.some(
        (role: any) => role.name === "Admin" || role.name === "Manager"
      );

      if (!isAuthorized) {
        toast({
          title: "Access Denied",
          description: "You are not authorized to log in.",
          variant: "destructive",
        });
        return;
      }

      // Redirect based on onboarding status
      if (!(userResponse as any)?.isOnboarded) {
        router.push("/on-boarding");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      const errorData = err.response?.data;

      const message =
        errorData?.error ||
        errorData?.message ||
        errorData?.details ||
        err.message ||
        "Login failed. Please try again.";

      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/login_bg.svg')",
      }}
    >
      {/* Main container */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col md:flex-row overflow-hidden p-5">
        {/* Left side - Image */}
        <div className="hidden md:block md:w-1/2 relative">
          <Image
            src="/sideimg.png"
            alt="Login visual"
            fill
            className="object-contain rounded-l-3xl"
          />
        </div>

        {/* Right side - Login form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full">
            <h1 className="text-4xl font-bold mb-2 text-gray-900 text-center">
              Hello!
            </h1>
            <p className="text-gray-500 mb-5 text-lg text-center">
              Welcome to Sharp MS
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label
                  htmlFor="emailAddress"
                  className="text-sm text-gray-600 mb-2 block"
                >
                  Email or mobile phone number
                </Label>
                <Input
                  id="emailAddress"
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  required
                  className="text-base border-gray-200 rounded-xl bg-white focus:border-gray-300 focus:ring-0"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="password" className="text-sm text-gray-600">
                    Your password
                  </Label>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="text-sm text-gray-500 p-0 h-auto hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-base border-gray-200 rounded-xl bg-white focus:border-gray-300 focus:ring-0"
                />
              </div>

              <div className="text-right">
                <Link
                  href="/forget-password"
                  className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full text-base font-semibold rounded-full mt-4"
                style={{
                  backgroundColor: "#ff7b7b",
                  color: "white",
                }}
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Log in"}
              </Button>

              <div className="text-center text-[12px] text-gray-500 mt-3">
                By continuing, you agree to the{" "}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-[12px] text-gray-700 underline hover:text-gray-900"
                >
                  Terms of use
                </Button>{" "}
                and{" "}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-[12px] text-gray-700 underline hover:text-gray-900"
                >
                  Privacy Policy
                </Button>
                .
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
