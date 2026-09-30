import { useEffect, useState } from "react";
import { getCurrentWeather, getForecast } from "../services/weatherService";

export function useWeather(location) {
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location) return;
    let cancelled = false;
    setLoading(true);

    Promise.all([getCurrentWeather(location), getForecast(location)])
      .then(([currentData, forecastData]) => {
        if (cancelled) return;
        setCurrent(currentData);
        setForecast(forecastData);
      })
      .catch((err) => !cancelled && setError(err))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [location]);

  return { current, forecast, loading, error };
}
