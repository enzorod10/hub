'use client';
import { useEffect, useState } from "react";
import { Task, TaskType, Priority } from "./types";
import { v4 as uuidv4 } from 'uuid';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import MainArea from "@/components/MainArea";

// Very fast and raw code to get Ai intergration done quickly.
// Will refactor later.

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState<string>('');
  const [type, setType] = useState<TaskType>("work");
  const [selectedPriority, setSelectedPriority] = useState<Priority>("low");
  const [geoLocation, setGeoLocation] = useState<{lat: number, lon: number} | undefined>();
  const [weather, setWeather] = useState<any>();

  const handleAddTask = (e) => {
    e.preventDefault();
    setTasks((prevTasks) => [...prevTasks, {
      name: taskName, 
      priority: selectedPriority,
      type,
      done: false,
      id: uuidv4() }]);
  }

  useEffect(() => {
    const callFunc = async () => {
      const res = await fetch('https://nominatim.openstreetmap.org/search?q=newark&format=json&limit=1', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'}})
      const data = await res.json();
      setGeoLocation({
        lat: data[0].lat,
        lon: data[0].lon });
    }

    callFunc();
  }, [])

  useEffect(() => {
    const fetchWeather = async () => {
      if (geoLocation) {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${geoLocation.lat}&longitude=${geoLocation.lon}&hourly=temperature_2m`);
        const data = await res.json();
        const weatherTemp = [];
        data.hourly.time.forEach((time, index) => {
          const hour = new Date(time).getHours();
          if (hour === new Date().getHours()) {
            weatherTemp.push({hour, temp: data.hourly.temperature_2m[index]})
          }
        }
        );
        setWeather(weatherTemp);
      }
    }

    fetchWeather();
  }, [geoLocation])

  return (
    <div className="m-4">
      <div>
        <div className="flex w-full border rounded-md p-4 gap-4 justify-center">
          
          <MainArea/>
          <div className="flex flex-col border rounded-md p-4 max-w-sm w-full">
            <div className="text-sm">
              Monday, January 1
            </div>
            <div className='flex flex-wrap'>
              {weather && weather.length > 0 && weather.map((weatherData, index) => (
                <div key={index} className="flex flex-col items-center justify-center border rounded-md p-4">
                  <div className="text-xl">
                    {weatherData.hour}:00
                  </div>
                  <div className="text-md">
                    {weatherData.temp}&deg;c
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div>
            <textarea />
          </div>
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
              <button onClick={(e) => handleAddTask(e)} className="text-2xl absolute left-0 top-0">
                +
              </button>
            </form>
            <div>
              {tasks?.map((task) => (
                <div key={task.id} className="flex flex-col items-center justify-center border rounded-md p-4 max-w-sm w-full">
                  <div>
                    {task.name}
                  </div>
                  <div>
                    {task.priority}
                  </div>
                  <div>
                    {task.type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}