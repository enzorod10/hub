'use client';
import React, { useEffect, useState, useRef } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
} from "@/components/ui/alert-dialog"
import { format } from 'date-fns';

type EventEditorProps = {
  onSubmit: (data: { title: string, streamerId: number, date: Date, description: string }, formattedDate: string, action: 'created' | 'updated' | 'deleted') => void;
  handleDeleteEvent: (data: { streamerId: number, date: Date }, formattedDate: string) => void;
  event?: { title: string, date: Date, description: string, streamerId: number };
  date: Date;
}

interface TimeBlockState {
  timeBlockText: string[];
  timeDefinition: string[];
  description: string;
}

const EventEditor = ({ onSubmit, handleDeleteEvent, event, date }: EventEditorProps) => {
  const divRef = useRef<null | HTMLDivElement>(null);
  const { openEditor, setOpenEditor, streamerId } = useEventContext();
  const [newBlockAdded, setNewBlockAdded] = useState(false);
  const [title, setTitle] = useState(event?.title ?? "")

  const [timeBlocks, setTimeBlocks] = useState<TimeBlockState[]>([
    { timeBlockText: ['', '', '', ''], timeDefinition: ['PM', 'PM'], description: '' },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: string, index: number, subIndex: number, forcedValue?: string) => {
    if (subIndex === 0 || subIndex === 2){
      if (Number(e.target.value) > 12 || e.target.value.length >= 3) return
    }
    if (subIndex === 1 || subIndex === 3){
      if (Number(e.target.value) > 59 || e.target.value.length >= 3) return
    }
    const updatedBlocks = [...timeBlocks];
    updatedBlocks[index].timeBlockText[subIndex] = forcedValue ? forcedValue : e.target.value;
    setTimeBlocks(updatedBlocks);
  };

  const setTimeDefinition = (index: number, newTimeDefinition: string[]) => {
    const updatedBlocks = [...timeBlocks];
    updatedBlocks[index].timeDefinition = newTimeDefinition;
    setTimeBlocks(updatedBlocks);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedBlocks = [...timeBlocks];
    updatedBlocks[index].description = e.target.value;
    setTimeBlocks(updatedBlocks);
  };

  const addTimeBlock = () => {
    setNewBlockAdded(true);
    const newTimeBlock: TimeBlockState = {
      timeBlockText: ['', '', '', ''],
      timeDefinition: ['PM', 'PM'],
      description: ''
    };
    setTimeBlocks([...timeBlocks, newTimeBlock]);
  };

  const removeTimeBlock = (index: number) => {
    const updatedBlocks = [...timeBlocks];
    setTimeBlocks(updatedBlocks.filter((block, idx) => idx !== index))
  }
  

  useEffect(() => {
    if (openEditor) {
      event?.title ? setTitle(event?.title) : setTitle('')
      if (event?.description){
        // Regular expression to match text between ##DELIM## delimiters
        const regex = /##DELIM##(.*?)##DELIM##/gs;
        // Use match method to get all matches
        const matches = [];
        let match;
        while ((match = regex.exec(event.description)) !== null) {
          matches.push(match[1].trim());
        }

        let timeBlocksTemp = [];

        for (let i = 0; i < matches.length; i += 2) {
          // Extract start time and end time
          const [startTime, endTime] = matches[i].split(' - ');
          const [startHour, startMinute, startPeriod] = startTime.split(/:| /);
          const [endHour, endMinute, endPeriod] = endTime.split(/:| /);
        
          // Extract description
          const description = matches[i + 1];
        
          // Push the time block information into the timeBlocks array
          timeBlocksTemp.push({
            timeBlockText: [startHour, startMinute, endHour, endMinute],
            timeDefinition: [startPeriod, endPeriod],
            description: description
          });
        }

        setTimeBlocks(timeBlocksTemp);
      } else {
        setTimeBlocks([])
      }
      // Reset other form fields as needed
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
    // Function to format a single time block
    const formatTimeBlock: (timeBlock: TimeBlockState) => string = (timeBlock) => {
      const startTime = `${timeBlock.timeBlockText[0]}:${timeBlock.timeBlockText[1]} ${timeBlock.timeDefinition[0]}`;
      const endTime = `${timeBlock.timeBlockText[2]}:${timeBlock.timeBlockText[3]} ${timeBlock.timeDefinition[1]}`;
      const description = timeBlock.description;
      return `##DELIM## ${startTime} - ${endTime} ##DELIM## ##DELIM## ${description} ##DELIM## `;
    };

    // Format each time block and join them with delimiters
    const formattedDescription = timeBlocks.map(formatTimeBlock).join('');

    onSubmit({ streamerId, title, date, description: formattedDescription }, format(date, 'PPPP'), event ? 'updated' : 'created')
  }

  return (
    <AlertDialog onOpenChange={setOpenEditor} open={openEditor}>
      <AlertDialogContent >
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
                    timeBlockDescription={block.description}
                    handleInputChange={handleInputChange}
                    setTimeDefinition={setTimeDefinition}
                    setTimeBlockDescription={handleDescriptionChange}
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
            {event && <Button onClick={() => handleDeleteEvent({ streamerId, date }, format(date, 'PPPP'))} type="button" variant="destructive">Delete</Button>}
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
  timeDefinition: string[];
  timeBlockDescription: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, type: string, index: number, subIndex: number, forcedValue?: string) => void;
  setTimeDefinition: (index: number, newTimeDefinition: string[]) => void;
  setTimeBlockDescription: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  removeTimeBlock: (index: number) => void;
  index: number;
}

const TimeBlock: React.FC<TimeBlockProps>= ({ timeBlockText, timeDefinition, timeBlockDescription, handleInputChange, setTimeDefinition, setTimeBlockDescription, removeTimeBlock, index }) => {
  return (
    <div className='relative flex flex-wrap border rounded gap-3 p-2 justify-evenly' >
      <div>
      <span className="text-muted-foreground w-max text-sm">From</span>
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
          <Button tabIndex={-1} type='button' onClick={() => setTimeDefinition(index, [timeDefinition[0] === 'PM' ? 'AM' : 'PM', timeDefinition[1]])}> {timeDefinition[0]} </Button>
        </div>
      </div>
      <div>
      <span className="text-muted-foreground w-max text-sm">To</span>
        <div className='flex items-center gap-2'>
         <Input
          required
            value={timeBlockText[2]}
            type="number"
            className="text-md w-12 p-0 text-center"
            min="1"
            max="12"
            onChange={(e) => handleInputChange(e, 'to', index, 2)}
          />
          : 
          <Input
            required
            value={timeBlockText[3]}
            type="number"
            className="text-md w-12 p-0 text-center"
            min="0"
            max="59"
            onChange={(e) => handleInputChange(e, 'to', index, 3)}
            onBlur={(e) => e.target.value && ((Number(e.target.value) < 10 && e.target.value.length <= 1) && handleInputChange(e, 'to', index, 3, '0' + e.target.value ))}
          />
          <Button tabIndex={-1} type='button' onClick={() => setTimeDefinition(index, [timeDefinition[0], timeDefinition[1] === 'PM' ? 'AM' : 'PM'])}> {timeDefinition[1]} </Button>
        </div>
      </div>
      <Input 
        required
        placeholder='Activities during this time block...' 
        value={timeBlockDescription}
        onChange={(e) => setTimeBlockDescription(e, index)}
      />
      <div
        onClick={() => removeTimeBlock(index)}
        className='absolute top-0 right-2 cursor-pointer'>
        -
      </div>
    </div>
  )
}