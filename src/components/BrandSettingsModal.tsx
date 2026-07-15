/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Briefcase, Users, Volume2, Save, Trash2, Sparkles, CheckCircle2 } from "lucide-react";
import { BrandSettings } from "../types";

interface BrandSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: BrandSettings) => void;
  currentSettings: BrandSettings;
}

const TONE_PRESETS = [
  { label: "Innovador & Futurista", value: "Innovador, visionario, tecnológico y audaz" },
  { label: "Formal & Corporativo", value: "Profesional, de nivel ejecutivo, serio y confiable" },
  { label: "Cálido & Empático", value: "Cercano, amigable, comprensivo y conversacional" },
  { label: "Audaz & Rebelde", value: "Disruptivo, magnético, directo y sin filtros" },
  { label: "Técnico & Detallado", value: "Analítico, preciso, basado en datos y de carácter científico" }
];

export default function BrandSettingsModal({
  isOpen,
  onClose,
  onSave,
  currentSettings
}: BrandSettingsModalProps) {
  const [industry, setIndustry] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [toneOfVoice, setToneOfVoice] = useState("");
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);

  // Sync with currentSettings when modal opens or settings change
  useEffect(() => {
    if (isOpen) {
      setIndustry(currentSettings.industry || "");
      setTargetAudience(currentSettings.targetAudience || "");
      setToneOfVoice(currentSettings.toneOfVoice || "");
      setIsSavedSuccessfully(false);
    }
  }, [isOpen, currentSettings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings: BrandSettings = {
      industry: industry.trim(),
      targetAudience: targetAudience.trim(),
      toneOfVoice: toneOfVoice.trim()
    };
    onSave(updatedSettings);
    setIsSavedSuccessfully(true);
    setTimeout(() => {
      setIsSavedSuccessfully(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setIndustry("");
    setTargetAudience("");
    setToneOfVoice("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#060608]/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-lg bg-[#0E0E11]/90 border border-white/10 rounded-[2.5rem] shadow-[0_0_60px_rgba(0,240,255,0.1)] p-6 md:p-8 overflow-hidden z-10 text-left"
          >
            {/* Elegant Background Ambient Glows */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#00f0ff]/5 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-[60px] pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#00f0ff]/10 border border-[#00f0ff]/20 rounded-full text-[9px] font-mono font-bold text-[#00f0ff] uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  Identidad Neural de Marca
                </div>
                <h3 className="text-xl font-display font-extrabold text-white tracking-tight pt-1">
                  Configuración de Marca
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Personaliza los parámetros clave de tu negocio. La IA de Aether usará estos detalles para sintonizar y generar estrategias futuras 100% alineadas.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Field 1: Industry */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#00f0ff]" />
                  Industria o Nicho Específico
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="Ej: SaaS de productividad para equipos creativos, Moda sostenible"
                  className="w-full bg-white/[0.02] border border-white/10 focus:border-[#00f0ff]/50 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none transition-all font-sans"
                />
              </div>

              {/* Field 2: Target Audience */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#00f0ff]" />
                  Público Objetivo / Buyer Persona
                </label>
                <textarea
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  rows={2}
                  placeholder="Ej: Jóvenes profesionales de 25-35 años, interesados en ecología y estilo de vida premium..."
                  className="w-full bg-white/[0.02] border border-white/10 focus:border-[#00f0ff]/50 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none transition-all font-sans resize-none"
                />
              </div>

              {/* Field 3: Tone of Voice */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-[#00f0ff]" />
                  Tono de Voz de la Comunicación
                </label>
                <input
                  type="text"
                  value={toneOfVoice}
                  onChange={(e) => setToneOfVoice(e.target.value)}
                  placeholder="Ej: Sofisticado, elocuente, altamente tecnológico y directo"
                  className="w-full bg-white/[0.02] border border-white/10 focus:border-[#00f0ff]/50 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none transition-all font-sans"
                />

                {/* Tone Presets */}
                <div className="pt-1.5 space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono">Presets sugeridos (haz clic para aplicar):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {TONE_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setToneOfVoice(p.value)}
                        className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          toneOfVoice === p.value
                            ? "bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30 font-bold"
                            : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-between border-t border-white/5 mt-6">
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none py-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Limpiar campos
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={isSavedSuccessfully}
                    className={`relative px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all duration-300 flex items-center gap-1.5 shadow-[0_0_20px_rgba(0,240,255,0.15)] cursor-pointer ${
                      isSavedSuccessfully
                        ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                        : "bg-[#00f0ff] hover:bg-[#57fff5] text-[#00363a]"
                    }`}
                  >
                    {isSavedSuccessfully ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        <span>¡Guardado!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Guardar Identidad</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
