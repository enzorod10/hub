'use client';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { useEventContext } from "@/context/EventContext";
import { Pencil } from "lucide-react";
import { format, isBefore, isAfter, isToday } from 'date-fns';
import { Switch } from "@/components/ui/switch"
import { useEffect, useRef, useState } from "react";
// import { toggleEventCompletion } from "@/app/actions";

const Event = () => {
    const { dateClicked, events, setOpenEditor, setEvents } = useEventContext();
    const eventDiv = useRef<HTMLDivElement | null>(null);

    // Filter events for the clicked date
    const clickedDateEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === (dateClicked ? dateClicked.toDateString() : new Date().toDateString());
    });

    const [complete, setComplete] = useState(false);

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

    const handleEventCompletionChange = () => {
        setComplete(!complete)
        // handleEventCompletion(!complete)
    }

    // const handleEventCompletion = async (completed: boolean) => {
    //     const result = await toggleEventCompletion(clickedDateEvents[0].id, completed)
    //     if (result){
    //         setEvents((prevEvents) => prevEvents.map((event) => event.id === result.id ? { ...event, completed} : event));
    //     }
    // }

    const grabStatus = () => {
        if (clickedDateEvents[0]){
            if (clickedDateEvents[0].completed){
                return 'Event happened'
            }
            if (isToday(clickedDateEvents[0].date)) {
                return 'Event is scheduled for today';
            } else if (isBefore(clickedDateEvents[0].date, new Date())) {
                return clickedDateEvents[0].completed ? 'Event happened' : 'Event did not happen';
            } else if (isAfter(clickedDateEvents[0].date, new Date())) {
                return 'Event has not happened yet';
            } 
        }
    }

    useEffect(() => {
        dateClicked && eventDiv.current?.scrollIntoView({ behavior: "smooth", block: "start", inline: "end" });
        if (clickedDateEvents.length > 0 && !isAfter(clickedDateEvents[0].date, new Date())){
            clickedDateEvents[0].completed ? setComplete(true) : setComplete(false)
        }
    }, [clickedDateEvents, dateClicked])

    if (clickedDateEvents.length > 0){
        return (
            <Card ref={eventDiv} className="relative w-full max-w-lg">
                <CardHeader>
                    <CardTitle>{clickedDateEvents[0].title}</CardTitle>
                    <CardDescription>
                        {format(clickedDateEvents[0].date, 'PPPP') + ' '}
                        {clickedDateEvents[0].description && 
                        '@ ' + clickedDateEvents[0].description.split('##DELIM##')[1].trim().split(' - ')[0].trim()}
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
                <CardFooter >
                    <span className='text-sm text-muted-foreground flex justify-between w-full'>
                        {grabStatus()}
                        {
                            !isAfter(clickedDateEvents[0].date, new Date()) &&
                            <Switch checked={complete} onCheckedChange={handleEventCompletionChange}/>
                        }
                    </span>
                </CardFooter>
                <Pencil onClick={() => setOpenEditor(true)} width={16} height={16} className="absolute top-2 right-2 cursor-pointer"/>
            </Card>
        )
    } else {
        return(
            <Card ref={eventDiv} className="w-full sm:max-w-fit">
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