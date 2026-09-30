import { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [themeMode, setThemeMode] = useState("light"); // 'light' | 'dark' | 'system'
  const [realtimeLocation, setRealtimeLocation] = useState(true);
  const [voiceAssistant, setVoiceAssistant] = useState(true);
  const [voiceLanguage, setVoiceLanguage] = useState("hi-IN");
  const [notifications, setNotifications] = useState({
    weatherAlerts: true,
    pestWarning: true,
    marketUpdates: false,
    smsAlerts: true,
  });

  useEffect(() => {
    if (themeMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [themeMode]);

  return (
    <SettingsContext.Provider
      value={{
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
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    return {
      themeMode: "light",
      setThemeMode: () => {},
      realtimeLocation: true,
      setRealtimeLocation: () => {},
      voiceAssistant: true,
      setVoiceAssistant: () => {},
      voiceLanguage: "hi-IN",
      setVoiceLanguage: () => {},
      notifications: { weatherAlerts: true, pestWarning: true, marketUpdates: false, smsAlerts: true },
      setNotifications: () => {},
    };
  }
  return ctx;
}
