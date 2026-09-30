import { useState } from "react";
import Navbar from "../components/Navbar";
import {
  HelpCircle,
  Search,
  PhoneCall,
  MessageSquare,
  Mail,
  ChevronDown,
  BookOpen,
  Send,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  Sprout,
  Clock,
  ExternalLink,
} from "lucide-react";

const faqData = [
  {
    category: "🌾 Crop Monitoring & AI Advisory",
    items: [
      {
        q: "How does the AI Crop Health Scanner detect plant diseases?",
        a: "Our AI model analyzes crop leaf patterns, discoloration, and fungal markers uploaded via camera or satellite feeds to diagnose diseases with 95%+ accuracy, offering targeted organic or chemical treatments.",
      },
      {
        q: "How frequently is satellite crop health data updated?",
        a: "Satellite NDVI vegetation indices and multispectral imaging are updated every 3 to 5 days depending on cloud coverage over your specific farm coordinates.",
      },
    ],
  },
  {
    category: "🌦️ Weather & Micro-Climate Radar",
    items: [
      {
        q: "How accurate are the hyperlocal rain predictions?",
        a: "Agrimitra combines IMD weather station telemetry with AI radar data to provide block-level rain forecasts down to a 2km radius.",
      },
      {
        q: "What should I do if a frost or heatwave alert is triggered?",
        a: "When an alert is issued, check the recommended preventive measures in your Alerts tab, such as light evening irrigation to protect root zones from frost.",
      },
    ],
  },
  {
    category: "🧪 Soil Diagnostics & Fertilizers",
    items: [
      {
        q: "How do I upload or interpret NPK soil test results?",
        a: "Go to Soil Health tab, enter your Nitrogen (N), Phosphorus (P), and Potassium (K) levels, and Agrimitra will generate a customized fertilizer dosing plan.",
      },
      {
        q: "Can I connect automated IoT soil moisture sensors?",
        a: "Yes! Agrimitra integrates with popular LoRaWAN and Bluetooth soil moisture nodes under Precision Farming settings.",
      },
    ],
  },
  {
    category: "💰 Subscription & Account",
    items: [
      {
        q: "What is included in the Premium Plan?",
        a: "The Premium Plan unlocks unlimited AI query consultations, automated SMS weather alerts, multi-field satellite analytics, and priority agronomist helpline access.",
      },
      {
        q: "How can I change my registered phone number or farm location?",
        a: "You can update your personal details and location coordinates anytime under Settings > Real-time Location or Profile.",
      },
    ],
  },
];

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState({});
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "Ramesh Kumar",
    contact: "ramesh.kumar@agrimitra.org",
    category: "Crop Advisory",
    message: "",
  });

  const toggleFaq = (catIndex, itemIndex) => {
    const key = `${catIndex}-${itemIndex}`;
    setOpenFaq((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!formData.message.trim()) return;
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setFormData((prev) => ({ ...prev, message: "" }));
    }, 4000);
  };

  // Filter FAQs based on search
  const filteredFaqs = faqData
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  return (
    <div className="flex-1 min-w-0 pb-16">
      <Navbar />

      <main className="px-6 space-y-8 max-w-6xl">
        {/* Banner / Search Header */}
        <div className="relative rounded-3xl bg-gradient-to-r from-forest-950 via-forest-900 to-leaf-900 p-8 text-white shadow-xl overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-leaf-500/20 text-leaf-300 text-xs font-semibold border border-leaf-400/30">
              <Sparkles size={14} /> 24/7 Farmer Support Hub
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-bold leading-tight">
              How can we help your farm today?
            </h1>
            <p className="text-sm text-white/70">
              Search answers, browse user guides, or get direct assistance from our agricultural AI experts.
            </p>

            {/* Search Input */}
            <div className="relative mt-4">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-forest-950/40"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g. soil test, rain forecast, pest control, subscription)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-forest-950 text-sm font-medium placeholder-forest-950/40 shadow-lg focus:ring-4 focus:ring-leaf-400/50 outline-none"
              />
            </div>
          </div>

          <div className="absolute right-[-40px] bottom-[-40px] w-80 h-80 rounded-full bg-leaf-500/10 blur-3xl pointer-events-none" />
        </div>

        {/* Quick Contact Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-forest-950/10 shadow-card flex items-start gap-4 hover:border-leaf-500/30 transition">
            <div className="w-12 h-12 rounded-xl bg-leaf-500/10 text-leaf-600 flex items-center justify-center shrink-0">
              <PhoneCall size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-forest-950/50 uppercase tracking-wider">
                Kisan Helpline
              </p>
              <p className="text-sm font-bold text-forest-950 mt-0.5">1800-180-1551</p>
              <p className="text-[11px] text-leaf-600 font-medium mt-1">Toll-Free • 24x7</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-forest-950/10 shadow-card flex items-start gap-4 hover:border-leaf-500/30 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <MessageSquare size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-forest-950/50 uppercase tracking-wider">
                WhatsApp Assistant
              </p>
              <p className="text-sm font-bold text-forest-950 mt-0.5">+91 98765 43210</p>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">Instant AI Chat</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-forest-950/10 shadow-card flex items-start gap-4 hover:border-leaf-500/30 transition">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0">
              <Mail size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-forest-950/50 uppercase tracking-wider">
                Email Agronomist
              </p>
              <p className="text-sm font-bold text-forest-950 mt-0.5 truncate max-w-[140px]">
                support@agrimitra.org
              </p>
              <p className="text-[11px] text-sky-600 font-medium mt-1">Replies in &lt; 2 hrs</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-forest-950/10 shadow-card flex items-start gap-4 hover:border-leaf-500/30 transition">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <BookOpen size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-forest-950/50 uppercase tracking-wider">
                Farmer Guides
              </p>
              <p className="text-sm font-bold text-forest-950 mt-0.5">Video Tutorials</p>
              <p className="text-[11px] text-purple-600 font-medium mt-1">12 Step-by-step videos</p>
            </div>
          </div>
        </div>

        {/* Two Column Layout: FAQ + Support Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold text-forest-950 flex items-center gap-2">
                <HelpCircle className="text-leaf-600" size={22} />
                Frequently Asked Questions
              </h2>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs font-semibold text-leaf-600 hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>

            {filteredFaqs.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-forest-950/10 text-center space-y-2">
                <ShieldAlert size={36} className="mx-auto text-amber-500" />
                <p className="text-base font-semibold text-forest-950">No matching questions found</p>
                <p className="text-xs text-forest-950/50">
                  Try searching for "soil", "weather", "disease", or submit a ticket below.
                </p>
              </div>
            ) : (
              filteredFaqs.map((category, cIdx) => (
                <div
                  key={category.category}
                  className="bg-white rounded-2xl border border-forest-950/10 p-5 shadow-card space-y-3"
                >
                  <h3 className="text-sm font-bold text-forest-950 uppercase tracking-wide border-b border-forest-950/5 pb-2">
                    {category.category}
                  </h3>

                  <div className="divide-y divide-forest-950/5">
                    {category.items.map((item, iIdx) => {
                      const isOpen = !!openFaq[`${cIdx}-${iIdx}`];
                      return (
                        <div key={item.q} className="py-2.5">
                          <button
                            onClick={() => toggleFaq(cIdx, iIdx)}
                            className="w-full flex items-center justify-between text-left py-1 group"
                          >
                            <span className="text-sm font-semibold text-forest-950 group-hover:text-leaf-600 transition">
                              {item.q}
                            </span>
                            <ChevronDown
                              size={18}
                              className={`text-forest-950/40 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-leaf-600" : ""
                                }`}
                            />
                          </button>
                          {isOpen && (
                            <p className="text-xs text-forest-950/70 pt-2 pb-1 pl-1 leading-relaxed animate-in fade-in">
                              {item.a}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Column: Submit Support Ticket Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-forest-950/10 p-6 shadow-card space-y-4 sticky top-6">
              <div className="border-b border-forest-950/10 pb-3">
                <h3 className="text-base font-bold text-forest-950 flex items-center gap-2">
                  <Send size={18} className="text-leaf-600" />
                  Submit Support Ticket
                </h3>
                <p className="text-xs text-forest-950/50 mt-0.5">
                  Have a specific question about your field? Our agricultural experts will respond shortly.
                </p>
              </div>

              {ticketSubmitted ? (
                <div className="bg-leaf-50 border border-leaf-200 rounded-xl p-5 text-center space-y-2 animate-in fade-in">
                  <CheckCircle2 size={32} className="mx-auto text-leaf-600" />
                  <p className="text-sm font-bold text-forest-950">Ticket Submitted Successfully!</p>
                  <p className="text-xs text-forest-950/60">
                    Ticket ID: <span className="font-mono font-bold text-leaf-700">#AGRI-8492</span>. Our agronomist will contact you via email/phone within 2 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-semibold text-forest-950 block mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-sand/30 border border-forest-950/10 rounded-xl px-3 py-2 text-sm text-forest-950 focus:ring-2 focus:ring-leaf-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-forest-950 block mb-1">
                      Contact Email / Phone
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="w-full bg-sand/30 border border-forest-950/10 rounded-xl px-3 py-2 text-sm text-forest-950 focus:ring-2 focus:ring-leaf-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-forest-950 block mb-1">
                      Issue Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-sand/30 border border-forest-950/10 rounded-xl px-3 py-2 text-sm text-forest-950 focus:ring-2 focus:ring-leaf-500 outline-none font-medium"
                    >
                      <option value="Crop Advisory">Crop Advisory & Disease</option>
                      <option value="Weather Forecast">Weather & Radar Alert</option>
                      <option value="Soil Diagnostic">Soil Test & Fertilizer</option>
                      <option value="Billing & Subscription">Billing & Subscription</option>
                      <option value="General Feedback">General Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-forest-950 block mb-1">
                      Describe your Issue / Query
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Specify your crop type, symptoms, or question..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-sand/30 border border-forest-950/10 rounded-xl p-3 text-sm text-forest-950 focus:ring-2 focus:ring-leaf-500 outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-leaf-500 hover:bg-leaf-600 text-white text-sm font-semibold py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-98"
                  >
                    <Send size={16} />
                    Send Support Ticket
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
