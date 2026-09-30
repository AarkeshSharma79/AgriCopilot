import { NavLink } from "react-router-dom";
import {
  Sprout,
  LayoutGrid,
  Map,
  ScanLine,
  CloudSun,
  Leaf,
  Target,
  Bot,
  BellRing,
  FileBarChart,
  LineChart,
  Settings,
  HelpCircle,
  X,
} from "lucide-react";
import { useSidebar } from "../context/SidebarContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutGrid },
  { to: "/farms", label: "My Farms", icon: Map },
  { to: "/crop-monitoring", label: "Crop Monitoring", icon: ScanLine },
  { to: "/weather", label: "Weather Insights", icon: CloudSun },
  { to: "/soil-health", label: "Soil Health", icon: Leaf },
  { to: "/organic-farming", label: "Organic Farming", icon: Sprout },
  { to: "/precision-farming", label: "Precision Farming", icon: Target },
  { to: "/ai-assistant", label: "AI Assistant", icon: Bot },
  { to: "/farmer-chat", label: "Farmer AI Assistant", icon: Bot },
  { to: "/alerts", label: "Alerts & Notifications", icon: BellRing },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/market-prices", label: "Market Prices", icon: LineChart },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/help", label: "Help & Support", icon: HelpCircle },
];

export default function Sidebar() {
  const { isOpen, closeSidebar } = useSidebar();

  const sidebarContent = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-6 py-6 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-leaf-500/20 flex items-center justify-center">
            <Sprout className="w-5 h-5 text-leaf-400" />
          </div>
          <div>
            <p className="text-white font-display font-semibold text-sm leading-tight">
              Smart Agriculture
            </p>
            <p className="text-[11px] tracking-widest text-white/40">COPILOT</p>
          </div>
        </div>
        <button
          onClick={closeSidebar}
          className="lg:hidden p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-1 pb-6">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-leaf-500 text-white font-medium shadow-sm"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon className="w-4.5 h-4.5 shrink-0" size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar-desktop w-64 shrink-0 bg-forest-950 text-white/80 flex flex-col h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={closeSidebar}
          />
          <aside className="relative z-10 w-64 max-w-[80vw] bg-forest-950 text-white/80 flex flex-col h-full shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
