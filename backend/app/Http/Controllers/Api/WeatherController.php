<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\WeatherService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class WeatherController extends Controller
{
    private $weatherService;

    public function __construct(WeatherService $weatherService)
    {
        $this->weatherService = $weatherService;
    }

    public function current(Request $request): JsonResponse
    {
        try {
            $request->validate(['city' => 'required|string']);
            $data = $this->weatherService->getCurrentWeather($request->city);
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function forecast(Request $request): JsonResponse
    {
        try {
            $request->validate(['city' => 'required|string']);
            $data = $this->weatherService->getForecast($request->city);
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
