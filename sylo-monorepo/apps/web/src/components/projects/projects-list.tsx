"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckSquare, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
  taskCount?: number;
}

interface ProjectsListProps {
  status: 'all' | 'active' | 'completed' | 'archived';
  onProjectSelect: (projectId: string) => void;
  selectedProjectId: string | null;
}

export function ProjectsList({ status, onProjectSelect, selectedProjectId }: ProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const data = await response.json();
        
        // Filter projects based on status if needed
        const filteredProjects = status === 'all' 
          ? data 
          : data.filter((project: Project) => project.status === status);
        
        setProjects(filteredProjects);
        setError(null);
      } catch (err) {
        setError('Error loading projects. Please try again.');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [status]);

  // Function to get task counts for each project
  useEffect(() => {
    const fetchTaskCounts = async () => {
      if (projects.length === 0) return;
      
      try {
        const projectsWithCounts = await Promise.all(
          projects.map(async (project) => {
            const response = await fetch(`/api/projects/${project.id}/tasks`);
            if (!response.ok) {
              throw new Error(`Failed to fetch tasks for project ${project.id}`);
            }
            const tasks = await response.json();
            return {
              ...project,
              taskCount: tasks.length
            };
          })
        );
        
        setProjects(projectsWithCounts);
      } catch (err) {
        console.error('Error fetching task counts:', err);
      }
    };

    fetchTaskCounts();
  }, [projects.length]);

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
    return <div className="flex justify-center p-6">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-6">{error}</div>;
  }

  if (projects.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground">No projects found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <Card 
          key={project.id} 
          className={`cursor-pointer hover:shadow-md transition-shadow ${
            selectedProjectId === project.id ? 'border-primary ring-2 ring-primary' : ''
          }`}
          onClick={() => onProjectSelect(project.id)}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{project.title}</CardTitle>
              <Badge className={getStatusBadgeColor(project.status)}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </Badge>
            </div>
            <CardDescription className="line-clamp-2">
              {project.description || 'No description provided'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              <span>Updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}</span>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <div className="flex items-center text-sm">
              <CheckSquare className="mr-1 h-4 w-4" />
              <span>{project.taskCount || 0} tasks</span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}