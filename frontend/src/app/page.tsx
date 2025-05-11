'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { WeatherService } from '@/services/weatherService';
import { WeatherData, ForecastData } from '@/types/weather';
import SearchBar from '@/components/SearchBar';
import CurrentWeather from '@/components/CurrentWeather';
import Forecast from '@/components/Forecast';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);

  const handleSearch = async (city: string) => {
    setIsLoading(true);
    setError('');
    try {
      const [current, forecast] = await Promise.all([
        WeatherService.getCurrentWeather(city),
        WeatherService.getForecast(city)
      ]);
      setCurrentWeather(current);
      setForecast(forecast);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  };

  const [tempUnit, setTempUnit] = useState<'celsius' | 'fahrenheit'>('celsius');

  const toggleTempUnit = () => {
    setTempUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  // Get background gradient based on weather condition
  const getPageBackground = () => {
    if (!currentWeather) return 'bg-gradient-to-br from-blue-50 to-indigo-100';

    const description = currentWeather.weather[0].description.toLowerCase();

    if (description.includes('cloud')) {
      return 'bg-gradient-to-br from-gray-100 to-blue-100';
    } else if (description.includes('rain') || description.includes('drizzle')) {
      return 'bg-gradient-to-br from-blue-100 to-indigo-200';
    } else if (description.includes('clear')) {
      return 'bg-gradient-to-br from-amber-50 to-orange-100';
    } else if (description.includes('snow')) {
      return 'bg-gradient-to-br from-blue-50 to-indigo-100';
    } else {
      return 'bg-gradient-to-br from-purple-50 to-indigo-100';
    }
  };

  return (
    <main className={`min-h-screen ${getPageBackground()} p-4 md:p-8 transition-colors duration-1000`}>
      <motion.div
        className="max-w-6xl mx-auto bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl p-8 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.2), 0 20px 60px -30px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="flex flex-col md:flex-row gap-10">
          {/* Left side - Current weather */}
          <motion.div
            className="w-full md:w-2/5 md:border-r border-gray-200 pr-0 md:pr-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {currentWeather ? (
              <CurrentWeather data={currentWeather} unit={tempUnit} />
            ) : (
              <motion.div
                className="relative w-full h-full min-h-[550px] rounded-2xl overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {/* Animated kinetic gradient background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-slate-300 via-blue-300 to-indigo-400 overflow-hidden"
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

                {/* Netflix-style gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 py-12">
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, 0, -5, 0]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 5,
                      ease: "easeInOut"
                    }}
                    className="text-white/80 mb-6"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-40 h-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                    </svg>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p className="text-xl text-white text-center font-medium">Search for a city to see weather information</p>
                    <p className="text-white/60 text-center mt-2">Enter a location in the search bar above</p>
                  </motion.div>

                  {/* Netflix-style location indicator at bottom */}
                  <motion.div
                    className="absolute bottom-12 text-center w-full py-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <h2 className="text-3xl font-bold text-white tracking-wide">Weather App</h2>
                    <p className="text-sm text-white/50 mt-2">Your forecast awaits</p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right side - Search and forecast */}
          <motion.div
            className="w-full md:w-3/5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
              <motion.button
                onClick={toggleTempUnit}
                className="px-4 py-3 bg-white border-2 border-indigo-200 rounded-md text-indigo-600 font-bold text-lg shadow-md hover:bg-indigo-50 transition-colors"
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 4px 20px -5px rgba(99, 102, 241, 0.4)'
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                °{tempUnit === 'celsius' ? 'F' : 'C'}
              </motion.button>
            </div>

            {error && (
              <motion.div
                className="p-4 bg-red-100 border border-red-200 rounded-lg text-center text-red-700 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}

            {currentWeather && !error && (
              <>
                <motion.div
                  className="mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold mb-5 text-indigo-800 border-b-2 border-indigo-100 pb-2">5-Day Forecast</h2>
                  <Forecast data={forecast} unit={tempUnit} />
                </motion.div>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <motion.div
                    className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 shadow-md"
                    whileHover={{ scale: 1.02, boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.2)' }}
                    transition={{ duration: 0.2 }}
                    style={{
                      boxShadow: '0 4px 15px -3px rgba(59, 130, 246, 0.1)'
                    }}
                  >
                    <h3 className="text-blue-700 font-bold text-xl mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
                      </svg>
                      Wind Status
                    </h3>
                    <div className="text-4xl font-bold text-blue-900 mb-2">{currentWeather.wind.speed} km/h</div>
                    <div className="flex items-center">
                      <motion.span
                        className="inline-block p-2 rounded-full bg-white shadow-sm border border-blue-200 mr-3"
                        animate={{ rotate: [0, 360] }}
                        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </motion.span>
                      <span className="text-sm text-blue-700 font-medium">WSW</span>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6 shadow-md"
                    whileHover={{ scale: 1.02, boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.2)' }}
                    transition={{ duration: 0.2 }}
                    style={{
                      boxShadow: '0 4px 15px -3px rgba(139, 92, 246, 0.1)'
                    }}
                  >
                    <h3 className="text-purple-700 font-bold text-xl mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                      </svg>
                      Humidity
                    </h3>
                    <div className="text-4xl font-bold text-purple-900 mb-2">{currentWeather.main.humidity}%</div>
                    <div className="w-full bg-white rounded-full h-4 shadow-inner overflow-hidden border border-purple-100">
                      <motion.div
                        className="bg-gradient-to-r from-purple-400 to-purple-600 h-4 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${currentWeather.main.humidity}%` }}
                        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                      ></motion.div>
                    </div>
                    <div className="flex justify-between text-sm text-purple-700 mt-2 font-medium">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </motion.div>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
