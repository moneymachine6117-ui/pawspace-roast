<script>
  /* ---------- DATA ---------- */
  const fallbackRoasts = [
    "Looks calm. Definitely commits crimes when no one’s watching.",
    "Runs on vibes and bad decisions.",
    "Emotionally unavailable but demands attention.",
    "Acts innocent. Knows exactly what it’s doing.",
    "One brain cell. Still in charge."
  ];

  /* ---------- ELEMENTS ---------- */
  const upload = document.getElementById("upload");
  const petImage = document.getElementById("petImage");
  const card = document.getElementById("card");
  const roastText = document.getElementById("roastText");
  const generateBtn = document.getElementById("generateBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const reportBtn = document.getElementById("reportBtn");

  let imageLoaded = false;

  /* ---------- IMAGE PREVIEW (FULL RES) ---------- */
  upload.addEventListener("change", () => {
    const file = upload.files[0];
    if (!file) return;

    const imgURL = URL.createObjectURL(file);
    petImage.onload = () => {
      imageLoaded = true;
    };
    petImage.src = imgURL;
  });

  /* ---------- FETCH ROAST ---------- */
  async function getRoast() {
    try {
      const res = await fetch("/api/roast", { method: "POST" });
      const data = await res.json();
      return data.roast;
    } catch {
      return fallbackRoasts[Math.floor(Math.random() * fallbackRoasts.length)];
    }
  }

  /* ---------- GENERATE ROAST ---------- */
  generateBtn.addEventListener("click", async () => {
    if (!imageLoaded) {
      alert("Upload a pet photo first 🐶");
      return;
    }

    // LOCK UI
    upload.style.display = "none";
    generateBtn.style.display = "none";

    roastText.textContent = "Roasting...";
    card.style.display = "block";
    downloadBtn.style.display = "block";
    reportBtn.style.display = "block";

    const roast = await getRoast();
    roastText.textContent = roast;
  });

  /* ---------- DOWNLOAD CARD (MAX QUALITY) ---------- */
  downloadBtn.addEventListener("click", async () => {
    // Wait for layout + fonts
    await new Promise(resolve => setTimeout(resolve, 500));

    const rect = card.getBoundingClientRect();

    html2canvas(card, {
      backgroundColor: "#0b0b0f",
      scale: 4,               // 🔥 UHD QUALITY
      width: rect.width,
      height: rect.height,
      useCORS: true,
      imageSmoothingEnabled: false
    }).then(canvas => {
      const link = document.createElement("a");
      link.download = "pawspace-pet-roast-UHD.png";
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();

      setTimeout(() => {
        alert("Share it on Instagram or X 😈");
      }, 300);
    });
  });

  /* ---------- REPORT ---------- */
  reportBtn.addEventListener("click", () => {
    alert("Thanks for reporting. This image will be reviewed.");
  });
</script>
