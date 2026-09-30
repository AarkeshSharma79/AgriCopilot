export const healthStatusColor = {
  good: { text: "text-leaf-600", bg: "bg-leaf-50", ring: "#3FA34D" },
  moderate: { text: "text-amber-500", bg: "bg-amber-500/10", ring: "#F0A93B" },
  attention: { text: "text-clay", bg: "bg-clay/10", ring: "#E8664B" },
};

export function severityLabel(score) {
  if (score >= 80) return "good";
  if (score >= 50) return "moderate";
  return "attention";
}

export function zoneColorClass(zone) {
  return (
    {
      high: "field-zone-high",
      medium: "field-zone-medium",
      low: "field-zone-low",
    }[zone] || "field-zone-medium"
  );
}
