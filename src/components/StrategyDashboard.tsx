/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from "recharts";
import {
  TrendingUp,
  Sliders,
  Sparkles,
  Download,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Info,
  Calendar,
  Layers,
  LineChart as ChartIcon,
  ToggleLeft,
  FileSpreadsheet
} from "lucide-react";
import { StrategyData, PhaseNote } from "../types";

interface StrategyDashboardProps {
  strategy: StrategyData;
  notes?: Record<string, PhaseNote[]>;
  thresholds: Record<"phase1" | "phase2" | "phase3", number>;
  volatility: number;
}

type ForecastModel = "linear" | "exponential" | "logarithmic";
type Timeframe = "30" | "60" | "90";
type ChartType = "line" | "area" | "bar";

export default function StrategyDashboard({
  strategy,
  notes = {},
  thresholds,
  volatility
}: StrategyDashboardProps) {
  const { roadmap, seoMetrics, budgetEfficiency } = strategy;

  // State controls for Dashboard
  const [forecastModel, setForecastModel] = useState<ForecastModel>("linear");
  const [timeframe, setTimeframe] = useState<Timeframe>("30");
  const [chartType, setChartType] = useState<ChartType>("line");
  const [visibleMetrics, setVisibleMetrics] = useState({
    kpi: true,
    seoTone: false,
    localSearch: false,
    budgetEfficiency: false
  });

  const [activeTooltipItem, setActiveTooltipItem] = useState<string | null>(null);

  // Parse days for timeline interpolation
  const days1 = useMemo(() => {
    const match = roadmap.phase1.days.match(/\d+/);
    return match ? parseInt(match[0], 10) : 10;
  }, [roadmap.phase1.days]);

  const days2 = useMemo(() => {
    const match = roadmap.phase2.days.match(/\d+/);
    return match ? parseInt(match[0], 10) : 10;
  }, [roadmap.phase2.days]);

  const days3 = useMemo(() => {
    const match = roadmap.phase3.days.match(/\d+/);
    return match ? parseInt(match[0], 10) : 10;
  }, [roadmap.phase3.days]);

  // Dynamic values adjusted by Volatility Simulator
  const getAdjustedValue = (baseValue: number) => {
    const reduction = baseValue * (volatility / 100) * 0.45;
    return Math.max(5, Math.min(100, Math.round(baseValue - reduction)));
  };

  const adjPhase1Val = getAdjustedValue(roadmap.phase1.kpiValue);
  const adjPhase2Val = getAdjustedValue(roadmap.phase2.kpiValue);
  const adjPhase3Val = getAdjustedValue(roadmap.phase3.kpiValue);

  const budgetEffVal = useMemo(() => {
    if (budgetEfficiency && budgetEfficiency.length > 0) {
      const avg = budgetEfficiency.reduce((acc, curr) => acc + curr.height, 0) / budgetEfficiency.length;
      return Math.round(avg);
    }
    return 75;
  }, [budgetEfficiency]);

  // Build continuous daily timeline dataset
  const dashboardData = useMemo(() => {
    const dataPoints: Array<{
      day: number;
      name: string;
      kpi: number;
      seoTone: number;
      localSearch: number;
      budgetEfficiency: number;
      hasNote?: boolean;
      noteCount?: number;
      noteTexts?: string[];
    }> = [];

    const totalDays = parseInt(timeframe, 10);
    const startVal = 15;

    // Anchor points in the timeline
    const p1EndDay = days1;
    const p2EndDay = days1 + days2;
    const p3EndDay = days1 + days2 + days3;

    for (let day = 0; day <= totalDays; day++) {
      // 1. Calculate linear baseline
      let baseKpi = startVal;
      let label = `Día ${day}`;

      if (day <= p1EndDay) {
        const ratio = day / (p1EndDay || 1);
        baseKpi = startVal + (adjPhase1Val - startVal) * ratio;
        if (day === p1EndDay) label = "Fase 1";
      } else if (day <= p2EndDay) {
        const ratio = (day - p1EndDay) / (days2 || 1);
        baseKpi = adjPhase1Val + (adjPhase2Val - adjPhase1Val) * ratio;
        if (day === p2EndDay) label = "Fase 2";
      } else if (day <= p3EndDay) {
        const ratio = (day - p2EndDay) / (days3 || 1);
        baseKpi = adjPhase2Val + (adjPhase3Val - adjPhase2Val) * ratio;
        if (day === p3EndDay) label = "Fase 3";
      } else {
        // Beyond Phase 3 (Extrapolation/Prediction)
        const ratio = (day - p3EndDay) / (totalDays - p3EndDay || 1);
        baseKpi = adjPhase3Val + (Math.min(100, adjPhase3Val + 10) - adjPhase3Val) * ratio;
      }

      // Apply Forecast Formula modification
      let finalKpi = baseKpi;
      if (forecastModel === "exponential") {
        // Shoots up fast at the end, slow at start
        const progressRatio = day / totalDays;
        const multiplier = Math.pow(progressRatio, 1.5);
        finalKpi = startVal + (baseKpi - startVal) * multiplier;
      } else if (forecastModel === "logarithmic") {
        // Rises quickly initially, tapers off
        const progressRatio = day / totalDays;
        const multiplier = Math.log(1 + progressRatio * 1.718) / Math.log(2.718);
        finalKpi = startVal + (baseKpi - startVal) * multiplier;
      }

      finalKpi = Math.max(5, Math.min(100, Math.round(finalKpi)));

      // Interpolate helper metrics smoothly
      const seoToneProgress = Math.round(
        10 + (seoMetrics.brandTone - 10) * Math.min(1, (day / totalDays) * 1.1)
      );
      const localSearchProgress = Math.round(
        5 + (seoMetrics.localSearch - 5) * Math.min(1, (day / totalDays) * 1.2)
      );
      const budgetEffProgress = Math.round(
        30 + (budgetEffVal - 30) * Math.min(1, (day / totalDays) * 0.9)
      );

      // Check if this day is a phase transition to append notes
      let dayNotes: string[] = [];
      if (day === p1EndDay && notes.phase1) {
        dayNotes = notes.phase1.map(n => n.text);
      } else if (day === p2EndDay && notes.phase2) {
        dayNotes = notes.phase2.map(n => n.text);
      } else if (day === p3EndDay && notes.phase3) {
        dayNotes = notes.phase3.map(n => n.text);
      }

      dataPoints.push({
        day,
        name: label,
        kpi: finalKpi,
        seoTone: seoToneProgress,
        localSearch: localSearchProgress,
        budgetEfficiency: budgetEffProgress,
        hasNote: dayNotes.length > 0,
        noteCount: dayNotes.length,
        noteTexts: dayNotes
      });
    }

    return dataPoints;
  }, [
    timeframe,
    forecastModel,
    days1,
    days2,
    days3,
    adjPhase1Val,
    adjPhase2Val,
    adjPhase3Val,
    seoMetrics.brandTone,
    seoMetrics.localSearch,
    budgetEffVal,
    notes
  ]);

  // Export plotted data as CSV file
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Dia,Etiqueta,Progreso KPI (%),SEO Brand Tone (%),Local Search Coverage (%),Budget Efficiency (%)\n";

    dashboardData.forEach(row => {
      csvContent += `${row.day},"${row.name}",${row.kpi},${row.seoTone},${row.localSearch},${row.budgetEfficiency}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${strategy.businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-dashboard-dataset.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Custom tooltips with strategic notes rendering inside chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0b0e14] border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-md max-w-[280px]">
          <p className="font-mono text-[10px] text-slate-400 font-bold uppercase mb-1.5">
            Día {data.day} &bull; {data.name}
          </p>
          <div className="space-y-1 border-b border-white/5 pb-2 mb-2">
            {payload.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.stroke || item.fill }}
                  ></span>
                  {item.name}:
                </span>
                <span className="font-mono font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>

          {data.hasNote && data.noteTexts && data.noteTexts.length > 0 && (
            <div className="space-y-1">
              <p className="text-[9px] font-mono text-[#00f0ff] uppercase tracking-wider font-bold">
                Notas Estratégicas ({data.noteCount})
              </p>
              <ul className="list-disc list-inside space-y-1">
                {data.noteTexts.slice(0, 2).map((txt: string, i: number) => (
                  <li key={i} className="text-[10px] text-slate-300 italic leading-snug">
                    "{txt.length > 40 ? txt.substring(0, 40) + "..." : txt}"
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Phase 1 Summary Card */}
        <div className="glass-card p-5 rounded-2xl border border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-mono text-[9px] text-[#00f0ff] uppercase tracking-widest font-bold">
              F1: {roadmap.phase1.kpiName}
            </span>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-bold text-white font-mono">{adjPhase1Val}%</h4>
              <span className={`text-[10px] font-mono ${adjPhase1Val < thresholds.phase1 ? "text-red-400" : "text-emerald-400"}`}>
                {adjPhase1Val < thresholds.phase1 ? "¡Bajo Umbral!" : "Normal"}
              </span>
            </div>
            <p className="text-[10px] text-on-surface-variant truncate max-w-[150px]">{roadmap.phase1.name}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <TrendingUp className="w-5 h-5 text-[#00f0ff]" />
          </div>
        </div>

        {/* Phase 2 Summary Card */}
        <div className="glass-card p-5 rounded-2xl border border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-mono text-[9px] text-purple-400 uppercase tracking-widest font-bold">
              F2: {roadmap.phase2.kpiName}
            </span>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-bold text-white font-mono">{adjPhase2Val}%</h4>
              <span className={`text-[10px] font-mono ${adjPhase2Val < thresholds.phase2 ? "text-red-400" : "text-emerald-400"}`}>
                {adjPhase2Val < thresholds.phase2 ? "¡Bajo Umbral!" : "Normal"}
              </span>
            </div>
            <p className="text-[10px] text-on-surface-variant truncate max-w-[150px]">{roadmap.phase2.name}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <Layers className="w-5 h-5 text-purple-400" />
          </div>
        </div>

        {/* Phase 3 Summary Card */}
        <div className="glass-card p-5 rounded-2xl border border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-mono text-[9px] text-pink-400 uppercase tracking-widest font-bold">
              F3: {roadmap.phase3.kpiName}
            </span>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-bold text-white font-mono">{adjPhase3Val}%</h4>
              <span className={`text-[10px] font-mono ${adjPhase3Val < thresholds.phase3 ? "text-red-400" : "text-emerald-400"}`}>
                {adjPhase3Val < thresholds.phase3 ? "¡Bajo Umbral!" : "Normal"}
              </span>
            </div>
            <p className="text-[10px] text-on-surface-variant truncate max-w-[150px]">{roadmap.phase3.name}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <CheckCircle className="w-5 h-5 text-pink-400" />
          </div>
        </div>

        {/* Current Forecast Model Card */}
        <div className="glass-card p-5 rounded-2xl border border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div className="space-y-1">
            <span className="font-mono text-[9px] text-amber-400 uppercase tracking-widest font-bold">
              Modelo Predictivo Activo
            </span>
            <h4 className="text-sm font-bold text-white">
              {forecastModel === "linear" && "Alineación Directa / Lineal"}
              {forecastModel === "exponential" && "Aceleración Exponencial"}
              {forecastModel === "logarithmic" && "Crecimiento Orgánico"}
            </h4>
            <p className="text-[10px] text-on-surface-variant">
              Simulando volatilidad del {volatility}%
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Main Interactive Controls Panel */}
      <div className="glass-card p-6 md:p-8 rounded-[2rem] border border-white/5 space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-white/5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <ChartIcon className="w-4 h-4 text-[#00f0ff]" />
              <h3 className="text-base font-bold text-white tracking-tight">Evolución de KPIs Estratégicos</h3>
            </div>
            <p className="text-[11px] text-on-surface-variant max-w-xl leading-relaxed">
              Interactúa con los modelos, cambia la escala de tiempo y compara múltiples métricas de conversión sobre un motor de interpolación predictiva continua.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* CSV Export Button */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-400 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Exportar Dataset CSV</span>
            </button>
          </div>
        </div>

        {/* Dashboard Filter Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 text-xs">
          {/* 1. Forecast Model Toggler */}
          <div className="lg:col-span-4 space-y-2">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              Modelo Matemático de Simulación
            </span>
            <div className="grid grid-cols-3 bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setForecastModel("linear")}
                className={`py-2 rounded-lg font-mono text-[10px] transition-all cursor-pointer ${
                  forecastModel === "linear"
                    ? "bg-[#00f0ff]/10 border border-[#00f0ff]/25 text-[#00f0ff]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Lineal
              </button>
              <button
                onClick={() => setForecastModel("exponential")}
                className={`py-2 rounded-lg font-mono text-[10px] transition-all cursor-pointer ${
                  forecastModel === "exponential"
                    ? "bg-[#00f0ff]/10 border border-[#00f0ff]/25 text-[#00f0ff]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Exponencial
              </button>
              <button
                onClick={() => setForecastModel("logarithmic")}
                className={`py-2 rounded-lg font-mono text-[10px] transition-all cursor-pointer ${
                  forecastModel === "logarithmic"
                    ? "bg-[#00f0ff]/10 border border-[#00f0ff]/25 text-[#00f0ff]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Orgánico
              </button>
            </div>
          </div>

          {/* 2. Timeframe Selector */}
          <div className="lg:col-span-3 space-y-2">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              Horizonte Temporal de Proyección
            </span>
            <div className="grid grid-cols-3 bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setTimeframe("30")}
                className={`py-2 rounded-lg font-mono text-[10px] transition-all cursor-pointer ${
                  timeframe === "30"
                    ? "bg-[#00f0ff]/10 border border-[#00f0ff]/25 text-[#00f0ff]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                30 Días
              </button>
              <button
                onClick={() => setTimeframe("60")}
                className={`py-2 rounded-lg font-mono text-[10px] transition-all cursor-pointer ${
                  timeframe === "60"
                    ? "bg-[#00f0ff]/10 border border-[#00f0ff]/25 text-[#00f0ff]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                60 Días
              </button>
              <button
                onClick={() => setTimeframe("90")}
                className={`py-2 rounded-lg font-mono text-[10px] transition-all cursor-pointer ${
                  timeframe === "90"
                    ? "bg-[#00f0ff]/10 border border-[#00f0ff]/25 text-[#00f0ff]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                90 Días
              </button>
            </div>
          </div>

          {/* 3. Visual Layout Style Selector */}
          <div className="lg:col-span-3 space-y-2">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              Estilo de Visualización
            </span>
            <div className="grid grid-cols-3 bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setChartType("line")}
                className={`py-2 rounded-lg font-mono text-[10px] transition-all cursor-pointer ${
                  chartType === "line"
                    ? "bg-[#00f0ff]/10 border border-[#00f0ff]/25 text-[#00f0ff]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Línea
              </button>
              <button
                onClick={() => setChartType("area")}
                className={`py-2 rounded-lg font-mono text-[10px] transition-all cursor-pointer ${
                  chartType === "area"
                    ? "bg-[#00f0ff]/10 border border-[#00f0ff]/25 text-[#00f0ff]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Área
              </button>
              <button
                onClick={() => setChartType("bar")}
                className={`py-2 rounded-lg font-mono text-[10px] transition-all cursor-pointer ${
                  chartType === "bar"
                    ? "bg-[#00f0ff]/10 border border-[#00f0ff]/25 text-[#00f0ff]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Barras
              </button>
            </div>
          </div>

          {/* 4. Mini Reference status */}
          <div className="lg:col-span-2 space-y-2 flex flex-col justify-end">
            <div className="flex items-center gap-1.5 justify-end h-9 px-3 bg-white/5 rounded-xl border border-white/10">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span className="text-[10px] font-mono font-bold uppercase text-white">
                Alertas Activas
              </span>
            </div>
          </div>
        </div>

        {/* Multi-Metric Selector Checkboxes */}
        <div className="flex flex-wrap gap-4 pt-1 pb-2 border-t border-white/5">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider self-center mr-2">
            Comparar Métricas:
          </div>

          <label className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/5 cursor-pointer transition-colors text-xs select-none">
            <input
              type="checkbox"
              checked={visibleMetrics.kpi}
              onChange={(e) => setVisibleMetrics(prev => ({ ...prev, kpi: e.target.checked }))}
              className="w-3.5 h-3.5 rounded border-white/10 bg-white/5 text-[#00f0ff] focus:ring-0 accent-[#00f0ff] cursor-pointer"
            />
            <span className="text-slate-300">KPI Principal de Fase</span>
            <span className="w-2 h-2 rounded-full bg-[#00f0ff]"></span>
          </label>

          <label className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/5 cursor-pointer transition-colors text-xs select-none">
            <input
              type="checkbox"
              checked={visibleMetrics.seoTone}
              onChange={(e) => setVisibleMetrics(prev => ({ ...prev, seoTone: e.target.checked }))}
              className="w-3.5 h-3.5 rounded border-white/10 bg-white/5 text-purple-400 focus:ring-0 accent-purple-400 cursor-pointer"
            />
            <span className="text-slate-300">SEO Brand Tone</span>
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
          </label>

          <label className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/5 cursor-pointer transition-colors text-xs select-none">
            <input
              type="checkbox"
              checked={visibleMetrics.localSearch}
              onChange={(e) => setVisibleMetrics(prev => ({ ...prev, localSearch: e.target.checked }))}
              className="w-3.5 h-3.5 rounded border-white/10 bg-white/5 text-pink-400 focus:ring-0 accent-pink-400 cursor-pointer"
            />
            <span className="text-slate-300">Cobertura Local Search</span>
            <span className="w-2 h-2 rounded-full bg-pink-400"></span>
          </label>

          <label className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/5 cursor-pointer transition-colors text-xs select-none">
            <input
              type="checkbox"
              checked={visibleMetrics.budgetEfficiency}
              onChange={(e) => setVisibleMetrics(prev => ({ ...prev, budgetEfficiency: e.target.checked }))}
              className="w-3.5 h-3.5 rounded border-white/10 bg-white/5 text-amber-400 focus:ring-0 accent-amber-400 cursor-pointer"
            />
            <span className="text-slate-300">Eficiencia de Presupuesto</span>
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          </label>
        </div>

        {/* Dynamic Chart Area */}
        <div className="w-full h-[360px] relative mt-4">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart
                data={dashboardData}
                margin={{ top: 20, right: 30, left: -10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "monospace" }}
                  stroke="rgba(255,255,255,0.1)"
                />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(val) => `${val}%`}
                  tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "monospace" }}
                  stroke="rgba(255,255,255,0.1)"
                />
                <RechartsTooltip content={<CustomTooltip />} />
                
                {/* Reference lines for threshold bounds */}
                {visibleMetrics.kpi && (
                  <>
                    <ReferenceLine
                      y={thresholds.phase1}
                      stroke="#ef4444"
                      strokeDasharray="4 4"
                      strokeWidth={1}
                      label={{
                        value: `Umbral F1: ${thresholds.phase1}%`,
                        fill: "#f87171",
                        fontSize: 8,
                        fontFamily: "monospace",
                        position: "right"
                      }}
                    />
                    <ReferenceLine
                      y={thresholds.phase2}
                      stroke="#fb7185"
                      strokeDasharray="4 4"
                      strokeWidth={1}
                      label={{
                        value: `Umbral F2: ${thresholds.phase2}%`,
                        fill: "#fb7185",
                        fontSize: 8,
                        fontFamily: "monospace",
                        position: "right"
                      }}
                    />
                    <ReferenceLine
                      y={thresholds.phase3}
                      stroke="#f43f5e"
                      strokeDasharray="4 4"
                      strokeWidth={1}
                      label={{
                        value: `Umbral F3: ${thresholds.phase3}%`,
                        fill: "#f43f5e",
                        fontSize: 8,
                        fontFamily: "monospace",
                        position: "right"
                      }}
                    />
                  </>
                )}

                {visibleMetrics.kpi && (
                  <Line
                    type="monotone"
                    dataKey="kpi"
                    name="KPI Principal"
                    stroke="#00f0ff"
                    strokeWidth={3}
                    dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      if (payload.hasNote) {
                        return (
                          <g key={`dot-${payload.day}`}>
                            <circle cx={cx} cy={cy} r={8} fill="#ef4444" stroke="#fff" strokeWidth={1} className="animate-pulse" />
                            <circle cx={cx} cy={cy} r={4} fill="#00f0ff" />
                          </g>
                        );
                      }
                      return <circle key={`dot-${payload.day}`} cx={cx} cy={cy} r={4} fill="#00f0ff" stroke="#0E0E0F" strokeWidth={1.5} />;
                    }}
                    activeDot={{ r: 8, strokeWidth: 0, fill: "#00f0ff" }}
                  />
                )}

                {visibleMetrics.seoTone && (
                  <Line
                    type="monotone"
                    dataKey="seoTone"
                    name="SEO Brand Tone"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={{ fill: "#a855f7", stroke: "#0E0E0F", r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                )}

                {visibleMetrics.localSearch && (
                  <Line
                    type="monotone"
                    dataKey="localSearch"
                    name="Local Search Coverage"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    dot={{ fill: "#f43f5e", stroke: "#0E0E0F", r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                )}

                {visibleMetrics.budgetEfficiency && (
                  <Line
                    type="monotone"
                    dataKey="budgetEfficiency"
                    name="Eficiencia Presupuesto"
                    stroke="#fbbf24"
                    strokeWidth={2}
                    dot={{ fill: "#fbbf24", stroke: "#0E0E0F", r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                )}
              </LineChart>
            ) : chartType === "area" ? (
              <AreaChart
                data={dashboardData}
                margin={{ top: 20, right: 30, left: -10, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="colorKpi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSeo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLocal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "monospace" }}
                  stroke="rgba(255,255,255,0.1)"
                />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(val) => `${val}%`}
                  tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "monospace" }}
                  stroke="rgba(255,255,255,0.1)"
                />
                <RechartsTooltip content={<CustomTooltip />} />

                {visibleMetrics.kpi && (
                  <Area
                    type="monotone"
                    dataKey="kpi"
                    name="KPI Principal"
                    stroke="#00f0ff"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorKpi)"
                  />
                )}

                {visibleMetrics.seoTone && (
                  <Area
                    type="monotone"
                    dataKey="seoTone"
                    name="SEO Brand Tone"
                    stroke="#a855f7"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSeo)"
                  />
                )}

                {visibleMetrics.localSearch && (
                  <Area
                    type="monotone"
                    dataKey="localSearch"
                    name="Local Search Coverage"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorLocal)"
                  />
                )}

                {visibleMetrics.budgetEfficiency && (
                  <Area
                    type="monotone"
                    dataKey="budgetEfficiency"
                    name="Eficiencia Presupuesto"
                    stroke="#fbbf24"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorBudget)"
                  />
                )}
              </AreaChart>
            ) : (
              <BarChart
                data={dashboardData.filter((_, i) => i % 3 === 0)} // Sub-sample to keep bar chart legible
                margin={{ top: 20, right: 30, left: -10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "monospace" }}
                  stroke="rgba(255,255,255,0.1)"
                />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(val) => `${val}%`}
                  tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "monospace" }}
                  stroke="rgba(255,255,255,0.1)"
                />
                <RechartsTooltip content={<CustomTooltip />} />

                {visibleMetrics.kpi && (
                  <Bar
                    dataKey="kpi"
                    name="KPI Principal"
                    fill="#00f0ff"
                    radius={[4, 4, 0, 0]}
                  />
                )}

                {visibleMetrics.seoTone && (
                  <Bar
                    dataKey="seoTone"
                    name="SEO Brand Tone"
                    fill="#a855f7"
                    radius={[4, 4, 0, 0]}
                  />
                )}

                {visibleMetrics.localSearch && (
                  <Bar
                    dataKey="localSearch"
                    name="Local Search Coverage"
                    fill="#f43f5e"
                    radius={[4, 4, 0, 0]}
                  />
                )}

                {visibleMetrics.budgetEfficiency && (
                  <Bar
                    dataKey="budgetEfficiency"
                    name="Eficiencia Presupuesto"
                    fill="#fbbf24"
                    radius={[4, 4, 0, 0]}
                  />
                )}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Informative footer tip */}
        <div className="flex items-start gap-2.5 p-4 bg-[#00f0ff]/5 border border-[#00f0ff]/10 rounded-2xl text-[11px] text-slate-350 font-sans leading-relaxed">
          <Info className="w-4 h-4 text-[#00f0ff] flex-shrink-0 mt-0.5" />
          <span>
            <strong>Consejo Estratégico:</strong> El gráfico proyecta de forma continua basándose en el <strong>modelo {forecastModel === "linear" ? "Lineal" : forecastModel === "exponential" ? "Exponencial" : "Orgánico"}</strong>. Las anotaciones guardadas en las fases se representan como nodos resaltados en rojo. Al pasar el cursor por los puntos rojos podrás consultar las notas asociadas directamente sobre el gráfico.
          </span>
        </div>
      </div>
    </div>
  );
}
