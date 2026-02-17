import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';
export const maxDuration = 60;

// Deep psychological analysis prompt - $90 worth of insight
const generateDNAPrompt = (profileText: string, structureChaos: number, riskSecurity: number, individualTribal: number) => `You are an organizational psychologist specializing in founder psychology with 20+ years of experience. You have analyzed thousands of successful and failed founders. Your task is to create a comprehensive psychological profile of this founder that reveals insights they likely don't know about themselves.

PERSONALITY DIMENSIONS (0-10 scale):
- Structure vs Chaos: ${structureChaos}/10 (${structureChaos < 4 ? 'Chaos-preferring' : structureChaos > 7 ? 'Structure-preferring' : 'Balanced'})
- Risk vs Security: ${riskSecurity}/10 (${riskSecurity < 4 ? 'Security-oriented' : riskSecurity > 7 ? 'Risk-embracing' : 'Calculated risk-taker'})
- Individual vs Tribal: ${individualTribal}/10 (${individualTribal < 4 ? 'Team-dependent' : individualTribal > 7 ? 'Independently-driven' : 'Collaborative individualist'})

FOUNDER PROFILE DATA:
${profileText}

CRITICAL INSTRUCTION: This is NOT a template exercise. Every sentence must be specific to THIS founder based on their unique pattern of responses. Reference specific answers, contradictions, and patterns. The analysis should feel like a one-on-one therapy session revealing truths they haven't articulated.

Generate a JSON response with this structure:
{
  "founder_dna": {
    "archetype": {
      "name": "A SPECIFIC two-word archetype name (e.g., 'The Visionary Architect', 'The Pragmatic Rebel', 'The Empirical Visionary'). NO generic terms like 'The Entrepreneur' or 'The Founder'.",
      "tagline": "One powerful sentence that captures their ESSENCE—what drives them at 3am. Should feel personal and slightly unsettling in its accuracy.",
      "description": "2-3 paragraphs of deep psychological analysis. Include: (1) Their unique operating system—how they process uncertainty differently than others, (2) The origin story implied by their answers—what past experiences shaped these patterns, (3) Their superpower in action—how this manifests in real startup scenarios. Use phrases like 'Unlike typical founders who...' and 'You likely discovered this pattern when...' and 'This probably manifests as...'",
      "founder_market_fit_score": 75
    },
    "cognitive_profile": {
      "dominant_function": "Their primary cognitive mode with specific detail—e.g., not just 'Intuition' but 'Pattern-synthesis through emotional resonance' or 'Systematic deconstruction followed by rapid reconstruction'",
      "auxiliary_function": "How they support their dominant mode—specific, not generic",
      "decision_making": "A 2-3 sentence description of their EXACT decision process under pressure. Include their tell—the micro-behavior that signals they're about to decide (e.g., 'You create spreadsheets then ignore them', 'You seek one dissenting voice').",
      "stress_response": "What ACTUALLY happens when they're overwhelmed. Not generic stress symptoms but their specific spiral pattern and recovery mechanism.",
      "flow_triggers": ["5 specific activities that put them in flow. Not generic 'creative work' but specific modalities like 'Building prototypes without documentation', 'Negotiating when stakes are highest', 'Teaching complex concepts'"]
    },
    "the_edge": {
      "superpowers": [
        {
          "name": "A vivid, specific name for this superpower—not generic 'Leadership'",
          "description": "What this power is and how it manifests in startup contexts. Include a specific scenario.",
          "evidence": "Direct reference to their profile answers that proves this",
          "unfair_advantage": "Why this creates sustainable competitive advantage—something that can't be copied"
        }
      ],
      "pattern_recognition": "Describe their specific pattern recognition ability. What types of patterns do they see that others miss? Reference specific clues from their answers."
    },
    "the_shadow": {
      "cognitive_biases": [
        {
          "bias": "Specific bias name—not just 'Confirmation Bias' but their unique flavor",
          "manifestation": "EXACTLY how this shows up in their decisions. Use their specific language patterns if possible.",
          "trigger": "The specific situation that activates this bias",
          "mitigation": "A concrete, actionable countermeasure they can implement TODAY"
        }
      ],
      "failure_patterns": ["3 specific ways they tend to fail—not generic 'giving up' but their unique collapse pattern"],
      "blind_spots": ["3 things they consistently miss—not generic 'details' but specific cognitive gaps"],
      "energy_drains": ["4 specific activities that deplete them—be precise, e.g., not 'meetings' but 'Status updates without debate'"]
    },
    "venture_fit": {
      "sweet_spot": {
        "type": "Specific venture type with detail—e.g., not just 'B2B SaaS' but 'Technical B2B tools with viral adoption loops'",
        "description": "Why this fits their psychology, not just skills. Connect to their deeper needs.",
        "examples": ["3 specific, non-obvious venture examples that would fit them"]
      },
      "danger_zone": {
        "type": "Specific venture type that would destroy them",
        "description": "Psychological analysis of WHY this would be toxic for them specifically",
        "warning_signs": ["3 early indicators they're drifting into this danger zone"]
      },
      "cofounder_profile": "The EXACT complementary profile they need—not generic 'technical cofounder' but the psychological profile. What cognitive functions should their cofounder have? What should they NOT have?",
      "optimal_stage": "Pre-seed/Seed/Series A/etc with psychological rationale—why this stage fits their nature",
      "team_size_ideal": "Optimal range with explanation of why—what happens below minimum? Above maximum?"
    },
    "playbook": {
      "gtm_strategy": "Their personalized go-to-market strategy based on their psychology—not generic advice but 'Because you're X, you should Y'",
      "first_hire": "Who they should hire first and WHY—psychological rationale for why this hire balances them",
      "fundraising_approach": "How they should pitch based on their communication style. Should they emphasize vision or metrics? Story or data?",
      "decision_framework": "A 3-step framework for decisions that fits THEIR brain—not generic pros/cons but their specific process",
      "burnout_signals": ["4 specific early warning signs of burnout for THEM—not generic 'feeling tired' but their specific pattern"],
      "recovery_protocol": "Their specific recovery process—what actually recharges them, not what should"
    },
    "relationship_dynamics": {
      "as_cofounder": "How they ACTUALLY are as a cofounder—not aspirational but realistic, including the frustrating parts",
      "as_leader": "Their leadership style under stress—what their team experiences",
      "communication_style": "How they communicate when stakes are high—their default mode",
      "conflict_response": "What they ACTUALLY do in conflict—fight, flight, freeze, or something more complex?"
    }
  }
}

RULES FOR DEEP ANALYSIS:
1. NEVER use phrases like "As a founder..." or "You may find..." Be direct: "You..." 
2. Include at least one insight that might make them slightly uncomfortable in its accuracy
3. Reference specific contradictions in their answers—these reveal the most
4. Use metaphor and analogy that fits their specific profile
5. founder_market_fit_score: 60-95 range, based on how clear their pattern is
6. Output ONLY valid JSON
7. Every field must be populated with substantive content—no placeholders

Remember: This founder is paying $90 for insights they can't get anywhere else. Generic advice = refund requested.`;

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { answers } = body;

    if (!answers) {
      return NextResponse.json({ error: "Missing answers" }, { status: 400 });
    }

    // Build profile
    const profileText = Object.entries(answers)
      .map(([key, value]) => {
        const val = Array.isArray(value) ? value.join(", ") : String(value);
        return `${key}: ${val}`;
      })
      .join("\n");

    const structureChaos = answers.structure_chaos !== undefined ? parseInt(answers.structure_chaos) : 5;
    const riskSecurity = answers.risk_security !== undefined ? parseInt(answers.risk_security) : 5;
    const individualTribal = answers.individual_tribal !== undefined ? parseInt(answers.individual_tribal) : 5;

    const prompt = generateDNAPrompt(profileText, structureChaos, riskSecurity, individualTribal);

    // Single attempt with longer timeout
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
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 4000,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI error:", errorText);
      return NextResponse.json(
        { error: `AI service error: ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "Empty AI response" },
        { status: 502 }
      );
    }

    // Extract JSON
    let jsonText = content;
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    const result = JSON.parse(jsonText);

    // Validate structure
    if (!result.founder_dna?.archetype?.name) {
      return NextResponse.json(
        { error: "Invalid response structure" },
        { status: 502 }
      );
    }

    const duration = Date.now() - startTime;
    console.log(`DNA generation completed in ${duration}ms`);

    return NextResponse.json(result);

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`Generation failed after ${duration}ms:`, error);
    
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: "Generation timeout - AI service took too long" },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to generate DNA profile" },
      { status: 500 }
    );
  }
}
