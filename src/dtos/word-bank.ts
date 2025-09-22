// Request
// UI --> API --> DB

// Response
// API --> UI

// POST /api/words/check-word
export interface CheckAddWordRequestDTO {
  word: string;
}

// /api/words/check-word
export interface CheckAddWordResponseDTO {
  word: string;
  definition: string;
  alreadyExists: boolean;
}

// POST /api/words
export interface AddWordRequestDTO {
  word: string;
  definition: string;
}

export interface AddWordResponseDTO {
  id: string;
  word: string;
  definition: string;
  score: number;
  addedOn: Date;
  lastPracticedOn: Date;
  isDeleted: boolean;
}

// POST /api/practice-sessions
export interface PracticeSessionRequestDTO {
  filters: [];
}

interface CTSOption {
  sentence: string;
  isCorrect: boolean;
  keyWord: string;
}

interface CTSStep {
  id: string;
  word: string;
  definition: string;
  options: CTSOption[];
}

enum GameType {
  ChooseTheSentence = 'ChooseTheSentence',
}

export interface PracticeSessionResponseDTO {
  id: string;
  isCompleted: boolean;
  gameType: GameType;
  steps: CTSStep[];
}

// POST /api/practice-sessions/:sessionId/results
export interface PracticeSessionResultRequestDTO {
  sessionId: string;
  steps: {
    stepId: string;
    correct: boolean;
  }[];
}

export interface PracticeSessionResultResponseDTO {
  sessionId: string;
  totalSteps: number;
  isCompleted: boolean;
  correctSteps: number;
  scoreGained: number;
  words: string[];
}

// GET /api/user-analytics
export interface UserAnalyticsResponseDTO {
  totalWords: number;
  totalPracticedWords: number;
  totalPracticeSessions: number;
  averageScorePerSession: number;
  wordsAddedLast7Days: number;
  wordsPracticedLast7Days: number;
}

export interface WordDTO {
  id: string;
  word: string;
  definition: string;
  score: number;
  addedOn: Date;
  lastPracticedOn: Date;
  isDeleted: boolean;
}

// GET /api/words
export interface ListWordsRequestDTO {
  page: number;
  limit: number;
}

// DELETE /api/words/:wordId
export interface ListWordsResponseDTO {
  data: WordDTO[];
  totalItems: number;
  pageCount: number;
  currentPage: number;
}

// GET /api/user-profile
export interface UserProfileResponseDTO {
  id: string;
  email: string;
  name: string;
  createdOn: Date;
  lastLogin: Date;
  isDeleted: boolean;
}
