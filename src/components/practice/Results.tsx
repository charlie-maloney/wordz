'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PracticeSessionResultRequest } from '@/dtos/practice-session-schemas';

interface ResultsProps {
  results: PracticeSessionResultRequest['steps'];
  totalSteps: number;
}

export function Results({ results, totalSteps }: ResultsProps) {
  const correctCount = results.filter((r) => r.correct).length;
  const percentage = Math.round((correctCount / totalSteps) * 100);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          Practice Session Complete!
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div className="text-6xl font-bold text-primary">{percentage}%</div>
        <div className="text-xl text-muted-foreground">
          You got {correctCount} out of {totalSteps} questions correct
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {correctCount}
            </div>
            <div className="text-sm text-green-600">Correct</div>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {totalSteps - correctCount}
            </div>
            <div className="text-sm text-red-600">Incorrect</div>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalSteps}</div>
            <div className="text-sm text-blue-600">Total</div>
          </div>
        </div>
        <Button className="mt-6" onClick={() => window.location.reload()}>
          Practice Again
        </Button>
      </CardContent>
    </Card>
  );
}
