#!/usr/bin/env node
/**
 * i18n Regression Check for VentureGates Wizard
 * Checks the questions array in page.tsx for Spanish text
 * Returns exit code 0 if clean, exit code 1 if Spanish detected
 */

const fs = require("fs");
const path = require("path");

const PAGE_FILE = path.join(process.cwd(), "app/discover/page.tsx");

// Spanish detection patterns (case insensitive)
const SPANISH_PATTERNS = [
  // Inverted punctuation
  { regex: /¿/, name: "inverted question mark (¿)" },
  { regex: /¡/, name: "inverted exclamation mark (¡)" },

  // Common Spanish suffixes
  { regex: /ción\b/i, name: "Spanish suffix -ción" },
  { regex: /sión\b/i, name: "Spanish suffix -sión" },
  { regex: /dad\b/i, name: "Spanish suffix -dad" },
  { regex: /mente\b/i, name: "Spanish suffix -mente" },

  // Common Spanish words
  { regex: /\btu\s/i, name: "Spanish word 'tu'" },
  { regex: /\btus\s/i, name: "Spanish word 'tus'" },
  { regex: /cómo\b/i, name: "Spanish word 'cómo'" },
  { regex: /qué\b/i, name: "Spanish word 'qué'" },
  { regex: /dónde\b/i, name: "Spanish word 'dónde'" },
  { regex: /preferido/i, name: "Spanish word 'preferido'" },
  { regex: /trabajo\b/i, name: "Spanish word 'trabajo'" },
  { regex: /prefieres/i, name: "Spanish word 'prefieres'" },
  { regex: /organizas/i, name: "Spanish word 'organizas'" },
  { regex: /claras\b/i, name: "Spanish word 'claras'" },
  { regex: /improvisación/i, name: "Spanish word 'improvisación'" },
  { regex: /definidos/i, name: "Spanish word 'definidos'" },
  { regex: /horarios/i, name: "Spanish word 'horarios'" },
  { regex: /planificación/i, name: "Spanish word 'planificación'" },
  { regex: /detallada/i, name: "Spanish word 'detallada'" },
  { regex: /flexibilidad/i, name: "Spanish word 'flexibilidad'" },
  { regex: /adaptación/i, name: "Spanish word 'adaptación'" },
  { regex: /rígido/i, name: "Spanish word 'rígido'" },
  { regex: /riesgo/i, name: "Spanish word 'riesgo'" },
  { regex: /seguridad/i, name: "Spanish word 'seguridad'" },
  { regex: /tolerancia/i, name: "Spanish word 'tolerancia'" },
  { regex: /empresarial/i, name: "Spanish word 'empresarial'" },
  { regex: /importante/i, name: "Spanish word 'importante'" },
  { regex: /negocio/i, name: "Spanish word 'negocio'" },
  { regex: /priorizas/i, name: "Spanish word 'priorizas'" },
  { regex: /minimizar/i, name: "Spanish word 'minimizar'" },
  { regex: /apostar/i, name: "Spanish word 'apostar'" },
  { regex: /seguro\b/i, name: "Spanish word 'seguro'" },
  { regex: /validación/i, name: "Spanish word 'validación'" },
  { regex: /previa/i, name: "Spanish word 'previa'" },
  { regex: /pérdidas/i, name: "Spanish word 'pérdidas'" },
  { regex: /mínimas/i, name: "Spanish word 'mínimas'" },
  { regex: /potencial/i, name: "Spanish word 'potencial'" },
  { regex: /primero\s+en/i, name: "Spanish phrase 'primero en'" },
  { regex: /mercado/i, name: "Spanish word 'mercado'" },
  { regex: /asumo/i, name: "Spanish word 'asumo'" },
  { regex: /tribal/i, name: "Spanish context 'tribal'" },
  { regex: /viene\b/i, name: "Spanish word 'viene'" },
  { regex: /energía/i, name: "Spanish word 'energía'" },
  { regex: /laboral/i, name: "Spanish word 'laboral'" },
  { regex: /entorno/i, name: "Spanish word 'entorno'" },
  { regex: /sientes/i, name: "Spanish word 'sientes'" },
  { regex: /productivo/i, name: "Spanish word 'productivo'" },
  { regex: /energizado/i, name: "Spanish word 'energizado'" },
  { regex: /solitario/i, name: "Spanish word 'solitario'" },
  { regex: /colaboración/i, name: "Spanish word 'colaboración'" },
  { regex: /profundo/i, name: "Spanish word 'profundo'" },
  { regex: /profunda/i, name: "Spanish word 'profunda'" },
  { regex: /distracciones/i, name: "Spanish word 'distracciones'" },
  { regex: /equipo/i, name: "Spanish word 'equipo'" },
  { regex: /grupal/i, name: "Spanish word 'grupal'" },
  { regex: /continua/i, name: "Spanish word 'continua'" },
  { regex: /preguntas/i, name: "Spanish word 'preguntas'" },
  { regex: /con\s+sliders/i, name: "Spanish phrase 'con sliders'" },
  { regex: /posición/i, name: "Spanish word 'posición'" },
  { regex: /equilibrio/i, name: "Spanish word 'equilibrio'" },
];

function findSpanishStrings(content) {
  const lines = content.split("\n");
  const findings = [];

  lines.forEach((line, index) => {
    // Skip comments
    if (line.trim().startsWith("//")) return;

    // Check each pattern
    SPANISH_PATTERNS.forEach((pattern) => {
      if (pattern.regex.test(line)) {
        // Extract string literals from the line
        const stringMatches = line.match(/["']([^"']*?[¿¡áéíóúñÁÉÍÓÚÑ].*?)["']/);
        if (stringMatches) {
          findings.push({
            line: index + 1,
            text: stringMatches[1],
            pattern: pattern.name,
          });
        }
      }
    });
  });

  return findings;
}

function main() {
  console.log("🔍 Running VentureGates Wizard i18n Check...\n");

  if (!fs.existsSync(PAGE_FILE)) {
    console.error(`❌ File not found: ${PAGE_FILE}`);
    process.exit(1);
  }

  const content = fs.readFileSync(PAGE_FILE, "utf-8");

  const findings = findSpanishStrings(content);

  if (findings.length === 0) {
    console.log("✅ No Spanish text detected in wizard questions!");
    console.log("✅ All strings are in English.");
    process.exit(0);
  } else {
    console.log(`❌ Found ${findings.length} Spanish string(s):\n`);
    findings.forEach((finding) => {
      console.log(`  Line ${finding.line}: "${finding.text}"`);
      console.log(`    Matched pattern: ${finding.pattern}`);
      console.log();
    });
    process.exit(1);
  }
}

main();
