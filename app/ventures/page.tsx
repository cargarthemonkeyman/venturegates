"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Search,
  Target,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface Venture {
  id: string;
  name: string;
  tagline: string;
  category: string;
  description: string;
  total_score: number;
  founder_market_fit_score: number;
  views: number;
  entrepreneur_type: string;
}

export default function VenturesPage() {
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [filteredVentures, setFilteredVentures] = useState<Venture[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    // For demo, load from localStorage or show sample data
    const resultJson = localStorage.getItem("ventureGates_result");
    if (resultJson) {
      const data = JSON.parse(resultJson);
      const venturesWithIds = data.ventures.map((v: any, index: number) => ({
        ...v,
        id: index.toString(),
        views: Math.floor(Math.random() * 500),
        entrepreneur_type: data.venture_dna.entrepreneur_type,
      }));
      setVentures(venturesWithIds);
      setFilteredVentures(venturesWithIds);
    }
  }, []);

  useEffect(() => {
    let filtered = ventures;

    if (searchQuery) {
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((v) => v.category === selectedCategory);
    }

    setFilteredVentures(filtered);
  }, [searchQuery, selectedCategory, ventures]);

  const categories = [...new Set(ventures.map((v) => v.category))];

  return (
    <main className="min-h-screen dot-pattern-bg py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Venture Catalog
          </h1>
          <p className="text-neutral-600">
            Browse all generated ventures. Filter by category, score, or search.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              placeholder="Search ventures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-neutral-200"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-neutral-900 text-white"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6 text-sm text-neutral-500">
          Showing {filteredVentures.length} venture{filteredVentures.length !== 1 && "s"}
        </div>

        {/* Grid */}
        {filteredVentures.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVentures.map((venture, index) => (
              <motion.div
                key={venture.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-white border-neutral-200 hover:border-neutral-400 transition-colors h-full flex flex-col">
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <Badge className="bg-neutral-100 text-neutral-700 border-0">
                        {venture.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm font-medium text-neutral-900">
                        <Target className="w-4 h-4" />
                        {venture.total_score.toFixed(1)}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-neutral-900 mb-2">
                      {venture.name}
                    </h3>
                    <p className="text-neutral-600 text-sm mb-4 flex-1">
                      {venture.tagline}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-neutral-500 mb-4">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>Fit: {venture.founder_market_fit_score}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>For: {venture.entrepreneur_type}</span>
                      </div>
                    </div>

                    <Link href={`/venture/${venture.id}`}>
                      <Button className="w-full bg-neutral-900 hover:bg-neutral-800 text-white">
                        View Details
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="bg-white border-neutral-200">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                No ventures found
              </h3>
              <p className="text-neutral-600 mb-4">
                Try adjusting your search or filters
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
                variant="outline"
                className="border-neutral-300"
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
