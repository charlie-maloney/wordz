'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { CTSStep } from '@/dtos/practice-session-schemas';

interface QuestionStepProps {
  step: CTSStep;
  onAnswer: (optionIndex: number) => void;
  selectedOption?: number;
  showResult?: boolean;
}

export function QuestionStep({
  step,
  onAnswer,
  selectedOption,
  showResult,
}: QuestionStepProps) {
  const renderSentenceWithKeyword = (sentence: string, keyword: string) => {
    const parts = sentence.split(new RegExp(`(\\b${keyword}\\b)`, 'gi'));
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === keyword.toLowerCase() ? (
            <span
              key={index}
              className="text-primary font-semibold bg-primary/10 px-1 rounded"
            >
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          ),
        )}
      </span>
    );
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>
          Select the sentence that uses &ldquo;{step.word}&rdquo; correctly
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {step.options.map((option, index) => {
          let buttonVariant:
            | 'default'
            | 'outline'
            | 'secondary'
            | 'destructive' = 'outline';

          if (showResult && selectedOption === index) {
            buttonVariant = option.isCorrect ? 'default' : 'destructive';
          } else if (showResult && option.isCorrect) {
            buttonVariant = 'secondary';
          } else if (selectedOption === index && !showResult) {
            buttonVariant = 'default';
          }

          return (
            <Button
              key={index}
              variant={buttonVariant}
              className={cn(
                'w-full p-4 h-auto text-left justify-start text-wrap whitespace-normal',
                showResult && option.isCorrect && 'ring-2 ring-green-500',
                showResult &&
                  selectedOption === index &&
                  !option.isCorrect &&
                  'ring-2 ring-red-500',
              )}
              onClick={() => !showResult && onAnswer(index)}
              disabled={showResult}
            >
              {renderSentenceWithKeyword(option.sentence, option.keyWord)}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
