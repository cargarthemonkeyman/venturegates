-- Supabase Schema for VentureGates
-- Project Name: VENTURE GATES

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (user founder profiles)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Founder questionnaire responses
  entrepreneur_type TEXT, -- 'architect', 'creative', 'analyst', 'communicator', 'builder'
  obsession TEXT,
  strengths TEXT[], -- array of strings
  drains TEXT[], -- array of strings
  time_availability TEXT, -- 'full-time', 'nights-weekends', 'few-hours'
  capital TEXT, -- 'can-invest', 'bootstrapping', 'has-funding'
  team TEXT, -- 'solo', 'cofounder', 'small-team'
  tech_skills TEXT, -- 'can-code', 'no-code', 'need-technical'
  industries TEXT[], -- array of industries
  ambition TEXT, -- 'scale-massive', 'niche-profitable', 'impact-social', 'experiment'
  
  -- Generated Venture DNA
  non_negotiables JSONB DEFAULT '[]'::jsonb,
  accelerators JSONB DEFAULT '[]'::jsonb,
  red_flags JSONB DEFAULT '[]'::jsonb,
  venture_dna JSONB DEFAULT '{}'::jsonb,
  
  -- Metadata
  is_public BOOLEAN DEFAULT false,
  share_slug TEXT UNIQUE,
  ip_address TEXT,
  user_agent TEXT
);

-- Ventures table (generated venture ideas)
CREATE TABLE ventures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Basic info
  name TEXT NOT NULL,
  tagline TEXT,
  category TEXT,
  description TEXT,
  
  -- Detailed sections
  offer TEXT, -- What product/service
  why_now TEXT, -- Why this is the moment
  proof_signals JSONB DEFAULT '[]'::jsonb, -- Array of {source, signal, data}
  market_gap TEXT, -- What gap exists
  competitors JSONB DEFAULT '[]'::jsonb, -- Array of {name, url, what_they_do, why_not_enough}
  founder_market_fit TEXT, -- Why this person should build this
  execution_plan JSONB DEFAULT '[]'::jsonb, -- Array of {week, focus, tasks[], tools[]}
  monetization JSONB DEFAULT '{}'::jsonb, -- {model, who_pays, price, why_they_pay}
  
  -- Gate scores
  gate_scores JSONB DEFAULT '{}'::jsonb, -- Object with all gate scores
  total_score FLOAT,
  founder_market_fit_score INTEGER, -- 0-100
  
  -- Engagement
  views INTEGER DEFAULT 0,
  
  -- Metadata
  is_public BOOLEAN DEFAULT true,
  share_slug TEXT UNIQUE
);

-- Create indexes for common queries
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);
CREATE INDEX idx_profiles_share_slug ON profiles(share_slug);
CREATE INDEX idx_ventures_profile_id ON ventures(profile_id);
CREATE INDEX idx_ventures_created_at ON ventures(created_at DESC);
CREATE INDEX idx_ventures_total_score ON ventures(total_score DESC);
CREATE INDEX idx_ventures_category ON ventures(category);
CREATE INDEX idx_ventures_share_slug ON ventures(share_slug);

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventures ENABLE ROW LEVEL SECURITY;

-- Allow public read access to public profiles
CREATE POLICY "Public profiles are viewable" 
  ON profiles FOR SELECT 
  USING (is_public = true);

-- Allow public read access to public ventures
CREATE POLICY "Public ventures are viewable" 
  ON ventures FOR SELECT 
  USING (is_public = true);

-- Allow insert without auth (anonymous users)
CREATE POLICY "Anyone can create profiles" 
  ON profiles FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can create ventures" 
  ON ventures FOR INSERT 
  WITH CHECK (true);

-- Function to generate share slug
CREATE OR REPLACE FUNCTION generate_share_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.share_slug IS NULL THEN
    NEW.share_slug := encode(gen_random_bytes(8), 'hex');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-generate slugs
CREATE TRIGGER set_profile_slug BEFORE INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION generate_share_slug();

CREATE TRIGGER set_venture_slug BEFORE INSERT ON ventures
  FOR EACH ROW EXECUTE FUNCTION generate_share_slug();

-- Function to increment views
CREATE OR REPLACE FUNCTION increment_venture_views(venture_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE ventures SET views = views + 1 WHERE id = venture_id;
END;
$$ LANGUAGE plpgsql;
