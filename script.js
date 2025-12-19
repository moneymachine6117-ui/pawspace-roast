const uploadBtn = document.getElementById("uploadBtn");
const roastBtn = document.getElementById("roastBtn");
const downloadBtn = document.getElementById("downloadBtn");
const shareBtn = document.getElementById("shareBtn");

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

/* =====================
   UPLOAD IMAGE
===================== */

uploadBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  petImage.onload = () => {
    petImage.style.display = "block";
    placeholder.style.display = "none";

    roastText.textContent = "Ready to roast 🔥";

    roastBtn.disabled = false;
    roastBtn.textContent = "🔥 Roast Pet";
    downloadBtn.disabled = true;
    shareBtn.disabled = true;

    // Remove old roast handler if exists
    if (roastHandler) {
      roastBtn.removeEventListener("click", roastHandler);
    }

    // Create ONE-TIME roast handler
    roastHandler = async () => {
      roastBtn.disabled = true;
      roastBtn.textContent = "Roast Generated ✓";
      roastText.textContent = "Roasting with AI… 😈";

      // HARD REMOVE HANDLER (NO RE-ROAST)
      roastBtn.removeEventListener("click", roastHandler);

      try {
        const res = await fetch("/api/roast", { method: "POST" });
        const data = await res.json();

        if (data && data.roast) {
          roastText.textContent = data.roast;
        } else {
          throw new Error();
        }
      } catch {
        roastText.textContent =
          FALLBACK_ROASTS[Math.floor(Math.random() * FALLBACK_ROASTS.length)];
      }

      downloadBtn.disabled = false;
      shareBtn.disabled = false;
    };

    roastBtn.addEventListener("click", roastHandler);
  };

  petImage.src = URL.createObjectURL(file);
});

/* =====================
   DOWNLOAD IMAGE
===================== */

downloadBtn.addEventListener("click", async () => {
  const canvas = await html2canvas(card, {
    scale: 3,
    backgroundColor: "#ffffff"
  });

  canvas.toBlob(blob => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "pawspace-roast.png";
    a.click();
  });
});

/* =====================
   SHARE (INSTAGRAM / TIKTOK)
===================== */

shareBtn.addEventListener("click", async () => {
  const canvas = await html2canvas(card, {
    scale: 3,
    backgroundColor: "#ffffff"
  });

  canvas.toBlob(async blob => {
    const file = new File([blob], "pawspace-roast.png", {
      type: "image/png"
    });

    // MOBILE SHARE (Instagram / TikTok)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "Roast My Pet 😂",
          text: "I roasted my pet on PawSpace 🐾🔥"
        });
        return;
      } catch (e) {
        // fallback to download
      }
    }

    // FALLBACK — DOWNLOAD
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "pawspace-roast.png";
    a.click();
  });
});
