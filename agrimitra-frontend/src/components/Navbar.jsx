import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  MapPin,
  Bell,
  CloudSun,
  ChevronDown,
  User,
  Mail,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";
import { greetingForTime } from "../utils/formatDate";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar({
  onMenuClick,
  userName = "Ramesh",
  location = "Indore, Madhya Pradesh",
  temp = 28,
  condition = "Partly Cloudy",
  alertCount = 5,
}) {
  const { toggleSidebar } = useSidebar();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = onMenuClick || toggleSidebar;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentUser = user || {
    name: userName || "Ramesh Kumar",
    email: "ramesh.kumar@agrimitra.org",
    plan: "Premium Plan",
    subscriptionStatus: "Active",
    renewsOn: "15 Oct 2026",
  };

  return (
    <header className="flex items-center justify-between gap-4 px-6 py-5 flex-wrap relative z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggle}
          className="lg:hidden w-9 h-9 rounded-lg border border-forest-950/10 flex items-center justify-center hover:bg-white/60 active:scale-95 transition"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={18} />
        </button>
        <div>
          <h1 className="text-xl font-display font-bold text-forest-950">
            {greetingForTime()}, {currentUser.name ? currentUser.name.split(" ")[0] : "Ramesh"}! 👋
          </h1>
          <p className="text-sm text-forest-950/50">
            Here's what's happening with your farms today.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1.5 text-sm text-forest-950/60">
          <MapPin size={16} className="text-leaf-600" />
          {location}
        </div>

        <div className="flex items-center gap-2 bg-white border border-forest-950/10 rounded-xl px-3 py-2 shadow-card">
          <CloudSun size={18} className="text-amber-500" />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-forest-950">{temp}°C</p>
            <p className="text-[11px] text-forest-950/40">{condition}</p>
          </div>
        </div>

        <button className="relative w-10 h-10 rounded-xl bg-white border border-forest-950/10 shadow-card flex items-center justify-center hover:bg-white/80 transition">
          <Bell size={18} className="text-forest-950/70" />
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[18px] px-1 rounded-full bg-clay text-white text-[10px] font-semibold flex items-center justify-center">
              {alertCount}
            </span>
          )}
        </button>

        {/* Rightmost Profile Button & Interactive Subscription Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-2.5 bg-white border border-forest-950/10 rounded-xl p-1.5 pr-3 shadow-card hover:bg-forest-950/5 transition text-left"
            aria-expanded={profileOpen}
          >
            <div className="w-8 h-8 rounded-lg bg-leaf-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              {currentUser.name ? currentUser.name.charAt(0) : "R"}
            </div>
            <div className="hidden sm:block leading-none">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-sm font-semibold text-forest-950">
                  {currentUser.name}
                </span>
                <span className="bg-leaf-100 text-leaf-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-leaf-300">
                  {currentUser.plan ? currentUser.plan.replace(" Plan", "") : "Pro"}
                </span>
              </div>
              <span className="text-[11px] text-forest-950/50 block truncate max-w-[140px]">
                {currentUser.email}
              </span>
            </div>
            <ChevronDown
              size={16}
              className={`text-forest-950/40 transition-transform duration-200 ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Profile Dropdown Popover */}
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-forest-950/10 shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
              {/* User Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-forest-950/10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-leaf-500 to-forest-800 text-white font-bold text-lg flex items-center justify-center shadow-md shrink-0">
                  {currentUser.name ? currentUser.name.charAt(0) : "R"}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-forest-950 truncate">
                    {currentUser.name}
                  </h3>
                  <p className="text-xs text-forest-950/60 flex items-center gap-1 truncate">
                    <Mail size={12} className="shrink-0 text-forest-950/40" />
                    {currentUser.email}
                  </p>
                </div>
              </div>

              {/* Subscription Info Card */}
              <div className="my-3 rounded-xl bg-gradient-to-r from-forest-900 to-forest-950 p-3.5 text-white relative overflow-hidden shadow-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-leaf-400">
                    <Sparkles size={14} />
                    <span>{currentUser.plan}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-leaf-500/20 text-leaf-300 border border-leaf-400/30 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-leaf-400 animate-pulse"></span>
                    {currentUser.subscriptionStatus || "Active"}
                  </span>
                </div>
                <p className="text-[11px] text-white/60">
                  Full access to AI advisory, weather insights &amp; soil analytics.
                </p>
                <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
                  <span>Renews: {currentUser.renewsOn || "Active"}</span>
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="text-leaf-400 hover:underline font-medium"
                  >
                    Manage Plan
                  </Link>
                </div>
              </div>

              {/* Menu Links */}
              <div className="space-y-1 text-xs">
                <Link
                  to="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-forest-950/80 hover:bg-forest-950/5 transition font-medium"
                >
                  <User size={15} className="text-forest-950/50" />
                  View Full Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-forest-950/80 hover:bg-forest-950/5 transition font-medium"
                >
                  <Settings size={15} className="text-forest-950/50" />
                  Account Settings
                </Link>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition font-medium text-left"
                >
                  <LogOut size={15} className="text-red-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
