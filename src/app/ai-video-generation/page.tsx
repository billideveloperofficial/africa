import { AIVideoGenerator } from "@/components/ai/ai-video-generator";

export default function AIVideoGenerationPage() {
  return (
    <div className="container py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          AI Video Generation with Nova
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Bring your product to life. Describe a scene and optionally upload a product image to generate a promotional video featuring our AI influencer, Nova.
        </p>
      </div>
      <AIVideoGenerator />
    </div>
  );
}
