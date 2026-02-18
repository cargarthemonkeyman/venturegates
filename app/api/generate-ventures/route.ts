import { NextRequest, NextResponse } from "next/server";

export const runtime = 'nodejs';
export const maxDuration = 60;

// Venture templates by archetype for faster generation
const ventureTemplates: Record<string, Array<{
  name: string;
  category: string;
  problemFocus: string;
  solutionAngle: string;
}>> = {
  "visionary": [
    { name: "AI Workflow Orchestrator", category: "Automation", problemFocus: "Tool fragmentation wastes 40% of knowledge worker time", solutionAngle: "AI that learns work patterns and automates without configuration" },
    { name: "Community Intelligence Layer", category: "Community", problemFocus: "Discord/Slack communities lose 90% of valuable knowledge", solutionAngle: "AI that captures, organizes and surfaces community insights automatically" },
    { name: "Micro-SaaS Builder Kit", category: "Developer Tools", problemFocus: "Developers want passive income but building takes months", solutionAngle: "Pre-built infrastructure + AI codegen for rapid micro-saas deployment" }
  ],
  "builder": [
    { name: "No-Code Backend Platform", category: "Infrastructure", problemFocus: "Frontend developers stuck when they need backend", solutionAngle: "Visual backend builder with automatic API generation" },
    { name: "Component Marketplace 2.0", category: "Developer Tools", problemFocus: "Developers rebuild the same components repeatedly", solutionAngle: "Smart component platform with customization AI" },
    { name: "DevOps Automation Layer", category: "Infrastructure", problemFocus: "Small teams can't afford DevOps expertise", solutionAngle: "Automated infrastructure management for non-experts" }
  ],
  "analyst": [
    { name: "Data Narrative Platform", category: "Analytics", problemFocus: "Dashboards don't tell stories that drive action", solutionAngle: "AI that transforms raw data into narrative insights" },
    { name: "Market Intelligence SaaS", category: "Analytics", problemFocus: "Startups lack competitive intelligence resources", solutionAngle: "Automated market monitoring and analysis for SMBs" },
    { name: "Financial Forecasting AI", category: "Fintech", problemFocus: "Small businesses can't afford CFO-level forecasting", solutionAngle: "AI-powered financial modeling for early-stage companies" }
  ],
  "default": [
    { name: "AI-Powered Automation Suite", category: "Productivity", problemFocus: "Knowledge workers waste hours on repetitive tasks", solutionAngle: "Intelligent automation that learns and adapts" },
    { name: "Community-Driven Marketplace", category: "Marketplace", problemFocus: "Trust is broken in peer-to-peer commerce", solutionAngle: "Reputation and community-verified transactions" },
    { name: "Smart Documentation System", category: "Knowledge Management", problemFocus: "Documentation is always outdated", solutionAngle: "Self-updating documentation from actual work" }
  ]
};

