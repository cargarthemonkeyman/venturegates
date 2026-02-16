import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "@/lib/supabase";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const SYSTEM_PROMPT = `You are VentureGates, an expert system for identifying disruptive ventures with high founder-market fit.

Your role is to analyze a founder's profile and:
1. Generate their "Venture DNA" — a personalized system of Gates
2. Generate 3-5 venture ideas that pass through ALL gates

CRITICAL RULES:
- NEVER generate generic ideas (delivery apps, generic marketplaces, basic edtech)
- Each idea MUST be genuinely disruptive: makes accessible what was impossible or expensive before
- AI must be CENTRAL to each idea, not a "nice to have"
- Include REAL competitors with names and URLs when they exist
- Include REAL demand signals (specific subreddits, verifiable trends)
- Ideas must be validatable in WEEKS, not months
- Be specific: names, numbers, URLs, not generalities

RESPONSE FORMAT (JSON):
{
  "venture_dna": {
    "entrepreneur_type": "descriptive name",
    "type_description": "paragraph describing this founder type",
    "non_negotiables": [
      {"name": "gate name", "description": "why non-negotiable for this profile", "icon": "emoji"}
    ],
    "accelerators": [
      {"name": "name", "description": "why it accelerates for this profile", "icon": "emoji"}
    ],
    "red_flags": [
      {"name": "name", "description": "why it's a red flag for this profile", "icon": "emoji"}
    ]
  },
  "ventures": [
    {
      "name": "Venture Name",
      "tagline": "One compelling sentence",
      "category": "category",
      "description": "2-3 sentences describing what it is",
      "offer": "What product/service concretely",
      "why_now": "Why this is the moment (trends, technology, cultural shifts)",
      "proof_signals": [
        {"source": "Reddit/Twitter/Google/etc", "signal": "description", "data": "specific data if available"}
      ],
      "market_gap": "What gap exists that nobody covers well",
      "competitors": [
        {"name": "Company Name", "url": "https://...", "what_they_do": "description", "why_not_enough": "gap they don't cover"}
      ],
      "founder_market_fit": "Personalized explanation of why THIS person should build THIS",
      "execution_plan": [
        {"week": 1, "focus": "title", "tasks": ["task1", "task2"], "tools": ["tool1"]},
        {"week": 2, "focus": "title", "tasks": ["task1", "task2"], "tools": ["tool1"]},
        {"week": 3, "focus": "title", "tasks": ["task1", "task2"], "tools": ["tool1"]},
        {"week": 4, "focus": "title", "tasks": ["task1", "task2"], "tools": ["tool1"]}
      ],
      "monetization": {
        "model": "SaaS/transactional/freemium/etc",
        "who_pays": "who pays",
        "price": "price point",
        "why_they_pay": "value proposition"
      },
      "gate_scores": {
        "market_gates": {
          "escala_real": {"score": 1-5, "reason": "explanation"},
          "crecimiento_explosivo": {"score": 1-5, "reason": "explanation"},
          "tocar_mercado_rapido": {"score": 1-5, "reason": "explanation"},
          "wow_demo": {"score": 1-5, "reason": "explanation"},
          "spinoff_vendible": {"score": 1-5, "reason": "explanation"},
          "ser_early": {"score": 1-5, "reason": "explanation"},
          "disrupcion_real": {"score": 1-5, "reason": "explanation"},
          "retencion_talento": {"score": 1-5, "reason": "explanation"},
          "escala_dentro_clientes": {"score": 1-5, "reason": "explanation"},
          "roi_claro": {"score": 1-5, "reason": "explanation"},
          "categoria_estandar": {"score": 1-5, "reason": "explanation"},
          "buen_fondo": {"score": 1-5, "reason": "explanation"}
        },
        "personal_gates": {
          "energia_obsesion": {"score": 1-5, "reason": "explanation"},
          "velocidad_primera_senal": {"score": 1-5, "reason": "explanation"},
          "feedback_loop_rapido": {"score": 1-5, "reason": "explanation"},
          "alineacion_perfil": {"score": 1-5, "reason": "explanation"},
          "tamano_dolor": {"score": 1-5, "reason": "explanation"},
          "ai_ventaja_central": {"score": 1-5, "reason": "explanation"},
          "monetizacion_clara": {"score": 1-5, "reason": "explanation"},
          "puedo_ser_usuario": {"score": 1-5, "reason": "explanation"},
          "narrativa_convincente": {"score": 1-5, "reason": "explanation"},
          "no_permiso_externo": {"score": 1-5, "reason": "explanation"},
          "potencial_habito": {"score": 1-5, "reason": "explanation"}
        }
      },
      "total_score": 4.2
    }
  ]
}`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers, ip_address, user_agent } = body;

    if (!answers) {
      return NextResponse.json(
        { error: "Answers are required" },
        { status: 400 }
      );
    }

    // Format answers for the prompt
    const answersText = Object.entries(answers)
      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
      .join("\n");

    // Generate with Anthropic
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Generate a Venture DNA and venture ideas for a founder with these characteristics:

${answersText}

Respond ONLY with valid JSON in the format specified.`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    // Parse the JSON response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not extract JSON from response");
    }

    const result = JSON.parse(jsonMatch[0]);

    // Save profile to Supabase
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .insert({
        entrepreneur_type: result.venture_dna.entrepreneur_type,
        obsession: answers.obsession,
        strengths: answers.strengths || [],
        drains: answers.drains || [],
        time_availability: answers.context,
        capital: answers.capital,
        team: answers.team,
        tech_skills: answers.tech_skills,
        industries: answers.industries || [],
        ambition: answers.ambition,
        non_negotiables: result.venture_dna.non_negotiables,
        accelerators: result.venture_dna.accelerators,
        red_flags: result.venture_dna.red_flags,
        venture_dna: result.venture_dna,
        is_public: true,
        ip_address,
        user_agent,
      })
      .select()
      .single();

    if (profileError) {
      console.error("Error saving profile:", profileError);
      // Continue without failing - return result anyway
    }

    // Save ventures to Supabase if profile was created
    if (profile) {
      const venturesToInsert = result.ventures.map((v: any) => ({
        profile_id: profile.id,
        name: v.name,
        tagline: v.tagline,
        category: v.category,
        description: v.description,
        offer: v.offer,
        why_now: v.why_now,
        proof_signals: v.proof_signals,
        market_gap: v.market_gap,
        competitors: v.competitors,
        founder_market_fit: v.founder_market_fit,
        execution_plan: v.execution_plan,
        monetization: v.monetization,
        gate_scores: v.gate_scores,
        total_score: v.total_score,
        founder_market_fit_score: Math.round((v.founder_market_fit_score || v.total_score * 20)),
        is_public: true,
      }));

      const { error: venturesError } = await supabase
        .from("ventures")
        .insert(venturesToInsert);

      if (venturesError) {
        console.error("Error saving ventures:", venturesError);
      }

      // Add IDs to result for frontend
      result.profile_id = profile.id;
      result.share_slug = profile.share_slug;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating venture DNA:", error);
    return NextResponse.json(
      { error: "Failed to generate venture DNA" },
      { status: 500 }
    );
  }
}
