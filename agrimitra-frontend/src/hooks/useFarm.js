import { useFarmContext } from "../context/FarmContext";

export function useFarm() {
  const { farms, activeFarm, activeFarmId, setActiveFarmId } = useFarmContext();

  const totalFarms = farms.length;
  const alertCount = farms.filter((f) => f.health === "attention").length;

  return { farms, activeFarm, activeFarmId, setActiveFarmId, totalFarms, alertCount };
}
