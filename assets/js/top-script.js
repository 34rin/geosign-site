/* スライドショー */
const slides = document.querySelectorAll(".slide");
let current = 0;
let intervalId;

// スライド切替
function showNextSlide() {
  slides[current].classList.remove("active");
  current = (current + 1) % slides.length;
  slides[current].classList.add("active");
  updateTextPosition(slides[current]);
  preloadNextSlide(current);
}

// 文字位置調整
function updateTextPosition(slide) {
  if (!slide) return;
  const isSP = window.innerWidth <= 767;
  const img = isSP
    ? slide.querySelector(".slide-sp")
    : slide.querySelector(".slide-pc");
  const box = slide.querySelector(".content-box");
  if (!img || !box) return;

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

  box.style.top = imgHeight * topPercent + "px";
}

// メインビジュアル高さ調整
function adjustMainVisualHeight() {
  const main = document.querySelector(".main-visual");
  let maxHeight = 0;
  const isSP = window.innerWidth <= 767;

  slides.forEach((slide) => {
    const img = isSP
      ? slide.querySelector(".slide-sp")
      : slide.querySelector(".slide-pc");
    if (img && img.clientHeight > maxHeight) maxHeight = img.clientHeight;
  });

  main.style.height = maxHeight + "px";

  const waveContainer = document.querySelector(".main-visual-wave");
  const wave = waveContainer?.querySelector("img");
  if (wave && waveContainer) {
    waveContainer.style.position = "relative";
    waveContainer.style.width = "100%";
    const overlap = 0.7;
    waveContainer.style.marginTop = `-${wave.clientHeight * overlap}px`;
  }
}

// 次スライドの画像をプリロード
function preloadNextSlide(index) {
  const nextIndex = (index + 1) % slides.length;
  const imgs = slides[nextIndex].querySelectorAll("img");
  imgs.forEach((img) => {
    if (!img.complete) {
      const tmp = new Image();
      tmp.src = img.src;
    }
  });
}

// 初期化（最初のスライドだけ即表示）
function initSlideShow() {
  const firstSlide = slides[0];
  const firstImgs = firstSlide.querySelectorAll("img");
  let loaded = 0;

  firstImgs.forEach((img) => {
    if (img.complete) loaded++;
    else
      img.addEventListener("load", () => {
        loaded++;
        if (loaded === firstImgs.length) {
          updateTextPosition(firstSlide);
          adjustMainVisualHeight();
        }
      });
  });

  if (loaded === firstImgs.length) {
    updateTextPosition(firstSlide);
    adjustMainVisualHeight();
  }

  // IntersectionObserverで画面に見えたらスライド開始
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!intervalId) intervalId = setInterval(showNextSlide, 5000);
          observer.disconnect(); // 一度開始したら監視解除
        }
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(document.querySelector(".main-visual"));
}

// リサイズ時に再計算
window.addEventListener("resize", () => {
  updateTextPosition(slides[current]);
  adjustMainVisualHeight();
});

window.addEventListener("load", initSlideShow);
