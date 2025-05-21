"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { CalendarPlus, Clock, Users, Video, MapPin, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, parseISO, isToday, isSameDay } from "date-fns";
import { CreateEventDialog } from "@/components/google/create-event-dialog";
import { EventDetailsDialog } from "@/components/google/event-details-dialog";
import { useToast } from "@/components/ui/use-toast";

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
  colorId?: string;
}

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [view, setView] = useState<"month" | "agenda">("month");
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const startDate = format(startOfMonth(currentDate), "yyyy-MM-dd'T'00:00:00'Z'");
      const endDate = format(endOfMonth(currentDate), "yyyy-MM-dd'T'23:59:59'Z'");
      
      const response = await fetch(`/api/google/calendar/events?timeMin=${startDate}&timeMax=${endDate}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch calendar events');
      }
      
      const data = await response.json();
      setEvents(data.items || []);
      setError(null);
    } catch (err) {
      setError('Error loading calendar events. Please try again.');
      console.error('Error fetching calendar events:', err);
      toast({
        title: "Error",
        description: "Failed to load calendar events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const handlePreviousMonth = () => {
    setCurrentDate(prevDate => subMonths(prevDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => addMonths(prevDate, 1));
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };

  const handleCreateEvent = () => {
    setIsCreateEventOpen(true);
  };

  const handleEventCreated = () => {
    setIsCreateEventOpen(false);
    fetchEvents();
    toast({
      title: "Success",
      description: "Event created successfully",
    });
  };

  const handleEventUpdated = () => {
    setIsEventDetailsOpen(false);
    fetchEvents();
    toast({
      title: "Success",
      description: "Event updated successfully",
    });
  };

  const handleEventDeleted = () => {
    setIsEventDetailsOpen(false);
    fetchEvents();
    toast({
      title: "Success",
      description: "Event deleted successfully",
    });
  };

  const renderEventsByDate = () => {
    const eventsByDate: Record<string, CalendarEvent[]> = {};
    
    events.forEach(event => {
      const date = format(parseISO(event.start.dateTime), 'yyyy-MM-dd');
      if (!eventsByDate[date]) {
        eventsByDate[date] = [];
      }
      eventsByDate[date].push(event);
    });
    
    return Object.entries(eventsByDate)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, dateEvents]) => (
        <div key={date} className="mb-6">
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5" />
            <span>{format(parseISO(date), 'EEEE, MMMM d, yyyy')}</span>
            {isToday(parseISO(date)) && (
              <Badge className="ml-2 bg-blue-100 text-blue-800">Today</Badge>
            )}
          </h3>
          <div className="space-y-2">
            {dateEvents.map(event => (
              <Card 
                key={event.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleEventClick(event)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{event.summary}</h4>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          {format(parseISO(event.start.dateTime), 'h:mm a')} - {format(parseISO(event.end.dateTime), 'h:mm a')}
                        </span>
                      </div>
                      
                      {event.attendees && event.attendees.length > 0 && (
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{event.attendees.length} attendees</span>
                        </div>
                      )}
                      
                      {event.conferenceData && (
                        <div className="flex items-center text-sm text-blue-600 mt-1">
                          <Video className="h-3 w-3 mr-1" />
                          <span>Video conference available</span>
                        </div>
                      )}
                      
                      {event.location && (
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="truncate max-w-[200px]">{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Calendar</h2>
        <div className="flex items-center space-x-2">
          <Tabs value={view} onValueChange={(v) => setView(v as "month" | "agenda")}>
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="agenda">Agenda</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={handleCreateEvent}>
            <CalendarPlus className="mr-2 h-4 w-4" />
            New Event
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>{format(currentDate, 'MMMM yyyy')}</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : error ? (
            <div className="text-red-500 py-4">{error}</div>
          ) : (
            <TabsContent value="month" className="mt-0">
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={(date) => date && setCurrentDate(date)}
                className="rounded-md border"
                components={{
                  DayContent: (props) => {
                    const date = props.date;
                    const formattedDate = format(date, 'yyyy-MM-dd');
                    const hasEvents = events.some(event => {
                      const eventDate = format(parseISO(event.start.dateTime), 'yyyy-MM-dd');
                      return eventDate === formattedDate;
                    });
                    
                    return (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div>{props.day}</div>
                        {hasEvents && (
                          <div className="absolute bottom-1 w-1 h-1 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    );
                  }
                }}
              />
            </TabsContent>
          )}
          
          <TabsContent value="agenda" className="mt-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : error ? (
              <div className="text-red-500 py-4">{error}</div>
            ) : events.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No events found for this month.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {renderEventsByDate()}
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Card>

      {selectedEvent && (
        <EventDetailsDialog
          isOpen={isEventDetailsOpen}
          onClose={() => setIsEventDetailsOpen(false)}
          event={selectedEvent}
          onEventUpdated={handleEventUpdated}
          onEventDeleted={handleEventDeleted}
        />
      )}

      <CreateEventDialog
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onEventCreated={handleEventCreated}
        initialDate={currentDate}
      />
    </div>
  );
}