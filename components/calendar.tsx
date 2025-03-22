'use client';
import { useEffect, useState } from "react";
import Cell from "./cell";
import { getYear, getMonth, getDaysInMonth, getDay, startOfMonth, isBefore, isToday, isAfter } from 'date-fns'
// import { Event, useEventContext } from "@/context/EventContext";

const monthsOfTheYear: string[] = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]

const Calendar = () => {
    const [yearSelected, setYearSelected] = useState<number>(getYear(new Date()));
    const [monthSelected, setMonthSelected] = useState<number>(getMonth(new Date()) + 1);
    const [monthMapped, setMonthMapped] = useState<(Date | undefined)[] | undefined >()
    const daysOfTheWeek = [ 'Sun.', 'Mon.', 'Tues.', 'Wed.', 'Thurs.', 'Fri.', 'Sat.' ];

    // const { fetchEventsForMonth, events, setDateClicked } = useEventContext(); 

    useEffect(() => {
        let monthMappedTemp: (undefined | Date)[] = [];
        const daysInMonth = getDaysInMonth(new Date(yearSelected, monthSelected - 1)); // -1 because date-fns months are 0-indexed
        const firstDayOfMonth = getDay(startOfMonth(new Date(yearSelected, monthSelected - 1)));
        const monthArray = new Array(daysInMonth + firstDayOfMonth % 7);

        for (let i = 0; i < monthArray.length; i++) {
            if (i >= firstDayOfMonth % 7) {
              let date = new Date(yearSelected, monthSelected - 1, (i - firstDayOfMonth % 7) + 1);
              monthMappedTemp[i] = date;
            } else {
              monthMappedTemp[i] = undefined;
            }
          }

        setMonthMapped(monthMappedTemp);
    }, [yearSelected, monthSelected])

    const handleMonthChange = (action: string) => {
        if ((action === 'prev')){
            monthSelected === 1 ? (setMonthSelected(12), setYearSelected(yearSelected - 1)) : setMonthSelected(monthSelected - 1)
        }
        if ((action === 'next')){
            monthSelected === 12 ? (setMonthSelected(1), setYearSelected(yearSelected + 1)) : setMonthSelected(monthSelected + 1)
        }
    }

    // const getEventStatusColor = (event?: Event) => {
    //     if (!event) return ''; // No event, no dot
    //     if (event.completed){
    //         return 'bg-green-500'
    //     }
    //     if (isToday(new Date(event.date))) {
    //         return 'bg-orange-500'; // Event is ongoing
    //     } else if (isBefore(new Date(event.date), new Date())) {
    //         return event.completed ? 'bg-green-500' : 'bg-red-500'; // Event happened or didn't happen
    //     } else if (isAfter(new Date(event.date), new Date())) {
    //         return 'bg-orange-500'; // Event will happen
    //     }
    //   };

    return(
        <div className="max-w-2xl w-full min-w-max h-fit flex flex-col border rounded pb-2">
            <div className='flex items-center py-2 select-none'>
                <div className="flex-1 text-center cursor-pointer" onClick={() => handleMonthChange('prev')}>
                    {'<'}
                </div>
                <div className="flex-1 text-center justify-center cursor-pointer text-sm">
                    {monthsOfTheYear[monthSelected - 1]} {yearSelected}
                </div>
                <div className="flex-1 text-center cursor-pointer" onClick={() => handleMonthChange('next')}>
                    {'>'}
                </div>
            </div>
            <div className="grid grid-cols-7 px-2">
                {daysOfTheWeek.map(day => {
                    return <div key={day} className="text-xs border-b border-t py-2 sm:text-sm mb-2 flex justify-center items-center"> {day} </div>
                })}
                {monthMapped?.map((cell, index) => {
                    // const event = events.find(event => cell && (new Date(event.date).toDateString() === cell.toDateString()));
                    // const dotColor = getEventStatusColor(event);
                    return ( <Cell key={cell ? cell.toISOString() : 0 - index} id={`date-${cell}`} date={cell} />)
                })}
            </div>
        </div>
    )
}

export default Calendar;