import { Leaf, Map, BellRing, Droplets, TrendingUp } from "lucide-react";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import CropHealthCard from "../components/CropHealthCard";
import WeatherCard from "../components/WeatherCard";
import SoilCard from "../components/SoilCard";
import FarmOverview from "../components/FarmOverview";
import RecommendationCard from "../components/RecommendationCard";
import AlertCard from "../components/AlertCard";
import WaterUsage from "../components/WaterUsage";
import CropMonitoringPanel from "../components/CropMonitoringPanel";
import PrecisionFarmingPanel from "../components/PrecisionFarmingPanel";



import { useState, useEffect } from "react";
import { getReportsSummary } from "../services/reportsService";

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getReportsSummary()
      .then((res) => {
        if (Array.isArray(res?.data)) setStats(res.data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const iconMap = { Leaf, Map, BellRing, Droplets, TrendingUp };

  return (
    <div className="flex-1 min-w-0">
      <Navbar />

      <main className="px-6 pb-10 space-y-6">
        <div className="stat-grid grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {isLoading ? (
            <p className="text-sm text-forest-950/50">Loading stats...</p>
          ) : stats.length > 0 ? (
            stats.map((s) => (
              <StatCard key={s.label} {...s} icon={iconMap[s.iconName] || Leaf} />
            ))
          ) : (
            <p className="text-sm text-forest-950/50">No stats available</p>
          )}
        </div>

        <div className="dashboard-grid grid grid-cols-1 xl:grid-cols-[1.4fr_1fr_1fr] gap-4">
          <CropHealthCard />
          <WeatherCard />
          <SoilCard />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          <FarmOverview />
          <RecommendationCard />
          <AlertCard />
          <WaterUsage />
        </div>

        <CropMonitoringPanel />
        <PrecisionFarmingPanel />
      </main>
    </div>
  );
}
