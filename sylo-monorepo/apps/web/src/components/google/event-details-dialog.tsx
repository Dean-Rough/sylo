"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock, Users, Video, MapPin, Link, ExternalLink, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: string;
  }>;
  conferenceData?: {
    conferenceId: string;
    conferenceSolution: {
      name: string;
    };
    entryPoints: Array<{
      entryPointType: string;
      uri: string;
      label?: string;
    }>;
  };
  htmlLink?: string;
  colorId?: string;
}

interface EventDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent;
  onEventUpdated: () => void;
  onEventDeleted: () => void;
}

export function EventDetailsDialog({ isOpen, onClose, event, onEventUpdated, onEventDeleted }: EventDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState<"details" | "edit">("details");
  const [title, setTitle] = useState(event.summary);
  const [description, setDescription] = useState(event.description || "");
  const [location, setLocation] = useState(event.location || "");
  const [date, setDate] = useState<Date | undefined>(parseISO(event.start.dateTime));
  const [startTime, setStartTime] = useState(format(parseISO(event.start.dateTime), "HH:mm"));
  const [endTime, setEndTime] = useState(format(parseISO(event.end.dateTime), "HH:mm"));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

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
      
      const eventData = {
        summary: title,
        description,
        location,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };
      
      const response = await fetch(`/api/google/calendar/events/${event.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update event");
      }
      
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
      
      onEventUpdated();
    } catch (err) {
      console.error("Error updating event:", err);
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }
    
    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/google/calendar/events/${event.id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete event");
      }
      
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
      
      onEventDeleted();
    } catch (err) {
      console.error("Error deleting event:", err);
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
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

  const getVideoConferenceLink = () => {
    if (!event.conferenceData) return null;
    
    const videoEntry = event.conferenceData.entryPoints?.find(
      entry => entry.entryPointType === "video"
    );
    
    return videoEntry?.uri;
  };

  const videoLink = getVideoConferenceLink();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Event Details</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "details" | "edit")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 mt-4">
            <div>
              <h3 className="text-xl font-semibold">{event.summary}</h3>
              
              <div className="flex items-center mt-4 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>
                  {format(parseISO(event.start.dateTime), "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                <span>
                  {format(parseISO(event.start.dateTime), "h:mm a")} - {format(parseISO(event.end.dateTime), "h:mm a")}
                </span>
              </div>
              
              {event.location && (
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{event.location}</span>
                </div>
              )}
              
              {event.attendees && event.attendees.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Attendees ({event.attendees.length})
                  </h4>
                  <ul className="space-y-1 text-sm">
                    {event.attendees.map((attendee, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-muted-foreground">
                          {attendee.displayName || attendee.email}
                        </span>
                        {attendee.responseStatus && (
                          <span className={cn(
                            "ml-2 text-xs px-1.5 py-0.5 rounded-full",
                            attendee.responseStatus === "accepted" ? "bg-green-100 text-green-800" :
                            attendee.responseStatus === "declined" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                          )}>
                            {attendee.responseStatus === "accepted" ? "Accepted" :
                             attendee.responseStatus === "declined" ? "Declined" :
                             "Tentative"}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {videoLink && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Video className="h-4 w-4 mr-2" />
                    Video Conference
                  </h4>
                  <a 
                    href={videoLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center"
                  >
                    Join meeting
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              )}
              
              {event.description && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Description</h4>
                  <p className="text-sm whitespace-pre-wrap">{event.description}</p>
                </div>
              )}
              
              {event.htmlLink && (
                <div className="mt-4">
                  <a 
                    href={event.htmlLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center"
                  >
                    <Link className="h-4 w-4 mr-1" />
                    Open in Google Calendar
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="edit" className="space-y-4 mt-4">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Event title"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Event description (optional)"
                    rows={3}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Event location (optional)"
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
              </div>
              
              <div className="flex justify-between mt-6">
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={handleDelete} 
                  disabled={isSubmitting || isDeleting}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  {isDeleting ? "Deleting..." : "Delete Event"}
                </Button>
                
                <div className="space-x-2">
                  <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}