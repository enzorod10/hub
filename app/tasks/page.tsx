'use client';

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskType, Priority } from "@/app/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/utils/supabase/client";

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState<string>('');
  const [type, setType] = useState<TaskType>("work");
  const [selectedPriority, setSelectedPriority] = useState<Priority>("low");

  // Fetch tasks from Supabase
  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase.from('tasks').select('*');
      if (error) {
        console.error("Error fetching tasks:", error.message);
      } else {
        setTasks(data as Task[]);
      }
    };

    fetchTasks();
  }, []);

  // Add a task to Supabase
  const handleAddTask = async (e) => {
    e.preventDefault();
    const newTask = {
      id: uuidv4(),
      name: taskName,
      priority: selectedPriority,
      type,
      done: false,
    };

    const { data, error } = await supabase.from('tasks').insert([newTask]);
    if (error) {
      console.error("Error adding task:", error.message);
    } else {
      setTasks((prevTasks) => [...prevTasks, ...data]);
      setTaskName('');
    }
  };

  // Toggle task completion
  const toggleTaskDone = async (taskId: string, done: boolean) => {
    const { error } = await supabase.from('tasks').update({ done: !done }).eq('id', taskId);
    if (error) {
      console.error("Error updating task:", error.message);
    } else {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, done: !done } : task
        )
      );
    }
  };

  return (
    <div className="m-4">
      <div className="w-full border relative rounded-md p-4 gap-4 justify-center">
        <form>
          <input
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            type="text"
            placeholder="Add a task"
            className="w-full border rounded-md p-4"
          />
          <RadioGroup
            value={selectedPriority}
            onValueChange={(value: string) => setSelectedPriority(value as Priority)}
            className="flex items-center justify-center space-x-4"
          >
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
          <RadioGroup
            value={type}
            onValueChange={(value: string) => setType(value as TaskType)}
            className="flex items-center justify-center space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="work" id="r4" />
              <Label htmlFor="r4">Work</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="personal" id="r5" />
              <Label htmlFor="r5">Personal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="r6" />
              <Label htmlFor="r6">Other</Label>
            </div>
          </RadioGroup>
          <button
            onClick={(e) => handleAddTask(e)}
            className="text-2xl absolute left-0 top-0"
          >
            +
          </button>
        </form>
        <div>
          {tasks?.map((task) => (
            <div
              key={task.id}
              className="flex flex-col items-center justify-center border rounded-md p-4 max-w-sm w-full"
            >
              <div>{task.name}</div>
              <div>{task.priority}</div>
              <div>{task.type}</div>
              <button
                onClick={() => toggleTaskDone(task.id, task.done)}
                className={`mt-2 px-4 py-2 rounded ${
                  task.done ? "bg-green-500" : "bg-gray-500"
                } text-white`}
              >
                {task.done ? "Mark as Incomplete" : "Mark as Done"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}