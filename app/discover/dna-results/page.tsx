"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useSpring, useInView, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadarChart } from "@/app/components/radar-chart";
import { Gauge } from "@/app/components/gauge";
import { SkillBar } from "@/app/components/skill-bar";
import { StatCard } from "@/app/components/stat-card";
import {
  RefreshCw, Target, Zap, AlertTriangle, TrendingUp, CheckCircle2, XCircle,
  Brain, Users, AlertCircle, Sparkles, FileText, Flame, Scale, Eye, Heart,
  ZapOff, Crown, Rocket, MessageCircle, Activity, Compass, UserCircle,
  Lightbulb, Shield, Star, ChevronRight, ArrowRight,
} from "lucide-react";

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

// Background decoration component
function BackgroundDecorations() {
  return (
    <>
      {/* Top-right gradient blob */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 70% 20%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
        }}
      />
      {/* Bottom-left gradient blob */}
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
        }}
      />
      {/* Subtle grid pattern */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
    </>
  );
}

// Helper to split description into bullet points
function parseDescriptionToBullets(description: string): string[] {
  if (!description) return [];
  // Split by periods or semicolons, filter out empty strings
  return description
    .split(/[.;]/)
    .map(s => s.trim())
    .filter(s => s.length > 10)
    .slice(0, 6);
}

const DNA_KEY = "ventureGates_dna";
const ANSWERS_KEY = "ventureGates_answers";

const fallbackPlaybook = {
  framework: [
    { step: 1, title: "48-Hour Rule", description: "Sleep on major decisions. Your cognitive profile benefits from subconscious processing time.", action: "Set 48h minimum" },
    { step: 2, title: "Bias Check", description: "Before committing, list 3 reasons why you might be wrong.", action: "Write them down" },
    { step: 3, title: "Energy Test", description: "Rate excitement 1-10. Below 7? It's a no.", action: "Only pursue 7+" },
  ],
  gtm: [
    { step: 1, title: "Validate First", description: "Use smoke tests before building. Landing page beats MVP.", action: "Launch waitlist" },
    { step: 2, title: "First 100", description: "Find 100 people who genuinely need this.", action: "Talk to users" },
  ],
  hiring: [
    { step: 1, title: "Gap Analysis", description: "Your first hire covers your biggest weakness.", action: "Score yourself" },
  ],
  funding: [
    { step: 1, title: "Bootstrap", description: "Raise with traction. Traction makes fundraising easy.", action: "$1K MRR target" },
  ],
  wellness: [
    { step: 1, title: "Burnout Watch", description: "Watch for: irritability, sleep issues, avoiding decisions.", action: "Weekly check" },
  ],
};

