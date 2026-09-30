import { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { getCropHealthOverview } from "../services/cropService";

export default function CropHealthCard({ data: propData, range = "This Year", farmId = 1 }) {
  const [chartData, setChartData] = useState(propData || []);
  const [isLoading, setIsLoading] = useState(!propData);

  useEffect(() => {
    if (!propData) {
      setIsLoading(true);
      getCropHealthOverview(farmId)
        .then((res) => {
          if (Array.isArray(res?.data)) {
            setChartData(res.data);
          }
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    } else {
      setChartData(propData);
      setIsLoading(false);
    }
  }, [farmId, propData]);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <p className="card-title">Crop Health Overview</p>
        <select className="text-xs text-forest-950/50 bg-transparent border border-forest-950/10 rounded-lg px-2 py-1">
          <option>{range}</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[220px]">
          <p className="text-xs text-forest-950/50">Loading chart data...</p>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[220px]">
          <p className="text-xs text-forest-950/50">No data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid vertical={false} stroke="#EDF3ED" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#0B2E1F60", fontSize: 12 }}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(v) => `${v}%`}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#0B2E1F60", fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => [`${value}%`, "Crop Health"]}
              contentStyle={{ borderRadius: 12, border: "1px solid #E1F1E2" }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#2E8B3F"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#2E8B3F", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

