"use client";
import type React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/providers/auth-provider";

export default function LoginPage() {
  const [emailAddress, setemailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const { login, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const userResponse = await login(emailAddress, password);

      if (!userResponse) {
        setError("Invalid email or password");
        return;
      }

      const roles = userResponse?.roles || [];
      const isAdmin = roles.some((role: any) => role.name === "Admin");

      if (!isAdmin) {
        setError("You are not authorized");
        return;
      }

      // If admin, proceed based on onboarding status
      if (userResponse.isOnboarded) {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/admin/on-boarding");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
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

          {/* Right side - Login form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
            <div className="max-w-sm mx-auto w-full">
              <h1 className="text-4xl font-bold mb-2 text-gray-900 text-center">
                Hello!
              </h1>
              <p className="text-gray-500 mb-5 text-lg text-center">
                Welcome to Sharp MS
              </p>

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

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
                    onChange={(e) => setemailAddress(e.target.value)}
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

                {/* Forgot Password Link */}
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
    </div>
  );
}
