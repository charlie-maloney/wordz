'use client';

import { Progress } from '@/components/ui/progress';

interface ProgressSectionProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
}

export function ProgressSection({
  currentStep,
  totalSteps,
  progress,
}: ProgressSectionProps) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>
          Question {currentStep + 1} of {totalSteps}
        </span>
        <span>{Math.round(progress)}% complete</span>
      </div>
      <Progress value={progress} className="w-full" />
    </div>
  );
}
