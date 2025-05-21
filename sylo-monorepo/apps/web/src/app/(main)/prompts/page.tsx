import { Metadata } from "next";
import { PromptsList } from "@/components/prompts/prompts-list";

export const metadata: Metadata = {
  title: "Prompts - Sylo",
  description: "Manage your prompt repository",
};

export default function PromptsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prompts</h1>
          <p className="text-muted-foreground">
            Create, manage, and organize your prompt repository
          </p>
        </div>
      </div>
      <PromptsList />
    </div>
  );
}