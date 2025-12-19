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

const FALLBACK_ROASTS = [
  "No thoughts. Just audacity.",
  "This pet is planning crimes.",
  "Cute face. Dangerous intentions.",
  "Confidence with zero qualifications.",
  "Absolutely unhinged energy."
];

// Fake counter
let roastCount = parseInt(localStorage.getItem("pawspaceCount") || "27");
counterEl.textContent = `🔥 ${roastCount} pets roasted`;

let roastUsed = false;

/* UPLOAD */
uploadBtn.onclick = () => fileInput.click();

fileInput.onchange = () => {
  const file = fileInput.files[0];
  if (!file) return;

  petImage.src = URL.createObjectURL(file);
  petImage.onload = () => {
    petImage.style.display = "block";
    placeholder.style.display = "none";
    roastText.textContent = "Ready to roast 🔥";

    roastUsed = false;
    roastBtn.disabled = false;
    gifBtn.disabled = true;
    downloadBtn.disabled = true;
    shareBtn.disabled = true;
    againBtn.disabled = true;
  };
};

/* ROAST */
roastBtn.onclick = async () => {
  if (roastUsed) return;
  roastUsed = true;

  roastBtn.disabled = true;

  try {
    const res = await fetch("/api/roast", { method: "POST" });
    const data = await res.json();
    roastText.textContent = data.roast || FALLBACK_ROASTS[0];
  } catch {
    roastText.textContent =
      FALLBACK_ROASTS[Math.floor(Math.random() * FALLBACK_ROASTS.length)];
  }

  roastCount += 1;
  localStorage.setItem("pawspaceCount", roastCount);
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
gifBtn.onclick = () => {
  gifBtn.disabled = true;

  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");

  const frames = [];
  const lines = roastText.textContent.split(". ").slice(0, 2);
  let zoom = 1;

  for (let i = 0; i < 4; i++) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    zoom += 0.03;

    const w = canvas.width * zoom;
    const h = canvas.height * zoom;

    ctx.drawImage(petImage, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);

    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, canvas.height - 260, canvas.width, 260);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 48px Inter";
    ctx.textAlign = "center";

    if (i >= 1) ctx.fillText(lines[0] || "", canvas.width / 2, canvas.height - 180);
    if (i >= 2) ctx.fillText(lines[1] || "", canvas.width / 2, canvas.height - 110);
    if (i >= 3) ctx.fillText("🔥😂", canvas.width / 2, canvas.height - 50);

    ctx.font = "28px Inter";
    ctx.fillText("Roasted on PawSpace", canvas.width / 2, 50);

    frames.push(canvas.toDataURL("image/png"));
  }

  gifshot.createGIF(
    {
      images: frames,
      interval: 0.8,
      gifWidth: 1080,
      gifHeight: 1080
    },
    result => {
      if (!result.error) {
        const a = document.createElement("a");
        a.href = result.image;
        a.download = "pawspace-meme.gif";
        a.click();
      }
      gifBtn.disabled = false;
    }
  );
};

/* RESET */
againBtn.onclick = () => {
  fileInput.value = "";
  petImage.style.display = "none";
  placeholder.style.display = "block";
  roastText.textContent = "";

  roastBtn.disabled = true;
  gifBtn.disabled = true;
  downloadBtn.disabled = true;
  shareBtn.disabled = true;
  againBtn.disabled = true;
};
