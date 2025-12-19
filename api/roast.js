export default async function handler(req, res) {
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
          content: "You roast pets. Savage, funny, viral, short."
        },
        {
          role: "user",
          content: "Roast this pet."
        }
      ]
    })
  });

  const data = await response.json();
  res.json({ roast: data.choices[0].message.content });
}
