"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Trash2, Edit, Calendar, CheckSquare } from "lucide-react";
import { ProjectsList } from "@/components/projects/projects-list";
import { ProjectDetails } from "@/components/projects/project-details";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";

export default function ProjectsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const handleCreateProject = () => {
    setIsCreateDialogOpen(true);
  };

  const handleProjectCreated = () => {
    setIsCreateDialogOpen(false);
    // Refresh the projects list
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your projects and tasks in one place.
          </p>
        </div>
        <Button onClick={handleCreateProject}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <ProjectsList 
            status="all" 
            onProjectSelect={handleProjectSelect} 
            selectedProjectId={selectedProjectId} 
          />
        </TabsContent>
        <TabsContent value="active" className="space-y-4">
          <ProjectsList 
            status="active" 
            onProjectSelect={handleProjectSelect} 
            selectedProjectId={selectedProjectId} 
          />
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <ProjectsList 
            status="completed" 
            onProjectSelect={handleProjectSelect} 
            selectedProjectId={selectedProjectId} 
          />
        </TabsContent>
        <TabsContent value="archived" className="space-y-4">
          <ProjectsList 
            status="archived" 
            onProjectSelect={handleProjectSelect} 
            selectedProjectId={selectedProjectId} 
          />
        </TabsContent>
      </Tabs>

      {selectedProjectId && (
        <ProjectDetails 
          projectId={selectedProjectId} 
          onClose={() => setSelectedProjectId(null)} 
        />
      )}

      <CreateProjectDialog 
        isOpen={isCreateDialogOpen} 
        onClose={() => setIsCreateDialogOpen(false)} 
        onProjectCreated={handleProjectCreated} 
      />
    </div>
  );
}