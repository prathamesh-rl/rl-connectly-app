"use client"

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RocketIcon } from 'lucide-react';
import { GoogleIcon } from '@/components/icons';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user.email && user.email.endsWith('@rocketlearning.org')) {
        router.push('/dashboard');
      } else {
        await signOut(auth);
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Only users with a @rocketlearning.org email can sign in.",
        });
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        variant: "destructive",
        title: "Sign-in Failed",
        description: "An error occurred during the sign-in process. Please try again.",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="bg-primary text-primary-foreground rounded-full p-3">
                <RocketIcon className="h-8 w-8" />
              </div>
            </div>
            <CardTitle className="text-2xl font-headline">RL Connectly Dashboard</CardTitle>
            <CardDescription>
              Sign in to access your metrics dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
                <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleSignIn}>
                    <GoogleIcon className="mr-2 h-5 w-5" />
                    Sign in with Google
                </Button>
               <p className="text-center text-xs text-muted-foreground">
                 Only users with @rocketlearning.org can sign in.
               </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
