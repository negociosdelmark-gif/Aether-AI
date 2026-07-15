/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, BrainCircuit, Cpu, ShieldCheck, Zap, ArrowRight, ArrowRightLeft } from "lucide-react";

interface LandingViewProps {
  onGenerate: (brandType: string) => void;
  isLoading: boolean;
  onViewChange: (view: "network" | "operations" | "growth") => void;
  hasStrategy: boolean;
}

export default function LandingView({ onGenerate, isLoading, onViewChange, hasStrategy }: LandingViewProps) {
  const [inputValue, setInputValue] = useState("");

  const samples = [
    { label: "Restaurante de sushi", value: "Restaurante de sushi" },
    { label: "Marca de ropa artesanal", value: "Marca de ropa artesanal" },
    { label: "Plataforma SaaS de productividad", value: "SaaS de productividad" },
    { label: "Clínica estética premium", value: "Clínica estética premium" }
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    onGenerate(inputValue);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[80vh] px-4 md:px-12 pt-12">
      <div className="max-w-4xl w-full text-center space-y-12">
        {/* Header Display Info */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary-container/10 border border-[#00f0ff]/30 px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] ai-pulse"></span>
            <span className="font-mono text-[10px] tracking-widest text-[#00f0ff] uppercase">
              Intelligence Engine v3.4 Active
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl text-white font-extrabold tracking-tight leading-tight">
            Crea una estrategia digital para una empresa de:
          </h1>
        </div>

        {/* Dynamic Glowing Form Area */}
        <form onSubmit={handleSubmit} className="relative group max-w-2xl mx-auto w-full space-y-4">
          {/* Glowing border background blur */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-[#00f0ff]/20 to-purple-500/20 rounded-2xl blur opacity-30 group-focus-within:opacity-100 transition duration-1000"></div>
          
          <div className="relative glass-card rounded-2xl p-2 flex items-center shadow-2xl bg-black/40 border-white/10 group-focus-within:border-[#00f0ff]/50 transition-all">
            <div className="pl-4 text-on-surface-variant flex-shrink-0">
              <BrainCircuit className="w-6 h-6 text-[#00f0ff]" />
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              placeholder="Ex: Restaurante de sushi o Marca de ropa..."
              className="w-full bg-transparent border-none text-white focus:outline-none focus:ring-0 text-base md:text-lg font-sans px-4 py-4 md:py-5 placeholder-on-surface-variant/40"
            />
          </div>

          {/* Quick-select pill template indicators */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {samples.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputValue(s.value);
                  onGenerate(s.value);
                }}
                disabled={isLoading}
                className="text-xs bg-white/5 hover:bg-white/10 hover:border-white/20 text-on-surface-variant hover:text-white border border-white/5 px-3.5 py-2 rounded-full transition-colors cursor-pointer"
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Submit Trigger Actions */}
          <div className="flex flex-col items-center gap-6 pt-4">
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="group relative px-10 py-4.5 bg-[#00f0ff] hover:bg-[#57fff5] text-[#00363a] font-display font-extrabold text-base md:text-lg rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.35)] hover:shadow-[0_0_50px_rgba(0,240,255,0.6)] transition-all duration-300 disabled:opacity-40 disabled:scale-100 disabled:shadow-none hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-3"
            >
              <Zap className="w-5 h-5 fill-[#00363a]" />
              <span>
                {isLoading ? "Sintetizando Roadmap Neural..." : "🚀 Generar Estrategia con IA"}
              </span>
            </button>

            {/* Neural state checks */}
            <div className="flex gap-8 justify-center opacity-50 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono text-[10px] uppercase tracking-wider">Neural-Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-[#00f0ff]" />
                <span className="font-mono text-[10px] uppercase tracking-wider">Real-time Analysis</span>
              </div>
            </div>
          </div>
        </form>

        {/* Featured Insights Section (Bento Grid layout) */}
        {!isLoading && (
          <div className="max-w-4xl mx-auto mt-20 text-left grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* 1. Neural Networks Card */}
            <div className="md:col-span-8 glass-card rounded-3xl p-8 relative overflow-hidden group hover:border-[#00f0ff]/30">
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <h3 className="font-display font-bold text-2xl text-white mb-2">Neural Networks Mapping</h3>
                  <p className="font-sans text-sm text-on-surface-variant max-w-sm leading-relaxed">
                    Our AI doesn&apos;t just suggest content; it analyzes cross-platform consumer behavior to predict market shifts before they happen.
                  </p>
                </div>

                <div className="flex gap-2 mt-6">
                  <span className="text-[10px] bg-white/5 border border-white/15 text-on-surface-variant font-mono uppercase tracking-widest px-3 py-1.5 rounded-full">
                    SEM Performance
                  </span>
                  <span className="text-[10px] bg-white/5 border border-white/15 text-on-surface-variant font-mono uppercase tracking-widest px-3 py-1.5 rounded-full">
                    Social Dynamics
                  </span>
                </div>
              </div>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAG5KTF8KWsVLjFYe6JwCLo8tUmreIeQ-ma9LZp1ZIzpuOVfLPcjWx2niskND6Q6fvyVkCqwc3tCuN8FNbMmXNBozs2166xN4AXnMVkyS43CTbFihOQEtuxLD1tVCC872Fe7ETwTH009b5lYV4woyTZh67DImHOwrMUi8kgBarky_taxSTnH72xp9_-uFpJMymQq4bTdwnEBJvN2xNU1JwBzbgLevP11sw9sN6VSkfG6ftqWEhKwCMmQaAoFpN1Dz2C_CZbWEdVpig"
                alt="Neural Network illustration"
                referrerPolicy="no-referrer"
                className="absolute top-0 right-0 h-full w-1/2 object-cover opacity-10 group-hover:opacity-20 transition-all duration-700 pointer-events-none"
                style={{ maskImage: "linear-gradient(to left, black, transparent)" }}
              />
            </div>

            {/* 2. Brand Efficiency Callout */}
            <div className="md:col-span-4 glass-card rounded-3xl p-8 flex flex-col justify-between border-primary-container/20 shadow-[0_0_20px_rgba(0,240,255,0.05)] hover:border-[#00f0ff]/30">
              <div className="w-10 h-10 rounded-xl bg-primary-container/10 border border-[#00f0ff]/20 flex items-center justify-center mb-6">
                <Cpu className="w-5 h-5 text-[#00f0ff]" />
              </div>
              <div>
                <h3 className="font-display font-bold text-2xl text-white mb-2">98.4% Efficiency</h3>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                  Precision-tuned algorithms ensuring minimal waste in your digital spend.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center">
                {hasStrategy ? (
                  <button
                    onClick={() => onViewChange("operations")}
                    className="text-[#00f0ff] hover:text-[#57fff5] font-mono text-xs uppercase tracking-widest flex items-center gap-1.5 font-bold cursor-pointer group"
                  >
                    Ver Estrategia
                    <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest">
                    Sin Estrategia Cargada
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
