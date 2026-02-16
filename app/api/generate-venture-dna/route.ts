import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers } = body;

    if (!answers) {
      return NextResponse.json({ error: "Missing answers" }, { status: 400 });
    }

    // Build detailed founder profile
    const profileText = Object.entries(answers)
      .map(([key, value]) => {
        const val = Array.isArray(value) ? value.join(", ") : String(value);
        return `${key}: ${val}`;
      })
      .join("\n");

    const prompt = `You are VentureGates AI. Create a personalized Venture DNA and 3 unique venture ideas for this founder.

CRITICAL: Calculate scores HONESTLY based on the founder's profile. Do NOT use default values. Score ranges: 1-5 for gates, 40-95% for founder_market_fit, 2.5-5.0 for total_score.

FOUNDER PROFILE:
${profileText}

Create a JSON response with this exact structure:

{
  "venture_dna": {
    "entrepreneur_type": "Descriptive name",
    "type_description": "Detailed 2-3 sentence description",
    "non_negotiables": [{"name": "...", "description": "Detailed", "icon": "emoji"}],
    "accelerators": [{"name": "...", "description": "Detailed", "icon": "emoji"}],
    "red_flags": [{"name": "...", "description": "Detailed", "icon": "emoji"}]
  },
  "ventures": [
    {
      "name": "Unique Name",
      "tagline": "Compelling one-liner",
      "category": "Category",
      "description": "Detailed description",
      "offer": "What it does",
      "why_now": "Why timing is perfect",
      "proof_signals": [{"source": "Reddit/Twitter", "signal": "Trend", "data": "Evidence"}],
      "market_gap": "What competitors miss",
      "competitors": [{"name": "Company", "url": "https://...", "what_they_do": "...", "why_not_enough": "Gap"}],
      "founder_market_fit": "Specific explanation why this founder fits this venture based on their profile",
      "founder_market_fit_score": 72,
      "execution_plan": [{"week": 1, "focus": "...", "tasks": ["..."], "tools": ["..."]}],
      "monetization": {"model": "SaaS", "who_pays": "...", "price": "$X/month", "why_they_pay": "..."},
      "gate_scores": {
        "market_gates": {
          "market_size": {"score": 3, "reason": "Specific reason based on market analysis"},
          "growth_trajectory": {"score": 4, "reason": "Specific reason based on trends"},
          "timing": {"score": 5, "reason": "Why now is the right time"},
          "competition": {"score": 3, "reason": "Competitive landscape analysis"},
          "regulatory_risk": {"score": 4, "reason": "Regulatory environment"}
        },
        "product_gates": {
          "technical_feasibility": {"score": 4, "reason": "Can it be built with current tech"},
          "speed_to_mvp": {"score": 3, "reason": "How fast to first version"},
          "wow_factor": {"score": 4, "reason": "Will customers be impressed"},
          "scalability": {"score": 3, "reason": "Can it scale efficiently"}
        },
        "personal_gates": {
          "energy_alignment": {"score": 4, "reason": "Does this excite the founder"},
          "skill_match": {"score": 3, "reason": "How well skills align"},
          "experience_relevance": {"score": 4, "reason": "Past experience applicability"},
          "network_advantage": {"score": 3, "reason": "Network value for this venture"},
          "risk_tolerance_fit": {"score": 4, "reason": "Matches risk appetite"}
        },
        "business_gates": {
          "monetization_clarity": {"score": 4, "reason": "How clear is the revenue model"},
          "unit_economics": {"score": 3, "reason": "Will it be profitable"},
          "funding_efficiency": {"score": 4, "reason": "Capital efficiency"},
          "exit_potential": {"score": 3, "reason": "Acquisition/IPO potential"}
        }
      },
      "total_score": 3.6
    }
  ]
}

SCORING GUIDELINES (be honest, use full range):
- founder_market_fit_score: 40-95 based on how well the founder's actual profile matches this venture
- total_score: 2.5-4.8 average of all gate scores
- Each gate score (1-5): 1=poor fit, 3=average, 5=exceptional
- Ventures should have DIFFERENT scores reflecting different fit levels

Generate 3 DIFFERENT ventures with HONEST, VARIED scores. Include real details. Output ONLY valid JSON.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI error:", error);
      throw new Error("OpenAI API error");
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    // Extract JSON from response
    let jsonText = content;
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    const result = JSON.parse(jsonText);

    // Validate structure
    if (!result.venture_dna || !result.ventures || !Array.isArray(result.ventures)) {
      throw new Error("Invalid response structure");
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate. Please try again." },
      { status: 500 }
    );
  }
}
