import { z } from "zod";

const SuperpowerSchema = z.object({
  name: z.string().min(5).max(60),
  description: z.string().min(30).max(300),
  evidence: z.string().min(20).max(200), // Because you mentioned...
  unfair_advantage: z.string().min(20).max(200),
});

const BiasSchema = z.object({
  bias: z.string().min(5).max(50),
  manifestation: z.string().min(20).max(200),
  trigger: z.string().min(10).max(150),
  mitigation: z.string().min(20).max(200),
});

const PlaybookCardSchema = z.object({
  step: z.number().int().min(1).max(10),
  title: z.string().min(5).max(60),
  description: z.string().min(30).max(250),
  action: z.string().min(5).max(100),
  because_you_said: z.string().min(15).max(150).optional(), // Evidence link
});

export const DNASchema = z.object({
  founder_dna: z.object({
    archetype: z.object({
      name: z.string().min(5).max(50),
      tagline: z.string().min(10).max(120),
      description: z.string().min(100).max(800),
      founder_market_fit_score: z.number().int().min(60).max(95),
    }),
    cognitive_profile: z.object({
      dominant_function: z.string().min(10).max(100),
      auxiliary_function: z.string().min(10).max(100),
      decision_making: z.string().min(50).max(300),
      stress_response: z.string().min(30).max(250),
      flow_triggers: z.array(z.string().min(10).max(80)).min(5).max(7),
    }),
    the_edge: z.object({
      superpowers: z.array(SuperpowerSchema).min(2).max(4),
      pattern_recognition: z.string().min(50).max(300),
    }),
    the_shadow: z.object({
      cognitive_biases: z.array(BiasSchema).min(2).max(4),
      failure_patterns: z.array(z.string().min(15).max(120)).min(3).max(4),
      blind_spots: z.array(z.string().min(10).max(80)).min(2).max(4),
      energy_drains: z.array(z.string().min(10).max(80)).min(3).max(5),
    }),
    venture_fit: z.object({
      sweet_spot: z.object({
        type: z.string().min(10).max(80),
        description: z.string().min(50).max(300),
        examples: z.array(z.string().min(10).max(60)).min(3).max(3),
      }),
      danger_zone: z.object({
        type: z.string().min(10).max(80),
        description: z.string().min(50).max(300),
        warning_signs: z.array(z.string().min(15).max(100)).min(3).max(3),
      }),
      cofounder_profile: z.string().min(50).max(300),
      optimal_stage: z.string().min(10).max(50),
      team_size_ideal: z.string().min(10).max(50),
    }),
    playbook: z.object({
      decision_framework: z.array(PlaybookCardSchema).min(3).max(3), // FORCE 3
      gtm_strategy: z.array(PlaybookCardSchema).min(3).max(3),       // FORCE 3
      first_hire: z.array(PlaybookCardSchema).min(3).max(3),         // FORCE 3
      funding: z.array(PlaybookCardSchema).min(3).max(3),            // FORCE 3
      wellness: z.array(PlaybookCardSchema).min(3).max(3),           // FORCE 3
      burnout_signals: z.array(z.string().min(10).max(80)).min(4).max(4),
      recovery_protocol: z.string().min(30).max(200),
    }),
    relationship_dynamics: z.object({
      as_cofounder: z.string().min(50).max(300),
      as_leader: z.string().min(50).max(300),
      communication_style: z.string().min(30).max(200),
      conflict_response: z.string().min(30).max(200),
    }),
    // NEW TOP 3 BOXES (replace Market Fit / Superpowers / Biases)
    your_edge: z.object({
      headline: z.string().min(10).max(80), // e.g., "Pattern-Matching Speed Demon"
      bullets: z.array(z.string().min(15).max(100)).min(3).max(5),
      because_you_said: z.string().min(20).max(150),
    }),
    your_play_style: z.object({
      headline: z.string().min(10).max(80), // e.g., "Strategic Sprinter"
      bullets: z.array(z.string().min(15).max(100)).min(3).max(5),
      because_you_said: z.string().min(20).max(150),
    }),
    your_watchouts: z.object({
      headline: z.string().min(10).max(80), // e.g., "Perfectionism & Isolation"
      bullets: z.array(z.string().min(15).max(100)).min(2).max(4),
      because_you_said: z.string().min(20).max(150),
    }),
  }),
});

export type DNAOutput = z.infer<typeof DNASchema>;
