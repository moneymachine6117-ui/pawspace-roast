const $ = id => document.getElementById(id);

const upload = $("upload");
const uploadBtn = $("uploadBtn");
const petImage = $("petImage");
const card = $("card");
const roastText = $("roastText");
const actions = $("actions");

const btnAddVideo = $("addVideo");
const btnShare = $("share");
const btnDownloadImage = $("downloadImage");
const btnDownloadVideo = $("downloadVideo");

const state = {
  imageReady: false,
  imageBlob: null,
  videoBlob: null,
  busy: false
};

const fallbackRoasts = [
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

  resetState();

  petImage.onload = async () => {
    state.imageReady = true;
    card.style.display = "block";
    actions.style.display = "flex";
    await generateRoast();
  };

  petImage.src = URL.createObjectURL(file);
};

async function generateRoast() {
  setBusy(true, "Roasting…");

  try {
    const res = await fetch("/api/roast", { method: "POST" });
    const data = await res.json();
    roastText.textContent = data.roast;
  } catch {
    roastText.textContent =
      fallbackRoasts[Math.floor(Math.random() * fallbackRoasts.length)];
  }

  requestAnimationFrame(() => roastText.style.opacity = 1);
  setBusy(false);
}

btnAddVideo.onclick = async () => {
  if (!state.imageReady || state.busy) return;

  setBusy(true, "Creating video…");
  roastText.style.opacity = 0;

  const stream = card.captureStream(30);
  const recorder = new MediaRecorder(stream);
  const chunks = [];

  recorder.ondataavailable = e => chunks.push(e.data);
  recorder.start();

  setTimeout(() => roastText.style.opacity = 1, 1200);
  setTimeout(() => recorder.stop(), 7000);

  recorder.onstop = () => {
    state.videoBlob = new Blob(chunks, { type: "video/webm" });
    setBusy(false);
  };
};

btnDownloadImage.onclick = async () => {
  const blob = await renderImage();
  download(blob, "pawspace-roast.png");
};

btnDownloadVideo.onclick = () => {
  if (!state.videoBlob) return;
  download(state.videoBlob, "pawspace-video.webm");
};

btnShare.onclick = async () => {
  let blob = state.videoBlob || state.imageBlob || await renderImage();
  const file = new File([blob], "pawspace-share", { type: blob.type });

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: "Roast my pet 😈",
      text: "pawspace.app"
    });
  } else {
    download(blob, "pawspace-share");
  }
};

async function renderImage() {
  if (state.imageBlob) return state.imageBlob;

  const canvas = await html2canvas(card, {
    scale: 4,
    backgroundColor: "#0b0b0f"
  });

  return new Promise(resolve => {
    canvas.toBlob(b => {
      state.imageBlob = b;
      resolve(b);
    }, "image/png", 1);
  });
}

function setBusy(flag, text) {
  state.busy = flag;
  roastText.textContent = text;
  [btnAddVideo, btnShare, btnDownloadImage, btnDownloadVideo]
    .forEach(b => b.disabled = flag);
}

function resetState() {
  state.imageBlob = null;
  state.videoBlob = null;
  roastText.style.opacity = 0;
}

function download(blob, name) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
}
