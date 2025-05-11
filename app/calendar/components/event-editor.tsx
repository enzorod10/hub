'use client';
import React, { useEffect, useState, useRef } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { format } from 'date-fns';

type EventEditorProps = {
  onSubmit: (data: { title: string, user_id: string, date: Date, schedule: { time: string, activity: string }[] }, formattedDate: string, action: 'created' | 'updated' | 'deleted') => void;
  handleDeleteEvent: (data: { user_id: string, date: Date }, formattedDate: string) => void;
  event?: { title: string, date: Date, schedule: { time: string, activity: string }[] };
  date: Date;
}

interface TimeBlockState {
  timeBlockText: string[];
  timeDefinition: string;
  activity: string;
}

const EventEditor = ({ onSubmit, handleDeleteEvent, event, date }: EventEditorProps) => {
  const divRef = useRef<null | HTMLDivElement>(null);
  const { openEditor, setOpenEditor, user_id } = useEventContext();
  const [newBlockAdded, setNewBlockAdded] = useState(false);
  const [title, setTitle] = useState(event?.title ?? "")

  const [timeBlocks, setTimeBlocks] = useState<TimeBlockState[]>([
    { timeBlockText: ['', ''], timeDefinition: 'PM', activity: '' },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: string, index: number, subIndex: number, forcedValue?: string) => {
    if (subIndex === 0){
      if (Number(e.target.value) > 12 || e.target.value.length >= 3) return
    }
    if (subIndex === 1){
      if (Number(e.target.value) > 59 || e.target.value.length >= 3) return
    }
    const updatedBlocks = [...timeBlocks];
    updatedBlocks[index].timeBlockText[subIndex] = forcedValue ? forcedValue : e.target.value;
    setTimeBlocks(updatedBlocks);
  };

  const setTimeDefinition = (index: number, newTimeDefinition: string) => {
    const updatedBlocks = [...timeBlocks];
    updatedBlocks[index].timeDefinition = newTimeDefinition;
    setTimeBlocks(updatedBlocks);
  };

  const handleactivityChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedBlocks = [...timeBlocks];
    updatedBlocks[index].activity = e.target.value;
    setTimeBlocks(updatedBlocks);
  };

  const addTimeBlock = () => {
    setNewBlockAdded(true);
    const newTimeBlock: TimeBlockState = {
      timeBlockText: ['', ''],
      timeDefinition: 'PM',
      activity: ''
    };
    setTimeBlocks([...timeBlocks, newTimeBlock]);
  };

  const removeTimeBlock = (index: number) => {
    const updatedBlocks = [...timeBlocks];
    setTimeBlocks(updatedBlocks.filter((block, idx) => idx !== index))
  }

  useEffect(() => {
    if (openEditor) {
      setTitle(event?.title || '');

      if (Array.isArray(event?.schedule)) {
        const parsedBlocks = event.schedule.map(({ time, activity }) => {
          const timeMatch = time.match(/(\d+):(\d+)\s*(AM|PM)/i);

          if (timeMatch) {
            const [, hour, minute, period] = timeMatch;

            return {
              timeBlockText: [hour, minute],     // e.g., ["8", "00"]
              timeDefinition: period.toUpperCase(), // "AM" or "PM"
              activity,
            };
          }

          // Fallback if format doesn't match
          return {
            timeBlockText: ["", ""],
            timeDefinition: "AM",
            activity,
          };
        });

        setTimeBlocks(parsedBlocks);
      } else {
        setTimeBlocks([]);
      }
    }
  }, [openEditor, event]);


  useEffect(() => {
    if (newBlockAdded && divRef.current) {
      divRef.current.scrollTo({
        top: divRef.current.scrollHeight,
        behavior: 'smooth'  // Enable smooth scrolling
      });
      setNewBlockAdded(false);  // Reset the flag
    }
  }, [timeBlocks, newBlockAdded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct structured schedule from timeBlocks
    const structuredSchedule = timeBlocks.map(timeBlock => {
      const time = `${timeBlock.timeBlockText[0]}:${timeBlock.timeBlockText[1]} ${timeBlock.timeDefinition}`;
      const activity = timeBlock.activity;
      return { time, activity };
    });

    console.log({ title, date, structuredSchedule})

    onSubmit(
      {
        user_id: user_id!,
        title,
        date,
        schedule: structuredSchedule,
      },
      format(date, 'PPPP'),
      event ? 'updated' : 'created'
    );
  };

  return (
    <AlertDialog onOpenChange={setOpenEditor} open={openEditor}>
      <AlertDialogContent>
        <AlertDialogTitle className='sr-only'>Event Editor</AlertDialogTitle>
        <form onSubmit={e => handleSubmit(e)} className='relative gap-4 flex flex-col'>
          <span className="flex justify-between items-center text-muted-foreground w-full text-sm">
            <span>
              {format(date, 'PPPP')}
            </span>
            <span onClick={() => setOpenEditor(false)} className='cursor-pointer'>
              &#x2715;
            </span>
          </span>
          <div>
            <Input type="text" required onChange={e => setTitle(e.target.value)} value={title} placeholder="Stream title..." />
          </div>
          {timeBlocks.length > 0 ? 
            <div ref={divRef} className='flex flex-col border rounded p-4 gap-3 max-h-[300px] overflow-auto'>
              {timeBlocks.map((block, index) => {
                return (
                  <TimeBlock
                    key={index}
                    timeBlockText={block.timeBlockText}
                    timeDefinition={block.timeDefinition}
                    timeBlockactivity={block.activity}
                    handleInputChange={handleInputChange}
                    setTimeDefinition={setTimeDefinition}
                    setTimeBlockactivity={handleactivityChange}
                    removeTimeBlock={removeTimeBlock}
                    index={index}
                  />
                )
              })}
            </div>
              : 
            <div ref={divRef} className='text-center p-0 m-0 text-sm text-muted-foreground'>
              Press the button below to add a new time block.
            </div>
          }
          <Button variant="outline" className="w-full h-min p-1" type="button" onClick={addTimeBlock}>
            +
          </Button>
          <div className={`flex ${event ? 'justify-between' : 'justify-end'}`}>
            {event && <Button onClick={() => handleDeleteEvent({ user_id: user_id!, date }, format(date, 'PPPP'))} type="button" variant="destructive">Delete</Button>}
            <Button type="submit" className='me-2'>{event ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EventEditor;

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEventContext } from '@/context/EventContext';

interface TimeBlockProps {
  timeBlockText: string[];
  timeDefinition: string;
  timeBlockactivity: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, type: string, index: number, subIndex: number, forcedValue?: string) => void;
  setTimeDefinition: (index: number, newTimeDefinition: string) => void;
  setTimeBlockactivity: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  removeTimeBlock: (index: number) => void;
  index: number;
}

const TimeBlock: React.FC<TimeBlockProps>= ({ timeBlockText, timeDefinition, timeBlockactivity, handleInputChange, setTimeDefinition, setTimeBlockactivity, removeTimeBlock, index }) => {
  return (
    <div className='relative flex flex-wrap border rounded gap-3 p-2 justify-evenly' >
      <div>
        <div className='flex items-center gap-2'>
        <Input
          required
            value={timeBlockText[0]}
            type="number"
            className="text-md w-12 p-0 text-center"
            min="1"
            max="12"
            onChange={(e) => handleInputChange(e, 'from', index, 0)}
          />
          : 
          <Input
            required
            value={timeBlockText[1]}
            type="number"
            className="text-md w-12 p-0 text-center"
            min="0"
            max="59"
            onChange={(e) => handleInputChange(e, 'from', index, 1)}
            onBlur={(e) => e.target.value && ((Number(e.target.value) < 10 && e.target.value.length <= 1) && handleInputChange(e, 'from', index, 1, '0' + e.target.value ))}
          />
          <Button tabIndex={-1} type='button' onClick={() => setTimeDefinition(index, timeDefinition === 'PM' ? 'AM' : 'PM')}> {timeDefinition} </Button>
        </div>
      </div>
      
      <Input 
        required
        placeholder='Activities during this time block...' 
        value={timeBlockactivity}
        onChange={(e) => setTimeBlockactivity(e, index)}
      />
      <div
        onClick={() => removeTimeBlock(index)}
        className='absolute top-0 right-2 cursor-pointer'>
        -
      </div>
    </div>
  )
}