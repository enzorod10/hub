'use client';
import { Event } from "@/app/types";
import { useMemo } from 'react';

type ScheduleItem = {
  time: string;
  activity: string;
  location?: string;
  notes?: string;
};

export default function Tasks({ dayEvent }: { dayEvent: Event | undefined }) {
  const formattedDate = useMemo(() => {
    if (!dayEvent) return null;
    try {
      return new Date(dayEvent.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
    } catch {
      return dayEvent.date;
    }
  }, [dayEvent]);

  if (!dayEvent) {
    return (
      <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white text-center shadow flex flex-col items-center gap-3">
  <div className="text-2xl font-semibold text-gray-700">No tasks today</div>
  <p className="text-sm text-gray-400 max-w-xs">Looks like you have a free day &mdash; relax or add something you&apos;d like to accomplish.</p>
        <div className="mt-2 inline-flex items-center gap-2">
          <button className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm shadow-sm hover:bg-blue-700">Add task</button>
          <button className="px-3 py-1 rounded-md border text-sm text-gray-600 hover:bg-gray-50">Import</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-white shadow-lg">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">{dayEvent.title}</h2>
          <p className="text-sm text-gray-500 mt-1">{formattedDate}</p>
          {dayEvent.summary && <p className="text-sm text-gray-600 mt-3 max-w-prose">{dayEvent.summary}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button className="text-sm px-3 py-1 rounded-md border bg-gray-50 hover:bg-gray-100">Edit</button>
          <button className="text-sm px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700">Add Item</button>
        </div>
      </header>

      <section className="mt-6">
  <h3 className="text-sm font-medium text-gray-600 mb-3">Today&apos;s schedule</h3>
        <ul className="space-y-3">
          {dayEvent.schedule.length === 0 ? (
            <li className="py-6 text-center text-gray-500">No scheduled activities for today.</li>
          ) : (
            dayEvent.schedule.map((rawItem, idx) => {
              const item = rawItem as ScheduleItem;
              return (
                <li key={idx} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex-shrink-0">
                    <div className="w-16 text-sm font-mono text-blue-600 text-center">{item.time}</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-gray-800 font-semibold">{item.activity}</div>
                      {item.location && <div className="text-xs text-gray-400">{item.location}</div>}
                    </div>
                    {item.notes && <div className="text-sm text-gray-500 mt-1">{item.notes}</div>}
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </section>
    </div>
  );
}