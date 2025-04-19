'use client';
import React from 'react';
import EventEditor from './event-editor';
import { useEventContext } from '@/context/EventContext';
import { useToast } from "@/components/ui/use-toast";
import { endOfDay, isWithinInterval, startOfDay } from 'date-fns';

const AdminPanel = () => {
  const { toast } = useToast();
  const { dateClicked, events, setOpenEditor, setEvents } = useEventContext();

  // Filter events for the clicked date
  const clickedDateEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === (dateClicked ? dateClicked.toDateString() : new Date().toDateString());
  });

  const handleAddEvent = async (data: { userId: string, title: string, date: Date, description: string }, formattedDate: string, action: 'created' | 'updated' | 'deleted') => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setOpenEditor(false);
        toast({
          title: `Action failed`,
          description: `Failed to create/update event taking place on ${formattedDate}`
        })
        throw new Error('Failed to add event');
      }

      const result = await response.json();
      if (result.message === 'success'){
        setOpenEditor(false);
        toast({
          title: `Event ${action} successfully`,
          description: `${action[0].toLocaleUpperCase() + action.slice(1)} event taking place on ${formattedDate}`
        })
      }
      // Update events state
      setEvents((prevEvents) => {
        const startOfDayDate = startOfDay(new Date(data.date));
        const endOfDayDate = endOfDay(new Date(data.date));

        const existingEventIndex = prevEvents.findIndex(
          (event) =>
            isWithinInterval(new Date(event.date), { start: startOfDayDate, end: endOfDayDate }) &&
            event.userId === data.userId
        );

        if (existingEventIndex !== -1) {
          // Update existing event
          const updatedEvents = [...prevEvents];
          updatedEvents[existingEventIndex] = { ...updatedEvents[existingEventIndex], ...result.event };
          return updatedEvents;
        } else {
          // Create new event
          return [...prevEvents, result.event];
        }
      });
    } catch (error) {
      setOpenEditor(false);
        toast({
          title: `Action failed`,
          description: `Failed to create/update event taking place on ${formattedDate}`
        })
      console.error('Error adding event:', error);
    }
  };

  const handleDeleteEvent = async (data: { userId: string, date: Date }, formattedDate: string) => {
    try {
      const response = await fetch('/api/events', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setOpenEditor(false);
        toast({
          title: `Failed to Delete Event`,
          description: `Fail to delete event taking place on ${formattedDate}`
        })
        throw new Error('Failed to add event');
      }

      const result = await response.json();
      if (result.message === 'success'){
        setOpenEditor(false);
        toast({
          title: `Event deleted successfully`,
          description: `Deleted event taking place on ${formattedDate}`
        })
      }

      // Update events state
      setEvents((prevEvents) => {
        const startOfDayDate = startOfDay(new Date(data.date));
        const endOfDayDate = endOfDay(new Date(data.date));
        return prevEvents.filter(
          (event) =>
            !(isWithinInterval(new Date(event.date), { start: startOfDayDate, end: endOfDayDate }) &&
            event.userId === data.userId)
        );
      });
    } catch (error) {
      setOpenEditor(false);
      toast({
        title: `Failed to Delete Event`,
        description: `Fail to delete event taking place on ${formattedDate}`
      })
      console.error('Error adding event:', error);
    }
  }

  return (
    <div>
      <EventEditor event={clickedDateEvents[0]} date={dateClicked ? dateClicked : new Date()} onSubmit={handleAddEvent} handleDeleteEvent={handleDeleteEvent} />
    </div>
  );
};

export default AdminPanel;