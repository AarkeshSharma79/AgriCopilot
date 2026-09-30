import { useState } from "react";
import { Check } from "lucide-react";

const steps = ["Upload Image", "AI Analysis", "Results"];

export default function CropMonitoringPanel({ image, result }) {
  const [activeStep] = useState(image && result ? 2 : (image ? 1 : 0));
  const detection = result;

  return (
    <div className="card">
      <p className="card-title">Crop Monitoring</p>
      <p className="card-subtitle mb-4">AI-powered crop disease detection</p>

      <div className="flex items-center gap-2 mb-5">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <span
              className={`w-5 h-5 rounded-full text-[10px] font-semibold flex items-center justify-center shrink-0 ${
                i <= activeStep ? "bg-leaf-500 text-white" : "bg-forest-950/10 text-forest-950/40"
              }`}
            >
              {i < activeStep ? <Check size={11} /> : i + 1}
            </span>
            <span
              className={`text-xs ${i === activeStep ? "text-forest-950 font-medium" : "text-forest-950/40"}`}
            >
              {label}
            </span>
            {i < steps.length - 1 && <span className="flex-1 h-px bg-forest-950/10" />}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="rounded-xl overflow-hidden bg-forest-950/5 aspect-[4/3]">
          <img
            src={image || "/images/sample-leaf.jpg"}
            alt="Uploaded crop leaf"
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.style.opacity = 0)}
          />
        </div>

        <div>
          {detection ? (
            <>
              <p className="text-xs font-medium text-forest-950/50 mb-2">Detection Result</p>
              <div className="rounded-xl bg-clay/5 border border-clay/20 p-3 mb-3">
                <p className="text-sm font-semibold text-forest-950">{detection.disease}</p>
                <p className="text-xs text-forest-950/50">{detection.crop}</p>
              </div>

              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-forest-950/50">Confidence</span>
                <span className="font-medium text-forest-950">{detection.confidence}%</span>
              </div>
              <div className="flex items-center justify-between text-xs mb-4">
                <span className="text-forest-950/50">Severity</span>
                <span className="pill bg-amber-500/10 text-amber-600">{detection.severity}</span>
              </div>

              <p className="text-xs font-medium text-forest-950/50 mb-2">Recommended Treatment</p>
              <ul className="space-y-1.5">
                {detection.treatments?.map((t) => (
                  <li key={t} className="flex items-start gap-1.5 text-xs text-forest-950/70">
                    <Check size={12} className="text-leaf-600 mt-0.5 shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-6 text-center">
              <p className="text-sm text-forest-950/50 mb-2">Upload an image to start AI analysis</p>
              <p className="text-xs text-forest-950/40">Our model detects 100+ crop diseases instantly.</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <button className="btn-secondary flex-1">Upload Another Image</button>
        <button className="btn-primary flex-1">View Full Solution</button>
      </div>
    </div>
  );
}
