import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { DEFAULT_STRATEGY } from "./src/defaultStrategy.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialize Gemini SDK
let aiClient: any = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. Generate Business Strategy Route
app.post("/api/strategy/generate", async (req, res) => {
  const { businessType, brandSettings } = req.body;
  if (!businessType || typeof businessType !== "string" || businessType.trim() === "") {
    return res.status(400).json({ error: "El tipo de negocio es requerido." });
  }

  const ai = getGeminiClient();
  if (!ai) {
    // If no API key is specified, return fallback/mock database with appropriate naming
    console.log("No valid GEMINI_API_KEY found, returning premium mock response for businessType:", businessType, "and settings:", brandSettings);
    
    // Customize default strategy name slightly based on businessType to make it feel highly dynamic
    const mockStrategy = { ...DEFAULT_STRATEGY };
    mockStrategy.businessType = businessType;
    
    // Simple logic to set a plausible business name, utilizing brand settings if available
    if (brandSettings && brandSettings.industry) {
      const cleanIndustryName = brandSettings.industry.split(" ")[0];
      mockStrategy.businessName = cleanIndustryName.charAt(0).toUpperCase() + cleanIndustryName.slice(1) + " Studio";
    } else {
      mockStrategy.businessName = businessType.charAt(0).toUpperCase() + businessType.slice(1) + " Neural";
    }

    // Refine mock roadmap or items if brand settings exist
    if (brandSettings && brandSettings.targetAudience) {
      mockStrategy.roadmap.phase1.tasks = [
        `Identificación y sintonización con: ${brandSettings.targetAudience.slice(0, 50)}...`,
        ...mockStrategy.roadmap.phase1.tasks.slice(1)
      ];
    }
    
    return res.json({
      strategy: mockStrategy,
      isMock: true,
      message: "Por favor configura tu GEMINI_API_KEY en panel de configuración para habilitar la generación real con IA."
    });
  }

  try {
    let brandContext = "";
    if (brandSettings) {
      brandContext = `\\nCONFIGURACIÓN ESPECÍFICA DE LA MARCA (REQUISITO FUNDAMENTAL):\\n- Industria o Nicho específico: ${brandSettings.industry || businessType}\\n- Público Objetivo: ${brandSettings.targetAudience || "No especificado"}\\n- Tono de Voz deseado: ${brandSettings.toneOfVoice || "No especificado"}\\nAlinea toda la estrategia de acuerdo con estos detalles específicos.`;
    }
    const prompt = `Crea una estrategia de marketing digital premium de nivel ejecutivo de 30 días para una empresa de: "${businessType}". ${brandContext}
Sigue estrictamente el siguiente esquema de respuesta estructurado en JSON. Proporciona datos de excelente calidad, realistas y no genéricos.
Usa terminología de negocios moderna e inteligente enfocado a la automatización de flujos de trabajo e inteligencia artificial. Use Spanish for output language text fields (excluding titles/metrics if it matches the templates).

Esquema JSON Requerido:
{
  "businessName": "Inventa un nombre único y futurista/premium para este negocio",
  "businessType": "${businessType}",
  "roadmap": {
    "phase1": {
      "name": "Phase name (e.g. 'Neural Alignment')",
      "days": "DAYS 1-10",
      "tasks": ["deliverable/task 1", "deliverable/task 2", "deliverable/task 3"],
      "kpiName": "KPI metric title e.g. 'CONTENT FIDELITY'",
      "kpiValue": 85 (integer representing progress percentage)
    },
    "phase2": {
      "name": "Phase name (e.g. 'Content Prototyping')",
      "days": "DAYS 11-20",
      "tasks": ["task 1", "task 2", "task 3"],
      "kpiName": "KPI metric title e.g. 'REACH POTENTIAL'",
      "kpiValue": 40
    },
    "phase3": {
      "name": "Phase name (e.g. 'Global Activation')",
      "days": "DAYS 21-30",
      "tasks": ["task 1", "task 2", "task 3"],
      "kpiName": "KPI metric title e.g. 'CONVERSION VELOCITY'",
      "kpiValue": 12
    }
  },
  "seoClusters": [
    { "name": "Generative Keyword/Topic 1", "growth": "+142%" },
    { "name": "Generative Keyword/Topic 2", "growth": "+88%" },
    { "name": "Generative Keyword/Topic 3", "growth": "+64%" }
  ],
  "budgetEfficiency": [
    { "label": "Item 1", "height": 60 },
    { "label": "Item 2", "height": 85 },
    { "label": "Item 3", "height": 100 },
    { "label": "Item 4", "height": 75 },
    { "label": "Item 5", "height": 40 }
  ],
  "aiAutomations": [
    { "name": "Dynamic agent e.g. LeadSift Agent", "status": "Active: 24/7 Prospecting", "filledIcon": true },
    { "name": "Dynamic agent e.g. Agentic Sales Bot", "status": "Standby: Deployment Ready", "filledIcon": false }
  ],
  "socialContent": [
    { "platform": "Platform e.g. TikTok", "subtitle": "Format/Hook style", "hook": "Specific viral hook description", "schedule": "frequency/schedule", "reach": "estimation/reach metric" },
    { "platform": "Platform e.g. LinkedIn", "subtitle": "Format/Hook style", "hook": "Specific viral hook description", "schedule": "frequency/schedule", "reach": "estimation/reach metric" }
  ],
  "seoMetrics": {
    "brandTone": 78,
    "localSearch": 92
  },
  "competitors": [
    { "name": "Competitor 1", "marketCapture": 45, "rating": 2, "statusText": "Status (e.g. HIGH VOLATILITY)", "statusColor": "green" },
    { "name": "Competitor 2", "marketCapture": 72, "rating": 3, "statusText": "Status (e.g. STABLE RIVAL)", "statusColor": "yellow" }
  ],
  "visualDna": {
    "aesthetic": "CYBER-MINIMALIST AESTHETIC",
    "chromatic": [
      { "role": "PRIMARY", "name": "Electric Cyan", "hex": "#00f0ff" },
      { "role": "BASE", "name": "Deep Obsidian", "hex": "#0A0A0B" },
      { "role": "NEUTRAL", "name": "Ghost Steel", "hex": "#b9cacb" }
    ]
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["businessName", "businessType", "roadmap", "seoClusters", "budgetEfficiency", "aiAutomations", "socialContent", "seoMetrics", "competitors", "visualDna"],
          properties: {
            businessName: { type: Type.STRING },
            businessType: { type: Type.STRING },
            roadmap: {
              type: Type.OBJECT,
              properties: {
                phase1: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    days: { type: Type.STRING },
                    tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                    kpiName: { type: Type.STRING },
                    kpiValue: { type: Type.INTEGER }
                  }
                },
                phase2: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    days: { type: Type.STRING },
                    tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                    kpiName: { type: Type.STRING },
                    kpiValue: { type: Type.INTEGER }
                  }
                },
                phase3: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    days: { type: Type.STRING },
                    tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                    kpiName: { type: Type.STRING },
                    kpiValue: { type: Type.INTEGER }
                  }
                }
              }
            },
            seoClusters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  growth: { type: Type.STRING }
                }
              }
            },
            budgetEfficiency: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  height: { type: Type.INTEGER }
                }
              }
            },
            aiAutomations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  status: { type: Type.STRING },
                  filledIcon: { type: Type.BOOLEAN }
                }
              }
            },
            socialContent: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  platform: { type: Type.STRING },
                  subtitle: { type: Type.STRING },
                  hook: { type: Type.STRING },
                  schedule: { type: Type.STRING },
                  reach: { type: Type.STRING }
                }
              }
            },
            seoMetrics: {
              type: Type.OBJECT,
              properties: {
                brandTone: { type: Type.INTEGER },
                localSearch: { type: Type.INTEGER }
              }
            },
            competitors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  marketCapture: { type: Type.INTEGER },
                  rating: { type: Type.INTEGER },
                  statusText: { type: Type.STRING },
                  statusColor: { type: Type.STRING }
                }
              }
            },
            visualDna: {
              type: Type.OBJECT,
              properties: {
                aesthetic: { type: Type.STRING },
                chromatic: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      role: { type: Type.STRING },
                      name: { type: Type.STRING },
                      hex: { type: Type.STRING }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text.trim());
    
    // Inject custom premium abstract graphics to avoid breaking visual grid
    parsedData.visualDna.images = [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAW6rtAKl38_9h4vuDcr6_InWpSQ1zAYX_JUs20ezQW8N23pyyCoZRgjERwwHKD6QEeQ7BIfYXZzhjt_5rQPy4onVS4iJNo2Y894p-MlmfY4vwsODzcnIl4JMzE4eX_nZKQEMt_sQJYTP_W1g6vocRXAbvGOy5uGusoeeJgoynGX0JsohE8xtVanGbS7I577MGZckaPBBTq8WjDRHc_l3qOiWgJnypSYz40_ho9i4Vm241mZoYYTpdsNY6OY2AkdKbPJjlc5_OQs3M",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCbvtde-RUwIIy6bxK64RJ5fjXYDOnJB1ggstwkvhfxxJ2iee0VkXj8L5UBi_A217hdRMxQxBXttEIoJ0RsaXq050W2HzAhqF6GeEJAinJuP0nXJc-UEPtjae9pYOmHdfYh5VDhAaxTuoBPCtBNLo5MVciB0XgOlTvC5cM7yovMH8sqgObRG_E6SsbgFSgLn4XwRnsQ4FUnIbUsWkQukqkkLVBXlxZ0JC4Ka6Kh5d53lE9wIYtIPN9giGg2XeSjkJO_gE54g3-yCZg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDIz-776l3C9C-MTlZ27rnJxsGVbQW0vT0He4KaxZSNwYzA0ihlzfjt2paBzY7WHsb7sVcaCjWZRrYygN0Xi3JPEZduOk0fKKLlGOc0c1tyg5_F5PtvneXfAYxahpRuE6cTe4UHjeaXUgIJYIDrhfuwRJWpgUBrdD5qVSupoQDaVxMQ9kaUkNDRbwyCLjsG5XFVyjia0bx7nHAL-5nHzW4hbdHtIT691UF3GC3n-D4F1hg7AhIca82T8tRoTOJEYdMZ8EANbUvkuCo",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCXAdjMpFtm7_DSwSyzI60pJMKh4Irl2qt4IMXDLbSyTa_e1feNsr-LW9LkSKUzTPtp0F_WQv539kAL4LMjGxwvhEZfbljXYihufHAiFCfrjwcd5EwtOzmW8Mz_ps9O46cX-sD_rnk-0achGSsP41T3y3k4Gu-OI5-UVbvbY58UeAW41FevEMduWXxbfY7WaPA_wsCivSRiB7UXRZSV-pVmP69zwvoCgVGdNXRpFJCuili1dF8NdXLJwDEryscTnlosimCVQaTZiHQ"
    ];

    return res.json({ strategy: parsedData, isMock: false });
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    // Graceful fallback to avoid erroring out
    const mockStrategy = { ...DEFAULT_STRATEGY };
    mockStrategy.businessType = businessType;
    mockStrategy.businessName = businessType.charAt(0).toUpperCase() + businessType.slice(1) + " Intelligent";
    return res.json({
      strategy: mockStrategy,
      isMock: true,
      error: "Ocurrió un error al contactar al modelo de IA. Se ha generado una estrategia sintética."
    });
  }
});

// 2. Chat/Consult AI Endpoint
app.post("/api/strategy/chat", async (req, res) => {
  const { messages, strategy, brandSettings } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Arreglo de mensajes es requerido." });
  }

  const ai = getGeminiClient();
  if (!ai) {
    const lastUserMessage = messages[messages.length - 1]?.text || "";
    // Sweet static fallback
    return res.json({
      reply: `[Modo Consultoría Simplificado] Gracias por tu consulta: "${lastUserMessage}". Para darte un asesoramiento en tiempo real optimizado a tu marca "${strategy?.businessName || "Aether AI"}", por favor ingresa tu API Key de Gemini en el panel de Secrets de Google AI Studio. ¡Nuestra IA neural está lista para asistirte!`
    });
  }

  try {
    let brandContext = "";
    if (brandSettings) {
      brandContext = `\nDetalles específicos de la marca configurados por el usuario:
- Industria o Nicho específico: ${brandSettings.industry || "No especificado"}
- Público Objetivo de la marca: ${brandSettings.targetAudience || "No especificado"}
- Tono de Voz de la comunicación: ${brandSettings.toneOfVoice || "No especificado"}
Adapta tus respuestas para alinearte con este Tono de Voz y orienta tus recomendaciones hacia este Público Objetivo e Industria.`;
    }

    // Collect conversation history
    const context = `Te llamas Aether Consulting Bot. Eres el consultor principal de marketing digital e inteligencia artificial de la prestigiosa agencia "Aether AI".
Analiza la siguiente estrategia y responde de manera profesional, elocuente y amigable en español. Mantén respuestas concisas, perspicaces y prácticas de 2 a 3 párrafos como máximo.
${brandContext}

Estrategia seleccionada:
- Empresa: ${strategy?.businessName} (${strategy?.businessType})
- Roadmap Fase 1: ${strategy?.roadmap?.phase1?.name || "Neural Alignment"} (Tareas: ${strategy?.roadmap?.phase1?.tasks?.join(", ")})
- Roadmap Fase 2: ${strategy?.roadmap?.phase2?.name || "Content Prototyping"} (Tareas: ${strategy?.roadmap?.phase2?.tasks?.join(", ")})
- Roadmap Fase 3: ${strategy?.roadmap?.phase3?.name || "Global Activation"} (Tareas: ${strategy?.roadmap?.phase3?.tasks?.join(", ")})
- Clusters SEO Principales: ${strategy?.seoClusters?.map((c: any) => `${c.name} (${c.growth})`).join(", ")}
- Automatizaciones recomendadas: ${strategy?.aiAutomations?.map((a: any) => `${a.name} (${a.status})`).join(", ")}
- Competidores clave identificados: ${strategy?.competitors?.map((comp: any) => `${comp.name} - Captura de mercado: ${comp.marketCapture}% - Nivel: ${comp.statusText}`).join(", ")}
    `;

    // Flatten history for chat compatibility
    const formattedHistory = messages.map((m: any) => {
      return {
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      };
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { role: "user", parts: [{ text: `${context}\nAquí está el historial del chat y mi nueva pregunta.` }] },
        ...formattedHistory
      ],
      config: {
        systemInstruction: "Eres un consultor líder de estrategia digital. Responde de forma brillante y ejecutiva."
      }
    });

    return res.json({ reply: response.text });
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return res.status(500).json({ error: "No se pudo procesar la consulta con la IA." });
  }
});

// Configure Vite integration for live previews
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production build files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Aether AI Server] corriendo correctamente en: http://localhost:${PORT}`);
  });
}

startServer();
