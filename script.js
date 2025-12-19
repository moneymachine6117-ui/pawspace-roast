const uploadBtn = document.getElementById("uploadBtn");
const roastBtn = document.getElementById("roastBtn");
const downloadBtn = document.getElementById("downloadBtn");
const shareBtn = document.getElementById("shareBtn");
const againBtn = document.getElementById("againBtn");

const fileInput = document.getElementById("fileInput");
const petImage = document.getElementById("petImage");
const placeholder = document.getElementById("placeholder");
const roastText = document.getElementById("roastText");
const card = document.getElementById("card");

const FALLBACK_ROASTS = [
  "No thoughts. Just audacity.",
  "This pet is absolutely planning something illegal.",
  "Confidence higher than intelligence.",
  "A menace disguised as something cute.",
  "Zero remorse. Pure chaos."
];

let roastHandler = null;

/* UPLOAD */
uploadBtn.onclick = () => fileInput.click();

fileInput.onchange = () => {
  const file = fileInput.files[0];
  if (!file) return;

  petImage.onload = () => {
    petImage.style.display = "block";
    placeholder.style.display = "none";
    roastText.textContent = "Ready to roast 🔥";

    roastBtn.disabled = false;
    downloadBtn.disabled = true;
    shareBtn.disabled = true;
    againBtn.disabled = true;

    roastBtn.textContent = "🔥 Roast Pet";

    if (roastHandler) {
      roastBtn.removeEventListener("click", roastHandler);
    }

    roastHandler = async () => {
      roastBtn.disabled = true;
      roastBtn.textContent = "Roast Generated ✓";
      roastText.textContent = "Roasting with AI… 😈";

      roastBtn.removeEventListener("click", roastHandler);

      try {
        const res = await fetch("/api/roast", { method: "POST" });
        const data = await res.json();
        roastText.textContent = data.roast || FALLBACK_ROASTS[0];
      } catch {
        roastText.textContent =
          FALLBACK_ROASTS[Math.floor(Math.random() * FALLBACK_ROASTS.length)];
      }

      downloadBtn.disabled = false;
      shareBtn.disabled = false;
      againBtn.disabled = false;
    };

    roastBtn.addEventListener("click", roastHandler);
  };

  petImage.src = URL.createObjectURL(file);
};

/* DOWNLOAD */
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

/* UPLOAD AGAIN */
againBtn.onclick = () => {
  fileInput.value = "";
  petImage.style.display = "none";
  placeholder.style.display = "block";
  roastText.textContent = "";

  roastBtn.disabled = true;
  downloadBtn.disabled = true;
  shareBtn.disabled = true;
  againBtn.disabled = true;
};
