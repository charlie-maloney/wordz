// Mock data and DTOs for Wordz application
// This file contains TypeScript interfaces and mock data for various API endpoints.

// ************************************************************
// Mock data for the search component and the data being returned for it
// POST /api/words/check-word
export interface CheckAddWordRequestDTO {
  word: string;
}
export const mockCheckAddWordRequest: CheckAddWordRequestDTO = {
  word: 'serendipity',
};

// /api/words/check-word
export interface CheckAddWordResponseDTO {
  word: string;
  definition: string;
  alreadyExists: boolean;
}
export const mockCheckAddWordResponse: CheckAddWordResponseDTO = {
  word: 'serendipity',
  definition:
    'The occurrence of events by chance in a happy or beneficial way.',
  alreadyExists: false,
};

// ************************************************************
// Mock data for adding a word to the word bank
// POST /api/words
export interface AddWordRequestDTO {
  word: string;
  definition: string;
}
export const mockAddWordRequest: AddWordRequestDTO = {
  word: 'ephemeral',
  definition: 'Lasting for a very short time.',
};

export interface AddWordResponseDTO {
  id: string;
  word: string;
  definition: string;
  score: number;
  addedOn: Date;
  lastPracticedOn: Date;
  isDeleted: boolean;
}
export const mockAddWordResponse: AddWordResponseDTO = {
  id: 'word_001',
  word: 'ephemeral',
  definition: 'Lasting for a very short time.',
  score: 0,
  addedOn: new Date('2025-09-01T10:00:00Z'),
  lastPracticedOn: new Date('2025-09-10T10:00:00Z'),
  isDeleted: false,
};

// ************************************************************
// Right now we only have one game type, but this sets us up for future types
export enum GameType {
  ChooseTheSentence = 'ChooseTheSentence',
}

// ************************************************************
// New request to start a new practice session
// POST /api/practice-sessions
export interface PracticeSessionRequestDTO {
  filters: [];
}

// ************************************************************
// Information that gets returned when a practice session is started
export interface PracticeSessionResponseDTO {
  id: string;
  isCompleted: boolean;
  gameType: GameType;
  steps: CTSStep[];
}

export interface CTSStep {
  id: string;
  word: string;
  definition: string;
  options: CTSOption[];
}

export interface CTSOption {
  sentence: string;
  isCorrect: boolean;
  keyWord: string;
}

// Mock: Practice session response
export const mockPracticeSessionResponse: PracticeSessionResponseDTO = {
  id: 'session_123',
  isCompleted: false,
  gameType: GameType.ChooseTheSentence,
  steps: [
    {
      id: 'step_1',
      word: 'cogent',
      definition: 'Clear, logical, and convincing.',
      options: [
        {
          sentence: 'Her cogent argument convinced the entire jury.',
          isCorrect: true,
          keyWord: 'cogent',
        },
        {
          sentence: 'The mountain was cogent and beautiful.',
          isCorrect: false,
          keyWord: 'cogent',
        },
      ],
    },
  ],
};

// ************************************************************
// POST /api/practice-sessions/:sessionId/results
export interface PracticeSessionResultRequestDTO {
  sessionId: string;
  steps: {
    stepId: string;
    correct: boolean;
  }[];
}

// ************************************************************
// Information returned after submitting practice session results
export interface PracticeSessionResultResponseDTO {
  sessionId: string;
  totalSteps: number;
  isCompleted: boolean;
  correctSteps: number;
  scoreGained: number;
  words: string[];
}
export const mockPracticeSessionResultResponse: PracticeSessionResultResponseDTO =
  {
    sessionId: 'session_123',
    totalSteps: 1,
    isCompleted: true,
    correctSteps: 1,
    scoreGained: 10,
    words: ['cogent'],
  };

// ************************************************************
// GET /api/user-analytics
export interface UserAnalyticsResponseDTO {
  totalWords: number;
  totalPracticedWords: number;
  totalPracticeSessions: number;
  averageScorePerSession: number;
  wordsAddedLast7Days: number;
  wordsPracticedLast7Days: number;
}
// Mock: Analytics
export const mockUserAnalyticsResponse: UserAnalyticsResponseDTO = {
  totalWords: 25,
  totalPracticedWords: 20,
  totalPracticeSessions: 10,
  averageScorePerSession: 8.5,
  wordsAddedLast7Days: 3,
  wordsPracticedLast7Days: 5,
};

// ************************************************************
export interface WordDTO {
  id: string;
  word: string;
  definition: string;
  score: number;
  addedOn: Date;
  lastPracticedOn: Date;
  isDeleted: boolean;
}

// ************************************************************
// Mock: Words
export const mockWords: WordDTO[] = [
  {
    id: 'word_001',
    word: 'ephemeral',
    definition: 'Lasting for a very short time.',
    score: 12,
    addedOn: new Date('2025-09-01T10:00:00Z'),
    lastPracticedOn: new Date('2025-09-15T10:00:00Z'),
    isDeleted: false,
  },
  {
    id: 'word_002',
    word: 'lucid',
    definition: 'Expressed clearly; easy to understand.',
    score: 20,
    addedOn: new Date('2025-08-20T10:00:00Z'),
    lastPracticedOn: new Date('2025-09-18T10:00:00Z'),
    isDeleted: false,
  },
];

// ************************************************************
// GET /api/words
export interface ListWordsRequestDTO {
  page: number;
  limit: number;
}
// ************************************************************
// DELETE /api/words/:wordId
export interface ListWordsResponseDTO {
  data: WordDTO[];
  totalItems: number;
  pageCount: number;
  currentPage: number;
}
// Mock: List words response
export const mockListWordsResponse: ListWordsResponseDTO = {
  data: mockWords,
  totalItems: 2,
  pageCount: 1,
  currentPage: 1,
};

// ************************************************************
// GET /api/user-profile
export interface UserProfileResponseDTO {
  id: string;
  email: string;
  name: string;
  createdOn: Date;
  lastLogin: Date;
  isDeleted: boolean;
}

// Mock: User profile
export const mockUserProfileResponse: UserProfileResponseDTO = {
  id: 'user_001',
  email: 'testuser@example.com',
  name: 'Test User',
  createdOn: new Date('2025-01-01T12:00:00Z'),
  lastLogin: new Date('2025-09-20T09:00:00Z'),
  isDeleted: false,
};
