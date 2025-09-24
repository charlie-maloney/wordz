import {
  CTSStepSchema,
  PracticeSessionResponse,
  PracticeSessionResponseSchema,
  PracticeSessionResultRequest,
} from '@/dtos';
import { Database } from '@/lib/supabase.types';
import { nanoid } from 'nanoid';
import z from 'zod';

export const createCTSPracticeSession = async (
  userId: string,
  wordDefList: { word: string; wordId: string }[],
): Promise<Omit<PracticeSessionResponse, 'id'>> => {
  // Implementation goes here
  const session: Omit<PracticeSessionResponse, 'id'> = {
    isCompleted: false,
    gameType: 'ChooseTheSentence',
    steps: wordDefList.map((wd, index) => ({
      id: nanoid(),
      stepNumber: index + 1,
      word: wd.word,
      wordId: wd.wordId,
      //   TODO: these options should be generated with AI
      options: [
        {
          sentence: `This is a correct sentence using the word ${wd.word}.`,
          isCorrect: true,
          keyWord: wd.word,
        },
        {
          sentence: `This is an incorrect sentence not using the word.`,
          isCorrect: false,
          keyWord: 'incorrect',
        },
        {
          sentence: `Another incorrect sentence without the word.`,
          isCorrect: false,
          keyWord: 'another',
        },
      ],
    })),
  };

  PracticeSessionResponseSchema.omit({ id: true }).parse(session);

  return session;
};

interface PracticeResult {
  word: string;
  wordId: string;
  scoreDelta: number;
  stepId: string;
}

export const scoreCTSSession = (
  session: Database['public']['Tables']['practice_sessions']['Row'],
  results: PracticeSessionResultRequest,
): PracticeResult[] => {
  const resultDict = results.steps.reduce<Record<string, boolean>>(
    (acc, step) => {
      acc[step.id] = step.correct;
      return acc;
    },
    {},
  );

  const steps = z.array(CTSStepSchema).parse(session.steps);

  const practiceResults: PracticeResult[] = steps
    .map((step) => {
      if (!(step.id in resultDict)) {
        return;
      }

      const scoreDelta = resultDict[step.id] ? 100 : -100;
      return {
        word: step.word,
        scoreDelta,
        stepId: step.id,
        wordId: step.wordId,
      };
    })
    .filter((res): res is PracticeResult => res !== undefined);

  return practiceResults;
};
