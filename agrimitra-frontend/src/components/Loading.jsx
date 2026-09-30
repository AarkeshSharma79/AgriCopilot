export default function Loading({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-forest-950/50">
      <div className="w-8 h-8 border-2 border-leaf-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
