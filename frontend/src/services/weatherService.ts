const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const WeatherService = {
  async getCurrentWeather(city: string) {
    const response = await fetch(`${API_BASE_URL}/api/weather/current?city=${encodeURIComponent(city)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    return response.json();
  },

  async getForecast(city: string) {
    const response = await fetch(`${API_BASE_URL}/api/weather/forecast?city=${encodeURIComponent(city)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch forecast data');
    }
    return response.json();
  }
};
