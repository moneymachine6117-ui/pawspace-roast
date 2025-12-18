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
            content:
              "You write short, funny, light-hearted pet roasts. Never insult appearance, owners, or use offensive language. Max 15 words."
          },
          {
            role: "user",
            content: "Roast this pet"
          }
        ],
        temperature: 0.9
      })
    });

    const data = await response.json();
    const roast = data?.choices?.[0]?.message?.content;

    res.status(200).json({
      roast: roast || "This pet woke up and chose chaos."
    });
  } catch (err) {
    res.status(500).json({
      roast: "This pet is too powerful to roast."
    });
  }
}
