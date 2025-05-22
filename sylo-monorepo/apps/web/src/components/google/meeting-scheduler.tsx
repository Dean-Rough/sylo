"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, setHours, setMinutes, isBefore } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock, Users, Video, Check, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface MeetingSchedulerProps {
  projectId?: string;
  taskId?: string;
}

export function MeetingScheduler({ projectId, taskId }: MeetingSchedulerProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [attendees, setAttendees] = useState("");
  const [isAddingConference, setIsAddingConference] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [meetingCreated, setMeetingCreated] = useState(false);
  const [createdMeeting, setCreatedMeeting] = useState<any>(null);
  const [availableUsers, setAvailableUsers] = useState<{ id: string; name: string; email: string }[]>([]);
  const { toast } = useToast();

  // Fetch available users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        setAvailableUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !date) {
      toast({
        title: "Error",
        description: "Title and date are required",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Parse start and end times
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);
      
      const startDateTime = new Date(date);
      startDateTime.setHours(startHour, startMinute, 0);
      
      const endDateTime = new Date(date);
      endDateTime.setHours(endHour, endMinute, 0);
      
      // Validate times
      if (endDateTime <= startDateTime) {
        toast({
          title: "Error",
          description: "End time must be after start time",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Parse attendees
      const attendeesList = attendees
        .split(",")
        .map(email => email.trim())
        .filter(email => email)
        .map(email => ({ email }));
      
      const meetingData = {
        summary: title,
        description,
        location,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        attendees: attendeesList,
        conferenceData: isAddingConference,
      };
      
      // If project and task IDs are provided, add them to the description
      if (projectId || taskId) {
        meetingData.description += `\n\n${projectId ? `Project ID: ${projectId}` : ''}${projectId && taskId ? '\n' : ''}${taskId ? `Task ID: ${taskId}` : ''}`;
      }
      
      const response = await fetch("/api/google/calendar/meetings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(meetingData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to schedule meeting");
      }
      
      const data = await response.json();
      
      toast({
        title: "Success",
        description: "Meeting scheduled successfully",
      });
      
      setMeetingCreated(true);
      setCreatedMeeting(data);
    } catch (err) {
      console.error("Error scheduling meeting:", err);
      toast({
        title: "Error",
        description: "Failed to schedule meeting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setDate(new Date());
    setStartTime("09:00");
    setEndTime("10:00");
    setAttendees("");
    setIsAddingConference(true);
    setMeetingCreated(false);
    setCreatedMeeting(null);
  };

  const copyMeetingLink = () => {
    if (createdMeeting?.conferenceData?.entryPoints) {
      const videoEntry = createdMeeting.conferenceData.entryPoints.find(
        (entry: any) => entry.entryPointType === "video"
      );
      
      if (videoEntry?.uri) {
        navigator.clipboard.writeText(videoEntry.uri);
        toast({
          title: "Copied",
          description: "Meeting link copied to clipboard",
        });
      }
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const handleAddAttendee = (email: string) => {
    const currentAttendees = attendees.split(",").map(e => e.trim()).filter(e => e);
    if (!currentAttendees.includes(email)) {
      const newAttendees = [...currentAttendees, email];
      setAttendees(newAttendees.join(", "));
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Schedule a Meeting</CardTitle>
          <CardDescription>
            Create a new meeting and automatically add it to your Google Calendar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {meetingCreated ? (
            <div className="space-y-4">
              <Alert className="bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-600" />
                <AlertTitle>Meeting Scheduled</AlertTitle>
                <AlertDescription>
                  Your meeting has been scheduled successfully.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">{createdMeeting.summary}</h3>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>
                    {format(new Date(createdMeeting.start.dateTime), "EEEE, MMMM d, yyyy")}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>
                    {format(new Date(createdMeeting.start.dateTime), "h:mm a")} - {format(new Date(createdMeeting.end.dateTime), "h:mm a")}
                  </span>
                </div>
                
                {createdMeeting.attendees && createdMeeting.attendees.length > 0 && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{createdMeeting.attendees.length} attendees</span>
                  </div>
                )}
                
                {createdMeeting.conferenceData && (
                  <div className="mt-4">
                    <div className="flex items-center text-sm">
                      <Video className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="font-medium">Google Meet</span>
                    </div>
                    
                    {createdMeeting.conferenceData.entryPoints && (
                      <div className="mt-2 flex items-center">
                        <Input 
                          readOnly 
                          value={createdMeeting.conferenceData.entryPoints.find(
                            (entry: any) => entry.entryPointType === "video"
                          )?.uri || ""}
                          className="mr-2"
                        />
                        <Button size="sm" variant="outline" onClick={copyMeetingLink}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button onClick={resetForm}>Schedule Another Meeting</Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Meeting Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Weekly Team Sync"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Meeting agenda and notes"
                    rows={3}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Conference Room A or Virtual"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => isBefore(date, new Date())}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="start-time">Start Time</Label>
                    <Select value={startTime} onValueChange={setStartTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select start time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={`start-${time}`} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="end-time">End Time</Label>
                    <Select value={endTime} onValueChange={setEndTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select end time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={`end-${time}`} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="attendees">Attendees (comma separated)</Label>
                  <Input
                    id="attendees"
                    value={attendees}
                    onChange={(e) => setAttendees(e.target.value)}
                    placeholder="email1@example.com, email2@example.com"
                  />
                  
                  {availableUsers.length > 0 && (
                    <div className="mt-2">
                      <Label className="text-sm text-muted-foreground">Add team members:</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {availableUsers.map((user) => (
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
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="add-conference"
                    checked={isAddingConference}
                    onCheckedChange={(checked) => setIsAddingConference(!!checked)}
                  />
                  <Label htmlFor="add-conference">Add Google Meet video conferencing</Label>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Scheduling..." : "Schedule Meeting"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}