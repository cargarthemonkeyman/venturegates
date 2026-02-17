import { NextRequest, NextResponse } from "next/server";

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 2000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers } = body;

    if (!answers) {
      return NextResponse.json({ error: "Missing answers" }, { status: 400 });
    }

    // Build detailed founder profile including personality dimensions
    const profileText = Object.entries(answers)
      .map(([key, value]) => {
        const val = Array.isArray(value) ? value.join(", ") : String(value);
        return `${key}: ${val}`;
      })
      .join("\n");

    // Extract personality dimensions if present
    const structureChaos = answers.structure_chaos !== undefined ? parseInt(answers.structure_chaos) : 5;
    const riskSecurity = answers.risk_security !== undefined ? parseInt(answers.risk_security) : 5;
    const individualTribal = answers.individual_tribal !== undefined ? parseInt(answers.individual_tribal) : 5;

    // Personality-based venture recommendations
    const personalityContext = `
WORK STYLE PREFERENCES (0-10 scale):
- Structure vs Chaos: ${structureChaos}/10 (${structureChaos < 4 ? "Prefers clear routines and defined processes" : structureChaos > 7 ? "Thrives on improvisation and total flexibility" : "Balanced approach with some structure"})
- Risk vs Security: ${riskSecurity}/10 (${riskSecurity < 4 ? "Minimizes risk, prefers safe steps" : riskSecurity > 7 ? "High risk tolerance for high potential returns" : "Moderate risk appetite"})
- Individual vs Tribal: ${individualTribal}/10 (${individualTribal < 4 ? "Energy comes from deep solo work" : individualTribal > 7 ? "Energy comes from constant collaboration" : "Mix of solo and team work"})

PERSONALIZED RECOMMENDATIONS:
${structureChaos < 4 ? "- FAVOR ventures with clear roadmaps, established playbooks, and systematic approaches" : structureChaos > 7 ? "- FAVOR ventures that allow pivoting, experimentation, and rapid iteration without heavy process" : "- BALANCE structure with flexibility"}
${riskSecurity < 4 ? "- FAVOR proven markets, validated demand, lower failure probability" : riskSecurity > 7 ? "- FAVOR frontier markets, first-mover advantages, asymmetric upside opportunities" : "- MODERATE risk with clear mitigation strategies"}
${individualTribal < 4 ? "- FAVOR ventures where individual expertise is the differentiator (solo-founder friendly)" : individualTribal > 7 ? "- FAVOR ventures requiring team coordination, community building, network effects" : "- FAVOR ventures allowing both solo deep work and collaborative phases"}
`;

    const prompt = `You are VentureGates AI. Create a personalized Venture DNA and 3 unique venture ideas for this founder.

CRITICAL RULES - ANTI-GENERIC OUTPUT:
1. NEVER use phrases like: "validate the idea", "create a business plan", "find product-market fit", "conduct market research", "build an MVP"
2. ALWAYS provide SPECIFIC numbers, dates, channels, and actions - never vague concepts
3. If you cannot provide a specific number, write "REQUIERE RESEARCH" instead of inventing
4. Expected Results MUST include at least 3 quantifiable metrics with RANGES (e.g., "100-500 users", "$1K-5K MRR")
5. Testing Mode must vary between the 4 strategies based on venture type
6. Business Model MUST include: pricing with justification, CAC estimate, LTV/CAC ratio, payback period

FOUNDER PROFILE:
${profileText}

${personalityContext}

Create a JSON response with this exact structure:

{
  "venture_dna": {
    "entrepreneur_type": "Descriptive name incorporating personality profile",
    "type_description": "Detailed 2-3 sentence description referencing their personality scores",
    "personality_profile": {
      "structure_chaos": ${structureChaos},
      "risk_security": ${riskSecurity},
      "individual_tribal": ${individualTribal},
      "archetype_blend": "Description of how these dimensions combine"
    },
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
      "why_now": "Why timing is perfect with SPECIFIC 2025 trends/data",
      "proof_signals": [{"source": "Reddit/Twitter/Specific", "signal": "Trend", "data": "Specific evidence with numbers"}],
      "market_gap": "What competitors miss",
      "competitors": [{"name": "Company", "url": "https://...", "what_they_do": "...", "why_not_enough": "Gap"}],
      "founder_market_fit": "Specific explanation why this founder fits this venture based on their profile AND personality scores",
      "founder_market_fit_score": 72,
      "execution_plan": [{"week": 1, "focus": "...", "tasks": ["Specific action with metric"], "tools": ["..."]}],
      "expected_results": {
        "week_1": "Specific deliverable with metric (e.g., 'Landing page live with 50+ email signups')",
        "week_2": "Specific deliverable with metric (e.g., '20 user interviews completed, 3 paid pre-orders')",
        "week_3": "Specific deliverable with metric (e.g., '100 waitlist members, 10% conversion to beta')",
        "week_4": "Specific deliverable with metric (e.g., 'First $500 revenue, 25% MoM growth projected')",
        "month_3": "3-month projection: [METRIC 1 with RANGE], [METRIC 2 with RANGE], [METRIC 3 with RANGE]",
        "month_6": "6-month projection: [METRIC 1 with RANGE], [METRIC 2 with RANGE], [METRIC 3 with RANGE]",
        "month_12": "12-month projection: [METRIC 1 with RANGE], [METRIC 2 with RANGE], [METRIC 3 with RANGE]",
        "traction_metrics": [
          {"metric": "User Acquisition", "target": "100-500 users", "timeline": "Month 3", "channel": "Specific channel (e.g., Reddit r/sideproject, Twitter DM to 50 creators)"},
          {"metric": "Revenue", "target": "$1K-5K MRR", "timeline": "Month 6", "assumption": "Based on X% conversion"},
          {"metric": "Engagement", "target": "Y% DAU/MAU", "timeline": "Month 3"}
        ],
        "benchmarks": "Comparable: [Company X] achieved [metric] in [timeframe]"
      },
      "testing_mode": {
        "strategy": "SMOKE_TEST|CONCIERGE|FAKE_DOOR|WIZARD_OZ",
        "description": "Why this strategy fits this venture",
        "budget": "$X-Y",
        "timeline": "X days/hours",
        "success_criteria": "Specific number (e.g., '15% email CTR', '5 manual conversions')",
        "execution_steps": [
          "Step 1 with specific action",
          "Step 2 with specific action",
          "Step 3 with specific action"
        ]
      },
      "monetization": {
        "model": "SaaS/Marketplace/Service/etc",
        "who_pays": "Specific persona",
        "price": "$X/month or $Y one-time",
        "price_justification": "Why this price point (comparable to Z, value delivered)",
        "revenue_streams": [
          {"stream": "Primary", "description": "...", "percentage": 80},
          {"stream": "Secondary", "description": "...", "percentage": 15},
          {"stream": "Potential", "description": "...", "percentage": 5}
        ]
      },
      "unit_economics": {
        "cac_estimate": "$X (calculated as: [ad spend] / [conversions] or [time] x [hourly rate])",
        "ltv_estimate": "$Y (calculated as: [ARPU] x [retention months])",
        "ltv_cac_ratio": "X.Y:1",
        "payback_period": "Z months",
        "break_even_timeline": "Month X"
      },
      "distribution_channels": [
        {"channel": "Primary", "name": "Specific channel", "effort_percentage": 60, "tactics": ["Specific tactic 1", "Specific tactic 2"]},
        {"channel": "Secondary", "name": "Specific channel", "effort_percentage": 30, "tactics": ["Specific tactic"]},
        {"channel": "Experimental", "name": "Specific channel", "effort_percentage": 10, "tactics": ["Specific tactic"]}
      ],
      "gate_scores": {
        "market_gates": {
          "market_size": {"score": 3, "reason": "Specific reason with TAM/SAM/SOM numbers"},
          "growth_trajectory": {"score": 4, "reason": "Specific CAGR % or trend data"},
          "timing": {"score": 5, "reason": "Why now with specific 2025 catalysts"},
          "competition": {"score": 3, "reason": "Competitive landscape analysis with names"},
          "regulatory_risk": {"score": 4, "reason": "Specific regulatory environment"}
        },
        "product_gates": {
          "technical_feasibility": {"score": 4, "reason": "Can be built with current tech in X weeks"},
          "speed_to_mvp": {"score": 3, "reason": "X weeks to first version"},
          "wow_factor": {"score": 4, "reason": "Will customers be impressed because..."},
          "scalability": {"score": 3, "reason": "Can scale efficiently to X users"}
        },
        "personal_gates": {
          "energy_alignment": {"score": 4, "reason": "Does this excite the founder based on their profile"},
          "skill_match": {"score": 3, "reason": "How well skills align with requirements"},
          "experience_relevance": {"score": 4, "reason": "Past experience applicability"},
          "network_advantage": {"score": 3, "reason": "Network value for this venture"},
          "risk_tolerance_fit": {"score": 4, "reason": "Matches risk appetite (${riskSecurity}/10)"}
        },
        "business_gates": {
          "monetization_clarity": {"score": 4, "reason": "How clear is the revenue model"},
          "unit_economics": {"score": 3, "reason": "Will it be profitable (LTV/CAC > 3?)"},
          "funding_efficiency": {"score": 4, "reason": "Capital efficiency"},
          "exit_potential": {"score": 3, "reason": "Acquisition/IPO potential with comparable exits"}
        }
      },
      "total_score": 3.6
    }
  ]
}

TESTING MODE STRATEGIES (assign DIFFERENT strategies to each venture):
1. SMOKE_TEST: Landing page + ads, 48h, measure CTR. Best for: B2C, content products, broad appeal.
2. CONCIERGE_MVP: Manual delivery first, 5 clients, then automate. Best for: B2B services, high-touch products.
3. FAKE_DOOR: "Buy" button → waitlist, measure purchase intent. Best for: New products, unproven demand.
4. WIZARD_OF_OZ: Manual backend, automated frontend. Best for: AI products, complex automation.

VARIATION RULE: If Venture 1 uses SMOKE_TEST, Venture 2 must use CONCIERGE or FAKE_DOOR, Venture 3 must use a different one.

SCORING GUIDELINES (be honest, use full range):
- founder_market_fit_score: 40-95 based on how well the founder's actual profile matches
- total_score: 2.5-4.8 average of all gate scores
- Each gate score (1-5): 1=poor fit, 3=average, 5=exceptional
- Ventures should have DIFFERENT scores reflecting different fit levels

Generate 3 DIFFERENT ventures with HONEST, VARIED scores. Include real details. Output ONLY valid JSON.`;

    // Retry logic with exponential backoff
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout per attempt

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
            max_tokens: 6000,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`OpenAI error (attempt ${attempt}):`, errorText);
          
          // If it's a rate limit or server error, retry
          if (response.status === 429 || response.status >= 500) {
            if (attempt < MAX_RETRIES) {
              const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);
              console.log(`Retrying in ${delay}ms...`);
              await new Promise(resolve => setTimeout(resolve, delay));
              continue;
            }
          }
          throw new Error(`OpenAI API error: ${response.status}`);
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

        if (result.ventures.length === 0) {
          throw new Error("No ventures generated");
        }

        // Validate expanded fields
        for (const venture of result.ventures) {
          if (!venture.expected_results || !venture.testing_mode || !venture.unit_economics) {
            console.warn("Venture missing expanded fields, but continuing...");
          }
        }

        return NextResponse.json(result);

      } catch (error) {
        lastError = error as Error;
        console.error(`Attempt ${attempt} failed:`, error);
        
        if (attempt < MAX_RETRIES) {
          const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // All retries exhausted
    console.error("All retries exhausted:", lastError);
    return NextResponse.json(
      { error: "Failed to generate after multiple attempts. Please try again." },
      { status: 500 }
    );

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate. Please try again." },
      { status: 500 }
    );
  }
}
