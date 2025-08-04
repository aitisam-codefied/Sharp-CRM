"use client";
import { Progress } from "@/components/ui/progress";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepProgress({
  currentStep,
  totalSteps,
}: StepProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-gray-500">
          {Math.round(progress)}% Complete
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
