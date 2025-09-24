'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Pencil } from 'lucide-react';

export default function ProfilePage() {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [tempName, setTempName] = useState(name);
  const [tempEmail, setTempEmail] = useState(email);

  const handleNameEdit = () => {
    if (isEditingName) {
      setName(tempName);
      setIsEditingName(false);
    } else {
      setTempName(name);
      setIsEditingName(true);
    }
  };

  const handleEmailEdit = () => {
    if (isEditingEmail) {
      setEmail(tempEmail);
      setIsEditingEmail(false);
    } else {
      setTempEmail(email);
      setIsEditingEmail(true);
    }
  };

  const handleCancel = () => {
    setTempName(name);
    setTempEmail(email);
    setIsEditingName(false);
    setIsEditingEmail(false);
  };

  const handleUpdate = () => {
    setName(tempName);
    setEmail(tempEmail);
    setIsEditingName(false);
    setIsEditingEmail(false);
    // Here you would typically make an API call to update the user data
    console.log('Updated profile:', { name: tempName, email: tempEmail });
  };

  const handleDeleteAccount = () => {
    // Handle account deletion logic
    console.log('Deleting account...');
  };

  const hasChanges = tempName !== name || tempEmail !== email;

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            Profile details:
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-medium">
              Name:
            </Label>
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <Input
                  id="name"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="flex-1"
                  autoFocus
                />
              ) : (
                <div className="flex-1 px-3 py-2 border border-input rounded-md bg-background">
                  {name}
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNameEdit}
                className="p-2"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-medium">
              Email:
            </Label>
            <div className="flex items-center gap-2">
              {isEditingEmail ? (
                <Input
                  id="email"
                  type="email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  className="flex-1"
                  autoFocus
                />
              ) : (
                <div className="flex-1 px-3 py-2 border border-input rounded-md bg-background">
                  {email}
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEmailEdit}
                className="p-2"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            {/* Update/Cancel buttons - only show when editing */}
            {(isEditingName || isEditingEmail) && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1 bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdate}
                  className="flex-1"
                  disabled={!hasChanges}
                >
                  Update
                </Button>
              </div>
            )}

            <div className="pt-8 flex justify-center transition-all duration-300 ease-in-out">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-48">
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                    >
                      Yes, delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
