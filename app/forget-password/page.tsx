"use client";
import type React from "react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRequestPasswordChange } from "@/hooks/use-requestPasswordChange";

export default function ForgotPasswordPage() {
  const [emailAddress, setemailAddress] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const mutation = useRequestPasswordChange();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    mutation.mutate(
      { emailAddress },
      {
        onSuccess: () => {
          toast({
            title: "OTP Sent",
            description: "Check your email for the verification code.",
          });
          router.push(`/otp`);
        },
        onError: (err: any) => {
          setError(err?.response?.data?.message || "Something went wrong.");
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

          {/* Right side - Forgot Password form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
            <div className="max-w-sm mx-auto w-full">
              {/* Back to Login Link */}
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Link>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-red-500" />
                </div>
                <h1 className="text-3xl font-bold mb-2 text-gray-900">
                  Forgot Password?
                </h1>
                <p className="text-gray-500 text-base">
                  No worries, we'll send you reset instructions.
                </p>
              </div>

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
                    Email address
                  </Label>
                  <Input
                    id="emailAddress"
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setemailAddress(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="text-base border-gray-200 rounded-xl bg-white focus:border-gray-300 focus:ring-0"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  style={{
                    backgroundColor: "#ff7b7b",
                    color: "white",
                  }}
                  className="w-full"
                >
                  {mutation.isPending ? "Sending..." : "Send Reset Email"}
                </Button>
              </form>

              <div className="text-center text-[12px] text-gray-500 mt-6">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="text-gray-700 underline hover:text-gray-900"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
