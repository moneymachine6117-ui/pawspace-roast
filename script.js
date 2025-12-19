const uploadBtn = document.getElementById("uploadBtn");
const roastBtn = document.getElementById("roastBtn");
const downloadBtn = document.getElementById("downloadBtn");

const fileInput = document.getElementById("fileInput");
const petImage = document.getElementById("petImage");
const placeholder = document.getElementById("placeholder");
const roastText = document.getElementById("roastText");
const card = document.getElementById("card");

let imageReady = false;
let roastLocked = false; // 🔒 HARD LOCK

const FALLBACK_ROASTS = [
  "No thoughts. Just audacity.",
  "This pet is absolutely planning something illegal.",
  "Confidence higher than intelligence.",
  "A menace disguised as something cute.",
  "Zero remorse. Pure chaos."
];

/* UPLOAD */
uploadBtn.onclick = () => fileInput.click();

fileInput.onchange = () => {
  const file = fileInput.files[0];
  if (!file) return;

  petImage.onload = () => {
    petImage.style.display = "block";
    placeholder.style.display = "none";

    roastText.textContent = "Ready to roast 🔥";

    imageReady = true;
    roastLocked = false; // 🔁 reset ONLY on new upload

    roastBtn.disabled = false;
    roastBtn.textContent = "🔥 Generate AI Roast";
    downloadBtn.disabled = true;
  };

  petImage.src = URL.createObjectURL(file);
};

/* ROAST — ONE TIME ONLY */
roastBtn.onclick = async () => {
  if (!imageReady || roastLocked) return;

  // 🔒 LOCK IMMEDIATELY (NO ASYNC GAP)
  roastLocked = true;
  roastBtn.disabled = true;
  roastBtn.textContent = "Roast Generated ✓";
  roastText.textContent = "Roasting with AI… 😈";

  try {
    const res = await fetch("/api/roast", { method: "POST" });
    const data = await res.json();

    if (data && data.roast) {
      roastText.textContent = data.roast;
    } else {
      throw new Error("Invalid AI response");
    }
  } catch (err) {
    roastText.textContent =
      FALLBACK_ROASTS[Math.floor(Math.random() * FALLBACK_ROASTS.length)];
  }

  downloadBtn.disabled = false;
};
