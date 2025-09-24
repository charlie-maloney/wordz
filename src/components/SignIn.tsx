import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { signIn } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (value === '') {
      setEmailError('');
      setIsValid(false);
    } else if (!validateEmail(value)) {
      setEmailError('Please enter a valid email address');
      setIsValid(false);
    } else {
      setEmailError('');
      setIsValid(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    try {
      await signIn(email);
      // Reset form and close dialog on success
      setEmail('');
      setEmailError('');
      setIsValid(false);
      setIsOpen(false);
    } catch {
      setEmailError('Sign in failed. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="transition-colors hover:text-foreground/80 text-sm font-medium">
          Sign in
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-4 items-center">
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>
              Sign in using magic link with your email below
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="email-1" className="mb-3">
                Email
              </Label>
              <Input
                id="email-1"
                name="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="example@example.com"
                className={
                  emailError ? 'border-red-500 focus-visible:ring-red-500 ' : ''
                }
                autoComplete="off"
                required
              />
              <p className="text-sm text-red-500 mt-1 mb-5 min-h-[1.25rem]">
                {emailError || '\u00A0'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={!isValid || !email}
              className={
                !isValid || !email ? 'opacity-50 cursor-not-allowed' : ''
              }
            >
              Sign In
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
