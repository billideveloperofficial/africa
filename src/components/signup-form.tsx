
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormValues, SignUpFormSchema } from "@/lib/validators";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signUp } from "@/services/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";


function GoogleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10c2.25 0 4.33-.74 6-2h-3.25v-3H15v-2h-3v-2.5h5.25c.48 1.48.75 3.09.75 4.75z"/>
            <path d="M12 22s-4-2-4-6v-4h8v4c0 4-4 6-4 6z"/>
        </svg>
    )
}

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
        username: "",
        email: "",
        password: "",
    }
  });

  useEffect(() => {
    // Automatically create the test user on component mount
    // if they don't exist. This is for demo purposes.
    startTransition(async () => {
        await signUp({
            username: "Test User",
            email: "test@example.com",
            password: "password"
        });
    });
  }, []);

  const onSubmit = (values: SignUpFormValues) => {
    startTransition(async () => {
        const { error } = await signUp(values);
        if(error) {
            toast({
                title: "Sign up failed",
                description: error,
                variant: "destructive"
            });
            return;
        }
        toast({
            title: "Success!",
            description: "Your account has been created.",
        });
        router.push('/dashboard');
    });
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-center">
         <Logo />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold">Let's Get You Started</h1>
        <p className="text-muted-foreground">Create your account to get started</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
         
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                    <div className="relative">
                        <Input type={showPassword ? "text" : "password"} {...field} />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </Button>
                    </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending} className="w-full bg-indigo-500 hover:bg-indigo-600">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">OR</span>
        </div>
      </div>
      <Button variant="outline" className="w-full">
        <GoogleIcon />
        Log in with Google
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
