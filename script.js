const uploadBtn = document.getElementById("uploadBtn");
const roastBtn = document.getElementById("roastBtn");
const gifBtn = document.getElementById("gifBtn");
const downloadBtn = document.getElementById("downloadBtn");
const shareBtn = document.getElementById("shareBtn");
const againBtn = document.getElementById("againBtn");

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
  "Absolutely unhinged energy.",
  "Confidence with zero qualifications."
];

// Fake counter
let roastCount = parseInt(localStorage.getItem("pawCount") || "27");
counterEl.textContent = `🔥 ${roastCount} pets roasted`;

let roastUsed = false;

/* 🔁 RESET (CRITICAL) */
function resetUI() {
  roastUsed = false;

  roastBtn.disabled = true;
  gifBtn.disabled = true;
  downloadBtn.disabled = true;
  shareBtn.disabled = true;
  againBtn.disabled = true;

  roastBtn.textContent = "🔥 Roast Pet";
  gifBtn.textContent = "🎞 Generate GIF Meme";

  roastText.textContent = "";
}

/* UPLOAD */
uploadBtn.onclick = () => fileInput.click();

fileInput.onchange = () => {
  const file = fileInput.files[0];
  if (!file) return;

  resetUI();

  petImage.src = URL.createObjectURL(file);
  petImage.onload = () => {
    petImage.style.display = "block";
    placeholder.style.display = "none";

    roastText.textContent = "Ready 🔥";
    roastBtn.disabled = false;
  };
};

/* ROAST */
roastBtn.onclick = () => {
  if (roastUsed) return;
  roastUsed = true;

  roastBtn.disabled = true;

  roastText.textContent =
    ROASTS[Math.floor(Math.random() * ROASTS.length)];

  roastCount++;
  localStorage.setItem("pawCount", roastCount);
  counterEl.textContent = `🔥 ${roastCount} pets roasted`;

  gifBtn.disabled = false;
  downloadBtn.disabled = false;
  shareBtn.disabled = false;
  againBtn.disabled = false;
};

/* DOWNLOAD IMAGE */
downloadBtn.onclick = async () => {
  const canvas = await html2canvas(card, { scale: 3 });
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = "pawspace-roast.png";
  a.click();
};

/* SHARE */
shareBtn.onclick = async () => {
  const canvas = await html2canvas(card, { scale: 3 });

  canvas.toBlob(async blob => {
    const file = new File([blob], "pawspace-roast.png", { type: "image/png" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "Roast My Pet 😂",
          text: "I roasted my pet on PawSpace 🐾🔥"
        });
        return;
      } catch {}
    }

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "pawspace-roast.png";
    a.click();
  });
};

/* GIF MEME */
gifBtn.onclick = async () => {
  gifBtn.disabled = true;
  gifBtn.textContent = "Generating…";

  const frames = [];

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
      }

      gifBtn.textContent = "🎞 Generate GIF Meme";
      gifBtn.disabled = false;
    }
  );
};

/* ROAST ANOTHER */
againBtn.onclick = () => {
  fileInput.value = "";
  petImage.style.display = "none";
  placeholder.style.display = "block";
  resetUI();
};
