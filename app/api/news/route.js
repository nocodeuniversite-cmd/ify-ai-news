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

    const prompt = `You are a tech news aggregator. Return exactly 8 recent news articles about: "${searchTerm}".

Return ONLY a valid JSON array. No markdown, no explanation, just the raw array.

Each object must have:
- title: string (compelling headline)
- summary: string (2 sentences)
- detail: string (2-3 sentences with more context)
- source: string (like TechCrunch, Wired, The Verge, MIT Tech Review)
- category: string (one of: AI Models, Big Tech, Startups, Research, Policy)
- time: string (like "2h ago" or "1d ago")

Return only the JSON array.`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
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

    if (!response.ok) {
      const errText = await response.text();
      return Response.json({ error: `Groq error: ${response.status} - ${errText}` }, { status: 500 });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      return Response.json({ error: "No articles found", raw: text }, { status: 500 });
    }

    const articles = JSON.parse(jsonMatch[0]);
    return Response.json({ articles });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
