/* スライドショー */
function initTopVisual() {
  const slides = document.querySelectorAll(".slide");
  if (!slides.length) return;

  let current = 0;

  // 最初のスライドだけ表示
  slides.forEach((s, i) => {
    s.style.opacity = i === 0 ? "1" : "0";
    s.style.zIndex = i === 0 ? "1" : "0";
  });

  // スライド切替
  function showNextSlide() {
    slides[current].style.opacity = "0";
    slides[current].style.zIndex = "0";

    current = (current + 1) % slides.length;

    slides[current].style.opacity = "1";
    slides[current].style.zIndex = "1";

    updateTextPosition();
  }

  // 文字位置調整
  function updateTextPosition() {
    const isSP = window.innerWidth <= 767;
    slides.forEach((slide) => {
      const img = isSP
        ? slide.querySelector(".slide-sp")
        : slide.querySelector(".slide-pc");
      const contentBox = slide.querySelector(".content-box");
      if (!img || !contentBox) return;

      const imgHeight = img.clientHeight;
      let topPercent = slide.classList.contains("slide-1")
        ? isSP
          ? 0.25
          : 0.16
        : slide.classList.contains("slide-2")
        ? isSP
          ? 0.25
          : 0.18
        : slide.classList.contains("slide-3")
        ? isSP
          ? 0.5
          : 0.45
        : 0.25;
      contentBox.style.top = imgHeight * topPercent + "px";
    });
  }

  // main-visual 高さ調整 & wave
  function adjustMainVisualHeight() {
    const mainVisual = document.querySelector(".main-visual");
    if (!mainVisual) return;
    const isSP = window.innerWidth <= 767;

    let maxHeight = 0;
    slides.forEach((slide) => {
      const img = isSP
        ? slide.querySelector(".slide-sp")
        : slide.querySelector(".slide-pc");
      if (img && img.clientHeight > maxHeight) maxHeight = img.clientHeight;
    });
    mainVisual.style.height = maxHeight + "px";

    const waveContainer = document.querySelector(".main-visual-wave");
    const wave = waveContainer ? waveContainer.querySelector("img") : null;
    if (wave && waveContainer) {
      waveContainer.style.position = "relative";
      waveContainer.style.width = "100%";
      const overlap = 0.7;
      waveContainer.style.marginTop = `-${wave.clientHeight * overlap}px`;
    }
  }

  // 画像ロード後に初期化
  function initImages() {
    const imgs = document.querySelectorAll(".main-visual img");
    let loaded = 0;
    imgs.forEach((img) => {
      if (img.complete) loaded++;
      else
        img.addEventListener("load", () => {
          loaded++;
          if (loaded === imgs.length) {
            updateTextPosition();
            adjustMainVisualHeight();
          }
        });
    });
    if (loaded === imgs.length) {
      updateTextPosition();
      adjustMainVisualHeight();
    }
  }

  initImages();
  setInterval(showNextSlide, 5000);
  window.addEventListener("resize", () => {
    updateTextPosition();
    adjustMainVisualHeight();
  });
}
