
import { PersonalAIAssistant } from "@/components/ai/personal-ai-assistant";

export default function AiAssistantPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Personal AI Assistant</h1>
                <p className="text-muted-foreground">Get AI-powered advice to grow your content and engagement.</p>
            </div>
            <PersonalAIAssistant />
        </div>
    );
}
