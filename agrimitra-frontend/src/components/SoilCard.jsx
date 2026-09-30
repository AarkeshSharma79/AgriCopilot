import { useState, useEffect } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { getSoilHealth } from "../services/soilService";

export default function SoilCard({ score: propScore = null, farmId = 1 }) {
  const [score, setScore] = useState(propScore);
  const [metrics, setMetrics] = useState([]);
  const [isLoading, setIsLoading] = useState(!propScore);

  useEffect(() => {
      setIsLoading(true);
      getSoilHealth(farmId)
        .then((res) => {
          if (res?.data) {
            if (typeof res.data.score === "number") setScore(res.data.score);
            if (Array.isArray(res.data.metrics)) setMetrics(res.data.metrics);
          }
        })
        .catch(() => { })
        .finally(() => setIsLoading(false));
    }, [farmId]);

    const data = [
      { value: score },
      { value: 100 - score },
    ];

    return (
      <div className="card">
        <p className="card-title mb-4">Soil Health</p>

        {isLoading ? (
          <div className="flex items-center justify-center h-[110px] my-5">
            <p className="text-xs text-forest-950/50">Loading soil data...</p>
          </div>
        ) : score === null && metrics.length === 0 ? (
          <div className="flex items-center justify-center h-[110px] my-5">
            <p className="text-xs text-forest-950/50">No soil data available</p>
          </div>
        ) : (
          <div className="flex items-center gap-5">
            <div className="relative w-[110px] h-[110px] shrink-0">
              <PieChart width={110} height={110}>
                <Pie
                  data={data}
                  dataKey="value"
                  innerRadius={38}
                  outerRadius={50}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                >
                  <Cell fill="#2E8B3F" />
                  <Cell fill="#E1F1E2" />
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[11px] text-forest-950/40">Good</span>
                <span className="text-xl font-display font-bold text-forest-950">{score}%</span>
              </div>
            </div>

            <ul className="flex-1 space-y-2.5">
              {metrics.map(({ label, value }) => (
                <li key={label} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-forest-950/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-leaf-500" />
                    {label}
                  </span>
                  <span className="font-medium text-forest-950">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button className="btn-secondary w-full mt-5">View Soil Details</button>
      </div>
    );
}