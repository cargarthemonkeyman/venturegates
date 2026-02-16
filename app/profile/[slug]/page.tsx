import { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Profile, Venture } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Zap,
  AlertTriangle,
  XCircle,
  ArrowRight,
  TrendingUp,
  Target,
} from "lucide-react";
import Link from "next/link";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("entrepreneur_type")
    .eq("share_slug", params.slug)
    .single();

  if (!profile) {
    return { title: "Not Found" };
  }

  return {
    title: `${profile.entrepreneur_type} on VentureGates`,
    description: `Check out this founder's Venture DNA and discover what ventures match their profile.`,
    openGraph: {
      title: `${profile.entrepreneur_type} on VentureGates`,
      description: `Discover what ventures this founder should build based on their unique profile.`,
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("share_slug", params.slug)
    .eq("is_public", true)
    .single();

  if (!profile) {
    notFound();
  }

  // Fetch ventures for this profile
  const { data: ventures } = await supabase
    .from("ventures")
    .select("*")
    .eq("profile_id", profile.id)
    .eq("is_public", true)
    .order("total_score", { ascending: false })
    .limit(3);

  const venture_dna = profile.venture_dna as any;

  return (
    <main className="min-h-screen dot-pattern-bg py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-white/80 text-neutral-600 border-neutral-200 mb-4">
            Venture DNA Profile
          </Badge>
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            {profile.entrepreneur_type}
          </h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            {venture_dna?.type_description}
          </p>
        </div>

        {/* Gates */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Non-negotiables */}
          <Card className="bg-white border-neutral-200">
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-neutral-500 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Non-Negotiables
              </h3>
              <div className="space-y-3">
                {profile.non_negotiables?.map((gate: any, i: number) => (
                  <div key={i} className="p-3 rounded-lg bg-neutral-100">
                    <div className="font-medium text-neutral-900">{gate.name}</div>
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
                {profile.accelerators?.map((gate: any, i: number) => (
                  <div key={i} className="p-3 rounded-lg bg-neutral-100">
                    <div className="font-medium text-neutral-900">{gate.name}</div>
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
                {profile.red_flags?.map((gate: any, i: number) => (
                  <div key={i} className="p-3 rounded-lg bg-neutral-100">
                    <div className="font-medium text-neutral-900">{gate.name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Ventures */}
        {ventures && ventures.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 text-center">
              Top Venture Recommendations
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {ventures.map((venture: Venture, index: number) => (
                <Card key={venture.id} className="bg-white border-neutral-200">
                  <CardContent className="p-6">
                    <Badge className="bg-neutral-100 text-neutral-700 border-0 mb-3">
                      {venture.category}
                    </Badge>
                    <h3 className="font-bold text-neutral-900 mb-2">{venture.name}</h3>
                    <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                      {venture.tagline}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">Score</span>
                      <span className="font-medium text-neutral-900">
                        {venture.total_score?.toFixed(1)}/5
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <Card className="card-dark border-0 inline-block">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Discover Your Own Venture DNA
              </h2>
              <p className="text-neutral-400 mb-6">
                Find out what ventures match your unique founder profile
              </p>
              <Link href="/discover">
                <Button className="bg-white hover:bg-neutral-100 text-neutral-900">
                  Get My Venture DNA
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
