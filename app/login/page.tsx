"use client";

import type React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/providers/auth-provider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push(`/dashboard/${user.role}`);
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome to Sharp Management System",
        });
      } else {
        setError("Invalid email or password");
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
      <div className="absolute -top-2 -left-2 w-full">
        <Image
          src="/stripe1.png"
          alt=""
          width={600}
          height={60}
          className="object-cover"
        />
      </div>
      <div className="absolute top-5 -right-5 w-full">
        <Image
          src="/stripe2.png"
          alt=""
          width={1400}
          height={60}
          className="object-cover"
        />
      </div>
      <div className="absolute top-80 -left-5 w-full">
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
                    htmlFor="email"
                    className="text-sm text-gray-600 mb-2 block"
                  >
                    Email or mobile phone number
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

      {/* Mobile responsive version */}
      <div className="md:hidden relative z-10 flex justify-center items-center min-h-screen p-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-md">
          {/* Mobile image section */}
          <div className="h-64 relative">
            <Image
              src="/placeholder.svg?height=256&width=400"
              alt="Venice canal with colorful buildings"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-4 left-4 flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-2 border-2 border-white shadow-lg">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="Sarah Johnson"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div className="text-white">
                <p className="font-semibold text-sm drop-shadow-lg">
                  Sarah Johnson
                </p>
                <p className="text-xs opacity-90 drop-shadow-lg">STF001</p>
              </div>
            </div>
          </div>

          {/* Mobile form section */}
          <div className="p-8 bg-gray-50">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Hello!</h1>
            <p className="text-gray-500 mb-8">Welcome to Sharp MS</p>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label
                  htmlFor="email-mobile"
                  className="text-sm text-gray-600 mb-2 block"
                >
                  Email or mobile phone number
                </Label>
                <Input
                  id="email-mobile"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 text-base border-gray-200 rounded-xl bg-white"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label
                    htmlFor="password-mobile"
                    className="text-sm text-gray-600"
                  >
                    Your password
                  </Label>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="text-sm text-gray-500 p-0 h-auto"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </div>
                <Input
                  id="password-mobile"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 text-base border-gray-200 rounded-xl bg-white"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold rounded-xl"
                style={{
                  backgroundColor: "#ff7b7b",
                  color: "white",
                }}
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Log in"}
              </Button>

              <div className="text-center text-xs text-gray-500 leading-relaxed">
                By continuing, you agree to the{" "}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-xs underline"
                >
                  Terms of use
                </Button>{" "}
                and{" "}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-xs underline"
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
