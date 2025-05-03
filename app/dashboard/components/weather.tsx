'use client'; 

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { weatherThemes } from '@/lib/weatherThemesMap';
import { LucideIcon } from "lucide-react";

type WeatherData = {
  name: string;
  weather: { main: string; description: string }[];
  main: { temp: number };
}

type WeatherProps = {
  theme: { bgGradient: string; icon: LucideIcon | null; animation: string },
  setTheme: (theme: { bgGradient: string; icon: LucideIcon | null; animation: string }) => void;
}

export default function Weather({theme, setTheme}: WeatherProps) {
  const [data, setData] = useState<WeatherData | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const res = await fetch(`/api/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
      const dataFetched = await res.json();
      const data = dataFetched.data;
      if (!data || data.cod !== 200) {
        console.error('Failed to fetch weather data:', dataFetched);
        return;
      }
      setData(data);

      const main: keyof typeof weatherThemes = data.weather[0].main;
      setTheme(weatherThemes[main] || {
        bgGradient: 'bg-white',
        icon: null,
        animation: ''
      });
    });
  }, [setTheme]);

  function capitalizeWords(str: string): string {
    return str.toLowerCase().split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }


  if (!data) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  const Icon = theme.icon;

  return (
    <div className={`flex flex-col items-center justify-center transition-all duration-500 w-1/3`}>
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 5, repeat: Infinity }} className={`${theme.animation}`}>
        {Icon && <Icon size={80} />}
      </motion.div>
      <h1 className="text-3xl font-bold text-center">{capitalizeWords(data.weather[0].description)}</h1>
      <p className="text-xl mt-1 font-semibold text-center">{((data.main.temp * 9/5) + 32).toFixed(0)}°F</p>
    </div>
  );
}