export default function DNAResultsPage() {
  const router = useRouter();
  const [dna, setDna] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<any>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  // ALL hooks must be before any conditional returns
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });

  useEffect(() => {
    const savedDNA = localStorage.getItem(DNA_KEY);
    const savedAnswers = localStorage.getItem(ANSWERS_KEY);
    
    console.log("[DNA Results] Raw savedDNA:", savedDNA?.substring(0, 200));
    console.log("[DNA Results] Raw savedAnswers:", savedAnswers?.substring(0, 200));
    
    if (savedDNA) {
      try {
        const parsed = JSON.parse(savedDNA);
        console.log("[DNA Results] Parsed DNA:", parsed);
        
        // API returns { founder_dna: { archetype, cognitive_profile, ... } }
        // Smart fallback also returns { founder_dna: { ... } }
        // So we need to unwrap it
        const dnaData = parsed.founder_dna || parsed;
        console.log("[DNA Results] Extracted dnaData:", dnaData);
        console.log("[DNA Results] archetype:", dnaData?.archetype);
        
        setDna(dnaData);
      } catch (e) {
        console.error("[DNA Results] Failed to parse DNA:", e);
      }
    } else {
      console.warn("[DNA Results] No saved DNA found");
    }
    
    if (savedAnswers) {
      try {
        const parsedAnswers = JSON.parse(savedAnswers);
        console.log("[DNA Results] Loaded answers:", parsedAnswers);
        setAnswers(parsedAnswers);
      } catch (e) {
        console.error("[DNA Results] Failed to parse answers:", e);
      }
    } else {
      console.warn("[DNA Results] No saved answers found");
    }
    
    setLoading(false);
  }, []);

  // Extract all DNA data with deep fallbacks
  // El DNA ya viene como objeto founder_dna desde el useEffect (línea 119)
  // dna = parsed.founder_dna || parsed.venture_dna || parsed
  
  const archetype = dna?.archetype || {
    name: "The Visionary Architect",
    tagline: "You build bold visions with systematic precision.",
    description: "Your founder DNA emerges from a unique combination of structure preference, risk appetite, and collaboration orientation.",
    founder_market_fit_score: 75
  };
  
  const cognitive = dna?.cognitive_profile || {
    dominant_function: "Systematic problem solving",
    auxiliary_function: "Strategic planning",
    decision_making: "You gather information before making informed decisions.",
    stress_response: "Under stress, you seek to impose order and structure.",
    flow_triggers: ["Solving complex problems", "Strategic planning", "Building systems"]
  };
  
  const edge = dna?.the_edge || {
    superpowers: [
      {
        name: "Strategic Vision",
        description: "You naturally see how pieces fit together into a coherent whole.",
        evidence: "Based on your assessment patterns",
        unfair_advantage: "Your ability to see the big picture gives you an edge."
      }
    ],
    pattern_recognition: "You notice patterns in complexity that others miss."
  };
  
  const shadow = dna?.the_shadow || {
    cognitive_biases: [
      {
        bias: "Perfectionism",
        manifestation: "Delaying launches until 'ready'",
        trigger: "Quality threshold not met",
        mitigation: "Ship at 80%. Iterate later."
      }
    ],
    failure_patterns: ["Over-engineering simple solutions"],
    blind_spots: ["Emotional undertones in teams"],
    energy_drains: ["Repetitive meetings without decisions"]
  };
  
  const ventureFit = dna?.venture_fit || {
    sweet_spot: {
      type: "B2B SaaS with clear metrics",
      description: "Your systematic nature excels with clear KPIs.",
      examples: ["Enterprise software", "Developer tools", "B2B marketplaces"]
    },
    danger_zone: {
      type: "Early-stage consumer social",
      description: "Ambiguity and emotional buyers drain you.",
      warning_signs: ["Unclear success metrics", "Long sales cycles"]
    },
    cofounder_profile: "Technical expert who complements your strategic vision.",
    optimal_stage: "Seed to Series A",
    team_size_ideal: "5-15 people"
  };
  
  const playbook = dna?.playbook || fallbackPlaybook;
  const dynamics = dna?.relationship_dynamics || {};

  // Helper to safely normalize playbook arrays
  const normalizePlaybookArray = (content: any, fallback: any[]): any[] => {
    if (!content) return fallback;
    if (Array.isArray(content) && content.length > 0) {
      // Validate that items have required fields
      return content.filter((item: any) => 
        item && typeof item === 'object' && 
        (item.step !== undefined || item.title !== undefined)
      ).map((item: any, idx: number) => ({
        step: item.step || idx + 1,
        title: item.title || "Step",
        description: item.description || "",
        action: item.action || "Apply",
        ...item
      }));
    }
    if (typeof content === 'string' && content.length > 20) {
      return [{ step: 1, title: "Strategy", description: content, action: "Apply" }];
    }
    return fallback;
  };

  const playbookSections = [
    { id: "decision", title: "Decision Framework", icon: <Scale className="w-5 h-5" />, color: "#8B5CF6", content: normalizePlaybookArray(playbook.decision_framework, fallbackPlaybook.framework) },
    { id: "gtm", title: "Go-to-Market", icon: <Rocket className="w-5 h-5" />, color: "#06B6D4", content: normalizePlaybookArray(playbook.gtm_strategy, fallbackPlaybook.gtm) },
    { id: "hiring", title: "First Hire", icon: <Users className="w-5 h-5" />, color: "#10B981", content: normalizePlaybookArray(playbook.first_hire, fallbackPlaybook.hiring) },
    { id: "funding", title: "Funding", icon: <TrendingUp className="w-5 h-5" />, color: "#F59E0B", content: normalizePlaybookArray(playbook.fundraising_approach || playbook.funding, fallbackPlaybook.funding) },
    { id: "wellness", title: "Wellness", icon: <Heart className="w-5 h-5" />, color: "#EC4899", content: normalizePlaybookArray(playbook.wellness, fallbackPlaybook.wellness) },
  ];

  const safeParseInt = (val: any, fallback = 5): number => {
    if (val === undefined || val === null) return fallback;
    const parsed = parseInt(String(val), 10);
    return isNaN(parsed) ? fallback : parsed;
  };

  // Personality data for radar - CRITICAL: must use answers from wizard
  console.log("[DNA Results] Building personalityData from answers:", answers);
  console.log("[DNA Results] answers?.structure_chaos:", answers?.structure_chaos);
  console.log("[DNA Results] answers?.risk_security:", answers?.risk_security);
  console.log("[DNA Results] answers?.individual_tribal:", answers?.individual_tribal);
  
  const personalityData = [
    { label: "Structure", value: safeParseInt(answers?.structure_chaos, 5) },
    { label: "Risk", value: safeParseInt(answers?.risk_security, 5) },
    { label: "Individual", value: safeParseInt(answers?.individual_tribal, 5) },
    { label: "Vision", value: safeParseInt(answers?.vision_execution, 5) },
    { label: "Innovation", value: safeParseInt(answers?.innovation_optimization, 5) },
    { label: "Speed", value: safeParseInt(answers?.speed_quality, 5) },
  ];
  
  console.log("[DNA Results] personalityData:", personalityData);

  const descriptionBullets = parseDescriptionToBullets(archetype.description);

  // NOW the conditional returns (after all hooks)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="w-12 h-12 border-2 border-neutral-400 border-t-neutral-800 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading your profile...</p>
        </motion.div>
      </div>
    );
  }

  if (!dna) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="text-center bg-white p-12 rounded-2xl border border-neutral-200 shadow-sm">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Profile Not Found</h2>
          <Button onClick={() => router.push("/discover")} className="mt-4 bg-neutral-900">Take Assessment</Button>
        </div>
      </div>
    );
  }
  
  // DEBUG: Show warning if answers are missing
  if (!answers || !answers.structure_chaos) {
    console.warn("[DNA Results] WARNING: Wizard answers not found! Using defaults.");
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-neutral-900 overflow-x-hidden">
      <BackgroundDecorations />
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-amber-500 z-50 origin-left" style={{ scaleX }} />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-lg leading-tight">VentureGates</span>
              <span className="text-xs text-neutral-500">Founder DNA Analysis</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push("/discover")} className="text-neutral-600 hover:text-neutral-900">
              <RefreshCw className="w-4 h-4 mr-2" /> Retake Assessment
            </Button>
            <Button size="sm" onClick={() => router.push("/discover/processing-ventures")} className="bg-neutral-900 text-white hover:bg-neutral-800">
              <Sparkles className="w-4 h-4 mr-2" /> Generate Ventures
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-24 pb-32">
        {/* Hero - ULTRA SIMPLE */}
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <div className="text-center mb-12">
            <div className="mb-4">
              <span className="px-4 py-2 bg-cyan-50 text-cyan-700 border border-cyan-200 rounded-full text-sm font-medium">
                Founder DNA Analysis
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-gray-900">
              {dna?.archetype?.name || "Loading..."}
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto">
              {dna?.archetype?.tagline || "Complete the wizard to see your profile"}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <StatCard value={archetype?.founder_market_fit_score || 75} label="Market Fit" color="#06B6D4" />
            <StatCard value={(edge?.superpowers || []).length} label="Superpowers" color="#8B5CF6" />
            <StatCard value={(shadow?.cognitive_biases || []).length} label="Biases" color="#F59E0B" />
            <StatCard value={ventureFit?.sweet_spot?.type || "B2C"} label="Sweet Spot" color="#10B981" />
          </div>

          {/* Operating System - Description as bullet points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.5 }}
            className="relative"
          >
            {/* Gradient backdrop */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-50/50 via-violet-50/30 to-amber-50/50 rounded-3xl -z-10" />
            
            <div className="p-8 md:p-10 rounded-3xl border border-neutral-200/60 bg-white/40 backdrop-blur-sm">
              <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-6 text-center">
                Your Operating System
              </h2>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                {descriptionBullets.map((bullet, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isHeroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="flex items-start gap-3 group"
                  >
                    <div className="mt-1 flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-cyan-500 group-hover:text-violet-500 transition-colors duration-300" />
                    </div>
                    <p className="text-neutral-700 leading-relaxed group-hover:text-neutral-900 transition-colors duration-300">
                      {bullet}.
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Cognitive */}
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08)" }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl p-8 md:p-12 border border-neutral-200 shadow-sm hover:border-neutral-300 transition-colors"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <motion.div 
                  className="flex items-center gap-3 mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-100 to-cyan-50 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900">Cognitive Profile</h2>
                    <p className="text-neutral-500">How you process information</p>
                  </div>
                </motion.div>
                <motion.div 
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <motion.div variants={itemVariants}>
                    <SkillBar label="Structure Preference" value={personalityData[0].value * 10} color="#06B6D4" />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <SkillBar label="Risk Appetite" value={personalityData[1].value * 10} color="#8B5CF6" />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <SkillBar label="Independence Level" value={personalityData[2].value * 10} color="#10B981" />
                  </motion.div>
                </motion.div>
                <motion.div 
                  className="mt-6 p-4 rounded-xl bg-gradient-to-r from-neutral-50 to-white border border-neutral-200"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-sm text-cyan-600 font-medium">Dominant: <span className="text-neutral-800">{cognitive.dominant_function}</span></p>
                  <p className="text-sm text-violet-600 font-medium mt-2">Auxiliary: <span className="text-neutral-800">{cognitive.auxiliary_function}</span></p>
                  {cognitive.decision_making && <div className="pt-3 border-t border-neutral-200 mt-3"><p className="text-xs text-neutral-500 mb-1">Decision Making</p><p className="text-sm text-neutral-700">{cognitive.decision_making}</p></div>}
                  {cognitive.stress_response && <div className="mt-2"><p className="text-xs text-neutral-500 mb-1">Stress Response</p><p className="text-sm text-neutral-700">{cognitive.stress_response}</p></div>}
                </motion.div>
              </div>
              <motion.div 
                className="flex justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <RadarChart data={personalityData} size={320} />
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* The Edge - Full-width hero layout */}
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white"
          >
            {/* Background decorations */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>
            
            <div className="relative p-8 md:p-12 lg:p-16">
              {/* Header */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                  <Crown className="w-5 h-5 text-amber-300" />
                  <span className="text-sm font-medium text-white/90">Your Competitive Advantage</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">The Edge</h2>
                <p className="text-lg text-white/70 max-w-2xl mx-auto">
                  These superpowers define your unique founder profile and give you an unfair advantage.
                </p>
              </motion.div>

              {/* Superpowers Grid - Flexible based on count */}
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={`grid gap-6 mb-12 ${(edge.superpowers || []).length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}
              >
                {(edge.superpowers || []).map((p: any, i: number) => (
                  <motion.div 
                    key={i} 
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
                    className="group p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        {i === 0 ? <Star className="w-6 h-6 text-amber-300" /> : 
                         i === 1 ? <Zap className="w-6 h-6 text-cyan-300" /> : 
                         <Rocket className="w-6 h-6 text-emerald-300" />}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                        {i + 1}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-amber-300 transition-colors">{p.name}</h3>
                    <p className="text-white/80 text-sm leading-relaxed mb-4">{p.description}</p>
                    <div className="pt-4 border-t border-white/10 space-y-2">
                      <p className="text-xs text-white/60">Evidence: <span className="text-white/80">{p.evidence}</span></p>
                      <p className="text-xs text-amber-300 font-medium">{p.unfair_advantage}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Pattern Recognition */}
              {edge.pattern_recognition && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <Eye className="w-6 h-6 text-amber-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2 text-amber-300">Pattern Recognition</h3>
                      <p className="text-white/80 leading-relaxed">{edge.pattern_recognition}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </section>

        {/* The Shadow */}
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900">The Shadow</h2>
            </div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-4 mb-8"
            >
              {(shadow.cognitive_biases || []).map((bias: any, i: number) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  className="p-5 rounded-xl bg-rose-50 border border-rose-200 hover:border-rose-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-rose-700">{bias.bias}</h3>
                    <Badge variant="outline" className="border-rose-300 text-rose-600">Watch</Badge>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div><p className="text-neutral-500 mb-1">Manifestation</p><p className="text-neutral-700">{bias.manifestation}</p></div>
                    <div><p className="text-neutral-500 mb-1">Trigger</p><p className="text-neutral-700">{bias.trigger}</p></div>
                    <div><p className="text-neutral-500 mb-1">Mitigation</p><p className="text-emerald-600">{bias.mitigation}</p></div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div 
                whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)", transition: { duration: 0.2 } }}
                className="p-5 rounded-xl bg-white border border-neutral-200"
              >
                <h3 className="font-semibold text-neutral-800 mb-3 flex items-center gap-2"><ZapOff className="w-4 h-4 text-amber-600" /> Failures</h3>
                <ul className="space-y-2">{(shadow.failure_patterns || []).map((p: string, i: number) => <li key={i} className="text-sm text-neutral-600 flex gap-2"><span className="text-rose-500">→</span><span className="overflow-wrap-break-word break-words">{p}</span></li>)}</ul>
              </motion.div>
              <motion.div 
                whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)", transition: { duration: 0.2 } }}
                className="p-5 rounded-xl bg-white border border-neutral-200"
              >
                <h3 className="font-semibold text-neutral-800 mb-3 flex items-center gap-2"><Eye className="w-4 h-4 text-violet-600" /> Blind Spots</h3>
                <div className="flex flex-wrap gap-2">
                  {(shadow.blind_spots || []).map((s: string, i: number) => (
                    <Badge key={i} className="bg-violet-100 text-violet-700 border-violet-200 max-w-full overflow-wrap-break-word break-words whitespace-normal text-left">
                      {s}
                    </Badge>
                  ))}
                </div>
              </motion.div>
              <motion.div 
                whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)", transition: { duration: 0.2 } }}
                className="p-5 rounded-xl bg-white border border-neutral-200"
              >
                <h3 className="font-semibold text-neutral-800 mb-3 flex items-center gap-2"><ZapOff className="w-4 h-4 text-amber-600" /> Energy Drains</h3>
                <div className="flex flex-wrap gap-2">
                  {(shadow.energy_drains || []).map((d: string, i: number) => (
                    <Badge key={i} className="bg-amber-100 text-amber-700 border-amber-200 max-w-full overflow-wrap-break-word break-words whitespace-normal text-left">
                      {d}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Venture Fit */}
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Target className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900">Venture Fit</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <motion.div 
                whileHover={{ y: -4, boxShadow: "0 20px 40px -15px rgba(16, 185, 129, 0.2)", transition: { duration: 0.2 } }}
                className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200"
              >
                <h3 className="font-semibold text-emerald-700 mb-2 flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> Sweet Spot</h3>
                <p className="text-lg font-medium text-neutral-900 mb-2">{ventureFit.sweet_spot?.type}</p>
                <p className="text-neutral-700 mb-4">{ventureFit.sweet_spot?.description}</p>
                <div className="flex flex-wrap gap-2">
                  {(ventureFit.sweet_spot?.examples || []).map((e: string, i: number) => (
                    <Badge key={i} className="bg-emerald-100 text-emerald-700 border-emerald-200">
                      {e}
                    </Badge>
                  ))}
                </div>
              </motion.div>
              <motion.div 
                whileHover={{ y: -4, boxShadow: "0 20px 40px -15px rgba(244, 63, 94, 0.2)", transition: { duration: 0.2 } }}
                className="p-6 rounded-2xl bg-rose-50 border border-rose-200"
              >
                <h3 className="font-semibold text-rose-700 mb-2 flex items-center gap-2"><XCircle className="w-5 h-5"/> Danger Zone</h3>
                <p className="text-lg font-medium text-neutral-900 mb-2">{ventureFit.danger_zone?.type}</p>
                <p className="text-neutral-700 mb-4">{ventureFit.danger_zone?.description}</p>
                <div className="space-y-1">
                  {(ventureFit.danger_zone?.warning_signs || []).map((s: string, i: number) => (
                    <p key={i} className="text-sm text-rose-600 flex items-start gap-2">
                      <span className="flex-shrink-0">⚠</span>
                      <span className="overflow-wrap-break-word break-words">{s}</span>
                    </p>
                  ))}
                </div>
              </motion.div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { icon: Users, color: "cyan", title: "Cofounder", content: ventureFit.cofounder_profile },
                { icon: Compass, color: "violet", title: "Stage", content: ventureFit.optimal_stage },
                { icon: UserCircle, color: "amber", title: "Team", content: ventureFit.team_size_ideal },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)", transition: { duration: 0.2 } }}
                  className="p-5 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 transition-colors"
                >
                  <h3 className={`font-semibold text-${item.color}-600 mb-2 flex items-center gap-2`}>
                    <item.icon className="w-4 h-4"/> {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600">{item.content}</p>
                </motion.div>
              ))}
            </div>
            
            {/* Gauges - Responsive grid with real data */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Gauge 
                value={archetype.founder_market_fit_score || 75} 
                label="Market Fit" 
                color="#10B981" 
              />
              <Gauge 
                value={safeParseInt(answers?.risk_security, 5) * 10} 
                label="Risk Tolerance" 
                color="#06B6D4" 
              />
              <Gauge 
                value={safeParseInt(answers?.individual_tribal, 5) * 10} 
                label="Independence" 
                color="#8B5CF6" 
              />
              <Gauge 
                value={safeParseInt(answers?.structure_chaos, 5) * 10} 
                label="Structure" 
                color="#F59E0B" 
              />
            </div>
          </motion.div>
        </section>

        {/* Relationship Dynamics */}
        {(dynamics.as_cofounder || dynamics.as_leader) && (
          <section className="max-w-6xl mx-auto px-6 mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-cyan-600" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900">Relationship Dynamics</h2>
              </div>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid md:grid-cols-2 gap-6"
              >
                {dynamics.as_cofounder && (
                  <motion.div 
                    variants={itemVariants}
                    whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)", transition: { duration: 0.2 } }}
                    className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-cyan-200 transition-colors"
                  >
                    <h3 className="font-semibold text-cyan-700 mb-2">As Cofounder</h3>
                    <p className="text-neutral-700">{dynamics.as_cofounder}</p>
                  </motion.div>
                )}
                {dynamics.as_leader && (
                  <motion.div 
                    variants={itemVariants}
                    whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)", transition: { duration: 0.2 } }}
                    className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-violet-200 transition-colors"
                  >
                    <h3 className="font-semibold text-violet-700 mb-2">As Leader</h3>
                    <p className="text-neutral-700">{dynamics.as_leader}</p>
                  </motion.div>
                )}
                {dynamics.communication_style && (
                  <motion.div 
                    variants={itemVariants}
                    whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)", transition: { duration: 0.2 } }}
                    className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-emerald-200 transition-colors"
                  >
                    <h3 className="font-semibold text-emerald-700 mb-2">Communication</h3>
                    <p className="text-neutral-700">{dynamics.communication_style}</p>
                  </motion.div>
                )}
                {dynamics.conflict_response && (
                  <motion.div 
                    variants={itemVariants}
                    whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)", transition: { duration: 0.2 } }}
                    className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-amber-200 transition-colors"
                  >
                    <h3 className="font-semibold text-amber-700 mb-2">Conflict Response</h3>
                    <p className="text-neutral-700">{dynamics.conflict_response}</p>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </section>
        )}

        {/* The Playbook */}
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900">The Playbook</h2>
            </div>
            <div className="space-y-6">
              {playbookSections.map((section, i) => (
                <motion.div 
                  key={section.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: i * 0.1 }} 
                  whileHover={{ boxShadow: "0 20px 40px -15px rgba(0,0,0,0.08)", transition: { duration: 0.3 } }}
                  className="rounded-2xl bg-white border border-neutral-200 overflow-hidden shadow-sm hover:border-neutral-300 transition-colors"
                >
                  <div className="p-6 flex items-center gap-4 border-b border-neutral-100" style={{ backgroundColor: `${section.color}10` }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${section.color}20`, color: section.color }}>{section.icon}</div>
                    <h3 className="text-xl font-semibold" style={{ color: section.color }}>{section.title}</h3>
                  </div>
                  <div className="p-6">
                    {/* Responsive grid: 3 cols desktop, 2 cols tablet, 1 col mobile */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {section.content.map((item: any, j: number) => (
                        <motion.div 
                          key={j} 
                          whileHover={{ y: -4, boxShadow: "0 8px 25px -10px rgba(0,0,0,0.1)", transition: { duration: 0.2 } }}
                          className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 h-full hover:border-neutral-300 transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: `${section.color}20`, color: section.color }}>{item.step}</span>
                            <h4 className="font-medium text-neutral-900">{item.title}</h4>
                          </div>
                          <p className="text-sm text-neutral-600 overflow-wrap-break-word break-words">{item.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Flow Triggers */}
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="p-8 rounded-2xl bg-gradient-to-r from-cyan-50 via-violet-50 to-amber-50 border border-neutral-200 relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-200/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-amber-200/30 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  <Flame className="w-6 h-6 text-cyan-600" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900">Flow Triggers</h2>
              </div>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-5 gap-4"
              >
                {(cognitive.flow_triggers || []).map((trigger: string, i: number) => (
                  <motion.div 
                    key={i} 
                    variants={itemVariants}
                    whileHover={{ y: -4, scale: 1.02, boxShadow: "0 10px 25px -10px rgba(0,0,0,0.1)", transition: { duration: 0.2 } }}
                    className="p-4 rounded-xl bg-white border border-neutral-200 text-center hover:border-cyan-200 transition-colors"
                  >
                    <span className="text-lg font-bold text-cyan-600">{i + 1}</span>
                    <p className="text-sm text-neutral-700 mt-2 overflow-wrap-break-word break-words">{trigger}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            whileHover={{ boxShadow: "0 30px 60px -20px rgba(0,0,0,0.1)", transition: { duration: 0.3 } }}
            className="p-8 md:p-12 rounded-2xl bg-white border border-neutral-200 shadow-sm relative overflow-hidden"
          >
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-amber-500" />
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-cyan-100/50 to-transparent rounded-full blur-3xl" />
            
            <div className="relative">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center mx-auto mb-6"
              >
                <Rocket className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900">Ready to discover your ventures?</h2>
              <p className="text-neutral-600 mb-8 text-lg max-w-lg mx-auto">We'll generate 3 personalized opportunities based on your DNA.</p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  size="lg" 
                  onClick={() => router.push("/discover/processing-ventures")} 
                  className="bg-neutral-900 text-white hover:bg-neutral-800 text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Sparkles className="w-5 h-5 mr-2" /> Generate Ventures
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
