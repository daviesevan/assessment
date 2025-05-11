<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class WeatherService
{
    private $apiKey;
    private $baseUrl = 'https://api.openweathermap.org/data/2.5';

    public function __construct()
    {
        $this->apiKey = config('services.openweathermap.key');
    }
    public function getCurrentWeather(string $city)
    {
        $cacheKey = "weather.current.{$city}";

        return Cache::remember($cacheKey, 1800, function () use ($city) {
            $response = Http::get("{$this->baseUrl}/weather", [
                'q' => $city,
                'appid' => $this->apiKey,
                'units' => 'metric'
            ]);

            if ($response->failed()) {
                \Log::error('OpenWeatherMap API Error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'city' => $city
                ]);
                throw new \Exception($response->json()['message'] ?? 'Failed to fetch weather data');
            }

            return $response->json();
        });
    }
    public function getForecast(string $city)
    {
        $cacheKey = "weather.forecast.{$city}";

        return Cache::remember($cacheKey, 1800, function () use ($city) {
            $response = Http::get("{$this->baseUrl}/forecast", [
                'q' => $city,
                'appid' => $this->apiKey,
                'units' => 'metric'
            ]);

            if ($response->failed()) {
                \Log::error('OpenWeatherMap Forecast API Error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'city' => $city
                ]);
                throw new \Exception($response->json()['message'] ?? 'Failed to fetch forecast data');
            }

            return $this->processForecastData($response->json());
        });
    }

    private function processForecastData(array $data)
    {
        $dailyForecasts = [];
        $processedDays = [];

        foreach ($data['list'] as $forecast) {
            $date = date('Y-m-d', $forecast['dt']);

            // Only take the first forecast for each day
            if (!isset($processedDays[$date])) {
                $dailyForecasts[] = [
                    'date' => $date,
                    'temp' => $forecast['main']['temp'],
                    'description' => $forecast['weather'][0]['description'],
                    'icon' => $forecast['weather'][0]['icon'],
                    'humidity' => $forecast['main']['humidity'],
                    'wind_speed' => $forecast['wind']['speed']
                ];
                $processedDays[$date] = true;
            }

            // Stop after 5 days
            if (count($dailyForecasts) >= 5) {
                break;
            }
        }

        return $dailyForecasts;
    }
}
