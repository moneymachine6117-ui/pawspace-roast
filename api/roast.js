const $ = id => document.getElementById(id);

const upload = $("upload");
const uploadBtn = $("uploadBtn");
const petImage = $("petImage");
const imageBox = $("imageBox");
const roastText = $("roastText");

const btnShare = $("share");
const btnDownloadImage = $("downloadImage");
const btnDownloadVideo = $("downloadVideo");

let imageBlob = null;

const roasts = [
  "No thoughts. Just audacity.",
  "Runs entirely on vibes.",
  "A menace wrapped in fur.",
  "Confidence greater than intelligence.",
  "Main character energy. Zero awareness."
];

uploadBtn.onclick = () => upload.click();

upload.onchange = () => {
  const file = upload.files[0];
  if (!file) return;

  petImage.onload = () => {
    petImage.style.display = "block";
    imageBox.innerHTML = "";
    generateRoast();
  };

  petImage.src = URL.createObjectURL(file);
};

function generateRoast() {
  roastText.style.opacity = 0;
  roastText.textContent = roasts[Math.floor(Math.random() * roasts.length)];
  requestAnimationFrame(() => roastText.style.opacity = 1);
}

/* IMAGE EXPORT — WORKS EVERYWHERE */
async function renderImage() {
  if (imageBlob) return imageBlob;

  const canvas = await html2canvas($("card"), {
    scale: 4,
    backgroundColor: "#0b0b0f",
    useCORS: true
  });

  return new Promise(resolve => {
    canvas.toBlob(blob => {
      imageBlob = blob;
      resolve(blob);
    }, "image/png", 1);
  });
}

/* DOWNLOAD IMAGE */
btnDownloadImage.onclick = async () => {
  const blob = await renderImage();
  download(blob, "pawspace-roast.png");
};

/* SHARE IMAGE */
btnShare.onclick = async () => {
  const blob = await renderImage();
  const file = new File([blob], "pawspace.png", { type: "image/png" });

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: "PawSpace",
      text: "Roast your pet 🐾 pawspace.app"
    });
  } else {
    download(blob, "pawspace.png");
  }
};

/* VIDEO — DISABLED (HONEST UX) */
btnDownloadVideo.onclick = () => {
  alert("Video coming soon 🚀");
};

function download(blob, name) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
}
