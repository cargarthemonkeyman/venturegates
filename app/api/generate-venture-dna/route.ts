import { NextRequest, NextResponse } from "next/server";
import { DNASchema, DNAOutput } from "@/lib/dna-schema";

export const runtime = 'nodejs';
export const maxDuration = 90;

// Generate the DNA analysis prompt with user answers embedded
const generateDNAPrompt = (
  profileText: string,
  structureChaos: number,
  riskSecurity: number,
  individualTribal: number,
  answers: Record<string, any>
): string => {
  const evidenceReferences = Object.entries(answers)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      const displayValue = Array.isArray(value) ? value.join(", ") : String(value);
      return `- ${key}: "${displayValue.substring(0, 150)}${displayValue.length > 150 ? '...' : ''}"`;
    })
    .join("\n");

  return `You are a senior product strategist and venture analyst at VentureGates. Your job is to analyze a founder's assessment answers and generate a personalized DNA profile that helps them understand:
- What kind of product/company they should build
- How they should operate based on their natural patterns
- Specific actionable next steps

## PERSONALITY DIMENSIONS (0-10 scale)
- Structure vs Chaos: ${structureChaos}/10
- Risk vs Security: ${riskSecurity}/10
- Individual vs Tribal: ${individualTribal}/10

## FOUNDER'S ACTUAL ANSWERS (MANDATORY EVIDENCE SOURCE)
${evidenceReferences}

## DETAILED PROFILE
${profileText}

---

## CRITICAL RULES — VIOLATIONS WILL CAUSE REJECTION

### 1. EVIDENCE-BASED CITATIONS (MANDATORY)
Every major insight MUST include a citation in one of these formats:
- "Based on your answer about [topic], you..."
- "You mentioned [specific answer], which indicates..."
- "Your response on [question] shows..."

REQUIRED: ALL fields named "because_you_said" or "evidence" MUST contain a specific citation. No generic filler like "Based on your answers" — cite the ACTUAL answer.

### 2. TONE & STYLE RULES
- **Direct**: "You build fast." Not "You may find that you tend to build quickly."
- **Useful**: Every statement must have actionable implications
- **Premium**: No generic fluff, no buzzwords without substance
- **Evidence-based**: Every claim must cite a specific answer
- **Coherent**: If contradictions exist, explain the tradeoff explicitly

### 3. FORBIDDEN PHRASES (WILL BE REJECTED)
NEVER use:
- "As a founder..."
- "You may find..."
- "You might consider..."
- "It's possible that..."
- Generic metaphors without specific grounding
- Vague descriptors ("creative", "driven", "passionate") without evidence

### 4. REQUIRED PATTERNS
- Start with specific observation
- Link to specific answer
- Provide actionable implication
- Keep to 1-2 lines per point

### 5. UI-OPTIMIZED OUTPUT STRUCTURE
The output will be displayed in cards, bullets, and visual components. Optimize for this:
- Titles: 2-5 words, action-oriented
- Bullets: 1-2 lines max
- Descriptions: 2-4 bullets max, each with evidence citation
- Taglines: Max 15 words, punchy

---

## OUTPUT STRUCTURE

\`\`\`json
{
  "founder_dna": {
    "archetype": {
      "name": "2-3 words, specific (e.g., 'Visionary Builder', 'Systems Architect')",
      "tagline": "1 punchy sentence (max 15 words)",
      "description": "3-4 bullets max, each 1-2 lines. EVERY bullet must cite a specific answer using 'Based on your answer about...' or 'You mentioned...'",
      "founder_market_fit_score": 60-95 (calculated based on alignment between their answers and archetype patterns)
    },
    "cognitive_profile": {
      "dominant_function": "1 line, specific cognitive function + evidence citation. Example: 'Rapid pattern synthesis — You mentioned obsessing over blockchain IP rights at 2am, showing deep domain immersion'",
      "auxiliary_function": "1 line, supporting function + evidence citation",
      "decision_making": "2-3 bullets: how they decide + why + evidence from specific answer",
      "stress_response": "2 bullets: pattern + trigger + evidence from specific answer",
      "flow_triggers": ["5-7 specific activities, each citing an answer. Example: 'Solving complex technical problems — You mentioned losing track of time debugging smart contracts'"]
    },
    "the_edge": {
      "superpowers": [
        {
          "name": "Specific power name, not generic (e.g., 'Regulatory Arbitrage Radar' not 'Good at seeing opportunities')",
          "description": "2-3 lines: what it is + product impact",
          "evidence": "REQUIRED: Based on your answer about X, you specifically said Y...",
          "unfair_advantage": "Why this creates defensibility in their specific market"
        }
      ],
      "pattern_recognition": "What patterns they see + evidence from answers. Example: 'You notice regulatory gaps before competitors — You mentioned spotting compliance arbitrage in three previous roles'"
    },
    "the_shadow": {
      "cognitive_biases": [
        {
          "bias": "Specific name (e.g., 'Authority Deferral', not 'Being too nice')",
          "manifestation": "How it shows up in product decisions",
          "trigger": "Specific situation that activates it",
          "mitigation": "Concrete action they can take today"
        }
      ],
      "failure_patterns": ["3 specific ways, each with evidence citation. Example: 'Over-scoping MVPs — You mentioned rebuilding your app 4 times before launch'"],
      "blind_spots": ["3 things, each with evidence citation"],
      "energy_drains": ["4 activities, each with evidence citation. Example: 'Back-to-back meetings — You said you need 4-hour blocks to do deep work'"]
    },
    "venture_fit": {
      "sweet_spot": {
        "type": "Specific product/company type (not 'B2B SaaS' — be specific: 'API-first infrastructure for regulated industries')",
        "description": "2-3 bullets why + evidence from answers",
        "examples": ["3 specific company/product examples they could build"]
      },
      "danger_zone": {
        "type": "Specific type to avoid (e.g., 'High-touch services with long sales cycles')",
        "description": "2-3 bullets why + evidence from answers",
        "warning_signs": ["3 early indicators they're in the wrong space"]
      },
      "cofounder_profile": "Complementary profile + evidence-based reasoning. Example: 'You need a cofounder who handles enterprise sales — Your answers show you prefer building over selling, and you mentioned dreading demo days'",
      "optimal_stage": "Stage + why based on answers. Example: 'Seed-stage — You mentioned you work best with clear constraints but need some resources, and you have 2 years runway'",
      "team_size_ideal": "Range + rationale from answers. Example: '3-8 people — You said you need quiet for deep work but also mentioned getting energized by collaborative problem-solving'"
    },
    "playbook": {
      "decision_framework": [
        {
          "step": 1,
          "title": "Action verb + noun (5 words max). Example: 'Validate Assumptions Fast'",
          "description": "1-2 lines what to do",
          "action": "Specific CTA. Example: 'Run 5 customer interviews this week'",
          "because_you_said": "REQUIRED citation: Based on your answer about X..."
        }
      ],
      "gtm_strategy": ["3 cards with same structure as decision_framework"],
      "first_hire": ["3 cards with same structure"],
      "funding": ["3 cards with same structure"],
      "wellness": ["3 cards with same structure"],
      "burnout_signals": ["4 specific signals + evidence. Example: 'Skipping meals — You mentioned forgetting to eat when coding'"],
      "recovery_protocol": "Actionable steps + evidence. Example: '48-hour digital detox — You said you recharge best in nature without phone'"
    },
    "relationship_dynamics": {
      "as_cofounder": "2-3 bullets + evidence citation. Example: 'You challenge assumptions directly — You mentioned preferring honest feedback even when uncomfortable'",
      "as_leader": "2-3 bullets + evidence citation",
      "communication_style": "1-2 lines + evidence. Example: 'Direct and async-first — You mentioned hating status meetings and preferring detailed writeups'",
      "conflict_response": "1-2 lines + evidence"
    },
    "your_edge": {
      "headline": "Specific advantage (e.g., 'Rapid Validation Machine', 'Regulatory Navigation System')",
      "bullets": ["3-5 specific strengths with evidence. Example: 'You validate ideas in days not months — You mentioned launching 3 MVPs in 6 months'"],
      "because_you_said": "Summary citation linking to key answers. REQUIRED."
    },
    "your_play_style": {
      "headline": "Operating mode (e.g., 'Sprint-Rest Cycles', 'Deep-Dive Explorer')",
      "bullets": ["3-5 patterns with evidence"],
      "because_you_said": "Summary citation. REQUIRED."
    },
    "your_watchouts": {
      "headline": "Risk pattern (e.g., 'Perfectionism Paralysis', 'Scope Creep Addiction')",
      "bullets": ["2-4 risks with evidence"],
      "because_you_said": "Summary citation. REQUIRED."
    }
  }
}
\`\`\`

---

## COHERENCE CHECK — PERFORM BEFORE OUTPUTTING

Verify internal consistency:
1. If you say "high independence" in one section, don't say "needs heavy collaboration" elsewhere unless you explain the tradeoff
2. All scores and assessments must align with the evidence cited
3. If there's ambiguity in answers, state it explicitly rather than assuming
4. Ensure archetype name aligns with the dominant patterns in their answers
5. Verify superpowers connect to specific examples they provided

---

## FINAL INSTRUCTIONS

1. Analyze the founder's answers carefully — every insight must trace back to something they actually said
2. Write as a product strategist, not a therapist — focus on what they should build and how they should operate
3. Optimize for UI display: short titles, bullet points, evidence citations
4. Avoid generic startup advice — be specific to their patterns
5. All playbook arrays MUST have EXACTLY 3 items
6. Output ONLY valid JSON — no markdown, no explanations, no preamble

Generate the DNA profile now.`;
};

