import { useState } from "react";
import Navbar from "../components/Navbar";
import { useSettings } from "../context/SettingsContext";
import {
  Sun,
  Moon,
  Laptop,
  MapPin,
  Mic,
  MicOff,
  Navigation,
  Volume2,
  CheckCircle2,
  Bell,
  SlidersHorizontal,
  RefreshCw,
} from "lucide-react";

export default function Settings() {
  const {
    themeMode,
    setThemeMode,
    realtimeLocation,
    setRealtimeLocation,
    voiceAssistant,
    setVoiceAssistant,
    voiceLanguage,
    setVoiceLanguage,
    notifications,
    setNotifications,
  } = useSettings();

  const [savedToast, setSavedToast] = useState(false);
  const [testingVoice, setTestingVoice] = useState(false);
  const [locating, setLocating] = useState(false);

  const triggerToast = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleTestVoice = () => {
    setTestingVoice(true);
    if ('speechSynthesis' in window && voiceAssistant) {
      const msg = new SpeechSynthesisUtterance("नमस्कार! एग्रीमित्र वॉयस असिस्टेंट सक्रिय है।");
      msg.lang = voiceLanguage;
      window.speechSynthesis.speak(msg);
    }
    setTimeout(() => setTestingVoice(false), 3000);
  };

  const handleRefreshLocation = () => {
    setLocating(true);
    setTimeout(() => {
      setLocating(false);
      triggerToast();
    }, 1200);
  };

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    triggerToast();
  };

  return (
    <div className="flex-1 min-w-0 pb-12">
      <Navbar />

      <main className="px-6 space-y-6 max-w-5xl">
        {/* Page Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-forest-950/10 pb-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-forest-950 flex items-center gap-2">
              <SlidersHorizontal className="text-leaf-600" size={24} />
              Application Settings
            </h1>
            <p className="text-sm text-forest-950/60 mt-0.5">
              Customize theme mode, real-time location tracking, and AI voice assistant system.
            </p>
          </div>

          {savedToast && (
            <div className="flex items-center gap-2 bg-leaf-500 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-md animate-in fade-in slide-in-from-top-1">
              <CheckCircle2 size={16} />
              Settings updated successfully!
            </div>
          )}
        </div>

        {/* 1. Theme / Mode Change Section */}
        <section className="bg-white rounded-2xl border border-forest-950/10 p-6 shadow-card space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Sun size={20} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-forest-950">
                Appearance & Theme Mode
              </h2>
              <p className="text-xs text-forest-950/50">
                Select your preferred visual mode for Agrimitra copilot interface.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Light Mode */}
            <button
              onClick={() => {
                setThemeMode("light");
                triggerToast();
              }}
              className={`flex items-center gap-3 p-4 rounded-xl border transition text-left ${
                themeMode === "light"
                  ? "border-leaf-500 bg-leaf-50/50 text-forest-950 ring-2 ring-leaf-500/20"
                  : "border-forest-950/10 hover:border-forest-950/20 text-forest-950/70"
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Sun size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Light Mode</p>
                <p className="text-xs text-forest-950/40">Clean day theme</p>
              </div>
              {themeMode === "light" && (
                <CheckCircle2 size={18} className="text-leaf-600 shrink-0" />
              )}
            </button>

            {/* Dark Mode */}
            <button
              onClick={() => {
                setThemeMode("dark");
                triggerToast();
              }}
              className={`flex items-center gap-3 p-4 rounded-xl border transition text-left ${
                themeMode === "dark"
                  ? "border-leaf-500 bg-forest-950 text-white ring-2 ring-leaf-500/20"
                  : "border-forest-950/10 hover:border-forest-950/20 text-forest-950/70"
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-forest-900 text-leaf-400 flex items-center justify-center shrink-0">
                <Moon size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Dark Mode</p>
                <p className="text-xs opacity-60">High contrast night theme</p>
              </div>
              {themeMode === "dark" && (
                <CheckCircle2 size={18} className="text-leaf-400 shrink-0" />
              )}
            </button>

            {/* System Mode */}
            <button
              onClick={() => {
                setThemeMode("system");
                triggerToast();
              }}
              className={`flex items-center gap-3 p-4 rounded-xl border transition text-left ${
                themeMode === "system"
                  ? "border-leaf-500 bg-leaf-50/50 text-forest-950 ring-2 ring-leaf-500/20"
                  : "border-forest-950/10 hover:border-forest-950/20 text-forest-950/70"
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                <Laptop size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">System Auto</p>
                <p className="text-xs text-forest-950/40">Sync with device</p>
              </div>
              {themeMode === "system" && (
                <CheckCircle2 size={18} className="text-leaf-600 shrink-0" />
              )}
            </button>
          </div>
        </section>

        {/* 2. Real-Time Location System Section */}
        <section className="bg-white rounded-2xl border border-forest-950/10 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600">
                <Navigation size={20} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-forest-950 flex items-center gap-2">
                  Real-time Location System
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      realtimeLocation
                        ? "bg-leaf-100 text-leaf-700 border border-leaf-300"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {realtimeLocation ? "Active GPS" : "Disabled"}
                  </span>
                </h2>
                <p className="text-xs text-forest-950/50">
                  Automatically fetch micro-weather forecasts & soil data based on live GPS location.
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={realtimeLocation}
                onChange={(e) => {
                  setRealtimeLocation(e.target.checked);
                  triggerToast();
                }}
                className="sr-only peer"
              />
              <div className="w-12 h-6.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-leaf-500"></div>
            </label>
          </div>

          {/* Location Status Box */}
          <div className="rounded-xl border border-forest-950/10 bg-sand/40 p-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <MapPin size={18} className={realtimeLocation ? "text-leaf-600" : "text-gray-400"} />
              <div>
                <p className="text-sm font-medium text-forest-950">
                  {realtimeLocation
                    ? "Indore, Madhya Pradesh (GPS Coordinates: 22.7196° N, 75.8577° E)"
                    : "Default Fixed Location: Indore, MP"}
                </p>
                <p className="text-xs text-forest-950/50">
                  {realtimeLocation
                    ? "Live sync enabled • Auto-updating weather & pest risk radar every 15 minutes."
                    : "Enable real-time location for live hyperlocal field advisory."}
                </p>
              </div>
            </div>

            {realtimeLocation && (
              <button
                onClick={handleRefreshLocation}
                disabled={locating}
                className="flex items-center gap-1.5 text-xs font-semibold text-leaf-600 hover:text-leaf-700 bg-white border border-leaf-200 px-3 py-2 rounded-lg shadow-sm hover:bg-leaf-50 transition"
              >
                <RefreshCw size={14} className={locating ? "animate-spin" : ""} />
                {locating ? "Locating..." : "Refresh GPS"}
              </button>
            )}
          </div>
        </section>

        {/* 3. Voice Assistant System Section */}
        <section className="bg-white rounded-2xl border border-forest-950/10 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                {voiceAssistant ? <Mic size={20} /> : <MicOff size={20} />}
              </div>
              <div>
                <h2 className="text-base font-semibold text-forest-950 flex items-center gap-2">
                  Agrimitra Voice Assistant System
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      voiceAssistant
                        ? "bg-purple-100 text-purple-700 border border-purple-300"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {voiceAssistant ? "Voice ON" : "Voice Muted"}
                  </span>
                </h2>
                <p className="text-xs text-forest-950/50">
                  Speak voice queries and listen to AI audio responses in your preferred native language.
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={voiceAssistant}
                onChange={(e) => {
                  setVoiceAssistant(e.target.checked);
                  triggerToast();
                }}
                className="sr-only peer"
              />
              <div className="w-12 h-6.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Voice Assistant Config Options */}
          {voiceAssistant && (
            <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-forest-950">
                  Assistant Voice Language
                </label>
                <select
                  value={voiceLanguage}
                  onChange={(e) => {
                    setVoiceLanguage(e.target.value);
                    triggerToast();
                  }}
                  className="w-full bg-sand/30 border border-forest-950/10 rounded-xl px-3 py-2.5 text-sm text-forest-950 font-medium focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="hi-IN">Hindi (हिंदी)</option>
                  <option value="en-IN">English (India)</option>
                  <option value="mr-IN">Marathi (मराठी)</option>
                  <option value="gu-IN">Gujarati (ગુજરાતી)</option>
                  <option value="pa-IN">Punjabi (ਪੰਜਾਬੀ)</option>
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <button
                  onClick={handleTestVoice}
                  disabled={testingVoice}
                  className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm py-2.5 px-4 rounded-xl shadow-sm transition active:scale-98"
                >
                  <Volume2 size={16} className={testingVoice ? "animate-bounce" : ""} />
                  {testingVoice ? "Testing Audio Output..." : "Test Voice Assistant Audio 🔊"}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* 4. Notification & Alerts System */}
        <section className="bg-white rounded-2xl border border-forest-950/10 p-6 shadow-card space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-forest-950">
                Notification Preferences
              </h2>
              <p className="text-xs text-forest-950/50">
                Manage automated alerts for weather changes, pest warnings, and market mandi prices.
              </p>
            </div>
          </div>

          <div className="divide-y divide-forest-950/5">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-950">Severe Weather Alerts</p>
                <p className="text-xs text-forest-950/50">Instant warnings for rain, frost, or high wind.</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.weatherAlerts}
                onChange={() => toggleNotification("weatherAlerts")}
                className="w-5 h-5 accent-leaf-600 rounded cursor-pointer"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-950">Pest & Disease Outbreak Radar</p>
                <p className="text-xs text-forest-950/50">AI detection alerts when neighbor fields report pests.</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.pestWarning}
                onChange={() => toggleNotification("pestWarning")}
                className="w-5 h-5 accent-leaf-600 rounded cursor-pointer"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-950">Market Mandi Price Updates</p>
                <p className="text-xs text-forest-950/50">Daily updates on crop market rates in nearby mandis.</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.marketUpdates}
                onChange={() => toggleNotification("marketUpdates")}
                className="w-5 h-5 accent-leaf-600 rounded cursor-pointer"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-950">SMS & WhatsApp Emergency Notifications</p>
                <p className="text-xs text-forest-950/50">Receive critical field alerts offline via SMS.</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.smsAlerts}
                onChange={() => toggleNotification("smsAlerts")}
                className="w-5 h-5 accent-leaf-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
