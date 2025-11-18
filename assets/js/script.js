/* テスト */
// console.log('JSファイル読み込まれました');

(function () {
  // ===== ヘッダー関連の初期化 =====
  function initHeader() {
    const hamburgermenu = document.getElementById("hamburgermenu");
    const hamburgermenunav = document.getElementById("hamburgermenunav");

    if (hamburgermenu && hamburgermenunav) {
      // 重複してイベントが付かないよう、既存ハンドラを一度クリア（簡易的に）
      hamburgermenu.replaceWith(hamburgermenu.cloneNode(true));
      const newHamburger = document.getElementById("hamburgermenu");

      newHamburger.addEventListener("click", () => {
        newHamburger.classList.toggle("active");
        hamburgermenunav.classList.toggle("active");
      });
    }

    // プルダウンメニュー（header内）
    const pdms = document.querySelectorAll(".pull-down-menu");
    pdms.forEach((menu) => {
      // 既にイベント付与済みの場合はスキップされるように属性で判定
      if (menu.dataset.pdmInit) return;
      menu.dataset.pdmInit = "1";

      menu.addEventListener("click", (e) => {
        e.stopPropagation();

        const nextLi = menu.nextElementSibling;
        const submenu = nextLi?.querySelector(".sub-menu");
        if (!submenu) return;

        const isOpen = menu.classList.toggle("open");
        submenu.style.display = isOpen ? "inline-block" : "none";
      });
    });

    // footer 側のプルダウン（.afi-nav-pdm > span）
    const afiSpans = document.querySelectorAll(".afi-nav-pdm > span");
    afiSpans.forEach((menu) => {
      if (menu.dataset.afiInit) return;
      menu.dataset.afiInit = "1";

      menu.addEventListener("click", (e) => {
        e.stopPropagation();
        const submenu = menu.parentElement.querySelector(".afi-nav-sm");
        if (!submenu) return;
        const isOpen = menu.classList.toggle("open");
        submenu.style.display = isOpen ? "inline-block" : "none";
      });
    });
  }

  // ヘッダー要素が後から挿入されるケースに対応する監視
  function watchHeaderInsertion() {
    const headerContainer = document.getElementById("header");
    if (!headerContainer) return;

    // 既にヘッダーがある場合は即初期化
    if (headerContainer.querySelector(".all-header")) {
      initHeader();
      return;
    }

    const observer = new MutationObserver((mutations, obs) => {
      for (const m of mutations) {
        if (m.addedNodes && m.addedNodes.length) {
          // headerが挿入されたら初期化して監視終了
          if (headerContainer.querySelector(".all-header")) {
            initHeader();
            obs.disconnect();
            return;
          }
        }
      }
    });

    observer.observe(headerContainer, { childList: true });
  }

  // ===== スライドショー（トップページ限定） =====
  let slideIntervalId = null;
  function isTopPage() {
    const p = location.pathname;
    // 「index」を含む or 末尾が / のパスはトップとみなす
    return p.includes("index") || p.endsWith("/");
  }

  function initMainVisual() {
    const slides = document.querySelectorAll(".slide");
    if (!slides || slides.length === 0) return;

    let current = 0;

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

    function showNextSlide() {
      slides.forEach((s) => s.classList.remove("active"));
      current = (current + 1) % slides.length;
      slides[current].classList.add("active");
      updateTextPosition();
    }

    function startInterval() {
      if (slideIntervalId) return; // 既に動いていれば何もしない
      slideIntervalId = setInterval(showNextSlide, 5000);
    }

    // 画像の読み込みを待つ
    const allImages = document.querySelectorAll(".main-visual img");
    let loadedCount = 0;
    if (allImages.length === 0) {
      // 画像が無ければ即初期化
      updateTextPosition();
      adjustMainVisualHeight();
      startInterval();
      return;
    }

    allImages.forEach((img) => {
      if (img.complete) {
        loadedCount++;
      } else {
        img.addEventListener("load", () => {
          loadedCount++;
          if (loadedCount === allImages.length) {
            updateTextPosition();
            adjustMainVisualHeight();
            startInterval();
          }
        });
        // エラーでもカウントして進める（ネットワーク障害対策）
        img.addEventListener("error", () => {
          loadedCount++;
          if (loadedCount === allImages.length) {
            updateTextPosition();
            adjustMainVisualHeight();
            startInterval();
          }
        });
      }
    });

    if (loadedCount === allImages.length) {
      updateTextPosition();
      adjustMainVisualHeight();
      startInterval();
    }

    // リサイズ時の処理
    window.addEventListener("resize", () => {
      updateTextPosition();
      adjustMainVisualHeight();
    });
  }

  // ===== 起動タイミング =====
  window.addEventListener("load", () => {
    // ヘッダーが後から来る可能性に備えて監視＆即時初期化トライ
    watchHeaderInsertion();
    initHeader(); // 既にある場合はここで初期化される

    // トップページ判定してスライド初期化
    if (isTopPage()) {
      initMainVisual();
    }
  });

  // ページによっては DOMContentLoaded の時点で header が既にあるかもなので一応実行
  document.addEventListener("DOMContentLoaded", () => {
    initHeader();
  });
})();
