import { useState, useEffect } from "react";
import { getFarms } from "../services/farmService";

export default function FarmOverview() {
  const [plots, setPlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getFarms()
      .then((res) => {
        if (Array.isArray(res?.data)) {
          setPlots(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="card">
      <p className="card-title mb-4">Farm Overview</p>

      <div className="grid grid-cols-2 grid-rows-2 gap-1 rounded-xl overflow-hidden h-40">
        {isLoading ? (
          <div className="col-span-2 row-span-2 flex items-center justify-center">
            <p className="text-xs text-forest-950/50">Loading farms...</p>
          </div>
        ) : plots.length === 0 ? (
          <div className="col-span-2 row-span-2 flex items-center justify-center">
            <p className="text-xs text-forest-950/50">No farms added</p>
          </div>
        ) : (
          plots.map((plot) => (
            <div key={plot.id} className={`relative ${plot.className || "bg-leaf-500/80"}`}>
              <span
                className={`absolute top-2 left-2 w-5 h-5 rounded-full text-white text-[10px] font-semibold flex items-center justify-center ${plot.markerClass || "bg-leaf-600"}`}
              >
                {plot.id}
              </span>
            </div>
          ))
        )}
      </div>

      <button className="btn-secondary w-full mt-5">View All Farms</button>
    </div>
  );
}
