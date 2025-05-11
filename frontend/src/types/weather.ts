export interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

export interface ForecastData {
  date: string;
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  wind_speed: number;
}

export interface WeatherError {
  error: string;
}
