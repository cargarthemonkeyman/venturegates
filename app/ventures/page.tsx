import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { Venture } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Target,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Venture Catalog | VentureGates",
  description: "Browse all generated ventures. Filter by category, score, and type.",
};

export default async function VenturesPage() {
  // Fetch all public ventures with their profiles
  const { data: ventures, error } = await supabase
    .from("ventures")
    .select(`
      *,
      profiles!inner(entrepreneur_type)
    `)
    .eq("is_public", true)
    .order("total_score", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching ventures:", error);
  }

  const categories = ventures
    ? [...new Set(ventures.map((v: any) => v.category))]
    : [];

  return (
    <main className="min-h-screen dot-pattern-bg py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Venture Catalog
          </h1>
          <p className="text-neutral-600">
            Browse all generated ventures. Discover ideas filtered by founder profiles.
          </p>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-8">
            <Link
              href="/ventures"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-neutral-900 text-white"
            >
              All
            </Link>
            {categories.map((cat) => (
              <span
                key={cat}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-neutral-700 border border-neutral-200"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Results count */}
        <div className="mb-6 text-sm text-neutral-500">
          Showing {ventures?.length || 0} venture{ventures?.length !== 1 && "s"}
        </div>

        {/* Grid */}
        {ventures && ventures.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ventures.map((venture: any, index: number) => (
              <Card
                key={venture.id}
                className="bg-white border-neutral-200 hover:border-neutral-400 transition-colors h-full flex flex-col"
              >
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <Badge className="bg-neutral-100 text-neutral-700 border-0">
                      {venture.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm font-medium text-neutral-900">
                      <Target className="w-4 h-4" />
                      {venture.total_score?.toFixed(1)}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-neutral-900 mb-2">
                    {venture.name}
                  </h3>
                  <p className="text-neutral-600 text-sm mb-4 flex-1 line-clamp-2">
                    {venture.tagline}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-neutral-500 mb-4">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>Fit: {venture.founder_market_fit_score}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>For: {venture.profiles?.entrepreneur_type || "Founder"}</span>
                    </div>
                  </div>

                  <Link href={`/venture/${venture.share_slug}`}>
                    <Button className="w-full bg-neutral-900 hover:bg-neutral-800 text-white">
                      View Details
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white border-neutral-200">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                No ventures yet
              </h3>
              <p className="text-neutral-600 mb-4">
                Be the first to generate your Venture DNA
              </p>
              <Link href="/discover">
                <Button className="bg-neutral-900 hover:bg-neutral-800 text-white">
                  Discover My DNA
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
