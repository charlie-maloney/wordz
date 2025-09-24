'use client';
import { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type {
  CTSStep,
  PracticeSessionResultRequest,
} from '@/dtos/practice-session-schemas';

// Mock data for demonstration
const mockSteps: CTSStep[] = [
  {
    id: 'step-1',
    wordId: 'word-1',
    stepNumber: 1,
    word: 'beautiful',
    options: [
      {
        sentence: 'The beautiful garden was full of colorful flowers.',
        isCorrect: true,
        keyWord: 'beautiful',
      },
      {
        sentence: 'The ugly garden was full of colorful flowers.',
        isCorrect: false,
        keyWord: 'ugly',
      },
      {
        sentence: 'The small garden was full of colorful flowers.',
        isCorrect: false,
        keyWord: 'small',
      },
    ],
  },
  {
    id: 'step-2',
    wordId: 'word-2',
    stepNumber: 2,
    word: 'quickly',
    options: [
      {
        sentence: 'She walked slowly to the store yesterday.',
        isCorrect: false,
        keyWord: 'slowly',
      },
      {
        sentence: 'She walked quickly to the store yesterday.',
        isCorrect: true,
        keyWord: 'quickly',
      },
      {
        sentence: 'She walked carefully to the store yesterday.',
        isCorrect: false,
        keyWord: 'carefully',
      },
    ],
  },
  {
    id: 'step-3',
    wordId: 'word-3',
    stepNumber: 3,
    word: 'enormous',
    options: [
      {
        sentence: 'The tiny elephant trumpeted loudly in the zoo.',
        isCorrect: false,
        keyWord: 'tiny',
      },
      {
        sentence: 'The enormous elephant trumpeted loudly in the zoo.',
        isCorrect: true,
        keyWord: 'enormous',
      },
      {
        sentence: 'The young elephant trumpeted loudly in the zoo.',
        isCorrect: false,
        keyWord: 'young',
      },
    ],
  },
];

interface QuestionStepProps {
  step: CTSStep;
  onAnswer: (optionIndex: number) => void;
  selectedOption?: number;
  showResult?: boolean;
}

function QuestionStep({
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

interface ResultsProps {
  results: PracticeSessionResultRequest['steps'];
  totalSteps: number;
}

function Results({ results, totalSteps }: ResultsProps) {
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

export default function PracticePage() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<{
    [stepId: string]: number;
  }>({});
  const [showResult, setShowResult] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [results, setResults] = useState<PracticeSessionResultRequest['steps']>(
    [],
  );

  const currentStep = mockSteps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / mockSteps.length) * 100;

  const handleAnswer = (optionIndex: number) => {
    const stepId = currentStep.id;
    setSelectedOptions((prev) => ({ ...prev, [stepId]: optionIndex }));
    setShowResult(true);

    // Record the result
    const isCorrect = currentStep.options[optionIndex].isCorrect;
    const newResult = { id: stepId, correct: isCorrect };

    setResults((prev) => [...prev.filter((r) => r.id !== stepId), newResult]);

    // Auto-advance after 2 seconds
    setTimeout(() => {
      if (currentStepIndex < mockSteps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
        setShowResult(false);
      } else {
        setSessionComplete(true);
      }
    }, 100);
  };

  if (sessionComplete) {
    return (
      <div className="container mx-auto p-6">
        <Results results={results} totalSteps={mockSteps.length} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="w-full max-w-3xl mx-auto space-y-4">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>
            Question {currentStepIndex + 1} of {mockSteps.length}
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      <QuestionStep
        step={currentStep}
        onAnswer={handleAnswer}
        selectedOption={selectedOptions[currentStep.id]}
        showResult={showResult}
      />
    </div>
  );
}
