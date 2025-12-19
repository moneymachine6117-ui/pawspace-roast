<script>
  const shareBtn = document.getElementById("shareBtn");

  /* ---------- SHOW SHARE BUTTON AFTER ROAST ---------- */
  generateBtn.addEventListener("click", () => {
    setTimeout(() => {
      shareBtn.style.display = "block";
    }, 800);
  });

  /* ---------- SHARE TO INSTAGRAM (MOBILE) ---------- */
  shareBtn.addEventListener("click", async () => {
    await new Promise(resolve => setTimeout(resolve, 400));

    const rect = card.getBoundingClientRect();

    const canvas = await html2canvas(card, {
      backgroundColor: "#0b0b0f",
      scale: 4,
      width: rect.width,
      height: rect.height,
      useCORS: true
    });

    canvas.toBlob(async blob => {
      const file = new File(
        [blob],
        "pawspace-roast.png",
        { type: "image/png" }
      );

      // ✅ Mobile native share (Instagram appears here)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: "Roast my pet 😈",
            text: "Roast your pet → pawspace.vercel.app"
          });
        } catch (err) {
          console.log("Share cancelled");
        }
      } else {
        // ❌ Fallback: download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "pawspace-roast.png";
        link.click();

        alert("Image downloaded — share it on Instagram 📸");
      }
    });
  });
</script>
