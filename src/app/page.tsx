import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div>
      <div>
        <h1>Home</h1>
        <div>
          <Link href="/practice">
            <Button>Practice</Button>
          </Link>
          <Link href="/word-bank">
            <Button>Word Bank</Button>
          </Link>
          <Link href="/profile">
            <Button>Profile</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
