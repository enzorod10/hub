'use client';
import { useState } from "react";
import { Task } from "./types";
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>();
  const [task, setTask] = useState<Task>({
    id: "0",
    type: "work",
    name: "",
    priority: "low",
    done: false
  });

  const handleAddTask = (e) => {
    e.preventDefault();
    setTasks((prevTasks) => [...(prevTasks || []), {...task, id: uuidv4()}]);
  }

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
            <form>
              <input onChange={(e) => setTask({...task, name: e.target.value})} type="text" placeholder="Add a task" className="w-full border rounded-md p-4" />
              <button onClick={(e) => handleAddTask(e)} className="text-2xl absolute left-0 top-0">
                +
              </button>
            </form>
            <div>
              {tasks?.map((task) => (
                <div key={task.id} className="flex items-center justify-center border rounded-md p-4 max-w-sm w-full">
                  {task.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
