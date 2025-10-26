import { CheckoutForm } from "@/components/checkout-form";

export default function CheckoutPage() {
  return (
    <div className="container py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Checkout
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          You are one step away from creating a stunning video with our AI Influencer, Nova.
        </p>
      </div>
      <CheckoutForm />
    </div>
  );
}
