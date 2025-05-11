'use client';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { useEventContext } from "@/context/EventContext";
import { Pencil } from "lucide-react";
import { format, parse } from 'date-fns';
import { useRef } from "react";
import { cn } from "@/lib/utils";

const Event = () => {
    const { dateClicked, events, setOpenEditor } = useEventContext();
    const eventDiv = useRef<HTMLDivElement | null>(null);
    // Filter events for the clicked date
    const clickedDateEvents = events.filter(event => {
        return format(dateClicked, 'yyyy-MM-dd') === event.date
    });

    if (clickedDateEvents.length > 0){
        return (
            <Card ref={eventDiv} className={cn(`relative p-0! flex-1 md:w-96 h-4/5 overflow-hidden`)}>
                <CardHeader className="p-2 sm:p-6">
                    <CardTitle>{clickedDateEvents[0].title}</CardTitle>
                    <CardDescription>
                        {format(parse(clickedDateEvents[0].date, 'yyyy-MM-dd', new Date()), 'PPPP')}
                    </CardDescription>
                </CardHeader>
                {clickedDateEvents[0].schedule &&
                    <CardContent className="flex flex-col gap-2 overflow-y-auto h-4/5">
                        {clickedDateEvents[0].schedule.map((block, index) => {
                            return (
                                <div key={index} className="flex flex-col">
                                    <span className="text-muted-foreground w-max text-sm">
                                        {block.time}
                                    </span>
                                    <span className="text-wrap">
                                        {block.activity}
                                    </span>
                                </div>
                            )
                })}
                    </CardContent>}
                <Pencil onClick={() => setOpenEditor(true)} width={16} height={16} className="absolute top-2 right-2 cursor-pointer"/>
            </Card>
        )
    } else {
        return(
            <Card ref={eventDiv} className="flex-1 md:w-96 ">
                <CardHeader>
                        <CardTitle>Nothing Scheduled</CardTitle>
                        <CardDescription>
                            {format(dateClicked ? dateClicked : new Date(), 'PPPP') + ' '}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <Button onClick={() => setOpenEditor(true)}>Create</Button>
                    </CardContent>
            </Card>
        )
    }
}

export default Event;