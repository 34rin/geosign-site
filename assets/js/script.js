/* テスト */
// console.log('JSファイル読み込まれました');

/* ハンバーガーメニュー */
const hamburgermenu = document.getElementById("hamburgermenu");
const hamburgermenunav = document.getElementById("hamburgermenunav");

hamburgermenu.addEventListener("click", () => {
  hamburgermenu.classList.toggle("active");
  hamburgermenunav.classList.toggle("active");
});

/* プルダウンメニュー */
document.querySelectorAll(".pull-down-menu .menu-parent").forEach((parent) => {
  parent.addEventListener("click", (e) => {
    e.stopPropagation();
    const li = parent.closest(".pull-down-menu");
    const submenu = li.querySelector(".sub-menu");

    const isOpen = li.classList.toggle("open");
    submenu.style.display = isOpen ? "inline-block" : "none";
  });
});

/* ===== トップページだけ実行 ===== */
if (location.pathname === "/" || location.pathname.endsWith("index.html")) {
  /* スライドショー */
  const slides = document.querySelectorAll(".slide");
  let current = 0;

  // スライド切替
  function showNextSlide() {
    slides.forEach((s) => s.classList.remove("active"));
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
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

  // main-visual 高さ調整
  function adjustMainVisualHeight() {
    const mainVisual = document.querySelector(".main-visual");
    const isSP = window.innerWidth <= 767;

    let maxHeight = 0;
    slides.forEach((slide) => {
      const img = isSP
        ? slide.querySelector(".slide-sp")
        : slide.querySelector(".slide-pc");
      if (img && img.clientHeight > maxHeight) maxHeight = img.clientHeight;
    });

    mainVisual.style.height = maxHeight + "px";

    // wave を main-visual 下に配置して少し重ねる
    const waveContainer = document.querySelector(".main-visual-wave");
    const wave = waveContainer ? waveContainer.querySelector("img") : null;

    if (wave && waveContainer) {
      waveContainer.style.position = "relative";
      waveContainer.style.width = "100%";

      // 上に少し重ねる場合は margin-top
      const overlap = 0.7; // 70% wave の高さ分だけ main-visual に被せる
      waveContainer.style.marginTop = `-${wave.clientHeight * overlap}px`;
    }
  }

  // 画像ロード後に初期化
  function initMainVisual() {
    const allImages = document.querySelectorAll(".main-visual img");
    let loadedCount = 0;

    allImages.forEach((img) => {
      if (img.complete) loadedCount++;
      else
        img.addEventListener("load", () => {
          loadedCount++;
          if (loadedCount === allImages.length) {
            updateTextPosition();
            adjustMainVisualHeight();
          }
        });
    });

    if (loadedCount === allImages.length) {
      updateTextPosition();
      adjustMainVisualHeight();
    }
  }

  // 初期化
  window.addEventListener("load", () => {
    initMainVisual();
    setInterval(showNextSlide, 5000); // 5秒ごと切替
  });

  window.addEventListener("resize", () => {
    updateTextPosition();
    adjustMainVisualHeight();
  });
}
