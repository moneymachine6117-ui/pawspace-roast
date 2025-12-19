const uploadBtn = document.getElementById("uploadBtn");
const roastBtn = document.getElementById("roastBtn");
const downloadBtn = document.getElementById("downloadBtn");

const fileInput = document.getElementById("fileInput");
const petImage = document.getElementById("petImage");
const placeholder = document.getElementById("placeholder");
const roastText = document.getElementById("roastText");
const card = document.getElementById("card");

let imageReady = false;
let roastedAlready = false;

const FALLBACK_ROASTS = [
  "No thoughts. Just audacity.",
  "This pet is absolutely planning something illegal.",
  "Confidence higher than intelligence.",
  "A menace disguised as something cute.",
  "Zero remorse. Pure chaos."
];

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

    imageReady = true;
    roastedAlready = false; // 🔁 reset per upload
  };

  petImage.src = URL.createObjectURL(file);
};

roastBtn.onclick = async () => {
  if (!imageReady || roastedAlready) return;

  roastedAlready = true;
  roastBtn.textContent = "Roast Generated ✓";
  roastBtn.disabled = true;
  roastText.textContent = "Roasting with AI… 😈";

  try {
    const res = await fetch("/api/roast", { method: "POST" });
    const data = await res.json();

    if (data.roast) {
      roastText.textContent = data.roast;
    } else {
      throw new Error("No roast");
    }
  } catch (err) {
    roastText.textContent =
      FALLBACK_ROASTS[Math.floor(Math.random() * FALLBACK_ROASTS.length)];
  }

  downloadBtn.disabled = false;
};
