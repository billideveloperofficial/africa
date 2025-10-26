
import { ProductImageGenerator } from "@/components/ai/product-image-generator";

export default function AiProductImagePage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">AI Product Shot Generator</h1>
                <p className="text-muted-foreground">Create stunning, professional product photos in any setting.</p>
            </div>
            <ProductImageGenerator />
        </div>
    );
}
