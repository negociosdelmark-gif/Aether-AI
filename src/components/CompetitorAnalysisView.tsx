/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Target, 
  Award, 
  Zap, 
  Sliders, 
  Plus, 
  Trash2, 
  Sparkles, 
  Users, 
  Shield, 
  BarChart3, 
  LineChart, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  HelpCircle,
  PieChart
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { StrategyData, Competitor } from "../types";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Cell,
  BarChart,
  Bar,
  Legend,
  ReferenceLine
} from "recharts";

interface CompetitorAnalysisViewProps {
  strategy: StrategyData;
}

export default function CompetitorAnalysisView({ strategy }: CompetitorAnalysisViewProps) {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  
  // Local states for Our Brand benchmarks
  const [ourMarketCapture, setOurMarketCapture] = useState<number>(35);
  const [ourRating, setOurRating] = useState<number>(4.2);
  
  // Form states for adding a new competitor
  const [newCompName, setNewCompName] = useState("");
  const [newCompCapture, setNewCompCapture] = useState(25);
  const [newCompRating, setNewCompRating] = useState(3.5);
  const [newCompStatus, setNewCompStatus] = useState<"green" | "yellow" | "red">("yellow");
  const [newCompStatusText, setNewCompStatusText] = useState("COMPETITOR");
  const [showAddForm, setShowAddForm] = useState(false);

  // Active chart type toggle
  const [chartType, setChartType] = useState<"matrix" | "compare">("matrix");

  // Initialize competitors from strategy data
  useEffect(() => {
    if (strategy.competitors) {
      setCompetitors(strategy.competitors);
    }
  }, [strategy.competitors]);

  // Combine our brand + competitors for chart visualization
  const getCombinedData = () => {
    const ourData = {
      name: `${strategy.businessName} (Tú)`,
      marketCapture: ourMarketCapture,
      rating: ourRating,
      statusText: "LÍDER EN ASCENSO",
      statusColor: "green" as const,
      isSelf: true
    };

    return [
      ourData,
      ...competitors.map(c => ({
        ...c,
        isSelf: false
      }))
    ];
  };

  const combinedData = getCombinedData();

  // Add Competitor handler
  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName.trim()) return;

    const newComp: Competitor = {
      name: newCompName,
      marketCapture: Number(newCompCapture),
      rating: Number(newCompRating),
      statusText: newCompStatusText.toUpperCase() || "ACTIVE RIVAL",
      statusColor: newCompStatus
    };

    setCompetitors([...competitors, newComp]);
    
    // Reset form fields
    setNewCompName("");
    setNewCompCapture(25);
    setNewCompRating(3.5);
    setNewCompStatus("yellow");
    setNewCompStatusText("COMPETITOR");
    setShowAddForm(false);
  };

  // Delete Competitor handler
  const handleDeleteCompetitor = (nameToDelete: string) => {
    setCompetitors(competitors.filter(c => c.name !== nameToDelete));
  };

  // Determine tactical positioning of our brand based on benchmarks
  const getBrandQuadrant = () => {
    if (ourMarketCapture >= 50 && ourRating >= 4) {
      return {
        quadrant: "Líder de Mercado (Market Leader)",
        desc: "Dominas la cuota de mercado y mantienes la reputación de marca más alta. Tu prioridad es defender tu posición mediante innovación constante y optimización de conversión.",
        color: "text-emerald-400"
      };
    } else if (ourMarketCapture < 50 && ourRating >= 4) {
      return {
        quadrant: "Retador Innovador (High-Quality Challenger)",
        desc: "Tu producto posee un estándar de excelencia y fidelidad excelente, pero tu cuota de mercado es reducida. Necesitas acelerar tus campañas de marketing sem y SEO orgánico para capturar leads masivamente.",
        color: "text-[#00f0ff]"
      };
    } else if (ourMarketCapture >= 50 && ourRating < 4) {
      return {
        quadrant: "Gigante Tradicional (Volume Player)",
        desc: "Tienes una base de clientes masiva pero tu satisfacción o fidelidad de marca flaquea. Los competidores ágiles podrían robarte cuota de mercado si no modernizas tu experiencia de usuario.",
        color: "text-amber-400"
      };
    } else {
      return {
        quadrant: "Nicho Emergente (Emerging Niche)",
        desc: "Estás comenzando tanto en cuota como en autoridad de marca. Concéntrate en resolver un cuello de botella específico de tus clientes antes de intentar un escalamiento masivo.",
        color: "text-rose-400"
      };
    }
  };

  const positioningInfo = getBrandQuadrant();

  // Custom tooltips
  interface ChartTooltipProps {
    active?: boolean;
    payload?: any[];
  }

  const MatrixTooltip = ({ active, payload }: ChartTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0c131f]/95 border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-md min-w-[220px]">
          <div className="flex items-center justify-between gap-4 mb-2">
            <span className={`font-sans text-xs font-bold ${data.isSelf ? "text-[#00f0ff]" : "text-white"}`}>
              {data.name}
            </span>
            {data.isSelf && (
              <span className="px-2 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] text-[8px] font-mono uppercase font-black">
                TÚ
              </span>
            )}
          </div>
          <div className="space-y-1.5 font-mono text-[10px]">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Cuota de Mercado:</span>
              <span className="text-white font-bold">{data.marketCapture}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Reputación / Rating:</span>
              <span className="text-white font-bold">{data.rating} ★</span>
            </div>
            <div className="border-t border-white/5 pt-1.5 mt-1.5 flex justify-between items-center">
              <span className="text-on-surface-variant/70">Estado:</span>
              <span className={`font-bold text-[9px] uppercase ${
                data.statusColor === "green" ? "text-emerald-400" :
                data.statusColor === "yellow" ? "text-amber-400" : "text-rose-400"
              }`}>
                {data.statusText}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header section */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1.5">
            <Users className="w-4 h-4 text-[#00f0ff] animate-pulse" />
            <span className="font-mono text-[9px] tracking-widest text-[#00f0ff] uppercase">
              Benchmarking Estratégico
            </span>
          </div>
          <h1 className="font-display text-4xl text-white font-extrabold tracking-tight">
            Análisis de Competidores
          </h1>
          <p className="text-sm text-on-surface-variant mt-1.5 max-w-2xl leading-relaxed">
            Visualiza el posicionamiento competitivo de tu marca en el mercado. Utiliza los controles dinámicos para simular la evolución de tus métricas y calibrar tus ventajas diferenciales.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 self-start md:self-end">
          <button
            onClick={() => setChartType("matrix")}
            className={`px-4 py-2 text-xs font-mono rounded-lg transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
              chartType === "matrix"
                ? "bg-[#00f0ff] text-[#00363a] font-bold shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            Matriz de Posicionamiento
          </button>
          <button
            onClick={() => setChartType("compare")}
            className={`px-4 py-2 text-xs font-mono rounded-lg transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
              chartType === "compare"
                ? "bg-[#00f0ff] text-[#00363a] font-bold shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Comparativa de Cuotas
          </button>
        </div>
      </header>

      {/* Main Interactive Workspace Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visual Graph Panel */}
        <div className="lg:col-span-2 glass-card p-6 md:p-8 rounded-[2rem] border border-white/5 bg-white/[0.01] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
              <h3 className="font-mono text-[9px] tracking-widest text-[#00f0ff] uppercase">
                {chartType === "matrix" ? "Mapa de Cuadrantes 2D" : "Cuota de Mercado vs Reputación"}
              </h3>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {chartType === "matrix" ? "Posicionamiento en el Mercado" : "Análisis Comparativo Directo"}
            </h3>
          </div>

          <div className="w-full h-[360px] relative my-6">
            {chartType === "matrix" ? (
              <div className="w-full h-full relative">
                {/* Quadrant grid backgrounds directly drawn inside the absolute container for a beautiful UI */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none opacity-[0.015] border-collapse">
                  <div className="border-r border-b border-white flex items-start p-4 font-mono text-[9px] text-white">Retadores</div>
                  <div className="border-b border-white flex items-start justify-end p-4 font-mono text-[9px] text-white">Líderes</div>
                  <div className="border-r border-white flex items-end p-4 font-mono text-[9px] text-white">Nicho</div>
                  <div className="flex items-end justify-end p-4 font-mono text-[9px] text-white">Seguidores</div>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis 
                      type="number" 
                      dataKey="marketCapture" 
                      name="Cuota de Mercado" 
                      unit="%" 
                      domain={[0, 100]}
                      tick={{ fill: "#94a3b8", fontSize: 9, fontFamily: "monospace" }}
                      stroke="rgba(255,255,255,0.08)"
                    />
                    <YAxis 
                      type="number" 
                      dataKey="rating" 
                      name="Rating / Reputación" 
                      domain={[1, 5]}
                      tickCount={5}
                      tick={{ fill: "#94a3b8", fontSize: 9, fontFamily: "monospace" }}
                      stroke="rgba(255,255,255,0.08)"
                    />
                    <ZAxis type="number" range={[150, 400]} />
                    <RechartsTooltip content={<MatrixTooltip />} />

                    {/* Median Lines to split quadrants */}
                    <ReferenceLine x={50} stroke="rgba(255, 255, 255, 0.08)" strokeWidth={1} strokeDasharray="4 4" />
                    <ReferenceLine y={3} stroke="rgba(255, 255, 255, 0.08)" strokeWidth={1} strokeDasharray="4 4" />

                    <Scatter name="Competidores" data={combinedData}>
                      {combinedData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.isSelf ? "#00f0ff" : index % 2 === 0 ? "#a855f7" : "#f43f5e"}
                          style={{
                            filter: entry.isSelf ? "drop-shadow(0 0 8px rgba(0,240,255,0.6))" : "none",
                            cursor: "pointer"
                          }}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={combinedData}
                  margin={{ top: 20, right: 30, left: -10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: "#94a3b8", fontSize: 9, fontFamily: "monospace" }}
                    stroke="rgba(255,255,255,0.08)"
                  />
                  <YAxis 
                    yAxisId="left"
                    orientation="left"
                    stroke="#00f0ff"
                    tick={{ fill: "#00f0ff", fontSize: 9, fontFamily: "monospace" }}
                    tickFormatter={(val) => `${val}%`}
                    domain={[0, 100]}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#a855f7"
                    tick={{ fill: "#a855f7", fontSize: 9, fontFamily: "monospace" }}
                    domain={[0, 5]}
                  />
                  <RechartsTooltip content={<MatrixTooltip />} />
                  <Legend 
                    wrapperStyle={{ fontSize: "10px", fontFamily: "monospace", color: "#94a3b8" }}
                    verticalAlign="bottom"
                    height={36}
                  />
                  <Bar yAxisId="left" dataKey="marketCapture" name="Cuota de Mercado (%)" fill="#00f0ff" radius={[4, 4, 0, 0]}>
                    {combinedData.map((entry, index) => (
                      <Cell 
                        key={`cell-mc-${index}`} 
                        fill={entry.isSelf ? "#00f0ff" : "rgba(0, 240, 255, 0.4)"} 
                      />
                    ))}
                  </Bar>
                  <Bar yAxisId="right" dataKey="rating" name="Rating de Marca (1-5)" fill="#a855f7" radius={[4, 4, 0, 0]}>
                    {combinedData.map((entry, index) => (
                      <Cell 
                        key={`cell-rt-${index}`} 
                        fill={entry.isSelf ? "#a855f7" : "rgba(168, 85, 247, 0.4)"} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="flex items-center gap-6 text-[10px] font-mono text-on-surface-variant/70 border-t border-white/5 pt-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] ring-4 ring-[#00f0ff]/20 animate-pulse" /> Tu Marca
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" /> Rivales Clave
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]" /> Rivales Adicionales
            </span>
          </div>
        </div>

        {/* Brand Tuning Sidebar & Stats */}
        <div className="glass-card p-6 md:p-8 rounded-[2rem] border border-white/5 bg-white/[0.01] flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#00f0ff]" />
                <h3 className="text-sm font-bold text-white tracking-tight uppercase">Calibrar Posición</h3>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Ajusta las estimaciones de rendimiento actual y proyectado de <strong>{strategy.businessName}</strong> para evaluar tu categoría en el mapa.
              </p>
            </div>

            {/* Slider 1: Our Market Share */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Nuestra Cuota (%)</span>
                <span className="font-mono text-[#00f0ff] font-bold">{ourMarketCapture}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="95"
                value={ourMarketCapture}
                onChange={(e) => setOurMarketCapture(Number(e.target.value))}
                className="w-full accent-[#00f0ff] bg-white/10 rounded-lg appearance-none h-1 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono text-on-surface-variant/60">
                <span>Nicho (5%)</span>
                <span>Frontera (50%)</span>
                <span>Monopolio (95%)</span>
              </div>
            </div>

            {/* Slider 2: Our Rating */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Reputación / Rating</span>
                <span className="font-mono text-[#a855f7] font-bold">{ourRating} ★</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={ourRating}
                onChange={(e) => setOurRating(Number(e.target.value))}
                className="w-full accent-[#a855f7] bg-white/10 rounded-lg appearance-none h-1 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono text-on-surface-variant/60">
                <span>Crítico (1.0)</span>
                <span>Estándar (3.0)</span>
                <span>Excelente (5.0)</span>
              </div>
            </div>
          </div>

          {/* AI Positioning Feedback Box */}
          <div className="p-4 bg-[#00f0ff]/5 rounded-2xl border border-[#00f0ff]/10 text-xs text-white/95 space-y-2">
            <div className="flex items-center gap-1.5 text-[#00f0ff] font-mono text-[10px] uppercase font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Análisis de Cuadrante AI</span>
            </div>
            <div className="space-y-1.5">
              <h4 className={`font-bold ${positioningInfo.color} text-xs tracking-tight`}>
                {positioningInfo.quadrant}
              </h4>
              <p className="text-[11px] leading-relaxed text-on-surface-variant">
                {positioningInfo.desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Competitor List & Management */}
      <section className="glass-card p-6 md:p-8 rounded-[2rem] border border-white/5 bg-white/[0.01]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-display text-lg font-bold text-white">Gestionar Competidores</h3>
            <p className="text-xs text-on-surface-variant">Modifica, añade o elimina competidores del mapa estratégico para calibrar tus proyecciones.</p>
          </div>
          
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-[#00f0ff] hover:bg-[#00d0df] text-[#00363a] rounded-xl text-xs font-mono font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            {showAddForm ? "Cerrar Panel" : "Añadir Competidor"}
          </button>
        </div>

        {/* Expandable Add Competitor Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleAddCompetitor}
              className="mb-8 p-6 bg-white/[0.02] border border-white/5 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4 overflow-hidden"
            >
              <div className="space-y-1 md:col-span-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">Nombre de la Marca</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Apex Solutions"
                  value={newCompName}
                  onChange={(e) => setNewCompName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">Cuota de Mercado (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newCompCapture}
                  onChange={(e) => setNewCompCapture(Math.max(0, Math.min(100, Number(e.target.value))))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">Rating (1.0 - 5.0)</label>
                <input
                  type="number"
                  min="1.0"
                  max="5.0"
                  step="0.1"
                  value={newCompRating}
                  onChange={(e) => setNewCompRating(Math.max(1, Math.min(5, Number(e.target.value))))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div className="space-y-1 flex flex-col justify-end">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-lg text-xs font-mono font-bold transition-all duration-300 cursor-pointer h-[38px]"
                >
                  Confirmar Registro
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Competitors Listing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Your Brand Preview Card */}
          <div className="p-5 rounded-2xl border border-[#00f0ff]/30 bg-[#00f0ff]/5 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-[8px] uppercase tracking-wider text-[#00f0ff] font-bold">
                    TU EMPRESA
                  </span>
                  <h4 className="font-display text-base font-extrabold text-white">{strategy.businessName}</h4>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[8px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  EN CRECIMIENTO
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Posicionamiento simulado interactivo para coordinar tácticas de escalamiento.
              </p>
            </div>

            <div className="flex justify-between items-end pt-4 border-t border-white/5 mt-4">
              <div>
                <span className="text-[9px] font-mono text-on-surface-variant block">Cuota</span>
                <span className="text-xl font-display font-black text-[#00f0ff]">{ourMarketCapture}%</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-mono text-on-surface-variant block">Autoridad</span>
                <span className="text-xl font-display font-black text-slate-300">{ourRating} ★</span>
              </div>
            </div>
          </div>

          {/* Regular Competitors List */}
          {competitors.map((comp, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:border-white/10 transition-all flex flex-col justify-between min-h-[160px] group relative">
              {/* Delete action */}
              <button
                onClick={() => handleDeleteCompetitor(comp.name)}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 cursor-pointer"
                title="Eliminar competidor"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <div className="space-y-2">
                <div>
                  <span className="font-mono text-[8px] uppercase tracking-wider text-slate-500">
                    COMPETIDOR REGISTRADO
                  </span>
                  <h4 className="font-display text-base font-bold text-white tracking-tight">{comp.name}</h4>
                </div>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    comp.statusColor === "green" ? "bg-emerald-400" :
                    comp.statusColor === "yellow" ? "bg-amber-400" : "bg-rose-400"
                  }`} />
                  <span className="text-[9px] font-mono tracking-wide uppercase text-slate-400 font-semibold">
                    {comp.statusText}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-end pt-4 border-t border-white/5 mt-4">
                <div>
                  <span className="text-[9px] font-mono text-on-surface-variant block">Cuota</span>
                  <span className="text-xl font-display font-black text-white">{comp.marketCapture}%</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-mono text-on-surface-variant block">Autoridad</span>
                  <span className="text-xl font-display font-black text-slate-300">{comp.rating} ★</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommendations & Playbook */}
      <section className="glass-card p-6 md:p-8 rounded-[2rem] border border-white/5 bg-white/[0.01]">
        <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-[#00f0ff]" />
          Manual de Juego Táctico (Strategic Playbook)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-on-surface-variant">
          <div className="space-y-3 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-[#00f0ff] font-mono text-[10px] uppercase font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Ataque de Cuota de Mercado</span>
            </div>
            <ul className="list-disc pl-4 space-y-2">
              <li><strong>Desplazamiento del Nexus</strong>: Si tu autoridad de marca supera el 4.0, utiliza campañas SEO focalizadas en "Neural Search" y testimonios automatizados para posicionarte como la alternativa premium frente a gigantes de baja innovación.</li>
              <li><strong>Segmentación de Nicho</strong>: Desarrolla un flujo de automatización (F3) específicamente para capturar leads desencantados de Lumina Analytics, apalancando tu fidelidad de conversión.</li>
            </ul>
          </div>
          <div className="space-y-3 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-rose-400 font-mono text-[10px] uppercase font-bold">
              <AlertCircle className="w-4 h-4" />
              <span>Protección y Defensa de Margen</span>
            </div>
            <ul className="list-disc pl-4 space-y-2">
              <li><strong>Barreras de Salida</strong>: Consolida tu retención de marca configurando sistemas automatizados que ofrezcan valor constante semanalmente, de modo que los rivales tradicionales no puedan igualar la velocidad de respuesta.</li>
              <li><strong>Calidad vs Volumen</strong>: Evita competir únicamente en precio con NEXUS CORE (72% share). Protege tu margen destacando la precisión superior de tu motor de consultoría AI.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
