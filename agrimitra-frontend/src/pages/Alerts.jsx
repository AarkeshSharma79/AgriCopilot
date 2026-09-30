import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import AlertCard from "../components/AlertCard";
import { getAlerts } from "../services/alertService";

const defaultAlerts = [
  { id: 1, type: "weather", title: "Heavy rainfall expected tomorrow", meta: "Indore, MP", time: "10:30 AM" },
  { id: 2, type: "disease", title: "Early blight detected in Tomato", meta: "Farm-3", time: "09:15 AM" },
  { id: 3, type: "irrigation", title: "Irrigation scheduled tomorrow", meta: "Farm-2", time: "Yesterday" },
  { id: 4, type: "weather", title: "Wind advisory issued for the region", meta: "Indore, MP", time: "2 days ago" },
  { id: 5, type: "irrigation", title: "Water tank level below 30%", meta: "Farm-1", time: "3 days ago" },
];

export default function Alerts() {
  const [alerts, setAlerts] = useState(defaultAlerts);

  useEffect(() => {
    getAlerts()
      .then((res) => {
        if (Array.isArray(res?.data) && res.data.length > 0) {
          setAlerts(res.data);
        }
      })
      .catch(() => {
        // Fallback to defaultAlerts if API fails or offline
      });
  }, []);

  return (
    <div className="flex-1 min-w-0">
      <Navbar />
      <main className="px-6 pb-10 space-y-6">
        <div>
          <h2 className="text-lg font-display font-bold text-forest-950">Alerts &amp; Notifications</h2>
          <p className="text-sm text-forest-950/50">Stay on top of weather, irrigation, and crop health alerts.</p>
        </div>
        <div className="max-w-xl">
          <AlertCard alerts={alerts} />
        </div>
      </main>
    </div>
  );
}

