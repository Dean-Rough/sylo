"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X, Edit, Trash2, PlusCircle } from "lucide-react";
import { TaskList } from "@/components/projects/task-list";
import { CreateTaskDialog } from "@/components/projects/create-task-dialog";
import { EditProjectDialog } from "@/components/projects/edit-project-dialog";

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
}

interface ProjectDetailsProps {
  projectId: string;
  onClose: () => void;
}

export function ProjectDetails({ projectId, onClose }: ProjectDetailsProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false);
  const [isEditProjectDialogOpen, setIsEditProjectDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("todo");
  const router = useRouter();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/projects/${projectId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch project details');
        }
        
        const data = await response.json();
        setProject(data);
        setError(null);
      } catch (err) {
        setError('Error loading project details. Please try again.');
        console.error('Error fetching project details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  const handleDeleteProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      
      setIsDeleteDialogOpen(false);
      onClose();
      router.refresh();
    } catch (err) {
      console.error('Error deleting project:', err);
      // Show error message to user
    }
  };

  const handleProjectUpdated = (updatedProject: Project) => {
    setProject(updatedProject);
    setIsEditProjectDialogOpen(false);
    router.refresh();
  };

  const handleTaskCreated = () => {
    setIsCreateTaskDialogOpen(false);
    router.refresh();
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex justify-center">Loading project details...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !project) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-red-500">{error || 'Project not found'}</div>
          <Button variant="outline" onClick={onClose} className="mt-4">
            Close
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl">{project.title}</CardTitle>
                <Badge className={getStatusBadgeColor(project.status)}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
              </div>
              <CardDescription className="mt-2">
                {project.description || 'No description provided'}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => setIsEditProjectDialogOpen(true)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setIsDeleteDialogOpen(true)}>
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Tasks</h3>
            <Button onClick={() => setIsCreateTaskDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>

          <Tabs defaultValue="todo" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="todo">To Do</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="todo">
              <TaskList projectId={projectId} status="todo" />
            </TabsContent>
            <TabsContent value="in_progress">
              <TaskList projectId={projectId} status="in_progress" />
            </TabsContent>
            <TabsContent value="review">
              <TaskList projectId={projectId} status="review" />
            </TabsContent>
            <TabsContent value="completed">
              <TaskList projectId={projectId} status="completed" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <CreateTaskDialog 
        isOpen={isCreateTaskDialogOpen} 
        onClose={() => setIsCreateTaskDialogOpen(false)} 
        onTaskCreated={handleTaskCreated}
        projectId={projectId}
      />

      <EditProjectDialog 
        isOpen={isEditProjectDialogOpen} 
        onClose={() => setIsEditProjectDialogOpen(false)} 
        onProjectUpdated={handleProjectUpdated}
        project={project}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
              All tasks associated with this project will also be deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProject}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
