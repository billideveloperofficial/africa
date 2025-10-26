
import { BrandDealPitchGenerator } from "@/components/ai/brand-deal-pitch-generator";

export default function DashboardPage() {
  return (
    <div>
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">AI Brand Pitch Generator</h1>
            <p className="text-muted-foreground">Craft the perfect pitch to land your next brand deal.</p>
        </div>
        <BrandDealPitchGenerator />
    </div>
  );
}
