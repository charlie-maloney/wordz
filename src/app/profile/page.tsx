import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  return (
    <div>
      <h1>Profile</h1>
      <div>
        <Link href="/">
          <Button>Home</Button>
        </Link>
        <Link href="/practice">
          <Button>Practice</Button>
        </Link>
        <Link href="/word-bank">
          <Button>Word Bank</Button>
        </Link>
      </div>
    </div>
  );
}
