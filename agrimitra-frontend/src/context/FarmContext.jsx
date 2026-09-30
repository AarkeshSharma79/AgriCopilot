import { createContext, useContext, useState, useEffect } from "react";
import { getFarms } from "../services/farmService";

const FarmContext = createContext(null);

const initialFarms = [
  { id: 1, name: "Farm 1", crop: "Wheat", health: "good", zone: "high" },
  { id: 2, name: "Farm 2", crop: "Soybean", health: "moderate", zone: "medium" },
  { id: 3, name: "Farm 3", crop: "Tomato", health: "attention", zone: "low" },
  { id: 4, name: "Farm 4", crop: "Rice", health: "good", zone: "high" },
];

export function FarmProvider({ children }) {
  const [farms, setFarms] = useState(initialFarms);
  const [activeFarmId, setActiveFarmId] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem("agrimitra_token");
    if (token) {
      getFarms()
        .then((res) => {
          if (Array.isArray(res?.data) && res.data.length > 0) {
            const mapped = res.data.map((f, i) => ({
              id: f._id || i + 1,
              name: f.name || `Farm ${i + 1}`,
              crop: f.currentCrop?.name || "Wheat",
              health: "good",
              zone: "high",
            }));
            setFarms(mapped);
            setActiveFarmId(mapped[0].id);
          }
        })
        .catch(() => {
          // Keep default farms on fallback
        });
    }
  }, []);

  const activeFarm = farms.find((f) => f.id === activeFarmId) || farms[0];

  return (
    <FarmContext.Provider
      value={{ farms, setFarms, activeFarmId, setActiveFarmId, activeFarm }}
    >
      {children}
    </FarmContext.Provider>
  );
}

export function useFarmContext() {
  const ctx = useContext(FarmContext);
  if (!ctx) throw new Error("useFarmContext must be used within a FarmProvider");
  return ctx;
}

