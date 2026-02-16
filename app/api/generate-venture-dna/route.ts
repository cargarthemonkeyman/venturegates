import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// Initialize Anthropic client - API key is validated at runtime
const getAnthropicClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }
  return new Anthropic({ apiKey });
};

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
          "real_scale": {"score": 1-5, "reason": "explanation"},
          "explosive_growth": {"score": 1-5, "reason": "explanation"},
          "fast_to_market": {"score": 1-5, "reason": "explanation"},
          "wow_demo": {"score": 1-5, "reason": "explanation"},
          "sellable_spinoff": {"score": 1-5, "reason": "explanation"},
          "be_early": {"score": 1-5, "reason": "explanation"},
          "real_disruption": {"score": 1-5, "reason": "explanation"},
          "talent_retention": {"score": 1-5, "reason": "explanation"},
          "scale_within_clients": {"score": 1-5, "reason": "explanation"},
          "clear_roi": {"score": 1-5, "reason": "explanation"},
          "category_standard": {"score": 1-5, "reason": "explanation"},
          "strong_foundation": {"score": 1-5, "reason": "explanation"}
        },
        "personal_gates": {
          "energy_obsession": {"score": 1-5, "reason": "explanation"},
          "speed_to_signal": {"score": 1-5, "reason": "explanation"},
          "fast_feedback": {"score": 1-5, "reason": "explanation"},
          "profile_alignment": {"score": 1-5, "reason": "explanation"},
          "pain_size": {"score": 1-5, "reason": "explanation"},
          "ai_core_advantage": {"score": 1-5, "reason": "explanation"},
          "clear_monetization": {"score": 1-5, "reason": "explanation"},
          "can_be_user": {"score": 1-5, "reason": "explanation"},
          "compelling_narrative": {"score": 1-5, "reason": "explanation"},
          "no_external_permission": {"score": 1-5, "reason": "explanation"},
          "habit_potential": {"score": 1-5, "reason": "explanation"}
        }
      },
      "total_score": 4.2
    }
  ]
}`;

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { answers } = body;

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "Answers are required and must be an object" },
        { status: 400 }
      );
    }

    // Initialize Anthropic
    let anthropic;
    try {
      anthropic = getAnthropicClient();
    } catch (error) {
      console.error("Anthropic initialization error:", error);
      return NextResponse.json(
        { error: "AI service not configured. Please contact support." },
        { status: 503 }
      );
    }

    // Format answers for the prompt
    const answersText = Object.entries(answers)
      .map(([key, value]) => {
        const displayValue = Array.isArray(value) 
          ? value.join(", ") 
          : String(value);
        return `${key}: ${displayValue}`;
      })
      .join("\n");

    // Call Anthropic API
    let response;
    try {
      response = await anthropic.messages.create({
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
    } catch (error: any) {
      console.error("Anthropic API error:", error);
      
      // Handle specific Anthropic errors
      if (error.status === 401) {
        return NextResponse.json(
          { error: "AI authentication failed. Please contact support." },
          { status: 503 }
        );
      }
      if (error.status === 429) {
        return NextResponse.json(
          { error: "Too many requests. Please try again in a moment." },
          { status: 429 }
        );
      }
      if (error.status >= 500) {
        return NextResponse.json(
          { error: "AI service temporarily unavailable. Please try again." },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { error: "Failed to generate venture DNA. Please try again." },
        { status: 500 }
      );
    }

    // Parse response
    const content = response.content[0];
    if (content.type !== "text") {
      return NextResponse.json(
        { error: "Unexpected response from AI service" },
        { status: 500 }
      );
    }

    // Extract JSON
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Could not extract JSON from response:", content.text.substring(0, 500));
      return NextResponse.json(
        { error: "Could not parse AI response. Please try again." },
        { status: 500 }
      );
    }

    let result;
    try {
      result = JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("JSON parse error:", error);
      return NextResponse.json(
        { error: "Invalid response format from AI. Please try again." },
        { status: 500 }
      );
    }

    // Validate result structure
    if (!result.venture_dna || !result.ventures || !Array.isArray(result.ventures)) {
      return NextResponse.json(
        { error: "Invalid response structure from AI. Please try again." },
        { status: 500 }
      );
    }

    // Return result (Supabase saving is optional and non-blocking)
    return NextResponse.json(result);

  } catch (error) {
    console.error("Unhandled error in generate-venture-dna:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
