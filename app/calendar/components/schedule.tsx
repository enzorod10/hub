'use client';
import Event from "./event";
import { EventProvider } from "@/context/EventContext";
import Calendar from "@/components/calendar";
import AdminPanel from "./admin-panel";
import { useSessionContext } from "@/context/SessionContext";

export const Schedule = () => {

  const { user } = useSessionContext(); 
  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return(
    <EventProvider user_id={user.id} >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 items-center">
          <Calendar/>
          <Event />
        </div>
        <AdminPanel />
      </div>
    </EventProvider>
  )
}