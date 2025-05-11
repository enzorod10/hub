'use client';
import React from 'react';
import EventEditor from './event-editor';
import { useEventContext } from '@/context/EventContext';
import { useToast } from "@/components/ui/use-toast";
import {format } from 'date-fns';

const AdminPanel = () => {
  const { toast } = useToast();
  const { dateClicked, events, setOpenEditor, setEvents, addEvent} = useEventContext();

  // Filter events for the clicked date
  const clickedDateEvents = events.filter(event => {
    return format(dateClicked, 'yyyy-MM-dd') === event.date
  });

  const handleDeleteEvent = async (date: Date, formattedDate: string) => {
    const isoLocalDate = format(date, 'yyyy-MM-dd');
    
    try {
      const response = await fetch('/api/events', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: isoLocalDate }),
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
      return prevEvents.filter(
        (event) =>
          !(event.date === isoLocalDate)
    )});
    
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