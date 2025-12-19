document.addEventListener("DOMContentLoaded", () => {
  console.log("JS loaded");

  const upload = document.getElementById("upload");
  const uploadBtn = document.getElementById("uploadBtn");
  const petImage = document.getElementById("petImage");
  const imageBox = document.getElementById("imageBox");
  const roastText = document.getElementById("roastText");
  const downloadBtn = document.getElementById("downloadBtn");
  const card = document.getElementById("card");

  if (!upload || !uploadBtn) {
    console.error("Elements missing");
    return;
  }

  const roasts = [
    "No thoughts. Just audacity.",
    "Runs entirely on vibes.",
    "A menace wrapped in fur.",
    "Confidence greater than intelligence."
  ];

  uploadBtn.onclick = () => {
    console.log("Upload clicked");
    upload.click();
  };

  upload.onchange = () => {
    const file = upload.files[0];
    if (!file) return;

    console.log("File selected");

    petImage.onload = () => {
      petImage.style.display = "block";
      imageBox.firstChild.textContent = "";
      roastText.textContent =
        roasts[Math.floor(Math.random() * roasts.length)];
    };

    petImage.src = URL.createObjectURL(file);
  };

  downloadBtn.onclick = async () => {
    console.log("Download clicked");

    const canvas = await html2canvas(card, {
      scale: 3,
      backgroundColor: "#151520"
    });

    canvas.toBlob(blob => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "pawspace.png";
      a.click();
    });
  };
});
