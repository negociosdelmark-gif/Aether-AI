/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award, 
  Zap, 
  Activity, 
  Sparkles, 
  Clock, 
  ArrowUpRight, 
  Sliders, 
  Eye, 
  Settings, 
  AlertCircle, 
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { StrategyData } from "../types";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ReferenceLine,
  BarChart,
  Bar
} from "recharts";

interface KPIDashboardProps {
  strategy: StrategyData;
}

export default function KPIDashboard({ strategy }: KPIDashboardProps) {
  const { roadmap } = strategy;

  // Active time interval for visualization
  const [timeframe, setTimeframe] = useState<"30days" | "6months">("6months");
  // Active metric highlighted in the detailed area chart
  const [selectedMetric, setSelectedMetric] = useState<"all" | "f1" | "f2" | "f3">("all");

  // Simulation parameters (defaulting to 100% or base value)
  const [seoIntensity, setSeoIntensity] = useState<number>(100); // impacts F1 KPI
  const [marketingSpend, setMarketingSpend] = useState<number>(100); // impacts F2 KPI
  const [croEfficiency, setCroEfficiency] = useState<number>(100); // impacts F3 KPI

  // Tab selector for the simulation/alert configuration sidebar
  const [sidebarTab, setSidebarTab] = useState<"simulator" | "alerts">("simulator");

  // Read alert thresholds from localStorage if they exist, else default to 60% of the projected objectives
  const [thresholds, setThresholds] = useState(() => {
    return {
      phase1: Math.round(roadmap.phase1.kpiValue * 0.6),
      phase2: Math.round(roadmap.phase2.kpiValue * 0.6),
      phase3: Math.round(roadmap.phase3.kpiValue * 0.6)
    };
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`strategy_thresholds_${strategy.businessName || "default"}`);
      if (saved) {
        setThresholds(JSON.parse(saved));
      } else {
        setThresholds({
          phase1: Math.round(roadmap.phase1.kpiValue * 0.6),
          phase2: Math.round(roadmap.phase2.kpiValue * 0.6),
          phase3: Math.round(roadmap.phase3.kpiValue * 0.6)
        });
      }
    } catch (e) {
      console.error("Error reading thresholds from localStorage in dashboard", e);
    }
  }, [strategy.businessName, roadmap]);

  const handleThresholdChange = (key: "phase1" | "phase2" | "phase3", value: number) => {
    const updated = { ...thresholds, [key]: value };
    setThresholds(updated);
    try {
      localStorage.setItem(`strategy_thresholds_${strategy.businessName || "default"}`, JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving thresholds to localStorage", e);
    }
  };

  const resetThresholdsTo60Percent = () => {
    const reset = {
      phase1: Math.round(roadmap.phase1.kpiValue * 0.6),
      phase2: Math.round(roadmap.phase2.kpiValue * 0.6),
      phase3: Math.round(roadmap.phase3.kpiValue * 0.6)
    };
    setThresholds(reset);
    try {
      localStorage.setItem(`strategy_thresholds_${strategy.businessName || "default"}`, JSON.stringify(reset));
    } catch (e) {
      console.error("Error saving thresholds to localStorage", e);
    }
  };

  // Generate dynamic 6-month time-series data based on strategy KPIs and simulation sliders
  const getSimulatedData = () => {
    const p1Base = roadmap.phase1.kpiValue;
    const p2Base = roadmap.phase2.kpiValue;
    const p3Base = roadmap.phase3.kpiValue;

    // Simulation multiplier effects
    const seoMult = seoIntensity / 100;
    const mktMult = marketingSpend / 100;
    const croMult = croEfficiency / 100;

    if (timeframe === "6months") {
      return [
        {
          name: "Mes 1",
          day: "Día 30",
          "Neural Alignment": Math.round(Math.min(100, 15 + (p1Base - 15) * 0.6 * seoMult)),
          "Velocity Multiplier": Math.round(Math.min(100, 5 + (p2Base - 5) * 0.15 * mktMult)),
          "Cognitive Dominance": Math.round(Math.min(100, 2 + (p3Base - 2) * 0.05 * croMult)),
        },
        {
          name: "Mes 2",
          day: "Día 60",
          "Neural Alignment": Math.round(Math.min(100, 15 + (p1Base - 15) * 0.95 * seoMult)),
          "Velocity Multiplier": Math.round(Math.min(100, 5 + (p2Base - 5) * 0.4 * mktMult)),
          "Cognitive Dominance": Math.round(Math.min(100, 2 + (p3Base - 2) * 0.15 * croMult)),
        },
        {
          name: "Mes 3",
          day: "Día 90",
          "Neural Alignment": Math.round(Math.min(100, p1Base * 1.02 * seoMult)),
          "Velocity Multiplier": Math.round(Math.min(100, 5 + (p2Base - 5) * 0.75 * mktMult)),
          "Cognitive Dominance": Math.round(Math.min(100, 2 + (p3Base - 2) * 0.45 * croMult)),
        },
        {
          name: "Mes 4",
          day: "Día 120",
          "Neural Alignment": Math.round(Math.min(100, p1Base * 1.05 * seoMult)),
          "Velocity Multiplier": Math.round(Math.min(100, p2Base * 0.98 * mktMult)),
          "Cognitive Dominance": Math.round(Math.min(100, 2 + (p3Base - 2) * 0.75 * croMult)),
        },
        {
          name: "Mes 5",
          day: "Día 150",
          "Neural Alignment": Math.round(Math.min(100, p1Base * 1.07 * seoMult)),
          "Velocity Multiplier": Math.round(Math.min(100, p2Base * 1.04 * mktMult)),
          "Cognitive Dominance": Math.round(Math.min(100, p3Base * 0.95 * croMult)),
        },
        {
          name: "Mes 6",
          day: "Día 180",
          "Neural Alignment": Math.round(Math.min(100, p1Base * 1.1 * seoMult)),
          "Velocity Multiplier": Math.round(Math.min(100, p2Base * 1.08 * mktMult)),
          "Cognitive Dominance": Math.round(Math.min(100, p3Base * 1.05 * croMult)),
        }
      ];
    } else {
      // 30 days view (broken down into 4 weeks)
      return [
        {
          name: "Seman. 1",
          day: "Día 7",
          "Neural Alignment": Math.round(Math.min(100, 15 + (p1Base - 15) * 0.15 * seoMult)),
          "Velocity Multiplier": Math.round(Math.min(100, 5 + (p2Base - 5) * 0.03 * mktMult)),
          "Cognitive Dominance": Math.round(Math.min(100, 2 + (p3Base - 2) * 0.01 * croMult)),
        },
        {
          name: "Seman. 2",
          day: "Día 14",
          "Neural Alignment": Math.round(Math.min(100, 15 + (p1Base - 15) * 0.35 * seoMult)),
          "Velocity Multiplier": Math.round(Math.min(100, 5 + (p2Base - 5) * 0.08 * mktMult)),
          "Cognitive Dominance": Math.round(Math.min(100, 2 + (p3Base - 2) * 0.02 * croMult)),
        },
        {
          name: "Seman. 3",
          day: "Día 21",
          "Neural Alignment": Math.round(Math.min(100, 15 + (p1Base - 15) * 0.55 * seoMult)),
          "Velocity Multiplier": Math.round(Math.min(100, 5 + (p2Base - 5) * 0.12 * mktMult)),
          "Cognitive Dominance": Math.round(Math.min(100, 2 + (p3Base - 2) * 0.04 * croMult)),
        },
        {
          name: "Seman. 4",
          day: "Día 30",
          "Neural Alignment": Math.round(Math.min(100, 15 + (p1Base - 15) * 0.75 * seoMult)),
          "Velocity Multiplier": Math.round(Math.min(100, 5 + (p2Base - 5) * 0.18 * mktMult)),
          "Cognitive Dominance": Math.round(Math.min(100, 2 + (p3Base - 2) * 0.06 * croMult)),
        }
      ];
    }
  };

  const currentData = getSimulatedData();

  // Get current endpoint values (Month 6 or Week 4 values)
  const lastPoint = currentData[currentData.length - 1];
  const simValF1 = lastPoint["Neural Alignment"];
  const simValF2 = lastPoint["Velocity Multiplier"];
  const simValF3 = lastPoint["Cognitive Dominance"];

  // Base configurations for UI cards
  const kpiCards = [
    {
      id: "f1",
      phaseName: "Fase 1: Neural Alignment",
      kpiName: roadmap.phase1.kpiName,
      target: roadmap.phase1.kpiValue,
      simulated: simValF1,
      color: "#00f0ff",
      gradient: "from-[#00f0ff]/20 to-transparent",
      textClass: "text-[#00f0ff]",
      borderClass: "border-[#00f0ff]/20",
      bgClass: "bg-[#00f0ff]/5",
      threshold: thresholds.phase1,
      isAlert: simValF1 < thresholds.phase1,
      description: "Construcción del índice de búsqueda inicial e indexación SEO.",
      trend: seoIntensity > 100 ? "up" : seoIntensity < 100 ? "down" : "flat",
      change: seoIntensity - 100
    },
    {
      id: "f2",
      phaseName: "Fase 2: Velocity Multiplier",
      kpiName: roadmap.phase2.kpiName,
      target: roadmap.phase2.kpiValue,
      simulated: simValF2,
      color: "#a855f7",
      gradient: "from-[#a855f7]/20 to-transparent",
      textClass: "text-[#a855f7]",
      borderClass: "border-[#a855f7]/20",
      bgClass: "bg-[#a855f7]/5",
      threshold: thresholds.phase2,
      isAlert: simValF2 < thresholds.phase2,
      description: "Escalamiento mediante campañas SEM pagadas y leads automatizados.",
      trend: marketingSpend > 100 ? "up" : marketingSpend < 100 ? "down" : "flat",
      change: marketingSpend - 100
    },
    {
      id: "f3",
      phaseName: "Fase 3: Cognitive Dominance",
      kpiName: roadmap.phase3.kpiName,
      target: roadmap.phase3.kpiValue,
      simulated: simValF3,
      color: "#f43f5e",
      gradient: "from-[#f43f5e]/20 to-transparent",
      textClass: "text-[#f43f5e]",
      borderClass: "border-[#f43f5e]/20",
      bgClass: "bg-[#f43f5e]/5",
      threshold: thresholds.phase3,
      isAlert: simValF3 < thresholds.phase3,
      description: "Tasa de conversión final y retención de clientes automatizada.",
      trend: croEfficiency > 100 ? "up" : croEfficiency < 100 ? "down" : "flat",
      change: croEfficiency - 100
    }
  ];

  // Custom Recharts Tooltip styled perfectly with modern glassmorphism
  interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0c131f]/95 border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-md min-w-[200px]">
          <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-2 font-bold">
            {label} ({timeframe === "6months" ? "Previsión" : "Semana"})
          </p>
          <div className="space-y-2">
            {payload.map((item: any, idx: number) => {
              const kpiCard = kpiCards.find(c => {
                if (item.name === "Neural Alignment" && c.id === "f1") return true;
                if (item.name === "Velocity Multiplier" && c.id === "f2") return true;
                if (item.name === "Cognitive Dominance" && c.id === "f3") return true;
                return false;
              });

              const isUnder = item.value < (kpiCard ? kpiCard.threshold : 30);

              return (
                <div key={idx} className="flex flex-col gap-0.5">
                  <div className="flex items-center justify-between gap-6">
                    <span className="text-[11px] text-slate-300 font-sans flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      {kpiCard ? kpiCard.kpiName : item.name}
                    </span>
                    <span className="font-mono text-xs text-white font-bold">{item.value}%</span>
                  </div>
                  <div className="flex justify-between text-[9px] font-mono pl-3.5">
                    <span className="text-on-surface-variant/70">Umbral: {kpiCard ? kpiCard.threshold : 30}%</span>
                    {isUnder ? (
                      <span className="text-red-400 font-bold uppercase">Bajo Umbral</span>
                    ) : (
                      <span className="text-emerald-400 font-medium">OK</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  const activeAlerts = kpiCards.filter(c => c.isAlert);

  const RenderCustomDot = (props: any) => {
    const { cx, cy, stroke, value, dataKey } = props;
    if (!cx || !cy) return null;

    let isUnderThreshold = false;
    if (dataKey === "Neural Alignment" && value < thresholds.phase1) isUnderThreshold = true;
    if (dataKey === "Velocity Multiplier" && value < thresholds.phase2) isUnderThreshold = true;
    if (dataKey === "Cognitive Dominance" && value < thresholds.phase3) isUnderThreshold = true;

    if (isUnderThreshold) {
      return (
        <svg 
          x={cx - 8} 
          y={cy - 8} 
          width={16} 
          height={16} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#f43f5e" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="animate-pulse"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" fill="rgba(244,63,94,0.4)" />
          <line x1="12" y1="9" x2="12" y2="13" stroke="#f43f5e" strokeWidth="3" />
          <line x1="12" y1="17" x2="12.01" y2="17" stroke="#f43f5e" strokeWidth="3" />
        </svg>
      );
    }

    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={4} 
        fill={stroke} 
        stroke="#0c131f" 
        strokeWidth={1.5} 
      />
    );
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header section with strategic description */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1.5">
            <Activity className="w-4 h-4 text-[#00f0ff] animate-pulse" />
            <span className="font-mono text-[9px] tracking-widest text-[#00f0ff] uppercase">
              Dashboard de Métricas Clave
            </span>
          </div>
          <h1 className="font-display text-4xl text-white font-extrabold tracking-tight">
            Análisis de Progreso KPI
          </h1>
          <p className="text-sm text-on-surface-variant mt-1.5 max-w-2xl leading-relaxed">
            Visualiza el crecimiento proyectado de tus indicadores clave en el tiempo. Utiliza los controles de simulación para modelar diferentes escenarios de inversión y optimización.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 self-start md:self-end">
          <button
            onClick={() => setTimeframe("30days")}
            className={`px-4 py-2 text-xs font-mono rounded-lg transition-all duration-300 cursor-pointer ${
              timeframe === "30days"
                ? "bg-[#00f0ff] text-[#00363a] font-bold shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Próximos 30 Días
          </button>
          <button
            onClick={() => setTimeframe("6months")}
            className={`px-4 py-2 text-xs font-mono rounded-lg transition-all duration-300 cursor-pointer ${
              timeframe === "6months"
                ? "bg-[#00f0ff] text-[#00363a] font-bold shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            6 Meses Proyectados
          </button>
        </div>
      </header>

      {/* Dynamic Alerts Banner */}
      <AnimatePresence>
        {activeAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-5 rounded-[2rem] border border-red-500/20 bg-red-500/5 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_0_30px_rgba(239,68,68,0.05)]"
          >
            {/* Ambient warning background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="flex items-start gap-3.5 relative z-10">
              <div className="p-2.5 bg-red-500/10 text-red-400 rounded-2xl border border-red-500/20 animate-pulse shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-widest text-red-400 font-extrabold block">
                  ALERTAS DE RENDIMIENTO ACTIVAS ({activeAlerts.length})
                </span>
                <p className="text-sm text-white font-bold leading-tight">
                  Hay {activeAlerts.length} KPI{activeAlerts.length > 1 ? "s" : ""} por debajo del nivel de seguridad proyectado.
                </p>
                <div className="mt-2 space-y-1.5">
                  {activeAlerts.map(alert => {
                    const originalKpi = alert.id === "f1" ? roadmap.phase1 : alert.id === "f2" ? roadmap.phase2 : roadmap.phase3;
                    const sixtyPercentValue = Math.round(originalKpi.kpiValue * 0.6);
                    return (
                      <div key={alert.id} className="text-xs text-on-surface-variant flex flex-col md:flex-row md:items-center gap-1">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          <strong>{alert.phaseName} ({alert.kpiName})</strong>:
                        </span>
                        <span>
                          Actual {alert.simulated}% vs Umbral {alert.threshold}% (60% Recomendado: {sixtyPercentValue}%, Objetivo: {alert.target}%).
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                setSeoIntensity(135);
                setMarketingSpend(135);
                setCroEfficiency(135);
              }}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-mono font-bold transition-all duration-300 cursor-pointer self-start md:self-center shrink-0 z-10"
            >
              Autocorregir Esfuerzos (Aumentar Intensidad)
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiCards.map((card) => (
          <div
            key={card.id}
            onClick={() => setSelectedMetric(selectedMetric === card.id ? "all" : (card.id as any))}
            className={`glass-card p-6 rounded-[2rem] border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between h-[230px] ${
              selectedMetric === card.id 
                ? "border-[#00f0ff]/50 bg-white/[0.03] shadow-[0_0_30px_rgba(0,240,255,0.08)]" 
                : "border-white/5 hover:border-white/10 bg-white/[0.01]"
            }`}
          >
            {/* Top gradient highlight for visual depth */}
            <div className={`absolute top-0 left-0 right-0 h-16 bg-gradient-to-b ${card.gradient} opacity-40 pointer-events-none`}></div>

            <div className="space-y-3 relative z-10">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant/80">
                    {card.phaseName}
                  </span>
                  <h3 className="font-display text-sm font-bold text-white tracking-tight leading-tight">
                    {card.kpiName}
                  </h3>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[9px] font-mono uppercase font-bold flex items-center gap-1.5 ${
                  card.isAlert 
                    ? "bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse" 
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }`}>
                  {card.isAlert ? (
                    <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                  ) : (
                    <span className="w-1 h-1 rounded-full bg-emerald-400" />
                  )}
                  {card.isAlert ? "Alerta" : "OK"}
                </div>
              </div>

              <p className="text-[11px] text-on-surface-variant/80 leading-relaxed line-clamp-2">
                {card.description}
              </p>
            </div>

            {/* Metrics display */}
            <div className="space-y-3 relative z-10 pt-4 border-t border-white/5 mt-auto">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[10px] text-on-surface-variant block font-mono">Simulado final</span>
                  <span className="text-3xl font-display font-black text-white leading-none">
                    {card.simulated}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-on-surface-variant block font-mono">Objetivo</span>
                  <span className="text-sm font-bold text-slate-300">
                    {card.target}%
                  </span>
                </div>
              </div>

              {/* Mini progress bar with threshold indicator */}
              <div className="relative w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 bottom-0 left-0 rounded-full"
                  style={{ 
                    width: `${card.simulated}%`,
                    backgroundColor: card.color 
                  }}
                />
                {/* Threshold vertical indicator */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10" 
                  style={{ left: `${card.threshold}%` }}
                  title={`Umbral: ${card.threshold}%`}
                />
              </div>
              <div className="flex justify-between items-center text-[9px] font-mono text-on-surface-variant/70">
                <span>0%</span>
                <span className="text-red-400 font-bold">Umbral: {card.threshold}%</span>
                <span>Objetivo: {card.target}%</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Main Graph & Control Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Graph Component */}
        <div className="lg:col-span-2 glass-card p-6 md:p-8 rounded-[2rem] border border-white/5 bg-white/[0.01] flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
                <h3 className="font-mono text-[9px] tracking-widest text-[#00f0ff] uppercase">
                  Tendencia de Crecimiento Neural
                </h3>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {selectedMetric === "all" ? "Visualización Global de KPIs" : `Detalle de KPI - ${kpiCards.find(c => c.id === selectedMetric)?.kpiName}`}
              </h3>
            </div>

            {/* Quick Filter toggle */}
            <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/10 text-[10px] font-mono">
              <button
                onClick={() => setSelectedMetric("all")}
                className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
                  selectedMetric === "all" ? "bg-white/10 text-[#00f0ff] font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setSelectedMetric("f1")}
                className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
                  selectedMetric === "f1" ? "bg-[#00f0ff]/10 text-[#00f0ff] font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                F1
              </button>
              <button
                onClick={() => setSelectedMetric("f2")}
                className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
                  selectedMetric === "f2" ? "bg-[#a855f7]/10 text-[#a855f7] font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                F2
              </button>
              <button
                onClick={() => setSelectedMetric("f3")}
                className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
                  selectedMetric === "f3" ? "bg-[#f43f5e]/10 text-[#f43f5e] font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                F3
              </button>
            </div>
          </div>

          {/* Recharts Render Canvas */}
          <div className="w-full h-[320px] relative my-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={currentData}
                margin={{ top: 20, right: 30, left: -20, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="colorF1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorF2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorF3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: "#94a3b8", fontSize: 9, fontFamily: "monospace" }}
                  stroke="rgba(255,255,255,0.08)"
                />
                <YAxis 
                  domain={[0, 110]}
                  tickFormatter={(val) => `${val}%`}
                  tick={{ fill: "#94a3b8", fontSize: 9, fontFamily: "monospace" }}
                  stroke="rgba(255,255,255,0.08)"
                />
                <RechartsTooltip content={<CustomTooltip />} />
                
                {/* Visual Alert threshold lines based on selected metric */}
                {(selectedMetric === "all" || selectedMetric === "f1") && (
                  <ReferenceLine 
                    y={thresholds.phase1} 
                    stroke="#ef4444" 
                    strokeDasharray="4 4" 
                    strokeWidth={1}
                    label={{ 
                      value: `F1: ${thresholds.phase1}%`, 
                      fill: "#ef4444", 
                      fontSize: 8, 
                      fontFamily: "monospace", 
                      position: "right"
                    }} 
                  />
                )}
                {(selectedMetric === "all" || selectedMetric === "f2") && (
                  <ReferenceLine 
                    y={thresholds.phase2} 
                    stroke="#fb7185" 
                    strokeDasharray="4 4" 
                    strokeWidth={1}
                    label={{ 
                      value: `F2: ${thresholds.phase2}%`, 
                      fill: "#fb7185", 
                      fontSize: 8, 
                      fontFamily: "monospace", 
                      position: "right"
                    }} 
                  />
                )}
                {(selectedMetric === "all" || selectedMetric === "f3") && (
                  <ReferenceLine 
                    y={thresholds.phase3} 
                    stroke="#f43f5e" 
                    strokeDasharray="4 4" 
                    strokeWidth={1}
                    label={{ 
                      value: `F3: ${thresholds.phase3}%`, 
                      fill: "#f43f5e", 
                      fontSize: 8, 
                      fontFamily: "monospace", 
                      position: "right"
                    }} 
                  />
                )}

                {/* Plot Areas according to the selection */}
                {(selectedMetric === "all" || selectedMetric === "f1") && (
                  <Area
                    type="monotone"
                    dataKey="Neural Alignment"
                    stroke="#00f0ff"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorF1)"
                    dot={<RenderCustomDot />}
                    activeDot={{ r: 6 }}
                  />
                )}
                {(selectedMetric === "all" || selectedMetric === "f2") && (
                  <Area
                    type="monotone"
                    dataKey="Velocity Multiplier"
                    stroke="#a855f7"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorF2)"
                    dot={<RenderCustomDot />}
                    activeDot={{ r: 6 }}
                  />
                )}
                {(selectedMetric === "all" || selectedMetric === "f3") && (
                  <Area
                    type="monotone"
                    dataKey="Cognitive Dominance"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorF3)"
                    dot={<RenderCustomDot />}
                    activeDot={{ r: 6 }}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono text-on-surface-variant/70 border-t border-white/5 pt-4">
            <p>
              * El simulador proyecta el crecimiento acumulado combinando el rendimiento base y los multiplicadores activos.
            </p>
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00f0ff]" /> F1: {roadmap.phase1.kpiName}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#a855f7]" /> F2: {roadmap.phase2.kpiName}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#f43f5e]" /> F3: {roadmap.phase3.kpiName}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Simulation Controls Sidebar */}
        <div className="glass-card p-6 md:p-8 rounded-[2rem] border border-white/5 bg-white/[0.01] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Sidebar Tab Selectors */}
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 mb-2">
              <button
                onClick={() => setSidebarTab("simulator")}
                className={`flex-1 py-1.5 text-xs font-mono rounded-lg transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
                  sidebarTab === "simulator"
                    ? "bg-white/10 text-[#00f0ff] font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                Simulador
              </button>
              <button
                onClick={() => setSidebarTab("alerts")}
                className={`flex-1 py-1.5 text-xs font-mono rounded-lg transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 relative ${
                  sidebarTab === "alerts"
                    ? "bg-white/10 text-red-400 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                Alertas
                {activeAlerts.length > 0 && (
                  <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                )}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {sidebarTab === "simulator" ? (
                <motion.div
                  key="simulator-tab"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#00f0ff]" />
                      <h3 className="text-sm font-bold text-white tracking-tight uppercase">Simulador de Esfuerzos</h3>
                    </div>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      Ajusta las palancas de optimización estratégica para proyectar cómo impactarán las mejoras en el presupuesto, SEO o conversión en tus KPIs.
                    </p>
                  </div>

                  {/* Slider 1: SEO Intensity */}
                  <div className="space-y-2 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium">Esfuerzo SEO & Orgánico</span>
                      <span className="font-mono text-[#00f0ff] font-bold">{seoIntensity}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={seoIntensity}
                      onChange={(e) => setSeoIntensity(Number(e.target.value))}
                      className="w-full accent-[#00f0ff] bg-white/10 rounded-lg appearance-none h-1 cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-on-surface-variant/60">
                      <span>Mínimo (0.5x)</span>
                      <span>Base</span>
                      <span>Máximo (2.0x)</span>
                    </div>
                  </div>

                  {/* Slider 2: Marketing Budget */}
                  <div className="space-y-2 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium">Inversión SEM & Ads</span>
                      <span className="font-mono text-[#a855f7] font-bold">{marketingSpend}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={marketingSpend}
                      onChange={(e) => setMarketingSpend(Number(e.target.value))}
                      className="w-full accent-[#a855f7] bg-white/10 rounded-lg appearance-none h-1 cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-on-surface-variant/60">
                      <span>Inversión baja</span>
                      <span>Presupuesto Base</span>
                      <span>Presupuesto Alto</span>
                    </div>
                  </div>

                  {/* Slider 3: CRO Efficiency */}
                  <div className="space-y-2 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium">Optimización Tasa Conversión</span>
                      <span className="font-mono text-[#f43f5e] font-bold">{croEfficiency}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={croEfficiency}
                      onChange={(e) => setCroEfficiency(Number(e.target.value))}
                      className="w-full accent-[#f43f5e] bg-white/10 rounded-lg appearance-none h-1 cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-on-surface-variant/60">
                      <span>Sin CRO</span>
                      <span>CRO Estándar</span>
                      <span>CRO Premium</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="alerts-tab"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-red-400" />
                        <h3 className="text-sm font-bold text-white tracking-tight uppercase">Configurar Alertas</h3>
                      </div>
                      <button
                        onClick={resetThresholdsTo60Percent}
                        className="text-[9px] font-mono uppercase tracking-wider text-red-400 hover:text-red-300 border border-red-500/20 bg-red-500/5 px-2 py-1 rounded transition-colors cursor-pointer"
                      >
                        Resetear (60%)
                      </button>
                    </div>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      Personaliza los umbrales de seguridad. Si el indicador simulado cae por debajo del umbral, se activará una alerta y advertencia en los gráficos.
                    </p>
                  </div>

                  {/* Threshold 1: Neural Alignment */}
                  <div className="space-y-2 p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium truncate max-w-[150px]">F1: {roadmap.phase1.kpiName}</span>
                      <span className="font-mono text-[#00f0ff] font-bold">{thresholds.phase1}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max={roadmap.phase1.kpiValue}
                      value={thresholds.phase1}
                      onChange={(e) => handleThresholdChange("phase1", Number(e.target.value))}
                      className="w-full accent-[#00f0ff] bg-white/10 rounded-lg appearance-none h-1 cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] font-mono">
                      <span className="text-on-surface-variant/50">Rec. 60%: {Math.round(roadmap.phase1.kpiValue * 0.6)}%</span>
                      {simValF1 < thresholds.phase1 ? (
                        <span className="text-red-400 font-bold uppercase flex items-center gap-1 animate-pulse">
                          ⚠️ ALERTA
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-medium">✓ Correcto</span>
                      )}
                    </div>
                  </div>

                  {/* Threshold 2: Velocity Multiplier */}
                  <div className="space-y-2 p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium truncate max-w-[150px]">F2: {roadmap.phase2.kpiName}</span>
                      <span className="font-mono text-[#a855f7] font-bold">{thresholds.phase2}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max={roadmap.phase2.kpiValue}
                      value={thresholds.phase2}
                      onChange={(e) => handleThresholdChange("phase2", Number(e.target.value))}
                      className="w-full accent-[#a855f7] bg-white/10 rounded-lg appearance-none h-1 cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] font-mono">
                      <span className="text-on-surface-variant/50">Rec. 60%: {Math.round(roadmap.phase2.kpiValue * 0.6)}%</span>
                      {simValF2 < thresholds.phase2 ? (
                        <span className="text-red-400 font-bold uppercase flex items-center gap-1 animate-pulse">
                          ⚠️ ALERTA
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-medium">✓ Correcto</span>
                      )}
                    </div>
                  </div>

                  {/* Threshold 3: Cognitive Dominance */}
                  <div className="space-y-2 p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium truncate max-w-[150px]">F3: {roadmap.phase3.kpiName}</span>
                      <span className="font-mono text-[#f43f5e] font-bold">{thresholds.phase3}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max={roadmap.phase3.kpiValue}
                      value={thresholds.phase3}
                      onChange={(e) => handleThresholdChange("phase3", Number(e.target.value))}
                      className="w-full accent-[#f43f5e] bg-white/10 rounded-lg appearance-none h-1 cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] font-mono">
                      <span className="text-on-surface-variant/50">Rec. 60%: {Math.round(roadmap.phase3.kpiValue * 0.6)}%</span>
                      {simValF3 < thresholds.phase3 ? (
                        <span className="text-red-400 font-bold uppercase flex items-center gap-1 animate-pulse">
                          ⚠️ ALERTA
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-medium">✓ Correcto</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Simulate Action Footer Summary */}
          <div className="p-4 bg-[#00f0ff]/5 rounded-2xl border border-[#00f0ff]/10 text-xs text-white/95 space-y-2">
            <div className="flex items-center gap-1.5 text-[#00f0ff] font-mono text-[10px] uppercase font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Predicciones del Motor AI</span>
            </div>
            <p className="text-[11px] leading-relaxed text-on-surface-variant">
              {activeAlerts.length > 0 ? (
                <span>La reducción de esfuerzos o un umbral exigente activa alertas en <strong className="text-red-400">{activeAlerts.map(a => a.kpiName).join(", ")}</strong>. Incrementa la intensidad operativa para corregir la trayectoria.</span>
              ) : seoIntensity > 120 || marketingSpend > 120 || croEfficiency > 120 ? (
                <span>Al incrementar los esfuerzos operativos, el algoritmo proyecta que lograrás alcanzar los KPIs objetivos hasta <strong className="text-emerald-400">18 días antes</strong> de lo planificado originalmente.</span>
              ) : seoIntensity < 80 || marketingSpend < 80 || croEfficiency < 80 ? (
                <span>La reducción en recursos estratégicos coloca en riesgo las metas. Existe una alta probabilidad de no cumplir el objetivo para <strong className="text-red-400">F3: {roadmap.phase3.kpiName}</strong>.</span>
              ) : (
                <span>El roadmap estratégico actual se encuentra balanceado. Las tres fases avanzan a un ritmo coordinado y sostenible con márgenes de seguridad correctos.</span>
              )}
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setSeoIntensity(100);
                  setMarketingSpend(100);
                  setCroEfficiency(100);
                }}
                className="text-[9px] font-mono uppercase tracking-wider text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Restaurar Parámetros Base
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations & Actions based on current status */}
      <section className="glass-card p-6 md:p-8 rounded-[2rem] border border-white/5 bg-white/[0.01]">
        <h3 className="font-display text-lg font-bold text-white mb-4">Recomendaciones del Consultor de Estrategia</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-on-surface-variant">
          <div className="space-y-3 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-[10px] uppercase font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Oportunidades de Aceleración</span>
            </div>
            <ul className="list-disc pl-4 space-y-2">
              <li>El canal orgánico (F1) es altamente elástico al esfuerzo invertido. Incrementar el esfuerzo SEO en un 20% desbloquea un incremento del 15% en leads sin costo publicitario incremental.</li>
              <li>Asegura que tu presupuesto de SEM de <strong>Fase 2</strong> esté coordinado directamente con las horas de mayor tasa de conversión históricas para reducir el CPC real en Ads.</li>
            </ul>
          </div>
          <div className="space-y-3 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-[10px] uppercase font-bold">
              <Info className="w-4 h-4" />
              <span>Puntos de Atención Críticos</span>
            </div>
            <ul className="list-disc pl-4 space-y-2">
              <li>Monitorea de cerca el KPI de <strong>Fase 3 ({roadmap.phase3.kpiName})</strong>. Cualquier desviación por debajo del umbral de alerta configurado ({thresholds.phase3}%) requerirá rediseñar los embudos de registro o checkout.</li>
              <li>La volatilidad natural del mercado puede atenuar las proyecciones orgánicas. Mantener un margen operativo de al menos 10 puntos por encima del umbral de alerta es la recomendación óptima.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
