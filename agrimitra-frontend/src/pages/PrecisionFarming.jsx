import Navbar from "../components/Navbar";
import PrecisionFarmingPanel from "../components/PrecisionFarmingPanel";

export default function PrecisionFarming() {
  return (
    <div className="flex-1 min-w-0">
      <Navbar />
      <main className="px-6 pb-10 space-y-6">
        <div>
          <h2 className="text-lg font-display font-bold text-forest-950">Precision Farming</h2>
          <p className="text-sm text-forest-950/50">
            Zone-level guidance for irrigation, fertilizer, seed and pest control.
          </p>
        </div>
        <PrecisionFarmingPanel />
      </main>
    </div>
  );
}
