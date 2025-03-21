'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Event {
  id: number;
  title: string;
  description: string;
  date: Date;
  completed: boolean;
  streamerId: number;
}

interface EventContextState {
  dateClicked: Date | null;
  setDateClicked: (date: Date) => void;
  openEditor: boolean;
  setOpenEditor: (open: boolean) => void;
  streamerId: number;
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  fetchEventsForMonth: (year: number, month: number) => void;
}

const EventContext = createContext<EventContextState | undefined>(undefined);

export const EventProvider: React.FC<{ streamerId: number, children: React.ReactNode }> = ({ streamerId, children }) => {
  const [dateClicked, setDateClicked] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loadedMonths, setLoadedMonths] = useState<{ [key: string]: boolean }>({});
  const [openEditor, setOpenEditor] = useState<boolean>(false)

  const fetchEventsForMonth = async (year: number, month: number) => {
    const key = `${year}-${month}`;
    if (loadedMonths[key]) return; // Avoid fetching if already loaded

    try {
      const response = await fetch(`/api/events?year=${year}&month=${month}&streamerId=${streamerId}`);
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

  // Initial fetch for the current month
  useEffect(() => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    fetchEventsForMonth(year, month);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamerId]);

  return (
    <EventContext.Provider value={{ dateClicked, setDateClicked, openEditor, setOpenEditor, streamerId, events, setEvents, fetchEventsForMonth }}>
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