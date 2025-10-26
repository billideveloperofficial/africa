import { Badge } from "@/components/ui/badge";

export default function CommunitiesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center px-4">
       <Badge
          variant="outline"
          className="mb-4 py-1 px-3 text-sm bg-yellow-400/10 border-yellow-400/30 text-yellow-300 rounded-full"
        >
          Coming Soon!
        </Badge>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
        Learning Communities
      </h1>
      <p className="mt-4 text-lg max-w-2xl text-muted-foreground">
        Creators can build learning community while learners can find a community to start learning with.
      </p>
    </div>
  );
}
