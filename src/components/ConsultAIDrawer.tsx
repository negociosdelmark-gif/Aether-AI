/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot, User, Sparkles, AlertCircle } from "lucide-react";
import { ChatMessage, StrategyData, BrandSettings } from "../types";

interface ConsultAIDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  strategy: StrategyData;
  brandSettings?: BrandSettings;
}

export default function ConsultAIDrawer({ isOpen, onClose, strategy, brandSettings }: ConsultAIDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: `¡Hola! Soy tu Consultor Ejecutivo de Aether AI. He analizado la marca "${strategy.businessName}" (${strategy.businessType}) y estoy listo para optimizar tu roadmap. ¿En qué vector de rendimiento te gustaría profundizar hoy?`
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const newUserMessage: ChatMessage = { sender: "user", text: textToSend };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/strategy/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          strategy: strategy,
          brandSettings: brandSettings
        })
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with AI server");
      }

      const data = await response.json();
      setMessages(prev => [...prev, { sender: "ai", text: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        {
          sender: "ai",
          text: "Lo siento, ha ocurrido un error al conectar con el servidor de inteligencia artificial. Por favor intenta de nuevo en unos momentos."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const starterPrompts = [
    "¿Cómo superar a mi principal competidor?",
    "Escribe un plan de contenido para TikTok",
    "¿Cómo optimizar mi presupuesto de SEM?",
    "Explícame la automatización de LeadSift"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#0E0E0F] border-l border-white/10 h-full flex flex-col shadow-2xl relative">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center border border-primary-container/30">
              <Bot className="w-5 h-5 text-primary-container" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-white tracking-tight">Aether Consulting AI</h3>
              <p className="text-xs text-on-surface-variant font-mono tracking-widest uppercase">Estrategia en Vivo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:text-white hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="px-6 py-2.5 bg-primary-container/10 border-b border-primary-container/20 flex flex-col gap-1 text-xs text-[#00f0ff]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Consultoría contextual armada sobre el roadmap de <strong>{strategy.businessName}</strong></span>
          </div>
          {brandSettings && (brandSettings.industry || brandSettings.targetAudience || brandSettings.toneOfVoice) && (
            <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Identidad Neural: {brandSettings.industry || "Industria"} | {brandSettings.toneOfVoice ? "Tono Configurado" : "Público Configurado"}</span>
            </div>
          )}
        </div>

        {/* Message Container */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border ${
                  msg.sender === "user"
                    ? "bg-secondary-container/20 border-secondary-container/35"
                    : "bg-primary-container/10 border-primary-container/30"
                }`}
              >
                {msg.sender === "user" ? (
                  <User className="w-4 h-4 text-secondary" />
                ) : (
                  <Bot className="w-4 h-4 text-primary-container" />
                )}
              </div>
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-secondary-container/10 border border-secondary-container/20 text-white rounded-tr-none"
                    : "bg-white/5 border border-white/10 text-on-surface rounded-tl-none"
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-primary-container/10 border border-primary-container/30">
                <Bot className="w-4 h-4 text-primary-container ai-pulse" />
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-on-surface rounded-tl-none flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 rounded-full bg-primary-container animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 rounded-full bg-primary-container animate-bounce"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Starter Prompts */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <p className="text-[10px] uppercase font-mono text-on-surface-variant tracking-wider">Preguntas recomendadas:</p>
          <div className="flex flex-wrap gap-1.5">
            {starterPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-on-surface-variant hover:text-white px-3 py-1.5 rounded-lg transition-colors text-left"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Footer */}
        <div className="p-6 border-t border-white/15 bg-white/5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe tu consulta de estrategia..."
              className="flex-1 bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-on-surface-variant/50 focus:outline-none focus:border-primary-container/50 focus:ring-1 focus:ring-primary-container/50 transition-all font-sans"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="bg-primary-container text-on-primary-container px-4 py-3 rounded-xl font-bold hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all cursor-pointer flex items-center justify-center flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
