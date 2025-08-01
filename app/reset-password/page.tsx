"use client";

import type React from "react";
import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
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
import ResetPasswordForm from "../../components/resetPassworfForm";

export default function ResetPasswordPage() {
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
            <Suspense fallback={<div>Loading...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
