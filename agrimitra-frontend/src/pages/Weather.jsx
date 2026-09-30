import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Sun, Cloud, CloudRain, CloudSun, Droplets, Wind, CloudDrizzle, MapPin, RefreshCw, AlertTriangle } from "lucide-react";
import { getLocationWeather, getFarmWeather } from "../services/weatherService";
import { useAuth } from "../context/AuthContext";

const iconMap = { Sun, Cloud, CloudRain, CloudSun, Droplets, Wind, CloudDrizzle };

export default function Weather() {
  const { user } = useAuth();
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useDynamicLocation, setUseDynamicLocation] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchWeather = async (forceGPS = false) => {
    setIsLoading(true);
    setError(null);
    try {
      if (forceGPS || useDynamicLocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const res = await getLocationWeather(pos.coords.latitude, pos.coords.longitude);
            setWeatherData(res.data);
            setIsLoading(false);
          },
          (err) => {
            setError("Could not get location. Ensure GPS is enabled.");
            setIsLoading(false);
          }
        );
      } else {
        // Use farm location if available, else default to Indore coords
        const defaultLat = 22.7196;
        const defaultLon = 75.8577;
        let res;
        if (user?.farms?.length > 0) {
           res = await getFarmWeather(user.farms[0]._id);
        } else {
           res = await getLocationWeather(defaultLat, defaultLon);
        }
        setWeatherData(res.data);
        setIsLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch weather.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [useDynamicLocation, user]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchWeather();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const toggleLocation = () => setUseDynamicLocation(!useDynamicLocation);

  const renderIcon = (name, size = 24, className = "") => {
    const Icon = iconMap[name] || Cloud;
    return <Icon size={size} className={className} />;
  };

  return (
    <div className="flex-1 min-w-0 bg-gray-50 min-h-screen pb-10">
      <Navbar />
      <main className="px-4 md:px-8 max-w-5xl mx-auto space-y-6 pt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin size={24} className="text-sky-500" />
              {weatherData?.location?.name || "Loading Location..."}
            </h2>
            <p className="text-sm text-gray-500">Agricultural Weather Dashboard</p>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={toggleLocation} 
                className={`btn flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${useDynamicLocation ? 'bg-sky-100 text-sky-700' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}
              >
                <MapPin size={16} /> {useDynamicLocation ? "Using GPS" : "Use GPS Location"}
              </button>
              <button onClick={handleRefresh} className="btn bg-white border p-2 rounded-full hover:bg-gray-50 text-gray-600" title="Refresh">
                <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
              </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64 text-gray-400">Loading weather data...</div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">{error}</div>
        ) : !weatherData ? (
          <div className="text-gray-400">No data available.</div>
        ) : (
          <>
            {/* CURRENT WEATHER */}
            <div className="bg-gradient-to-br from-sky-500 to-sky-700 text-white rounded-3xl p-6 md:p-8 shadow-lg shadow-sky-500/20">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    {renderIcon(weatherData.current.icon, 56, "text-sky-100")}
                    <h1 className="text-6xl font-light">{weatherData.current.temperature}°C</h1>
                  </div>
                  <p className="text-xl font-medium text-sky-50">{weatherData.current.condition}</p>
                  <p className="text-sky-100 text-sm">Feels like {weatherData.current.feelsLike}°C</p>
                </div>
                
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 bg-white/10 p-5 rounded-2xl backdrop-blur-sm">
                   <div className="flex items-center gap-2">
                     <Droplets size={18} className="text-sky-200" />
                     <div><p className="text-xs text-sky-200">Humidity</p><p className="font-semibold">{weatherData.current.humidity}%</p></div>
                   </div>
                   <div className="flex items-center gap-2">
                     <Wind size={18} className="text-sky-200" />
                     <div><p className="text-xs text-sky-200">Wind</p><p className="font-semibold">{weatherData.current.windSpeed} km/h</p></div>
                   </div>
                   <div className="flex items-center gap-2">
                     <Sun size={18} className="text-sky-200" />
                     <div><p className="text-xs text-sky-200">UV Index</p><p className="font-semibold">{weatherData.current.uvIndex}</p></div>
                   </div>
                   <div className="flex items-center gap-2">
                     <CloudRain size={18} className="text-sky-200" />
                     <div><p className="text-xs text-sky-200">Precipitation</p><p className="font-semibold">{weatherData.precipitation.amount} mm</p></div>
                   </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* HOURLY & 7-DAY */}
              <div className="md:col-span-2 space-y-6">
                 {/* HOURLY */}
                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                   <h3 className="text-gray-900 font-bold mb-4">Today's Forecast</h3>
                   <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                     {weatherData.forecast.hourly.map((h, i) => (
                       <div key={i} className="flex flex-col items-center min-w-[70px] p-2 rounded-xl hover:bg-gray-50">
                         <span className="text-sm text-gray-500 mb-2">{h.time}</span>
                         {renderIcon(h.icon, 24, "text-gray-600 mb-2")}
                         <span className="font-semibold text-gray-900">{h.temp}°</span>
                         <div className="flex items-center gap-1 mt-1">
                           <Droplets size={10} className="text-blue-400" />
                           <span className="text-xs text-blue-500">{h.rainProbability}%</span>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>

                 {/* 7 DAY */}
                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                   <h3 className="text-gray-900 font-bold mb-4">7-Day Outlook</h3>
                   <div className="divide-y divide-gray-100">
                     {weatherData.forecast.daily.map((d, i) => (
                       <div key={i} className="flex items-center justify-between py-3">
                         <span className="w-12 font-medium text-gray-700">{d.day}</span>
                         <div className="flex items-center gap-2 w-16">
                           <Droplets size={12} className="text-blue-400" />
                           <span className="text-xs text-blue-500">{d.rainProbability}%</span>
                         </div>
                         <div className="w-12 flex justify-center">{renderIcon(d.icon, 20, "text-gray-600")}</div>
                         <div className="flex justify-end gap-3 w-24">
                           <span className="font-semibold text-gray-900">{d.max}°</span>
                           <span className="text-gray-400">{d.min}°</span>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
              </div>

              {/* AGRICULTURAL INSIGHTS */}
              <div className="space-y-6">
                <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                  <h3 className="text-emerald-900 font-bold flex items-center gap-2 mb-4">
                    <AlertTriangle size={18} /> Farm Weather Advice
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">💧 Irrigation</p>
                      <p className="text-sm text-emerald-900 mt-1">{weatherData.insights.irrigation}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">🧪 Spraying</p>
                      <p className="text-sm text-emerald-900 mt-1">{weatherData.insights.spraying}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">⚠️ Disease Risk</p>
                      <p className="text-sm text-emerald-900 mt-1">{weatherData.insights.diseaseRisk}</p>
                    </div>
                  </div>
                </div>
                
                {/* SUNRISE/SUNSET */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-gray-900 font-bold mb-4">Sun & Light</h3>
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex gap-3 items-center">
                       <div className="bg-orange-50 p-2 rounded-lg text-orange-500"><Sun size={20} /></div>
                       <div><p className="text-xs text-gray-500">Sunrise</p><p className="font-semibold">{weatherData.sun.sunrise}</p></div>
                     </div>
                     <div className="flex gap-3 items-center">
                       <div className="bg-indigo-50 p-2 rounded-lg text-indigo-500"><Sun size={20} /></div>
                       <div><p className="text-xs text-gray-500">Sunset</p><p className="font-semibold">{weatherData.sun.sunset}</p></div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
