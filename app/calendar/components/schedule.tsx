'use client';
import Event from "./event";
import Calendar from "@/components/calendar";
import AdminPanel from "./admin-panel";

export const Schedule = () => {
  return(
    <div className="flex flex-col sm:flex-row gap-4 items-center p-4 h-full overflow-y-auto">
      <Calendar/>
      <Event />
      <AdminPanel />
    </div>
  )
}