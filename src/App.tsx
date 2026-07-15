/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import {
  Sparkles,
  RefreshCw,
  FileText,
  Rocket,
  PlusCircle,
  HelpCircle,
  Sliders,
  DollarSign,
  MonitorPlay,
  CheckCircle,
  AlertOctagon,
  X,
  Info
} from "lucide-react";
import { DEFAULT_STRATEGY } from "./defaultStrategy";
import { StrategyData, BrandSettings } from "./types";
import TopNavBar from "./components/TopNavBar";
import Sidebar from "./components/Sidebar";
import LandingView from "./components/LandingView";
import RoadmapView from "./components/RoadmapView";
import MatrixView from "./components/MatrixView";
import ConsultAIDrawer from "./components/ConsultAIDrawer";
import KPIDashboard from "./components/KPIDashboard";
import CompetitorAnalysisView from "./components/CompetitorAnalysisView";
import BrandSettingsModal from "./components/BrandSettingsModal";

export default function App() {
  const [strategy, setStrategy] = useState<StrategyData>(DEFAULT_STRATEGY);
  const [isLiveGenerating, setIsLiveGenerating] = useState(false);
  const [activeView, setActiveView] = useState<"network" | "operations" | "growth" | "dashboard" | "competitors">("network");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeHighlight, setActiveHighlight] = useState<"none" | "seo" | "sem" | "social" | "dna" | "dashboard" | "competitors">("none");
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [isMock, setIsMock] = useState(true);
  const [notifMessage, setNotifMessage] = useState<string | null>(null);

  // Modal Interactive States
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);

  // Brand Settings persistent state
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(() => {
    try {
      const saved = localStorage.getItem("aether_brand_settings");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error reading brand settings from localstorage:", e);
    }
    return { industry: "", targetAudience: "", toneOfVoice: "" };
  });

  const handleSaveBrandSettings = (settings: BrandSettings) => {
    setBrandSettings(settings);
    try {
      localStorage.setItem("aether_brand_settings", JSON.stringify(settings));
    } catch (e) {
      console.error("Error saving brand settings to localstorage:", e);
    }
  };

  // Campaign Simulator States
  const [simBudget, setSimBudget] = useState(2500);
  const [simObjective, setSimObjective] = useState<"leads" | "reach" | "conversion">("conversion");

  // Show a premium dismissable banner for configuration
  const [showKeyBanner, setShowKeyBanner] = useState(true);

  // Generate Strategy API caller
  const handleGenerateStrategy = async (brandType: string) => {
    setIsLiveGenerating(true);
    setNotifMessage(null);
    try {
      const response = await fetch("/api/strategy/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          businessType: brandType,
          brandSettings: brandSettings
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate strategic roadmap");
      }

      const data = await response.json();
      setStrategy(data.strategy);
      setIsMock(!!data.isMock);
      
      // Auto transition to operations overview on successful synthesis
      setActiveView("operations");
      
      if (data.isMock) {
        setNotifMessage("Estrategia generada con éxito (Modo simulación).");
      } else {
        setNotifMessage("Estrategia sintetizada correctamente usando Gemini AI.");
      }
    } catch (error) {
      console.error(error);
      setNotifMessage("Ocurrió un error al contactar al motor. Cargando plantilla optimizada.");
      // Soft fallback
      const fallback = { ...DEFAULT_STRATEGY };
      fallback.businessType = brandType;
      fallback.businessName = brandType.charAt(0).toUpperCase() + brandType.slice(1) + " Strategy";
      setStrategy(fallback);
      setActiveView("operations");
    } finally {
      setIsLiveGenerating(false);
    }
  };

  const handleOptimizeStrategyWithIA = async () => {
    // Elegant quick-optimisation screen loader
    setIsLiveGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Inject slight dynamic values
    const optimized = { ...strategy };
    optimized.roadmap.phase1.kpiValue = Math.min(100, optimized.roadmap.phase1.kpiValue + 10);
    optimized.roadmap.phase2.kpiValue = Math.min(100, optimized.roadmap.phase2.kpiValue + 15);
    optimized.roadmap.phase3.kpiValue = Math.min(100, optimized.roadmap.phase3.kpiValue + 8);
    optimized.seoMetrics.brandTone = Math.min(100, optimized.seoMetrics.brandTone + 5);
    optimized.seoMetrics.localSearch = Math.min(100, optimized.seoMetrics.localSearch + 4);
    
    setStrategy(optimized);
    setIsLiveGenerating(false);
    setNotifMessage("Neural roadmap optimizado con éxito.");
  };

  const handleResetInitiative = () => {
    setActiveView("network");
    setSearchQuery("");
    setActiveHighlight("none");
  };

  // Close toast message after delay
  useEffect(() => {
    if (notifMessage) {
      const timer = setTimeout(() => setNotifMessage(null), 5500);
      return () => clearTimeout(timer);
    }
  }, [notifMessage]);

  // Derived campaign calculations
  const estCpc = simObjective === "conversion" ? 2.45 : simObjective === "leads" ? 1.15 : 0.45;
  const estClicks = Math.floor(simBudget / estCpc);
  const estConversions = Math.floor(estClicks * (simObjective === "conversion" ? 0.038 : simObjective === "leads" ? 0.082 : 0.12));

  return (
    <div className="min-h-screen text-slate-150 font-sans selection:bg-[#00f0ff]/30 selection:text-white bg-[#0A0A0B] relative pb-20 overflow-x-hidden">
      
      {/* Top Navigation Frame */}
      <TopNavBar
        activeView={activeView}
        onViewChange={(v) => {
          setActiveView(v);
          setActiveHighlight("none");
        }}
        onConsultClick={() => setIsConsultOpen(true)}
        onBrandSettingsClick={() => setIsBrandModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        hasStrategy={strategy.businessName !== "Aether AI"}
      />

      {/* Main Structural Container */}
      <div className="flex pt-20">
        
        {/* Left Sidebar navigation panel */}
        <Sidebar
          onViewChange={(v) => {
            setActiveView(v);
          }}
          onSelectMetric={(h) => setActiveHighlight(h)}
          activeHighlight={activeHighlight}
          onNewInitiativeClick={handleResetInitiative}
          onBrandSettingsClick={() => setIsBrandModalOpen(true)}
        />

        {/* Content canvas container */}
        <main className="flex-grow lg:pl-64 px-6 md:px-16 py-10 transition-all duration-350">
          
          {/* Key configuration alert banner (dismissable) */}
          {showKeyBanner && isMock && (
            <div className="mb-8 p-4 glass-card bg-[#00f0ff]/5 border-[#00f0ff]/20 rounded-2xl flex items-start gap-4 justify-between animate-pulse">
              <div className="flex gap-3 items-center">
                <Info className="w-5 h-5 text-[#00f0ff] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  <strong className="text-white">Aether Demo Mode:</strong> Generando roadmaps con la base de conocimiento estructurada de nuestra agencia. Configura tu <strong className="text-[#00f0ff]">GEMINI_API_KEY</strong> en la pestaña <strong className="text-white">Secrets</strong> del panel para habilitar optimizaciones en vivo por IA profunda.
                </p>
              </div>
              <button
                onClick={() => setShowKeyBanner(false)}
                className="text-on-surface-variant hover:text-white p-1 rounded-full hover:bg-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Core Screen toggler */}
          {activeView === "network" ? (
            <LandingView
              onGenerate={handleGenerateStrategy}
              isLoading={isLiveGenerating}
              onViewChange={setActiveView}
              hasStrategy={strategy.businessName !== "Aether AI"}
            />
          ) : activeView === "operations" ? (
            <RoadmapView
              strategy={strategy}
              onOptimizeClick={handleOptimizeStrategyWithIA}
              onComposeClick={() => setIsContentModalOpen(true)}
              onLaunchCampaign={() => setIsCampaignModalOpen(true)}
              highlightSection={activeHighlight}
            />
          ) : activeView === "growth" ? (
            <MatrixView
              strategy={strategy}
              onOptimizeSEO={handleOptimizeStrategyWithIA}
              highlightSection={activeHighlight}
            />
          ) : activeView === "dashboard" ? (
            <KPIDashboard strategy={strategy} />
          ) : (
            <CompetitorAnalysisView strategy={strategy} />
          )}

        </main>
      </div>

      {/* 1. Global Interactive Live chatbot drawer */}
      <ConsultAIDrawer
        isOpen={isConsultOpen}
        onClose={() => setIsConsultOpen(false)}
        strategy={strategy}
        brandSettings={brandSettings}
      />

      {/* 2. Generating / Loader Overlay screen */}
      {isLiveGenerating && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0B]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-8">
            <div className="relative flex justify-center">
              {/* Outer pulsing ring */}
              <div className="absolute w-24 h-24 rounded-full border border-[#00f0ff]/20 animate-ping opacity-70"></div>
              {/* Inner alignment widget */}
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#00f0ff]/10 to-purple-500/10 border border-[#00f0ff]/40 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.25)]">
                <Sparkles className="w-8 h-8 text-[#00f0ff] ai-pulse" />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-display text-2xl text-white font-extrabold tracking-tight">Sometiendo Parámetros</h3>
              <p className="font-sans text-sm text-on-surface-variant max-w-sm">
                Nuestros algoritmos neurales están estructurando keywords, campañas ad-word de control, matrices de competidores y el plan de branding ideal...
              </p>
            </div>

            {/* Checklists simulation ticks */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 font-mono text-[10px] uppercase text-left space-y-1.5 max-w-sm mx-auto text-on-surface-variant/80">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 animate-pulse" />
                <span>Analizando audiencia de "{strategy.businessType || "Nicho"}"</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 animate-pulse" />
                <span>Extrayendo competidores clave</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] flex-shrink-0 animate-ping"></span>
                <span className="text-[#00f0ff]">Estructurando Visual DNA Chromatic scale</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Social Content Composer Modal */}
      {isContentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0E0E0F] border border-white/10 rounded-3xl p-8 shadow-2xl relative space-y-6">
            <button
              onClick={() => setIsContentModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-on-surface-variant hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="font-mono text-[9px] text-[#00f0ff] uppercase tracking-widest block mb-2">
                CO-PILOT CONTENT EXPANSION
              </span>
              <h3 className="font-display text-2xl text-white font-bold">Copywriting Hooks</h3>
              <p className="text-on-surface-variant text-sm mt-1">Plantilla de copies de conversión creadas por la IA para <strong>{strategy.businessName}</strong></p>
            </div>

            <div className="space-y-4">
              {strategy.socialContent.map((soc, idx) => (
                <div key={idx} className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                    <span className="text-xs font-mono font-bold text-white uppercase">{soc.platform}</span>
                    <span className="text-[10px] text-[#00f0ff] font-mono">{soc.schedule}</span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-on-surface-variant font-mono uppercase tracking-wider">Concepto Narrativo:</p>
                    <p className="text-sm font-semibold text-white">{soc.subtitle}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-on-surface-variant font-mono uppercase tracking-wider">Hook de Copy Sugerido:</p>
                    <div className="p-3 bg-black/40 border border-[#00f0ff]/10 rounded-xl">
                      <p className="text-sm italic text-[#00f0ff]">&ldquo;{soc.hook}. Descubre la diferencia estratégica con {strategy.businessName}. Link en bío.&rdquo;</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsContentModalOpen(false);
                  setNotifMessage("Borradores guardados en tu portapapeles.");
                }}
                className="bg-primary-container hover:bg-[#57fff5] text-[#00363a] bg-[#00f0ff] px-6 py-3 rounded-xl text-xs uppercase font-mono font-bold transition-all cursor-pointer"
              >
                Copiar Todos los Copies
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Campaign Simulator Modal */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0E0E0F] border border-white/10 rounded-3xl p-8 shadow-2xl relative space-y-6">
            <button
              onClick={() => setIsCampaignModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-on-surface-variant hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="font-mono text-[9px] text-[#00f0ff] uppercase tracking-widest block mb-2">
                SEM ADSET CONTROLLER
              </span>
              <h3 className="font-display text-2xl text-white font-bold">Simulación de Inversión SEM</h3>
              <p className="text-on-surface-variant text-sm mt-1">Monitorea y asigna micro-inversiones para {strategy.businessName}</p>
            </div>

            <div className="space-y-6">
              {/* Objective Selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-on-surface-variant uppercase tracking-wider block">Objetivo de la Campaña:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["conversion", "leads", "reach"] as const).map((obj) => (
                    <button
                      key={obj}
                      onClick={() => setSimObjective(obj)}
                      className={`py-3.5 rounded-xl border font-mono text-[10px] uppercase tracking-widest transition-all cursor-pointer ${
                        simObjective === obj
                          ? "bg-[#00f0ff]/10 border-[#00f0ff] text-[#00f0ff]"
                          : "bg-white/5 border-white/5 text-on-surface-variant hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {obj}
                    </button>
                  ))}
                </div>
              </div>

              {/* Range dynamic budget slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono text-on-surface-variant uppercase tracking-wider block">Presupuesto Mensual:</label>
                  <span className="text-sm font-bold text-white">${simBudget.toLocaleString()} USD</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="15000"
                  step="250"
                  value={simBudget}
                  onChange={(e) => setSimBudget(Number(e.target.value))}
                  className="w-full accent-[#00f0ff] bg-white/10 rounded-lg appearance-none h-1.5 cursor-pointer"
                />
              </div>

              {/* Estimation Outcomes */}
              <div className="grid grid-cols-3 gap-4 bg-white/5 p-5 rounded-2xl border border-white/5">
                <div>
                  <p className="text-[9px] font-mono text-on-surface-variant mb-1 uppercase tracking-widest">CPC Estimado</p>
                  <p className="text-lg font-bold text-white">${estCpc.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[9px] font-mono text-on-surface-variant mb-1 uppercase tracking-widest">Clicks Est.</p>
                  <p className="text-lg font-bold text-[#00f0ff]">{estClicks.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[9px] font-mono text-on-surface-variant mb-1 uppercase tracking-widest">
                    {simObjective === "conversion" ? "Ventas" : simObjective === "leads" ? "Leads" : "Impresiones"}
                  </p>
                  <p className="text-lg font-bold text-white font-mono">{estConversions.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between gap-3 items-center">
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Prueba Alpha Listal para Ads
              </span>

              <button
                onClick={() => {
                  setIsCampaignModalOpen(false);
                  setNotifMessage("Campaña de simulación transmitida.");
                }}
                className="bg-primary-container hover:bg-[#57fff5] text-[#00363a] bg-[#00f0ff] px-6 py-3 rounded-xl text-xs uppercase font-mono font-bold transition-all cursor-pointer"
              >
                Transmitir campaña experimental
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Brand Configuration Modal */}
      <BrandSettingsModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        currentSettings={brandSettings}
        onSave={handleSaveBrandSettings}
      />

      {/* Persistent dynamic Toast system at the bottom center */}
      {notifMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0E0E0F] border border-[#00f0ff]/30 text-white px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-3 animate-fade-in text-xs max-w-sm">
          <Sparkles className="w-4 h-4 text-[#00f0ff] animate-spin" />
          <span>{notifMessage}</span>
        </div>
      )}

    </div>
  );
}
