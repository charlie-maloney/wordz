'use client';

import SearchCommand from '@/components/SearchCommand';
import DefinitionCard from '@/components/DefinitionCard';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
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

  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to check if word exists in word bank
  const checkWordInDatabase = async (word: string): Promise<void> => {
    console.log(`Checking if word "${word}" exists in database...`);

    // ******************************
    // TODO: Replace with actual API call
    // ******************************

    // For now, using mock data
    const mockData: CheckAddWordResponseDTO = {
      ...mockCheckAddWordResponse,
      word: word,
      alreadyExists: word.toLowerCase() === 'serendipity', // Only serendipity exists in mock
    };

    setIsInWordBank(mockData.alreadyExists);
    console.log('Mock database response:', mockData);
  };

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
          />
        )}
      </div>
      <div className="container mx-auto flex flex-col items-center justify-center gap-2 py-3 max-w-sm">
        <Link href="/practice">
          <Button variant="outline" className="px-20 py-7">
            Practice
          </Button>
        </Link>
      </div>
    </div>
  );
}
