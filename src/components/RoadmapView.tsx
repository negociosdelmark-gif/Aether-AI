/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Palette, Eye, ArrowUpRight, HelpCircle, Sparkles, Sliders, Download, FileText, AlertTriangle, Plus, Trash2, Pin, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { StrategyData, PhaseNote } from "../types";
import { generateStrategyPDF } from "../utils/pdfGenerator";
import StrategyDashboard from "./StrategyDashboard";

interface RoadmapViewProps {
  strategy: StrategyData;
  onOptimizeClick: () => void;
  onComposeClick: () => void;
  onLaunchCampaign: () => void;
  highlightSection: "none" | "seo" | "sem" | "social" | "dna";
}

export default function RoadmapView({
  strategy,
  onOptimizeClick,
  onComposeClick,
  onLaunchCampaign,
  highlightSection
}: RoadmapViewProps) {
  const { roadmap, visualDna } = strategy;

  const [thresholds, setThresholds] = useState<Record<"phase1" | "phase2" | "phase3", number>>(() => {
    try {
      const saved = localStorage.getItem(`strategy_thresholds_${strategy.businessName || "default"}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error reading thresholds from localStorage", e);
    }
    return {
      phase1: 30,
      phase2: 30,
      phase3: 30
    };
  });

  const [volatility, setVolatility] = useState<number>(0);

  interface Toast {
    id: string;
    message: string;
    type: "warning" | "info" | "success" | "error";
    kpi: string;
  }

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [prevUnder, setPrevUnder] = useState({
    phase1: false,
    phase2: false,
    phase3: false,
  });

  const updateThreshold = (phase: "phase1" | "phase2" | "phase3", val: number) => {
    const updated = {
      ...thresholds,
      [phase]: val
    };
    setThresholds(updated);
    try {
      localStorage.setItem(`strategy_thresholds_${strategy.businessName || "default"}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const storageKey = `strategy_notes_${strategy.businessName || "default"}`;
  
  const [notes, setNotes] = useState<Record<string, PhaseNote[]>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error reading notes from localStorage", e);
    }
    return {
      phase1: [
        { id: "note-1", text: "Establecer la línea base de los KPIs de optimización web.", createdAt: "15 Jul 2026", isMilestone: true }
      ],
      phase2: [
        { id: "note-2", text: "Coordinar con el equipo creativo para el diseño de activos digitales.", createdAt: "15 Jul 2026", isMilestone: false }
      ],
      phase3: [
        { id: "note-3", text: "Lanzar anuncios en plataformas de prueba seleccionadas.", createdAt: "15 Jul 2026", isMilestone: true }
      ]
    };
  });

  const [newNoteTexts, setNewNoteTexts] = useState<Record<string, string>>({
    phase1: "",
    phase2: "",
    phase3: ""
  });

  const [newNoteMilestone, setNewNoteMilestone] = useState<Record<string, boolean>>({
    phase1: false,
    phase2: false,
    phase3: false
  });

  const addNote = (phase: "phase1" | "phase2" | "phase3") => {
    const text = newNoteTexts[phase].trim();
    if (!text) return;

    const newNote: PhaseNote = {
      id: `note-${Date.now()}`,
      text,
      createdAt: new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }),
      isMilestone: newNoteMilestone[phase]
    };

    const updated = {
      ...notes,
      [phase]: [...(notes[phase] || []), newNote]
    };

    setNotes(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    setNewNoteTexts(prev => ({
      ...prev,
      [phase]: ""
    }));
    setNewNoteMilestone(prev => ({
      ...prev,
      [phase]: false
    }));
  };

  const deleteNote = (phase: "phase1" | "phase2" | "phase3", id: string) => {
    const updated = {
      ...notes,
      [phase]: (notes[phase] || []).filter(n => n.id !== id)
    };
    setNotes(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const getAdjustedValue = (baseValue: number, phaseNum: number) => {
    // Each 1% of volatility reduces the KPI value by up to 0.45% of its base value.
    const reduction = baseValue * (volatility / 100) * 0.45;
    return Math.max(5, Math.min(100, Math.round(baseValue - reduction)));
  };

  const adjPhase1Val = getAdjustedValue(roadmap.phase1.kpiValue, 1);
  const adjPhase2Val = getAdjustedValue(roadmap.phase2.kpiValue, 2);
  const adjPhase3Val = getAdjustedValue(roadmap.phase3.kpiValue, 3);

  const isPhase1Alert = adjPhase1Val < thresholds.phase1;
  const isPhase2Alert = adjPhase2Val < thresholds.phase2;
  const isPhase3Alert = adjPhase3Val < thresholds.phase3;

  useEffect(() => {
    const currentUnder = {
      phase1: isPhase1Alert,
      phase2: isPhase2Alert,
      phase3: isPhase3Alert,
    };

    const triggers: Toast[] = [];

    if (currentUnder.phase1 && !prevUnder.phase1) {
      triggers.push({
        id: `toast-phase1-${Date.now()}`,
        message: `La proyección para la Fase 1 (${roadmap.phase1.name}) de ${adjPhase1Val}% ha caído por debajo de tu umbral del ${thresholds.phase1}%.`,
        type: "warning",
        kpi: roadmap.phase1.kpiName
      });
    }
    if (currentUnder.phase2 && !prevUnder.phase2) {
      triggers.push({
        id: `toast-phase2-${Date.now() + 1}`,
        message: `La proyección para la Fase 2 (${roadmap.phase2.name}) de ${adjPhase2Val}% ha caído por debajo de tu umbral del ${thresholds.phase2}%.`,
        type: "warning",
        kpi: roadmap.phase2.kpiName
      });
    }
    if (currentUnder.phase3 && !prevUnder.phase3) {
      triggers.push({
        id: `toast-phase3-${Date.now() + 2}`,
        message: `La proyección para la Fase 3 (${roadmap.phase3.name}) de ${adjPhase3Val}% ha caído por debajo de tu umbral del ${thresholds.phase3}%.`,
        type: "warning",
        kpi: roadmap.phase3.kpiName
      });
    }

    if (triggers.length > 0) {
      setToasts(prev => [...prev, ...triggers]);
      // Auto dismiss each new toast after 6 seconds
      triggers.forEach(t => {
        setTimeout(() => {
          setToasts(prev => prev.filter(item => item.id !== t.id));
        }, 6000);
      });
    }

    setPrevUnder(currentUnder);
  }, [adjPhase1Val, adjPhase2Val, adjPhase3Val, thresholds.phase1, thresholds.phase2, thresholds.phase3]);

  const alerts = [
    {
      phase: 1,
      name: roadmap.phase1.name,
      kpiName: roadmap.phase1.kpiName,
      value: adjPhase1Val,
      under: isPhase1Alert,
      alertDesc: `La Fase 1 (${roadmap.phase1.name}) rinde al ${adjPhase1Val}%, por debajo del umbral del ${thresholds.phase1}%. Requiere optimización de fidelidad.`
    },
    {
      phase: 2,
      name: roadmap.phase2.name,
      kpiName: roadmap.phase2.kpiName,
      value: adjPhase2Val,
      under: isPhase2Alert,
      alertDesc: `La Fase 2 (${roadmap.phase2.name}) rinde al ${adjPhase2Val}%, por debajo del umbral del ${thresholds.phase2}%. Requiere revisión de presupuesto o campaña.`
    },
    {
      phase: 3,
      name: roadmap.phase3.name,
      kpiName: roadmap.phase3.kpiName,
      value: adjPhase3Val,
      under: isPhase3Alert,
      alertDesc: `La Fase 3 (${roadmap.phase3.name}) rinde al ${adjPhase3Val}%, por debajo del umbral del ${thresholds.phase3}%. Alerta crítica de conversión.`
    }
  ];

  const activeAlerts = alerts.filter(a => a.under);

  const exportToJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(strategy, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    const fileName = `${strategy.businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-roadmap.json`;
    downloadAnchor.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-16 animate-fade-in">
      {/* Toast Notification Container */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto flex items-start gap-3 p-4 bg-[#0d131f]/95 border border-red-500/30 shadow-[0_10px_30px_rgba(239,68,68,0.15)] rounded-2xl text-white font-sans text-xs select-none backdrop-blur-md"
            >
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[9px] text-red-400 uppercase tracking-wider font-bold">
                    Alerta de KPI Cruzado
                  </span>
                  <button
                    onClick={() => removeToast(toast.id)}
                    className="text-white/40 hover:text-white transition-colors p-0.5 rounded cursor-pointer font-bold text-sm"
                  >
                    ×
                  </button>
                </div>
                <p className="text-slate-200 leading-relaxed font-medium">{toast.message}</p>
                <div className="flex items-center gap-1.5 mt-1 font-mono text-[9px] text-[#00f0ff]">
                  <span>Métrica: {toast.kpi}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {/* View Header with neural alignment subtitle */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="text-left">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] ai-pulse"></span>
            <span className="font-mono text-[10px] tracking-widest text-[#00f0ff] uppercase">
              Operational Vector: 30-Day Launch
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl text-white font-extrabold tracking-tight mb-4">
            Execution Roadmap
          </h1>
          <p className="font-sans text-base md:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Aether AI has synthesized your brand&apos;s market position. Below is the phased deployment plan to scale operations from zero to peak efficiency for <strong>{strategy.businessName}</strong>.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto md:justify-end">
          <button
            id="btn-export-json"
            onClick={exportToJson}
            className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00f0ff]/30 text-white hover:text-[#00f0ff] rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-300 shadow-lg cursor-pointer flex-shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Exportar JSON</span>
          </button>

          <button
            id="btn-export-pdf"
            onClick={() => generateStrategyPDF(strategy, notes, thresholds)}
            className="flex items-center gap-2 px-5 py-3 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 border border-[#00f0ff]/25 hover:border-[#00f0ff]/50 text-[#00f0ff] rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-300 shadow-lg cursor-pointer flex-shrink-0"
          >
            <FileText className="w-4 h-4" />
            <span>Exportar PDF</span>
          </button>
        </div>
      </header>

      {/* Alert Monitor & Volatility Simulator Control Section */}
      <section className="glass-card p-6 md:p-8 rounded-[2rem] border border-white/5 bg-white/[0.01] space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Thresholds Config Panel */}
          <div className="flex flex-col p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#00f0ff]" />
                  <h3 className="text-sm font-bold text-white tracking-tight">Umbrales de Alerta de Rendimiento</h3>
                </div>
                <span className="text-[9px] font-mono text-[#00f0ff] bg-[#00f0ff]/10 border border-[#00f0ff]/20 px-2 py-0.5 rounded-full uppercase font-bold">
                  Kpis Personalizados
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Define el nivel mínimo para cada KPI. Los indicadores que caigan por debajo de su umbral se destacarán en rojo y generarán una notificación.
              </p>
            </div>

            {/* Individual Sliders */}
            <div className="space-y-3 pt-1">
              {/* Phase 1 Threshold */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 font-medium font-sans">F1: {roadmap.phase1.kpiName}</span>
                  <span className="font-mono text-[#00f0ff] font-bold">{thresholds.phase1}%</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                  <span className="font-mono text-[9px] text-on-surface-variant">0%</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={thresholds.phase1}
                    onChange={(e) => updateThreshold("phase1", Number(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00f0ff] focus:outline-none"
                  />
                  <span className="font-mono text-[9px] text-on-surface-variant">100%</span>
                </div>
              </div>

              {/* Phase 2 Threshold */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 font-medium font-sans">F2: {roadmap.phase2.kpiName}</span>
                  <span className="font-mono text-[#00f0ff] font-bold">{thresholds.phase2}%</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                  <span className="font-mono text-[9px] text-on-surface-variant">0%</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={thresholds.phase2}
                    onChange={(e) => updateThreshold("phase2", Number(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00f0ff] focus:outline-none"
                  />
                  <span className="font-mono text-[9px] text-on-surface-variant">100%</span>
                </div>
              </div>

              {/* Phase 3 Threshold */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 font-medium font-sans">F3: {roadmap.phase3.kpiName}</span>
                  <span className="font-mono text-[#00f0ff] font-bold">{thresholds.phase3}%</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                  <span className="font-mono text-[9px] text-on-surface-variant">0%</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={thresholds.phase3}
                    onChange={(e) => updateThreshold("phase3", Number(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00f0ff] focus:outline-none"
                  />
                  <span className="font-mono text-[9px] text-on-surface-variant">100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Volatility 'What-if' Slider */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="space-y-1.5 max-w-[300px]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#a855f7]" />
                <h3 className="text-sm font-bold text-white tracking-tight">Volatilidad de Mercado (What-If)</h3>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Simula condiciones dinámicas de mercado. A mayor volatilidad, los KPIs proyectados decrecen en tiempo real debido a la fricción competitiva y de costos.
              </p>
            </div>

            {/* Slider and Value Display */}
            <div className="flex items-center gap-3 bg-white/5 px-4 py-3 rounded-xl border border-white/10 min-w-[240px] w-full md:w-auto">
              <span className="font-mono text-[10px] text-on-surface-variant">0%</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volatility}
                onChange={(e) => setVolatility(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#a855f7] focus:outline-none"
              />
              <span className="font-mono text-[10px] text-on-surface-variant">100%</span>
              <div className="px-2.5 py-1 bg-[#a855f7]/10 border border-[#a855f7]/25 rounded-lg font-mono text-xs text-[#a855f7] font-bold min-w-[48px] text-center">
                {volatility}%
              </div>
            </div>
          </div>
        </div>

        {/* Display Active Alerts if any */}
        {activeAlerts.length > 0 ? (
          <div className="space-y-3 pt-2 border-t border-white/5 animate-fade-in">
            <div className="flex items-center gap-2 text-red-400 font-mono text-[10px] uppercase tracking-wider font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span>Monitoreo Activo: {activeAlerts.length} {activeAlerts.length === 1 ? "alerta activa" : "alertas activas"}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.phase}
                  className="flex items-start gap-3 p-4 bg-red-500/[0.03] border border-red-500/20 rounded-2xl hover:bg-red-500/[0.05] transition-all duration-300"
                >
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-white text-xs">Fase {alert.phase}: {alert.name}</p>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{alert.alertDesc}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="font-mono text-[9px] text-red-400 uppercase bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 font-bold">
                        {alert.kpiName}: {alert.value}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 p-4 bg-emerald-500/[0.03] border border-emerald-500/15 rounded-2xl text-[11px] text-emerald-400 font-mono animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Todos los KPIs operativos se encuentran actualmente en el rango de rendimiento deseado (superior a sus respectivos umbrales personalizados).</span>
          </div>
        )}
      </section>

      {/* Phased Roadmap Timeline Segment */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Phase 1 card (Neural Alignment) */}
        <div className={`glass-card p-8 rounded-2xl border-t-2 relative group hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between ${
          isPhase1Alert 
            ? "border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.15)] bg-red-500/[0.01]" 
            : "border-[#00f0ff] hover:border-[#00f0ff]/80"
        }`}>
          <div>
            {isPhase1Alert && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded text-red-400 font-mono text-[9px] font-bold uppercase tracking-wider animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Alerta KPI</span>
              </div>
            )}
            <div className={`absolute -top-3.5 left-8 px-3 py-1 text-[10px] font-mono font-bold rounded ${
              isPhase1Alert ? "bg-red-500 text-white" : "bg-[#00f0ff] text-[#00363a]"
            }`}>
              {roadmap.phase1.days}
            </div>
            <h3 className="font-display text-2xl text-white font-bold mb-4 mt-1">{roadmap.phase1.name}</h3>
            
            <ul className="space-y-4 text-on-surface-variant text-sm">
              {roadmap.phase1.tasks.map((task, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isPhase1Alert ? "text-red-400" : "text-[#00f0ff]"}`} />
                  <span className="leading-relaxed">{task}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <span className="font-mono text-[10px] tracking-wider block mb-2 text-on-surface-variant uppercase">
              KPI: {roadmap.phase1.kpiName}
            </span>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden flex">
              <div
                className={`h-full ${isPhase1Alert ? "bg-red-500" : "bg-[#00f0ff]"}`}
                style={{ width: `${adjPhase1Val}%` }}
              ></div>
            </div>
            <span className={`text-[10px] font-mono mt-1.5 block text-right ${isPhase1Alert ? "text-red-400" : "text-[#00f0ff]"}`}>{adjPhase1Val}% Progress</span>
            
            {/* Phase 1 Notes Section */}
            <div className="mt-6 pt-5 border-t border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-wider text-slate-400 uppercase font-bold flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-[#00f0ff]" />
                  Notas de Estrategia
                </span>
                <span className="font-mono text-[9px] text-on-surface-variant bg-white/5 px-2 py-0.5 rounded-full">
                  {(notes.phase1 || []).length}
                </span>
              </div>

              {/* Notes List */}
              <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                {((notes.phase1 || []).length === 0) ? (
                  <p className="text-[11px] text-on-surface-variant/60 italic">No hay notas registradas.</p>
                ) : (
                  (notes.phase1 || []).map((note) => (
                    <div key={note.id} className="group/note p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition-colors relative">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs text-slate-200 leading-relaxed break-words pr-4">
                          {note.isMilestone && <span className="inline-block mr-1 text-[9px] font-mono uppercase bg-[#a855f7]/20 text-purple-300 px-1.5 py-0.2 rounded font-bold">Hito</span>}
                          {note.text}
                        </p>
                        <button 
                          onClick={() => deleteNote("phase1", note.id)}
                          className="opacity-0 group-hover/note:opacity-100 p-0.5 hover:bg-red-500/10 rounded text-on-surface-variant hover:text-red-400 transition-all absolute top-1 right-1"
                          title="Eliminar nota"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-[9px] font-mono text-on-surface-variant/50 mt-1 block">{note.createdAt}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Add Note Form */}
              <div className="space-y-1.5 pt-1">
                <input
                  type="text"
                  placeholder="Añadir nota estratégica..."
                  value={newNoteTexts.phase1}
                  onChange={(e) => setNewNoteTexts(prev => ({ ...prev, phase1: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addNote("phase1");
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-on-surface-variant/50 focus:outline-none focus:border-[#00f0ff]/40 transition-colors"
                />
                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newNoteMilestone.phase1}
                      onChange={(e) => setNewNoteMilestone(prev => ({ ...prev, phase1: e.target.checked }))}
                      className="w-3.5 h-3.5 rounded border-white/10 bg-white/5 text-[#00f0ff] focus:ring-0 accent-[#00f0ff] cursor-pointer"
                    />
                    <span className="text-[10px] text-on-surface-variant hover:text-slate-200 transition-colors">Hito de mapa</span>
                  </label>
                  <button
                    onClick={() => addNote("phase1")}
                    disabled={!newNoteTexts.phase1.trim()}
                    className="px-2.5 py-1 bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:hover:bg-white/10 rounded-lg text-white font-mono text-[10px] font-bold transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Guardar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 2 card (Content Prototyping) */}
        <div className={`glass-card p-8 rounded-2xl border-t-2 relative group hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between ${
          isPhase2Alert 
            ? "border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.15)] bg-red-500/[0.01]" 
            : "border-white/10 hover:border-[#00f0ff]/40"
        }`}>
          <div>
            {isPhase2Alert && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded text-red-400 font-mono text-[9px] font-bold uppercase tracking-wider animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Alerta KPI</span>
              </div>
            )}
            <div className={`absolute -top-3.5 left-8 px-3 py-1 text-[10px] font-mono font-bold rounded ${
              isPhase2Alert ? "bg-red-500 text-white" : "bg-white/10 text-on-surface-variant"
            }`}>
              {roadmap.phase2.days}
            </div>
            <h3 className="font-display text-2xl text-white font-bold mb-4 mt-1">{roadmap.phase2.name}</h3>
            
            <ul className="space-y-4 text-on-surface-variant text-sm">
              {roadmap.phase2.tasks.map((task, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <Circle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isPhase2Alert ? "text-red-400/60" : "text-on-surface-variant/50"}`} />
                  <span className="leading-relaxed">{task}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <span className="font-mono text-[10px] tracking-wider block mb-2 text-on-surface-variant uppercase">
              KPI: {roadmap.phase2.kpiName}
            </span>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden flex">
              <div
                className={`h-full ${isPhase2Alert ? "bg-red-500" : "bg-[#00f0ff]"}`}
                style={{ width: `${adjPhase2Val}%` }}
              ></div>
            </div>
            <span className={`text-[10px] font-mono mt-1.5 block text-right ${isPhase2Alert ? "text-red-400" : "text-[#00f0ff]"}`}>{adjPhase2Val}% Potential</span>
            
            {/* Phase 2 Notes Section */}
            <div className="mt-6 pt-5 border-t border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-wider text-slate-400 uppercase font-bold flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-[#00f0ff]" />
                  Notas de Estrategia
                </span>
                <span className="font-mono text-[9px] text-on-surface-variant bg-white/5 px-2 py-0.5 rounded-full">
                  {(notes.phase2 || []).length}
                </span>
              </div>

              {/* Notes List */}
              <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                {((notes.phase2 || []).length === 0) ? (
                  <p className="text-[11px] text-on-surface-variant/60 italic">No hay notas registradas.</p>
                ) : (
                  (notes.phase2 || []).map((note) => (
                    <div key={note.id} className="group/note p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition-colors relative">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs text-slate-200 leading-relaxed break-words pr-4">
                          {note.isMilestone && <span className="inline-block mr-1 text-[9px] font-mono uppercase bg-[#a855f7]/20 text-purple-300 px-1.5 py-0.2 rounded font-bold">Hito</span>}
                          {note.text}
                        </p>
                        <button 
                          onClick={() => deleteNote("phase2", note.id)}
                          className="opacity-0 group-hover/note:opacity-100 p-0.5 hover:bg-red-500/10 rounded text-on-surface-variant hover:text-red-400 transition-all absolute top-1 right-1"
                          title="Eliminar nota"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-[9px] font-mono text-on-surface-variant/50 mt-1 block">{note.createdAt}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Add Note Form */}
              <div className="space-y-1.5 pt-1">
                <input
                  type="text"
                  placeholder="Añadir nota estratégica..."
                  value={newNoteTexts.phase2}
                  onChange={(e) => setNewNoteTexts(prev => ({ ...prev, phase2: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addNote("phase2");
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-on-surface-variant/50 focus:outline-none focus:border-[#00f0ff]/40 transition-colors"
                />
                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newNoteMilestone.phase2}
                      onChange={(e) => setNewNoteMilestone(prev => ({ ...prev, phase2: e.target.checked }))}
                      className="w-3.5 h-3.5 rounded border-white/10 bg-white/5 text-[#00f0ff] focus:ring-0 accent-[#00f0ff] cursor-pointer"
                    />
                    <span className="text-[10px] text-on-surface-variant hover:text-slate-200 transition-colors">Hito de mapa</span>
                  </label>
                  <button
                    onClick={() => addNote("phase2")}
                    disabled={!newNoteTexts.phase2.trim()}
                    className="px-2.5 py-1 bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:hover:bg-white/10 rounded-lg text-white font-mono text-[10px] font-bold transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Guardar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 3 card (Global Activation) */}
        <div className={`glass-card p-8 rounded-2xl border-t-2 relative group hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between ${
          isPhase3Alert 
            ? "border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.15)] bg-red-500/[0.01]" 
            : "border-white/10 hover:border-[#00f0ff]/40"
        }`}>
          <div>
            {isPhase3Alert && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded text-red-400 font-mono text-[9px] font-bold uppercase tracking-wider animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Alerta KPI</span>
              </div>
            )}
            <div className={`absolute -top-3.5 left-8 px-3 py-1 text-[10px] font-mono font-bold rounded ${
              isPhase3Alert ? "bg-red-500 text-white" : "bg-white/10 text-on-surface-variant"
            }`}>
              {roadmap.phase3.days}
            </div>
            <h3 className="font-display text-2xl text-white font-bold mb-4 mt-1">{roadmap.phase3.name}</h3>
            
            <ul className="space-y-4 text-on-surface-variant text-sm">
              {roadmap.phase3.tasks.map((task, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <Circle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isPhase3Alert ? "text-red-400/60" : "text-on-surface-variant/50"}`} />
                  <span className="leading-relaxed">{task}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <span className="font-mono text-[10px] tracking-wider block mb-2 text-on-surface-variant uppercase">
              KPI: {roadmap.phase3.kpiName}
            </span>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden flex">
              <div
                className={`h-full ${isPhase3Alert ? "bg-red-500" : "bg-[#00f0ff]"}`}
                style={{ width: `${adjPhase3Val}%` }}
              ></div>
            </div>
            <span className={`text-[10px] font-mono mt-1.5 block text-right ${isPhase3Alert ? "text-red-400" : "text-[#00f0ff]"}`}>{adjPhase3Val}% Velocity</span>
            
            {/* Phase 3 Notes Section */}
            <div className="mt-6 pt-5 border-t border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-wider text-slate-400 uppercase font-bold flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-[#00f0ff]" />
                  Notas de Estrategia
                </span>
                <span className="font-mono text-[9px] text-on-surface-variant bg-white/5 px-2 py-0.5 rounded-full">
                  {(notes.phase3 || []).length}
                </span>
              </div>

              {/* Notes List */}
              <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                {((notes.phase3 || []).length === 0) ? (
                  <p className="text-[11px] text-on-surface-variant/60 italic">No hay notas registradas.</p>
                ) : (
                  (notes.phase3 || []).map((note) => (
                    <div key={note.id} className="group/note p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition-colors relative">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs text-slate-200 leading-relaxed break-words pr-4">
                          {note.isMilestone && <span className="inline-block mr-1 text-[9px] font-mono uppercase bg-[#a855f7]/20 text-purple-300 px-1.5 py-0.2 rounded font-bold">Hito</span>}
                          {note.text}
                        </p>
                        <button 
                          onClick={() => deleteNote("phase3", note.id)}
                          className="opacity-0 group-hover/note:opacity-100 p-0.5 hover:bg-red-500/10 rounded text-on-surface-variant hover:text-red-400 transition-all absolute top-1 right-1"
                          title="Eliminar nota"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-[9px] font-mono text-on-surface-variant/50 mt-1 block">{note.createdAt}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Add Note Form */}
              <div className="space-y-1.5 pt-1">
                <input
                  type="text"
                  placeholder="Añadir nota estratégica..."
                  value={newNoteTexts.phase3}
                  onChange={(e) => setNewNoteTexts(prev => ({ ...prev, phase3: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addNote("phase3");
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-on-surface-variant/50 focus:outline-none focus:border-[#00f0ff]/40 transition-colors"
                />
                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newNoteMilestone.phase3}
                      onChange={(e) => setNewNoteMilestone(prev => ({ ...prev, phase3: e.target.checked }))}
                      className="w-3.5 h-3.5 rounded border-white/10 bg-white/5 text-[#00f0ff] focus:ring-0 accent-[#00f0ff] cursor-pointer"
                    />
                    <span className="text-[10px] text-on-surface-variant hover:text-slate-200 transition-colors">Hito de mapa</span>
                  </label>
                  <button
                    onClick={() => addNote("phase3")}
                    disabled={!newNoteTexts.phase3.trim()}
                    className="px-2.5 py-1 bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:hover:bg-white/10 rounded-lg text-white font-mono text-[10px] font-bold transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Guardar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trajectory projection Chart */}
      <StrategyDashboard
        strategy={strategy}
        notes={notes}
        thresholds={thresholds}
        volatility={volatility}
      />

      {/* Visual Identity DNA & Styling Palette */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Moodboard container */}
        <div
          className={`lg:col-span-8 glass-card rounded-3xl overflow-hidden min-h-[420px] flex flex-col hover:scale-[1.005] duration-300 ${
            highlightSection === "dna" ? "ring-2 ring-[#00f0ff] scale-[1.01]" : ""
          }`}
        >
          <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
            <div>
              <h2 className="font-display text-2xl text-white font-bold">Visual DNA</h2>
              <p className="font-mono text-[10px] tracking-widest text-on-surface-variant uppercase">
                {visualDna.aesthetic || "Cyber-Minimalist Aesthetic"}
              </p>
            </div>
            <Palette className="w-5 h-5 text-[#00f0ff]" />
          </div>

          {/* Vertical images column split */}
          <div className="grid grid-cols-2 md:grid-cols-4 h-full flex-grow min-h-[220px]">
            {visualDna.images.map((imgUri, index) => (
              <div key={index} className="relative group overflow-hidden h-44 md:h-full border-r border-white/10 last:border-r-0">
                <img
                  src={imgUri}
                  alt={`Moodboard visual identity piece ${index + 1}`}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-mono text-[#00f0ff]">VECTOR {index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Color and Typography columns */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Swatch color swirler */}
          <div className="glass-card p-6 rounded-2xl flex-1 bg-white/[0.01]">
            <h3 className="font-mono text-[11px] text-[#00f0ff] uppercase tracking-widest mb-4">
              Chromatic System
            </h3>

            <div className="flex flex-col gap-3">
              {visualDna.chromatic.map((col, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-2.5 bg-white/5 rounded-xl border border-white/5 hover:border-[#00f0ff]/20 transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex-shrink-0 border border-white/10"
                    style={{
                      backgroundColor: col.hex,
                      boxShadow: col.role === "PRIMARY" ? "0 0 15px rgba(0,240,255,0.4)" : "none"
                    }}
                  ></div>
                  <div>
                    <span className="font-mono text-[9px] text-on-surface-variant tracking-wider uppercase block">
                      {col.role}
                    </span>
                    <span className="text-sm font-semibold text-white">{col.name}</span>
                    <span className="text-xs text-on-surface-variant font-mono block mt-0.5 opacity-70">{col.hex}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typographic fonts checklist */}
          <div className="glass-card p-6 rounded-2xl flex-1 bg-white/[0.01]">
            <h3 className="font-mono text-[11px] text-[#00f0ff] uppercase tracking-widest mb-4">
              Typographic Scale
            </h3>

            <div className="space-y-4">
              <div className="border-b border-white/5 pb-2">
                <p className="font-display text-xl text-white font-bold">Sora</p>
                <p className="text-[9px] text-on-surface-variant font-mono uppercase tracking-widest mt-1">
                  Headlines / Display
                </p>
              </div>

              <div className="border-b border-white/5 pb-2">
                <p className="font-sans text-base text-white">Inter</p>
                <p className="text-[9px] text-on-surface-variant font-mono uppercase tracking-widest mt-1">
                  Body Text / Data
                </p>
              </div>

              <div>
                <p className="font-mono text-sm text-[#00f0ff] tracking-wider font-semibold uppercase">
                  JetBrains Mono
                </p>
                <p className="text-[9px] text-on-surface-variant font-mono uppercase tracking-widest mt-1">
                  Labels / Codes
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom bar for Execution activation */}
      <section className="flex flex-col md:flex-row gap-6 items-center justify-between p-10 glass-card rounded-3xl border-[#00f0ff]/20 glow-cyan bg-white/[0.02]">
        <div className="max-w-md text-center md:text-left">
          <h2 className="font-display text-2xl text-white font-bold mb-2">Initialize Execution</h2>
          <p className="text-on-surface-variant text-sm font-sans leading-relaxed">
            Ready to deploy the neural strategy for <strong>{strategy.businessName}</strong>? Choose your active initial execution vector below.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={onOptimizeClick}
            className="bg-[#00f0ff] text-[#00363a] px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider font-mono font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#00f0ff]/10 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            Optimizar con IA
          </button>

          <button
            onClick={onComposeClick}
            className="bg-white/5 border border-white/10 text-white px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider font-mono font-bold flex items-center gap-2 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            Crear Contenido
          </button>

          <button
            onClick={onLaunchCampaign}
            className="bg-white/5 border border-white/10 text-white px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider font-mono font-bold flex items-center gap-2 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
            Lanzar Campaña
          </button>
        </div>
      </section>
    </div>
  );
}
