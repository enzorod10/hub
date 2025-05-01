'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event } from '@/app/types';
import { useToast } from '@/hooks/use-toast';
import { endOfDay, isWithinInterval, startOfDay } from 'date-fns';
import { useSessionContext } from './SessionContext';

interface EventContextState {
  dateClicked: Date;
  setDateClicked: (date: Date) => void;
  openEditor: boolean;
  setOpenEditor: (open: boolean) => void;
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  fetchEventsForMonth: (year: number, month: number) => void;
  addEvent: (data: { user_id: string, title: string, date: Date, description: string }, formattedDate: string, action: 'created' | 'updated' | 'deleted') => Promise<Event | null>;
}

const EventContext = createContext<EventContextState | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dateClicked, setDateClicked] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loadedMonths, setLoadedMonths] = useState<{ [key: string]: boolean }>({});
  const [openEditor, setOpenEditor] = useState<boolean>(false)
  const { toast } = useToast();
  const { user } = useSessionContext();
  const user_id = user?.id

  const fetchEventsForMonth = async (year: number, month: number) => {
    const key = `${year}-${month}`;
    if (loadedMonths[key]) return; // Avoid fetching if already loaded

    try {
      const response = await fetch(`/api/events?year=${year}&month=${month}&user_id=${user_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();

      setEvents((prevEvents) => [...prevEvents, ...data].reduce((acc, curr) => {
        const exists = acc.find((item: { id: number; }) => {
          return item.id === curr.id;
        });
        if (!exists){
          acc = acc.concat(curr)
        }
        return acc
      }, []));
      setLoadedMonths((prevLoaded) => ({ ...prevLoaded, [key]: true }));
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const addEvent = async (data: { user_id: string, title: string, date: Date, description: string }, formattedDate: string, action: 'created' | 'updated' | 'deleted'): Promise<Event | null> => {
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
            event.user_id === data.user_id
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
      return result.event
    } catch (error) {
      setOpenEditor(false);
        toast({
          title: `Action failed`,
          description: `Failed to create/update event taking place on ${formattedDate}`
        })
      console.error('Error adding event:', error);
      return null;
    }
  };

  // Initial fetch for the current month
  useEffect(() => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    fetchEventsForMonth(year, month);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_id]);

  return (
    <EventContext.Provider value={{ dateClicked, setDateClicked, addEvent, openEditor, setOpenEditor, events, setEvents, fetchEventsForMonth }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};