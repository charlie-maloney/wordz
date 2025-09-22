import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PracticePage() {
  return (
    <div>
      <h1>Practice</h1>
      <div>
        <Link href="/">
          <Button>Home</Button>
        </Link>
        <Link href="/word-bank">
          <Button>Word Bank</Button>
        </Link>
        <Link href="/profile">
          <Button>Profile</Button>
        </Link>
      </div>
    </div>
  );
}
