// Live Weather Data Service — Open-Meteo Integration for Kolkata Burrabazar / Posta District
// API: Open-Meteo Free Public Forecast API (No API key required)

export interface LiveWeatherData {
  temperatureC: number;
  precipitationMm: number;
  weatherCode: number;
  weatherDescription: string;
  isLive: boolean;
  timestamp: string;
}

export async function fetchLiveKolkataWeather(): Promise<LiveWeatherData> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 1500);
    let res: Response;
    try {
      res = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=22.5726&longitude=88.3639&current_weather=true&hourly=precipitation',
        { signal: controller.signal }
      );
    } finally {
      clearTimeout(id);
    }
    if (!res.ok) throw new Error(`Weather API error: ${res.statusText}`);
    const data = await res.json();
    
    const temp = data.current_weather?.temperature ?? 29.5;
    const weatherCode = data.current_weather?.weathercode ?? 0;
    const isRaining = weatherCode >= 51 || (data.hourly?.precipitation?.[0] ?? 0) > 0;
    const precipitationMm = isRaining ? (data.hourly?.precipitation?.[0] ?? 2.5) : 0.0;

    return {
      temperatureC: Math.round(temp * 10) / 10,
      precipitationMm: Math.round(precipitationMm * 10) / 10,
      weatherCode,
      weatherDescription: getWeatherDescription(weatherCode),
      isLive: true,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.warn('Fallback to estimated weather due to network limit:', error);
    return {
      temperatureC: 29.2,
      precipitationMm: 0.0,
      weatherCode: 1,
      weatherDescription: 'Mainly Clear (Estimated)',
      isLive: false,
      timestamp: new Date().toISOString()
    };
  }
}

function getWeatherDescription(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code === 1 || code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code >= 51 && code <= 55) return 'Light Drizzle';
  if (code >= 61 && code <= 65) return 'Rain Showers';
  if (code >= 80 && code <= 82) return 'Heavy Monsoon Rain';
  if (code >= 95) return 'Thunderstorm';
  return 'Clear';
}
