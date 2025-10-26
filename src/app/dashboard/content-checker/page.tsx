
import { ContentChecker } from "@/components/ai/content-checker";

export default function ContentCheckerPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Brand-Safe Content Checker</h1>
                <p className="text-muted-foreground">Analyze your content to ensure it's brand-safe before you post.</p>
            </div>
            <ContentChecker />
        </div>
    );
}
