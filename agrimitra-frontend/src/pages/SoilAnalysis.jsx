import Navbar from "../components/Navbar";
import SoilCard from "../components/SoilCard";

export default function SoilAnalysis() {
  return (
    <div className="flex-1 min-w-0">
      <Navbar />
      <main className="px-6 pb-10 space-y-6">
        <div>
          <h2 className="text-lg font-display font-bold text-forest-950">Soil Health</h2>
          <p className="text-sm text-forest-950/50">
            NPK, pH, organic matter and moisture readings across your farms.
          </p>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          <SoilCard />
        </div>
      </main>
    </div>
  );
}
