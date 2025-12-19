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
let videoBlob = null;
let imageReady = false;

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
    imageBox.firstChild.textContent = "";
    imageReady = true;
    generateRoast();
    generateVideo(); // auto-generate for virality
  };

  petImage.src = URL.createObjectURL(file);
};

function generateRoast() {
  roastText.style.opacity = 0;
  roastText.textContent = roasts[Math.floor(Math.random() * roasts.length)];
  requestAnimationFrame(() => roastText.style.opacity = 1);
}

/* IMAGE EXPORT */
async function renderImage() {
  if (imageBlob) return imageBlob;
  const canvas = await html2canvas($("card"), { scale: 4 });
  return new Promise(r => canvas.toBlob(b => (imageBlob = b), "image/png", 1));
}

/* AUTO VIRAL VIDEO */
function generateVideo() {
  roastText.style.opacity = 0;

  const stream = $("card").captureStream(30);
  const recorder = new MediaRecorder(stream);
  const chunks = [];

  recorder.ondataavailable = e => chunks.push(e.data);
  recorder.start();

  setTimeout(() => roastText.style.opacity = 1, 900); // hook timing
  setTimeout(() => recorder.stop(), 6500); // TikTok sweet spot

  recorder.onstop = () => {
    videoBlob = new Blob(chunks, { type: "video/webm" });
  };
}

/* DOWNLOADS */
btnDownloadImage.onclick = async () => {
  if (!imageReady) return;
  const blob = await renderImage();
  download(blob, "pawspace.png");
};

btnDownloadVideo.onclick = () => {
  if (!videoBlob) return;
  download(videoBlob, "pawspace-reel.webm");
};

/* SHARE */
btnShare.onclick = async () => {
  const blob = videoBlob || await renderImage();
  const file = new File([blob], "pawspace-share", { type: blob.type });

  if (navigator.canShare?.({ files: [file] })) {
    navigator.share({
      files: [file],
      title: "PawSpace",
      text: "Roast your pet 🐾 pawspace.app"
    });
  } else {
    download(blob, "pawspace-share");
  }
};

function download(blob, name) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
}
