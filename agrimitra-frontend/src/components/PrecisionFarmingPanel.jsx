import { useState, useEffect } from "react";
import { Droplets, Sprout, Wheat, Bug } from "lucide-react";
import { zoneColorClass } from "../utils/cropUtils";
import { getPrecisionOverview } from "../services/precisionService";

const iconMap = {
  Irrigation: Droplets,
  Fertilizer: Sprout,
  Seed: Wheat,
  "Pest Control": Bug,
};

export default function PrecisionFarmingPanel() {
  const [tiles, setTiles] = useState([]);
  const [zones, setZones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getPrecisionOverview()
      .then((res) => {
        if (res?.data) {
          if (Array.isArray(res.data.tiles)) {
            const mappedTiles = res.data.tiles.map((t) => ({
              ...t,
              icon: iconMap[t.label] || Sprout,
            }));
            setTiles(mappedTiles);
          }
          if (Array.isArray(res.data.zones)) {
            setZones(res.data.zones);
          }
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="card">
      <p className="card-title">Precision Farming</p>
      <p className="card-subtitle mb-4">Smart recommendations for better yield</p>

      {isLoading ? (
        <div className="py-10 text-center">
          <p className="text-xs text-forest-950/50">Loading precision data...</p>
        </div>
      ) : tiles.length === 0 && zones.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-xs text-forest-950/50">No precision data available</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {tiles.map(({ icon: Icon, label, value, sub, color }) => {
              const IconComp = Icon || Sprout;
              return (
                <div key={label} className="rounded-xl border border-forest-950/5 p-3">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${color}`}>
                    <IconComp size={15} />
                  </span>
                  <p className="text-[11px] text-forest-950/40">{label}</p>
                  <p className="text-sm font-semibold text-forest-950">{value}</p>
                  <p className="text-[11px] text-forest-950/40">{sub}</p>
                </div>
              );
            })}
          </div>

          <p className="text-xs font-medium text-forest-950/50 mb-3">Field Zone Analysis</p>

          <div className="grid md:grid-cols-[1fr_auto] gap-5 items-center">
            <div className="grid grid-cols-3 gap-1 rounded-xl overflow-hidden h-32">
              {zones.map((z) => (
                <div key={z.id} className={`relative ${zoneColorClass(z.level)}`}>
                  <span className="absolute top-2 left-2 w-5 h-5 rounded-full bg-white/90 text-forest-950 text-[10px] font-semibold flex items-center justify-center">
                    {z.id}
                  </span>
                </div>
              ))}
            </div>

            <div className="min-w-[160px]">
              <div className="grid grid-cols-3 gap-x-3 text-[11px] font-medium text-forest-950/40 mb-1.5">
                <span>Zone</span>
                <span>Health</span>
                <span>Quality</span>
              </div>
              {zones.map((z) => (
                <div key={z.id} className="grid grid-cols-3 gap-x-3 text-xs text-forest-950/70 mb-1.5">
                  <span>Zone {z.id}</span>
                  <span>{z.health}</span>
                  <span
                    className={
                      z.level === "high"
                        ? "text-leaf-600"
                        : z.level === "medium"
                        ? "text-amber-500"
                        : "text-clay"
                    }
                  >
                    {z.quality}
                  </span>
                </div>
              ))}
              <button className="btn-primary w-full mt-3">View Zone Details</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

