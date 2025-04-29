'use client';
import React from 'react';
import EventEditor from './event-editor';
import { useEventContext } from '@/context/EventContext';
import { useToast } from "@/components/ui/use-toast";
import { endOfDay, isWithinInterval, startOfDay } from 'date-fns';

const AdminPanel = () => {
  const { toast } = useToast();
  const { dateClicked, events, setOpenEditor, setEvents, addEvent} = useEventContext();

  // Filter events for the clicked date
  const clickedDateEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === (dateClicked ? dateClicked.toDateString() : new Date().toDateString());
  });

  const handleDeleteEvent = async (data: { user_id: string, date: Date }, formattedDate: string) => {
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
            event.user_id === data.user_id)
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
      <EventEditor event={clickedDateEvents[0]} date={dateClicked ? dateClicked : new Date()} onSubmit={addEvent} handleDeleteEvent={handleDeleteEvent} />
    </div>
  );
};

export default AdminPanel;