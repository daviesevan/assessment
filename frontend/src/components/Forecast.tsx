import { ForecastData } from '@/types/weather';
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface ForecastProps {
  data: ForecastData[];
  unit: 'celsius' | 'fahrenheit';
}

export default function Forecast({ data, unit }: ForecastProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const constraintsRef = useRef(null);

  // Convert temperature if needed
  const convertTemp = (temp: number): number => {
    if (unit === 'fahrenheit') {
      return (temp * 9/5) + 32;
    }
    return temp;
  };

  // Get weather icon based on description and color
  const getWeatherIcon = (description: string): React.ReactNode => {
    const iconColor = getIconColor(description);

    if (description.includes('cloud')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
        </svg>
      );
    } else if (description.includes('rain') || description.includes('drizzle')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
          <path d="M16 14v6" />
          <path d="M8 14v6" />
          <path d="M12 16v6" />
        </svg>
      );
    } else {
      // Default sunny icon
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      );
    }
  };

  // Get color based on weather description
  const getIconColor = (description: string): string => {
    if (description.includes('cloud')) {
      return '#6366F1'; // Indigo for cloudy
    } else if (description.includes('rain') || description.includes('drizzle')) {
      return '#3B82F6'; // Blue for rainy
    } else if (description.includes('clear')) {
      return '#F59E0B'; // Amber for sunny/clear
    } else {
      return '#6366F1'; // Indigo as default
    }
  };

  // Get background gradient based on weather
  const getCardGradient = (description: string): string => {
    if (description.includes('cloud')) {
      return 'bg-gradient-to-br from-slate-100 to-indigo-100';
    } else if (description.includes('rain') || description.includes('drizzle')) {
      return 'bg-gradient-to-br from-blue-50 to-blue-100';
    } else if (description.includes('clear')) {
      return 'bg-gradient-to-br from-amber-50 to-amber-100';
    } else {
      return 'bg-gradient-to-br from-indigo-50 to-indigo-100';
    }
  };

  // Use all 5 days of forecast data
  const forecastData = data.slice(0, 5);

  // Navigation functions
  const nextSlide = () => {
    setActiveIndex((prev) => (prev === forecastData.length - 3 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? forecastData.length - 3 : prev - 1));
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="relative">
      <motion.div
        className="flex overflow-hidden"
        ref={constraintsRef}
      >
        <motion.div
          className="flex gap-6 px-2"
          animate={{ x: -activeIndex * (320 / 3) }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {forecastData.map((day, index) => (
            <motion.div
              key={day.date}
              className={`flex-shrink-0 w-[calc(33.333%-1.5rem)] border border-gray-200 rounded-lg p-5 flex flex-col items-center shadow-sm ${getCardGradient(day.description.toLowerCase())}`}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={index}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm font-medium mb-2 text-gray-700" suppressHydrationWarning>
                {new Date(day.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
              </p>
              <motion.div
                className="my-2"
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              >
                {getWeatherIcon(day.description.toLowerCase())}
              </motion.div>
              <p className="text-sm text-center mt-2 font-bold text-gray-800">
                {Math.round(convertTemp(day.temp))}°{unit === 'celsius' ? 'C' : 'F'}
              </p>
              <p className="text-xs text-center mt-1 text-gray-600 capitalize">
                {day.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Navigation buttons */}
      {forecastData.length > 3 && (
        <div className="flex justify-between w-full absolute top-1/2 transform -translate-y-1/2 px-2">
          <motion.button
            onClick={prevSlide}
            className="bg-white p-2 rounded-full shadow-md text-indigo-600 z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={activeIndex === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </motion.button>
          <motion.button
            onClick={nextSlide}
            className="bg-white p-2 rounded-full shadow-md text-indigo-600 z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={activeIndex === forecastData.length - 3}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </motion.button>
        </div>
      )}

      {/* Dots indicator */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: forecastData.length - 2 }).map((_, index) => (
          <motion.button
            key={index}
            className={`h-2 w-2 mx-1 rounded-full ${activeIndex === index ? 'bg-indigo-600' : 'bg-gray-300'}`}
            onClick={() => setActiveIndex(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          />
        ))}
      </div>
    </div>
  );
}
