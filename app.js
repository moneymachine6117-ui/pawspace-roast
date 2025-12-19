const uploadBtn = document.getElementById("uploadBtn");
const roastBtn = document.getElementById("roastBtn");
const downloadBtn = document.getElementById("downloadBtn");
const shareBtn = document.getElementById("shareBtn");

const fileInput = document.getElementById("fileInput");
const petImage = document.getElementById("petImage");
const placeholder = document.getElementById("placeholder");
const roastText = document.getElementById("roastText");
const card = document.getElementById("card");

let imageReady = false;

/* Upload */
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
    imageReady = true;
  };

  petImage.src = URL.createObjectURL(file);
};

/* AI Roast */
roastBtn.onclick = async () => {
  if (!imageReady) return;

  roastText.textContent = "Roasting… 😈";

  const res = await fetch("/api/roast", { method: "POST" });
  const data = await res.json();

  roastText.textContent = data.roast;
  downloadBtn.disabled = false;
  shareBtn.disabled = false;
};

/* Download */
downloadBtn.onclick = async () => {
  const canvas = await html2canvas(card, { scale: 3 });
  canvas.toBlob(blob => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "pawspace-roast.png";
    a.click();
  });
};

/* Share */
shareBtn.onclick = async () => {
  const canvas = await html2canvas(card, { scale: 2 });
  canvas.toBlob(async blob => {
    const file = new File([blob], "pawspace-roast.png", { type: "image/png" });

    if (navigator.share) {
      await navigator.share({
        files: [file],
        title: "Roast my pet",
        text: "Roast your pet 👉 pawspace.app"
      });
    } else {
      alert("Sharing not supported on this device");
    }
  });
};
