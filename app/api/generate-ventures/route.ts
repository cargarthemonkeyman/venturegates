import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';
export const maxDuration = 45;

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

const generateVenturePrompt = (template: any, dna: any, answers: any, index: number) => `Create VENTURE #${index + 1} for this founder.

TEMPLATE:
- Name: ${template.name}
- Category: ${template.category}
- Problem: ${template.problemFocus}
- Solution Angle: ${template.solutionAngle}

FOUNDER DNA:
- Archetype: ${dna.archetype?.name || 'Founder'}
- Superpowers: ${dna.the_edge?.superpowers?.map((s: any) => s.name).join(', ') || 'Pattern recognition'}
- Sweet Spot: ${dna.venture_fit?.sweet_spot?.type || 'B2C SaaS'}
- Decision Style: ${dna.cognitive_profile?.decision_making || 'Intuitive'}

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

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let ventureIndex = 0;
  
  try {
    const body = await request.json();
    const { answers, venture_dna, ventureIndex: idx = 0 } = body;
    ventureIndex = idx;

    if (!answers || !venture_dna) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    const dna = venture_dna.founder_dna || venture_dna.venture_dna || venture_dna;
    const archetypeKey = (answers.archetype || 'default').toLowerCase();
    const templates = ventureTemplates[archetypeKey] || ventureTemplates.default;
    const template = templates[ventureIndex % templates.length];

    const prompt = generateVenturePrompt(template, dna, answers, ventureIndex);

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
    
    // Return fallback instead of error
    const fallbacks = [
      {
        id: "v1",
        name: "AI Workflow Orchestrator",
        tagline: "Connect your tools. Automate your work. Reclaim your time.",
        category: "Automation",
        description: "An intelligent automation platform that learns your work patterns and proactively suggests optimizations. Unlike Zapier which requires manual configuration, our AI observes how you work and offers one-click automation.",
        problem: "Knowledge workers waste 40% of their time on context switching between apps.",
        solution: "An AI layer that observes work patterns for 7-14 days, then proactively suggests automations.",
        market_size: "$45B automation market, 23% CAGR",
        business_model: "Freemium: Free for 3 automations, $29/mo unlimited, $79/mo teams",
        go_to_market: "Product Hunt launch, Twitter/indie hacker community, Notion/Slack influencer partnerships",
        why_fits: "Leverages pattern recognition strengths. Rapid iteration nature suits quick pivots.",
        risk_factors: [
          "Integration complexity - Mitigation: Start with top 10 tools",
          "AI accuracy - Mitigation: Conservative suggestion algorithm",
          "Incumbent response - Mitigation: Speed to market, niche focus"
        ],
        dna_match_score: 88,
        difficulty: "Medium",
        time_to_revenue: "4-6 weeks",
        capital_required: "$3,000-$5,000",
        execution_plan: [
          { week: 1, focus: "Validation", tasks: ["Build landing page", "Run smoke test ads"], success_metric: "100 email signups" },
          { week: 2, focus: "MVP", tasks: ["Build core integration", "Onboard 5 beta users"], success_metric: "3 active automations" },
          { week: 3, focus: "Launch", tasks: ["Product Hunt launch", "Twitter thread campaign"], success_metric: "500 signups, 50 conversions" },
          { week: 4, focus: "Iterate", tasks: ["Analyze usage patterns", "Add top-requested integration"], success_metric: "20% week-over-week growth" }
        ],
        unit_economics: { pricing: "$29/month", cac_estimate: "$45", ltv_estimate: "$520", payback_period: "2 months" },
        testing_strategy: { method: "SMOKE_TEST", description: "Landing page + ads to validate demand", budget: "$200", timeline: "48 hours", success_criteria: "15% email CTR, 50+ signups" }
      },
      {
        id: "v2",
        name: "Community Intelligence Layer",
        tagline: "Your community's knowledge, automatically organized",
        category: "Community",
        description: "An AI layer that captures, organizes and surfaces insights from Discord and Slack communities. Automatically answers repeated questions and surfaces valuable past discussions.",
        problem: "Discord/Slack communities lose 90% of valuable knowledge. Same questions asked daily.",
        solution: "AI that ingests community history, auto-answers questions, and surfaces relevant past discussions.",
        market_size: "$12B community management software",
        business_model: "$0.10 per member/month, $99/mo for analytics dashboard",
        go_to_market: "Partner with community managers, launch on Discord/Slack app directories",
        why_fits: "Matches tribal orientation. Community building plays to collaboration strengths.",
        risk_factors: [
          "Platform risk - Mitigation: Multi-platform support",
          "Privacy concerns - Mitigation: Opt-in only, data controls",
          "Accuracy issues - Mitigation: Community feedback loop"
        ],
        dna_match_score: 85,
        difficulty: "Medium",
        time_to_revenue: "3-5 weeks",
        capital_required: "$2,500-$4,000",
        execution_plan: [
          { week: 1, focus: "Pilot", tasks: ["Build Discord bot", "Recruit 3 pilot communities"], success_metric: "3 active pilots" },
          { week: 2, focus: "Refine", tasks: ["Improve answer accuracy", "Add Slack support"], success_metric: "70% answer relevance" },
          { week: 3, focus: "Launch", tasks: ["Discord app directory listing", "Case studies"], success_metric: "10 paying communities" },
          { week: 4, focus: "Scale", tasks: ["Onboarding flow", "Pricing optimization"], success_metric: "$500 MRR" }
        ],
        unit_economics: { pricing: "$0.10/member/month", cac_estimate: "$30", ltv_estimate: "$360", payback_period: "1 month" },
        testing_strategy: { method: "CONCIERGE", description: "Manual community support for 3 communities", budget: "$0", timeline: "1 week", success_criteria: "Community managers request automation" }
      },
      {
        id: "v3",
        name: "Micro-SaaS Builder Kit",
        tagline: "Launch your micro-SaaS in days, not months",
        category: "Developer Tools",
        description: "Pre-built infrastructure and AI code generation for rapid micro-SaaS deployment. Authentication, billing, admin panels included.",
        problem: "Developers spend 80% of time on boilerplate instead of core product.",
        solution: "Complete starter kit with auth, payments, admin, AI-assisted code generation.",
        market_size: "$89B low-code/no-code platform market",
        business_model: "$199 one-time license, $49/mo for updates and cloud hosting",
        go_to_market: "Indie Hackers, Reddit r/SaaS, Twitter dev community",
        why_fits: "Leverages technical skills. Solo-founder friendly. Quick to revenue.",
        risk_factors: [
          "Template quality - Mitigation: Battle-tested components",
          "Support burden - Mitigation: Community Discord, documentation",
          "Market saturation - Mitigation: Unique AI features"
        ],
        dna_match_score: 82,
        difficulty: "Medium",
        time_to_revenue: "2-4 weeks",
        capital_required: "$1,000-$3,000",
        execution_plan: [
          { week: 1, focus: "Build", tasks: ["Create boilerplate", "Add AI codegen"], success_metric: "Working demo" },
          { week: 2, focus: "Validate", tasks: ["Twitter announcement", "5 beta testers"], success_metric: "3 paid pre-orders" },
          { week: 3, focus: "Launch", tasks: ["Product Hunt", "Indie Hackers post"], success_metric: "$1,000 sales" },
          { week: 4, focus: "Iterate", tasks: ["Add requested features", "Improve docs"], success_metric: "$2,000 total sales" }
        ],
        unit_economics: { pricing: "$199", cac_estimate: "$25", ltv_estimate: "$298", payback_period: "Immediate" },
        testing_strategy: { method: "FAKE_DOOR", description: "Landing page with 'Buy Now' → waitlist", budget: "$150", timeline: "72 hours", success_criteria: "5% CTR to pricing, 20+ waitlist" }
      }
    ];
    
    return NextResponse.json(fallbacks[ventureIndex % fallbacks.length]);
  }
}
