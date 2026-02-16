import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types based on schema
export interface Profile {
  id: string;
  created_at: string;
  entrepreneur_type: string;
  obsession: string;
  strengths: string[];
  drains: string[];
  time_availability: string;
  capital: string;
  team: string;
  tech_skills: string;
  industries: string[];
  ambition: string;
  non_negotiables: Gate[];
  accelerators: Gate[];
  red_flags: Gate[];
  venture_dna: VentureDNA;
  is_public: boolean;
  share_slug: string;
}

export interface Venture {
  id: string;
  created_at: string;
  profile_id: string;
  name: string;
  tagline: string;
  category: string;
  description: string;
  offer: string;
  why_now: string;
  proof_signals: ProofSignal[];
  market_gap: string;
  competitors: Competitor[];
  founder_market_fit: string;
  execution_plan: ExecutionWeek[];
  monetization: Monetization;
  gate_scores: GateScores;
  total_score: number;
  founder_market_fit_score: number;
  views: number;
  is_public: boolean;
  share_slug: string;
}

export interface Gate {
  name: string;
  description: string;
  icon?: string;
}

export interface VentureDNA {
  entrepreneur_type: string;
  type_description: string;
  non_negotiables: Gate[];
  accelerators: Gate[];
  red_flags: Gate[];
}

export interface ProofSignal {
  source: string;
  signal: string;
  data?: string;
}

export interface Competitor {
  name: string;
  url?: string;
  what_they_do: string;
  why_not_enough: string;
}

export interface ExecutionWeek {
  week: number;
  focus: string;
  tasks: string[];
  tools: string[];
}

export interface Monetization {
  model: string;
  who_pays: string;
  price: string;
  why_they_pay: string;
}

export interface GateScores {
  market_gates: Record<string, { score: number; reason: string }>;
  personal_gates: Record<string, { score: number; reason: string }>;
}

// Helper to increment views by slug
export async function incrementVentureViews(slug: string) {
  // First get the ID from slug
  const { data: venture } = await supabase
    .from('ventures')
    .select('id')
    .eq('share_slug', slug)
    .single();
  
  if (venture) {
    const { error } = await supabase.rpc('increment_venture_views', {
      venture_id: venture.id,
    });
    if (error) console.error('Error incrementing views:', error);
  }
}
