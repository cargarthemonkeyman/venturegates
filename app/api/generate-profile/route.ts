import { NextRequest, NextResponse } from "next/server";

export const runtime = 'nodejs';
export const maxDuration = 60;

const generatePrompt = (profileText: string) => `You are VentureGates AI. Create a comprehensive Founder DNA profile.

FOUNDER PROFILE:
${profileText}

Generate JSON with this structure:
{
  "founder_dna": {
    "archetype": {
      "name": "The [Descriptive] [Noun]",
      "tagline": "One-line identity statement",
      "description": "2-3 paragraphs describing this founder type, their strengths, how they operate under uncertainty",
      "founder_market_fit_score": 75
    },
    "cognitive_profile": {
      "dominant_function": "Primary mode",
      "auxiliary_function": "Supporting mode",
      "decision_making": "How they decide under pressure",
      "stress_response": "Reaction to uncertainty",
      "flow_triggers": ["Trigger 1", "Trigger 2", "Trigger 3", "Trigger 4", "Trigger 5"]
    },
    "the_edge": {
      "superpowers": [
        {"name": "Power 1", "description": "What it is", "evidence": "From profile", "unfair_advantage": "Competitive edge"},
        {"name": "Power 2", "description": "What it is", "evidence": "From profile", "unfair_advantage": "Competitive edge"},
        {"name": "Power 3", "description": "What it is", "evidence": "From profile", "unfair_advantage": "Competitive edge"}
      ],
      "pattern_recognition": "Description of pattern abilities"
    },
    "the_shadow": {
      "cognitive_biases": [
        {"bias": "Bias 1", "manifestation": "How it shows", "trigger": "What triggers it", "mitigation": "How to fix"},
        {"bias": "Bias 2", "manifestation": "How it shows", "trigger": "What triggers it", "mitigation": "How to fix"}
      ],
      "failure_patterns": ["Pattern 1", "Pattern 2", "Pattern 3"],
      "blind_spots": ["Spot 1", "Spot 2", "Spot 3"],
      "energy_drains": ["Drain 1", "Drain 2", "Drain 3", "Drain 4"]
    },
    "venture_fit": {
      "sweet_spot": {"type": "Best type", "description": "Why it fits", "examples": ["Ex 1", "Ex 2", "Ex 3"]},
      "danger_zone": {"type": "Avoid type", "description": "Why to avoid", "warning_signs": ["Sign 1", "Sign 2", "Sign 3"]},
      "cofounder_profile": "Ideal partner description",
      "optimal_stage": "Best startup stage",
      "team_size_ideal": "Optimal team size"
    },
    "playbook": {
      "gtm_strategy": "Go-to-market approach",
      "first_hire": "Who to hire first",
      "fundraising_approach": "Funding strategy",
      "decision_framework": "Decision methodology",
      "burnout_signals": ["Signal 1", "Signal 2", "Signal 3", "Signal 4"],
      "recovery_protocol": "Burnout recovery plan"
    },
    "relationship_dynamics": {
      "as_cofounder": "Cofounder style",
      "as_leader": "Leadership approach",
      "communication_style": "Communication pattern",
      "conflict_response": "Conflict handling"
    }
  }
}

Rules:
- founder_market_fit_score: 60-95
- Be specific, reference profile data
- Output ONLY valid JSON`;

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { answers } = await request.json();

    if (!answers) {
      return NextResponse.json({ error: "Missing answers" }, { status: 400 });
    }

    const profileText = Object.entries(answers)
      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : String(value)}`)
      .join("\n");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: generatePrompt(profileText) }],
        temperature: 0.7,
        max_tokens: 4000,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI error:", error);
      return NextResponse.json(
        { error: `AI service error: ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "Empty response" }, { status: 502 });
    }

    // Extract JSON
    let jsonText = content;
    const match = jsonText.match(/\{[\s\S]*\}/);
    if (match) jsonText = match[0];

    const result = JSON.parse(jsonText);

    if (!result.founder_dna?.archetype?.name) {
      return NextResponse.json(
        { error: "Invalid response structure" },
        { status: 502 }
      );
    }

    console.log(`Profile generated in ${Date.now() - startTime}ms`);
    return NextResponse.json(result);

  } catch (err) {
    console.error(`Failed after ${Date.now() - startTime}ms:`, err);
    
    if ((err as Error).name === "AbortError") {
      return NextResponse.json(
        { error: "Generation timeout - please try again" },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to generate profile" },
      { status: 500 }
    );
  }
}
