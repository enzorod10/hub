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
import { format } from 'date-fns';
import { useRef } from "react";

const Event = () => {
    const { dateClicked, events, setOpenEditor } = useEventContext();
    const eventDiv = useRef<HTMLDivElement | null>(null);
    // Filter events for the clicked date
    const clickedDateEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === (dateClicked ? dateClicked.toDateString() : new Date().toDateString());
    });

    const parsedDescription = () => {
        if (clickedDateEvents[0].description){
            const parts = clickedDateEvents[0].description.split('##DELIM##').filter(part => part.trim() !== '');
            const timeBlocks = [];
            for (let i = 0; i < parts.length; i += 2) {
                timeBlocks.push({ time: parts[i].trim(), description: parts[i + 1]?.trim() });
            }
            return timeBlocks;
        }
    };


    if (clickedDateEvents.length > 0){
        return (
            <Card ref={eventDiv} className="relative flex-1 md:w-96 ">
                <CardHeader>
                    <CardTitle>{clickedDateEvents[0].title}</CardTitle>
                    <CardDescription>
                        {format(clickedDateEvents[0].date, 'PPPP') + ' '}
                    </CardDescription>
                </CardHeader>
                {clickedDateEvents[0].description &&
                    <CardContent className="flex flex-col gap-2">
                        {parsedDescription()?.map((block, index) => {
                            return (
                                <div key={index} className="flex flex-col">
                                    <span className="text-muted-foreground w-max text-sm">
                                        {block.time}
                                    </span>
                                    <span className="text-wrap">
                                        {block.description}
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