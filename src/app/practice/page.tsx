'use client';
import { useState } from 'react';
import type {
  CTSStep,
  PracticeSessionResultRequest,
} from '@/dtos/practice-session-schemas';
import { QuestionStep } from '@/components/practice/QuestionStep';
import { Results } from '@/components/practice/Results';
import { ProgressSection } from '@/components/practice/ProgressSection';

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
      <ProgressSection
        currentStep={currentStepIndex}
        totalSteps={mockSteps.length}
        progress={progress}
      />

      <QuestionStep
        step={currentStep}
        onAnswer={handleAnswer}
        selectedOption={selectedOptions[currentStep.id]}
        showResult={showResult}
      />
    </div>
  );
}
