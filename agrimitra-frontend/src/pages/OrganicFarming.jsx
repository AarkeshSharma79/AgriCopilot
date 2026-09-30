import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  Sprout,
  Leaf,
  Droplets,
  Bug,
  Shield,
  Layers,
  Sparkles,
  Calculator,
  Award,
} from "lucide-react";
import { getOrganicAdvisory } from "../services/organicService";

const iconMap = {
  vermicompost: Sprout,
  jeevamrut: Droplets,
  neemcake: Bug,
  bioinoculants: Leaf,
  greenmanure: Layers,
};

const badgeMap = {
  vermicompost: "bg-leaf-100 text-leaf-700 border-leaf-300",
  jeevamrut: "bg-amber-100 text-amber-800 border-amber-300",
  neemcake: "bg-emerald-100 text-emerald-800 border-emerald-300",
  bioinoculants: "bg-purple-100 text-purple-800 border-purple-300",
  greenmanure: "bg-sky-100 text-sky-800 border-sky-300",
};

export default function OrganicFarming() {
  const [farmSize, setFarmSize] = useState(2.5); // Acres
  const [fertilizers, setFertilizers] = useState([]);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    getOrganicAdvisory(farmSize)
      .then((res) => {
        if (res?.data) {
          if (res.data.fertilizers) setFertilizers(res.data.fertilizers);
          if (res.data.naturalPestRecipes) setRecipes(res.data.naturalPestRecipes);
        }
      })
      .catch(() => {});
  }, [farmSize]);


  return (
    <div className="flex-1 min-w-0 pb-16">
      <Navbar />

      <main className="px-6 space-y-8 max-w-6xl">
        {/* Banner Section */}
        <div className="relative rounded-3xl bg-gradient-to-r from-forest-950 via-forest-900 to-leaf-950 p-8 text-white shadow-xl overflow-hidden">
          <div className="relative z-10 space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-leaf-500/20 text-leaf-300 text-xs font-semibold border border-leaf-400/30">
              <Sparkles size={14} /> Zero-Chemical Organic Farming Hub
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-bold leading-tight">
              Organic Farming &amp; Bio-Fertilizer Advisor
            </h1>
            <p className="text-sm text-white/70">
              Eco-friendly natural alternatives for soil carbon enrichment, biological nitrogen fixation, and organic pest deterrence.
            </p>
          </div>

          <div className="absolute right-[-20px] bottom-[-20px] w-72 h-72 rounded-full bg-leaf-500/10 blur-3xl pointer-events-none" />
        </div>

        {/* Organic Dosage Calculator Bar */}
        <section className="bg-white rounded-2xl border border-forest-950/10 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-forest-950/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-leaf-500/10 text-leaf-600 flex items-center justify-center">
                <Calculator size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-forest-950">
                  Organic Bio-Fertilizer Dosage Calculator
                </h2>
                <p className="text-xs text-forest-950/50">
                  Enter your field acreage to calculate exact bio-fertilizer quantities for your crop.
                </p>
              </div>
            </div>

            {/* Farm Acreage Slider */}
            <div className="flex items-center gap-4 bg-sand/40 border border-forest-950/10 px-4 py-2.5 rounded-xl">
              <span className="text-xs font-semibold text-forest-950">Farm Size:</span>
              <input
                type="range"
                min="0.5"
                max="25"
                step="0.5"
                value={farmSize}
                onChange={(e) => setFarmSize(parseFloat(e.target.value))}
                className="w-32 accent-leaf-600 cursor-pointer"
              />
              <span className="text-sm font-bold text-leaf-700 bg-white px-2.5 py-1 rounded-lg border border-leaf-300 shadow-xs">
                {farmSize} Acres
              </span>
            </div>
          </div>

          {/* Quick Calculated Dosage Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="bg-leaf-50/60 border border-leaf-200 rounded-xl p-3 text-center">
              <p className="text-[11px] text-forest-950/60 font-medium">Vermicompost</p>
              <p className="text-base font-bold text-leaf-700 mt-0.5">
                {(farmSize * 2.5).toFixed(1)} Tons
              </p>
            </div>
            <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3 text-center">
              <p className="text-[11px] text-forest-950/60 font-medium">Jeevamrut Liquid</p>
              <p className="text-base font-bold text-amber-800 mt-0.5">
                {Math.round(farmSize * 200)} Liters
              </p>
            </div>
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 text-center">
              <p className="text-[11px] text-forest-950/60 font-medium">Neem Cake Powder</p>
              <p className="text-base font-bold text-emerald-800 mt-0.5">
                {Math.round(farmSize * 125)} kg
              </p>
            </div>
            <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-3 text-center">
              <p className="text-[11px] text-forest-950/60 font-medium">Bio-Inoculants</p>
              <p className="text-base font-bold text-purple-800 mt-0.5">
                {(farmSize * 2).toFixed(1)} kg
              </p>
            </div>
          </div>
        </section>

        {/* Bio-Fertilizer Suggestions Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-forest-950 flex items-center gap-2">
              <Leaf className="text-leaf-600" size={22} />
              Recommended Bio-Fertilizers &amp; Organics
            </h2>
            <span className="text-xs font-semibold text-forest-950/50">
              5 Natural Solutions Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(fertilizers.length > 0 ? fertilizers : [
              {
                id: "vermicompost",
                name: "Vermicompost & Earthworm Castings",
                category: "Soil Enrichment & Humus",
                npk: "1.5% N - 0.5% P - 0.8% K + Micro-nutrients",
                description: "Nutrient-rich organic manure produced by earthworms. Increases soil water retention by 30% and activates beneficial soil micro-flora.",
                calculatedQuantity: (2.5 * farmSize).toFixed(1),
                unit: "Tons",
                bestFor: "Wheat, Soybean, Cotton, Vegetables & Fruit Orchards",
              },
              {
                id: "jeevamrut",
                name: "Jeevamrut (Fermented Bio-Liquid)",
                category: "Microbial Bio-Booster",
                npk: "Bio-Culture (Azotobacter + PSB + Rhizobium)",
                description: "Traditional liquid microbial culture prepared from indigenous cow dung, cow urine, jaggery & pulse flour.",
                calculatedQuantity: Math.round(200 * farmSize),
                unit: "Liters",
                bestFor: "All Crops, Organic Soil Activation & Root Development",
              },
            ]).map((fert) => {
              const Icon = iconMap[fert.id] || Sprout;
              const badgeClass = badgeMap[fert.id] || "bg-leaf-100 text-leaf-700 border-leaf-300";
              return (
                <div
                  key={fert.id}
                  className="bg-white rounded-2xl border border-forest-950/10 p-5 shadow-card hover:shadow-lg transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-leaf-500/10 text-leaf-600 flex items-center justify-center">
                        <Icon size={20} />
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${badgeClass}`}
                      >
                        {fert.category}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-forest-950">{fert.name}</h3>
                      <p className="text-xs font-semibold text-leaf-700 mt-0.5">
                        Ratio / Culture: {fert.npk}
                      </p>
                    </div>

                    <p className="text-xs text-forest-950/70 leading-relaxed">
                      {fert.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-forest-950/5 space-y-2 text-xs">
                    <div className="flex items-center justify-between bg-sand/30 p-2 rounded-lg">
                      <span className="text-forest-950/60 font-medium">Calculated for {farmSize} Acres:</span>
                      <span className="font-bold text-leaf-700">
                        {fert.calculatedQuantity} {fert.unit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-forest-950/50 font-medium">Best Suited Crops:</span>
                      <span className="font-semibold text-forest-950 truncate max-w-[150px]">
                        {fert.bestFor}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Indigenous Bio-Pesticide Formulations Section */}
        <section className="bg-white rounded-2xl border border-forest-950/10 p-6 shadow-card space-y-4">
          <div className="flex items-center gap-3 border-b border-forest-950/10 pb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-forest-950">
                Indigenous Bio-Pesticide Formulations (Zero-Chemical Insecticides)
              </h2>
              <p className="text-xs text-forest-950/50">
                Home-made organic pest repellents using neem, cow urine, and herbal botanical extracts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(recipes.length > 0 ? recipes : [
              {
                title: "Neemastra (नीमास्त्र)",
                target: "Sucking pests (Aphids, Thrips, Jassids, Whitefly)",
                ingredients: "Desi Cow Urine (5L), Cow Dung (2kg), Neem Leaves Paste (5kg) in 100L Water.",
                preparation: "Ferment in shade for 24-48 hours. Filter and spray on affected crops.",
              },
              {
                title: "Brahmastra (ब्रह्मास्त्र)",
                target: "Pod Borers, Fruit Borers & Leaf Rollers",
                ingredients: "Neem leaves, Custard apple leaves, Papaya leaves, Dhatura leaves boiled in Cow Urine.",
                preparation: "Boil mixture, cool for 48 hours, filter. Dilute 2-3L in 100L water per acre.",
              },
            ]).map((recipe) => (
              <div
                key={recipe.title}
                className="rounded-xl border border-forest-950/10 bg-sand/30 p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-forest-950">{recipe.title}</span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full">
                    100% Organic
                  </span>
                </div>
                <p className="text-xs text-leaf-700 font-semibold">
                  Target: {recipe.target}
                </p>
                <p className="text-[11px] text-forest-950/70">
                  <strong className="text-forest-950">Ingredients:</strong> {recipe.ingredients}
                </p>
                <p className="text-[11px] text-forest-950/70">
                  <strong className="text-forest-950">Preparation:</strong> {recipe.preparation}
                </p>
              </div>
            ))}
          </div>
        </section>


        {/* Organic Transition 3-Season Roadmap */}
        <section className="bg-gradient-to-r from-forest-900 to-forest-950 rounded-2xl p-6 text-white shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <Award className="text-leaf-400" size={22} />
            <div>
              <h2 className="text-base font-bold">
                Organic Transition Roadmap (3-Season Plan)
              </h2>
              <p className="text-xs text-white/60">
                How to safely transition from chemical farming to 100% certified organic without crop yield loss.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
              <span className="bg-leaf-500 text-white font-bold px-2 py-0.5 rounded text-[10px]">
                Season 1: Soil Revival
              </span>
              <p className="font-bold text-sm text-leaf-300">Green Manure &amp; Carbon Addition</p>
              <p className="text-white/70">
                Sow Dhaincha/Sunn hemp. Reduce chemical fertilizer by 25%. Apply 2.5 Tons Vermicompost per acre before sowing.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
              <span className="bg-amber-500 text-white font-bold px-2 py-0.5 rounded text-[10px]">
                Season 2: Microbial Activation
              </span>
              <p className="font-bold text-sm text-amber-300">Jeevamrut &amp; Bio-Inoculants</p>
              <p className="text-white/70">
                Apply Jeevamrut twice a month. Treat seeds with Azotobacter &amp; PSB. Reduce chemical sprays by 60%.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
              <span className="bg-emerald-500 text-white font-bold px-2 py-0.5 rounded text-[10px]">
                Season 3: Full Organic Certification
              </span>
              <p className="font-bold text-sm text-emerald-300">Zero Chemical &amp; Premium Harvest</p>
              <p className="text-white/70">
                100% natural inputs with Neemastra &amp; Neem cake. Apply for PKVY Organic Certification to command 20-30% higher market price.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
