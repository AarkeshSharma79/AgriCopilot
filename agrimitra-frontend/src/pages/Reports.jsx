import { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Droplets, Package, IndianRupee } from "lucide-react";
import Navbar from "../components/Navbar";
import { getReportsSummary } from "../services/reportsService";

const iconMap = {
  "Average Yield": TrendingUp,
  "Water Used": Droplets,
  "Fertilizer Used": Package,
  Income: IndianRupee,
};

const defaultYieldTrend = [
  { month: "Jan", value: 18 }, { month: "Feb", value: 22 }, { month: "Mar", value: 19 },
  { month: "Apr", value: 26 }, { month: "May", value: 21 }, { month: "Jun", value: 28 },
  { month: "Jul", value: 24 },
];

const defaultTopCrops = [
  { name: "Wheat", value: "35.2 Quintal/Acre", pct: 88 },
  { name: "Rice", value: "28.1 Quintal/Acre", pct: 70 },
  { name: "Soybean", value: "22.4 Quintal/Acre", pct: 56 },
  { name: "Tomato", value: "18.7 Quintal/Acre", pct: 46 },
];

const defaultExpenses = [
  { name: "Seed", value: 20, color: "#2E90E5" },
  { name: "Fertilizer", value: 30, color: "#3FA34D" },
  { name: "Irrigation", value: 15, color: "#F0A93B" },
  { name: "Labor", value: 20, color: "#E8664B" },
  { name: "Others", value: 15, color: "#8B8FA3" },
];

const defaultSummaryStats = [
  { icon: TrendingUp, label: "Average Yield", value: "22.5", unit: "Quintal / Acre", trend: "↑ 10%" },
  { icon: Droplets, label: "Water Used", value: "6500", unit: "Liter / Week", trend: "↓ 8%" },
  { icon: Package, label: "Fertilizer Used", value: "120", unit: "kg / Acre", trend: "↑ 5%" },
  { icon: IndianRupee, label: "Income", value: "₹1,25,000", unit: "This Season", trend: "↑ 15%" },
];

export default function Reports() {
  const [yieldTrendData, setYieldTrendData] = useState(defaultYieldTrend);
  const [topCropsData, setTopCropsData] = useState(defaultTopCrops);
  const [expensesData, setExpensesData] = useState(defaultExpenses);
  const [statsData, setStatsData] = useState(defaultSummaryStats);

  useEffect(() => {
    getReportsSummary()
      .then((res) => {
        if (res?.data) {
          if (Array.isArray(res.data.yieldTrend)) setYieldTrendData(res.data.yieldTrend);
          if (Array.isArray(res.data.topCrops)) setTopCropsData(res.data.topCrops);
          if (Array.isArray(res.data.expenses)) setExpensesData(res.data.expenses);
          if (Array.isArray(res.data.summaryStats)) {
            const mappedStats = res.data.summaryStats.map((s) => ({
              ...s,
              icon: iconMap[s.label] || TrendingUp,
            }));
            setStatsData(mappedStats);
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex-1 min-w-0">
      <Navbar />
      <main className="px-6 pb-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-display font-bold text-forest-950">Reports &amp; Analytics</h2>
            <p className="text-sm text-forest-950/50">Track your farm performance.</p>
          </div>
          <select className="text-xs text-forest-950/50 bg-white border border-forest-950/10 rounded-lg px-3 py-2">
            <option>This Year</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statsData.map(({ icon: Icon, label, value, unit, trend }) => {
            const IconComp = Icon || TrendingUp;
            return (
              <div key={label} className="card">
                <IconComp size={16} className="text-leaf-600 mb-2" />
                <p className="text-xl font-display font-bold text-forest-950">{value}</p>
                <p className="text-[11px] text-forest-950/40 mb-1">{unit}</p>
                <p className="text-[11px] font-medium text-leaf-600">{trend}</p>
              </div>
            );
          })}
        </div>

        <div className="grid xl:grid-cols-3 gap-4">
          <div className="card xl:col-span-1">
            <p className="card-title mb-4">Yield Trend</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={yieldTrendData} margin={{ left: -20, right: 10 }}>
                <CartesianGrid vertical={false} stroke="#EDF3ED" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#0B2E1F60" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#0B2E1F60" }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E1F1E2" }} />
                <Line type="monotone" dataKey="value" stroke="#2E8B3F" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <p className="card-title mb-4">Top Crops</p>
            <ul className="space-y-3">
              {topCropsData.map((c) => (
                <li key={c.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-forest-950">{c.name}</span>
                    <span className="text-forest-950/50">{c.value}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-forest-950/5 overflow-hidden">
                    <div className="h-full bg-leaf-500 rounded-full" style={{ width: `${c.pct}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <p className="card-title mb-4">Expense Breakdown</p>
            <div className="relative w-[130px] h-[130px] mx-auto mb-4">
              <PieChart width={130} height={130}>
                <Pie data={expensesData} dataKey="value" innerRadius={40} outerRadius={60} stroke="none">
                  {expensesData.map((e) => (
                    <Cell key={e.name} fill={e.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-display font-bold text-forest-950">₹1,25,000</span>
                <span className="text-[10px] text-forest-950/40">Total</span>
              </div>
            </div>
            <ul className="space-y-1.5">
              {expensesData.map((e) => (
                <li key={e.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-forest-950/60">
                    <span className="w-2 h-2 rounded-full" style={{ background: e.color }} />
                    {e.name}
                  </span>
                  <span className="font-medium text-forest-950">{e.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </main>
    </div>
  );
}
