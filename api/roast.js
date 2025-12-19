<script>
  /* ---------- ELEMENTS ---------- */
  const upload = document.getElementById("upload");
  const petImage = document.getElementById("petImage");
  const card = document.getElementById("card");
  const roastText = document.getElementById("roastText");
  const actions = document.getElementById("actions");

  const addImageBtn = document.getElementById("addImage");
  const addVideoBtn = document.getElementById("addVideo");
  const shareBtn = document.getElementById("share");
  const downloadImageBtn = document.getElementById("downloadImage");
  const downloadVideoBtn = document.getElementById("downloadVideo");

  /* ---------- STATE ---------- */
  let imageLoaded = false;
  let lastImageBlob = null;
  let lastVideoBlob = null;

  const fallbackRoasts = [
    "Zero thoughts. Unlimited confidence.",
    "Acts surprised by consequences it caused.",
    "Main character energy. Side character intelligence.",
    "Runs entirely on delusion.",
    "A menace with no strategy."
  ];

  /* ---------- IMAGE UPLOAD ---------- */
  addImageBtn.onclick = () => upload.click();

  upload.onchange = () => {
    const file = upload.files[0];
    if (!file) return;

    petImage.onload = () => {
      imageLoaded = true;
      generateRoast();
    };

    petImage.src = URL.createObjectURL(file);
  };

  /* ---------- ROAST ---------- */
  async function generateRoast() {
    card.style.display = "block";
    actions.style.display = "flex";
    roastText.textContent = "Roasting...";

    lastVideoBlob = null; // reset video on new image

    try {
      const res = await fetch("/api/roast", { method: "POST" });
      const data = await res.json();
      roastText.textContent = data.roast;
    } catch {
      roastText.textContent =
        fallbackRoasts[Math.floor(Math.random() * fallbackRoasts.length)];
    }
  }

  /* ---------- IMAGE GENERATION (UHD) ---------- */
  async function createImageBlob() {
    const canvas = await html2canvas(card, {
      scale: 4,
      backgroundColor: "#0b0b0f",
      useCORS: true
    });

    return new Promise(resolve =>
      canvas.toBlob(blob => resolve(blob), "image/png", 1.0)
    );
  }

  /* ---------- DOWNLOAD IMAGE ---------- */
  downloadImageBtn.onclick = async () => {
    if (!imageLoaded) return alert("Upload an image first");
    lastImageBlob = await createImageBlob();
    downloadBlob(lastImageBlob, "pawspace-roast.png");
  };

  /* ---------- VIDEO CREATION ---------- */
  addVideoBtn.onclick = async () => {
    if (!imageLoaded) return alert("Upload an image first");

    alert("Creating video… ⏳");

    roastText.style.opacity = 0;

    const stream = card.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    const chunks = [];

    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.start();

    setTimeout(() => roastText.style.opacity = 1, 1200);
    setTimeout(() => recorder.stop(), 7000);

    recorder.onstop = () => {
      lastVideoBlob = new Blob(chunks, { type: "video/webm" });
      alert("Video ready 🎥");
    };
  };

  /* ---------- DOWNLOAD VIDEO ---------- */
  downloadVideoBtn.onclick = () => {
    if (!lastVideoBlob) return alert("Create a video first");
    downloadBlob(lastVideoBlob, "pawspace-roast-video.webm");
  };

  /* ---------- SHARE (IMAGE OR VIDEO) ---------- */
  shareBtn.onclick = async () => {
    let blob = lastVideoBlob || lastImageBlob;

    if (!blob) {
      blob = await createImageBlob();
      lastImageBlob = blob;
    }

    const fileName = blob.type.includes("video")
      ? "pawspace-roast-video.webm"
      : "pawspace-roast.png";

    const file = new File([blob], fileName, { type: blob.type });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "Roast my pet 😈",
        text: "Roast your pet → pawspace.vercel.app"
      });
    } else {
      downloadBlob(blob, fileName);
    }
  };

  /* ---------- UTIL ---------- */
  function downloadBlob(blob, name) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
  }
</script>
