export default function handler(req, res) {
  res.json([
    {
      id: 1,
      petName: "Shadow",
      image: "https://placekitten.com/400/400",
      roast: "Absolutely plotting something illegal.",
      likes: 93
    },
    {
      id: 2,
      petName: "Luna",
      image: "https://placekitten.com/401/401",
      roast: "No thoughts. Just audacity.",
      likes: 57
    }
  ]);
}
