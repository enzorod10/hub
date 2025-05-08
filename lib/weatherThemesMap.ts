'use client';
import { Sun, CloudRain, Cloud, Snowflake, Zap, CloudFog } from 'lucide-react';

export const weatherThemes = {
  Clear: {
    bgGradient: 'bg-gradient-to-br from-yellow-300 to-blue-400',
    icon: Sun,
    animation: 'animate-pulse'
  },
  Clouds: {
    bgGradient: 'bg-gradient-to-br from-gray-300 to-gray-500',
    icon: Cloud,
    animation: 'animate-float'
  },
  Rain: {
    bgGradient: 'bg-gradient-to-br from-gray-700 to-blue-900',
    icon: CloudRain,
    animation: 'animate-raindrop'
  },
  Thunderstorm: {
    bgGradient: 'bg-gradient-to-br from-purple-900 to-gray-700',
    icon: Zap,
    animation: 'animate-flash'
  },
  Snow: {
    bgGradient: 'bg-gradient-to-br from-blue-100 to-white',
    icon: Snowflake,
    animation: 'animate-snow'
  },
  Mist: {
    bgGradient: 'bg-gradient-to-br from-gray-100 to-gray-400',
    icon: CloudFog,
    animation: 'blur-sm'
  }
}