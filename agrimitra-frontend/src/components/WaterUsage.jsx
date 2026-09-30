import { useState, useEffect } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { getWaterUsage } from "../services/farmService";

export default function WaterUsage({ farmId = 1 }) {
  const [usageData, setUsageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getWaterUsage(farmId)
      .then((res) => {
        if (res?.data) setUsageData(res.data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [farmId]);

  const used = usageData?.used || 0;
  const capacity = usageData?.capacity || 1;
  const percent = Math.min(100, Math.round((used / capacity) * 100));
  const data = [{ value: percent }, { value: 100 - percent }];

  return (
    <div className="card">
      <p className="card-title mb-4">Water Usage</p>

      {isLoading ? (
        <div className="flex items-center justify-center h-[120px] my-5">
          <p className="text-xs text-forest-950/50">Loading usage...</p>
        </div>
      ) : !usageData ? (
        <div className="flex items-center justify-center h-[120px] my-5">
          <p className="text-xs text-forest-950/50">No data</p>
        </div>
      ) : (
        <>
          <div className="relative w-[120px] h-[120px] mx-auto">
            <PieChart width={120} height={120}>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={42}
                outerRadius={55}
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                <Cell fill="#2E90E5" />
                <Cell fill="#E6EEF7" />
              </Pie>
            </PieChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-display font-bold text-forest-950">{percent}%</span>
              <span className="text-[11px] text-leaf-600 font-medium">Good</span>
            </div>
          </div>

          <p className="text-center text-sm font-medium text-forest-950 mt-3">
            {used.toLocaleString()} / {capacity.toLocaleString()} L
          </p>
          <p className="text-center text-xs text-forest-950/40 mb-4">Water used this week</p>
        </>
      )}

      <button className="btn-secondary w-full">View Details</button>
    </div>
  );
}
