"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarView } from "@/components/google/calendar-view";
import { DriveBrowser } from "@/components/google/drive-browser";
import { MeetingScheduler } from "@/components/google/meeting-scheduler";
import { Calendar, FolderOpen, CalendarPlus } from "lucide-react";

export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState<"calendar" | "drive" | "meetings">("calendar");

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Google Workspace</h1>
        <p className="text-muted-foreground">
          Manage your calendar, files, and meetings in one place.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "calendar" | "drive" | "meetings")}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="drive" className="flex items-center">
            <FolderOpen className="mr-2 h-4 w-4" />
            Drive
          </TabsTrigger>
          <TabsTrigger value="meetings" className="flex items-center">
            <CalendarPlus className="mr-2 h-4 w-4" />
            Schedule Meeting
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="mt-6">
          <CalendarView />
        </TabsContent>
        
        <TabsContent value="drive" className="mt-6">
          <DriveBrowser />
        </TabsContent>
        
        <TabsContent value="meetings" className="mt-6">
          <MeetingScheduler />
        </TabsContent>
      </Tabs>
    </div>
  );
}