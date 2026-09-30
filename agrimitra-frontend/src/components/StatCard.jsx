export default function StatCard({ icon: Icon, iconBg, iconColor, label, value, trend, link }) {
  return (
    <div className="card flex flex-col gap-3 min-w-[190px] flex-1">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon size={18} className={iconColor} />
      </div>
      <div>
        <p className="card-subtitle mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-display font-bold text-forest-950">{value || "N/A"}</p>
          {trend && (
            <span className="text-xs font-medium text-leaf-600">{trend}</span>
          )}
        </div>
      </div>
      {link && (
        <a href={link.href || "#"} className="text-xs font-medium text-forest-950/40 hover:text-leaf-600">
          {link.label}
        </a>
      )}
    </div>
  );
}
