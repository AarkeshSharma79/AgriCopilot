import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import CropMonitoringPanel from "../components/CropMonitoringPanel";
import { analyzeCropImage } from "../services/cropService";

export default function CropMonitoring() {
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setAnalyzing(true);

    try {
      const res = await analyzeCropImage(file);
      if (res?.data) {
        setResult(res.data);
      }
    } catch {
      // Fallback stays in panel if error
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 min-w-0">
      <Navbar />
      <main className="px-6 pb-10 space-y-6">
        <div>
          <h2 className="text-lg font-display font-bold text-forest-950">Crop Monitoring</h2>
          <p className="text-sm text-forest-950/50">
            Upload a photo of a crop leaf to detect disease and get treatment guidance.
          </p>
        </div>

        <div className="card max-w-xl">
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-leaf-500/40 rounded-xl py-10 cursor-pointer hover:bg-leaf-50/50 transition-colors">
            {analyzing ? (
              <Loader2 size={24} className="text-leaf-600 animate-spin" />
            ) : (
              <Upload size={22} className="text-leaf-600" />
            )}
            <span className="text-sm font-medium text-forest-950">
              {analyzing ? "Analyzing Crop Leaf with AI..." : "Tap to upload crop image"}
            </span>
            <span className="text-xs text-forest-950/40">JPG, PNG (Max 8MB)</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </label>
        </div>

        <CropMonitoringPanel image={preview} result={result} />
      </main>
    </div>
  );
}

