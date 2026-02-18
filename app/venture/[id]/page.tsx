"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Loader2, 
  Star, 
  Zap, 
  Target,
  Award, 
  CheckCircle2, 
  Lightbulb, 
  Search, 
  Calendar, 
  DollarSign, 
  BarChart3, 
  Rocket, 
  ChevronRight,
  Sparkles,
  Globe,
  TrendingUp,
  Users
} from "lucide-react";
import Link from "next/link";

interface GateScore { 
  score: number; 
  reason: string; 
}

interface Venture {
  name: string; 
  tagline: string; 
  category: string; 
  description: string; 
  offer: string; 
  why_now: string;
  proof_signals?: { source: string; signal: string; data?: string }[];
  market_gap: string;
  competitors?: { name: string; url?: string; what_they_do: string; why_not_enough: string }[];
  founder_market_fit: string;
  execution_plan?: { week: number; focus: string; tasks: string[]; tools: string[] }[];
  monetization?: { model: string; who_pays: string; price: string; why_they_pay: string };
  gate_scores?: { 
    market_gates?: Record<string, GateScore>; 
    product_gates?: Record<string, GateScore>; 
    personal_gates?: Record<string, GateScore>; 
    business_gates?: Record<string, GateScore>; 
  };
  total_score: number; 
  founder_market_fit_score?: number;
  key_highlights?: string[];
}

export default function VentureDetailPage() {
  const params = useParams();
  const [venture, setVenture] = useState<Venture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    const id = params?.id;
    if (!id) { setError("Missing venture ID"); setLoading(false); return; }
    const parsedIndex = parseInt(id as string);
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

  if (loading) {
    return (
      <div className="min-h-screen dot-pattern-bg flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
          <span className="text-neutral-600">Loading venture details...</span>
        </div>
      </div>
    );
  }

  if (error || !venture) {
    return (
      <div className="min-h-screen dot-pattern-bg py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">{error}</h1>
          <Link href="/discover/results">
            <Button className="bg-neutral-900 text-white hover:bg-neutral-800">
              <ArrowLeft className="mr-2 w-4 h-4" />Back to Ventures
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Use actual highlights or empty array
  const highlights = venture.key_highlights || [];

  const personalScores = [
    { label: 'Energy Alignment', score: venture.gate_scores?.personal_gates?.energy_alignment?.score },
    { label: 'Experience', score: venture.gate_scores?.personal_gates?.experience_relevance?.score },
    { label: 'Network', score: venture.gate_scores?.personal_gates?.network_advantage?.score },
    { label: 'Risk Fit', score: venture.gate_scores?.personal_gates?.risk_tolerance_fit?.score },
  ];

  return (
    <div className="min-h-screen dot-pattern-bg">
      {/* Fixed Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/discover/results" 
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">Back to Ventures</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <Link href="/discover/dna-results">
              <Button variant="ghost" size="sm" className="text-neutral-600 hover:text-neutral-900">
                <Sparkles className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">View DNA</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
              <Link href="/discover/results" className="hover:text-neutral-900">Your Ventures</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-neutral-900">{venture.name}</span>
            </div>

            {/* Hero Card */}
            <Card className="bg-white border-neutral-200 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-cyan-500 via-violet-500 to-amber-500" />
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200">
                        {venture.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm font-bold text-neutral-900">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        {venture.total_score?.toFixed(1)}/5.0
                      </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
                      {venture.name}
                    </h1>
                    <p className="text-lg text-neutral-600">{venture.tagline}</p>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="text-center px-6 py-4 bg-gradient-to-br from-cyan-50 to-violet-50 rounded-2xl border border-neutral-200">
                      <div className="text-3xl font-bold text-cyan-600">{venture.founder_market_fit_score || venture.founder_market_fit_score === 0 ? `${venture.founder_market_fit_score}%` : 'N/A'}</div>
                      <div className="text-sm text-neutral-500">Founder Fit</div>
                    </div>
                    <div className="text-center px-6 py-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                      <div className="text-3xl font-bold text-neutral-900">#{index! + 1}</div>
                      <div className="text-sm text-neutral-500">Rank</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Quick Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: 'Market Size', score: venture.gate_scores?.market_gates?.market_size?.score, color: '#06B6D4', icon: Globe },
              { label: 'Technical Feasibility', score: venture.gate_scores?.product_gates?.technical_feasibility?.score, color: '#8B5CF6', icon: Zap },
              { label: 'Skill Match', score: venture.gate_scores?.personal_gates?.skill_match?.score, color: '#10B981', icon: Users },
              { label: 'Monetization', score: venture.gate_scores?.business_gates?.monetization_clarity?.score, color: '#F59E0B', icon: DollarSign },
            ].map((s, i) => (
              <Card key={i} className="bg-white border-neutral-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <s.icon className="w-4 h-4" style={{ color: s.color }} />
                    <div className="text-sm text-neutral-500">{s.label}</div>
                  </div>
                  <div className="text-2xl font-bold text-neutral-900">{s.score || '-'}/5</div>
                  <div className="h-1.5 bg-neutral-100 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(s.score || 0) * 20}%`, backgroundColor: s.color }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Description & Offer */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white border-neutral-200 h-full hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-cyan-600" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900">What It Is</h3>
                  </div>
                  <p className="text-neutral-700 leading-relaxed">{venture.description}</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="bg-white border-neutral-200 h-full hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                      <Target className="w-5 h-5 text-violet-600" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900">The Offer</h3>
                  </div>
                  <p className="text-neutral-700 leading-relaxed">{venture.offer}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Why Now */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-cyan-50 to-violet-50 border-cyan-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Zap className="w-5 h-5 text-cyan-600" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900">Why Now</h3>
                </div>
                <p className="text-neutral-700 leading-relaxed">{venture.why_now}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Key Highlights - Only show if we have real data */}
          {highlights.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Card className="bg-white border-neutral-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <Award className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900">Key Highlights</h3>
                  </div>
                  <ul className="space-y-3">
                    {highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-neutral-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Founder-Market Fit */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-amber-500 to-orange-600 border-0 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold">Founder-Market Fit Analysis</h3>
                </div>
                <p className="text-white/90 mb-6">{venture.founder_market_fit}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {personalScores.map((item, i) => (
                    <div key={i} className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold">{item.score || '-'}/5</div>
                      <div className="text-sm text-white/70">{item.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Execution Plan Preview */}
          {venture.execution_plan && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Card className="bg-white border-neutral-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900">Execution Roadmap</h3>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {venture.execution_plan.slice(0, 4).map((week) => (
                      <div key={week.week} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                        <Badge className="mb-2 bg-neutral-900 text-white">Week {week.week}</Badge>
                        <p className="font-medium text-neutral-900 text-sm">{week.focus}</p>
                        <p className="text-xs text-neutral-500 mt-1">{week.tasks.length} tasks</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Navigation Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
          >
            <Link href="/discover/results">
              <Button variant="outline" className="border-neutral-300 text-neutral-700 hover:bg-neutral-100 px-8">
                <ArrowLeft className="mr-2 w-4 h-4" />Back to Ventures
              </Button>
            </Link>
            <Link href="/discover/dna-results">
              <Button className="bg-neutral-900 text-white hover:bg-neutral-800 px-8">
                <Sparkles className="mr-2 w-4 h-4" />View DNA Results
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
