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
              "You roast pets. Be savage, funny, short, and viral. No profanity."
          },
          {
            role: "user",
            content: "Roast this pet based on its photo."
          }
        ]
      })
    });

    const data = await response.json();

    const roast =
      data?.choices?.[0]?.message?.content ||
      "This pet has main character energy and zero regrets.";

    res.status(200).json({ roast });
  } catch (error) {
    res.status(500).json({ roast: null });
  }
}
