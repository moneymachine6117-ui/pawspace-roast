const uploadBtn = document.getElementById("uploadBtn");
const roastBtn = document.getElementById("roastBtn");
const gifBtn = document.getElementById("gifBtn");

const fileInput = document.getElementById("fileInput");
const petImage = document.getElementById("petImage");
const placeholder = document.getElementById("placeholder");
const roastText = document.getElementById("roastText");
const card = document.getElementById("card");
const counterEl = document.getElementById("counter");

const ROASTS = [
  "No thoughts. Just audacity.",
  "This pet is planning crimes.",
  "Cute face. Dangerous intentions.",
  "Absolutely unhinged energy."
];

let roastCount = parseInt(localStorage.getItem("pawCount") || "27");
counterEl.textContent = `🔥 ${roastCount} pets roasted`;

uploadBtn.onclick = () => fileInput.click();

fileInput.onchange = () => {
  const file = fileInput.files[0];
  if (!file) return;

  petImage.src = URL.createObjectURL(file);
  petImage.onload = () => {
    petImage.style.display = "block";
    placeholder.style.display = "none";
    roastBtn.disabled = false;
    gifBtn.disabled = true;
    roastText.textContent = "Ready 🔥";
  };
};

roastBtn.onclick = () => {
  roastText.textContent = ROASTS[Math.floor(Math.random() * ROASTS.length)];
  roastBtn.disabled = true;
  gifBtn.disabled = false;

  roastCount++;
  localStorage.setItem("pawCount", roastCount);
  counterEl.textContent = `🔥 ${roastCount} pets roasted`;
};

gifBtn.onclick = async () => {
  gifBtn.disabled = true;
  gifBtn.textContent = "Generating…";

  const frames = [];

  // Capture multiple frames
  for (let i = 0; i < 4; i++) {
    card.style.transform = `scale(${1 + i * 0.03})`;
    await new Promise(r => setTimeout(r, 300));

    const canvas = await html2canvas(card, { scale: 2 });
    frames.push(canvas.toDataURL("image/png"));
  }

  card.style.transform = "scale(1)";

  gifshot.createGIF(
    {
      images: frames,
      interval: 0.6,
      gifWidth: 600,
      gifHeight: 800
    },
    result => {
      if (!result.error) {
        const a = document.createElement("a");
        a.href = result.image;
        a.download = "pawspace-meme.gif";
        a.click();
      } else {
        alert("GIF generation failed. Try again.");
      }

      gifBtn.textContent = "🎞 Generate GIF Meme";
      gifBtn.disabled = false;
    }
  );
};
