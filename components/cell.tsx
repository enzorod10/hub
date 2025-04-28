'use client';
import { getDate } from "date-fns"

interface AppProps{
    date?: Date,
    id: string,
    dotColor?: string,
    setDateClicked: (date: Date) => void,
}

const Cell = ({ date, id, setDateClicked, dotColor }: AppProps) => {
    return !date ?
    <div className='border m-0.5 sm:m-1 opacity-25 pt-0.5 sm-pt-1 p-1 h-10 sm:h-12 flex relative flex-col rounded' id={id}>
    </div> : 
    <CellWithDate dotColor={dotColor} setDateClicked={setDateClicked} date={date} id={id} />
}

const CellWithDate = ({ date, id, setDateClicked, dotColor }: AppProps) => {
    return (
        <div onClick={() => setDateClicked(date!)} 
        className='cursor-pointer sm:min-w-12 hover:bg-accent hover:text-accent-foreground border m-0.5 sm:m-1 pt-0.5 sm-pt-1 p-1 h-10 sm:h-12 flex relative flex-col rounded' 
        id={id}
        >
            <p className="text-xs sm:text-sm">
                {getDate(date!)}
            </p>
            {<div className={`div absolute flex w-full h-full justify-center items-center top-0 left-0`}>
                <div className={`absolute h-1.5 w-6 ${dotColor} rounded-full`}>
                </div>
            </div>}
        </div>
    )
}

export default Cell;