"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Target,
  TrendingUp,
  ExternalLink,
  Calendar,
  DollarSign,
  Users,
  Lightbulb,
  Search,
  BarChart3,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Link from "next/link";

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
    market_gates?: Record<string, { score: number; reason: string }>;
    personal_gates?: Record<string, { score: number; reason: string }>;
  };
  total_score: number;
  founder_market_fit_score?: number;
}

interface ClientVenturePageProps {
  index: number;
}

export default function ClientVenturePage({ index }: ClientVenturePageProps) {
  const router = useRouter();
  const [venture, setVenture] = useState<Venture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const resultJson = localStorage.getItem("ventureGates_result");
    if (!resultJson) {
      setError("No results found. Please complete the assessment first.");
      setLoading(false);
      return;
    }

    try {
      const data = JSON.parse(resultJson);
      
      if (!data.ventures || !Array.isArray(data.ventures)) {
        setError("Invalid data format. Please retake the assessment.");
        setLoading(false);
        return;
      }
      
      if (index < 0 || index >= data.ventures.length) {
        setError(`Venture ${index + 1} not found. Available: ${data.ventures.length}`);
        setLoading(false);
        return;
      }
      
      setVenture(data.ventures[index]);
      setLoading(false);
    } catch (err) {
      setError("Error loading venture data. Please try again.");
      setLoading(false);
    }
  }, [index]);

  if (loading) {
    return (
      <main className="min-h-screen dot-pattern-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen dot-pattern-bg py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-4xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">{error}</h1>
          <Link href="/discover">
            <Button className="bg-neutral-900 text-white">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Start Assessment
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  if (!venture) return null;

  const getScoreColor = (score: number) => {
    if (score >= 4) return "text-green-600 bg-green-50";
    if (score >= 3) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <main className="min-h-screen dot-pattern-bg py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/discover/results"
            className="text-sm text-neutral-500 hover:text-neutral-900 mb-4 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to results
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge className="bg-neutral-100 text-neutral-700 border-0 mb-4">
                {venture.category}
              </Badge>
              <h1 className="text-4xl font-bold text-neutral-900 mb-2">{venture.name}</h1>
              <p className="text-xl text-neutral-600">{venture.tagline}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-neutral-900">
                {venture.total_score?.toFixed(1)}
              </div>
              <div className="text-sm text-neutral-500">Gate Score</div>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-neutral-400" />
              <span className="text-neutral-600">Founder-Market Fit:</span>
              <span className="font-medium text-neutral-900">{venture.founder_market_fit_score || 85}%</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* What is it */}
          <Card className="bg-white border-neutral-200">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                What is it
              </h2>
              <p className="text-neutral-700 leading-relaxed">{venture.description}</p>
            </CardContent>
          </Card>

          {/* The Offer */}
          <Card className="bg-white border-neutral-200">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">The Offer</h2>
              <p className="text-neutral-700 leading-relaxed">{venture.offer}</p>
            </CardContent>
          </Card>

          {/* Why Now */}
          <Card className="card-dark border-0">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold text-white mb-4">Why Now</h2>
              <p className="text-neutral-300 leading-relaxed">{venture.why_now}</p>
            </CardContent>
          </Card>

          {/* Proof Signals */}
          {venture.proof_signals && venture.proof_signals.length > 0 && (
            <Card className="bg-white border-neutral-200">
              <CardContent className="p-8">
                <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Proof Signals
                </h2>
                <div className="space-y-3">
                  {venture.proof_signals.map((signal, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-neutral-50">
                      <span className="text-2xl">
                        {signal.source === "Reddit" && "🤖"}
                        {signal.source === "Twitter" && "🐦"}
                        {signal.source === "Twitter/X" && "🐦"}
                        {signal.source === "Google" && "🔍"}
                        {!["Reddit", "Twitter", "Twitter/X", "Google"].includes(signal.source) && "📊"}
                      </span>
                      <div>
                        <div className="font-medium text-neutral-900">{signal.source}</div>
                        <div className="text-neutral-600">{signal.signal}</div>
                        {signal.data && (
                          <div className="text-sm text-neutral-500 mt-1">{signal.data}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Market Gap */}
          {venture.market_gap && (
            <Card className="bg-white border-neutral-200">
              <CardContent className="p-8">
                <h2 className="text-xl font-bold text-neutral-900 mb-4">Market Gap</h2>
                <p className="text-neutral-700 leading-relaxed">{venture.market_gap}</p>
              </CardContent>
            </Card>
          )}

          {/* Competitors */}
          {venture.competitors && venture.competitors.length > 0 && (
            <Card className="bg-white border-neutral-200">
              <CardContent className="p-8">
                <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Competitors
                </h2>
                <div className="space-y-4">
                  {venture.competitors.map((comp, i) => (
                    <div key={i} className="p-4 rounded-lg border border-neutral-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-neutral-900">{comp.name}</span>
                        {comp.url && (
                          <a
                            href={comp.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-400 hover:text-neutral-600"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <p className="text-neutral-600 text-sm mb-2">{comp.what_they_do}</p>
                      <p className="text-red-600 text-sm">Gap: {comp.why_not_enough}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Founder-Market Fit */}
          <Card className="card-accent-purple border-0">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Founder-Market Fit
              </h2>
              <p className="text-white/90 leading-relaxed">{venture.founder_market_fit}</p>
            </CardContent>
          </Card>

          {/* Execution Plan */}
          {venture.execution_plan && venture.execution_plan.length > 0 && (
            <Card className="bg-white border-neutral-200">
              <CardContent className="p-8">
                <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Execution Plan (Weeks 1-4)
                </h2>
                <div className="space-y-4">
                  {venture.execution_plan.map((week) => (
                    <div key={week.week} className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold flex-shrink-0">
                        {week.week}
                      </div>
                      <div className="flex-1 p-4 rounded-lg bg-neutral-50">
                        <div className="font-bold text-neutral-900 mb-2">{week.focus}</div>
                        <ul className="space-y-1 mb-3">
                          {week.tasks.map((task, i) => (
                            <li key={i} className="text-sm text-neutral-600">• {task}</li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap gap-2">
                          {week.tools.map((tool, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-1 rounded bg-neutral-200 text-neutral-700"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Monetization */}
          {venture.monetization && (
            <Card className="bg-white border-neutral-200">
              <CardContent className="p-8">
                <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Monetization
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-neutral-50">
                    <div className="text-sm text-neutral-500 mb-1">Model</div>
                    <div className="font-medium text-neutral-900">{venture.monetization.model}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-neutral-50">
                    <div className="text-sm text-neutral-500 mb-1">Who Pays</div>
                    <div className="font-medium text-neutral-900">{venture.monetization.who_pays}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-neutral-50">
                    <div className="text-sm text-neutral-500 mb-1">Price Point</div>
                    <div className="font-medium text-neutral-900">{venture.monetization.price}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-neutral-50">
                    <div className="text-sm text-neutral-500 mb-1">Value Proposition</div>
                    <div className="font-medium text-neutral-900">{venture.monetization.why_they_pay}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Gate Scores */}
          {venture.gate_scores && (
            <Card className="bg-white border-neutral-200">
              <CardContent className="p-8">
                <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Gate Scorecard
                </h2>

                <div className="space-y-6">
                  {venture.gate_scores.market_gates && Object.keys(venture.gate_scores.market_gates).length > 0 && (
                    <div>
                      <h3 className="font-medium text-neutral-900 mb-3">Market Gates</h3>
                      <div className="space-y-2">
                        {Object.entries(venture.gate_scores.market_gates).map(([key, data]: [string, any]) => (
                          <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-neutral-50">
                            <span className="text-sm text-neutral-700 capitalize">{key.replace(/_/g, " ")}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-neutral-500 max-w-xs truncate hidden sm:block">
                                {data.reason}
                              </span>
                              <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreColor(data.score)}`}>
                                {data.score}/5
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {venture.gate_scores.personal_gates && Object.keys(venture.gate_scores.personal_gates).length > 0 && (
                    <div>
                      <h3 className="font-medium text-neutral-900 mb-3">Personal Gates</h3>
                      <div className="space-y-2">
                        {Object.entries(venture.gate_scores.personal_gates).map(([key, data]: [string, any]) => (
                          <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-neutral-50">
                            <span className="text-sm text-neutral-700 capitalize">{key.replace(/_/g, " ")}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-neutral-500 max-w-xs truncate hidden sm:block">
                                {data.reason}
                              </span>
                              <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreColor(data.score)}`}>
                                {data.score}/5
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
