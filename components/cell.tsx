'use client';
import { getDate } from "date-fns"

interface AppProps{
    date?: Date,
    id: string,
}

const Cell = ({ date, id }: AppProps) => {
    return !date ?
    <div className='border m-0.5 sm:m-1 opacity-25 pt-0.5 sm-pt-1 p-1 h-10 sm:h-12 flex relative flex-col rounded' id={id}>
    </div> : 
    <CellWithDate date={date} id={id} />
}

const CellWithDate = ({ date, id}: AppProps) => {
    return (
        <div 
        className='cursor-pointer sm:min-w-12 hover:bg-accent hover:text-accent-foreground border m-0.5 sm:m-1 pt-0.5 sm-pt-1 p-1 h-10 sm:h-12 flex relative flex-col rounded' 
        id={id}
        >
            <p className="text-xs sm:text-sm">
                {getDate(date!)}
            </p>
            {<div className={`absolute bottom-0 right-0 h-2 w-2 rounded-full`}></div>}
        </div>
    )
}

export default Cell;