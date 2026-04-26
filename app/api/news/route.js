export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { category, query } = await request.json();

    const searchTerm = query
      ? `${query} AI tech news`
      : {
          All: "latest AI and tech news this week",
          "AI Models": "new AI model releases this week",
          "Big Tech": "Google Apple Microsoft Meta tech news this week",
          Startups: "AI startup funding news this week",
          Research: "AI research breakthroughs this week",
          Policy: "AI regulation policy news this week",
        }[category] || "latest AI tech news";

    const prompt = `
You are a tech news aggregator. Return exactly 8 recent news articles about: "${searchTerm}".

Return ONLY a valid JSON array. No markdown, no explanation.

Each object must have:
- title: string
- summary: string (2 sentences)
- detail: string (2-3 sentences)
- source: string
- category: string (AI Models, Big Tech, Startups, Research, Policy)
- time: string (e.g. "2h ago")

Return only the JSON array.
`;

    const apiKey = process.env.GROQ_API_KEY?.trim();

    console.log("GROQ KEY EXISTS:", !!apiKey);

    if (!apiKey) {
      return Response.json(
        { error: "Missing GROQ_API_KEY in environment variables" },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2048,
        }),
      }
    );

    const rawText = await response.text();

    if (!response.ok) {
      console.log("GROQ ERROR STATUS:", response.status);
      console.log("GROQ ERROR BODY:", rawText);

      return Response.json(
        {
          error: `Groq request failed (${response.status})`,
          details: rawText,
        },
        { status: 500 }
      );
    }

    const data = JSON.parse(rawText);
    const text = data?.choices?.[0]?.message?.content || "";

    const jsonMatch = text.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      return Response.json(
        {
          error: "No valid JSON returned from model",
          raw: text,
        },
        { status: 500 }
      );
    }

    const articles = JSON.parse(jsonMatch[0]);

    return Response.json({ articles });
  } catch (err) {
    console.log("SERVER ERROR:", err);

    return Response.json(
      {
        error: "Server error",
        message: err.message,
      },
      { status: 500 }
    );
  }
}
