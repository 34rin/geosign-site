/* スライドショー */
function initTopVisual() {
  const slides = document.querySelectorAll(".slide");
  if (!slides.length) return;

  let current = 0;

  // スライド切替
  function showNextSlide() {
    slides[current].style.opacity = "0";
    slides[current].style.zIndex = "0";
    current = (current + 1) % slides.length;
    slides[current].style.opacity = "1";
    slides[current].style.zIndex = "1";
  }

  // 高さと文字位置調整
  function adjustPositions() {
    const isSP = window.innerWidth <= 767;
    let maxHeight = 0;
    slides.forEach((slide) => {
      const img = isSP
        ? slide.querySelector(".slide-sp")
        : slide.querySelector(".slide-pc");
      const contentBox = slide.querySelector(".content-box");
      if (!img || !contentBox) return;
      const imgHeight = img.clientHeight;
      if (imgHeight > maxHeight) maxHeight = imgHeight;
      contentBox.style.top = imgHeight * 0.25 + "px";
    });
    const mainVisual = document.querySelector(".main-visual");
    if (mainVisual) mainVisual.style.height = maxHeight + "px";

    const waveContainer = document.querySelector(".main-visual-wave");
    const wave = waveContainer?.querySelector("img");
    if (wave && waveContainer)
      waveContainer.style.marginTop = `-${wave.clientHeight * 0.7}px`;
  }

  // 画像ロード完了後に調整
  const imgs = document.querySelectorAll(".main-visual img");
  let loaded = 0;
  imgs.forEach((img) => {
    if (img.complete) loaded++;
    else
      img.addEventListener("load", () => {
        loaded++;
        if (loaded === imgs.length) adjustPositions();
      });
  });
  if (loaded === imgs.length) adjustPositions();

  setInterval(showNextSlide, 5000);
  window.addEventListener("resize", adjustPositions);
}
