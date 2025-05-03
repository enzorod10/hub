'use client';
import Event from "./event";
import Calendar from "@/components/calendar";
import AdminPanel from "./admin-panel";

export const Schedule = () => {
  return(
    <div className="flex flex-col gap-4 items-center p-4">
      <div className="flex flex-wrap gap-4 ">
        <Calendar/>
        <Event />
      </div>
      <AdminPanel />
    </div>
  )
}