/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from "jspdf";
import { StrategyData, PhaseNote } from "../types";

export function generateStrategyPDF(
  strategy: StrategyData,
  notes?: Record<string, PhaseNote[]>,
  thresholds?: Record<"phase1" | "phase2" | "phase3", number>,
  volatility?: number
) {
  const totalPages = (notes || thresholds) ? 4 : 3;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const colors = {
    primary: [11, 24, 43], // Slate Blue / Dark Primary
    accent: [0, 122, 135], // Deep Cyan for white background contrast
    textDark: [17, 24, 39], // charcoal gray
    textMuted: [75, 85, 99], // medium gray
    bgLight: [244, 246, 248], // soft gray card bg
    bgBorder: [229, 231, 235], // border gray
    white: [255, 255, 255],
    accentLight: [224, 242, 254], // Light Blue accent
  };

  const drawHeader = (pageNumber: number, title: string) => {
    // Top border accent bar
    doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.rect(0, 0, pageWidth, 4, "F");

    // Header Meta
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.text("AETHER AI COGNITIVE PLATFORM", margin, 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
    doc.text(`VECTOR DE EJECUCIÓN OPERATIVA`, pageWidth - margin, 12, { align: "right" });

    // Section title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.text(title, margin, 22);

    // Header separator line
    doc.setDrawColor(colors.bgBorder[0], colors.bgBorder[1], colors.bgBorder[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, 26, pageWidth - margin, 26);
  };

  const drawFooter = (pageNumber: number, totalPages: number) => {
    const footerY = pageHeight - 12;
    // Bottom line
    doc.setDrawColor(colors.bgBorder[0], colors.bgBorder[1], colors.bgBorder[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
    doc.text(
      `Generado por Aether AI en la fecha actual • Confidencial para ${strategy.businessName}`,
      margin,
      footerY
    );

    doc.text(`Página ${pageNumber} de ${totalPages}`, pageWidth - margin, footerY, {
      align: "right",
    });
  };

  // ==========================================
  // PAGE 1: RESUMEN OPERATIVO E INTELIGENCIA
  // ==========================================
  drawHeader(1, "REPORTE ESTRATÉGICO Y DE POSICIONAMIENTO");

  // Title block
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text(strategy.businessName, margin, 42);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.text(`TIPO DE NEGOCIO: ${strategy.businessType.toUpperCase()}`, margin, 49);

  // Decorative element
  doc.setFillColor(colors.accentLight[0], colors.accentLight[1], colors.accentLight[2]);
  doc.rect(margin, 53, contentWidth, 22, "F");
  
  doc.setFont("helvetica", "oblique");
  doc.setFontSize(9.5);
  doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
  const introText = `Aether AI ha sintetizado el posicionamiento competitivo de ${strategy.businessName} para maximizar su relevancia e impacto de mercado. Esta estrategia articula tácticas optimizadas de SEO, planeamiento de contenido viral, automatizaciones eficientes y un sistema cromático unificado.`;
  doc.text(introText, margin + 4, 58, { maxWidth: contentWidth - 8 });

  // Two columns for Metrics & SEO and Automations
  const colY = 82;
  const colWidth = (contentWidth - 8) / 2;

  // Column A: SEO Metrics & Clusters
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text("Métricas de Presencia y Tráfico", margin, colY);

  // SEO Score bars
  let metricY = colY + 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
  
  // Brand Tone
  doc.text(`Saturación del tono de marca:`, margin, metricY);
  doc.setFont("helvetica", "bold");
  doc.text(`${strategy.seoMetrics.brandTone}%`, margin + colWidth - 10, metricY);
  metricY += 3;
  doc.setFillColor(colors.bgBorder[0], colors.bgBorder[1], colors.bgBorder[2]);
  doc.rect(margin, metricY, colWidth, 2, "F");
  doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.rect(margin, metricY, (colWidth * strategy.seoMetrics.brandTone) / 100, 2, "F");

  // Local Search
  metricY += 8;
  doc.setFont("helvetica", "normal");
  doc.text(`Cuota de voz en búsquedas locales (SOV):`, margin, metricY);
  doc.setFont("helvetica", "bold");
  doc.text(`${strategy.seoMetrics.localSearch}%`, margin + colWidth - 10, metricY);
  metricY += 3;
  doc.setFillColor(colors.bgBorder[0], colors.bgBorder[1], colors.bgBorder[2]);
  doc.rect(margin, metricY, colWidth, 2, "F");
  doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.rect(margin, metricY, (colWidth * strategy.seoMetrics.localSearch) / 100, 2, "F");

  // SEO Clusters
  metricY += 12;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text("Clústeres SEO Dominantes", margin, metricY);
  
  metricY += 6;
  strategy.seoClusters.forEach((cluster) => {
    // Draw small background for cluster
    doc.setFillColor(colors.bgLight[0], colors.bgLight[1], colors.bgLight[2]);
    doc.rect(margin, metricY - 4, colWidth, 7, "F");
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
    doc.text(cluster.name, margin + 3, metricY);
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.text(cluster.growth, margin + colWidth - 15, metricY);
    
    metricY += 9;
  });

  // Column B: AI Automations & Metrics
  const colBX = margin + colWidth + 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text("Automatizaciones Inteligentes", colBX, colY);

  let autoY = colY + 8;
  strategy.aiAutomations.forEach((agent) => {
    // Soft card bg
    doc.setFillColor(colors.bgLight[0], colors.bgLight[1], colors.bgLight[2]);
    doc.rect(colBX, autoY - 4, colWidth, 11, "F");
    
    // Status color dot
    doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.circle(colBX + 4, autoY + 1.5, 1.2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
    doc.text(agent.name, colBX + 8, autoY + 1);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
    doc.text(agent.status, colBX + 8, autoY + 5.5);

    autoY += 13;
  });

  // Savings Stat Callout Block
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(colBX, autoY - 2, colWidth, 23, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(220, 220, 220);
  doc.text("HORAS DE TRABAJO MENSUALES AHORRADAS:", colBX + 5, autoY + 4);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("1,240 HORAS", colBX + 5, autoY + 13);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(190, 190, 190);
  doc.text("Estimado por automatizaciones integrales.", colBX + 5, autoY + 19);

  drawFooter(1, totalPages);

  // ==========================================
  // PAGE 2: EXECUTION ROADMAP (30-DAY LAUNCH)
  // ==========================================
  doc.addPage();
  drawHeader(2, "HOJA DE RUTA DE EJECUCIÓN (PLAZO 30 DÍAS)");

  let yOffset = 38;

  const renderPhaseCard = (phaseNumber: number, phaseData: typeof strategy.roadmap.phase1, colorHex: number[]) => {
    // Header band
    doc.setFillColor(colorHex[0], colorHex[1], colorHex[2]);
    doc.rect(margin, yOffset, contentWidth, 8, "F");

    // Phase Title Text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(`FASE ${phaseNumber}: ${phaseData.name.toUpperCase()} (${phaseData.days})`, margin + 4, yOffset + 5.5);

    // Card Body Background
    const cardHeight = 44;
    doc.setFillColor(colors.bgLight[0], colors.bgLight[1], colors.bgLight[2]);
    doc.rect(margin, yOffset + 8, contentWidth, cardHeight, "F");

    // Tasks list
    let taskY = yOffset + 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);

    phaseData.tasks.slice(0, 4).forEach((task) => {
      // Draw a tiny dot for custom bullet
      doc.setFillColor(colorHex[0], colorHex[1], colorHex[2]);
      doc.circle(margin + 6, taskY - 1.2, 1, "F");

      doc.text(task, margin + 10, taskY, { maxWidth: contentWidth - 16 });
      taskY += 6.5;
    });

    // Separator line
    doc.setDrawColor(colors.bgBorder[0], colors.bgBorder[1], colors.bgBorder[2]);
    doc.setLineWidth(0.2);
    doc.line(margin + 4, yOffset + 40, margin + contentWidth - 4, yOffset + 40);

    // KPI text & progress bar
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.text(`INDICADOR CLAVE (KPI): ${phaseData.kpiName}`, margin + 5, yOffset + 46);

    const barWidth = 40;
    const barX = margin + contentWidth - barWidth - 15;
    doc.setFillColor(colors.bgBorder[0], colors.bgBorder[1], colors.bgBorder[2]);
    doc.rect(barX, yOffset + 43, barWidth, 3, "F");
    doc.setFillColor(colorHex[0], colorHex[1], colorHex[2]);
    doc.rect(barX, yOffset + 43, (barWidth * phaseData.kpiValue) / 100, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(colorHex[0], colorHex[1], colorHex[2]);
    doc.text(`${phaseData.kpiValue}%`, margin + contentWidth - 10, yOffset + 45.5);

    yOffset += cardHeight + 16;
  };

  // Render Phases
  renderPhaseCard(1, strategy.roadmap.phase1, colors.accent);
  renderPhaseCard(2, strategy.roadmap.phase2, [75, 85, 99]);
  renderPhaseCard(3, strategy.roadmap.phase3, colors.primary);

  drawFooter(2, totalPages);

  // ==========================================
  // PAGE 3: COMPETITORS & BRAND DESIGN (DNA)
  // ==========================================
  doc.addPage();
  drawHeader(3, "COMPETENCIA Y SISTEMA DE MARCA (ADN VISUAL)");

  // Competitor Table Header
  let compY = 38;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text("Matriz de Competencia de Mercado", margin, compY);

  compY += 8;
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(margin, compY, contentWidth, 7, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text("COMPETIDOR", margin + 4, compY + 5);
  doc.text("CUOTA DE MERCADO", margin + 45, compY + 5);
  doc.text("PUNTUACIÓN TECNOLÓGICA", margin + 95, compY + 5);
  doc.text("OPORTUNIDAD", margin + 145, compY + 5);

  compY += 7;
  strategy.competitors.forEach((comp, idx) => {
    // Alternating rows bg
    if (idx % 2 === 0) {
      doc.setFillColor(colors.bgLight[0], colors.bgLight[1], colors.bgLight[2]);
    } else {
      doc.setFillColor(255, 255, 255);
    }
    doc.rect(margin, compY, contentWidth, 10, "F");

    // Competitor text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
    doc.text(comp.name, margin + 4, compY + 6.5);

    // Progress bar for market capture
    doc.setFont("helvetica", "normal");
    doc.text(`${comp.marketCapture}%`, margin + 45, compY + 6.5);
    doc.setFillColor(colors.bgBorder[0], colors.bgBorder[1], colors.bgBorder[2]);
    doc.rect(margin + 57, compY + 4.5, 25, 2.2, "F");
    doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.rect(margin + 57, compY + 4.5, (25 * comp.marketCapture) / 100, 2.2, "F");

    // Tech Stack Rating (rendered as simple stars value)
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.text("★".repeat(comp.rating) + "☆".repeat(5 - comp.rating), margin + 95, compY + 6.5);

    // Opportunity status
    const statusText = comp.statusText.toUpperCase();
    doc.setFont("helvetica", "bold");
    if (comp.statusColor === "green") {
      doc.setTextColor(16, 124, 65); // green text
    } else if (comp.statusColor === "red") {
      doc.setTextColor(168, 44, 44); // red text
    } else {
      doc.setTextColor(180, 110, 0); // yellow/orange text
    }
    doc.text(statusText, margin + 145, compY + 6.5);

    compY += 10;
  });

  // Chromatic visual DNA System
  let dnaY = compY + 16;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text("Sistema Cromático & ADN Visual", margin, dnaY);

  dnaY += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
  const aestheticLabel = `Dirección Estética Recomendada: ${strategy.visualDna.aesthetic || "Cyber-Minimalista"}`;
  doc.text(aestheticLabel, margin, dnaY);

  // Drawing Palette swatches
  let swatchY = dnaY + 6;
  strategy.visualDna.chromatic.forEach((color, idx) => {
    const swatchWidth = (contentWidth - 12) / 4;
    const swatchX = margin + idx * (swatchWidth + 4);

    // Swatch box
    doc.setFillColor(colors.bgLight[0], colors.bgLight[1], colors.bgLight[2]);
    doc.rect(swatchX, swatchY, swatchWidth, 24, "F");

    // Color fill box
    try {
      // Parse Hex to RGB
      const hex = color.hex.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16) || 0;
      const g = parseInt(hex.substring(2, 4), 16) || 0;
      const b = parseInt(hex.substring(4, 6), 16) || 0;
      doc.setFillColor(r, g, b);
      doc.rect(swatchX + 2, swatchY + 2, swatchWidth - 4, 11, "F");
    } catch (e) {
      doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
      doc.rect(swatchX + 2, swatchY + 2, swatchWidth - 4, 11, "F");
    }

    // Swatch text Labels
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
    doc.text(color.name, swatchX + 3, swatchY + 17, { maxWidth: swatchWidth - 6 });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
    doc.text(`${color.role}: ${color.hex}`, swatchX + 3, swatchY + 21.5);
  });

  // Social & Media Strategy Summary block
  let socialY = swatchY + 33;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text("Resumen de Estrategia de Contenidos", margin, socialY);

  socialY += 6;
  strategy.socialContent.forEach((sc, idx) => {
    doc.setFillColor(colors.bgLight[0], colors.bgLight[1], colors.bgLight[2]);
    doc.rect(margin, socialY - 4, contentWidth, 14, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.text(sc.platform.toUpperCase(), margin + 3, socialY + 1);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
    doc.text(`Hook: "${sc.hook}"`, margin + 28, socialY + 1, { maxWidth: contentWidth - 34 });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
    doc.text(`${sc.subtitle}  •  Alcance potencial: ${sc.reach}`, margin + 28, socialY + 5.5);

    socialY += 16;
  });

  drawFooter(3, totalPages);

  if (notes || thresholds) {
    doc.addPage();
    drawHeader(4, "NOTAS DE ESTRATEGIA Y PLAN DE SEGUIMIENTO");

    let yOffsetPage4 = 38;

    // 1. Thresholds / KPI Alertas de Rendimiento Section
    if (thresholds) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.text("Configuración de Umbrales de Rendimiento", margin, yOffsetPage4);
      yOffsetPage4 += 6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
      doc.text(
        "Monitoreo de indicadores clave con alertas personalizadas configuradas en el cliente.",
        margin,
        yOffsetPage4
      );
      yOffsetPage4 += 8;

      // Table Header
      doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.rect(margin, yOffsetPage4, contentWidth, 7, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text("FASE / METRICA", margin + 4, yOffsetPage4 + 5);
      doc.text("PROYECCIÓN ACTUAL", margin + 70, yOffsetPage4 + 5);
      doc.text("UMBRAL ESTABLECIDO", margin + 115, yOffsetPage4 + 5);
      doc.text("ESTADO DE ALERTA", margin + 155, yOffsetPage4 + 5);

      yOffsetPage4 += 7;

      const phases = [
        { key: "phase1", name: "Fase 1: Neural Alignment", kpiName: strategy.roadmap.phase1.kpiName, baseVal: strategy.roadmap.phase1.kpiValue },
        { key: "phase2", name: "Fase 2: Velocity Multiplier", kpiName: strategy.roadmap.phase2.kpiName, baseVal: strategy.roadmap.phase2.kpiValue },
        { key: "phase3", name: "Fase 3: Cognitive Dominance", kpiName: strategy.roadmap.phase3.kpiName, baseVal: strategy.roadmap.phase3.kpiValue }
      ];

      const getAdjustedValueLocal = (baseValue: number, phaseIdx: number) => {
        const vol = volatility || 0;
        const reduction = baseValue * (vol / 100) * 0.45;
        return Math.max(5, Math.min(100, Math.round(baseValue - reduction)));
      };

      phases.forEach((p, idx) => {
        doc.setFillColor(idx % 2 === 0 ? colors.bgLight[0] : 255, idx % 2 === 0 ? colors.bgLight[1] : 255, idx % 2 === 0 ? colors.bgLight[2] : 255);
        doc.rect(margin, yOffsetPage4, contentWidth, 9, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
        doc.text(p.name, margin + 4, yOffsetPage4 + 6);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
        doc.text(`(${p.kpiName})`, margin + 4, yOffsetPage4 + 9.5);

        const currentVal = getAdjustedValueLocal(p.baseVal, idx + 1);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
        doc.text(`${currentVal}%`, margin + 70, yOffsetPage4 + 6);

        const thresholdVal = thresholds[p.key as "phase1" | "phase2" | "phase3"] ?? 30;
        doc.text(`${thresholdVal}%`, margin + 115, yOffsetPage4 + 6);

        const isAlert = currentVal < thresholdVal;
        if (isAlert) {
          doc.setTextColor(168, 44, 44);
          doc.text("CRÍTICO (Bajo umbral)", margin + 155, yOffsetPage4 + 6);
        } else {
          doc.setTextColor(16, 124, 65);
          doc.text("OPERATIVO OK", margin + 155, yOffsetPage4 + 6);
        }

        yOffsetPage4 += 10;
      });

      yOffsetPage4 += 8;
    }

    // 2. Strategic Notes List Section
    if (notes) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.text("Notas Estratégicas por Fase", margin, yOffsetPage4);
      yOffsetPage4 += 6;

      const phaseKeys = [
        { key: "phase1", label: "Notas Fase 1 (Neural Alignment)" },
        { key: "phase2", label: "Notas Fase 2 (Velocity Multiplier)" },
        { key: "phase3", label: "Notas Fase 3 (Cognitive Dominance)" }
      ];

      phaseKeys.forEach((pk) => {
        const phaseNotes = notes[pk.key] || [];
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
        doc.text(pk.label, margin, yOffsetPage4);
        yOffsetPage4 += 5;

        // Draw separator
        doc.setDrawColor(colors.bgBorder[0], colors.bgBorder[1], colors.bgBorder[2]);
        doc.setLineWidth(0.2);
        doc.line(margin, yOffsetPage4, pageWidth - margin, yOffsetPage4);
        yOffsetPage4 += 4;

        if (phaseNotes.length === 0) {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(8.5);
          doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
          doc.text("No hay notas registradas para esta fase.", margin + 4, yOffsetPage4);
          yOffsetPage4 += 8;
        } else {
          phaseNotes.forEach((n) => {
            // Check if page overflow
            if (yOffsetPage4 > pageHeight - 30) {
              drawFooter(doc.getNumberOfPages(), totalPages);
              doc.addPage();
              drawHeader(doc.getNumberOfPages(), "NOTAS DE ESTRATEGIA (CONTINUACIÓN)");
              yOffsetPage4 = 38;
            }

            // Draw a small icon/indicator
            const indicatorColor = n.isMilestone ? [168, 85, 247] : colors.accent;
            doc.setFillColor(indicatorColor[0], indicatorColor[1], indicatorColor[2]);
            doc.rect(margin + 2, yOffsetPage4 - 2.5, 2, 2, "F");

            // Text text
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8.5);
            doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);

            let textToShow = n.text;
            if (n.isMilestone) {
              textToShow = `[HITO] ${textToShow}`;
            }

            // Wrap text nicely
            const lines = doc.splitTextToSize(textToShow, contentWidth - 30);
            doc.text(lines, margin + 8, yOffsetPage4);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(7);
            doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
            doc.text(`${n.createdAt}`, pageWidth - margin - 20, yOffsetPage4, { align: "right" });

            yOffsetPage4 += (lines.length * 4) + 3;
          });
          yOffsetPage4 += 4;
        }
      });
    }

    drawFooter(doc.getNumberOfPages(), totalPages);
  }

  // Save the PDF!
  const fileName = `${strategy.businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-reporte-estrategico.pdf`;
  doc.save(fileName);
}
