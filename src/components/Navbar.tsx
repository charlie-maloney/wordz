// This page is a client component that renders the navigation bar for both in desktop and mobile views. This could be broken down into smaller components but for simplicity it's kept in one file.

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ModeToggle from './ModeToggle';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  href: string;
}

const navItems: NavItem[] = [
  { title: 'Home', href: '/' },
  { title: 'Practice', href: '/practice' },
  { title: 'Word Bank', href: '/word-bank' },
];

const profileItem: NavItem[] = [
  { title: 'Profile', href: '/profile' },
  // #Need to add a modal for sign in
  // { title: 'Sign In', href: '/' },
];

// Combine all items for mobile navigation
const allNavItems = [...navItems, ...profileItem];

export default function Navbar() {
  // pathname is used to determine which page the user is on
  const pathname = usePathname();

  //use state to manage sheet open/close
  const [open, setOpen] = React.useState(false);

  // Setting the state for whether or not the user is signed in. This would be replaced with actual authentication logic
  // const [isSignedIn, setIsSignedIn] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <div className="mr-4 ml-4 hidden md:flex">
          <Link
            href="/"
            className="mr-6 flex items-center space-x-2 font-bold text-xl"
          >
            Word Mate.
          </Link>
        </div>

        {/* Desktop Navigation - Left side items */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname === item.href
                  ? 'text-foreground'
                  : 'text-foreground/60',
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Desktop Profile Link - Far right */}
        <div className="hidden md:flex flex-1 justify-end items-center">
          <ModeToggle />
          {profileItem.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'transition-colors hover:text-foreground/80 text-sm font-medium ml-6',
                pathname === item.href
                  ? 'text-foreground'
                  : 'text-foreground/60',
              )}
            >
              {item.title}
            </Link>
          ))}
        </div>

        {/* Mobile Layout */}
        <div className="flex flex-1 items-center justify-between md:hidden">
          {/* Mobile Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 font-bold text-xl ml-4"
          >
            Word Mate.
          </Link>

          {/* Mobile Navigation */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <SheetHeader>
                <SheetTitle>
                  <Link
                    href="/"
                    className="flex items-center"
                    onClick={() => setOpen(false)}
                  >
                    <span className="font-bold text-xl">Word Mate</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                <div className="flex flex-col space-y-3">
                  {allNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'transition-colors hover:text-foreground/80 text-lg',
                        pathname === item.href
                          ? 'text-foreground font-semibold'
                          : 'text-foreground/60',
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
                  <ModeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
