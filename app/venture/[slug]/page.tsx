"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2, Star, Zap, Shield, Award, CheckCircle2, Globe, Rocket, Brain, Wallet, ArrowUpRight, ArrowDownRight, Minus, Lightbulb, Search, Calendar, DollarSign, BarChart3, PieChart, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from "recharts";

interface GateScore { score: number; reason: string; }
interface Venture {
  name: string; tagline: string; category: string; description: string; offer: string; why_now: string;
  proof_signals?: { source: string; signal: string; data?: string }[];
  market_gap: string;
  competitors?: { name: string; url?: string; what_they_do: string; why_not_enough: string }[];
  founder_market_fit: string;
  execution_plan?: { week: number; focus: string; tasks: string[]; tools: string[] }[];
  monetization?: { model: string; who_pays: string; price: string; why_they_pay: string };
  gate_scores?: { market_gates?: Record<string, GateScore>; product_gates?: Record<string, GateScore>; personal_gates?: Record<string, GateScore>; business_gates?: Record<string, GateScore>; };
  total_score: number; founder_market_fit_score?: number;
}

export default function VentureDetailPage() {
  const params = useParams();
  const [venture, setVenture] = useState<Venture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    const slug = params?.slug;
    if (!slug) { setError("Missing venture ID"); setLoading(false); return; }
    const parsedIndex = parseInt(slug as string);
    if (isNaN(parsedIndex)) { setError("Invalid ID"); setLoading(false); return; }
    setIndex(parsedIndex);
    const resultJson = localStorage.getItem("ventureGates_result");
    if (!resultJson) { setError("No results found"); setLoading(false); return; }
    try {
      const data = JSON.parse(resultJson);
      if (!data.ventures?.[parsedIndex]) { setError("Venture not found"); setLoading(false); return; }
      setVenture(data.ventures[parsedIndex]);
      setLoading(false);
    } catch { setError("Error loading"); setLoading(false); }
  }, [params]);

  if (loading) return <main className="min-h-screen dot-pattern-bg flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-neutral-400" /></main>;
  if (error || !venture) return <main className="min-h-screen dot-pattern-bg py-20 px-4"><div className="max-w-2xl mx-auto text-center"><h1 className="text-2xl font-bold text-neutral-900 mb-4">{error}</h1><Link href="/discover/results"><Button className="bg-neutral-900 text-white"><ArrowLeft className="mr-2 w-4 h-4" />Back</Button></Link></div></main>;

  const radarData = venture.gate_scores ? [
    ...Object.entries(venture.gate_scores.market_gates || {}).slice(0,2).map(([k,v]) => ({ subject: k.replace(/_/g,' '), A: v.score, fullMark: 5 })),
    ...Object.entries(venture.gate_scores.product_gates || {}).slice(0,2).map(([k,v]) => ({ subject: k.replace(/_/g,' '), A: v.score, fullMark: 5 })),
    ...Object.entries(venture.gate_scores.personal_gates || {}).slice(0,2).map(([k,v]) => ({ subject: k.replace(/_/g,' '), A: v.score, fullMark: 5 })),
    ...Object.entries(venture.gate_scores.business_gates || {}).slice(0,2).map(([k,v]) => ({ subject: k.replace(/_/g,' '), A: v.score, fullMark: 5 })),
  ] : [];

  const catScores = [
    { name: 'Market', score: avg(venture.gate_scores?.market_gates), color: '#3b82f6' },
    { name: 'Product', score: avg(venture.gate_scores?.product_gates), color: '#8b5cf6' },
    { name: 'Personal', score: avg(venture.gate_scores?.personal_gates), color: '#10b981' },
    { name: 'Business', score: avg(venture.gate_scores?.business_gates), color: '#f59e0b' },
  ];

  function avg(g?: Record<string, GateScore>) {
    if (!g) return 0;
    const s = Object.values(g).map(x => x.score);
    return Math.round((s.reduce((a,b)=>a+b,0)/s.length)*10)/10;
  }

  const scoreColor = (s: number) => s >= 4 ? "text-green-600 bg-green-50 border-green-200" : s >= 3 ? "text-yellow-600 bg-yellow-50 border-yellow-200" : "text-red-600 bg-red-50 border-red-200";
  const scoreTrend = (s: number) => s >= 4 ? <ArrowUpRight className="w-4 h-4 text-green-600"/> : s >= 3 ? <Minus className="w-4 h-4 text-yellow-600"/> : <ArrowDownRight className="w-4 h-4 text-red-600"/>;

  return (
    <main className="min-h-screen dot-pattern-bg">
      <div className="bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/discover/results" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-8">
              <ArrowLeft className="w-4 h-4" />Back to results
            </Link>
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-white/10 text-white border-0">{venture.category}</Badge>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold">{venture.total_score?.toFixed(1)}/5.0</span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{venture.name}</h1>
                <p className="text-xl text-neutral-400">{venture.tagline}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-amber-400">{venture.founder_market_fit_score}%</div>
                  <div className="text-sm text-neutral-400">Founder Fit</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-white">#{index! + 1}</div>
                  <div className="text-sm text-neutral-400">Rank</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8 bg-neutral-200 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-neutral-900 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="analysis" className="data-[state=active]:bg-neutral-900 data-[state=active]:text-white">Analysis</TabsTrigger>
            <TabsTrigger value="execution" className="data-[state=active]:bg-neutral-900 data-[state=active]:text-white">Execution</TabsTrigger>
            <TabsTrigger value="gates" className="data-[state=active]:bg-neutral-900 data-[state=active]:text-white">Scorecard</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Market Size', score: venture.gate_scores?.market_gates?.market_size?.score },
                  { label: 'Technical Feasibility', score: venture.gate_scores?.product_gates?.technical_feasibility?.score },
                  { label: 'Skill Match', score: venture.gate_scores?.personal_gates?.skill_match?.score },
                  { label: 'Monetization', score: venture.gate_scores?.business_gates?.monetization_clarity?.score },
                ].map((s, i) => (
                  <Card key={i} className="bg-white"><CardContent className="p-4">
                    <div className="text-sm text-neutral-500 mb-1">{s.label}</div>
                    <div className="text-2xl font-bold">{s.score || '-'}/5</div>
                    <Progress value={(s.score || 0) * 20} className="h-1 mt-2" />
                  </CardContent></Card>
                ))}
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="bg-white"><CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"><Lightbulb className="w-5 h-5 text-blue-600" /></div><h3 className="text-lg font-bold">What It Is</h3></div>
                  <p className="text-neutral-700 leading-relaxed">{venture.description}</p>
                </CardContent></Card>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <Card className="bg-white"><CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center"><Target className="w-5 h-5 text-purple-600" /></div><h3 className="text-lg font-bold">The Offer</h3></div>
                  <p className="text-neutral-700 leading-relaxed">{venture.offer}</p>
                </CardContent></Card>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-gradient-to-br from-neutral-900 to-neutral-800 border-0 text-white"><CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4"><Zap className="w-6 h-6 text-amber-400" /><h3 className="text-xl font-bold">Why Now</h3></div>
                <p className="text-neutral-300 text-lg">{venture.why_now}</p>
              </CardContent></Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <Card className="bg-gradient-to-br from-amber-500 to-orange-600 border-0 text-white"><CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4"><Award className="w-6 h-6" /><h3 className="text-xl font-bold">Founder-Market Fit Analysis</h3></div>
                <p className="text-white/90 text-lg mb-6">{venture.founder_market_fit}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Energy', score: venture.gate_scores?.personal_gates?.energy_alignment?.score },
                    { label: 'Experience', score: venture.gate_scores?.personal_gates?.experience_relevance?.score },
                    { label: 'Network', score: venture.gate_scores?.personal_gates?.network_advantage?.score },
                    { label: 'Risk Fit', score: venture.gate_scores?.personal_gates?.risk_tolerance_fit?.score },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold">{item.score || '-'}/5</div>
                      <div className="text-sm text-white/70">{item.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent></Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="bg-white"><CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5" />Performance Radar</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid /><PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} /><PolarRadiusAxis angle={30} domain={[0,5]} />
                        <Radar name="Score" dataKey="A" stroke="#171717" fill="#171717" fillOpacity={0.3} /><Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent></Card>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="bg-white"><CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><PieChart className="w-5 h-5" />Category Scores</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={catScores}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis domain={[0,5]} /><Tooltip />
                        <Bar dataKey="score" radius={[4,4,0,0]}>{catScores.map((e,i)=><Cell key={i} fill={e.color} />)}</Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent></Card>
              </motion.div>
            </div>

            {venture.market_gap && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="bg-white"><CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center"><Search className="w-5 h-5 text-red-600" /></div><h3 className="text-lg font-bold">Market Gap Analysis</h3></div>
                  <p className="text-neutral-700 mb-6">{venture.market_gap}</p>
                  <div className="grid md:grid-cols-3 gap-4">
                    {['market_size','growth_trajectory','competition'].map((k,i)=>{
                      const g = (venture.gate_scores?.market_gates as any)?.[k];
                      return <div key={i} className="p-4 rounded-lg bg-neutral-50">
                        <div className="text-2xl font-bold">{g?.score || '-'}/5</div>
                        <div className="text-sm text-neutral-500 capitalize">{k.replace(/_/g,' ')}</div>
                        <div className="text-xs text-neutral-400 mt-1">{g?.reason}</div>
                      </div>;
                    })}
                  </div>
                </CardContent></Card>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="execution" className="space-y-6">
            {venture.execution_plan && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="bg-white"><CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"><Calendar className="w-5 h-5 text-blue-600" /></div><h3 className="text-lg font-bold">4-Week Roadmap</h3></div>
                  <div className="space-y-6">
                    {venture.execution_plan.map((week) => (
                      <div key={week.week} className="relative pl-8 pb-6 border-l-2 border-neutral-200 last:pb-0 last:border-0">
                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-neutral-900 border-4 border-white" />
                        <div className="bg-neutral-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3"><Badge className="bg-neutral-900 text-white">Week {week.week}</Badge><span className="font-bold">{week.focus}</span></div>
                          <ul className="space-y-2 mb-4">
                            {week.tasks.map((t,i)=><li key={i} className="flex items-start gap-2 text-sm text-neutral-700"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{t}</li>)}
                          </ul>
                          <div className="flex flex-wrap gap-2">{week.tools.map((t,i)=><Badge key={i} variant="secondary">{t}</Badge>)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent></Card>
              </motion.div>
            )}

            {venture.monetization && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="bg-gradient-to-br from-green-600 to-emerald-700 border-0 text-white"><CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6"><DollarSign className="w-6 h-6" /><h3 className="text-xl font-bold">Monetization</h3></div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-4"><div className="text-sm text-white/70">Model</div><div className="font-semibold text-lg">{venture.monetization.model}</div></div>
                    <div className="bg-white/10 rounded-lg p-4"><div className="text-sm text-white/70">Customer</div><div className="font-semibold text-lg">{venture.monetization.who_pays}</div></div>
                    <div className="bg-white/10 rounded-lg p-4"><div className="text-sm text-white/70">Price</div><div className="font-semibold text-lg">{venture.monetization.price}</div></div>
                    <div className="bg-white/10 rounded-lg p-4"><div className="text-sm text-white/70">Value Prop</div><div className="font-semibold">{venture.monetization.why_they_pay}</div></div>
                  </div>
                </CardContent></Card>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="gates" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="bg-white"><CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center"><Shield className="w-5 h-5 text-white" /></div>
                    <div><h3 className="text-lg font-bold">Complete Scorecard</h3><p className="text-sm text-neutral-500">17 gates evaluated</p></div>
                  </div>
                  <div className="text-right"><div className="text-3xl font-bold">{venture.total_score?.toFixed(1)}</div><div className="text-sm text-neutral-500">Overall</div></div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { title: 'Market Gates', icon: Globe, color: 'blue', data: venture.gate_scores?.market_gates },
                    { title: 'Product Gates', icon: Rocket, color: 'purple', data: venture.gate_scores?.product_gates },
                    { title: 'Personal Gates', icon: Brain, color: 'green', data: venture.gate_scores?.personal_gates },
                    { title: 'Business Gates', icon: Wallet, color: 'amber', data: venture.gate_scores?.business_gates },
                  ].map((cat, i) => (
                    <div key={i} className={`p-4 rounded-xl bg-${cat.color}-50 border border-${cat.color}-100`}>
                      <h4 className={`font-bold text-${cat.color}-900 mb-3 flex items-center gap-2`}><cat.icon className="w-4 h-4" />{cat.title}</h4>
                      <div className="space-y-2">
                        {Object.entries(cat.data || {}).map(([key, data]) => (
                          <div key={key} className={`p-2 rounded-lg border ${scoreColor(data.score)}`}>
                            <div className="flex items-center justify-between">
                              <span className="font-medium capitalize text-sm">{key.replace(/_/g, ' ')}</span>
                              <div className="flex items-center gap-1">{scoreTrend(data.score)}<span className="font-bold">{data.score}</span></div>
                            </div>
                            <p className="text-xs mt-1 opacity-80">{data.reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent></Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 text-center">
          <Link href="/discover/results"><Button variant="outline" className="border-neutral-300 text-neutral-700 hover:bg-neutral-100 px-8 py-4"><ArrowLeft className="mr-2 w-4 h-4" />Back to All Ventures</Button></Link>
        </motion.div>
      </div>
    </main>
  );
}
