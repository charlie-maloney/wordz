'use client';
import { Button } from '@/components/ui/button';
import { createClient } from '@/integrations/supabase/browser';
import {
  useAddWordMutation,
  useListWordsQuery,
} from '@/integrations/react-query/api';
import { useEffect } from 'react';

export default function DevTest() {
  const { data } = useListWordsQuery();
  const addWordMutation = useAddWordMutation();

  const addTestWord = async () => {
    addWordMutation.mutate({
      word: 'dog + ' + Math.floor(Math.random() * 10000),
    });
  };

  useEffect(() => {
    console.log('Words data:', data);
  }, [data]);

  return (
    <div>
      <div>
        <div>
          <Button
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signOut();
              window.location.href = '/';
            }}
          >
            Sign out
          </Button>
          <Button onClick={addTestWord}>Add test word</Button>
        </div>
      </div>
    </div>
  );
}
