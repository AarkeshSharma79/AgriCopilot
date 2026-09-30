import { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain, CloudSun, Droplets, Wind, CloudDrizzle, MapPin } from "lucide-react";
import { getLocationWeather } from "../services/weatherService";

const iconMap = { Sun, Cloud, CloudRain, CloudSun, Droplets, Wind, CloudDrizzle };

export default function WeatherCard({ location = "Indore, MP", temp: propTemp, condition: propCond, humidity: propHum, wind: propWind, rainfall: propRain }) {
  const [useDynamicLocation, setUseDynamicLocation] = useState(false);
  const [currentLocationStr, setCurrentLocationStr] = useState(location);
  const [isLoading, setIsLoading] = useState(true);
  const [weatherData, setWeatherData] = useState({
    temp: propTemp,
    condition: propCond,
    humidity: propHum,
    wind: propWind,
    rainfall: propRain,
  });
  const [forecast, setForecast] = useState([]);

  const toggleDynamicLocation = () => {
    if (!useDynamicLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const loc = `${position.coords.latitude.toFixed(2)},${position.coords.longitude.toFixed(2)}`;
            setCurrentLocationStr(loc);
            setUseDynamicLocation(true);
          },
          (error) => {
            console.error("Error getting location", error);
            alert("Could not get your location. Please check browser permissions.");
            setUseDynamicLocation(false);
          }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    } else {
      setUseDynamicLocation(false);
      setCurrentLocationStr(location);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    // Rough coordinates for demo fallback matching the old string logic
    const coords = currentLocationStr === "Pune, MH" ? { lat: 18.52, lon: 73.85 } :
                   currentLocationStr === "Bangalore, KA" ? { lat: 12.97, lon: 77.59 } :
                   currentLocationStr === "Delhi, IN" ? { lat: 28.61, lon: 77.20 } :
                   currentLocationStr === "Mumbai, MH" ? { lat: 19.07, lon: 72.87 } :
                   { lat: 22.71, lon: 75.85 }; // Default Indore

    getLocationWeather(coords.lat, coords.lon)
      .then((res) => {
        if (res?.data) {
          setWeatherData({
            temp: res.data.current.temperature,
            condition: res.data.current.condition,
            humidity: res.data.current.humidity,
            wind: res.data.current.windSpeed,
            rainfall: res.data.precipitation.amount,
          });
          if (res.data.forecast?.daily) {
            setForecast(res.data.forecast.daily);
          }
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [currentLocationStr]);

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <p className="card-title">Weather Overview</p>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleDynamicLocation} 
            className={`p-1 rounded-full transition-colors ${useDynamicLocation ? 'bg-sky-100 text-sky-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
            title={useDynamicLocation ? "Using your location" : "Use my location"}
          >
            <MapPin size={16} />
          </button>
          {!useDynamicLocation ? (
            <select
              value={currentLocationStr}
              onChange={(e) => setCurrentLocationStr(e.target.value)}
              className="text-xs font-medium text-forest-950/60 bg-forest-50 px-2 py-1 rounded-full w-28 outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer appearance-none"
              title="Select location"
            >
              {[...new Set([location, "Indore, MP", "Pune, MH", "Bangalore, KA", "Delhi, IN", "Mumbai, MH"])].map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          ) : (
            <p className="text-xs font-medium text-forest-950/60 bg-forest-50 px-2 py-1 rounded-full truncate max-w-[100px]" title="My Location">
              My Location
            </p>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <p className="text-xs text-forest-950/50">Loading weather...</p>
        </div>
      ) : weatherData.temp == null ? (
        <div className="flex items-center justify-center py-10">
          <p className="text-xs text-forest-950/50">No weather data</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-3xl font-display font-bold text-forest-950">{weatherData.temp}°C</p>
              <p className="text-sm text-forest-950/50">{weatherData.condition}</p>
            </div>
            <CloudSun size={44} className="text-amber-500" />
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="flex items-center gap-1.5">
              <Droplets size={14} className="text-sky-500" />
              <span className="text-xs text-forest-950/60">{weatherData.humidity}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wind size={14} className="text-forest-950/40" />
              <span className="text-xs text-forest-950/60">{weatherData.wind} km/h</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CloudDrizzle size={14} className="text-sky-500" />
              <span className="text-xs text-forest-950/60">{weatherData.rainfall} mm</span>
            </div>
          </div>

          <div className="flex justify-between border-t border-forest-950/5 pt-4">
            {forecast.length > 0 ? (
              forecast.map(({ day, iconName, temp: t }) => {
                const Icon = iconMap[iconName] || Cloud;
                return (
                  <div key={day} className="flex flex-col items-center gap-1.5">
                    <span className="text-[11px] text-forest-950/40">{day}</span>
                    <Icon size={16} className="text-forest-950/60" />
                    <span className="text-xs font-medium text-forest-950">{t}°C</span>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-forest-950/40 w-full text-center">No forecast</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

