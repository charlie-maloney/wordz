'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { CTSStep } from '@/dtos/practice-session-schemas';
import { motion, AnimatePresence } from 'framer-motion';

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
            <div key={index} className="space-y-2">
              <Button
                size={'lg'}
                variant={buttonVariant}
                className={cn(
                  'w-full',
                  showResult && option.isCorrect && 'ring-2 ring-green-500',
                  showResult &&
                    selectedOption === index &&
                    !option.isCorrect &&
                    'ring-2 ring-red-500',
                )}
                onClick={() => !showResult && onAnswer(index)}
                // disabled={showResult}
              >
                {renderSentenceWithKeyword(option.sentence, option.keyWord)}
              </Button>

              <AnimatePresence>
                {showResult &&
                  (selectedOption === index || option.isCorrect) &&
                  option.explanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -5 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      transition={{
                        ease: 'easeOut',
                      }}
                      className={cn(
                        'text-sm overflow-hidden',
                        option.isCorrect
                          ? ' text-green-800 '
                          : ' text-red-800 ',
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-xs uppercase tracking-wide">
                          {option.isCorrect ? 'Correct' : 'Incorrect'}:
                        </span>
                        <span>{option.explanation}</span>
                      </div>
                    </motion.div>
                  )}
              </AnimatePresence>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
