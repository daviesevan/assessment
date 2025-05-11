import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [city, setCity] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex-1"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center relative">
        <motion.div
          className="absolute left-3 text-indigo-500"
          animate={{
            scale: isFocused ? 1.1 : 1,
            rotate: isFocused ? [0, -10, 10, -10, 0] : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </motion.div>

        <motion.input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search city..."
          className="w-full pl-10 pr-4 py-3 border-2 border-indigo-100 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 text-gray-700 bg-white shadow-md text-lg font-medium"
          disabled={isLoading}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          style={{
            boxShadow: isFocused ? '0 4px 20px -5px rgba(99, 102, 241, 0.4)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />

        <motion.button
          type="submit"
          disabled={isLoading || !city.trim()}
          className="px-6 py-3 bg-indigo-600 border-2 border-indigo-600 rounded-r-md text-white font-bold text-lg hover:bg-indigo-700 hover:border-indigo-700 transition-colors shadow-md"
          whileHover={{ scale: 1.05, backgroundColor: '#4338ca', borderColor: '#4338ca' }}
          whileTap={{ scale: 0.95 }}
          style={{
            boxShadow: '0 4px 14px -4px rgba(99, 102, 241, 0.5)'
          }}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            "GO"
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}
