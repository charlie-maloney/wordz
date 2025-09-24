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
        explanation:
          'This sentence correctly uses "beautiful" to describe the garden in a positive way.',
        isCorrect: true,
        keyWord: 'beautiful',
      },
      {
        sentence: 'The beautiful garden was full of ugly flowers.',
        explanation:
          'This sentence contradicts the word "beautiful" by describing the flowers as ugly.',
        isCorrect: false,
        keyWord: 'beautiful',
      },
      {
        sentence: 'The beautiful garden was full of dead flowers.',
        explanation:
          'This sentence contradicts the word "beautiful" by describing the flowers as dead.',
        isCorrect: false,
        keyWord: 'beautiful',
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
        sentence: 'She walked quickly to the store yesterday.',
        explanation:
          'This sentence correctly uses "quickly" to describe the manner of walking.',
        isCorrect: true,
        keyWord: 'quickly',
      },
      {
        sentence: 'She walked quickly to the wrong store yesterday.',
        explanation:
          'Although "quickly" is used, the focus on the wrong store makes it incorrect.',
        isCorrect: false,
        keyWord: 'quickly',
      },
      {
        sentence: 'She walked quickly but got lost yesterday.',
        explanation:
          'While "quickly" is used, the outcome of getting lost makes it incorrect.',
        isCorrect: false,
        keyWord: 'quickly',
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
        sentence: 'The enormous elephant trumpeted loudly in the zoo.',
        explanation:
          'This sentence correctly uses "enormous" to describe the large size of the elephant.',
        isCorrect: true,
        keyWord: 'enormous',
      },
      {
        sentence: 'The enormous elephant whispered softly in the zoo.',
        explanation:
          'The action of whispering softly contradicts the idea of an "enormous" elephant.',
        isCorrect: false,
        keyWord: 'enormous',
      },
      {
        sentence: 'The enormous elephant hid behind a small tree.',
        explanation:
          'The idea of an "enormous" elephant hiding behind a small tree is unrealistic.',
        isCorrect: false,
        keyWord: 'enormous',
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
    }, 3000);
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
