import { WeatherData } from '@/types/weather';
import React from 'react';
import { motion } from 'framer-motion';

interface CurrentWeatherProps {
  data: WeatherData;
  unit: 'celsius' | 'fahrenheit';
}

export default function CurrentWeather({ data, unit }: CurrentWeatherProps) {
  // Convert temperature if needed
  const convertTemp = (temp: number): number => {
    if (unit === 'fahrenheit') {
      return (temp * 9/5) + 32;
    }
    return temp;
  };

  const temperature = Math.round(convertTemp(data.main.temp));
  const weatherDescription = data.weather[0].description.toLowerCase();
  const weatherIcon = getWeatherIcon(weatherDescription);
  const bgGradient = getBackgroundGradient(weatherDescription);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  // Format the date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <motion.div
      className="relative w-full h-full min-h-[550px] rounded-2xl overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated kinetic gradient background */}
      <motion.div
        className={`absolute inset-0 ${bgGradient} overflow-hidden`}
        initial={{ backgroundPosition: '0% 0%' }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
        }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "linear"
        }}
      >
        {/* Animated gradient overlay for kinetic effect */}
        <motion.div
          className="absolute inset-0 opacity-70"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.2) 100%)'
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 0.5, 0.7]
          }}
          transition={{
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

      <div className="relative z-10 h-full flex flex-col items-center justify-between p-8 py-12">
        {/* Top content */}
        <div className="flex flex-col items-center mt-6">
          <motion.div
            className="mb-8"
            variants={itemVariants}
            animate={{
              y: [0, -10, 0],
              rotate: weatherDescription.includes('wind') ? [0, 5, -5, 0] : 0
            }}
            transition={{
              y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
              rotate: { repeat: Infinity, duration: 2, ease: "easeInOut" }
            }}
          >
            {weatherIcon}
          </motion.div>

          <motion.div
            className={`text-6xl font-bold mb-2 text-white`}
            variants={itemVariants}
          >
            {temperature}°{unit === 'celsius' ? 'C' : 'F'}
          </motion.div>

          <motion.div
            className="text-2xl capitalize mb-4 text-white"
            variants={itemVariants}
          >
            {data.weather[0].description}
          </motion.div>
        </div>

        {/* Bottom content */}
        <div className="w-full">
          <motion.div
            className="grid grid-cols-2 gap-6 mb-6 w-full"
            variants={itemVariants}
          >
            <div className="flex flex-col items-center p-3 rounded-lg bg-white/10 backdrop-blur-sm text-white">
              <span className="text-sm opacity-80">Humidity</span>
              <span className="text-xl font-semibold">{data.main.humidity}%</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-white/10 backdrop-blur-sm text-white">
              <span className="text-sm opacity-80">Wind</span>
              <span className="text-xl font-semibold">{data.wind.speed} km/h</span>
            </div>
          </motion.div>

          {/* Location and date in Netflix card style */}
          <motion.div
            className="text-center w-full py-4"
            variants={itemVariants}
          >
            <h2 className="text-3xl font-bold text-white tracking-wide">{data.name}</h2>
            <p className="text-sm text-white/50 mt-2">{formattedDate}</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// Helper function to get weather icon based on description
function getWeatherIcon(description: string): React.ReactNode {
  const iconColor = getIconColor(description);

  if (description.includes('cloud')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-40 h-40" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      </svg>
    );
  } else if (description.includes('rain') || description.includes('drizzle')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-40 h-40" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
        <path d="M16 14v6" />
        <path d="M8 14v6" />
        <path d="M12 16v6" />
      </svg>
    );
  } else if (description.includes('snow')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-40 h-40" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
        <path d="M8 15h.01" />
        <path d="M8 19h.01" />
        <path d="M12 17h.01" />
        <path d="M12 21h.01" />
        <path d="M16 15h.01" />
        <path d="M16 19h.01" />
      </svg>
    );
  } else {
    // Default sunny icon
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-40 h-40" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
}

// Get color based on weather description
function getIconColor(description: string): string {
  if (description.includes('cloud')) {
    return '#6366F1'; // Indigo for cloudy
  } else if (description.includes('rain') || description.includes('drizzle')) {
    return '#3B82F6'; // Blue for rainy
  } else if (description.includes('clear')) {
    return '#F59E0B'; // Amber for sunny/clear
  } else if (description.includes('snow')) {
    return '#60A5FA'; // Light blue for snow
  } else {
    return '#8B5CF6'; // Purple as default
  }
}

// Get background gradient based on weather
function getBackgroundGradient(description: string): string {
  if (description.includes('cloud')) {
    return 'bg-gradient-to-br from-slate-300 via-blue-300 to-indigo-400';
  } else if (description.includes('rain') || description.includes('drizzle')) {
    return 'bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-700';
  } else if (description.includes('clear')) {
    return 'bg-gradient-to-br from-amber-300 via-orange-400 to-orange-600';
  } else if (description.includes('snow')) {
    return 'bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-300';
  } else if (description.includes('thunderstorm')) {
    return 'bg-gradient-to-br from-gray-700 via-indigo-800 to-purple-900';
  } else if (description.includes('mist') || description.includes('fog')) {
    return 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600';
  } else {
    return 'bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-700';
  }
}


