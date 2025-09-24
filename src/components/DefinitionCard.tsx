'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Check } from 'lucide-react';

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

interface WordDefinitionCardProps {
  selectedWord: WordData;
  isInWordBank: boolean;
  setIsInWordBank: (value: boolean) => void;
  onAddWord?: (word: string) => Promise<void>;
}

export default function DefinitionCard({
  selectedWord,
  isInWordBank,
  setIsInWordBank,
  onAddWord,
}: WordDefinitionCardProps) {
  const handleAddToWordBank = async () => {
    if (!isInWordBank && onAddWord) {
      await onAddWord(selectedWord.word);
    } else if (isInWordBank) {
      // Handle removal logic if needed (for now just toggle)
      setIsInWordBank(false);
    }
  };
  return (
    <Card className=" rounded-lg border shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between max-h-4">
          <CardTitle className="text-2xl">{selectedWord.word}</CardTitle>
          <Button
            onClick={handleAddToWordBank}
            disabled={isInWordBank}
            variant={isInWordBank ? 'secondary' : 'default'}
            className={isInWordBank ? 'text-green-600' : ''}
          >
            {isInWordBank ? (
              <>
                <Check className="size-4 mr-2" />
                Added
              </>
            ) : (
              <>
                <Plus className="size-4 " />
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {selectedWord.meanings.map((meaning, meaningIndex) => (
          <div key={meaningIndex} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm bg-muted px-3 py-1 rounded-full">
                {meaning.partOfSpeech}
              </span>
            </div>
            <div className="space-y-2">
              {meaning.definitions.map((def, defIndex) => (
                <div key={defIndex} className="space-y-2">
                  <CardDescription className="text-xs">
                    {defIndex + 1}. {def.definition}
                  </CardDescription>
                  {def.example && (
                    <div className="border-l-4 border-muted pl-4 ml-4">
                      <p className="text-xs text-muted-foreground italic">
                        Example: &ldquo;{def.example}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
