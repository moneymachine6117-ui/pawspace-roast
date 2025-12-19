<script>
  const videoBtn = document.getElementById("videoBtn");

  // Show video button after roast
  generateBtn.addEventListener("click", () => {
    setTimeout(() => {
      videoBtn.style.display = "block";
    }, 1000);
  });

  videoBtn.addEventListener("click", async () => {
    alert("Creating video… please wait ⏳");

    const stream = card.captureStream(30); // 30 FPS
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm"
    });

    const chunks = [];
    mediaRecorder.ondataavailable = e => chunks.push(e.data);

    mediaRecorder.start();

    // Animation timing
    roastText.style.opacity = 0;

    setTimeout(() => {
      roastText.style.opacity = 1;
    }, 1500);

    // Stop after 7 seconds
    setTimeout(() => {
      mediaRecorder.stop();
    }, 7000);

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const file = new File([blob], "pawspace-roast-video.webm", {
        type: "video/webm"
      });

      // Mobile share
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Roast my pet 😈",
          text: "Roast your pet → pawspace.vercel.app"
        });
      } else {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "pawspace-roast-video.webm";
        link.click();

        alert("Video downloaded — upload to TikTok or Instagram 🎥");
      }
    };
  });
</script>
