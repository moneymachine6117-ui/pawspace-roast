const uploadBtn = document.getElementById("uploadBtn");
const roastBtn = document.getElementById("roastBtn");
const downloadBtn = document.getElementById("downloadBtn");

const fileInput = document.getElementById("fileInput");
const petImage = document.getElementById("petImage");
const placeholder = document.getElementById("placeholder");
const roastText = document.getElementById("roastText");
const card = document.getElementById("card");

const ROASTS = [
  "No thoughts. Just audacity.",
  "This pet is definitely plotting something.",
  "Confidence higher than intelligence.",
  "A menace wrapped in cuteness.",
  "Absolutely zero remorse in those eyes."
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
  };

  petImage.src = URL.createObjectURL(file);
};

roastBtn.onclick = () => {
  roastText.textContent =
    ROASTS[Math.floor(Math.random() * ROASTS.length)];
  downloadBtn.disabled = false;
};

downloadBtn.onclick = async () => {
  const canvas = await html2canvas(card, { scale: 3 });
  canvas.toBlob(blob => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "pawspace-roast.png";
    a.click();
  });
};
