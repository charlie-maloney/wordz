'use client';

import SearchCommand from '@/components/SearchCommand';
import DefinitionCard from '@/components/DefinitionCard';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
  const [wordBank, setWordBank] = useState<Set<string>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleWordSelect = (wordData: WordData) => {
    setSelectedWord(wordData);
  };

  const handleAddToWordBank = (word: string) => {
    setWordBank((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(word)) {
        newSet.delete(word);
      } else {
        newSet.add(word);
      }
      return newSet;
    });
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
            wordBank={wordBank}
            onAddToWordBank={handleAddToWordBank}
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
