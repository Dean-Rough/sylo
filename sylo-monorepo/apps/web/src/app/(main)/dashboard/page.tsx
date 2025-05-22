"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  FileText,
  Settings,
  Activity,
  Calendar,
  CheckSquare,
  Clock,
  Mic,
  PenTool,
  Users,
  ChevronRight,
  Plus
} from "lucide-react";
import Link from "next/link";

type RecentProject = {
  id: string;
  name: string;
  progress: number;
  tasks: {
    total: number;
    completed: number;
  };
  dueDate?: string;
};

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  type: "meeting" | "task" | "reminder";
};

type Note = {
  id: string;
  title: string;
  updatedAt: string;
  preview: string;
};

export default function DashboardPage() {
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([
    {
      id: "1",
      name: "Website Redesign",
      progress: 65,
      tasks: { total: 12, completed: 8 },
      dueDate: "2025-06-15"
    },
    {
      id: "2",
      name: "Client Proposal",
      progress: 30,
      tasks: { total: 8, completed: 2 },
      dueDate: "2025-05-30"
    }
  ]);
  
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Team Standup",
      start: "2025-05-21T10:00:00",
      end: "2025-05-21T10:30:00",
      type: "meeting"
    },
    {
      id: "2",
      title: "Client Presentation",
      start: "2025-05-22T14:00:00",
      end: "2025-05-22T15:30:00",
      type: "meeting"
    },
    {
      id: "3",
      title: "Submit Design Draft",
      start: "2025-05-23T17:00:00",
      end: "2025-05-23T17:00:00",
      type: "task"
    }
  ]);
  
  const [recentNotes, setRecentNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Project Ideas",
      updatedAt: "2025-05-20T15:30:00",
      preview: "List of potential design concepts for the new client project..."
    },
    {
      id: "2",
      title: "Meeting Notes",
      updatedAt: "2025-05-19T11:45:00",
      preview: "Key points from the client meeting: 1. Timeline adjustments..."
    }
  ]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome to Sylo, your AI-powered design studio productivity suite.
      </p>
      
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Projects
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              {recentProjects.length > 0 ? `${Math.round(recentProjects.reduce((acc, project) => acc + project.progress, 0) / recentProjects.length)}% avg. completion` : "No active projects"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              Next: {upcomingEvents.length > 0 ? upcomingEvents[0].title : "No upcoming events"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Notes
            </CardTitle>
            <PenTool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentNotes.length}</div>
            <p className="text-xs text-muted-foreground">
              Last updated: {recentNotes.length > 0 ? formatDate(recentNotes[0].updatedAt) : "No notes yet"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Team Settings
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 Teams</div>
            <p className="text-xs text-muted-foreground">
              Configure team AI preferences
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Link href="/chat" className="flex items-center gap-3 rounded-md border p-3 hover:bg-accent transition-colors">
              <MessageSquare className="h-5 w-5 text-primary" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Start AI Chat
                </p>
                <p className="text-xs text-muted-foreground">
                  Get assistance with your tasks
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link href="/whiteboard" className="flex items-center gap-3 rounded-md border p-3 hover:bg-accent transition-colors">
              <PenTool className="h-5 w-5 text-primary" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Create Note
                </p>
                <p className="text-xs text-muted-foreground">
                  Capture ideas and thoughts
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link href="/projects" className="flex items-center gap-3 rounded-md border p-3 hover:bg-accent transition-colors">
              <Plus className="h-5 w-5 text-primary" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  New Project
                </p>
                <p className="text-xs text-muted-foreground">
                  Start tracking a new project
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link href="/workspace" className="flex items-center gap-3 rounded-md border p-3 hover:bg-accent transition-colors">
              <Calendar className="h-5 w-5 text-primary" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Schedule Meeting
                </p>
                <p className="text-xs text-muted-foreground">
                  Create a new calendar event
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link href="/settings" className="flex items-center gap-3 rounded-md border p-3 hover:bg-accent transition-colors">
              <Mic className="h-5 w-5 text-primary" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Voice Mode
                </p>
                <p className="text-xs text-muted-foreground">
                  Interact with AI using voice
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
        
        {/* Projects & Tasks */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Your active projects and tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {recentProjects.length > 0 ? (
              recentProjects.map(project => (
                <div key={project.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{project.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      Due: {project.dueDate ? formatDate(project.dueDate) : "No date"}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{project.progress}% complete</span>
                    <span>{project.tasks.completed}/{project.tasks.total} tasks</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No active projects
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/projects">
              <Button variant="outline" size="sm">View All Projects</Button>
            </Link>
          </CardFooter>
        </Card>
        
        {/* Calendar & Notes Tabs */}
        <Card className="col-span-1">
          <Tabs defaultValue="calendar">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle>Upcoming</CardTitle>
                <TabsList>
                  <TabsTrigger value="calendar" className="text-xs">Calendar</TabsTrigger>
                  <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
                </TabsList>
              </div>
              <CardDescription>
                Events and recent notes
              </CardDescription>
            </CardHeader>
            
            <TabsContent value="calendar">
              <CardContent className="pt-4 pb-2">
                {upcomingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingEvents.map(event => (
                      <div key={event.id} className="flex gap-3 items-start">
                        <div className="bg-muted p-2 rounded-md">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <p className="text-sm font-medium">{event.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(event.start)} • {formatTime(event.start)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No upcoming events
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Link href="/workspace">
                  <Button variant="outline" size="sm">Open Calendar</Button>
                </Link>
              </CardFooter>
            </TabsContent>
            
            <TabsContent value="notes">
              <CardContent className="pt-4 pb-2">
                {recentNotes.length > 0 ? (
                  <div className="space-y-4">
                    {recentNotes.map(note => (
                      <div key={note.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm">{note.title}</h3>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(note.updatedAt)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {note.preview}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No notes yet
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Link href="/whiteboard">
                  <Button variant="outline" size="sm">Open Whiteboard</Button>
                </Link>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}