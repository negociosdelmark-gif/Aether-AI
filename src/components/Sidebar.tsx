/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, Flame, Share2, Award, Plus, Compass, BarChart3, Users, Sliders } from "lucide-react";

interface SidebarProps {
  onViewChange: (view: "network" | "operations" | "growth" | "dashboard" | "competitors") => void;
  onSelectMetric: (highlightSection: "none" | "seo" | "sem" | "social" | "dna" | "dashboard" | "competitors") => void;
  activeHighlight: "none" | "seo" | "sem" | "social" | "dna" | "dashboard" | "competitors";
  onNewInitiativeClick: () => void;
  onBrandSettingsClick: () => void;
}

export default function Sidebar({
  onViewChange,
  onSelectMetric,
  activeHighlight,
  onNewInitiativeClick,
  onBrandSettingsClick
}: SidebarProps) {
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 z-40 bg-white/5 backdrop-blur-2xl border-r border-white/10 flex flex-col pt-24 pb-12 bg-[#0E0E0F]/80">
      {/* Strategy Engine Title */}
      <div className="px-6 mb-8">
        <h3 className="text-white font-display text-xl font-bold tracking-tight">Strategy Engine</h3>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse"></span>
          <p className="text-[10px] font-mono font-medium tracking-widest text-[#00f0ff] uppercase">V3.4 Active</p>
        </div>
      </div>

      {/* Navigation Options connected directly to submodules */}
      <nav className="flex-1 flex flex-col space-y-1">
        <button
          onClick={() => {
            onViewChange("growth");
            onSelectMetric("seo");
          }}
          className={`w-full py-4 px-6 flex items-center gap-3 transition-all font-mono text-xs uppercase tracking-wider text-left border-l-4 ${
            activeHighlight === "seo"
              ? "bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]"
              : "text-on-surface-variant hover:text-white hover:bg-white/5 border-transparent"
          }`}
        >
          <Compass className="w-4 h-4 text-[#00f0ff]" />
          <span>SEO Intelligence</span>
        </button>

        <button
          onClick={() => {
            onViewChange("growth");
            onSelectMetric("sem");
          }}
          className={`w-full py-4 px-6 flex items-center gap-3 transition-all font-mono text-xs uppercase tracking-wider text-left border-l-4 ${
            activeHighlight === "sem"
              ? "bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]"
              : "text-on-surface-variant hover:text-white hover:bg-white/5 border-transparent"
          }`}
        >
          <Flame className="w-4 h-4 text-[#00f0ff]" />
          <span>SEM Performance</span>
        </button>

        <button
          onClick={() => {
            onViewChange("growth");
            onSelectMetric("social");
          }}
          className={`w-full py-4 px-6 flex items-center gap-3 transition-all font-mono text-xs uppercase tracking-wider text-left border-l-4 ${
            activeHighlight === "social"
              ? "bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]"
              : "text-on-surface-variant hover:text-white hover:bg-white/5 border-transparent"
          }`}
        >
          <Share2 className="w-4 h-4 text-[#00f0ff]" />
          <span>Social Dynamics</span>
        </button>

        <button
          onClick={() => {
            onViewChange("operations");
            onSelectMetric("dna");
          }}
          className={`w-full py-4 px-6 flex items-center gap-3 transition-all font-mono text-xs uppercase tracking-wider text-left border-l-4 ${
            activeHighlight === "dna"
              ? "bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]"
              : "text-on-surface-variant hover:text-white hover:bg-white/5 border-transparent"
          }`}
        >
          <Award className="w-4 h-4 text-[#00f0ff]" />
          <span>Brand Strategy</span>
        </button>

        <button
          onClick={() => {
            onViewChange("dashboard");
            onSelectMetric("dashboard");
          }}
          className={`w-full py-4 px-6 flex items-center gap-3 transition-all font-mono text-xs uppercase tracking-wider text-left border-l-4 ${
            activeHighlight === "dashboard"
              ? "bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]"
              : "text-on-surface-variant hover:text-white hover:bg-white/5 border-transparent"
          }`}
        >
          <BarChart3 className="w-4 h-4 text-[#00f0ff]" />
          <span>KPI Dashboard</span>
        </button>

        <button
          onClick={() => {
            onViewChange("competitors");
            onSelectMetric("competitors");
          }}
          className={`w-full py-4 px-6 flex items-center gap-3 transition-all font-mono text-xs uppercase tracking-wider text-left border-l-4 ${
            activeHighlight === "competitors"
              ? "bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]"
              : "text-on-surface-variant hover:text-white hover:bg-white/5 border-transparent"
          }`}
        >
          <Users className="w-4 h-4 text-[#00f0ff]" />
          <span>Competidores</span>
        </button>

        <button
          onClick={onBrandSettingsClick}
          className="w-full py-4 px-6 flex items-center gap-3 transition-all font-mono text-xs uppercase tracking-wider text-left border-l-4 border-transparent text-on-surface-variant hover:text-[#00f0ff] hover:bg-[#00f0ff]/5"
        >
          <Sliders className="w-4 h-4 text-[#00f0ff]" />
          <span>Configurar Marca</span>
        </button>
      </nav>

      {/* Footer Controls */}
      <div className="px-6 space-y-6">
        <button
          onClick={onNewInitiativeClick}
          className="w-full bg-white/5 hover:bg-[#00f0ff]/10 border border-white/10 hover:border-[#00f0ff]/30 py-3 rounded-lg text-white font-mono text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-[#00f0ff]" />
          New Initiative
        </button>

        {/* Principal avatar profile */}
        <div className="flex items-center gap-3 px-2 pt-4 border-t border-white/10">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZq1O12miUgWr0QsSnbM7bzmanCXIK8K83YWIpFcOGXDFmZXw9geMgjajo4yAb5E_clMZVlJOwCGH_ByYxPnMR3k_Ky_bw_Gqb2D6VX1feh5-b1zY3YnL3pdjWWkqzkB54d9U8qkFfrltxkGxE2F8eM-YhW2lSA-h-o_1EedCKNxJNpxY7MZ6YQI20kFj9rgCOQZrT_MvfaftfNDIMvpsQIziPIwLtcE2DOhRjx_4OrZEVOnmyezj2DVwN6Cu0rS-SkDvKKp57Flo"
            alt="Alex Thorne"
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full border border-[#00f0ff]/20 flex-shrink-0"
          />
          <div>
            <p className="text-sm font-semibold text-white">Alex Thorne</p>
            <p className="text-[10px] text-on-surface-variant font-mono uppercase tracking-tighter">Principal</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
