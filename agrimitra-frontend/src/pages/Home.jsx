import { MapPin, Wheat } from "lucide-react";
import Navbar from "../components/Navbar";
import { useFarm } from "../hooks/useFarm";
import { healthStatusColor } from "../utils/cropUtils";

export default function Home() {
  const { farms } = useFarm();

  return (
    <div className="flex-1 min-w-0">
      <Navbar />
      <main className="px-6 pb-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-display font-bold text-forest-950">My Farms</h2>
            <p className="text-sm text-forest-950/50">Manage and monitor all your registered farms.</p>
          </div>
          <button className="btn-primary">+ Add Farm</button>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {farms.map((farm) => {
            const status = healthStatusColor[farm.health] || healthStatusColor.good;
            return (
              <div key={farm.id} className="card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-semibold text-forest-950">{farm.name}</h3>
                  <span className={`pill ${status.bg} ${status.text}`}>{farm.health}</span>
                </div>
                <p className="flex items-center gap-1.5 text-sm text-forest-950/60 mb-1">
                  <Wheat size={14} className="text-leaf-600" />
                  {farm.crop}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-forest-950/40 mb-4">
                  <MapPin size={13} />
                  Indore, Madhya Pradesh
                </p>
                <button className="btn-secondary w-full">View Details</button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
