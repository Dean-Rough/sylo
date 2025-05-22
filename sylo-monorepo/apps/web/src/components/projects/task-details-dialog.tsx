"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  CalendarIcon, 
  Clock, 
  Calendar as CalendarPlus, 
  FileUp, 
  Video, 
  Users, 
  Trash,
  Link
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  createCalendarEventFromTask, 
  attachDriveFileToTask, 
  scheduleTaskMeeting,
  getTaskCalendarEvent,
  getTaskDriveFiles
} from "@/lib/google-workspace-utils";
import { DriveBrowser } from "@/components/google/drive-browser";

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
  metadata?: {
    calendar_event_id?: string;
    drive_file_ids?: string[];
  };
}

interface TaskDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  projectId: string;
  onTaskUpdated: (task: Task) => void;
}

export function TaskDetailsDialog({ isOpen, onClose, task, projectId, onTaskUpdated }: TaskDetailsDialogProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState<string>(task.status);
  const [priority, setPriority] = useState<string>(task.priority);
  const [deadline, setDeadline] = useState<Date | undefined>(
    task.deadline ? new Date(task.deadline) : undefined
  );
  const [assignedTo, setAssignedTo] = useState<string | undefined>(task.assigned_to || undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "workspace">("details");
  const [users, setUsers] = useState<{ id: string; name: string; email: string }[]>([]);
  const [linkedCalendarEvent, setLinkedCalendarEvent] = useState<any>(null);
  const [attachedFiles, setAttachedFiles] = useState<any[]>([]);
  const [isLoadingWorkspaceData, setIsLoadingWorkspaceData] = useState(false);
  const [isSchedulingMeeting, setIsSchedulingMeeting] = useState(false);
  const [meetingAttendees, setMeetingAttendees] = useState("");
  const { toast } = useToast();

  // Fetch users for assignment
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  // Fetch Google Workspace data when the workspace tab is opened
  useEffect(() => {
    const fetchWorkspaceData = async () => {
      if (activeTab === "workspace" && !isLoadingWorkspaceData) {
        setIsLoadingWorkspaceData(true);
        
        try {
          // Fetch linked calendar event
          const event = await getTaskCalendarEvent(task);
          setLinkedCalendarEvent(event);
          
          // Fetch attached Drive files
          const files = await getTaskDriveFiles(task);
          setAttachedFiles(files);
        } catch (error) {
          console.error("Error fetching workspace data:", error);
        } finally {
          setIsLoadingWorkspaceData(false);
        }
      }
    };
    
    fetchWorkspaceData();
  }, [activeTab, task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const taskData = {
        title,
        description,
        status,
        priority,
        deadline: deadline ? deadline.toISOString() : null,
        assigned_to: assignedTo || null,
      };
      
      const response = await fetch(`/api/projects/${projectId}/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      
      const updatedTask = await response.json();
      
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
      
      onTaskUpdated(updatedTask);
    } catch (err) {
      console.error('Error updating task:', err);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCalendarEvent = async () => {
    const event = await createCalendarEventFromTask(task);
    if (event) {
      setLinkedCalendarEvent(event);
    }
  };

  const handleScheduleMeeting = async () => {
    if (!meetingAttendees.trim()) {
      toast({
        title: "Error",
        description: "Please enter at least one attendee email",
        variant: "destructive",
      });
      return;
    }
    
    const attendeesList = meetingAttendees
      .split(",")
      .map(email => email.trim())
      .filter(email => email);
    
    const event = await scheduleTaskMeeting(task, attendeesList);
    if (event) {
      setLinkedCalendarEvent(event);
      setIsSchedulingMeeting(false);
      setMeetingAttendees("");
    }
  };

  const handleAddAttendee = (email: string) => {
    const currentAttendees = meetingAttendees.split(",").map(e => e.trim()).filter(e => e);
    if (!currentAttendees.includes(email)) {
      const newAttendees = [...currentAttendees, email];
      setMeetingAttendees(newAttendees.join(", "));
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'todo':
        return <Badge className="bg-gray-100 text-gray-800">To Do</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'review':
        return <Badge className="bg-purple-100 text-purple-800">Review</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "details" | "workspace")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="workspace">Google Workspace</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 mt-4">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task title"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Task description"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label>Deadline</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !deadline && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deadline ? format(deadline, "PPP") : "No deadline"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={deadline}
                        onSelect={setDeadline}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {users.length > 0 && (
                  <div className="grid gap-2">
                    <Label htmlFor="assigned-to">Assign To</Label>
                    <Select value={assignedTo} onValueChange={setAssignedTo}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Unassigned</SelectItem>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              <DialogFooter className="mt-6">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="workspace" className="space-y-6 mt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <CalendarPlus className="mr-2 h-5 w-5" />
                  Calendar Integration
                </h3>
                
                {isLoadingWorkspaceData ? (
                  <div className="text-sm text-muted-foreground">Loading calendar data...</div>
                ) : linkedCalendarEvent ? (
                  <div className="border rounded-md p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{linkedCalendarEvent.summary}</h4>
                      {linkedCalendarEvent.htmlLink && (
                        <a 
                          href={linkedCalendarEvent.htmlLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center"
                        >
                          <Link className="h-4 w-4 mr-1" />
                          Open
                        </a>
                      )}
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>
                        {format(new Date(linkedCalendarEvent.start.dateTime), "EEEE, MMMM d, yyyy")}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        {format(new Date(linkedCalendarEvent.start.dateTime), "h:mm a")} - 
                        {format(new Date(linkedCalendarEvent.end.dateTime), "h:mm a")}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Button onClick={handleCreateCalendarEvent} className="w-full">
                      <CalendarPlus className="mr-2 h-4 w-4" />
                      Create Calendar Event
                    </Button>
                    
                    <Button 
                      onClick={() => setIsSchedulingMeeting(true)} 
                      variant="outline" 
                      className="w-full"
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Schedule Meeting
                    </Button>
                  </div>
                )}
                
                {isSchedulingMeeting && (
                  <div className="mt-4 border rounded-md p-4 space-y-4">
                    <h4 className="font-medium">Schedule a Meeting</h4>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="attendees">Attendees (comma separated)</Label>
                      <Input
                        id="attendees"
                        value={meetingAttendees}
                        onChange={(e) => setMeetingAttendees(e.target.value)}
                        placeholder="email1@example.com, email2@example.com"
                      />
                      
                      {users.length > 0 && (
                        <div className="mt-2">
                          <Label className="text-sm text-muted-foreground">Add team members:</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {users.map((user) => (
                              <Button
                                key={user.id}
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddAttendee(user.email)}
                              >
                                {user.name}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsSchedulingMeeting(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleScheduleMeeting}>
                        Schedule Meeting
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <FileUp className="mr-2 h-5 w-5" />
                  Drive Files
                </h3>
                
                {isLoadingWorkspaceData ? (
                  <div className="text-sm text-muted-foreground">Loading file data...</div>
                ) : attachedFiles.length > 0 ? (
                  <div className="border rounded-md p-4">
                    <ul className="space-y-2">
                      {attachedFiles.map((file) => (
                        <li key={file.id} className="flex justify-between items-center">
                          <div className="flex items-center">
                            <FileUp className="h-4 w-4 mr-2" />
                            <span>{file.name}</span>
                          </div>
                          {file.webViewLink && (
                            <a 
                              href={file.webViewLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Open
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No files attached to this task yet.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}