'use client';
import { Event } from "@/app/types";

export default function Tasks({ dayEvent }: { dayEvent: Event | undefined }) {
  if (!dayEvent) {
    return (
      <div className="p-6 rounded-lg bg-gray-50 text-gray-500 text-center shadow">
        No tasks scheduled for today.
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg bg-white shadow space-y-4">
      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{dayEvent.title}</h2>
          <p className="text-sm text-gray-400 mt-1">{new Date(dayEvent.date).toLocaleDateString()}</p>
        </div>
        {dayEvent.summary && (
          <p className="text-gray-600 mt-1">{dayEvent.summary}</p>
        )}
      </div>
      <ul className="divide-y divide-gray-200">
        {dayEvent.schedule.length === 0 ? (
          <li className="py-4 text-gray-500">No scheduled activities.</li>
        ) : (
          dayEvent.schedule.map((item, idx) => (
            <li key={idx} className="flex items-center py-4">
              <span className="w-20 font-mono text-blue-600">{item.time}</span>
              <span className="ml-4 text-gray-700">{item.activity}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}