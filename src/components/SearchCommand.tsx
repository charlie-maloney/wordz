'use client';
import { Search, Loader2 } from 'lucide-react';

import { useState, useMemo, useEffect } from 'react';

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

interface DictionaryApiResponse {
  word: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
    }[];
  }[];
  phonetics?: {
    text?: string;
    audio?: string;
  }[];
}

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

// Props for the SearchCommand component. These onWordSelect prop is a callback function that gets called when a word is selected from the search results.
interface SearchCommandProps {
  onWordSelect?: (word: WordData) => void;
}

export default function SearchCommand({ onWordSelect }: SearchCommandProps) {
  // State to hold the search input value
  const [searchValue, setSearchValue] = useState('');

  // State to hold the search results
  const [searchResults, setSearchResults] = useState<string[]>([]);

  // State to manage loading state
  const [isLoading, setIsLoading] = useState(false);

  // Async function to fetch word data from the dictionary API
  // #This could be moved to a separate utility file if needed elsewhere

  const searchDictionaryAPI = async (word: string): Promise<string[]> => {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word.trim()}`,
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Word not found');
      }
      throw new Error('Failed to fetch word definition');
    }

    const data: DictionaryApiResponse[] = await response.json();

    // Return unique word names
    const uniqueWords = [...new Set(data.map((entry) => entry.word))];
    return uniqueWords.slice(0, 10);
  };

  // Function to fetch full word data including definitions
  // #This could be moved to a separate utility file if needed elsewhere

  const fetchFullWordData = async (word: string): Promise<WordData> => {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word.trim()}`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch word definition');
    }

    const data: DictionaryApiResponse[] = await response.json();
    const entry = data[0]; // Take the first entry

    return {
      word: entry.word,
      meanings: entry.meanings,
    };
  };

  useEffect(() => {
    const searchWord = async () => {
      if (!searchValue.trim()) {
        setSearchResults([]);
        return;
      }

      if (searchValue.length < 2) return;

      setIsLoading(true);

      try {
        const results = await searchDictionaryAPI(searchValue);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchWord, 500);
    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  // Memoize the search results to avoid unnecessary re-renders
  const displayWords = useMemo(() => {
    return searchResults;
  }, [searchResults]);

  const handleWordSelect = async (word: string) => {
    if (onWordSelect) {
      try {
        setIsLoading(true);
        const fullWordData = await fetchFullWordData(word);
        onWordSelect(fullWordData);
      } catch (error) {
        console.error('Failed to fetch word data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    setSearchValue('');
  };

  return (
    <Command className="rounded-lg border shadow-md ">
      <div className="flex h-9 items-center gap-2 border-b px-3">
        <Search className="size-4 shrink-0 opacity-50" />
        <input
          type="text"
          placeholder="Enter a word to learn..."
          spellCheck={true}
          autoComplete="on"
          autoFocus
          className="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {isLoading && <Loader2 className="size-4 animate-spin opacity-50" />}
      </div>
      <CommandList>
        {displayWords.length > 0 && (
          <CommandGroup heading="Dictionary Results">
            {displayWords.map((word, index) => (
              <CommandItem
                key={`${word}-${index}`}
                onSelect={() => handleWordSelect(word)}
                className="cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">{word}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator />
      </CommandList>
    </Command>
  );
}
