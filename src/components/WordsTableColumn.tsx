'use client';

import { ColumnDef } from '@tanstack/react-table';
import { WordResponse } from '@/dtos';

export const columns: ColumnDef<WordResponse>[] = [
  {
    accessorKey: 'word',
    header: 'Word',
  },
  {
    accessorKey: 'score',
    header: 'Score',
    cell: ({ row }) => {
      const score = parseFloat(row.getValue('score'));
      return <div className="text-right font-medium">{score}</div>;
    },
  },
  {
    accessorKey: 'addedOn',
    header: 'Added On',
    cell: ({ row }) => {
      const date = new Date(row.getValue('addedOn'));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: 'lastPracticedOn',
    header: 'Last Practiced',
    cell: ({ row }) => {
      const date = row.getValue('lastPracticedOn');
      if (!date) return <div className="text-muted-foreground">Never</div>;
      return <div>{new Date(date as string).toLocaleDateString()}</div>;
    },
  },
];
