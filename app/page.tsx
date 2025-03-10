'use client';
import { useState } from "react";
import { Task, TaskType, Priority } from "./types";
import { v4 as uuidv4 } from 'uuid';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState<string>('');
  const [type, setType] = useState<TaskType>("work");
  const [selectedPriority, setSelectedPriority] = useState<Priority>("low");

  const handleAddTask = (e) => {
    e.preventDefault();
    setTasks((prevTasks) => [...prevTasks, {
      name: taskName, 
      priority: selectedPriority,
      type,
      done: false,
      id: uuidv4() }]);
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
              <input onChange={(e) => setTaskName(e.target.value)} type="text" placeholder="Add a task" className="w-full border rounded-md p-4" />
              <RadioGroup value={selectedPriority} onValueChange={(value: string) => setSelectedPriority(value as Priority)} className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="r1" />
                  <Label htmlFor="r1">Low Prio</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="r2" />
                  <Label htmlFor="r2">Medium Prio</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="r3" />
                  <Label htmlFor="r3">High Prio</Label>
                </div>
              </RadioGroup>
              <RadioGroup value={type} onValueChange={(value: string) => setType(value as TaskType)} className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="work" id="r1" />
                  <Label htmlFor="r1">Work</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="personal" id="r2" />
                  <Label htmlFor="r2">Personal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="r3" />
                  <Label htmlFor="r3">Other</Label>
                </div>
              </RadioGroup>
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