const generateRepairPrompt = (
  originalResponse: string,
  validationErrors: string,
  answers: Record<string, any>
): string => {
  const evidenceReferences = Object.entries(answers)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      const displayValue = Array.isArray(value) ? value.join(", ") : String(value);
      return `- ${key}: "${displayValue.substring(0, 100)}${displayValue.length > 100 ? '...' : ''}"`;
    })
    .join("\n");

  return `You are a senior product strategist at VentureGates. Fix these validation errors in the DNA profile JSON:

VALIDATION ERRORS:
${validationErrors}

ORIGINAL RESPONSE:
${originalResponse}

FOUNDER'S ANSWERS (USE AS EVIDENCE):
${evidenceReferences}

REPAIR INSTRUCTIONS:
1. Fix ALL validation errors (length requirements, array counts, missing fields)
2. Ensure ALL playbook arrays have EXACTLY 3 items
3. Ensure ALL "because_you_said" and "evidence" fields cite SPECIFIC answers (not generic filler)
4. Maintain product-focused, actionable tone — no therapy language
5. Keep UI-optimized format: short titles, bullet points
6. Output ONLY valid JSON — no markdown, no explanations

FORBIDDEN (will be rejected):
- "As a founder..."
- "You may find..."
- "It's possible that..."
- Generic citations like "Based on your answers"

REQUIRED:
- Direct, specific language
- Evidence citations referencing actual answers
- Actionable implications

Return the complete corrected JSON.`;
};

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let structureChaos = 5, riskSecurity = 5, individualTribal = 5;
  let answers: Record<string, any> = {};
  
  try {
    const body = await request.json();
    answers = body.answers || {};

    if (!answers || Object.keys(answers).length === 0) {
      return NextResponse.json({ error: "Missing answers" }, { status: 400 });
    }

    const profileText = Object.entries(answers)
      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : String(value)}`)
      .join("\n");

    structureChaos = parseInt(answers.structure_chaos) || 5;
    riskSecurity = parseInt(answers.risk_security) || 5;
    individualTribal = parseInt(answers.individual_tribal) || 5;

    const prompt = generateDNAPrompt(profileText, structureChaos, riskSecurity, individualTribal, answers);
    
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
      console.error("OpenAI error:", await response.text());
      return NextResponse.json(getSmartFallbackDNA(answers, structureChaos, riskSecurity, individualTribal));
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    if (!content) throw new Error("Empty response");

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? jsonMatch[0] : content;
    const result = JSON.parse(jsonText);

    // Validate with Zod
    const validation = DNASchema.safeParse(result);
    if (validation.success) {
      console.log(`DNA generated in ${Date.now() - startTime}ms`);
      return NextResponse.json(validation.data);
    }

    // Retry with repair prompt
    console.log("Validation failed, attempting repair...");
    const errorString = validation.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join('\n');
    
    const repairController = new AbortController();
    const repairTimeout = setTimeout(() => repairController.abort(), 45000);

    const repairResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: generateRepairPrompt(jsonText, errorString, answers) }],
        temperature: 0.7,
        max_tokens: 4000,
      }),
      signal: repairController.signal,
    });

    clearTimeout(repairTimeout);

    if (!repairResponse.ok) throw new Error("Repair failed");

    const repairData = await repairResponse.json();
    const repairContent = repairData.choices[0]?.message?.content;
    if (!repairContent) throw new Error("Empty repair response");

    const repairJsonMatch = repairContent.match(/\{[\s\S]*\}/);
    const repairJson = repairJsonMatch ? repairJsonMatch[0] : repairContent;
    const repairResult = JSON.parse(repairJson);

    const repairValidation = DNASchema.safeParse(repairResult);
    if (repairValidation.success) {
      console.log(`DNA repaired in ${Date.now() - startTime}ms`);
      return NextResponse.json(repairValidation.data);
    }

    throw new Error("Repair validation failed");

  } catch (error) {
    console.error(`Generation failed:`, error);
    return NextResponse.json(getSmartFallbackDNA(answers, structureChaos, riskSecurity, individualTribal));
  }
}

function getSmartFallbackDNA(
  answers: Record<string, any>, 
  structure: number, 
  risk: number, 
  tribal: number
): DNAOutput {
  const stressResponse = String(answers.stress_response || answers.stress_management || '');
  const decisionStyle = String(answers.decision_style || answers.decision_making || '');

  const archetypes = [
    { name: "The Visionary Architect", tagline: "You build bold visions with systematic precision." },
    { name: "The Pragmatic Builder", tagline: "You create reliable systems that stand the test of time." },
    { name: "The Chaos Pilot", tagline: "You thrive in uncertainty and navigate turbulence with instinct." },
    { name: "The Agile Experimenter", tagline: "You test ideas rapidly, learning through constant iteration." },
    { name: "The Tribal Leader", tagline: "You build movements by bringing people together." },
    { name: "The Solo Strategist", tagline: "Your best work happens in deep focus, away from the crowd." },
  ];

  let archetype = archetypes[0];
  if (structure >= 7 && risk >= 7) archetype = archetypes[0];
  else if (structure >= 7 && risk <= 3) archetype = archetypes[1];
  else if (structure <= 3 && risk >= 7) archetype = archetypes[2];
  else if (structure <= 3 && risk <= 3) archetype = archetypes[3];
  else if (tribal >= 7) archetype = archetypes[4];
  else if (tribal <= 3) archetype = archetypes[5];

  const buildEvidence = (key: string, fallback: string): string => {
    const val = answers[key];
    if (val) {
      const display = Array.isArray(val) ? val.join(", ") : String(val);
      return `Because you mentioned ${display.substring(0, 50)}${display.length > 50 ? '...' : ''}`;
    }
    return fallback;
  };

  return {
    founder_dna: {
      archetype: {
        name: archetype.name,
        tagline: archetype.tagline,
        description: `Your founder DNA emerges from ${structure}/10 structure preference, ${risk}/10 risk appetite, and ${tribal}/10 collaboration orientation. You excel at ${structure > 5 ? 'building scalable systems' : 'navigating ambiguity'} while ${tribal > 5 ? 'energizing teams' : 'maintaining focused execution'}.`,
        founder_market_fit_score: Math.min(95, Math.max(60, 75 + Math.abs(structure - 5) + Math.abs(risk - 5))),
      },
      cognitive_profile: {
        dominant_function: structure > 5 ? "Systematic deconstruction of complex problems" : "Intuitive pattern-matching",
        auxiliary_function: risk > 5 ? "Rapid opportunity assessment" : "Risk-calibrated evaluation",
        decision_making: decisionStyle 
          ? `You process decisions by ${decisionStyle.toLowerCase().includes('gut') ? 'balancing intuition with data' : 'gathering information then trusting your analysis'}.`
          : `You approach decisions ${structure > 5 ? 'systematically' : 'intuitively'}, ${risk > 5 ? 'moving quickly when confident' : 'weighing options carefully'}.`,
        stress_response: stressResponse 
          ? `When overwhelmed, you ${stressResponse.toLowerCase().includes('overthink') ? 'enter analysis mode' : stressResponse.toLowerCase().includes('avoid') ? 'withdraw to process' : 'focus intensely on resolution'}. Recovery comes through ${tribal > 5 ? 'team connection' : 'solitary reflection'}.`
          : `Under stress, you ${structure > 5 ? 'seek to impose order' : 'look for quick wins'}. Recovery comes through ${tribal > 5 ? 'reconnecting with others' : 'time alone'}.`,
        flow_triggers: [
          structure > 5 ? "Building systems with clear metrics" : "Exploring undefined possibilities",
          tribal > 5 ? "Collaborative problem-solving" : "Extended uninterrupted focus",
          "Making progress on challenging goals",
          "Solving meaningful problems",
          risk > 5 ? "Operating with stakes on the line" : "Working within understood parameters",
        ],
      },
      the_edge: {
        superpowers: [
          {
            name: structure > 5 ? "System Architecture Vision" : "Rapid Adaptation Engine",
            description: structure > 5 
              ? "You naturally see how pieces fit together, building frameworks others can execute within."
              : "You pivot fluidly when circumstances shift, finding new paths while others process the change.",
            evidence: buildEvidence('structure_chaos', `Based on your ${structure > 5 ? 'structured' : 'flexible'} preference`),
            unfair_advantage: structure > 5 ? "Systems scale while others reinvent." : "Speed compounds in fast markets.",
          },
          {
            name: tribal > 5 ? "Collaborative Force Multiplier" : "Deep Work Specialist",
            description: tribal > 5
              ? "You elevate team performance through your presence. Others do their best work with you."
              : "You achieve flow states producing exceptional output through sustained focus.",
            evidence: buildEvidence('individual_tribal', `Based on your ${tribal > 5 ? 'collaborative' : 'independent'} nature`),
            unfair_advantage: tribal > 5 ? "Talent attraction is easier." : "Quality density is higher.",
          },
        ],
        pattern_recognition: `You notice ${structure > 5 ? 'structural patterns' : 'behavioral signals'} others miss, giving you predictive insight.`,
      },
      the_shadow: {
        cognitive_biases: [
          {
            bias: structure > 5 ? "Perfectionism Paralysis" : "Premature Action Bias",
            manifestation: structure > 5 ? "Delaying launches until 'ready', missing windows" : "Moving before validation, creating rework",
            trigger: structure > 5 ? "Quality threshold not met" : "Momentum slowing or competitors moving",
            mitigation: structure > 5 ? "Ship at 80%. Set public deadlines." : "48-hour rule for irreversible decisions.",
          },
          {
            bias: stressResponse.toLowerCase().includes('overthink') ? "Analysis Spiral" : "Confirmation Tunnel",
            manifestation: "Revisiting decisions or seeking confirming data",
            trigger: "High-stakes decisions with incomplete info",
            mitigation: "Set deadlines. Seek one dissenting opinion.",
          },
        ],
        failure_patterns: [
          structure > 5 ? "Over-engineering simple problems" : "Under-scoping complex challenges",
          risk > 5 ? "Asymmetric risks not paying off" : "Missing windows due to caution",
          tribal > 5 ? "Prioritizing harmony over necessary conflict" : "Deciding in isolation",
        ],
        blind_spots: [
          structure > 5 ? "Emotional undertones in teams" : "Long-term consequences of pivots",
          tribal > 5 ? "Need for solitary processing" : "Impact of independence on others",
        ],
        energy_drains: [
          structure > 5 ? "Repetitive explanations" : "Rigid processes blocking experimentation",
          tribal > 5 ? "Extended solo work" : "Constant interruptions",
          "Status meetings without decisions",
          "Ambiguous success criteria",
        ],
      },
      venture_fit: {
        sweet_spot: {
          type: structure > 5 ? "B2B SaaS with clear metrics" : "Consumer apps with rapid iteration",
          description: structure > 5 
            ? "Your systematic nature excels with clear KPIs and structured sales."
            : "Your adaptability shines in fast-moving consumer markets.",
          examples: [
            structure > 5 ? "Enterprise workflow automation" : "Consumer social platform",
            structure > 5 ? "B2B marketplace" : "Creator economy tool", 
            structure > 5 ? "Developer tools" : "D2C brand",
          ],
        },
        danger_zone: {
          type: structure > 5 ? "Early-stage consumer social" : "Heavily regulated enterprise",
          description: structure > 5 ? "Ambiguity and emotional buyers drain you." : "Slow pace and compliance frustrate you.",
          warning_signs: ["Unclear success metrics", "6+ month sales cycles", structure > 5 ? "Gut-feel buyers" : "Heavy regulations"],
        },
        cofounder_profile: tribal > 5 
          ? "Technical expert who values collaboration and complements your style."
          : "Business partner who handles relationships while you build product.",
        optimal_stage: risk > 5 ? "Pre-seed to Seed" : "Seed to Series A",
        team_size_ideal: tribal > 5 ? "5-15 people" : "3-10 people",
      },
      playbook: {
        decision_framework: [
          { step: 1, title: "Evidence Check", description: "Separate what you know from assumptions.", action: "Write facts vs. assumptions", because_you_said: buildEvidence('decision_style', 'Based on your decision approach') },
          { step: 2, title: structure > 5 ? "24-Hour Rule" : "Speed Check", description: structure > 5 ? "Sleep on major decisions." : "List reasons you might be wrong.", action: structure > 5 ? "Wait 24 hours" : "Write counter-arguments", because_you_said: buildEvidence('structure_chaos', 'Based on your style') },
          { step: 3, title: "Commitment Test", description: "Rate enthusiasm 1-10. Below 7 is a no.", action: "Score your excitement", because_you_said: "Ensure alignment with priorities" },
        ],
        gtm_strategy: [
          { step: 1, title: risk > 5 ? "Fast Validation" : "Trust Building", description: risk > 5 ? "Launch smoke tests quickly." : "Build credibility with content.", action: risk > 5 ? "Launch landing page" : "Publish thought leadership", because_you_said: buildEvidence('risk_security', `Your ${risk > 5 ? 'risk tolerance' : 'caution'}`) },
          { step: 2, title: "First 100", description: "Find 100 people who need this.", action: "Run user interviews", because_you_said: "Early validation matters" },
          { step: 3, title: "Referral Loop", description: "Build sharing into the product.", action: "Add viral mechanics", because_you_said: "Sustainable growth" },
        ],
        first_hire: [
          { step: 1, title: "Gap Analysis", description: "Hire for your biggest weakness.", action: "Score yourself", because_you_said: buildEvidence('individual_tribal', 'Your team style') },
          { step: 2, title: tribal > 5 ? "Culture Carrier" : "Autonomous Executor", description: tribal > 5 ? "Someone who amplifies team energy." : "Someone who owns outcomes independently.", action: tribal > 5 ? "Assess culture fit" : "Test execution", because_you_said: buildEvidence('individual_tribal', 'Your orientation') },
          { step: 3, title: "90-Day Sprint", description: "Define clear outcomes.", action: "Set OKRs together", because_you_said: "Clear expectations" },
        ],
        funding: [
          { step: 1, title: risk > 5 ? "Vision First" : "Traction Lead", description: risk > 5 ? "Emphasize opportunity and vision." : "Lead with metrics and proof.", action: risk > 5 ? "Craft vision deck" : "Build metrics dashboard", because_you_said: buildEvidence('risk_security', 'Your approach') },
          { step: 2, title: "Target List", description: "Find investors who match your style.", action: "Research 20 ideal investors", because_you_said: "Alignment matters" },
          { step: 3, title: "Warm Intro", description: "Get introductions through your network.", action: "Map your network", because_you_said: "Warm paths work best" },
        ],
        wellness: [
          { step: 1, title: "Signal Monitoring", description: "Watch for early burnout signs.", action: "Weekly self-check", because_you_said: buildEvidence('stress_response', 'Your stress patterns') },
          { step: 2, title: "Recovery Ritual", description: tribal > 5 ? "Connect with your team." : "Schedule unstructured alone time.", action: "Block recovery time", because_you_said: buildEvidence('individual_tribal', 'Your recharge style') },
          { step: 3, title: "Boundary Setting", description: "Protect your energy drains.", action: "Audit your calendar", because_you_said: "Energy management" },
        ],
        burnout_signals: ["Irritability with small issues", "Avoiding decisions", "Sleep disruption", "Loss of excitement"],
        recovery_protocol: tribal > 5 ? "24 hours with trusted collaborators, no work talk." : "48 hours completely offline, solo.",
      },
      relationship_dynamics: {
        as_cofounder: tribal > 5 
          ? "Collaborative and communicative, sometimes seeking too much consensus."
          : "Independent and focused, sometimes seeming distant.",
        as_leader: structure > 5 
          ? "You set clear expectations and hold people accountable."
          : "You lead by example and adapt to each person.",
        communication_style: risk > 5 ? "Direct and decisive" : "Thoughtful and measured",
        conflict_response: tribal > 5 ? "Seeking compromise" : "Withdrawing to process",
      },
      your_edge: {
        headline: structure > 5 ? "Systems Architect" : "Rapid Adapter",
        bullets: [
          structure > 5 ? "You naturally create order from complexity" : "You pivot faster than competitors",
          tribal > 5 ? "Teams perform better when you're involved" : "You produce exceptional work in deep focus",
          "You spot patterns others miss early",
          risk > 5 ? "You act decisively when opportunity strikes" : "You avoid costly mistakes through caution",
        ],
        because_you_said: buildEvidence('structure_chaos', `Your ${structure > 5 ? 'systematic' : 'adaptive'} approach`),
      },
      your_play_style: {
        headline: risk > 5 ? "Bold Strategist" : "Careful Optimizer",
        bullets: [
          structure > 5 ? "You prefer defined processes" : "You thrive in ambiguity",
          tribal > 5 ? "Collaboration energizes you" : "Solo work is your superpower",
          decisionStyle.toLowerCase().includes('fast') ? "You decide quickly with partial data" : "You gather information before committing",
          "You maintain focus on high-impact work",
        ],
        because_you_said: buildEvidence('decision_style', 'Your decision approach'),
      },
      your_watchouts: {
        headline: stressResponse.toLowerCase().includes('overthink') ? "Analysis Paralysis" : structure > 5 ? "Perfectionism Trap" : "Impulse Risk",
        bullets: [
          stressResponse.toLowerCase().includes('overthink') ? "Over-analyzing delays decisions" : structure > 5 ? "Perfectionism blocks shipping" : "Moving too fast skips validation",
          tribal > 5 ? "Over-committing to team harmony" : "Isolation during critical decisions",
          risk > 5 ? "Underestimating downside scenarios" : "Missing windows due to hesitation",
        ],
        because_you_said: buildEvidence('stress_response', 'Your stress response patterns'),
      },
    },
  };
}
