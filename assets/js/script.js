/***** スライドショー *****/

const slides = document.querySelectorAll(".slide");
const mainVisual = document.querySelector(".main-visual");
let current = 0;

// スライド切替
function showNextSlide() {
  slides.forEach((s) => s.classList.remove("active"));
  current = (current + 1) % slides.length;
  slides[current].classList.add("active");
  adjustMainVisualHeight();
}

// main-visual 高さ調整（表示中スライドの画像に合わせる）
function adjustMainVisualHeight() {
  const activeSlide = slides[current];
  const isSP = window.innerWidth <= 767;
  const img = isSP
    ? activeSlide.querySelector(".slide-sp")
    : activeSlide.querySelector(".slide-pc");

  if (!img) return;

  const setHeight = () => {
    const height = img.offsetHeight; // CSSで縮小後の高さを取得
    if (height > 0) mainVisual.style.height = height + "px";
    else requestAnimationFrame(setHeight); // 高さ0なら再試行
  };

  if (img.complete) setHeight();
  else img.onload = setHeight;
}

// 初期化
function initMainVisual() {
  adjustMainVisualHeight();
}

// イベント設定
window.addEventListener("load", () => {
  initMainVisual();
  setInterval(showNextSlide, 5000); // 5秒ごと切替
});

window.addEventListener("resize", adjustMainVisualHeight);
