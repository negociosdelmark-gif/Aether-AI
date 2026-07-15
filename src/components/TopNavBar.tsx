/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Wifi, Bell, Search, Sparkles, Sliders } from "lucide-react";

interface TopNavBarProps {
  activeView: "network" | "operations" | "growth" | "dashboard" | "competitors";
  onViewChange: (view: "network" | "operations" | "growth" | "dashboard" | "competitors") => void;
  onConsultClick: () => void;
  onBrandSettingsClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  hasStrategy: boolean;
}

export default function TopNavBar({
  activeView,
  onViewChange,
  onConsultClick,
  onBrandSettingsClick,
  searchQuery,
  onSearchChange,
  hasStrategy
}: TopNavBarProps) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_40px_rgba(0,240,255,0.05)] flex justify-between items-center px-6 md:px-20 h-20 bg-[#131314]/90">
      {/* Brand Logo */}
      <div className="flex items-center gap-12">
        <button
          onClick={() => onViewChange("network")}
          className="font-display text-2xl font-bold tracking-tighter text-white hover:opacity-80 transition-all flex items-center gap-2 text-left"
        >
          Aether AI
        </button>

        {/* View Selectors */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => onViewChange("network")}
            className={`font-sans text-sm font-medium transition-colors cursor-pointer pb-1 ${
              activeView === "network"
                ? "text-[#00f0ff] border-b-2 border-[#00f0ff]"
                : "text-on-surface-variant hover:text-white"
            }`}
          >
            Network
          </button>
          
          <button
            onClick={() => {
              onViewChange("operations");
            }}
            className={`font-sans text-sm font-medium transition-colors cursor-pointer pb-1 relative ${
              activeView === "operations"
                ? "text-[#00f0ff] border-b-2 border-[#00f0ff]"
                : "text-on-surface-variant hover:text-white"
            }`}
          >
            Operations
            {!hasStrategy && (
              <span className="absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
            )}
          </button>

          <button
            onClick={() => {
              onViewChange("growth");
            }}
            className={`font-sans text-sm font-medium transition-colors cursor-pointer pb-1 relative ${
              activeView === "growth"
                ? "text-[#00f0ff] border-b-2 border-[#00f0ff]"
                : "text-on-surface-variant hover:text-white"
            }`}
          >
            Growth
            {!hasStrategy && (
              <span className="absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
            )}
          </button>

          <button
            onClick={() => {
              onViewChange("dashboard");
            }}
            className={`font-sans text-sm font-medium transition-colors cursor-pointer pb-1 relative ${
              activeView === "dashboard"
                ? "text-[#00f0ff] border-b-2 border-[#00f0ff]"
                : "text-on-surface-variant hover:text-white"
            }`}
          >
            Dashboard
            {!hasStrategy && (
              <span className="absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
            )}
          </button>

          <button
            onClick={() => {
              onViewChange("competitors");
            }}
            className={`font-sans text-sm font-medium transition-colors cursor-pointer pb-1 relative ${
              activeView === "competitors"
                ? "text-[#00f0ff] border-b-2 border-[#00f0ff]"
                : "text-on-surface-variant hover:text-white"
            }`}
          >
            Competidores
            {!hasStrategy && (
              <span className="absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
            )}
          </button>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Simple Search Box */}
        <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5 gap-2">
          <Search className="w-3.5 h-3.5 text-[#00f0ff]" />
          <input
            type="text"
            placeholder="Search insights..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs w-40 placeholder:text-on-surface-variant/50 text-white"
          />
        </div>

        {/* System Status Indicators */}
        <div className="flex items-center gap-4 text-on-surface-variant border-r border-white/10 pr-6 mr-1 hidden sm:flex">
          <div className="relative group">
            <Wifi className="w-4 h-4 cursor-pointer hover:text-[#00f0ff] transition-all" />
            <span className="absolute hidden group-hover:block bottom-[-30px] right-[-20px] bg-black text-[10px] py-0.5 px-1.5 rounded border border-white/10 text-white whitespace-nowrap z-50">
              Live Stream OK
            </span>
          </div>
          <div className="relative group">
            <Bell className="w-4 h-4 cursor-pointer hover:text-[#00f0ff] transition-all" />
            <span className="absolute hidden group-hover:block bottom-[-30px] right-[-20px] bg-black text-[10px] py-0.5 px-1.5 rounded border border-white/10 text-white whitespace-nowrap z-55">
              3 Notifications
            </span>
          </div>
        </div>

        {/* BRAND SETTINGS BUTTON */}
        <button
          onClick={onBrandSettingsClick}
          title="Configuración de Marca"
          className="p-2 border border-white/10 hover:border-[#00f0ff]/50 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-[#00f0ff] transition-all cursor-pointer flex items-center justify-center shrink-0 w-9 h-9"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* CONSULT AI BUTTON */}
        <button
          onClick={onConsultClick}
          className="bg-primary-container text-on-primary-container px-5 py-2 rounded-full font-bold text-xs hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.25)] bg-[#00f0ff] text-[#00363a] uppercase font-mono tracking-wider"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Consult AI
        </button>
      </div>
    </nav>
  );
}
