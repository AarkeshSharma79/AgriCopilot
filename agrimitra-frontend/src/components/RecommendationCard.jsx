import { useState, useEffect } from "react";
import { Droplets, Sprout, AlertTriangle } from "lucide-react";
import { getRecommendations } from "../services/cropService";

const iconFor = {
  irrigation: Droplets,
  fertilizer: Sprout,
  disease: AlertTriangle,
};

export default function RecommendationCard({ recommendations: propRecs, farmId = 1 }) {
  const [recommendations, setRecommendations] = useState(propRecs || []);
  const [isLoading, setIsLoading] = useState(!propRecs);

  useEffect(() => {
    if (!propRecs) {
      setIsLoading(true);
      getRecommendations(farmId)
        .then((res) => {
          if (Array.isArray(res?.data)) {
            setRecommendations(res.data);
          }
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    } else {
      setRecommendations(propRecs);
      setIsLoading(false);
    }
  }, [farmId, propRecs]);

  return (
    <div className="card flex flex-col">
      <p className="card-title mb-4">AI Recommendations</p>

      <ul className="space-y-3 flex-1">
        {isLoading ? (
          <li className="text-xs text-forest-950/50">Loading recommendations...</li>
        ) : recommendations.length === 0 ? (
          <li className="text-xs text-forest-950/50">No new recommendations</li>
        ) : (
          recommendations.map(({ id, type, text }) => {
            const Icon = iconFor[type] || Sprout;
            return (
              <li key={id || text} className="flex items-start gap-2.5">
                <span className="mt-0.5 w-6 h-6 rounded-full bg-leaf-50 flex items-center justify-center shrink-0">
                  <Icon size={13} className="text-leaf-600" />
                </span>
                <p className="text-sm text-forest-950/70 leading-snug">{text}</p>
              </li>
            );
          })
        )}
      </ul>

      <button className="btn-secondary w-full mt-5">View All Recommendations</button>
    </div>
  );
}