const generateVenturePrompt = (template: any, dna: any, answers: any, index: number) => {
  const structure = parseInt(answers?.structure_chaos) || 5;
  const risk = parseInt(answers?.risk_security) || 5;
  const tribal = parseInt(answers?.individual_tribal) || 5;
  const archetype = dna?.archetype?.name || 'Founder';
  const superpowers = dna?.the_edge?.superpowers || [];
  const sweetSpot = dna?.venture_fit?.sweet_spot?.type || 'B2C SaaS';
  
  return `Create VENTURE #${index + 1} specifically tailored for this founder's unique DNA.

FOUNDER PROFILE (CRITICAL - USE THIS):
- Archetype: ${archetype}
- Structure Preference: ${structure}/10 (${structure >= 7 ? 'Highly structured' : structure <= 3 ? 'Highly flexible' : 'Balanced'})
- Risk Tolerance: ${risk}/10 (${risk >= 7 ? 'High risk appetite' : risk <= 3 ? 'Risk averse' : 'Moderate'})
- Collaboration Style: ${tribal}/10 (${tribal >= 7 ? 'Team-oriented' : tribal <= 3 ? 'Solo worker' : 'Flexible'})
- Superpowers: ${superpowers.map((s: any) => s.name).join(', ') || 'Pattern recognition, rapid learning'}
- Sweet Spot: ${sweetSpot}

TEMPLATE (Customize heavily based on founder profile):
- Name: ${template.name}
- Category: ${template.category}
- Problem Focus: ${template.problemFocus}
- Solution Angle: ${template.solutionAngle}

INSTRUCTIONS:
1. The venture MUST align with the founder's ${archetype} archetype
2. Reference their specific superpowers: ${superpowers.map((s: any) => s.name).join(', ')}
3. Adapt difficulty based on risk tolerance (${risk}/10)
4. Consider collaboration preference (${tribal}/10) for team requirements
5. Make it feel personalized, not generic

Create detailed JSON:
{
  "id": "v${index + 1}",
  "name": "${template.name}",
  "tagline": "Compelling one-liner with clear benefit",
  "category": "${template.category}",
  "description": "2-3 detailed paragraphs",
  "problem": "Specific painful problem with who has it",
  "solution": "How it solves the problem",
  "market_size": "TAM/SAM/SOM breakdown",
  "business_model": "Pricing and revenue model",
  "go_to_market": "First 1000 customers strategy",
  "why_fits": "Why this matches the founder psychologically",
  "risk_factors": ["Risk 1 with mitigation", "Risk 2 with mitigation", "Risk 3 with mitigation"],
  "dna_match_score": ${75 + index * 5},
  "difficulty": "Medium",
  "time_to_revenue": "2-6 weeks",
  "capital_required": "$2,000-$5,000",
  "execution_plan": [
    {"week": 1, "focus": "Validation", "tasks": ["Specific task 1", "Specific task 2"], "success_metric": "Metric"},
    {"week": 2, "focus": "Build", "tasks": ["Specific task 1", "Specific task 2"], "success_metric": "Metric"},
    {"week": 3, "focus": "Launch", "tasks": ["Specific task 1", "Specific task 2"], "success_metric": "Metric"},
    {"week": 4, "focus": "Iterate", "tasks": ["Specific task 1", "Specific task 2"], "success_metric": "Metric"}
  ],
  "unit_economics": {
    "pricing": "$X/month",
    "cac_estimate": "$Y",
    "ltv_estimate": "$Z",
    "payback_period": "N months"
  },
  "testing_strategy": {
    "method": "SMOKE_TEST|CONCIERGE|FAKE_DOOR|WIZARD_OZ",
    "description": "Why this method",
    "budget": "$X",
    "timeline": "Y days",
    "success_criteria": "Specific metric"
  }
}

Rules:
- Use SPECIFIC numbers, dates, channels
- Reference founder's DNA in why_fits
- Output ONLY valid JSON`;
};

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let ventureIndex = 0;
  let answers: any = null;
  let venture_dna: any = null;
  
  try {
    const body = await request.json();
    answers = body.answers;
    venture_dna = body.venture_dna;
    ventureIndex = body.ventureIndex || 0;

    if (!answers || !venture_dna) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    const dna = venture_dna.founder_dna || venture_dna.venture_dna || venture_dna;
    const archetypeKey = (answers.archetype || 'default').toLowerCase();
    const templates = ventureTemplates[archetypeKey] || ventureTemplates.default;
    const template = templates[ventureIndex % templates.length];

    const prompt = generateVenturePrompt(template, dna, answers, ventureIndex);
    
    console.log(`[Venture API] Generating venture ${ventureIndex + 1} for archetype: ${dna?.archetype?.name}`);
    console.log(`[Venture API] Structure: ${answers?.structure_chaos}, Risk: ${answers?.risk_security}, Tribal: ${answers?.individual_tribal}`);

    // Single attempt with 40s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 40000);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.75,
        max_tokens: 2500,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Empty response");
    }

    // Extract JSON
    let jsonText = content;
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    const result = JSON.parse(jsonText);
    
    const duration = Date.now() - startTime;
    console.log(`Venture ${ventureIndex + 1} generated in ${duration}ms`);

    return NextResponse.json(result);

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`Venture generation failed after ${duration}ms:`, error);
    
    // Return dynamic fallback based on user's DNA
    // Note: venture_dna and answers may be undefined in catch block, use safe defaults
    const safeAnswers = answers || {};
    const safeDna = venture_dna || {};
    const dna = safeDna.founder_dna || safeDna;
    const structure = parseInt(safeAnswers.structure_chaos) || 5;
    const risk = parseInt(safeAnswers.risk_security) || 5;
    const tribal = parseInt(safeAnswers.individual_tribal) || 5;
    const technical = String(safeAnswers.technical || '').toLowerCase();
    const industries = safeAnswers.industries || [];
    
    // Generate personalized fallback
    const getPersonalizedFallback = () => {
      const archetypeName = dna?.archetype?.name || "Founder";
      const isTechnical = technical.includes('full_stack') || technical.includes('backend');
      const isStructured = structure >= 6;
      const isRisky = risk >= 6;
      const isCollaborative = tribal >= 6;
      
      // Select category based on profile
      let category = "Productivity";
      let name = "AI-Powered Workflow Optimizer";
      let tagline = "Automate the repetitive. Focus on what matters.";
      
      if (isTechnical && isStructured) {
        category = "Developer Tools";
        name = "Infrastructure Automation Platform";
        tagline = "Deploy faster with intelligent infrastructure management.";
      } else if (isCollaborative && !isStructured) {
        category = "Community";
        name = "Team Knowledge Hub";
        tagline = "Capture and share team insights automatically.";
      } else if (isRisky && !isStructured) {
        category = "Fintech";
        name = "Micro-Investment Aggregator";
        tagline = "Smart investing for the next generation.";
      } else if (industries.includes('health')) {
        category = "Health";
        name = "Personalized Wellness Coach";
        tagline = "AI-powered health optimization tailored to you.";
      }
      
      return {
        id: `v${ventureIndex + 1}`,
        name,
        tagline,
        category,
        description: `A ${category.toLowerCase()} venture that leverages your unique strengths as ${archetypeName}. This opportunity aligns with your ${structure >= 6 ? 'structured approach' : 'adaptable style'} and ${risk >= 6 ? 'high-risk tolerance' : 'careful planning'}.`,
        problem: `Founders like you struggle with ${isStructured ? 'inefficient processes' : 'rigid systems'} that don't match your working style.`,
        solution: `A personalized platform that adapts to your ${archetypeName} profile, helping you ${isCollaborative ? 'collaborate effectively' : 'work efficiently solo'}.`,
        market_size: "$15B+ addressable market",
        business_model: "Freemium SaaS: $0-$49/month tiers",
        go_to_market: "Product Hunt launch, niche community outreach, content marketing",
        why_fits: `Matches your ${archetypeName} profile. Aligns with ${isStructured ? 'systematic' : 'flexible'} approach and ${isRisky ? 'growth-oriented' : 'sustainable'} mindset.`,
        risk_factors: [
          "Market timing - Mitigation: Start with niche, expand gradually",
          "Competition - Mitigation: Differentiate through personalization",
          "Technical complexity - Mitigation: MVP first, iterate based on feedback"
        ],
        dna_match_score: 75 + Math.floor(Math.random() * 15),
        difficulty: isStructured ? "Medium" : "High",
        time_to_revenue: "3-6 weeks",
        capital_required: "$2,000-$5,000",
        execution_plan: [
          { week: 1, focus: "Validation", tasks: ["Build landing page", "Create waitlist"], success_metric: "50+ qualified signups" },
          { week: 2, focus: "MVP", tasks: ["Build core feature", "Onboard 5 beta users"], success_metric: "3 active users" },
          { week: 3, focus: "Launch", tasks: ["Product Hunt", "Community outreach"], success_metric: "200 signups, 20 paid" },
          { week: 4, focus: "Iterate", tasks: ["User interviews", "Feature improvements"], success_metric: "15% week-over-week growth" }
        ],
        unit_economics: { 
          pricing: "$29/month", 
          cac_estimate: "$40", 
          ltv_estimate: "$450", 
          payback_period: "2 months" 
        },
        testing_strategy: { 
          method: "SMOKE_TEST", 
          description: "Landing page validation with targeted ads", 
          budget: "$300", 
          timeline: "1 week", 
          success_criteria: "10%+ email CTR, 30+ qualified signups" 
        },
        // Ensure all required fields exist
        offer: "Complete platform access with personalized onboarding",
        why_now: "Market timing aligns with remote work trends and AI adoption",
        market_gap: "Current solutions don't adapt to individual founder profiles",
        competitors: [
          { 
            name: "Generic Competitor", 
            what_they_do: "One-size-fits-all solution",
            why_not_enough: "Doesn't account for founder personality differences"
          }
        ],
        founder_market_fit: `Your ${archetypeName} profile gives you unique insight into this problem. Your ${isStructured ? 'systematic approach' : 'adaptability'} is perfect for ${isRisky ? 'moving fast' : 'building sustainably'}.`,
        key_highlights: [
          `Designed specifically for ${archetypeName} founders`,
          `Aligns with your ${isStructured ? 'structured' : 'flexible'} working style`,
          `Leverages your ${isCollaborative ? 'collaboration' : 'deep work'} strengths`,
          `${isRisky ? 'High-growth potential' : 'Sustainable business model'}`
        ],
        gate_scores: {
          personal_gates: {
            skill_match: { score: isTechnical ? 4 : 3, reason: "Aligns with your technical background" },
            energy_alignment: { score: isCollaborative ? 4 : 3, reason: "Matches your work style" },
            experience_relevance: { score: 4, reason: "Builds on your founder experience" }
          },
          market_gates: {
            market_size: { score: 4, reason: "$15B+ addressable market" },
            timing: { score: 4, reason: "Favorable market conditions" }
          },
          product_gates: {
            technical_feasibility: { score: isTechnical ? 5 : 3, reason: isTechnical ? "Within your technical wheelhouse" : "May need technical cofounder" }
          },
          business_gates: {
            monetization_clarity: { score: 4, reason: "Clear SaaS revenue model" }
          }
        }
      };
    };
    
    return NextResponse.json(getPersonalizedFallback());
  }
}
