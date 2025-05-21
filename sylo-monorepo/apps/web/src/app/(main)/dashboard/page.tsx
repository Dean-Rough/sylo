import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, FileText, Settings, Activity } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard - Sylo",
  description: "Dashboard for Sylo Design Studio Productivity App",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome to Sylo, your AI-powered design studio productivity suite.
      </p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Chats
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Start a new chat to get AI assistance
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Saved Prompts
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Create and manage your prompt library
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              AI Settings
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Default</div>
            <p className="text-xs text-muted-foreground">
              Customize your AI assistant preferences
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Activity
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Recent</div>
            <p className="text-xs text-muted-foreground">
              View your recent activity and history
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>
              Get started with Sylo's powerful features
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-4 rounded-md border p-4">
              <MessageSquare className="h-5 w-5" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Start a new chat
                </p>
                <p className="text-sm text-muted-foreground">
                  Chat with your AI assistant to get help with tasks
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-md border p-4">
              <FileText className="h-5 w-5" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Create a prompt
                </p>
                <p className="text-sm text-muted-foreground">
                  Save and organize your prompts for future use
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-md border p-4">
              <Settings className="h-5 w-5" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Configure settings
                </p>
                <p className="text-sm text-muted-foreground">
                  Customize your AI assistant to match your preferences
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              Exciting features in development
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-4 rounded-md border p-4">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  AI Project Manager
                </p>
                <p className="text-sm text-muted-foreground">
                  Automate project progression and predict delays
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-md border p-4">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  AI Calendar
                </p>
                <p className="text-sm text-muted-foreground">
                  Intelligent scheduling for tasks and meetings
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-md border p-4">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  AI Meeting Notetaker
                </p>
                <p className="text-sm text-muted-foreground">
                  Automatic recording, transcription, and summarization
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}