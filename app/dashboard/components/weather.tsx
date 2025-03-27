'use client';
import { useEffect, useState } from "react";

export default function Weather() {
    const [geoLocation, setGeoLocation] = useState<{lat: number, lon: number} | undefined>();
    const [weather, setWeather] = useState<any>();

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
    );
  }