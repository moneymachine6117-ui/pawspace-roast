const uploadBtn = document.getElementById("uploadBtn");
const roastBtn = document.getElementById("roastBtn");
const downloadBtn = document.getElementById("downloadBtn");

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
uploadBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  petImage.onload = () => {
    petImage.style.display = "block";
    placeholder.style.display = "none";

    roastText.textContent = "Ready to roast 🔥";
    downloadBtn.disabled = true;

    // 🔁 RESET BUTTON COMPLETELY
    roastBtn.disabled = false;
    roastBtn.textContent = "🔥 Generate AI Roast";

    // ❌ Remove any old handler
    if (roastHandler) {
      roastBtn.removeEventListener("click", roastHandler);
    }

    // ✅ Create NEW one-time handler
    roastHandler = async () => {
      roastBtn.disabled = true;
      roastBtn.textContent = "Roast Generated ✓";
      roastText.textContent = "Roasting with AI… 😈";

      // ❌ REMOVE HANDLER IMMEDIATELY (NO SECOND CALL POSSIBLE)
      roastBtn.removeEventListener("click", roastHandler);

      try {
        const res = await fetch("/api/roast", { method: "POST" });
        const data = await res.json();

        if (data && data.roast) {
          roastText.textContent = data.roast;
        } else {
          throw new Error("Bad AI response");
        }
      } catch (e) {
        roastText.textContent =
          FALLBACK_ROASTS[Math.floor(Math.random() * FALLBACK_ROASTS.length)];
      }

      downloadBtn.disabled = false;
    };

    roastBtn.addEventListener("click", roastHandler);
  };

  petImage.src = URL.createObjectURL(file);
});
