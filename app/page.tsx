'use client';

import Calendar from "@/components/calendar";

export default function Home() {

  return (
    <div className="m-4">
      <div className="flex w-full border rounded-md p-4 gap-4 justify-center">
        <Calendar />
      </div>
    </div>
  );
}