import { Sun, Cloud, CloudRain, CloudSun } from "lucide-react";

export function weatherIconFor(condition = "") {
  const c = condition.toLowerCase();
  if (c.includes("rain")) return CloudRain;
  if (c.includes("partly")) return CloudSun;
  if (c.includes("cloud")) return Cloud;
  return Sun;
}

export function celsius(value) {
  return `${Math.round(value)}\u00B0C`;
}
