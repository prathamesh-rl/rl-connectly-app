import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RocketIcon } from 'lucide-react';
import { GoogleIcon } from '@/components/icons';

export default function LoginPage() {
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
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link href="/dashboard">
                    <GoogleIcon className="mr-2 h-5 w-5" />
                    Sign in with Google
                  </Link>
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
