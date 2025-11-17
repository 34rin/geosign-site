/* スライドショー */
function initTopVisual() {
  const slides = document.querySelectorAll(".slide");
  if (!slides.length) return;

  let current = 0;

  /* -----------------------------------
     初期スライドの表示（即表示）
  ----------------------------------- */
  slides.forEach((s, i) => {
    s.style.opacity = i === 0 ? "1" : "0";
    s.style.zIndex = i === 0 ? "1" : "0";
  });

  /* -----------------------------------
     スライド切替
  ----------------------------------- */
  function showNextSlide() {
    slides[current].style.opacity = "0";
    slides[current].style.zIndex = "0";

    current = (current + 1) % slides.length;

    slides[current].style.opacity = "1";
    slides[current].style.zIndex = "1";

    updateTextPosition();
  }

  /* -----------------------------------
     文字の Y 位置調整
  ----------------------------------- */
  function updateTextPosition() {
    const isSP = window.innerWidth <= 767;

    slides.forEach((slide) => {
      const img = isSP
        ? slide.querySelector(".slide-sp")
        : slide.querySelector(".slide-pc");

      const box = slide.querySelector(".content-box");
      if (!img || !box) return;

      // 高さが取れないとレイアウトが決まらない
      const h = img.clientHeight || img.naturalHeight;
      if (!h) return;

      // スライドごとの割合調整
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

  /* -----------------------------------
     メインビジュアルの高さ計算
  ----------------------------------- */
  function adjustMainVisualHeight() {
    const main = document.querySelector(".main-visual");
    if (!main) return;

    const isSP = window.innerWidth <= 767;
    let maxH = 0;

    slides.forEach((slide) => {
      const img = isSP
        ? slide.querySelector(".slide-sp")
        : slide.querySelector(".slide-pc");

      if (!img) return;

      const h = img.clientHeight || img.naturalHeight;
      if (h) maxH = Math.max(maxH, h);
    });

    // 画像がまだ取れない時用のフォールバック
    if (!maxH || maxH < 200) {
      maxH = 520; // 最低高さ
    }

    main.style.height = maxH + "px";

    // waveの位置調整
    const wave = document.querySelector(".main-visual-wave img");
    if (wave) {
      const waveH = wave.clientHeight || 0;
      wave.parentElement.style.marginTop = `-${waveH * 0.7}px`;
      wave.parentElement.style.width = "100%";
    }
  }

  /* -----------------------------------
     初期画像ロード：最初の1枚だけ見る
     → 初期表示が遅い問題を解決！
  ----------------------------------- */
  function initImages() {
    const isSP = window.innerWidth <= 767;
    const firstSlide = slides[0];

    const firstImg = isSP
      ? firstSlide.querySelector(".slide-sp")
      : firstSlide.querySelector(".slide-pc");

    let initialized = false;

    function run() {
      if (initialized) return;
      initialized = true;
      updateTextPosition();
      adjustMainVisualHeight();
    }

    // 既にロード済みなら即実行
    if (firstImg && firstImg.complete && firstImg.naturalHeight) {
      run();
    } else if (firstImg) {
      firstImg.addEventListener("load", run);
      firstImg.addEventListener("error", run);
    }

    // フォールバック（超重要）
    setTimeout(run, 300);
  }

  /* -----------------------------------
     実行
  ----------------------------------- */
  initImages();
  setInterval(showNextSlide, 5000);

  // リサイズ対応
  window.addEventListener("resize", () => {
    updateTextPosition();
    adjustMainVisualHeight();
  });
}
