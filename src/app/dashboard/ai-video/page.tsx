
import { AIVideoGenerator } from "@/components/ai/ai-video-generator";

export default function AiVideoPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">AI Video Generation</h1>
                <p className="text-muted-foreground">Generate a promotional video featuring our AI influencer, Nova.</p>
            </div>
            <AIVideoGenerator />
        </div>
    );
}
