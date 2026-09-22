import axios from 'axios';
import { OPENWEATHER_API_KEY, OPENWEATHER_BASE_URL } from '../config/env.js';

const getMockWeather = () => {
  return {
    location: { name: "Mock City", latitude: 0, longitude: 0 },
    current: { temperature: 25, feelsLike: 27, humidity: 60, windSpeed: 10, windDirection: "N", pressure: 1012, uvIndex: 5, visibility: 10, cloudCover: 20, condition: "Clear", icon: "Sun" },
    precipitation: { probability: 0, amount: 0 },
    sun: { sunrise: "06:00", sunset: "18:00" },
    forecast: { hourly: [], daily: [] },
    insights: { irrigation: "No rain expected.", spraying: "Good conditions.", diseaseRisk: "Low." },
    alerts: []
  };
};

const mapIcon = (iconCode) => {
  if (iconCode.includes('01')) return 'Sun';
  if (iconCode.includes('02')) return 'CloudSun';
  if (iconCode.includes('03') || iconCode.includes('04')) return 'Cloud';
  if (iconCode.includes('09') || iconCode.includes('10')) return 'CloudRain';
  if (iconCode.includes('11')) return 'CloudRain';
  if (iconCode.includes('13')) return 'Cloud';
  if (iconCode.includes('50')) return 'Cloud';
  return 'Cloud';
};

const generateInsights = (current, forecast) => {
  let irrigation = "Soil moisture looks good.";
  let spraying = "Conditions are suitable for spraying.";
  let diseaseRisk = "Low disease risk currently.";

  if (current.windSpeed > 20) {
    spraying = "Strong winds expected. Avoid spraying pesticides.";
  }

  const rainExpected = forecast.daily.some((d, i) => i < 2 && d.rainProbability > 50);
  if (rainExpected) {
    irrigation = "Rain expected soon. Consider delaying irrigation.";
  } else if (current.temperature > 35 && current.humidity < 40) {
    irrigation = "Hot and dry conditions. Check soil moisture and irrigate if necessary.";
  }

  if (current.humidity > 80 && current.temperature > 25 && rainExpected) {
    diseaseRisk = "High humidity and warmth may increase fungal disease risk. Inspect crops.";
  }

  return { irrigation, spraying, diseaseRisk };
};

export const fetchFullWeather = async (lat, lng) => {
  if (!OPENWEATHER_API_KEY) {
    console.warn('[weatherService] API key not set — returning mock.');
    return getMockWeather();
  }

  try {
    const [currentRes, forecastRes] = await Promise.all([
      axios.get(`${OPENWEATHER_BASE_URL}/weather`, { params: { lat, lon: lng, appid: OPENWEATHER_API_KEY, units: 'metric' } }),
      axios.get(`${OPENWEATHER_BASE_URL}/forecast`, { params: { lat, lon: lng, appid: OPENWEATHER_API_KEY, units: 'metric' } })
    ]);

    const c = currentRes.data;
    const f = forecastRes.data;

    const hourly = f.list.slice(0, 8).map(h => ({
      time: new Date(h.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temp: Math.round(h.main.temp),
      rainProbability: Math.round(h.pop * 100),
      icon: mapIcon(h.weather[0].icon)
    }));

    const byDate = {};
    f.list.forEach(entry => {
      const date = entry.dt_txt.split(' ')[0];
      if (!byDate[date]) {
        byDate[date] = { date, tempMin: entry.main.temp_min, tempMax: entry.main.temp_max, pop: entry.pop, icon: entry.weather[0].icon };
      } else {
        byDate[date].tempMin = Math.min(byDate[date].tempMin, entry.main.temp_min);
        byDate[date].tempMax = Math.max(byDate[date].tempMax, entry.main.temp_max);
        byDate[date].pop = Math.max(byDate[date].pop, entry.pop);
      }
    });

    const daily = Object.values(byDate).slice(0, 7).map(d => ({
      day: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
      min: Math.round(d.tempMin),
      max: Math.round(d.tempMax),
      rainProbability: Math.round(d.pop * 100),
      icon: mapIcon(d.icon),
      condition: "Varies"
    }));

    const result = {
      location: { name: c.name, latitude: lat, longitude: lng },
      current: {
        temperature: Math.round(c.main.temp),
        feelsLike: Math.round(c.main.feels_like),
        humidity: c.main.humidity,
        windSpeed: Math.round(c.wind.speed * 3.6),
        windDirection: "N",
        pressure: c.main.pressure,
        uvIndex: 5, // Approximate since free API lacks it
        visibility: c.visibility / 1000,
        cloudCover: c.clouds.all,
        condition: c.weather[0].main,
        icon: mapIcon(c.weather[0].icon)
      },
      precipitation: {
        probability: hourly[0]?.rainProbability || 0,
        amount: c.rain ? c.rain['1h'] || 0 : 0
      },
      sun: {
        sunrise: new Date(c.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sunset: new Date(c.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      forecast: { hourly, daily },
      alerts: []
    };

    result.insights = generateInsights(result.current, result.forecast);
    return result;

  } catch (error) {
    console.error("Weather API Error:", error.message);
    throw new Error("Failed to fetch weather data");
  }
};
