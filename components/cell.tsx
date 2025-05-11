'use client';
import { getDate, parse } from "date-fns"

interface AppProps{
    date?: string,
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
  if (!date) return null; // Skip rendering if date is undefined

  return (
    <div
      onClick={() => setDateClicked(parse(date, 'yyyy-MM-dd', new Date()))}
      className="cursor-pointer min-w-8 sm:min-w-12 hover:bg-accent hover:text-accent-foreground border m-1 p-1 h-10 sm:h-12 flex relative flex-col rounded"
      id={id}
    >
      <p className="text-xs sm:text-sm">
        {getDate(date + ' 00:00:00')}
        
      </p>
      <div className="div absolute flex w-full h-full justify-center items-center top-0 left-0">
        <div className={`absolute h-1 w-full bottom-0 ${dotColor} rounded-md`} />
      </div>
    </div>
  );
};

export default Cell;