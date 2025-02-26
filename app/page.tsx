'use client';
import { useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([0]);
  return (
    <div className="m-4">
      <div>
        <div className="flex w-full border rounded-md p-4 gap-4 justify-center">
          <div className="flex items-center justify-center border rounded-md p-4 max-w-sm w-full">
            Main Area here
          </div>
          <div className="flex items-center justify-center border rounded-md p-4 max-w-sm w-full">
            Date here with temperature
          </div>
        </div>
        <div>
          <div className="w-full border relative rounded-md p-4 gap-4 justify-center">
            <button onClick={() => setTasks(() => [...tasks, tasks.length])} className="text-2xl absolute left-0 top-0">
              +
            </button>
            <div>
              {tasks.map((task) => (
                <div key={task} className="flex items-center justify-center border rounded-md p-4 max-w-sm w-full">
                  {task}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
