"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, User, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { TaskDetailsDialog } from "@/components/projects/task-details-dialog";

interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to: string | null;
  deadline: string | null;
  created_at: string;
  updated_at: string;
}

interface TaskListProps {
  projectId: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
}

export function TaskList({ projectId, status }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/projects/${projectId}/tasks`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        
        const data = await response.json();
        
        // Filter tasks by status
        const filteredTasks = data.filter((task: Task) => task.status === status);
        
        setTasks(filteredTasks);
        setError(null);
      } catch (err) {
        setError('Error loading tasks. Please try again.');
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchTasks();
    }
  }, [projectId, status]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailsOpen(true);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setIsTaskDetailsOpen(false);
  };

  const handleStatusChange = async (taskId: string, completed: boolean) => {
    try {
      const newStatus = completed ? 'completed' : 'todo';
      
      const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task status');
      }
      
      const updatedTask = await response.json();
      
      // Update local state
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Error updating task status:', err);
      // Show error message to user
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge className="bg-red-100 text-red-800">Urgent</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-blue-100 text-blue-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="py-4">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed rounded-md">
        <p className="text-muted-foreground">No {status.replace('_', ' ')} tasks found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <Card 
          key={task.id} 
          className="cursor-pointer hover:shadow-sm transition-shadow"
          onClick={() => handleTaskClick(task)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {status === 'completed' ? (
                <Checkbox checked={true} onCheckedChange={(checked) => {
                  // Prevent event propagation to avoid opening task details
                  event?.stopPropagation();
                  if (checked === false) {
                    handleStatusChange(task.id, false);
                  }
                }} />
              ) : (
                <Checkbox checked={false} onCheckedChange={(checked) => {
                  // Prevent event propagation to avoid opening task details
                  event?.stopPropagation();
                  if (checked === true) {
                    handleStatusChange(task.id, true);
                  }
                }} />
              )}
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{task.title}</h4>
                  {getPriorityBadge(task.priority)}
                </div>
                
                {task.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {task.description}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                  {task.deadline && (
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Due {format(new Date(task.deadline), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                  
                  {task.assigned_to && (
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      <span>Assigned</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {selectedTask && (
        <TaskDetailsDialog
          isOpen={isTaskDetailsOpen}
          onClose={() => setIsTaskDetailsOpen(false)}
          task={selectedTask}
          projectId={projectId}
          onTaskUpdated={handleTaskUpdated}
        />
      )}
    </div>
  );
}