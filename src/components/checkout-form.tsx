"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreditCard, DollarSign } from "lucide-react";

export function CheckoutForm() {
  const router = useRouter();

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would handle payment processing here.
    // For this demo, we'll just redirect to the video generation page.
    router.push("/ai-video-generation");
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Purchase</CardTitle>
          <CardDescription>
            Enter your payment details to generate your AI video.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePayment}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card">Card Details</Label>
              <div className="relative">
                <Input id="card" type="text" placeholder="Card number" required />
                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="MM / YY" required />
                <Input placeholder="CVC" required />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 font-bold text-lg border-t mt-4">
                <span>Total</span>
                <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    <span>1200</span>
                </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Pay $1200 and Generate Video
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
