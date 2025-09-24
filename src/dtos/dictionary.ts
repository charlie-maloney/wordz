export type DictionaryResponse = DictionaryEntry[];

export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics: Phonetic[];
  origin?: string;
  meanings: Meaning[];
}

export interface Phonetic {
  text?: string;
  audio?: string; // URL (may be protocol-relative)
}

export interface Meaning {
  partOfSpeech: PartOfSpeech;
  definitions: Definition[];
}

export interface Definition {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
}

export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'pronoun'
  | 'preposition'
  | 'conjunction'
  | 'interjection'
  | 'exclamation'
  | 'article'
  | 'determiner'
  | 'auxiliary'
  | 'modal'
  | (string & {}); // allow unforeseen tags while keeping intellisense for common ones
