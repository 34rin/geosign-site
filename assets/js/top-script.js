/* スライドショー */
function initTopVisual() {
  const slides = Array.from(document.querySelectorAll(".slide"));
  if (!slides.length) return;

  let current = 0;

  // contentBoxと画像をキャッシュ
  const slideData = slides.map((slide) => ({
    slide,
    spImg: slide.querySelector(".slide-sp"),
    pcImg: slide.querySelector(".slide-pc"),
    contentBox: slide.querySelector(".content-box"),
    topPercent: slide.classList.contains("slide-1")
      ? [0.25, 0.16]
      : slide.classList.contains("slide-2")
      ? [0.25, 0.18]
      : slide.classList.contains("slide-3")
      ? [0.5, 0.45]
      : [0.25, 0.25],
  }));

  // 最初のスライド表示
  slideData.forEach((s, i) => {
    s.slide.style.opacity = i === 0 ? "1" : "0";
    s.slide.style.zIndex = i === 0 ? "1" : "0";
  });

  function updateTextPosition() {
    const isSP = window.innerWidth <= 767;
    slideData.forEach((s) => {
      const img = isSP ? s.spImg : s.pcImg;
      if (!img || !s.contentBox) return;
      const h = img.clientHeight;
      const topPercent = isSP ? s.topPercent[0] : s.topPercent[1];
      s.contentBox.style.top = h * topPercent + "px";
    });
  }

  function adjustMainVisualHeight() {
    const isSP = window.innerWidth <= 767;
    const mainVisual = document.querySelector(".main-visual");
    if (!mainVisual) return;
    const maxH = Math.max(
      ...slideData.map((s) => {
        const img = isSP ? s.spImg : s.pcImg;
        return img ? img.clientHeight : 0;
      })
    );
    mainVisual.style.height = maxH + "px";

    const wave = document.querySelector(".main-visual-wave img");
    if (wave) {
      const overlap = 0.7;
      document.querySelector(".main-visual-wave").style.marginTop = `-${
        wave.clientHeight * overlap
      }px`;
    }
  }

  function showNextSlide() {
    slideData[current].slide.style.opacity = "0";
    slideData[current].slide.style.zIndex = "0";
    current = (current + 1) % slideData.length;
    slideData[current].slide.style.opacity = "1";
    slideData[current].slide.style.zIndex = "1";
    updateTextPosition();
  }

  // 画像ロード完了後初期化
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

  setInterval(showNextSlide, 5000);
  window.addEventListener("resize", () => {
    updateTextPosition();
    adjustMainVisualHeight();
  });
}
