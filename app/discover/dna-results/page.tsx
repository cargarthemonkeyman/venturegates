"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
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
} from "lucide-react";

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

  useEffect(() => {
    const savedDNA = localStorage.getItem(DNA_KEY);
    const savedAnswers = localStorage.getItem(ANSWERS_KEY);
    
    if (savedDNA) {
      try {
        const parsed = JSON.parse(savedDNA);
        const dnaData = parsed.founder_dna || parsed.venture_dna || parsed;
        setDna(dnaData);
        console.log("Loaded DNA:", dnaData);
      } catch (e) {
        console.error("Failed to parse DNA:", e);
      }
    }
    
    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers));
      } catch (e) {
        console.error("Failed to parse answers:", e);
      }
    }
    
    setLoading(false);
  }, []);

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

  // Extract all DNA data
  const archetype = dna.archetype || {};
  const cognitive = dna.cognitive_profile || {};
  const edge = dna.the_edge || {};
  const shadow = dna.the_shadow || {};
  const ventureFit = dna.venture_fit || {};
  const playbook = dna.playbook || {};
  const dynamics = dna.relationship_dynamics || {};

  const parseContent = (content: string | undefined, fallback: any[]) => {
    if (!content || typeof content !== 'string' || content.length < 20) return fallback;
    return [{ step: 1, title: "Strategy", description: content, action: "Apply" }];
  };

  const playbookSections = [
    { id: "decision", title: "Decision Framework", icon: <Scale className="w-5 h-5" />, color: "#8B5CF6", content: parseContent(playbook.decision_framework, fallbackPlaybook.framework) },
    { id: "gtm", title: "Go-to-Market", icon: <Rocket className="w-5 h-5" />, color: "#06B6D4", content: parseContent(playbook.gtm_strategy, fallbackPlaybook.gtm) },
    { id: "hiring", title: "First Hire", icon: <Users className="w-5 h-5" />, color: "#10B981", content: parseContent(playbook.first_hire, fallbackPlaybook.hiring) },
    { id: "funding", title: "Funding", icon: <TrendingUp className="w-5 h-5" />, color: "#F59E0B", content: parseContent(playbook.fundraising_approach, fallbackPlaybook.funding) },
    { id: "wellness", title: "Wellness", icon: <Heart className="w-5 h-5" />, color: "#EC4899", content: (playbook.burnout_signals || []).length > 0 ? [{ step: 1, title: "Burnout", description: playbook.burnout_signals.join(". "), action: "Watch" }] : fallbackPlaybook.wellness },
  ];

  const personalityData = [
    { label: "Structure", value: parseInt(answers?.structure_chaos || "5") },
    { label: "Risk", value: parseInt(answers?.risk_security || "5") },
    { label: "Individual", value: parseInt(answers?.individual_tribal || "5") },
    { label: "Vision", value: parseInt(answers?.vision_execution || "5") },
    { label: "Innovation", value: parseInt(answers?.innovation_optimization || "5") },
    { label: "Speed", value: parseInt(answers?.speed_quality || "5") },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-neutral-900 overflow-x-hidden">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-amber-500 z-50 origin-left" style={{ scaleX }} />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg">VentureGates</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push("/discover")} className="text-neutral-600 hover:text-neutral-900">
              <RefreshCw className="w-4 h-4 mr-2" /> Retake
            </Button>
            <Button size="sm" onClick={() => router.push("/discover/processing-ventures")} className="bg-neutral-900 text-white hover:bg-neutral-800">
              <Sparkles className="w-4 h-4 mr-2" /> Generate Ventures
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-24 pb-32">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <Badge className="mb-4 bg-neutral-100 text-cyan-600 border-cyan-200">Founder DNA Analysis</Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-neutral-900">{archetype.name}</h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">{archetype.tagline}</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <StatCard value={archetype.founder_market_fit_score || 75} label="Market Fit" color="#06B6D4" delay={0.1} />
            <StatCard value={(edge.superpowers || []).length} label="Superpowers" color="#8B5CF6" delay={0.2} />
            <StatCard value={(shadow.cognitive_biases || []).length} label="Biases" color="#F59E0B" delay={0.3} />
            <StatCard value={ventureFit.sweet_spot?.type || "B2C"} label="Sweet Spot" color="#10B981" delay={0.4} />
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-lg text-neutral-700 text-center max-w-3xl mx-auto">{archetype.description}</motion.p>
        </section>

        {/* Cognitive */}
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-3xl p-8 md:p-12 border border-neutral-200 shadow-sm">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Brain className="w-10 h-10 text-cyan-600" />
                  <div><h2 className="text-2xl font-bold text-neutral-900">Cognitive Profile</h2><p className="text-neutral-500">How you process</p></div>
                </div>
                <div className="space-y-4">
                  <SkillBar label="Dominant" value={90} color="#06B6D4" />
                  <SkillBar label="Pattern Recognition" value={85} color="#8B5CF6" />
                  <SkillBar label="Decision Speed" value={88} color="#10B981" />
                </div>
                <div className="mt-6 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                  <p className="text-sm text-cyan-600 font-medium">Dominant: <span className="text-neutral-800">{cognitive.dominant_function}</span></p>
                  <p className="text-sm text-violet-600 font-medium mt-2">Auxiliary: <span className="text-neutral-800">{cognitive.auxiliary_function}</span></p>
                  {cognitive.decision_making && <div className="pt-3 border-t border-neutral-200 mt-3"><p className="text-xs text-neutral-500 mb-1">Decision Making</p><p className="text-sm text-neutral-700">{cognitive.decision_making}</p></div>}
                  {cognitive.stress_response && <div className="mt-2"><p className="text-xs text-neutral-500 mb-1">Stress Response</p><p className="text-sm text-neutral-700">{cognitive.stress_response}</p></div>}
                </div>
              </div>
              <div className="flex justify-center"><RadarChart data={personalityData} size={320} /></div>
            </div>
          </motion.div>
        </section>

        {/* The Edge */}
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-neutral-900"><Crown className="w-8 h-8 text-violet-600" /> The Edge</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {(edge.superpowers || []).map((p: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-bold mb-4">{i + 1}</div>
                  <h3 className="text-lg font-semibold text-violet-700 mb-2">{p.name}</h3>
                  <p className="text-sm text-neutral-600">{p.description}</p>
                  <div className="pt-4 border-t border-neutral-200 mt-4 space-y-2">
                    <p className="text-xs text-neutral-500">Evidence: <span className="text-neutral-700">{p.evidence}</span></p>
                    <p className="text-xs text-violet-600 font-medium">{p.unfair_advantage}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            {edge.pattern_recognition && (
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-cyan-50 border border-neutral-200">
                <div className="flex items-start gap-4">
                  <Eye className="w-6 h-6 text-amber-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-amber-700 mb-2">Pattern Recognition</h3>
                    <p className="text-neutral-700">{edge.pattern_recognition}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </section>

        {/* The Shadow */}
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-neutral-900"><AlertTriangle className="w-8 h-8 text-rose-600" /> The Shadow</h2>
            <div className="space-y-4 mb-8">
              {(shadow.cognitive_biases || []).map((bias: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-5 rounded-xl bg-rose-50 border border-rose-200">
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
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl bg-white border border-neutral-200">
                <h3 className="font-semibold text-neutral-800 mb-3 flex items-center gap-2"><ZapOff className="w-4 h-4 text-amber-600" /> Failures</h3>
                <ul className="space-y-1">{(shadow.failure_patterns || []).map((p: string, i: number) => <li key={i} className="text-sm text-neutral-600 flex gap-2"><span className="text-rose-500">→</span>{p}</li>)}</ul>
              </div>
              <div className="p-5 rounded-xl bg-white border border-neutral-200">
                <h3 className="font-semibold text-neutral-800 mb-3 flex items-center gap-2"><Eye className="w-4 h-4 text-violet-600" /> Blind Spots</h3>
                <div className="flex flex-wrap gap-2">{(shadow.blind_spots || []).map((s: string, i: number) => <Badge key={i} className="bg-violet-100 text-violet-700 border-violet-200">{s}</Badge>)}</div>
              </div>
              <div className="p-5 rounded-xl bg-white border border-neutral-200">
                <h3 className="font-semibold text-neutral-800 mb-3 flex items-center gap-2"><ZapOff className="w-4 h-4 text-amber-600" /> Energy Drains</h3>
                <div className="flex flex-wrap gap-2">{(shadow.energy_drains || []).map((d: string, i: number) => <Badge key={i} className="bg-amber-100 text-amber-700 border-amber-200">{d}</Badge>)}</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Venture Fit */}
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-neutral-900"><Target className="w-8 h-8 text-emerald-600" /> Venture Fit</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200">
                <h3 className="font-semibold text-emerald-700 mb-2 flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> Sweet Spot</h3>
                <p className="text-lg font-medium text-neutral-900 mb-2">{ventureFit.sweet_spot?.type}</p>
                <p className="text-neutral-700 mb-4">{ventureFit.sweet_spot?.description}</p>
                <div className="flex flex-wrap gap-2">{(ventureFit.sweet_spot?.examples || []).map((e: string, i: number) => <Badge key={i} className="bg-emerald-100 text-emerald-700 border-emerald-200">{e}</Badge>)}</div>
              </div>
              <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200">
                <h3 className="font-semibold text-rose-700 mb-2 flex items-center gap-2"><XCircle className="w-5 h-5"/> Danger Zone</h3>
                <p className="text-lg font-medium text-neutral-900 mb-2">{ventureFit.danger_zone?.type}</p>
                <p className="text-neutral-700 mb-4">{ventureFit.danger_zone?.description}</p>
                <div className="space-y-1">{(ventureFit.danger_zone?.warning_signs || []).map((s: string, i: number) => <p key={i} className="text-sm text-rose-600">⚠ {s}</p>)}</div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="p-5 rounded-xl bg-white border border-neutral-200"><h3 className="font-semibold text-cyan-600 mb-2 flex items-center gap-2"><Users className="w-4 h-4"/> Cofounder</h3><p className="text-sm text-neutral-600">{ventureFit.cofounder_profile}</p></div>
              <div className="p-5 rounded-xl bg-white border border-neutral-200"><h3 className="font-semibold text-violet-600 mb-2 flex items-center gap-2"><Compass className="w-4 h-4"/> Stage</h3><p className="text-sm text-neutral-600">{ventureFit.optimal_stage}</p></div>
              <div className="p-5 rounded-xl bg-white border border-neutral-200"><h3 className="font-semibold text-amber-600 mb-2 flex items-center gap-2"><UserCircle className="w-4 h-4"/> Team</h3><p className="text-sm text-neutral-600">{ventureFit.team_size_ideal}</p></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Gauge value={archetype.founder_market_fit_score || 75} label="Market Fit" color="#10B981" />
              <Gauge value={parseInt(answers?.risk_security || "5") * 10} label="Risk" color="#06B6D4" />
              <Gauge value={parseInt(answers?.individual_tribal || "5") * 10} label="Independence" color="#8B5CF6" />
              <Gauge value={parseInt(answers?.structure_chaos || "5") * 10} label="Structure" color="#F59E0B" />
            </div>
          </motion.div>
        </section>

        {/* Relationship Dynamics */}
        {(dynamics.as_cofounder || dynamics.as_leader) && (
          <section className="max-w-6xl mx-auto px-6 mb-20">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-neutral-900"><Users className="w-8 h-8 text-cyan-600" /> Relationship Dynamics</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {dynamics.as_cofounder && <div className="p-6 rounded-2xl bg-white border border-neutral-200"><h3 className="font-semibold text-cyan-700 mb-2">As Cofounder</h3><p className="text-neutral-700">{dynamics.as_cofounder}</p></div>}
                {dynamics.as_leader && <div className="p-6 rounded-2xl bg-white border border-neutral-200"><h3 className="font-semibold text-violet-700 mb-2">As Leader</h3><p className="text-neutral-700">{dynamics.as_leader}</p></div>}
                {dynamics.communication_style && <div className="p-6 rounded-2xl bg-white border border-neutral-200"><h3 className="font-semibold text-emerald-700 mb-2">Communication</h3><p className="text-neutral-700">{dynamics.communication_style}</p></div>}
                {dynamics.conflict_response && <div className="p-6 rounded-2xl bg-white border border-neutral-200"><h3 className="font-semibold text-amber-700 mb-2">Conflict Response</h3><p className="text-neutral-700">{dynamics.conflict_response}</p></div>}
              </div>
            </motion.div>
          </section>
        )}

        {/* The Playbook */}
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-neutral-900"><FileText className="w-8 h-8 text-amber-600" /> The Playbook</h2>
            <div className="space-y-6">
              {playbookSections.map((section, i) => (
                <motion.div key={section.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl bg-white border border-neutral-200 overflow-hidden shadow-sm">
                  <div className="p-6 flex items-center gap-4 border-b border-neutral-100" style={{ backgroundColor: `${section.color}10` }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${section.color}20`, color: section.color }}>{section.icon}</div>
                    <h3 className="text-xl font-semibold" style={{ color: section.color }}>{section.title}</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      {section.content.map((item: any, j: number) => (
                        <div key={j} className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: `${section.color}20`, color: section.color }}>{item.step}</span>
                            <h4 className="font-medium text-neutral-900">{item.title}</h4>
                          </div>
                          <p className="text-sm text-neutral-600">{item.description}</p>
                        </div>
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
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-8 rounded-2xl bg-gradient-to-r from-cyan-50 via-violet-50 to-amber-50 border border-neutral-200">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-neutral-900"><Flame className="w-8 h-8 text-cyan-600" /> Flow Triggers</h2>
            <div className="grid md:grid-cols-5 gap-4">
              {(cognitive.flow_triggers || []).map((trigger: string, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-4 rounded-xl bg-white border border-neutral-200 text-center">
                  <span className="text-lg font-bold text-cyan-600">{i + 1}</span>
                  <p className="text-sm text-neutral-700 mt-2">{trigger}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-8 rounded-2xl bg-white border border-neutral-200 shadow-sm">
            <h2 className="text-3xl font-bold mb-4 text-neutral-900">Ready to discover your ventures?</h2>
            <p className="text-neutral-600 mb-6">We'll generate 3 personalized opportunities based on your DNA.</p>
            <Button size="lg" onClick={() => router.push("/discover/processing-ventures")} className="bg-neutral-900 text-white hover:bg-neutral-800">
              <Sparkles className="w-5 h-5 mr-2" /> Generate Ventures
            </Button>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
