"use client"

import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

// Mock data for prompts
const mockPrompts = [
  {
    id: "1",
    title: "Project Brief Template",
    description: "A template for creating comprehensive project briefs for design projects.",
    category: "Templates",
    createdAt: new Date("2025-05-01"),
  },
  {
    id: "2",
    title: "Client Questionnaire",
    description: "Questions to ask clients during the initial consultation to gather requirements.",
    category: "Client Communication",
    createdAt: new Date("2025-05-05"),
  },
  {
    id: "3",
    title: "Design Feedback Request",
    description: "Template for requesting specific feedback on design concepts.",
    category: "Client Communication",
    createdAt: new Date("2025-05-10"),
  },
  {
    id: "4",
    title: "Project Timeline Generator",
    description: "Generate a realistic project timeline based on scope and requirements.",
    category: "Project Management",
    createdAt: new Date("2025-05-15"),
  },
];

export function PromptsList() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [prompts, setPrompts] = useState(mockPrompts);

  const filteredPrompts = prompts.filter(
    (prompt) =>
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreatePrompt = () => {
    toast({
      title: "Create Prompt",
      description: "This would open a prompt creation form in a real implementation.",
    });
  };

  const handleEditPrompt = (id: string) => {
    toast({
      title: "Edit Prompt",
      description: `This would open the edit form for prompt ID: ${id} in a real implementation.`,
    });
  };

  const handleDeletePrompt = (id: string) => {
    toast({
      title: "Delete Prompt",
      description: `This would delete prompt ID: ${id} in a real implementation.`,
    });
  };

  const handleImprovePrompt = (id: string) => {
    toast({
      title: "Improve Prompt",
      description: `This would open the AI improvement interface for prompt ID: ${id} in a real implementation.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
        <Button onClick={handleCreatePrompt}>
          <Plus className="mr-2 h-4 w-4" /> New Prompt
        </Button>
      </div>

      {filteredPrompts.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-medium">No prompts found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? "Try adjusting your search query"
                : "Create your first prompt to get started"}
            </p>
            {!searchQuery && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleCreatePrompt}
              >
                <Plus className="mr-2 h-4 w-4" /> Create Prompt
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrompts.map((prompt) => (
            <Card key={prompt.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{prompt.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {prompt.category} • {formatDate(prompt.createdAt)}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="-mt-1 -mr-2">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEditPrompt(prompt.id)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleImprovePrompt(prompt.id)}>
                        Improve with AI
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeletePrompt(prompt.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{prompt.description}</p>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  Use Prompt
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}