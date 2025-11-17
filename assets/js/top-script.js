/* スライドショー */
function initTopVisual() {
  const slides = document.querySelectorAll(".slide");
  if (!slides.length) return;

  let current = 0;

  // スライド切替
  slides.forEach((s, i) => {
    s.style.opacity = i === 0 ? "1" : "0";
    s.style.zIndex = i === 0 ? "1" : "0";
  });

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
      const box = slide.querySelector(".content-box");
      if (!img || !box) return;
      const h = img.clientHeight;
      let topPct = slide.classList.contains("slide-1")
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
      box.style.top = h * topPct + "px";
    });
  }

  // main-visual 高さ調整
  function adjustMainVisualHeight() {
    const main = document.querySelector(".main-visual");
    if (!main) return;
    const isSP = window.innerWidth <= 767;
    let maxH = 0;
    slides.forEach((slide) => {
      const img = isSP
        ? slide.querySelector(".slide-sp")
        : slide.querySelector(".slide-pc");
      if (img) maxH = Math.max(maxH, img.clientHeight);
    });
    main.style.height = maxH + "px";

    // wave を main-visual 下に配置して少し重ねる
    const wave = document.querySelector(".main-visual-wave img");
    if (wave) {
      wave.parentElement.style.marginTop = `-${wave.clientHeight * 0.7}px`;
      wave.parentElement.style.width = "100%";
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
  setInterval(showNextSlide, 5000); // 5秒ごと切替
  window.addEventListener("resize", () => {
    updateTextPosition();
    adjustMainVisualHeight();
  });
}
