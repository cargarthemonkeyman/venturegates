"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Zap,
  AlertTriangle,
  XCircle,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface VentureDNA {
  entrepreneur_type: string;
  type_description: string;
  non_negotiables: Array<{ name: string; description: string; icon?: string }>;
  accelerators: Array<{ name: string; description: string; icon?: string }>;
  red_flags: Array<{ name: string; description: string; icon?: string }>;
}

interface Venture {
  name: string;
  tagline: string;
  category: string;
  description: string;
  total_score: number;
  founder_market_fit_score: number;
}

interface ResultData {
  venture_dna: VentureDNA;
  ventures: Venture[];
}

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<ResultData | null>(null);
  const [activeTab, setActiveTab] = useState<"dna" | "ventures">("dna");

  useEffect(() => {
    const resultJson = localStorage.getItem("ventureGates_result");
    if (!resultJson) {
      router.push("/discover");
      return;
    }
    setData(JSON.parse(resultJson));
  }, [router]);

  if (!data) {
    return (
      <main className="min-h-screen dot-pattern-bg flex items-center justify-center">
        <div className="animate-pulse text-neutral-500">Loading...</div>
      </main>
    );
  }

  const { venture_dna, ventures } = data;

  return (
    <main className="min-h-screen dot-pattern-bg py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-neutral-500 hover:text-neutral-900 mb-4 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Your Venture DNA
          </h1>
          <p className="text-neutral-600">
            Based on your profile, here&apos;s your personalized founder DNA and the ventures that
            match you.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("dna")}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "dna"
                ? "bg-neutral-900 text-white"
                : "bg-white text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            Your DNA
          </button>
          <button
            onClick={() => setActiveTab("ventures")}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "ventures"
                ? "bg-neutral-900 text-white"
                : "bg-white text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            Your Ventures ({ventures.length})
          </button>
        </div>

        {activeTab === "dna" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Founder Type Card */}
            <Card className="bg-white border-neutral-200 overflow-hidden">
              <div className="card-dark p-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-neutral-400 mb-1">Entrepreneur Type</div>
                    <div className="text-3xl font-bold text-white">
                      {venture_dna.entrepreneur_type}
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-8">
                <p className="text-neutral-700 text-lg">{venture_dna.type_description}</p>
              </CardContent>
            </Card>

            {/* Gates Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Non-negotiables */}
              <Card className="bg-white border-neutral-200">
                <CardContent className="p-6">
                  <h3 className="text-sm font-medium text-neutral-500 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Non-Negotiables
                  </h3>
                  <div className="space-y-3">
                    {venture_dna.non_negotiables.map((gate, i) => (
                      <div key={i} className="p-3 rounded-lg bg-neutral-100">
                        <div className="font-medium text-neutral-900">{gate.name}</div>
                        <div className="text-sm text-neutral-500">{gate.description}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Accelerators */}
              <Card className="bg-white border-neutral-200">
                <CardContent className="p-6">
                  <h3 className="text-sm font-medium text-neutral-500 mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-500" />
                    Accelerators
                  </h3>
                  <div className="space-y-3">
                    {venture_dna.accelerators.map((gate, i) => (
                      <div key={i} className="p-3 rounded-lg bg-neutral-100">
                        <div className="font-medium text-neutral-900">{gate.name}</div>
                        <div className="text-sm text-neutral-500">{gate.description}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Red Flags */}
              <Card className="bg-white border-neutral-200">
                <CardContent className="p-6">
                  <h3 className="text-sm font-medium text-neutral-500 mb-4 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    Red Flags
                  </h3>
                  <div className="space-y-3">
                    {venture_dna.red_flags.map((gate, i) => (
                      <div key={i} className="p-3 rounded-lg bg-neutral-100">
                        <div className="font-medium text-neutral-900">{gate.name}</div>
                        <div className="text-sm text-neutral-500">{gate.description}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Share CTA */}
            <div className="flex justify-center">
              <Button variant="outline" className="border-neutral-300 hover:bg-white">
                <Share2 className="mr-2 w-4 h-4" />
                Share My Venture DNA
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {ventures.map((venture, index) => (
              <Card
                key={index}
                className="bg-white border-neutral-200 hover:border-neutral-400 transition-colors group"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Badge className="bg-neutral-100 text-neutral-700 border-0">
                      {venture.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm font-medium text-neutral-900">
                      <Target className="w-4 h-4" />
                      {venture.total_score.toFixed(1)}/5
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-neutral-900 mb-2">{venture.name}</h3>
                  <p className="text-neutral-600 mb-4">{venture.tagline}</p>

                  <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
                    <TrendingUp className="w-4 h-4" />
                    <span>Founder-Market Fit: {venture.founder_market_fit_score}%</span>
                  </div>

                  <Link href={`/venture/${index}`}>
                    <Button className="w-full bg-neutral-900 hover:bg-neutral-800 text-white">
                      View Details
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
