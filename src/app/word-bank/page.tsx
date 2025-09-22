import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function WordBankPage() {
  return (
    <div>
      <h1>Word Bank</h1>
      <div>
        <Link href="/">
          <Button>Home</Button>
        </Link>
        <Link href="/practice">
          <Button>Practice</Button>
        </Link>
        <Link href="/profile">
          <Button>Profile</Button>
        </Link>
      </div>
    </div>
  );
}
