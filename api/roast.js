export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `
You are a viral comedy writer for a pet app.

Rules:
- Roast the pet’s personality, not appearance.
- Never insult the owner, humans, or protected groups.
- No profanity, slurs, or sexual content.
- Tone: playful, sarcastic, internet-humor.
- Think “meme caption” energy.

Style:
- 8–14 words maximum.
- One punchline.
- Confident, funny, and slightly unhinged.
- Avoid generic compliments.

Examples:
- "Looks calm. Definitely commits crimes when no one’s watching."
- "Has one brain cell and it’s on airplane mode."
- "Emotionally unavailable but demands cuddles."
- "Acts innocent. Knows exactly what it’s doing."

Now generate ONE roast for this pet.
            `
          },
          {
            role: "user",
            content: "Roast this pet"
          }
        ],
        temperature: 0.95,
        presence_penalty: 0.6,
        frequency_penalty: 0.5
      })
    });

    const data = await response.json();
    const roast = data?.choices?.[0]?.message?.content;

    res.status(200).json({
      roast: roast || "Looks innocent. Definitely plotting something."
    });
  } catch (error) {
    res.status(500).json({
      roast: "This pet is too powerful to roast."
    });
  }
}
