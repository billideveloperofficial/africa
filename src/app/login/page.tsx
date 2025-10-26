"use client";

import { LoginForm } from "@/components/login-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (status === 'loading') return;

    if (session) {
      toast({
        title: "Already logged in",
        description: "You are already logged in. Redirecting to dashboard...",
      });

      // Redirect based on role
      if (session.user?.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [session, status, router, toast]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (session) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8">
        <LoginForm />
      </div>
    </div>
  );
}
