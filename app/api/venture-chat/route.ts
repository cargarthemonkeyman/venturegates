import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, context } = body;

    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const prompt = `You are a Venture Coach helping a founder refine their venture ideas.

Founder Profile:
- Type: ${context?.dna?.entrepreneur_type || "Unknown"}
- Current Ventures: ${context?.ventures?.map((v: any) => v.name).join(", ") || "None"}

User Request: ${message}

Provide a helpful, encouraging response that:
1. Acknowledges their request
2. Gives specific actionable advice
3. Asks a follow-up question to continue the conversation

Keep it concise (2-4 sentences max).`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error("OpenAI API error");
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "I'm here to help you refine your ventures. What would you like to explore?";

    return NextResponse.json({ response: content });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { response: "I'm having trouble connecting right now. Try asking about making your ventures more ambitious, focusing on a specific industry, or exploring different risk levels!" },
      { status: 200 }
    );
  }
}
