/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { TrendingUp, Network, Bot, MessageSquare, Star, ArrowRight, MapPin, Radio, LucideIcon, BarChart2 } from "lucide-react";
import { StrategyData } from "../types";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip
} from "recharts";

interface MatrixViewProps {
  strategy: StrategyData;
  onOptimizeSEO: () => void;
  highlightSection: "none" | "seo" | "sem" | "social" | "dna";
}

// Custom Tooltip component for Recharts RadarChart
interface TooltipPayloadEntry {
  name: string;
  value: number;
  color: string;
  payload: any;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0E0E0F]/95 border border-white/10 p-3 px-3.5 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="font-mono text-[9px] text-[#00f0ff] uppercase tracking-widest mb-1.5 border-b border-white/5 pb-1">
          {payload[0].payload.subject}
        </p>
        <div className="space-y-1 text-[11px]">
          {payload.map((entry: TooltipPayloadEntry, index: number) => (
            <div key={index} className="flex items-center gap-3 justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></span>
                {entry.name}:
              </span>
              <span className="font-mono font-bold text-white">
                {entry.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const COMPETITOR_COLORS = ["#a855f7", "#f97316", "#ec4899", "#10b981", "#3b82f6"];

export default function MatrixView({ strategy, onOptimizeSEO, highlightSection }: MatrixViewProps) {
  const { seoClusters, budgetEfficiency, aiAutomations, socialContent, seoMetrics, competitors } = strategy;
  const [activeCompetitor, setActiveCompetitor] = useState<number | null>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Dynamically prepare radar data comparing Our Brand with competitors
  const radarData = [
    {
      subject: "Cuota de Mercado",
      "Nuestra Marca": 35,
      ...competitors.reduce((acc, comp) => {
        return { ...acc, [comp.name]: comp.marketCapture };
      }, {} as Record<string, number>)
    },
    {
      subject: "Nivel Tecnológico",
      "Nuestra Marca": 95,
      ...competitors.reduce((acc, comp) => {
        return { ...acc, [comp.name]: comp.rating * 20 };
      }, {} as Record<string, number>)
    },
    {
      subject: "Visibilidad Local",
      "Nuestra Marca": seoMetrics.localSearch,
      ...competitors.reduce((acc, comp) => {
        const score = Math.min(100, Math.max(15, Math.round(comp.marketCapture * 0.9 + (comp.name.length % 5) * 4)));
        return { ...acc, [comp.name]: score };
      }, {} as Record<string, number>)
    },
    {
      subject: "Tono de Marca",
      "Nuestra Marca": seoMetrics.brandTone,
      ...competitors.reduce((acc, comp) => {
        const score = Math.min(100, Math.max(20, Math.round(comp.rating * 16 + (comp.name.length % 4) * 3)));
        return { ...acc, [comp.name]: score };
      }, {} as Record<string, number>)
    },
    {
      subject: "Adopción de IA",
      "Nuestra Marca": 90,
      ...competitors.reduce((acc, comp) => {
        const score = Math.min(100, Math.max(10, Math.round(comp.rating * 12 + 15)));
        return { ...acc, [comp.name]: score };
      }, {} as Record<string, number>)
    }
  ];

  return (
    <div className="space-y-12 animate-fade-in text-left">
      {/* View Header with Neural Opp statistics */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="font-mono text-[10px] text-[#00f0ff] mb-2 block tracking-widest uppercase">
            Executive Overview
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-white font-extrabold leading-tight">
            Market Domination <span className="text-[#00f0ff] glow-text">Matrix</span>
          </h1>
        </div>

        {/* Global Opportunity metric tag */}
        <div className="flex gap-4">
          <div className="glass-card px-6 py-4 rounded-2xl flex items-center gap-4 bg-white/[0.02]">
            <div>
              <p className="text-on-surface-variant text-[9px] font-mono tracking-widest uppercase">
                GLOBAL OPPORTUNITY
              </p>
              <p className="text-2xl font-bold text-[#00f0ff] tracking-tight">94.2%</p>
            </div>
            <div className="w-12 h-12 rounded-full border border-[#00f0ff]/30 flex items-center justify-center bg-[#00f0ff]/5">
              <TrendingUp className="w-5 h-5 text-[#00f0ff] ai-pulse" />
            </div>
          </div>
        </div>
      </header>

      {/* Bento Grid layout representing Screen 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 1. SEO & SEM Intelligence Panel */}
        <div
          className={`lg:col-span-8 glass-card p-8 rounded-[2rem] relative overflow-hidden group hover:scale-[1.005] duration-300 ${
            highlightSection === "seo" || highlightSection === "sem" ? "ring-2 ring-[#00f0ff] scale-[1.008]" : ""
          }`}
        >
          {/* Faded giant back-icon decoration */}
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <TrendingUp className="w-60 h-60 text-[#00f0ff]" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">SEO &amp; SEM Intelligence</h3>
                <p className="text-on-surface-variant text-sm mt-1">Hyper-targeted keyword clusters &amp; positioning</p>
              </div>
              <span className="bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20 text-[9px] font-mono tracking-widest px-3 py-1 rounded-full uppercase">
                LIVE ANALYSIS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Dominant topic list */}
              <div className="space-y-3">
                <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
                  DOMINANT CLUSTERS
                </p>
                <div className="space-y-2">
                  {seoClusters.map((cluster, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-3.5 bg-white/5 rounded-xl border border-white/5 hover:border-[#00f0ff]/20 transition-all font-sans"
                    >
                      <span className="text-sm font-medium text-white">{cluster.name}</span>
                      <span className="text-[#00f0ff] font-mono text-xs font-semibold">{cluster.growth}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget Efficiency Interactive custom bar chart representation */}
              <div className="md:col-span-2 glass-card bg-black/30 p-6 rounded-2xl border-white/5">
                <p className="font-mono text-[10px] text-on-surface-variant mb-4 uppercase tracking-widest">
                  BUDGET EFFICIENCY MODEL
                </p>

                {/* Animated bar columns */}
                <div className="flex items-end gap-3 h-32 mb-4">
                  {budgetEfficiency.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col justify-end items-center h-full relative group/bar">
                      {/* Interactive popovers */}
                      {hoveredBar === idx && (
                        <div className="absolute -top-10 bg-black border border-white/10 text-[10px] text-[#00f0ff] px-2 py-1 rounded shadow-xl z-20 font-mono">
                          {item.height}%
                        </div>
                      )}
                      
                      <div
                        className="w-full bg-[#00f0ff]/20 rounded-t-lg hover:bg-[#00f0ff]/70 transition-all cursor-pointer relative"
                        style={{ height: `${item.height}%` }}
                        onMouseEnter={() => setHoveredBar(idx)}
                        onMouseLeave={() => setHoveredBar(null)}
                      >
                        {item.height === 100 && (
                          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white ai-pulse"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <p className="text-xs text-on-surface-variant font-sans italic opacity-85">
                    Recommended allocation for {strategy.businessName}
                  </p>
                  <button
                    onClick={onOptimizeSEO}
                    className="text-[#00f0ff] text-xs font-mono font-bold flex items-center gap-1 hover:text-[#57fff5] uppercase tracking-wider cursor-pointer group"
                  >
                    OPTIMIZE
                    <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. AI Automations Panel */}
        <div className="lg:col-span-4 glass-card p-8 rounded-[2rem] flex flex-col justify-between hover:scale-[1.005] duration-300">
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight mb-4">AI Automations</h3>
            
            <div className="space-y-4">
              {aiAutomations.map((agent, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex items-center gap-4 transition-all cursor-pointer ${
                    agent.filledIcon
                      ? "bg-[#00f0ff]/5 border-[#00f0ff]/20 hover:bg-[#00f0ff]/10"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      agent.filledIcon ? "bg-[#00f0ff] text-[#00363a]" : "bg-white/15 text-on-surface-variant font-semibold"
                    }`}
                  >
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">{agent.name}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-mono mt-0.5">
                      {agent.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-on-surface-variant text-xs mb-3 font-sans opacity-80">
              Monthly labor hours saved via AI agents:
            </p>
            <div className="text-3xl font-bold text-white tracking-tight">
              1,240 <span className="text-[#00f0ff] text-sm font-mono tracking-widest uppercase">HRS</span>
            </div>
          </div>
        </div>

        {/* 3. Social & Content Planner card */}
        <div
          className={`lg:col-span-5 glass-card p-8 rounded-[2rem] h-[520px] flex flex-col overflow-hidden relative hover:scale-[1.005] duration-300 ${
            highlightSection === "social" ? "ring-2 ring-[#00f0ff] scale-[1.008]" : ""
          }`}
        >
          {/* Overlay Background image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHoPFf_jL0F2wsuTx5Pp6idRC0PLEHgSFGMhtRD3LdWhe7OGBhSXXswJt43BWMKcgOzk68gIZa-M3g2YWRyzoIpw-GweQXrCmPgJ2YqcmSHaO3f9G8NDjs9IYUnYrmVbiOge8UG3rGqbXHjOqoZkMnRjMXTqYcOAnB3XnCZaWR0btZUwo8bS5nvC2TEI3ktwg2QMvh2IcLj4GqTsu0a-NP5u6oPgBkrI8kMgQgHMJFodvIXESWx9DM99PvqB7Om4bm5mhHJoY7rRw"
              alt="Social Media Control Room Overlay"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-15"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/85 to-transparent"></div>
          </div>

          <div className="relative z-10 flex flex-col h-full">
            <h3 className="text-2xl font-bold text-white tracking-tight">Social &amp; Content</h3>
            <p className="text-on-surface-variant text-sm mt-1 mb-8">Viral hooks &amp; platform-specific pacing</p>

            {/* Platform planning items list */}
            <div className="space-y-6 flex-1">
              {socialContent.map((soc, idx) => (
                <div key={idx} className="border-l-2 border-[#00f0ff] pl-4 space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-white">{soc.platform}</p>
                    <span className="text-[10px] font-mono text-[#00f0ff] tracking-widest uppercase">{soc.reach}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant">{soc.subtitle}</p>
                  <p className="text-[11px] font-mono text-white/40 italic">Hook: &quot;{soc.hook}&quot;</p>
                </div>
              ))}
            </div>

            {/* Bottom aggregate metrics panel */}
            <div className="grid grid-cols-2 gap-4 mt-auto">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-center">
                <p className="text-[9px] font-mono text-on-surface-variant mb-1 uppercase tracking-wider">
                  CONTENT VELOCITY
                </p>
                <p className="text-base font-bold text-white">4.2 posts/day</p>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-center">
                <p className="text-[9px] font-mono text-on-surface-variant mb-1 uppercase tracking-wider">
                  AVG. ENGAGEMENT
                </p>
                <p className="text-base font-bold text-[#00f0ff]">12.8%</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Geo-Branding Localization Section */}
        <div className="lg:col-span-7 glass-card rounded-[2rem] overflow-hidden flex flex-col hover:scale-[1.005] duration-300">
          <div className="p-8 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Geo-Branding Optimization</h3>
                <p className="text-on-surface-variant text-sm mt-1">Hyper-local Google Maps dominance</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] ai-pulse"></div>
                <span className="text-[10px] font-mono tracking-widest text-on-surface uppercase pr-1">
                  LIVE TRACKING
                </span>
              </div>
            </div>
          </div>

          {/* Metropolitan building 3D location map area */}
          <div className="relative flex-1 min-h-[300px]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNdOZ-O9gswrihoBKNKJ3-7qtmGllNIdemnGBWOhdVUiNQEloYJ-T4_PdHNyoeJpwnG6MSfiX-1kqPZKka6IB7ihPWgdT6poUYNQPSIHzXAiOIOm-qr6cGdzxVfhNAY7xr_izQFcnDM5929avDlqeHz3QdRDxPBQhDdrlhP5QTzZ5BBUrNME8cP7HENKrEZxezPQIkizBmgVknPnCSETvoBXYc0pQWNu2baqvW71pxDrXVyk1CTJ6sw-hWrvgSqKk4Dd4JoPDCNIs"
              alt="Metropolitan isometric location heatmap"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 pointer-events-none"></div>

            {/* Floating optimization meters overlay */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 glass-card p-4 rounded-xl bg-black/70 backdrop-blur-md border-white/10">
                <p className="text-[9px] font-mono text-on-surface-variant mb-2 uppercase tracking-widest">
                  BRAND TONE SATURATION
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-grow bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#00f0ff] h-full"
                      style={{ width: `${seoMetrics.brandTone}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-[#00f0ff]">{seoMetrics.brandTone}%</span>
                </div>
              </div>

              <div className="flex-1 glass-card p-4 rounded-xl bg-black/70 backdrop-blur-md border-white/10">
                <p className="text-[10px] font-mono text-on-surface-variant mb-2 uppercase tracking-widest">
                  LOCAL SEARCH SOV
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-grow bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#00f0ff] h-full"
                      style={{ width: `${seoMetrics.localSearch}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-[#00f0ff]">{seoMetrics.localSearch}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Competitor Intelligence analytical table and Spider comparison chart */}
        <div className="lg:col-span-12 glass-card p-8 rounded-[2rem] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Table on the left */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Competitor Intelligence</h3>
                  <p className="text-xs text-on-surface-variant mt-1">Cross-market baseline tracking matrix</p>
                </div>
                
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-white/5 text-[9px] tracking-widest font-mono text-white rounded rounded-full border border-white/15 cursor-pointer uppercase">
                    MONTHLY
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 pb-4">
                      <th className="pb-4 font-mono text-[9px] text-[#00f0ff] uppercase tracking-widest pl-2">ENTITY</th>
                      <th className="pb-4 font-mono text-[9px] text-on-surface-variant uppercase tracking-widest">MARKET CAPTURE</th>
                      <th className="pb-4 font-mono text-[9px] text-on-surface-variant uppercase tracking-widest">TECH STACK RATING</th>
                      <th className="pb-4 font-mono text-[9px] text-on-surface-variant uppercase tracking-widest">OPPORTUNITY LEVEL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {competitors.map((comp, idx) => (
                      <tr
                        key={idx}
                        onClick={() => setActiveCompetitor(activeCompetitor === idx ? null : idx)}
                        className={`group cursor-pointer transition-colors ${
                          activeCompetitor === idx ? "bg-white/[0.03]" : "hover:bg-white/[0.01]"
                        }`}
                      >
                        <td className="py-5 font-bold text-white flex items-center gap-3 pl-2">
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#00f0ff] font-mono text-sm uppercase">
                            {comp.name.charAt(0)}
                          </div>
                          <span className="group-hover:text-[#00f0ff] transition-colors">{comp.name}</span>
                        </td>

                        <td className="py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-32 bg-white/5 h-1.5 rounded-full overflow-hidden flex">
                              <div
                                className="bg-[#00f0ff]/40 h-full group-hover:bg-[#00f0ff] transition-all"
                                style={{ width: `${comp.marketCapture}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-mono text-white">{comp.marketCapture}%</span>
                          </div>
                        </td>

                        <td className="py-5">
                          <div className="flex gap-0.5 text-[#00f0ff]">
                            {Array.from({ length: 5 }).map((_, stIdx) => (
                              <Star
                                key={stIdx}
                                className={`w-3.5 h-3.5 ${
                                  stIdx < comp.rating ? "fill-[#00f0ff]" : "text-white/20"
                                }`}
                              />
                            ))}
                          </div>
                        </td>

                        <td className="py-5">
                          <span
                            className={`text-[9px] tracking-widest uppercase font-mono px-3 py-1.5 rounded-full font-bold border ${
                              comp.statusColor === "green"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-400/25"
                                : comp.statusColor === "red"
                                ? "bg-red-500/10 text-red-400 border-red-400/25"
                                : "bg-amber-500/10 text-amber-400 border-amber-400/25"
                            }`}
                          >
                            {comp.statusText}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Radar Comparison Chart on the right */}
            <div className="lg:col-span-5 xl:col-span-4 bg-white/[0.01] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[9px] text-[#00f0ff] uppercase tracking-widest block mb-1">
                  Radar Alignment Comparison
                </span>
                <h4 className="text-lg font-bold text-white">Análisis Competitivo Cruzado</h4>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Comparación de rendimiento contra competidores identificados.
                </p>
              </div>

              {/* Spider Chart Container */}
              <div className="w-full h-[260px] flex items-center justify-center my-4 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "#94a3b8", fontSize: 9, fontFamily: "monospace" }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fill: "#475569", fontSize: 7 }}
                      stroke="rgba(255,255,255,0.04)"
                    />
                    
                    {/* Render competitors' radars with opacity or highlight */}
                    {competitors.map((comp, idx) => {
                      const isFocused = activeCompetitor === idx;
                      const isAnyFocused = activeCompetitor !== null;
                      
                      const strokeColor = COMPETITOR_COLORS[idx % COMPETITOR_COLORS.length];
                      const strokeWidth = isFocused ? 2 : (isAnyFocused ? 0.5 : 1.5);
                      const opacity = isFocused ? 0.25 : (isAnyFocused ? 0.01 : 0.08);
                      const strokeOpacity = isFocused ? 1 : (isAnyFocused ? 0.15 : 0.6);

                      return (
                        <Radar
                          key={comp.name}
                          name={comp.name}
                          dataKey={comp.name}
                          stroke={strokeColor}
                          fill={strokeColor}
                          fillOpacity={opacity}
                          strokeWidth={strokeWidth}
                          strokeOpacity={strokeOpacity}
                        />
                      );
                    })}

                    {/* Always render Our Brand's radar highlight */}
                    <Radar
                      name="Nuestra Marca"
                      dataKey="Nuestra Marca"
                      stroke="#00f0ff"
                      fill="#00f0ff"
                      fillOpacity={0.25}
                      strokeWidth={2}
                      strokeOpacity={1}
                    />

                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-[11px] text-on-surface-variant text-center bg-white/5 py-2.5 px-3 rounded-xl border border-white/5">
                {activeCompetitor !== null ? (
                  <span>
                    Comparando con <strong className="text-[#00f0ff]">{competitors[activeCompetitor].name}</strong>. Haz clic en otro competidor para cambiar.
                  </span>
                ) : (
                  <span>
                    Haz clic en un competidor en la tabla de la izquierda para aislar la comparativa.
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
