import { useEffect, useState, useCallback } from "react";
import { getCropHealthOverview, analyzeCropImage } from "../services/cropService";

export function useCrop(farmId, range = "year") {
  const [health, setHealth] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!farmId) return;
    let cancelled = false;
    setLoading(true);
    getCropHealthOverview(farmId, range)
      .then((data) => !cancelled && setHealth(data))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [farmId, range]);

  const analyze = useCallback(async (file) => {
    setAnalyzing(true);
    try {
      const data = await analyzeCropImage(file);
      setResult(data);
      return data;
    } finally {
      setAnalyzing(false);
    }
  }, []);

  return { health, loading, analyze, analyzing, result };
}
