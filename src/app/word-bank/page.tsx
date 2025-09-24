'use client';
import { useListWordsQuery } from '@/integrations/react-query/api';
import { WordsDataTable } from '@/components/WordsDataTable';
import { columns } from '@/components/WordsTableColumn';

export default function WordBankPage() {
  const wordList = useListWordsQuery();

  if (wordList.isLoading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Word Bank</h1>
        <div>Loading...</div>
      </div>
    );
  }

  if (wordList.error) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Word Bank</h1>
        <div className="text-red-500">
          Error loading words: {wordList.error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Word Bank</h1>
      <WordsDataTable columns={columns} data={wordList.data?.data || []} />
    </div>
  );
}
