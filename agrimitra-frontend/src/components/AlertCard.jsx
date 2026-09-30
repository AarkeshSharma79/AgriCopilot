import { useState, useEffect } from "react";
import { CloudRain, AlertTriangle, Droplets } from "lucide-react";
import { getAlerts } from "../services/alertService";

const iconFor = {
  weather: CloudRain,
  disease: AlertTriangle,
  irrigation: Droplets,
};

const colorFor = {
  weather: "bg-sky-500/10 text-sky-500",
  disease: "bg-clay/10 text-clay",
  irrigation: "bg-sky-500/10 text-sky-500",
};

export default function AlertCard({ alerts: propAlerts }) {
  const [alerts, setAlerts] = useState(propAlerts || []);
  const [isLoading, setIsLoading] = useState(!propAlerts);

  useEffect(() => {
    if (propAlerts) {
      setAlerts(propAlerts);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      getAlerts()
        .then((res) => {
          if (Array.isArray(res?.data)) {
            setAlerts(res.data);
          }
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [propAlerts]);

  return (
    <div className="card flex flex-col">
      <p className="card-title mb-4">Recent Alerts</p>

      <ul className="space-y-3 flex-1">
        {isLoading ? (
          <li className="text-xs text-forest-950/50">Loading alerts...</li>
        ) : alerts.length === 0 ? (
          <li className="text-xs text-forest-950/50">No active alerts</li>
        ) : (
          alerts.map(({ id, type, title, meta, time }) => {
            const Icon = iconFor[type] || AlertTriangle;
            const colorClass = colorFor[type] || "bg-amber-500/10 text-amber-500";
            return (
              <li key={id || title} className="flex items-start gap-2.5">
                <span className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
                  <Icon size={14} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-forest-950/80 leading-snug">{title}</p>
                  <p className="text-[11px] text-forest-950/35">
                    {meta} &middot; {time}
                  </p>
                </div>
              </li>
            );
          })
        )}
      </ul>

      <button className="btn-secondary w-full mt-5">View All Alerts</button>
    </div>
  );
}

