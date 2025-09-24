'use client';

import SearchCommand from '@/components/SearchCommand';
import DefinitionCard from '@/components/DefinitionCard';
import { useState, useEffect } from 'react';
import {
  mockCheckAddWordResponse,
  CheckAddWordResponseDTO,
} from '@/Mock/mockData';

interface WordData {
  word: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
    }[];
  }[];
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [selectedWord, setSelectedWord] = useState<WordData | null>(null);
  const [isInWordBank, setIsInWordBank] = useState<boolean>(false);
  const [userAuthenticated, setUserAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    // Check for session cookie/authentication
    // TODO: Replace with actual session checking logic
    console.log('User is not logged in');
    setUserAuthenticated(false);
  }, []);

  // Log userAuthenticated state for debugging
  console.log('User authentication status:', userAuthenticated);

  // ******************************
  // TODO: Replace with actual API call
  // ******************************

  // Function to check if word exists in word bank
  const checkWordInDatabase = async (word: string): Promise<void> => {
    console.log(`Checking if word "${word}" exists in database...`);

    const mockData: CheckAddWordResponseDTO = {
      ...mockCheckAddWordResponse,
      word: word,
      alreadyExists: word.toLowerCase() === 'serendipity', // Only serendipity exists in mock
    };
    setIsInWordBank(mockData.alreadyExists);
    console.log('Mock database response:', mockData);
  };

  // Function to add word to database
  const addWordToDatabase = async (word: string): Promise<void> => {
    console.log(`Adding word "${word}" to database...`);
    console.log(`Word "${word}" has been added to your word bank!`);
    setIsInWordBank(true);
  };

  // ******************************

  useEffect(() => {
    if (selectedWord) {
      console.log('Selected word changed:', selectedWord);
      checkWordInDatabase(selectedWord.word);
    }
  }, [selectedWord]);

  if (!mounted) {
    return null;
  }

  const handleWordSelect = (wordData: WordData) => {
    setSelectedWord(wordData);
    setIsInWordBank(false);
  };

  return (
    <div>
      <div className="container mx-auto flex flex-col items-center justify-center gap-8 py-3 my-6">
        <h1 className="text-4xl font-bold">Word Mate.</h1>
        <h2 className="text-l">The place to learn new words</h2>
      </div>

      <div className="container mx-auto flex flex-col items-center max-w-85 min-h-29 md:min-w-[450px]">
        <SearchCommand onWordSelect={handleWordSelect} />
      </div>
      <div className="container mx-auto flex flex-col items-center max-w-85 min-h-50 md:min-w-[450px]">
        {selectedWord && (
          <DefinitionCard
            selectedWord={selectedWord}
            isInWordBank={isInWordBank}
            setIsInWordBank={setIsInWordBank}
            onAddWord={addWordToDatabase}
          />
        )}
      </div>
    </div>
  );
}
